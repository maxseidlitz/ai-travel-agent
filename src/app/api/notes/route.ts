import { NextRequest, NextResponse } from 'next/server'
import { extractTravelNotes } from '@/lib/ai/ollama'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, chatHistory } = body

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Nachricht ist erforderlich' },
        { status: 400 }
      )
    }

    const result = await extractTravelNotes(message, chatHistory || '')

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Notes extraction API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Fehler bei der Notizen-Extraktion'
      },
      { status: 500 }
    )
  }
}
