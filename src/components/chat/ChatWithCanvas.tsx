'use client'

import React, { useState, useMemo } from 'react'
import ChatInterface from './ChatInterface'
import TravelCanvas from '../planning/TravelCanvas'
import { Message, MessageRole, TravelNote, TravelNoteDraft } from '@/types'

interface ChatWithCanvasProps {
  className?: string
}

type CanvasMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatWithCanvas({ className }: ChatWithCanvasProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [autoNotes, setAutoNotes] = useState<TravelNote[]>([])
  const [showNotes, setShowNotes] = useState(false)

  const handleNewMessage = (newMessages: Message[]) => {
    setMessages(newMessages)
  }

  const handleNotesExtracted = (extractedNotes: TravelNoteDraft[]) => {
    const formattedNotes: TravelNote[] = extractedNotes.map(note => {
      const timestamp = new Date()
      return {
        ...note,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    })

    setAutoNotes(prev => [...prev, ...formattedNotes])
  }

  const handleSaveNotes = (notes: TravelNote[]) => {
    localStorage.setItem('travelNotes', JSON.stringify(notes))
  }

  const mappedMessages: CanvasMessage[] = useMemo(() => (
    messages
      .filter(m => m.role === MessageRole.USER || m.role === MessageRole.ASSISTANT)
      .map(m => ({
        id: m.id,
        role: m.role === MessageRole.USER ? 'user' : 'assistant',
        content: m.content,
        timestamp: m.createdAt
      }))
  ), [messages])

  return (
    <div className={`flex flex-col lg:grid lg:grid-cols-3 gap-6 h-[600px] ${className}`}>
      {/* Chat-Bereich - nimmt 2/3 der Breite ein auf Desktop, volle Breite auf Mobile */}
      <div className="lg:col-span-2 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Chat mit AI</h3>
          <div className="flex items-center gap-2">
            {autoNotes.length > 0 && (
              <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                {autoNotes.length} neue Notiz{autoNotes.length > 1 ? 'en' : ''}
              </div>
            )}
            {/* Mobile Toggle Button für Notizen */}
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="lg:hidden px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showNotes ? 'Chat anzeigen' : 'Notizen anzeigen'}
            </button>
          </div>
        </div>
        
        <div className={`${showNotes ? 'hidden' : 'block'} lg:block flex-1 min-h-0`}>
          <ChatInterface 
            className="h-full"
            onTripCreated={handleNewMessage}
            onNotesExtracted={handleNotesExtracted}
          />
        </div>
      </div>

      {/* Notizen-Bereich - nimmt 1/3 der Breite ein auf Desktop, volle Breite auf Mobile */}
      <div className={`lg:col-span-1 flex flex-col h-full ${showNotes ? 'block' : 'hidden'} lg:block`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reiseplanungs-Notizen</h3>
        <div className="flex-1 overflow-y-auto min-h-0">
          <TravelCanvas
            chatMessages={mappedMessages}
            onSaveNotes={handleSaveNotes}
            autoNotes={autoNotes}
          />
        </div>
      </div>
    </div>
  )
} 