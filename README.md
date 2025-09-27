# 🧳 AI Travel Agent

Ein intelligenter Reiseberater, der mit lokaler KI (Ollama) arbeitet und Ihnen bei der Urlaubsplanung hilft.

## ✨ Features

- 🤖 **Lokale KI-Verarbeitung** mit Ollama
- 💬 **Intelligenter Chat** mit Markdown-Unterstützung
- 📝 **Automatische Notizen-Extraktion** aus Gesprächen
- 🎨 **Moderne UI** mit Tailwind CSS
- 📱 **Responsive Design** für alle Geräte
- 🔄 **Echtzeit-Reiseplanung** mit strukturierten Antworten
- 💰 **Budget-Optimierung** und Spartipps
- 🗺️ **Reiseziel-Empfehlungen** basierend auf Präferenzen

## 🚀 Schnellstart

### Voraussetzungen

- Node.js 18+ 
- Git
- Ollama (für lokale KI)
- PostgreSQL (optional, für Datenbank)

### Installation

1. **Repository klonen**
   ```bash
   git clone https://github.com/ihr-username/ai-travel-agent.git
   cd ai-travel-agent
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**
   ```bash
   cp env.example .env.local
   # Bearbeiten Sie .env.local mit Ihren Einstellungen
   ```

4. **Ollama installieren und starten**
   ```bash
   # macOS
   brew install ollama
   ollama serve
   
   # Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   ollama serve
   ```

5. **Standard-Modell herunterladen**
   ```bash
   ollama pull qwen2.5:7b
   ```

6. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

7. **Anwendung öffnen**
   ```
   http://localhost:3000
   ```

## 🛠️ Entwicklung

### Automatischer Start

Verwenden Sie das Start-Skript für automatische Initialisierung:

```bash
./scripts/start-dev.sh
```

Dies startet automatisch:
- Ollama (falls nicht läuft)
- Lädt das Standard-Modell herunter
- Startet den Next.js Development Server

### Verfügbare Scripts

```bash
npm run dev          # Startet Entwicklungsumgebung
npm run build        # Erstellt Produktions-Build
npm run start        # Startet Produktions-Server
npm run lint         # Führt ESLint aus
```

## 🏗️ Projektstruktur

```
AI-Travel-Agent/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API-Routen
│   │   ├── chat/           # Chat-Seiten
│   │   └── planning/       # Planungs-Seiten
│   ├── components/         # React-Komponenten
│   │   ├── chat/          # Chat-Komponenten
│   │   ├── planning/      # Planungs-Komponenten
│   │   └── ui/            # UI-Komponenten
│   ├── lib/               # Utility-Funktionen
│   │   ├── ai/           # KI-Integration
│   │   ├── db/           # Datenbank-Funktionen
│   │   └── utils/        # Allgemeine Utilities
│   └── types/            # TypeScript-Typen
├── prisma/               # Datenbankschema
├── scripts/              # Hilfsskripte
└── public/               # Statische Dateien
```

## 🤖 KI-Integration

### Ollama-Konfiguration

Das Projekt verwendet Ollama für lokale KI-Verarbeitung:

- **Standard-Modell**: `qwen2.5:7b` (starkes mehrsprachiges Verständnis)
- **Alternative Modelle**: `mistral:7b`, `llama3.1:8b`
- **API-Endpunkt**: `http://localhost:11434`

### Markdown-Unterstützung

KI-Antworten werden mit Markdown formatiert:
- Überschriften und Abschnitte
- Listen und Aufzählungen
- Tabellen für Preisvergleiche
- Code-Blöcke für Checklisten
- Links und Formatierung

## 📊 Datenbank

### PostgreSQL (Optional)

```bash
# Datenbank initialisieren
npx prisma db push

# Migrationen ausführen
npx prisma migrate dev
```

### SQLite (Standard)

Für einfache Entwicklung wird SQLite verwendet.

## 🎨 UI/UX

- **Design-System**: Tailwind CSS
- **Komponenten**: Modulare React-Komponenten
- **Responsive**: Mobile-First Design
- **Accessibility**: WCAG-konform
- **Dark Mode**: Unterstützt (geplant)

## 🔧 Konfiguration

### Umgebungsvariablen

```env
# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b

# Datenbank
DATABASE_URL="file:./dev.db"

# Next.js
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

## 🚀 Deployment

### Vercel (Empfohlen)

1. Repository zu Vercel verbinden
2. Umgebungsvariablen konfigurieren
3. Ollama-Instanz bereitstellen (z.B. mit Railway)

### Docker

```bash
# Docker Image erstellen
docker build -t ai-travel-agent .

# Container starten
docker run -p 3000:3000 ai-travel-agent
```

## 🤝 Beitragen

1. Fork des Repositories
2. Feature-Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add some AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## 📝 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 🙏 Danksagungen

- [Ollama](https://ollama.ai) für lokale KI-Verarbeitung
- [Next.js](https://nextjs.org) für das Framework
- [Tailwind CSS](https://tailwindcss.com) für das Styling
- [Prisma](https://prisma.io) für die Datenbank-Integration

## 📞 Support

Bei Fragen oder Problemen:

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/ihr-username/ai-travel-agent/issues)
- 📖 Dokumentation: [Wiki](https://github.com/ihr-username/ai-travel-agent/wiki)

---

**Entwickelt mit ❤️ für bessere Reiseplanung**
