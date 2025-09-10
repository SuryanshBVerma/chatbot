/**
 * Convert a MediaRecorder Blob (WebM/Opus) into a proper PCM WAV Blob.
 * @param webmBlob - The Blob recorded from MediaRecorder (usually WebM/Opus).
 * @returns WAV Blob
 */
export async function convertToWav(webmBlob: Blob): Promise<Blob> {
  const arrayBuffer = await webmBlob.arrayBuffer()
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)

  return encodeWav(audioBuffer)
}

/**
 * Encode an AudioBuffer into a WAV Blob.
 * @param audioBuffer - Decoded PCM audio.
 * @returns WAV Blob
 */
function encodeWav(audioBuffer: AudioBuffer): Blob {
  const numChannels = audioBuffer.numberOfChannels
  const sampleRate = audioBuffer.sampleRate
  const format = 1 // PCM
  const bitDepth = 16

  let interleaved: Float32Array
  if (numChannels === 2) {
    interleaved = interleave(audioBuffer.getChannelData(0), audioBuffer.getChannelData(1))
  } else {
    interleaved = audioBuffer.getChannelData(0)
  }

  const buffer = new ArrayBuffer(44 + interleaved.length * 2)
  const view = new DataView(buffer)

  /* RIFF identifier */
  writeString(view, 0, "RIFF")
  /* RIFF chunk length */
  view.setUint32(4, 36 + interleaved.length * 2, true)
  /* RIFF type */
  writeString(view, 8, "WAVE")
  /* format chunk identifier */
  writeString(view, 12, "fmt ")
  /* format chunk length */
  view.setUint32(16, 16, true)
  /* sample format (raw PCM) */
  view.setUint16(20, format, true)
  /* channel count */
  view.setUint16(22, numChannels, true)
  /* sample rate */
  view.setUint32(24, sampleRate, true)
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true)
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, numChannels * (bitDepth / 8), true)
  /* bits per sample */
  view.setUint16(34, bitDepth, true)
  /* data chunk identifier */
  writeString(view, 36, "data")
  /* data chunk length */
  view.setUint32(40, interleaved.length * 2, true)

  floatTo16BitPCM(view, 44, interleaved)

  return new Blob([view], { type: "audio/wav" })
}

/**
 * Interleave two channels (stereo).
 */
function interleave(left: Float32Array, right: Float32Array): Float32Array {
  const length = left.length + right.length
  const result = new Float32Array(length)

  let inputIndex = 0
  for (let i = 0; i < length;) {
    result[i++] = left[inputIndex]
    result[i++] = right[inputIndex]
    inputIndex++
  }
  return result
}

/**
 * Write a string into the DataView.
 */
function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}

/**
 * Convert float32 PCM samples to 16-bit PCM.
 */
function floatTo16BitPCM(view: DataView, offset: number, input: Float32Array) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
}
