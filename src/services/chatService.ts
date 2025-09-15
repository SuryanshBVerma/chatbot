

const VITE_CONVERSATIONAL_URL = import.meta.env.VITE_CONVERSATIONAL_URL

export async function ChatResponseService(payload) {
  const response = await fetch(VITE_CONVERSATIONAL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error("Failed to fetch chat response")
  }
  return response.json()
}
