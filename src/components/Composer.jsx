import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react"
import { Send, Loader2, Plus, Mic, Square } from "lucide-react"
import ComposerActionsPopover from "./ComposerActionsPopover"
import { cls } from "./utils"

import { convertToWav } from "../utils/audioUtils"
import { transcribeAudio } from "../services/transcribe"




const Composer = forwardRef(function Composer({ onSend, busy }, ref) {
  const [value, setValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [recordingError, setRecordingError] = useState("")
  const audioChunksRef = useRef([])
  // Voice recording handlers
  async function startRecording() {
    setRecordingError("")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new window.MediaRecorder(stream)
      audioChunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      recorder.onstop = async () => {
        setIsTranscribing(true);

        const webmBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        // setAudioBlob(webmBlob)
        // Call API via service
        try {
          const transcription = await transcribeAudio(webmBlob)
          setValue(transcription)
        } catch (err) {
          setRecordingError("Transcription failed.")
        } finally {
          setIsTranscribing(false)
        }
      }
      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (err) {
      setRecordingError("Could not access microphone.")
    }
  }

  function stopRecording() {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
  }
  const [sending, setSending] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [lineCount, setLineCount] = useState(1)
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      const textarea = inputRef.current
      const lineHeight = 20 // Approximate line height in pixels
      const minHeight = 40

      // Reset height to calculate scroll height
      textarea.style.height = "auto"
      const scrollHeight = textarea.scrollHeight
      const calculatedLines = Math.max(1, Math.floor((scrollHeight - 16) / lineHeight)) // 16px for padding

      setLineCount(calculatedLines)

      if (calculatedLines <= 12) {
        // Auto-expand for 1-12 lines
        textarea.style.height = `${Math.max(minHeight, scrollHeight)}px`
        textarea.style.overflowY = "hidden"
      } else {
        // Fixed height with scroll for 12+ lines
        textarea.style.height = `${minHeight + 11 * lineHeight}px` // 12 lines total
        textarea.style.overflowY = "auto"
      }
    }
  }, [value])

  useImperativeHandle(
    ref,
    () => ({
      insertTemplate: (templateContent) => {
        setValue((prev) => {
          const newValue = prev ? `${prev}\n\n${templateContent}` : templateContent
          setTimeout(() => {
            inputRef.current?.focus()
            const length = newValue.length
            inputRef.current?.setSelectionRange(length, length)
          }, 0)
          return newValue
        })
      },
      focus: () => {
        inputRef.current?.focus()
      },
    }),
    [],
  )

  async function handleSend() {
    if (!value.trim() || sending) return
    setSending(true)
    try {
      await onSend?.(value)
      setValue("")
      inputRef.current?.focus()
    } finally {
      setSending(false)
    }
  }

  const hasContent = value.length > 0

  return (
    <div className="border-t border-zinc-200/60 p-4 dark:border-zinc-800">
      <div
        className={cls(
          "mx-auto flex flex-col rounded-2xl border bg-white shadow-sm dark:bg-zinc-950 transition-all duration-200",
          "max-w-3xl border-zinc-300 dark:border-zinc-700 p-3",
        )}
      >
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="How can I help you today?"
            rows={1}
            className={cls(
              "w-full resize-none bg-transparent text-sm outline-none placeholder:text-zinc-400 transition-all duration-200",
              "px-0 py-2 min-h-[40px] text-left",
            )}
            style={{
              height: "auto",
              overflowY: lineCount > 12 ? "auto" : "hidden",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
        </div>

        <div className="flex items-center justify-end mt-2">
          {/* <ComposerActionsPopover>
            <button
              className="inline-flex shrink-0 items-center justify-center rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
              title="Add attachment"
            >
              <Plus className="h-4 w-4" />
            </button>
          </ComposerActionsPopover> */}

          <div className="flex items-center gap-1 shrink-0">
            {isTranscribing ? (
              <button
                className="inline-flex items-center justify-center rounded-full p-2 text-blue-500 transition-colors cursor-wait border border-blue-900"
                title="Transcribing..."
                disabled
              >
                <Loader2 className="h-4 w-4 animate-spin" />
              </button>
            ) : isRecording ? (
              <button
                className="inline-flex gap-1 items-center justify-center rounded-full p-2 text-red-500 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-800 dark:hover:text-red-300 transition-colors border border-red-900 text-xs"
                title="Stop recording"
                onClick={stopRecording}
              >
                <Square className="h-3 w-3" />
              </button>
            ) : (
              <button
                className="inline-flex items-center justify-center rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
                title="Voice input"
                onClick={startRecording}
              >
                <Mic className="h-4 w-4" />
              </button>
            )}


            <button
              onClick={handleSend}
              disabled={sending || busy || !value.trim()}
              className={cls(
                "inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-white dark:text-zinc-900",
                (sending || busy || !value.trim()) && "opacity-50 cursor-not-allowed",
              )}
            >
              {sending || busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-2 max-w-3xl px-1 text-[11px] text-zinc-500 dark:text-zinc-400">
        Press{" "}
        <kbd className="rounded border border-zinc-300 bg-zinc-50 px-1 dark:border-zinc-600 dark:bg-zinc-800">
          Enter
        </kbd>{" "}
        to send ·{" "}
        <kbd className="rounded border border-zinc-300 bg-zinc-50 px-1 dark:border-zinc-600 dark:bg-zinc-800">
          Shift
        </kbd>
        +
        <kbd className="rounded border border-zinc-300 bg-zinc-50 px-1 dark:border-zinc-600 dark:bg-zinc-800">
          Enter
        </kbd>{" "}
        for newline
        {recordingError && (
          <span className="ml-2 text-red-500">{recordingError}</span>
        )}
      </div>
    </div>
  )
})

export default Composer
