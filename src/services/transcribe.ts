import { convertToWav } from "../utils/audioUtils"

const TRANSCRIPTION_URL = import.meta.env.VITE_TRANSCRIPTION_URL

export async function transcribeAudio(webmBlob: Blob): Promise<string> {
	const wavBlob = await convertToWav(webmBlob)
	const file = new File([wavBlob], "recording.wav", { type: "audio/wav" })
	const formData = new FormData()
	formData.append("audio", file)
	const res = await fetch(TRANSCRIPTION_URL, {
		method: "POST",
		body: formData,
	})
	if (!res.ok) throw new Error("Transcription failed")
	const data = await res.json()
	return data.transcription || ""
}
