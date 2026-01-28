"use client"

import * as React from "react"

interface LangVoiceConfig {
    apiKey: string
    voice?: string
    language?: string
    speed?: number
    onConnect?: () => void
    onDisconnect?: () => void
    onMessage?: (message: { source: "user" | "ai"; message: string }) => void
    onError?: (error: Error) => void
    micMuted?: boolean
}

interface LangVoiceConversation {
    status: "disconnected" | "connecting" | "connected" | "disconnecting"
    startSession: (config?: { onStatusChange?: (status: { status: string }) => void }) => Promise<void>
    endSession: () => void
    sendUserMessage: (message: string) => void
    sendContextualUpdate: (context: string) => void
    isSpeaking: boolean
}

// LangVoice API Base URL
const LANGVOICE_API_BASE = "https://www.langvoice.pro/api"

export function useLangVoiceConversation(config: LangVoiceConfig): LangVoiceConversation {
    const [status, setStatus] = React.useState<LangVoiceConversation["status"]>("disconnected")
    const [isSpeaking, setIsSpeaking] = React.useState(false)

    const recognitionRef = React.useRef<SpeechRecognition | null>(null)
    const audioContextRef = React.useRef<AudioContext | null>(null)
    const statusCallbackRef = React.useRef<((status: { status: string }) => void) | null>(null)
    const configRef = React.useRef(config)

    // Keep config ref updated
    React.useEffect(() => {
        configRef.current = config
    }, [config])

    // Generate speech using LangVoice API via local proxy
    const generateSpeech = React.useCallback(async (text: string): Promise<ArrayBuffer | null> => {
        try {
            const response = await fetch("/api/langvoice/tts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text,
                    voice: configRef.current.voice || "heart",
                    language: configRef.current.language || "american_english",
                    speed: configRef.current.speed || 1.0,
                }),
            })

            if (!response.ok) {
                throw new Error(`LangVoice API error: ${response.status}`)
            }

            return await response.arrayBuffer()
        } catch (error) {
            console.error("LangVoice TTS error:", error)
            configRef.current.onError?.(error instanceof Error ? error : new Error(String(error)))
            return null
        }
    }, [])

    // Play audio from ArrayBuffer - pause recognition to avoid feedback loop
    const playAudio = React.useCallback(async (audioData: ArrayBuffer) => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new AudioContext()
            }

            // Pause speech recognition during playback to avoid feedback loop
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop()
                } catch {
                    // Ignore stop errors
                }
            }

            setIsSpeaking(true)
            const audioBuffer = await audioContextRef.current.decodeAudioData(audioData.slice(0))
            const source = audioContextRef.current.createBufferSource()
            source.buffer = audioBuffer
            source.connect(audioContextRef.current.destination)

            source.onended = () => {
                setIsSpeaking(false)
                // Resume speech recognition after playback ends
                if (recognitionRef.current) {
                    try {
                        recognitionRef.current.start()
                    } catch {
                        // Ignore start errors
                    }
                }
            }

            source.start()
        } catch (error) {
            console.error("Audio playback error:", error)
            setIsSpeaking(false)
            // Resume recognition on error too
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start()
                } catch {
                    // Ignore start errors
                }
            }
        }
    }, [])

    const isProcessingRef = React.useRef(false)

    // Send message and get AI response, then TTS
    const sendUserMessage = React.useCallback(async (message: string) => {
        if (!message.trim() || isSpeaking || isProcessingRef.current) return

        isProcessingRef.current = true

        // Notify about user message
        configRef.current.onMessage?.({ source: "user", message })

        try {
            // Call Groq API for AI response
            console.log("[LangVoice] Sending message to chat API:", message)
            const chatResponse = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            })

            console.log("[LangVoice] Chat API response status:", chatResponse.status)

            let aiResponse = "Sorry, I couldn't process that."

            if (chatResponse.ok) {
                const data = await chatResponse.json()
                console.log("[LangVoice] Chat API response data:", data)
                aiResponse = data.response || aiResponse
            } else {
                const errorText = await chatResponse.text()
                console.error("[LangVoice] Chat API error:", chatResponse.status, errorText)
            }

            // Notify about AI response
            configRef.current.onMessage?.({ source: "ai", message: aiResponse })

            // Generate TTS for AI response
            const audioData = await generateSpeech(aiResponse)
            if (audioData) {
                await playAudio(audioData)
            }
        } catch (error) {
            console.error("Error processing message:", error)
            configRef.current.onError?.(error instanceof Error ? error : new Error(String(error)))
        } finally {
            isProcessingRef.current = false
        }
    }, [generateSpeech, playAudio, isSpeaking])

    // Start speech recognition session
    const startSession = React.useCallback(async (sessionConfig?: { onStatusChange?: (status: { status: string }) => void }) => {
        try {
            setStatus("connecting")
            statusCallbackRef.current = sessionConfig?.onStatusChange || null
            sessionConfig?.onStatusChange?.({ status: "connecting" })

            // Check for Web Speech API support
            const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

            if (!SpeechRecognitionAPI) {
                throw new Error("Speech recognition not supported in this browser")
            }

            // Initialize AudioContext
            audioContextRef.current = new AudioContext()

            // Initialize Speech Recognition
            recognitionRef.current = new SpeechRecognitionAPI()
            recognitionRef.current.continuous = true
            recognitionRef.current.interimResults = false
            recognitionRef.current.lang = "en-US"

            recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                const last = event.results.length - 1
                const transcript = event.results[last][0].transcript

                if (transcript.trim() && !configRef.current.micMuted) {
                    sendUserMessage(transcript)
                }
            }

            recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
                // Ignore "no-speech" - it's normal when user is silent
                if (event.error !== "no-speech" && event.error !== "aborted") {
                    console.error("Speech recognition error:", event.error)
                    configRef.current.onError?.(new Error(`Speech recognition error: ${event.error}`))
                }
            }

            recognitionRef.current.onend = () => {
                // Restart if still connected
                if (status === "connected" && recognitionRef.current) {
                    try {
                        recognitionRef.current.start()
                    } catch {
                        // Ignore restart errors
                    }
                }
            }

            // Start listening
            recognitionRef.current.start()

            setStatus("connected")
            sessionConfig?.onStatusChange?.({ status: "connected" })
            configRef.current.onConnect?.()

            // Play welcome message
            const welcomeAudio = await generateSpeech("Hello, welcome to G's portfolio!, How can I help you?")
            if (welcomeAudio) {
                await playAudio(welcomeAudio)
            }

        } catch (error) {
            console.error("Failed to start session:", error)
            setStatus("disconnected")
            sessionConfig?.onStatusChange?.({ status: "disconnected" })
            configRef.current.onError?.(error instanceof Error ? error : new Error(String(error)))
        }
    }, [status, generateSpeech, playAudio, sendUserMessage])

    // End session
    const endSession = React.useCallback(() => {
        setStatus("disconnecting")
        statusCallbackRef.current?.({ status: "disconnecting" })

        if (recognitionRef.current) {
            recognitionRef.current.stop()
            recognitionRef.current = null
        }

        if (audioContextRef.current) {
            audioContextRef.current.close()
            audioContextRef.current = null
        }

        setStatus("disconnected")
        statusCallbackRef.current?.({ status: "disconnected" })
        configRef.current.onDisconnect?.()
    }, [])

    // Contextual update (no-op in this implementation)
    const sendContextualUpdate = React.useCallback((_context: string) => {
        // No-op: LangVoice doesn't support context updates
    }, [])

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
            if (audioContextRef.current) {
                audioContextRef.current.close()
            }
        }
    }, [])

    return {
        status,
        startSession,
        endSession,
        sendUserMessage,
        sendContextualUpdate,
        isSpeaking,
    }
}

// Web Speech API Type Declarations
interface SpeechRecognitionResult {
    readonly length: number;
    readonly isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}

interface SpeechRecognitionResultList {
    readonly length: number;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEventInit extends EventInit {
    resultIndex?: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEventInit extends EventInit {
    error: string;
    message?: string;
}

interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    grammars: unknown;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    onaudioend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
    onaudiostart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
    onend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => unknown) | null;
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
    start(): void;
    stop(): void;
    abort(): void;
}

interface SpeechRecognitionConstructor {
    new(): SpeechRecognition;
    prototype: SpeechRecognition;
}

declare global {
    interface Window {
        SpeechRecognition: SpeechRecognitionConstructor;
        webkitSpeechRecognition: SpeechRecognitionConstructor;
    }
}

export { }

