'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBox({
  pdfId,
  pdfUrl,
  summary,
}: {
  pdfId: string
  pdfUrl: string
  summary: string | null
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  // 🚀 Hämta tidigare chatt när komponenten mountas
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(`/api/chat/history?pdfId=${pdfId}`)
        const data = await res.json()
        setMessages(data)
      } catch (err) {
        console.error('Kunde inte hämta historik:', err)
      }
    }
    loadHistory()
  }, [pdfId])

  // 🔄 Scrolla till botten när nya meddelanden läggs till
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight)
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newUserMessage: ChatMessage = { role: 'user', content: input }
    const updatedMessages = [...messages, newUserMessage]

    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      // 🧠 Skicka till API för AI-svar
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, pdfId }),
      })

      const data = await res.json()

      if (data?.role === 'assistant') {
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: data.content,
        }

        const fullChat = [...updatedMessages, aiMessage]
        setMessages(fullChat)

        // 💾 Spara både user och ai meddelande till DB
        await Promise.all([
          fetch('/api/chat/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pdfId, message: newUserMessage }),
          }),
          fetch('/api/chat/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pdfId, message: aiMessage }),
          }),
        ])
      }
    } catch (err) {
      console.error('Fel vid API-anrop:', err)
    } finally {
      setIsLoading(false)
    }
  }
  const isPro = false
  return (
    <section className="container grid grid-cols-2 gap-4 relative">
      <div className="w-full flex-1 mx-auto col-span-2 relative">
        {!isPro && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-10 flex flex-col items-center justify-center rounded-md border border-dashed border-rose-300">
            <div className="text-4xl text-rose-500 mb-2">🚫</div>
            <p className="text-center text-muted-foreground font-medium">
              Endast tillgängligt för PRO-användare
            </p>
          </div>
        )}

        <div
          ref={chatRef}
          className="border h-96 overflow-y-auto p-4 rounded-md bg-white mb-4"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-3 p-2 rounded-md max-w-[80%] whitespace-pre-wrap text-sm ${
                m.role === 'user'
                  ? 'bg-blue-100 ml-auto text-right'
                  : 'bg-green-100 text-left'
              }`}
            >
              <strong>{m.role === 'user' ? 'Du' : 'AI'}:</strong> {m.content}
            </div>
          ))}
          {isLoading && <div className="text-sm text-gray-400">Skriver...</div>}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            disabled={!isPro}
            className="flex-1 border px-3 py-2 rounded-md text-sm"
            placeholder="Ställ en fråga om PDF:en..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim() || !isPro}
            className="text-sm disabled:opacity-50"
          >
            Skicka
          </Button>
        </form>
      </div>
    </section>
  )
}
