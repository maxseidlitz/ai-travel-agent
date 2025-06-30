'use client'

import React, { useState, useEffect } from 'react'
import { MessageCircle, MapPin, Calendar, Euro, Users, Star, Edit3, Trash2, Plus, Save } from 'lucide-react'

interface TravelNote {
  id: string
  type: 'destination' | 'budget' | 'dates' | 'activities' | 'accommodation' | 'transport' | 'general'
  title: string
  content: string
  priority: 'high' | 'medium' | 'low'
  createdAt: Date
  updatedAt: Date
}

interface TravelCanvasProps {
  chatMessages: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  onSaveNotes: (notes: TravelNote[]) => void
  autoNotes?: Array<{
    id: string
    type: 'destination' | 'budget' | 'dates' | 'activities' | 'accommodation' | 'transport' | 'general'
    title: string
    content: string
    priority: 'high' | 'medium' | 'low'
    createdAt: Date
    updatedAt: Date
  }>
}

export default function TravelCanvas({ chatMessages, onSaveNotes, autoNotes = [] }: TravelCanvasProps) {
  const [notes, setNotes] = useState<TravelNote[]>([])
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [newNote, setNewNote] = useState<Partial<TravelNote>>({
    type: 'general',
    priority: 'medium'
  })
  const [showAddForm, setShowAddForm] = useState(false)

  // Automatische Extraktion von Informationen aus Chat-Nachrichten
  useEffect(() => {
    const extractedNotes = extractNotesFromChat(chatMessages)
    setNotes(prevNotes => {
      const existingIds = new Set(prevNotes.map(note => note.id))
      const newNotes = extractedNotes.filter(note => !existingIds.has(note.id))
      return [...prevNotes, ...newNotes]
    })
  }, [chatMessages])

  // Integriere automatisch erstellte Notizen von der AI
  useEffect(() => {
    if (autoNotes.length > 0) {
      setNotes(prevNotes => {
        const existingIds = new Set(prevNotes.map(note => note.id))
        const newAutoNotes = autoNotes.filter(note => !existingIds.has(note.id))
        return [...prevNotes, ...newAutoNotes]
      })
    }
  }, [autoNotes])

  const extractNotesFromChat = (messages: any[]): TravelNote[] => {
    const extracted: TravelNote[] = []
    const allText = messages.map(m => m.content).join(' ').toLowerCase()

    // Extrahiere Reiseziele
    const destinations = extractDestinations(allText)
    destinations.forEach(dest => {
      extracted.push({
        id: `dest-${Date.now()}-${Math.random()}`,
        type: 'destination',
        title: `Reiseziel: ${dest}`,
        content: `Geplantes Reiseziel: ${dest}`,
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    })

    // Extrahiere Budget-Informationen
    const budgetMatch = allText.match(/(\d+)\s*€|\d+\s*euro/i)
    if (budgetMatch) {
      extracted.push({
        id: `budget-${Date.now()}`,
        type: 'budget',
        title: `Budget: ${budgetMatch[0]}`,
        content: `Geplantes Budget: ${budgetMatch[0]}`,
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    // Extrahiere Zeiträume
    const timeMatches = allText.match(/(\d+)\s*(tage|wochen|monate)/gi)
    if (timeMatches) {
      extracted.push({
        id: `time-${Date.now()}`,
        type: 'dates',
        title: `Reisedauer: ${timeMatches[0]}`,
        content: `Geplante Reisedauer: ${timeMatches[0]}`,
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    return extracted
  }

  const extractDestinations = (text: string): string[] => {
    const destinations = [
      'paris', 'london', 'rome', 'barcelona', 'amsterdam', 'berlin', 'vienna', 'prague',
      'budapest', 'krakow', 'warsaw', 'stockholm', 'oslo', 'copenhagen', 'helsinki',
      'athens', 'thessaloniki', 'crete', 'rhodes', 'santorini', 'mykonos',
      'madrid', 'seville', 'granada', 'valencia', 'bilbao', 'ibiza', 'mallorca',
      'milan', 'florence', 'venice', 'naples', 'sicily', 'tuscany',
      'zurich', 'geneva', 'bern', 'lucerne', 'interlaken', 'zermatt',
      'salzburg', 'innsbruck', 'hallstatt', 'vienna', 'graz',
      'munich', 'hamburg', 'cologne', 'frankfurt', 'dresden', 'leipzig',
      'brussels', 'antwerp', 'bruges', 'ghent',
      'dublin', 'cork', 'galway', 'killarney',
      'edinburgh', 'glasgow', 'inverness', 'aberdeen',
      'tokyo', 'kyoto', 'osaka', 'hiroshima', 'nara', 'kanazawa',
      'seoul', 'busan', 'jeju',
      'bangkok', 'chiang mai', 'phuket', 'koh samui',
      'singapore', 'kuala lumpur', 'penang',
      'bali', 'jakarta', 'yogyakarta',
      'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide',
      'auckland', 'wellington', 'christchurch',
      'vancouver', 'toronto', 'montreal', 'quebec', 'calgary',
      'new york', 'los angeles', 'san francisco', 'chicago', 'miami', 'las vegas',
      'mexico city', 'cancun', 'puerto vallarta',
      'rio de janeiro', 'sao paulo', 'salvador', 'recife',
      'buenos aires', 'santiago', 'lima', 'cusco', 'machu picchu',
      'cairo', 'alexandria', 'luxor', 'aswan',
      'marrakech', 'fes', 'casablanca', 'tangier',
      'istanbul', 'ankara', 'izmir', 'antalya', 'cappadocia',
      'dubai', 'abu dhabi', 'doha', 'muscat',
      'mumbai', 'delhi', 'jaipur', 'agra', 'varanasi', 'goa',
      'kathmandu', 'pokhara',
      'beijing', 'shanghai', 'guangzhou', 'shenzhen', 'xian', 'chengdu'
    ]

    return destinations.filter(dest => text.includes(dest))
  }

  const addNote = () => {
    if (!newNote.title || !newNote.content) return

    const note: TravelNote = {
      id: `note-${Date.now()}`,
      type: newNote.type || 'general',
      title: newNote.title,
      content: newNote.content,
      priority: newNote.priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setNotes(prev => [...prev, note])
    setNewNote({ type: 'general', priority: 'medium' })
    setShowAddForm(false)
    onSaveNotes([...notes, note])
  }

  const updateNote = (id: string, updates: Partial<TravelNote>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ))
    setEditingNote(null)
  }

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'destination': return <MapPin className="w-4 h-4" />
      case 'budget': return <Euro className="w-4 h-4" />
      case 'dates': return <Calendar className="w-4 h-4" />
      case 'activities': return <Star className="w-4 h-4" />
      case 'accommodation': return <Users className="w-4 h-4" />
      default: return <MessageCircle className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50'
      case 'medium': return 'border-yellow-200 bg-yellow-50'
      case 'low': return 'border-green-200 bg-green-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'destination': return 'Reiseziel'
      case 'budget': return 'Budget'
      case 'dates': return 'Termine'
      case 'activities': return 'Aktivitäten'
      case 'accommodation': return 'Unterkunft'
      case 'transport': return 'Transport'
      case 'general': return 'Allgemein'
      default: return type
    }
  }

  const groupedNotes = notes.reduce((acc, note) => {
    if (!acc[note.type]) acc[note.type] = []
    acc[note.type].push(note)
    return acc
  }, {} as Record<string, TravelNote[]>)

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
      {/* Header mit Add-Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Notizen</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSaveNotes(notes)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Speichern"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Neue Notiz"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Neue Notiz hinzufügen - kompakt */}
      {showAddForm && (
        <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Titel"
              value={newNote.title || ''}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <select
                value={newNote.type}
                onChange={(e) => setNewNote(prev => ({ ...prev, type: e.target.value as any }))}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="general">Allgemein</option>
                <option value="destination">Reiseziel</option>
                <option value="budget">Budget</option>
                <option value="dates">Termine</option>
                <option value="activities">Aktivitäten</option>
                <option value="accommodation">Unterkunft</option>
                <option value="transport">Transport</option>
              </select>
              <select
                value={newNote.priority}
                onChange={(e) => setNewNote(prev => ({ ...prev, priority: e.target.value as any }))}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="low">Niedrig</option>
                <option value="medium">Mittel</option>
                <option value="high">Hoch</option>
              </select>
            </div>
            <textarea
              placeholder="Notiz-Inhalt..."
              value={newNote.content || ''}
              onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={addNote}
                className="flex-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Hinzufügen
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notizen - kompakt dargestellt */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {Object.entries(groupedNotes).map(([type, typeNotes]) => (
          <div key={type} className="border border-gray-200 rounded-lg">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
              <h3 className="text-sm font-medium text-gray-900 flex items-center gap-1">
                {getTypeIcon(type)}
                {getTypeLabel(type)} ({typeNotes.length})
              </h3>
            </div>
            <div className="p-2 space-y-2">
              {typeNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 border rounded-lg ${getPriorityColor(note.priority)}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{note.title}</h4>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingNote(editingNote === note.id ? null : note.id)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Bearbeiten"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        title="Löschen"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  {editingNote === note.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={note.title}
                        onChange={(e) => updateNote(note.id, { title: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <textarea
                        value={note.content}
                        onChange={(e) => updateNote(note.id, { content: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                        rows={2}
                      />
                      <div className="flex gap-1">
                        <select
                          value={note.priority}
                          onChange={(e) => updateNote(note.id, { priority: e.target.value as any })}
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="low">Niedrig</option>
                          <option value="medium">Mittel</option>
                          <option value="high">Hoch</option>
                        </select>
                        <button
                          onClick={() => setEditingNote(null)}
                          className="px-2 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                        >
                          ✓
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-700 whitespace-pre-wrap line-clamp-3">{note.content}</p>
                  )}
                  
                  <div className="mt-1 text-xs text-gray-500">
                    {note.createdAt.toLocaleDateString('de-DE')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-8 text-gray-500 flex-1 flex flex-col items-center justify-center">
          <MessageCircle className="w-8 h-8 mb-2 text-gray-300" />
          <p className="text-sm">Noch keine Notizen</p>
          <p className="text-xs text-gray-400">Notizen werden automatisch erstellt</p>
        </div>
      )}
    </div>
  )
} 