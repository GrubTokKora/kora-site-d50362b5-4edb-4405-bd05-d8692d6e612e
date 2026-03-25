// Helper function to convert float32 PCM to 16-bit integer PCM
function floatTo16BitPCM(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return output;
}

// Helper function to encode PCM data to Base64
export function pcm16BitToBase64(pcmData: Int16Array): string {
  const bytes = new Uint8Array(pcmData.buffer);
  
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function processAudioBuffer(buffer: AudioBuffer): string {
  // Using mono channel (channel 0)
  const pcmFloat32 = buffer.getChannelData(0);
  const pcm16Bit = floatTo16BitPCM(pcmFloat32);
  return pcm16BitToBase64(pcm16Bit);
}