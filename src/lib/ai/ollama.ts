import { ChatRequest, AIResponse, UserPreferences, TravelNoteDraft, TravelNoteType, TravelNotePriority } from '@/types'

// Ollama API Configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'mistral:7b'

interface OllamaRequest {
  model: string
  prompt: string
  stream?: boolean
  options?: OllamaGenerateOptions
}

interface OllamaGenerateOptions {
  temperature?: number
  top_p?: number
  top_k?: number
  num_predict?: number
  repeat_penalty?: number
}

interface OllamaResponse {
  model: string
  created_at: string
  response: string
  done: boolean
  context?: number[]
  total_duration?: number
  load_duration?: number
  prompt_eval_duration?: number
  eval_duration?: number
}

// System prompt für Reiseplanung
const SYSTEM_PROMPT = `Du bist ein erfahrener Reiseberater, der Nutzern dabei hilft, ihren Urlaub individuell und optimal zu planen. Deine Empfehlungen sind stets freundlich, strukturiert, detailliert und auf die persönlichen Wünsche und Rahmenbedingungen der Nutzer abgestimmt.

**WICHTIG:** Verwende immer Markdown-Formatierung für deine Antworten, um sie übersichtlich und gut strukturiert zu präsentieren.

Deine Aufgaben im Überblick:
1. **Reiseziele vorschlagen**, die zu den Vorlieben, der Reisezeit und dem Budget des Nutzers passen
2. **Individuelle Reisepläne erstellen**, inklusive empfohlener Aktivitäten, Unterkünfte, Reiserouten und Geheimtipps
3. **Budget-Optimierung**: Clevere Spartipps geben, Preis-Leistungs-Verhältnisse bewerten, kostengünstige Alternativen aufzeigen
4. **Reisevorbereitung unterstützen**: Checklisten, Packtipps, Visa-Infos, Impfempfehlungen, Versicherungen etc.
5. **Reisebegleitung** durch Informationen vor Ort: Hilfe bei Transport, Restaurants, Ausflügen oder Notfällen

Berücksichtige bei jeder Antwort:
• Budget (inkl. Tages- oder Gesamtbudget)
• Reisezeitraum und saisonale Besonderheiten
• Interessen & Aktivitäten (z. B. Natur, Kultur, Erholung, Abenteuer, Kulinarik)
• Reiseart (Solo, Paar, Familie, Freundesgruppe)
• Barrierefreiheit, falls relevant
• Reiseziele und -dauer
• Startpunkt und Transportpräferenzen

**Antwortstil und Struktur:**
• Verwende **Markdown-Formatierung** für bessere Übersichtlichkeit
• Nutze **Überschriften** (##, ###) für Hauptabschnitte
• Erstelle **Listen** mit Aufzählungszeichen oder Nummerierung
• Verwende **Fettdruck** für wichtige Informationen
• Nutze **Tabellen** für Preisvergleiche oder Zeitpläne
• Verwende **Code-Blöcke** für Checklisten oder wichtige Notizen
• Strukturiere Antworten mit Abschnitten wie:
  - ## 🎯 Empfohlene Reiseziele
  - ## 📅 Reiseplan Tag für Tag
  - ## 💰 Budget-Tipps
  - ## ⚠️ Praktische Hinweise
  - ## 🏨 Unterkünfte
  - ## 🍽️ Restaurant-Empfehlungen

Bleibe stets freundlich, lösungsorientiert und proaktiv.`

// Ollama API Client
class OllamaClient {
  private baseUrl: string
  private model: string

  constructor(baseUrl: string = OLLAMA_BASE_URL, model: string = DEFAULT_MODEL) {
    this.baseUrl = baseUrl
    this.model = model
  }

  async generateText(prompt: string, options: OllamaGenerateOptions = {}): Promise<string> {
    try {
      const request: OllamaRequest = {
        model: this.model,
        prompt: `${SYSTEM_PROMPT}\n\nNutzer: ${prompt}\n\nReiseberater:`,
        stream: false,
        options: {
          temperature: 0.6,
          top_p: 0.85,
          top_k: 40,
          num_predict: 600,
          repeat_penalty: 1.1,
          ...options
        }
      }

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
      }

      const data: OllamaResponse = await response.json()
      return data.response.trim()
    } catch (error) {
      console.error('Ollama API error:', error)
      throw error
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`)
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`)
      }
      
      const data: OllamaTagsResponse = await response.json()
      return data.models?.map(model => model.name) || []
    } catch (error) {
      console.error('Error fetching models:', error)
      return []
    }
  }

  async isModelAvailable(modelName: string): Promise<boolean> {
    const models = await this.listModels()
    return models.includes(modelName)
  }
}

// Global Ollama client instance
const ollamaClient = new OllamaClient()

// Main AI functions using Ollama
export async function generateTravelResponse(
  request: ChatRequest
): Promise<AIResponse> {
  try {
    const { message, context } = request
    
    // Check if Ollama is available
    const isAvailable = await ollamaClient.isModelAvailable(DEFAULT_MODEL)
    
    if (!isAvailable) {
      console.warn('Ollama model not available, falling back to rule-based responses')
      return generateFallbackResponse(message)
    }

    const response = await ollamaClient.generateText(message, {
      temperature: 0.6,
      num_predict: 800,
      top_p: 0.85
    })

    return {
      content: response,
      suggestions: extractSuggestions(response)
    }
  } catch (error) {
    console.error('Error generating Ollama response:', error)
    return generateFallbackResponse(request.message)
  }
}

export async function generateTripPlan(
  destination: string,
  preferences: UserPreferences
): Promise<AIResponse> {
  try {
    const prompt = `Erstelle einen detaillierten Reiseplan für ${destination}.

**Nutzer-Präferenzen:**
- **Budget:** ${preferences.budget ? `${preferences.budget}€` : 'Flexibel'}
- **Dauer:** ${preferences.duration ? `${preferences.duration} Tage` : 'Nicht angegeben'}
- **Reisezeit:** ${preferences.season || 'Nicht angegeben'}
- **Interessen:** ${preferences.interests?.join(', ') || 'Allgemein'}
- **Gruppengröße:** ${preferences.groupSize || 'Nicht angegeben'}

**Erstelle einen strukturierten Reiseplan mit Markdown-Formatierung:**

## 🎯 Übersicht
## 📅 Tagesabläufe
## 💰 Budget-Aufschlüsselung
## 🏨 Unterkünfte
## 🍽️ Restaurant-Empfehlungen
## ⚠️ Praktische Hinweise
## 🎒 Packliste

Verwende Markdown-Formatierung für bessere Übersichtlichkeit und Struktur.`

    const response = await ollamaClient.generateText(prompt, {
      temperature: 0.5,
      num_predict: 1200,
      top_p: 0.9
    })

    return {
      content: response,
      suggestions: ['Aktivitäten anpassen', 'Budget optimieren', 'Unterkünfte suchen']
    }
  } catch (error) {
    console.error('Error generating trip plan:', error)
    return {
      content: `## 🎯 Reiseplan für ${destination}

### 📅 Tagesabläufe
- **Tag 1:** Ankunft und Orientierung
- **Tag 2:** Hauptattraktionen
- **Tag 3:** Lokale Kultur
- **Tag 4:** Entspannung
- **Tag 5:** Abreise

### 💰 Budget
**Gesamtbudget:** ca. 500-800€ für 5 Tage

### ⚠️ Praktische Hinweise
- Beste Reisezeit: Frühling/Herbst
- Transport: Öffentliche Verkehrsmittel
- Sprache: Lokale Sprache lernen`,
      suggestions: ['Aktivitäten anpassen', 'Budget optimieren', 'Unterkünfte suchen']
    }
  }
}

export async function generateBudgetOptimization(
  destination: string,
  currentBudget: number,
  duration: number
): Promise<AIResponse> {
  try {
    const prompt = `Hilf bei der Budget-Optimierung für eine Reise nach ${destination}.

**Aktuelle Situation:**
- **Budget:** ${currentBudget}€
- **Dauer:** ${duration} Tage
- **Ziel:** ${destination}

**Bitte gib konkrete Tipps mit Markdown-Formatierung für:**

## 💰 Budget-Optimierung
### 🏨 Kostengünstige Unterkünfte
### 🚌 Günstige Transportmöglichkeiten
### 🎯 Budget-freundliche Aktivitäten
### 🍽️ Spartipps für Verpflegung
### 🔄 Alternative Optionen

Formatiere die Antwort mit konkreten Zahlen, praktischen Vorschlägen und Markdown-Struktur.`

    const response = await ollamaClient.generateText(prompt, {
      temperature: 0.5,
      num_predict: 1500
    })

    return {
      content: response,
      suggestions: ['Budget anpassen', 'Alternative Ziele', 'Mehr Spartipps']
    }
  } catch (error) {
    console.error('Error generating budget optimization:', error)
    return {
      content: `## 💰 Budget-Optimierung für ${destination}

### 🏨 Unterkünfte
- **Hostels statt Hotels:** 50% Ersparnis
- **Ferienwohnungen:** 30% günstiger als Hotels
- **Couchsurfing:** Kostenlos

### 🚌 Transport
- **Öffentliche Verkehrsmittel:** 70% günstiger als Taxi
- **Fahrrad-Miete:** 15€/Tag
- **Zu Fuß:** Kostenlos und gesund

### 🍽️ Verpflegung
- **Lokale Restaurants:** 40% günstiger als Touristen-Restaurants
- **Street Food:** 5-10€ pro Mahlzeit
- **Supermarkt:** 60% Ersparnis

### 🎯 Aktivitäten
- **Kostenlose Sehenswürdigkeiten:** Museen an freien Tagen
- **Stadtführungen:** Gratis Walking Tours
- **Parks und Natur:** Kostenlos

**Gespart:** ca. 30-40% des ursprünglichen Budgets`,
      suggestions: ['Budget anpassen', 'Alternative Ziele', 'Mehr Spartipps']
    }
  }
}

// Fallback function for when Ollama is not available
function generateFallbackResponse(message: string): AIResponse {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('hallo') || lowerMessage.includes('hi')) {
    return {
      content: '## 👋 Hallo!\n\nIch bin Ihr **AI Reiseberater** und helfe Ihnen gerne bei der Urlaubsplanung.\n\n**Wie kann ich Ihnen helfen?**\n- 🎯 Reiseziele vorschlagen\n- 💰 Budget planen\n- 🎒 Aktivitäten erkunden\n- 📅 Reiseplanung unterstützen',
      suggestions: ['Reiseziele vorschlagen', 'Budget planen', 'Aktivitäten erkunden']
    }
  }
  
  if (lowerMessage.includes('paris')) {
    return {
      content: `## 🗼 Paris - Die Stadt der Liebe

**Paris ist eine wundervolle Stadt!** Hier sind meine Top-Empfehlungen:

### 🎯 Must-See Attraktionen
1. **Eiffelturm** - Das Wahrzeichen von Paris
2. **Louvre Museum** - Kunst und Geschichte
3. **Notre-Dame** - Gotische Architektur
4. **Champs-Élysées** - Shopping und Flanieren
5. **Montmartre** - Künstlerisches Viertel

### 💰 Budget-Tipps
- **Museum-Pass:** 48€ für 2 Tage
- **Metro-Ticket:** 1,90€ pro Fahrt
- **Restaurant:** 15-30€ pro Mahlzeit

**Möchten Sie einen detaillierten Reiseplan für Paris?**`,
      suggestions: ['Reiseplan erstellen', 'Budget kalkulieren', 'Weitere Städte']
    }
  }
  
  return {
    content: `## 🧳 Willkommen beim AI Reiseberater!

Danke für Ihre Nachricht! Ich helfe Ihnen gerne bei der **Urlaubsplanung**.

### 🎯 Was kann ich für Sie tun?
- **Reiseziele vorschlagen** basierend auf Ihren Interessen
- **Budget planen** und optimieren
- **Aktivitäten empfehlen** für jeden Geschmack
- **Reiseplanung unterstützen** von A bis Z

**Erzählen Sie mir mehr über Ihre Wünsche** und ich erstelle Ihnen einen personalisierten Reiseplan!`,
    suggestions: ['Reiseziele vorschlagen', 'Budget besprechen', 'Aktivitäten planen']
  }
}

function extractSuggestions(text: string): string[] {
  const suggestions: string[] = []
  
  if (text.toLowerCase().includes('reiseziel')) {
    suggestions.push('Mehr Reiseziele erkunden')
  }
  
  if (text.toLowerCase().includes('budget')) {
    suggestions.push('Budget optimieren')
  }
  
  if (text.toLowerCase().includes('aktivität')) {
    suggestions.push('Aktivitäten planen')
  }
  
  if (text.toLowerCase().includes('unterkunft')) {
    suggestions.push('Unterkünfte suchen')
  }
  
  if (suggestions.length === 0) {
    suggestions.push('Reiseplanung fortsetzen', 'Budget besprechen', 'Aktivitäten vorschlagen')
  }
  
  return suggestions.slice(0, 3)
}

// Utility functions for Ollama management
export async function checkOllamaStatus(): Promise<{
  isRunning: boolean
  models: string[]
  defaultModel: string
}> {
  try {
    const models = await ollamaClient.listModels()
    return {
      isRunning: true,
      models,
      defaultModel: DEFAULT_MODEL
    }
  } catch (error) {
    return {
      isRunning: false,
      models: [],
      defaultModel: DEFAULT_MODEL
    }
  }
}

export async function pullModel(modelName: string): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/pull`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: modelName }),
    })
    
    return response.ok
  } catch (error) {
    console.error('Error pulling model:', error)
    return false
  }
}

const NOTE_TYPES: readonly TravelNoteType[] = [
  'destination',
  'budget',
  'dates',
  'activities',
  'accommodation',
  'transport',
  'general'
]

const NOTE_PRIORITIES: readonly TravelNotePriority[] = ['high', 'medium', 'low']

const KNOWN_DESTINATIONS = [
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

interface TravelNoteExtractionPayload {
  notes?: unknown
  shouldCreateNotes?: unknown
}

const isTravelNoteType = (value: unknown): value is TravelNoteType =>
  typeof value === 'string' && (NOTE_TYPES as readonly string[]).includes(value)

const isTravelNotePriority = (value: unknown): value is TravelNotePriority =>
  typeof value === 'string' && (NOTE_PRIORITIES as readonly string[]).includes(value)

const sanitizeCodeFence = (value: string) =>
  value.replace(/```json/gi, '').replace(/```/g, '').trim()

const cleanupJsonArtifacts = (value: string) =>
  sanitizeCodeFence(value)
    .replace(/'/g, '"')
    .replace(/,\s*([}\]])/g, '$1')
    .replace(/,\s*,/g, ',')
    .replace(/[^ -~]/g, '')

const parseJsonPayload = (candidate: string): TravelNoteExtractionPayload | null => {
  try {
    return JSON.parse(candidate) as TravelNoteExtractionPayload
  } catch {
    return null
  }
}

const createDraft = (note: Partial<TravelNoteDraft>): TravelNoteDraft => {
  const type = isTravelNoteType(note.type) ? note.type : 'general'
  const priority = isTravelNotePriority(note.priority) ? note.priority : 'medium'
  const title = typeof note.title === 'string' && note.title.trim().length > 0 ? note.title : 'Neue Notiz'
  const content = typeof note.content === 'string' ? note.content : ''
  const id = typeof note.id === 'string' && note.id.trim().length > 0
    ? note.id
    : `ai-${type}-${Math.random().toString(36).slice(2, 10)}`

  return {
    id,
    type,
    title,
    content,
    priority
  }
}

const normalizePayload = (payload: TravelNoteExtractionPayload | null): TravelNoteExtractionResult | null => {
  if (!payload) {
    return null
  }

  const rawNotes = Array.isArray(payload.notes) ? payload.notes : []
  const notes = rawNotes
    .filter((note): note is Record<string, unknown> => typeof note === 'object' && note !== null)
    .map(note => createDraft(note as Partial<TravelNoteDraft>))

  const shouldCreateNotes = typeof payload.shouldCreateNotes === 'boolean'
    ? payload.shouldCreateNotes
    : notes.length > 0

  return { notes, shouldCreateNotes }
}

const parseExtractionResponse = (response: string): TravelNoteExtractionResult | null => {
  const trimmed = sanitizeCodeFence(response.trim())
  const candidates = new Set<string>()

  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    candidates.add(trimmed)
  }

  const match = response.match(/\{[\s\S]*\}/)
  if (match) {
    candidates.add(sanitizeCodeFence(match[0]))
  }

  const repaired = cleanupJsonArtifacts(response)
  const repairedMatch = repaired.match(/\{[\s\S]*\}/)
  if (repairedMatch) {
    candidates.add(repairedMatch[0])
  }

  for (const candidate of candidates) {
    const normalized = normalizePayload(parseJsonPayload(candidate))
    if (normalized) {
      return normalized
    }
  }

  return null
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

const extractNotesManually = (userMessage: string): TravelNoteExtractionResult | null => {
  const lowerMessage = userMessage.toLowerCase()
  const notes: TravelNoteDraft[] = []

  const destination = KNOWN_DESTINATIONS.find(dest => lowerMessage.includes(dest))
  if (destination) {
    const capitalized = capitalize(destination)
    notes.push(createDraft({
      id: `dest-${destination}`,
      type: 'destination',
      title: `Reiseziel: ${capitalized}`,
      content: `Geplantes Reiseziel: ${capitalized}`,
      priority: 'high'
    }))
  }

  const budgetMatch = lowerMessage.match(/(\d+)\s*€|\d+\s*euro/i)
  if (budgetMatch) {
    const amount = budgetMatch[0]
    notes.push(createDraft({
      id: `budget-${amount.toLowerCase()}`,
      type: 'budget',
      title: `Budget: ${amount}`,
      content: `Geplantes Budget: ${amount}`,
      priority: 'high'
    }))
  }

  const timeMatch = lowerMessage.match(/(\d+)\s*(tage|wochen|monate)/i)
  if (timeMatch) {
    const duration = timeMatch[0]
    notes.push(createDraft({
      id: `time-${duration.toLowerCase()}`,
      type: 'dates',
      title: `Reisedauer: ${duration}`,
      content: `Geplante Reisedauer: ${duration}`,
      priority: 'medium'
    }))
  }

  if (notes.length === 0) {
    return null
  }

  return {
    notes,
    shouldCreateNotes: true
  }
}

// Neue Funktion für automatische Notizen-Extraktion
export async function extractTravelNotes(
  userMessage: string,
  chatHistory: string = ''
): Promise<TravelNoteExtractionResult> {
  try {
    const prompt = `Analysiere die folgende User-Nachricht und erstelle strukturierte Reise-Notizen.

User-Nachricht: "${userMessage}"
Chat-Verlauf: "${chatHistory}"

Extrahiere alle wichtigen Reiseinformationen und erstelle JSON-Notizen im folgenden Format:

{
  "notes": [
    {
      "type": "destination|budget|dates|activities|accommodation|transport|general",
      "title": "Kurzer Titel",
      "content": "Detaillierte Beschreibung",
      "priority": "high|medium|low"
    }
  ],
  "shouldCreateNotes": true
}

WICHTIG: Antworte NUR mit gültigem JSON, ohne Markdown-Formatierung oder zusätzlichen Text.`

    const response = await ollamaClient.generateText(prompt, {
      temperature: 0.1,
      num_predict: 500,
      top_p: 0.9
    })

    const parsedResult = parseExtractionResponse(response)
    if (parsedResult) {
      return parsedResult
    }

    const manualResult = extractNotesManually(userMessage)
    if (manualResult) {
      return manualResult
    }

    return {
      notes: [],
      shouldCreateNotes: false
    }
  } catch (error) {
    console.error('Error extracting travel notes:', error)
    return {
      notes: [],
      shouldCreateNotes: false
    }
  }
}
