import { NextRequest, NextResponse } from 'next/server'

const LANGVOICE_API_BASE = "https://www.langvoice.pro/api"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { text, voice = "heart", language = "american_english", speed = 1.0 } = body

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 })
        }

        const apiKey = process.env.NEXT_PUBLIC_LANGVOICE_API_KEY
        if (!apiKey) {
            return NextResponse.json({ error: "API key not configured" }, { status: 500 })
        }

        const response = await fetch(`${LANGVOICE_API_BASE}/tts/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": apiKey,
            },
            body: JSON.stringify({ text, voice, language, speed }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("LangVoice API error:", response.status, errorText)
            return NextResponse.json(
                { error: `LangVoice API error: ${response.status}` },
                { status: response.status }
            )
        }

        const audioData = await response.arrayBuffer()

        return new NextResponse(audioData, {
            status: 200,
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Length": audioData.byteLength.toString(),
            },
        })
    } catch (error) {
        console.error("TTS proxy error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
