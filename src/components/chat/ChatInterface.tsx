'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Loader2, MessageCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Message, AIResponse, MessageRole, ApiResponse } from '@/types'
import { cn } from '@/lib/utils'
import type { TravelNote, TravelNotesResult } from '@/lib/ai/ollama'

interface ChatInterfaceProps {
  className?: string
  onMessagesChange?: (messages: Message[]) => void
  onNotesExtracted?: (notes: TravelNote[]) => void
}

export default function ChatInterface({ className, onMessagesChange, onNotesExtracted }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    onMessagesChange?.(messages)
  }, [messages, onMessagesChange])

  // Initialize session
  useEffect(() => {
    if (!sessionId) {
      setSessionId(`session_${Date.now()}`)
    }
  }, [sessionId])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content: input,
      role: MessageRole.USER,
      chatSessionId: sessionId || '',
      createdAt: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Extrahiere automatisch Notizen aus der User-Nachricht via API
      const chatHistory = messages.map(m => `${m.role}: ${m.content}`).join('\n')
      const notesResponse = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, chatHistory }),
      })
      const notesResult = await notesResponse.json() as ApiResponse<TravelNotesResult>
      const extractedNotes: TravelNotesResult = notesResult.success && notesResult.data
        ? notesResult.data
        : { notes: [], shouldCreateNotes: false }
      
      // Erstelle AI-Antwort
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          sessionId,
          context: {
            userPreferences: {
              // Add user preferences here
            }
          }
        }),
      })

      const result = await response.json() as ApiResponse<AIResponse>

      if (result.success && result.data) {
        const aiResponse: Message = {
          id: `msg_${Date.now()}_ai`,
          content: result.data.content,
          role: MessageRole.ASSISTANT,
          chatSessionId: sessionId || '',
          createdAt: new Date()
        }

        setMessages(prev => [...prev, aiResponse])

        // Sende extrahierte Notizen an Parent-Komponente
        if (extractedNotes.shouldCreateNotes && extractedNotes.notes.length > 0) {
          console.log('Automatisch extrahierte Notizen:', extractedNotes.notes)
          onNotesExtracted?.(extractedNotes.notes)
        }
      } else {
        throw new Error(result.error || 'Fehler beim Senden der Nachricht')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        content: 'Entschuldigung, es gab einen Fehler. Bitte versuchen Sie es erneut.',
        role: MessageRole.ASSISTANT,
        chatSessionId: sessionId || '',
        createdAt: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  return (
    <div className={cn('flex flex-col h-full bg-white rounded-lg shadow-lg', className)}>
      {/* Header - Feste Höhe */}
      <div className="flex-shrink-0 flex items-center gap-2 p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <MessageCircle className="w-5 h-5" />
        <h2 className="text-lg font-semibold">AI Reiseberater</h2>
      </div>

      {/* Messages - Scrollbarer Bereich mit fester Höhe */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Willkommen beim AI Reiseberater!</p>
            <p className="text-sm mt-2">
              Erzählen Sie mir von Ihren Reiseplänen und ich helfe Ihnen dabei.
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-xs text-gray-400">Beispiel-Nachrichten:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  'Ich möchte im Sommer 2 Wochen verreisen',
                  'Budget 3000€ für Kultur und Natur',
                  'Was kann ich in Paris machen?'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.role === MessageRole.USER ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[80%] rounded-lg px-4 py-2 break-words',
                message.role === MessageRole.USER
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              )}
            >
              {message.role === MessageRole.ASSISTANT ? (
                <div
                  className="prose prose-sm prose-gray max-w-full break-words whitespace-pre-wrap"
                  style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                >
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Anpassungen für bessere Darstellung in Chat
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-sm">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      code: ({ children, className }) => {
                        const isInline = !className
                        return isInline ? (
                          <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                        ) : (
                          <code className="block bg-gray-200 p-2 rounded text-xs font-mono overflow-x-auto">{children}</code>
                        )
                      },
                      pre: ({ children }) => <pre className="bg-gray-200 p-2 rounded text-xs font-mono overflow-x-auto mb-2">{children}</pre>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-3 italic text-gray-600 mb-2">{children}</blockquote>,
                      a: ({ children, href }) => (
                        <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto mb-2">
                          <table className="min-w-full border border-gray-300 text-xs">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }) => <th className="border border-gray-300 px-2 py-1 bg-gray-100 font-semibold">{children}</th>,
                      td: ({ children }) => <td className="border border-gray-300 px-2 py-1">{children}</td>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap break-words" style={{ overflowWrap: 'anywhere' }}>
                  {message.content}
                </p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-600">AI denkt nach...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input - Feste Höhe */}
      <div className="flex-shrink-0 p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Erzählen Sie mir von Ihren Reiseplänen..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className={cn(
              'px-4 py-2 rounded-lg transition-colors',
              input.trim() && !isLoading
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
} 