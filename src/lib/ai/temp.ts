// Temporäre AI-Integration ohne externe APIs
import { AIResponse } from '@/types'

export async function generateTempResponse(message: string): Promise<AIResponse> {
  // Einfache Regel-basierte Antworten für Tests
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('hallo') || lowerMessage.includes('hi')) {
    return {
      content: 'Hallo! Ich bin Ihr AI Reiseberater. Wie kann ich Ihnen bei der Urlaubsplanung helfen?',
      suggestions: ['Reiseziele vorschlagen', 'Budget planen', 'Aktivitäten erkunden']
    }
  }
  
  if (lowerMessage.includes('paris')) {
    return {
      content: 'Paris ist eine wundervolle Stadt! Hier sind meine Empfehlungen:\n\n1. Eiffelturm besuchen\n2. Louvre Museum\n3. Notre-Dame\n4. Champs-Élysées\n5. Montmartre\n\nMöchten Sie einen detaillierten Reiseplan für Paris?',
      suggestions: ['Reiseplan erstellen', 'Budget kalkulieren', 'Weitere Städte']
    }
  }
  
  if (lowerMessage.includes('budget') || lowerMessage.includes('kosten')) {
    return {
      content: 'Ich helfe Ihnen gerne bei der Budgetplanung! Wie viel möchten Sie ausgeben und für wie viele Tage?',
      suggestions: ['Budget eingeben', 'Kostengünstige Ziele', 'Spartipps']
    }
  }
  
  if (lowerMessage.includes('sommer') || lowerMessage.includes('2 wochen')) {
    return {
      content: 'Perfekt für einen Sommerurlaub! Basierend auf 2 Wochen würde ich empfehlen:\n\n- Südeuropa (Griechenland, Italien, Spanien)\n- Skandinavien für kühlere Temperaturen\n- Deutschland/Österreich für Kultur\n\nWas interessiert Sie am meisten?',
      suggestions: ['Südeuropa erkunden', 'Skandinavien entdecken', 'Kultururlaub']
    }
  }
  
  if (lowerMessage.includes('japan')) {
    return {
      content: 'Japan ist faszinierend! Hier sind meine Top-Empfehlungen:\n\n- Tokyo: Moderne Metropole\n- Kyoto: Traditionelle Tempel\n- Osaka: Kulinarische Highlights\n- Hiroshima: Historische Bedeutung\n\nMöchten Sie einen detaillierten Japan-Reiseplan?',
      suggestions: ['Japan-Reiseplan', 'Budget für Japan', 'Weitere asiatische Ziele']
    }
  }
  
  return {
    content: 'Danke für Ihre Nachricht! Ich bin Ihr AI Reiseberater und helfe Ihnen gerne bei der Urlaubsplanung. Erzählen Sie mir mehr über Ihre Wünsche und ich erstelle Ihnen einen personalisierten Reiseplan.',
    suggestions: ['Reiseziele vorschlagen', 'Budget besprechen', 'Aktivitäten planen']
  }
} 