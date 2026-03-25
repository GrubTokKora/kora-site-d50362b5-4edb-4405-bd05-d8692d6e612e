import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import { useKoraConfig } from '../hooks/useKoraConfig';
import { processAudioBuffer } from '../lib/audioUtils';

type VoiceAgentWidgetProps = {
  businessId: string;
};

type SessionStatus = 'idle' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'error';

const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
    <path d="M17 11h-1c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92z" />
  </svg>
);

const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 6h12v12H6z" />
  </svg>
);

const VoiceAgentWidget: FC<VoiceAgentWidgetProps> = ({ businessId }) => {
  const config = useKoraConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef<boolean>(false);
  
  const isVoiceEnabled = config.features.voice.enabled;

  const startSession = async () => {
    if (status !== 'idle' && status !== 'error') return;
    
    setStatus('connecting');
    setErrorMessage(null);
    setTranscript('');
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    try {
      const response = await fetch(`${config.apiBaseUrl}/api/v1/public/voice/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id: businessId }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to start voice session.');
      }

      const data = await response.json();
      const { websocket_url, client_secret, session } = data;

      const socket = new WebSocket(websocket_url, [`xai-client-secret.${client_secret}`]);
      socketRef.current = socket;

      socket.onopen = () => {
        socket.send(JSON.stringify({ type: 'session.update', session }));
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'session.updated') {
          setStatus('connected');
          startMicrophone();
        } else if (message.type === 'response.output_audio.delta' && message.audio) {
            const audioChunk = Uint8Array.from(atob(message.audio), c => c.charCodeAt(0)).buffer;
            audioQueueRef.current.push(audioChunk);
            playAudioQueue();
        } else if (message.type === 'response.output_audio_transcript.delta') {
            setTranscript(prev => prev + message.transcript);
        } else if (message.type === 'error') {
            setErrorMessage(message.message || 'An unknown error occurred.');
            setStatus('error');
        }
      };

      socket.onerror = () => {
        setErrorMessage('WebSocket connection error.');
        setStatus('error');
      };

      socket.onclose = () => {
        if (status !== 'idle') {
          stopSession(false);
        }
      };

    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to connect.');
      setStatus('error');
    }
  };

  const stopSession = (closeSocket = true) => {
    if (closeSocket && socketRef.current) {
      socketRef.current.close();
    }
    socketRef.current = null;
    stopMicrophone();
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    audioContextRef.current = null;
    setStatus('idle');
  };

  const startMicrophone = async () => {
    const context = audioContextRef.current;
    if (!context) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          const audioBase64 = processAudioBuffer(e.inputBuffer);
          socketRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: audioBase64,
          }));
        }
      };

      source.connect(processor);
      processor.connect(context.destination);
      setStatus('listening');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setErrorMessage('Microphone access denied.');
      setStatus('error');
    }
  };

  const stopMicrophone = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
  };

  const playAudioQueue = async () => {
    const context = audioContextRef.current;
    if (isPlayingRef.current || audioQueueRef.current.length === 0 || !context || context.state === 'closed') {
      return;
    }
    isPlayingRef.current = true;
    setStatus('speaking');

    while (audioQueueRef.current.length > 0) {
      const audioData = audioQueueRef.current.shift();
      if (audioData) {
        try {
          const audioBuffer = await context.decodeAudioData(audioData);
          const source = context.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(context.destination);
          
          await new Promise<void>(resolve => {
            source.onended = () => resolve();
            source.start();
          });

        } catch (e) {
          console.error('Error decoding or playing audio:', e);
        }
      }
    }
    
    isPlayingRef.current = false;
    if (status === 'speaking') {
        setStatus('listening');
    }
  };

  const handleFabClick = () => {
    setIsOpen(true);
    startSession();
  };

  const handleClose = () => {
    setIsOpen(false);
    stopSession();
  };

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  if (!isVoiceEnabled) {
    return null;
  }

  const getStatusText = () => {
    switch (status) {
      case 'connecting': return 'Connecting...';
      case 'connected': return 'Connected. Listening...';
      case 'listening': return 'Listening...';
      case 'speaking': return '...';
      case 'error': return errorMessage || 'An error occurred.';
      default: return 'Press the button to start.';
    }
  };

  return (
    <>
      <button className="voice-widget-fab" onClick={handleFabClick} aria-label="Start Voice Assistant">
        <MicIcon />
      </button>

      <div className={`voice-widget-modal-overlay ${isOpen ? 'open' : ''}`} onClick={handleClose}>
        <div className="voice-widget-modal" onClick={(e) => e.stopPropagation()}>
          <div className="voice-widget-header">
            <h3>Voice Assistant</h3>
            <button className="voice-widget-close-btn" onClick={handleClose}>&times;</button>
          </div>
          <div className="voice-widget-transcript">
            <p>{transcript || "Hello! How can I help you today?"}</p>
          </div>
          <div className="voice-widget-footer">
            <div className="voice-widget-status">{getStatusText()}</div>
            <button 
              className={`voice-widget-mic-btn ${status === 'listening' || status === 'speaking' ? 'active' : ''}`}
              onClick={handleClose}
              title="End Session"
            >
              <StopIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoiceAgentWidget;