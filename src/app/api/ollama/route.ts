import { NextResponse } from 'next/server'

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Forward the request body to the local Ollama server
    const res = await fetch(`${OLLAMA_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await res.text()

    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
