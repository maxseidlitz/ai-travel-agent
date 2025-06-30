import { NextRequest, NextResponse } from 'next/server'
import { generateTravelResponse } from '@/lib/ai'
import { ChatRequest } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, sessionId, tripId, context } = body

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Nachricht ist erforderlich' },
        { status: 400 }
      )
    }

    // Generate AI response using Ollama
    const aiResponse = await generateTravelResponse({
      message,
      sessionId,
      tripId,
      context
    })

    // TODO: Save to database when Prisma is set up
    // Temporär ohne Datenbank-Speicherung

    return NextResponse.json({
      success: true,
      data: aiResponse
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Interner Server-Fehler',
        message: 'Bitte versuchen Sie es später erneut.'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID ist erforderlich' },
        { status: 400 }
      )
    }

    // TODO: Get chat history from database when Prisma is set up
    // Temporär ohne Datenbank - leere Nachrichtenliste zurückgeben
    const messages: any[] = []

    return NextResponse.json({
      success: true,
      data: messages
    })

  } catch (error) {
    console.error('Get chat history error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Fehler beim Laden des Chat-Verlaufs'
      },
      { status: 500 }
    )
  }
} 