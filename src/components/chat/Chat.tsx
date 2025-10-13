"use client"

import React, { useState } from 'react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function send() {
    if (!input.trim()) return
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input }
    setMessages((m) => [...m, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Adapter payload for Ollama chat completions - adjust as needed
      const payload = {
        model: 'ollama',
        messages: [...messages.map((mm) => ({ role: mm.role, content: mm.content })), { role: 'user', content: userMessage.content }],
      }

      const res = await fetch('/api/ollama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      // Try to extract assistant reply from common fields
      let assistantText = ''
      if (data.choices && data.choices[0] && data.choices[0].message) {
        assistantText = data.choices[0].message.content || ''
      } else if (data.error) {
        assistantText = `Error: ${data.error}`
      } else if (typeof data === 'string') {
        assistantText = data
      }

      const assistantMessage: Message = { id: Date.now().toString() + '-a', role: 'assistant', content: assistantText }
      setMessages((m) => [...m, assistantMessage])
    } catch (err) {
      setMessages((m) => [...m, { id: Date.now().toString(), role: 'assistant', content: `Request failed: ${(err as Error).message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-4 border rounded p-4 h-80 overflow-auto">
        {messages.length === 0 && <div className="text-muted">No messages yet. Say hi!</div>}
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'text-right mt-2' : 'text-left mt-2'}>
            <div className={`inline-block px-3 py-2 rounded ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type a message"
          onKeyDown={(e) => {
            if (e.key === 'Enter') send()
          }}
        />
        <button onClick={send} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  )
}
