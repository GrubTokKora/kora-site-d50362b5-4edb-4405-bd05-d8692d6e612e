import { useEffect, useMemo, useRef, useState } from 'react';
import { Mic, Bot, X, Loader } from 'lucide-react';
import { createVoiceSession } from '../voice';

type Sender = 'user' | 'agent';
type Message = { sender: Sender; text: string };
type WidgetStatus = 'idle' | 'loading' | 'connected' | 'error';

type VoiceSessionBootstrap = {
  websocket_url: string;
  client_secret: string;
  expires_at?: number | null;
  session?: Record<string, unknown>;
};

function isVoiceFeatureEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const v = (window as any).KORA_CONFIG?.features?.voice as unknown;
  return Boolean(
    v &&
      typeof v === 'object' &&
      (v as { enabled?: boolean }).enabled === true,
  );
}

declare global {
  interface Window {
    KORA_CONFIG?: {
      apiBaseUrl?: string;
      features?: {
        voice?: {
          enabled?: boolean;
          provider?: string;
        };
      };
    };
  }
}

function base64FromInt16LE(pcm16: Int16Array): string {
  const bytes = new Uint8Array(pcm16.buffer);
  const chunkSize = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function int16FromBase64PCM16(b64: string): Int16Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Int16Array(bytes.buffer);
}

function float32FromPCM16(pcm16: Int16Array): Float32Array {
  const out = new Float32Array(pcm16.length);
  for (let i = 0; i < pcm16.length; i++) out[i] = pcm16[i] / 32768.0;
  return out;
}

export default function VoiceAgentWidget() {
  const visible = useMemo(() => isVoiceFeatureEnabled(), []);

  const [status, setStatus] = useState<WidgetStatus>('idle');
  const [errorText, setErrorText] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const assistantDraftRef = useRef<string>('');
  const isSessionReadyRef = useRef<boolean>(false);
  const pendingAudioRef = useRef<string[]>([]);
  const lastUserItemIdRef = useRef<string>('');

  const locale = useMemo(() => (typeof navigator !== 'undefined' ? navigator.language : 'en-US'), []);

  function stopMicrophone() {
    processorRef.current?.disconnect();
    processorRef.current = null;
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;
  }

  function stop() {
    wsRef.current?.close();
    wsRef.current = null;
    processorRef.current?.disconnect();
    processorRef.current = null;
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;
    audioCtxRef.current?.close();
    audioCtxRef.current = null;

    isSessionReadyRef.current = false;
    pendingAudioRef.current = [];
    assistantDraftRef.current = '';
    lastUserItemIdRef.current = '';
    nextStartTimeRef.current = 0;

    setStatus('idle');
  }

  function appendUserTranscript(text: string, itemId?: string) {
    const t = (text || '').trim();
    if (!t) return;
    if (itemId && itemId === lastUserItemIdRef.current) return;
    if (itemId) lastUserItemIdRef.current = itemId;
    setMessages((prev) => [...prev, { sender: 'user', text: t }]);
  }

  async function start() {
    if (status === 'loading') return;
    setStatus('loading');
    setErrorText('');
    setMessages([]);
    assistantDraftRef.current = '';

    try {
      const bootstrap = (await createVoiceSession(locale, {
        url: window.location.href,
        title: document.title,
      })) as VoiceSessionBootstrap;

      const websocketUrl = bootstrap.websocket_url;
      const clientSecret = bootstrap.client_secret;

      if (!websocketUrl || !clientSecret) {
        throw new Error('Voice session missing websocket_url/client_secret');
      }

      const ws = new WebSocket(websocketUrl, [`xai-client-secret.${clientSecret}`]);
      wsRef.current = ws;
      isSessionReadyRef.current = false;
      pendingAudioRef.current = [];

      ws.onopen = async () => {
        const sessionObj = (bootstrap.session || {});
        ws.send(JSON.stringify({ type: 'session.update', session: sessionObj }));
      };

      ws.onmessage = (ev) => {
        try {
          const event = JSON.parse(ev.data);
          handleRealtimeEvent(event);
        } catch {}
      };

      ws.onerror = () => {
        setStatus('error');
        setErrorText('Voice connection failed.');
      };

      ws.onclose = () => {
        stopMicrophone();
        wsRef.current = null;
        isSessionReadyRef.current = false;
        pendingAudioRef.current = [];
        assistantDraftRef.current = '';
        setStatus((s) => (s === 'error' ? s : 'idle'));
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus('error');
      setErrorText(msg || 'Could not start voice session.');
    }
  }

  async function startMicAndStream(ws: WebSocket) {
    const sampleRate = 24000;
    const ctx = new AudioContext({ sampleRate });
    audioCtxRef.current = ctx;
    nextStartTimeRef.current = ctx.currentTime;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micStreamRef.current = stream;

    const source = ctx.createMediaStreamSource(stream);
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    const gain = ctx.createGain();
    gain.gain.value = 0;
    processor.connect(gain);
    gain.connect(ctx.destination);

    processor.onaudioprocess = (e) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      const input = e.inputBuffer.getChannelData(0);
      const pcm16 = new Int16Array(input.length);
      for (let i = 0; i < input.length; i++) {
        const s = Math.max(-1, Math.min(1, input[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      const b64 = base64FromInt16LE(pcm16);
      if (!isSessionReadyRef.current) {
        pendingAudioRef.current.push(b64);
        if (pendingAudioRef.current.length > 80) pendingAudioRef.current.shift();
        return;
      }
      ws.send(JSON.stringify({ type: 'input_audio_buffer.append', audio: b64 }));
    };

    source.connect(processor);
  }

  function playPCM16Audio(base64Pcm16: string) {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const pcm16 = int16FromBase64PCM16(base64Pcm16);
    const float32 = float32FromPCM16(pcm16);

    const buffer = ctx.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const startAt = Math.max(ctx.currentTime, nextStartTimeRef.current);
    source.start(startAt);

    nextStartTimeRef.current = startAt + buffer.duration;
  }

  function handleRealtimeEvent(event: any) {
    if (!event?.type) return;

    if (event.type === 'session.updated') {
      isSessionReadyRef.current = true;
      setStatus('connected');
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        for (const b64 of pendingAudioRef.current) {
          ws.send(JSON.stringify({ type: 'input_audio_buffer.append', audio: b64 }));
        }
        pendingAudioRef.current = [];
      }
      void startMicAndStream(wsRef.current as WebSocket);
      return;
    }

    if (event.type === 'conversation.item.input_audio_transcription.completed') {
      appendUserTranscript(event.transcript, event.item_id);
      return;
    }
    if (event.type === 'conversation.item.added') {
      const item = event.item;
      if (item?.role === 'user' && Array.isArray(item?.content)) {
        const audioPart = item.content.find((c: any) => c?.type === 'input_audio' && typeof c?.transcript === 'string');
        if (audioPart?.transcript) appendUserTranscript(audioPart.transcript, item?.id);
      }
      return;
    }

    if (event.type === 'response.output_audio.delta') {
      if (event.delta) playPCM16Audio(event.delta);
      return;
    }

    if (event.type === 'response.output_audio_transcript.delta') {
      const d = event.delta;
      if (typeof d === 'string') assistantDraftRef.current += d;
      return;
    }

    if (event.type === 'response.output_audio_transcript.done') {
      const text = assistantDraftRef.current.trim();
      if (text) setMessages((prev) => [...prev, { sender: 'agent', text }]);
      assistantDraftRef.current = '';
      return;
    }

    if (event.type === 'input_audio_buffer.speech_stopped') {
      try {
        const ws = wsRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'response.create', response: { modalities: ['text', 'audio'] } }));
        }
      } catch {}
      return;
    }

    if (event.type === 'error') {
      setStatus('error');
      setErrorText(event?.error?.message || 'Voice agent error.');
      return;
    }
  }

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <button
        onClick={() => {
          setIsOpen((v) => {
            const next = !v;
            if (!next) stop();
            return next;
          });
          if (!isOpen && wsRef.current == null && status !== 'connected') start();
        }}
        className="voice-agent-fab"
        aria-label="Open Voice Assistant"
      >
        <Bot style={{ width: '32px', height: '32px' }} />
      </button>

      {isOpen && (
        <div
          className="voice-agent-overlay"
          onClick={() => {
            setIsOpen(false);
            stop();
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="voice-agent-modal"
          >
            <header className="voice-agent-header">
              <div className="voice-agent-header-title">
                <Bot style={{ width: '24px', height: '24px' }} />
                <h2>Voice Assistant</h2>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  stop();
                }}
                className="voice-agent-close-button"
                aria-label="Close voice assistant"
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </header>

            <div className="voice-agent-messages">
              {messages.map((m, idx) => (
                <div key={idx} className={`voice-agent-message-wrapper ${m.sender === 'user' ? 'user' : 'agent'}`}>
                  {m.sender === 'agent' ? (
                    <div className="voice-agent-avatar">
                      <Bot style={{ width: '20px', height: '20px' }} />
                    </div>
                  ) : null}
                  <div className="voice-agent-message-bubble">
                    <p>{m.text}</p>
                  </div>
                </div>
              ))}

              {status === 'loading' ? <div className="voice-agent-status-text">Connecting...</div> : null}
              {status === 'error' && errorText ? (
                <div className="voice-agent-error-box">{errorText}</div>
              ) : null}
            </div>

            <footer className="voice-agent-footer">
              <button
                onClick={() => start()}
                disabled={status === 'loading'}
                className="voice-agent-mic-button"
              >
                {status === 'loading' ? <Loader style={{ width: '32px', height: '32px' }} className="voice-agent-spinner" /> : <Mic style={{ width: '32px', height: '32px' }} />}
              </button>
              <p className="voice-agent-footer-text">
                {status === 'connected' ? 'Listening...' : status === 'error' ? 'Connection failed' : 'Tap to start'}
              </p>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}