import { useState, forwardRef, useImperativeHandle, useRef } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../stores/store"
import { Pencil, RefreshCw, Check, X, Square, Volume2, Copy } from "lucide-react"
import Message from "./Message"
import Composer from "./Composer"
import { cls, timeAgo } from "./utils"
import Markdown from 'react-markdown'
import { Switch } from "./ui/switch"
import { toast } from "react-toastify"

function ThinkingMessage({ onPause }) {
  return (
    <Message role="assistant">
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></div>
        </div>
        <span className="text-xs text-zinc-500">AI is thinking...</span>
      </div>
    </Message>
  )
}

const ChatPane = forwardRef(function ChatPane(
  { onSend, onEditMessage, onResendMessage, isThinking, onPauseThinking, lang = "eng" },
  ref,
) {
  // Load current conversation from Redux
  const conversation = useSelector((state: RootState) => state.conversation.current)
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState("")
  const [busy, setBusy] = useState(false)
  const [langSwitch, setLangSwitch] = useState("eng")
  const composerRef = useRef(null)

  useImperativeHandle(
    ref,
    () => ({
      insertTemplate: (templateContent) => {
        composerRef.current?.insertTemplate(templateContent)
      },
    }),
    [],
  )

  if (!conversation) return null

  const tags = ["Certified", "Personalized", "Experienced", "Helpful"]
  const messages = Array.isArray(conversation.messages) ? conversation.messages : []
  const count = messages.length || conversation.messageCount || 0

  function startEdit(m) {
    setEditingId(m.id)
    setDraft(m.content)
  }
  function cancelEdit() {
    setEditingId(null)
    setDraft("")
  }
  function saveEdit() {
    if (!editingId) return
    onEditMessage?.(editingId, draft)
    cancelEdit()
  }
  function saveAndResend() {
    if (!editingId) return
    onEditMessage?.(editingId, draft)
    onResendMessage?.(editingId)
    cancelEdit()
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mb-2 text-3xl font-serif tracking-tight sm:text-4xl md:text-5xl">
          <span className="block leading-[1.05] font-sans text-2xl">{conversation.title}</span>
        </div>
        <div className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
          Updated {timeAgo(conversation.updatedAt)} · {count} messages
        </div>

        {/* Language Switch */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm font-medium">ENG</span>
          <Switch
            checked={langSwitch === "kan"}
            onCheckedChange={(checked) => {
              const value = checked ? "kan" : "eng";
              setLangSwitch(value);
            }}
            id="lang-switch"
          />
          <span className="text-sm font-medium">KAN</span>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 border-b border-zinc-200 pb-5 dark:border-zinc-800" />

        {messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No messages yet. Say hello to start.
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div key={m.id} className="space-y-2">
                {editingId === m.id ? (
                  <div className={cls("rounded-2xl border p-2", "border-zinc-200 dark:border-zinc-800")}>
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className="w-full resize-y rounded-xl bg-transparent p-2 text-sm outline-none"
                      rows={3}
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={saveEdit}
                        className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-3 py-1.5 text-xs text-white dark:bg-white dark:text-zinc-900"
                      >
                        <Check className="h-3.5 w-3.5" /> Save
                      </button>
                      <button
                        onClick={saveAndResend}
                        className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Save & Resend
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Message role={m.role}>
                      <div className="whitespace-pre-wrap">
                        <Markdown>
                          {
                            langSwitch === "eng" ? (
                              m.content_eng ? m.content_eng : m.content_kan
                            ) : (
                              m.content_kan ? m.content_kan : m.content_eng
                            )
                          }
                        </Markdown>
                      </div>
                      {m.role === "assistant" && (
                        <div className="mt-1 flex gap-2 text-[11px] text-zinc-500">
                          <button
                            className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                            onClick={() => {
                              if (window.speechSynthesis && m.content_eng) {
                                // Remove emojis and non-text characters
                                const textOnly = m.content_eng.replace(/[\p{Emoji}\p{Extended_Pictographic}]/gu, "").replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, "");
                                const utterance = new window.SpeechSynthesisUtterance(textOnly);
                                utterance.pitch = 1;
                                utterance.rate = 1;
                                utterance.volume = 1;
                                window.speechSynthesis.speak(utterance);
                              }
                            }}
                          >
                            <Volume2 className="h-4 w-4" />
                          </button>
                          <button
                            className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                            onClick={() => {
                              if (langSwitch === "eng" && m.content_eng) {
                                const textOnly = m.content_eng.replace(/[\p{Emoji}\p{Extended_Pictographic}]/gu, "").replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, "");
                                navigator.clipboard.writeText(textOnly)
                                  .then(() => {
                                    toast.success("Text Copied!")
                                  })
                                  .catch(() => { /* Optionally handle error */ });
                              } else {
                                navigator.clipboard.writeText(m.content_kan)
                                  .then(() => {
                                    toast.success("Text Copied!")
                                  })
                                  .catch(() => { /* Optionally handle error */ });
                              }
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      {m.role === "user" && (
                        // <div className="mt-1 flex gap-2 text-[11px] text-zinc-500">
                        //   <button className="inline-flex items-center gap-1 hover:underline" onClick={() => startEdit(m)}>
                        //     <Pencil className="h-3.5 w-3.5" /> Edit
                        //   </button>
                        //   <button
                        //     className="inline-flex items-center gap-1 hover:underline"
                        //     onClick={() => onResendMessage?.(m.id)}
                        //   >
                        //     <RefreshCw className="h-3.5 w-3.5" /> Resend
                        //   </button>
                        // </div>
                        <button
                          className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                          onClick={() => {

                            if (langSwitch === "eng" && m.content_eng) {
                              const textOnly = m.content_eng.replace(/[\p{Emoji}\p{Extended_Pictographic}]/gu, "").replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, "");
                              navigator.clipboard.writeText(textOnly)
                                .then(() => {
                                  toast.success("Text Copied!")
                                })
                                .catch(() => { /* Optionally handle error */ });
                            } else {
                              navigator.clipboard.writeText(m.content_kan)
                                .then(() => {
                                  toast.success("Text Copied!")
                                })
                                .catch(() => { /* Optionally handle error */ });
                            }
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      )}
                    </Message>

                  </>
                )}
              </div>
            ))}
            {isThinking && <ThinkingMessage onPause={onPauseThinking} />}
          </>
        )}
      </div>

      <Composer
        ref={composerRef}
        onSend={async (text) => {
          if (!text.trim()) return
          setBusy(true)
          await onSend?.(text)
          setBusy(false)
        }}
        busy={busy}
      />
    </div>
  )
})

export default ChatPane
