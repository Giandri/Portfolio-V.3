"use client"

import * as React from "react"
import { useLangVoiceConversation } from "@/hooks/use-langvoice-conversation"

// Simple fallback form component
const FallbackForm = ({ onSubmit, placeholder }: { onSubmit: (message: string) => void, placeholder: string }) => {
  const [message, setMessage] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSubmit(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[60px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        required
      />
      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
        disabled={!message.trim()}
      >
        Send Message
      </button>
    </form>
  )
}
import {
  ArrowUpIcon,
  ChevronDown,
  Keyboard,
  Mic,
  MicOff,
  PhoneIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LiveWaveform } from "@/components/ui/live-waveform"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export interface ConversationBarProps {
  /**
   * LangVoice API Key for authentication
   */
  apiKey: string

  /**
   * Voice to use for TTS (default: "heart")
   */
  voice?: string

  /**
   * Language for TTS (default: "american_english")
   */
  language?: string

  /**
   * Custom className for the container
   */
  className?: string

  /**
   * Custom className for the waveform
   */
  waveformClassName?: string

  /**
   * Callback when conversation connects
   */
  onConnect?: () => void

  /**
   * Callback when conversation disconnects
   */
  onDisconnect?: () => void

  /**
   * Callback when an error occurs
   */
  onError?: (error: Error) => void

  /**
   * Callback when a message is received
   */
  onMessage?: (message: { source: "user" | "ai"; message: string }) => void

  /**
   * Callback when user sends a message
   */
  onSendMessage?: (message: string) => void
}

export const ConversationBar = React.forwardRef<
  HTMLDivElement,
  ConversationBarProps
>(
  (
    {
      apiKey,
      voice,
      language,
      className,
      waveformClassName,
      onConnect,
      onDisconnect,
      onError,
      onMessage,
      onSendMessage,
    },
    ref
  ) => {
    const [isMuted, setIsMuted] = React.useState(false)
    const [agentState, setAgentState] = React.useState<
      "disconnected" | "connecting" | "connected" | "disconnecting" | null
    >("disconnected")
    const [keyboardOpen, setKeyboardOpen] = React.useState(false)
    const [textInput, setTextInput] = React.useState("")
    const [hasError, setHasError] = React.useState(false)
    const mediaStreamRef = React.useRef<MediaStream | null>(null)

    // Check if API key is placeholder
    const isPlaceholderKey = apiKey === "your-api-key-here" || !apiKey

    const conversation = useLangVoiceConversation({
      apiKey,
      voice,
      language,
      onConnect: () => {
        onConnect?.()
      },
      onDisconnect: () => {
        setAgentState("disconnected")
        onDisconnect?.()
        setKeyboardOpen(false)
      },
      onMessage: (message) => {
        onMessage?.(message)
      },
      onError: (error: unknown) => {
        console.error("Error:", error)
        setAgentState("disconnected")
        setHasError(true)
        const errorObj =
          error instanceof Error
            ? error
            : new Error(
              typeof error === "string" ? error : JSON.stringify(error)
            )
        onError?.(errorObj)
      },
    })

    const getMicStream = React.useCallback(async () => {
      if (mediaStreamRef.current) return mediaStreamRef.current

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream

      return stream
    }, [])

    const startConversation = React.useCallback(async () => {
      try {
        setAgentState("connecting")

        await getMicStream()

        await conversation.startSession({
          onStatusChange: (status) => setAgentState(status.status as typeof agentState),
        })
      } catch (error) {
        console.error("Error starting conversation:", error)
        setAgentState("disconnected")
        onError?.(error as Error)
      }
    }, [conversation, getMicStream, onError])

    const handleEndSession = React.useCallback(() => {
      conversation.endSession()
      setAgentState("disconnected")

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop())
        mediaStreamRef.current = null
      }
    }, [conversation])

    const toggleMute = React.useCallback(() => {
      setIsMuted((prev) => !prev)
    }, [])

    const handleStartOrEnd = React.useCallback(() => {
      if (agentState === "connected" || agentState === "connecting") {
        handleEndSession()
      } else if (agentState === "disconnected") {
        startConversation()
      }
    }, [agentState, handleEndSession, startConversation])

    const handleSendText = React.useCallback(() => {
      if (!textInput.trim()) return

      const messageToSend = textInput
      conversation.sendUserMessage(messageToSend)
      setTextInput("")
      onSendMessage?.(messageToSend)
    }, [conversation, textInput, onSendMessage])

    const isConnected = agentState === "connected"

    const handleTextChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.stopPropagation()
        const value = e.target.value
        setTextInput(value)

        if (value.trim() && isConnected) {
          conversation.sendContextualUpdate(value)
        }
      },
      [conversation, isConnected]
    )

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        e.stopPropagation()
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          handleSendText()
        }
      },
      [handleSendText]
    )

    React.useEffect(() => {
      return () => {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop())
        }
      }
    }, [])

    // Show fallback form ONLY if API key is placeholder
    if (isPlaceholderKey) {
      return (
        <div ref={ref} className={cn("w-full", className)}>
          <Card className="border shadow-lg">
            <FallbackForm
              onSubmit={(message) => {
                onSendMessage?.(message)
                // Simulate response
                setTimeout(() => {
                  onMessage?.({
                    source: "ai",
                    message: "Please configure a valid LangVoice API key to enable voice synthesis."
                  })
                }, 1000)
              }}
              placeholder="Send a message..."
            />
          </Card>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn("flex w-full items-end justify-center p-2 sm:p-4", className)}
      >
        <Card className="m-0 w-full gap-0 border p-0 shadow-lg">
          <div className="flex flex-col-reverse">
            <div>
              {keyboardOpen && <Separator />}
              <div className="flex items-center justify-between gap-1 sm:gap-2 p-1 sm:p-2">
                <div className="h-8 w-[100px] sm:w-[120px] md:h-10">
                  <div
                    className={cn(
                      "flex h-full items-center gap-2 rounded-md py-1",
                      "bg-foreground/5 text-foreground/70"
                    )}
                  >
                    <div className="h-full flex-1">
                      <div
                        className={cn(
                          "relative flex h-full w-full shrink-0 items-center justify-center overflow-hidden rounded-sm",
                          waveformClassName
                        )}
                      >
                        <LiveWaveform
                          key={
                            agentState === "disconnected" ? "idle" : "active"
                          }
                          active={isConnected && !isMuted}
                          processing={agentState === "connecting"}
                          barWidth={3}
                          barGap={1}
                          barRadius={4}
                          fadeEdges={true}
                          fadeWidth={24}
                          sensitivity={1.8}
                          smoothingTimeConstant={0.85}
                          height={10}
                          mode="static"
                          className={cn(
                            "h-full w-full transition-opacity duration-300",
                            agentState === "disconnected" && "opacity-0"
                          )}
                        />
                        {agentState === "disconnected" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-foreground/50 text-[12px] sm:text-[14px] font-medium">
                              Goliath AI
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleMute()
                    }}
                    aria-pressed={isMuted}
                    className={cn(isMuted ? "bg-foreground/5" : "")}
                    disabled={!isConnected}
                  >
                    {isMuted ? <MicOff /> : <Mic />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      setKeyboardOpen((v) => !v)
                    }}
                    aria-pressed={keyboardOpen}
                    className="relative"
                    disabled={!isConnected}
                  >
                    <Keyboard
                      className={
                        "h-5 w-5 transform-gpu transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] " +
                        (keyboardOpen
                          ? "scale-75 opacity-0"
                          : "scale-100 opacity-100")
                      }
                    />
                    <ChevronDown
                      className={
                        "absolute inset-0 m-auto h-5 w-5 transform-gpu transition-all delay-50 duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] " +
                        (keyboardOpen
                          ? "scale-100 opacity-100"
                          : "scale-75 opacity-0")
                      }
                    />
                  </Button>
                  <Separator orientation="vertical" className="mx-1 -my-2.5" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStartOrEnd()
                    }}
                    disabled={agentState === "disconnecting"}
                  >
                    {isConnected || agentState === "connecting" ? (
                      <XIcon className="h-5 w-5" />
                    ) : (
                      <PhoneIcon className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-out",
                (isConnected && keyboardOpen) ? "max-h-[70px] sm:max-h-[80px]" : "max-h-0"
              )}
            >
              <div className="relative px-2 pt-2 pb-2">
                <Textarea
                  value={textInput}
                  onChange={handleTextChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your message..."
                  className="min-h-[50px] sm:min-h-[60px] resize-none border-0 pr-10 sm:pr-12 shadow-none focus-visible:ring-0 text-sm sm:text-base"
                  disabled={!isConnected}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSendText()
                  }}
                  disabled={!textInput.trim() || !isConnected}
                  className="absolute right-3 bottom-3 h-8 w-8"
                >
                  <ArrowUpIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
)

ConversationBar.displayName = "ConversationBar"
