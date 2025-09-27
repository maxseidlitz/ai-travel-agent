# 🧳 AI Travel Agent

Ein intelligenter Reiseberater, der vollständig lokal mit Ollama betrieben wird und Reisenden hilft, inspirierende, budgetfreundliche und strukturierte Reisepläne zu erstellen.

<p align="center">
  <strong>Planen · Vergleichen · Optimieren – alles in einem Chat.</strong>
</p>

---

## Inhaltsverzeichnis

1. [Überblick](#-überblick)
2. [Architektur & Komponenten](#-architektur--komponenten)
3. [Technologie-Stack](#-technologie-stack)
4. [Funktionsumfang](#-funktionsumfang)
5. [Schnellstart](#-schnellstart)
6. [Lokale Entwicklung](#-lokale-entwicklung)
7. [Konfiguration](#-konfiguration)
8. [Projektstruktur](#-projektstruktur)
9. [KI-Workflow](#-ki-workflow)
10. [Datenbankverwaltung](#-datenbankverwaltung)
11. [Qualitätssicherung](#-qualitätssicherung)
12. [Deployment](#-deployment)
13. [Troubleshooting & FAQ](#-troubleshooting--faq)
14. [Roadmap](#-roadmap)
15. [Beitragen](#-beitragen)
16. [Lizenz & Support](#-lizenz--support)

---

## 🌍 Überblick

Der **AI Travel Agent** kombiniert moderne Webtechnologien mit lokaler KI-Inferenz, um personalisierte Reiseerlebnisse bereitzustellen. Nutzer interagieren über einen Chat, während die Anwendung automatisch Notizen, Budgetübersichten, Sehenswürdigkeiten und Packlisten generiert. Der Fokus liegt auf Datenschutz (lokale Modelle), transparenter Kostenaufstellung und einer angenehmen Nutzererfahrung.

**Warum lokal?**

- Keine Weitergabe sensibler Reisedaten an Dritte
- Predictable Kosten ohne API Usage Fees
- Volle Kontrolle über Modelle, Prompting und Datenschutz

---

## 🏛️ Architektur & Komponenten

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
│  • Chat UI (React + Tailwind)                                │
│  • Reiseübersichten, Budget-Widgets, Karten                  │
└───────────────▲──────────────────────────────────────────────┘
                │ GraphQL/REST (Next.js API Routes)
┌───────────────┴──────────────────────────────────────────────┐
│                     Backend / App Router                     │
│  • API-Routen für Chat, Planning, Notizen                    │
│  • Server Actions für State-Management                       │
│  • Prisma Client für DB-Zugriff                              │
└───────────────▲──────────────────────────────────────────────┘
                │ Streaming über HTTP
┌───────────────┴──────────────────────────────────────────────┐
│                   KI Layer (Ollama Runtime)                  │
│  • Lokales Modell (Standard: mistral:7b)                     │
│  • Prompt Templates & Context Injection                      │
└───────────────▲──────────────────────────────────────────────┘
                │ Structured Output (JSON + Markdown)
┌───────────────┴──────────────────────────────────────────────┐
│                     Persistenz / Datenbank                   │
│  • SQLite (Default) / PostgreSQL (Prod)                      │
│  • Prisma Schema, Seeds, Migrationen                         │
└──────────────────────────────────────────────────────────────┘
```

---

## 🧰 Technologie-Stack

- **Framework:** Next.js 14 (App Router, Server Actions)
- **Programmiersprache:** TypeScript
- **Styling:** Tailwind CSS, Radix UI
- **State & Daten:** React Server Components, Prisma ORM
- **KI:** Ollama Runtime mit Mistral 7B (standardmäßig), austauschbar
- **Testing & Qualität:** ESLint, Playwright (optional), Jest/Vitest (optional)
- **Tooling:** pnpm/npm, Turbopack/Vite-ähnlicher Dev-Server, Docker

Weitere Details befinden sich in [TECHNOLOGY_STACK.md](./TECHNOLOGY_STACK.md).

---

## ✨ Funktionsumfang

- 🤖 **Kontextbezogener Chat:** Mehrstufige Dialogführung mit persistierendem Kontext
- 📝 **Automatische Notizen & ToDos:** Extrahiert Highlights, Checklisten und Erinnerungen aus dem Verlauf
- 🗺️ **Reiseziel-Vorschläge:** Vorschläge basierend auf Reisezeit, Budget und Interessen
- 💸 **Budgetüberwachung:** Tag-für-Tag Aufschlüsselung inkl. Transport, Unterkunft, Aktivitäten
- 🧭 **Reiseplan-Generator:** Liefert strukturierte Tagespläne als Markdown und JSON
- 📱 **Responsive UI:** Optimiert für Mobile, Tablet und Desktop
- 🔌 **Erweiterbarkeit:** Modularer Aufbau für weitere Modelle, externe APIs oder Payment-Integrationen

---

## 🚀 Schnellstart

### Voraussetzungen

| Tool        | Mindestversion | Hinweise |
|-------------|----------------|----------|
| Node.js     | ≥ 18.17        | Empfohlen: LTS 20.x |
| npm / pnpm  | npm ≥ 9        | Projekt nutzt npm Scripts, pnpm möglich |
| Git         | -              | Zum Klonen und Versionieren |
| Ollama      | ≥ 0.1.27       | Für lokale KI-Inferenz |
| PostgreSQL  | optional       | Für produktive Deployments |

### Installation in 7 Schritten

1. **Repository klonen**
   ```bash
   git clone https://github.com/ihr-username/ai-travel-agent.git
   cd ai-travel-agent
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen anlegen**
   ```bash
   cp env.example .env.local
   # Bearbeiten Sie .env.local nach Ihren Bedürfnissen
   ```

4. **Ollama installieren**
   ```bash
   # macOS
   brew install ollama

   # Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

5. **Ollama Runtime starten**
   ```bash
   ollama serve
   ```

6. **Modell herunterladen**
   ```bash
   ollama pull mistral:7b
   ```

7. **Entwicklungsserver starten**
   ```bash
   npm run dev
   # Öffne http://localhost:3000 im Browser
   ```

> 💡 Tipp: Nutzen Sie `./scripts/start-dev.sh`, um Schritte 5–7 automatisiert auszuführen.

---

## 🛠️ Lokale Entwicklung

### Komfort-Setup mit Skript

```bash
./scripts/start-dev.sh
```

Das Skript prüft, ob Ollama läuft, lädt bei Bedarf das Modell herunter und startet anschließend den Next.js Dev-Server.

### Nützliche NPM-Skripte

```bash
npm run dev           # Hot-Reload Development Server
npm run build         # Produktions-Build erzeugen
npm run start         # Produktionsserver starten
npm run lint          # ESLint Analyse ausführen
npm run format        # (Optional) Prettier über den Code laufen lassen
```

### Entwicklungs-Workflow

1. Features in Branches (`feature/<beschreibung>`) entwickeln
2. ESLint/Tests lokal ausführen
3. Datenbankmigrationen checken (`prisma migrate dev`)
4. Pull Request mit Screenshots/Notizen erstellen

---

## 🔧 Konfiguration

### Wichtige Umgebungsvariablen

| Variable            | Beschreibung                               | Beispielwert                    |
|---------------------|---------------------------------------------|---------------------------------|
| `OLLAMA_BASE_URL`   | Endpoint der Ollama Runtime                 | `http://localhost:11434`        |
| `OLLAMA_MODEL`      | Name des zu ladenden Modells                | `mistral:7b`                    |
| `DATABASE_URL`      | Prisma Datenbank-URL                        | `file:./dev.db` oder `postgresql://...` |
| `NEXTAUTH_SECRET`   | Secret für NextAuth Sessions                | `openssl rand -base64 32`       |
| `NEXTAUTH_URL`      | Öffentliche Basis-URL der Anwendung         | `http://localhost:3000`         |
| `LOG_LEVEL`         | (optional) Logging-Level                    | `info`                          |

Weitere Variablen finden Sie in [`env.example`](./env.example).

### Beispiel `.env.local`

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral:7b
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET=IhrGeheimesToken
NEXTAUTH_URL=http://localhost:3000
```

---

## 🗂️ Projektstruktur

```
ai-travel-agent/
├── prisma/                 # Prisma Schema, Migrationen & Seeds
├── public/                 # Statische Assets (Icons, Favicons, etc.)
├── scripts/                # Hilfsskripte (Start, Deployment)
├── src/
│   ├── app/                # Next.js App Router (Pages, Layouts, API)
│   │   ├── api/            # API-Routen (Edge/Node)
│   │   ├── chat/           # Chat-Erlebnis (Server & Client Komponenten)
│   │   └── planning/       # Planungs-Dashboards & Visualisierungen
│   ├── components/         # Wiederverwendbare UI-Komponenten
│   │   ├── chat/           # Chat-spezifische UI Elemente
│   │   ├── planning/       # Planungswidgets (Budget, Zeitpläne)
│   │   └── ui/             # Design System Elemente
│   ├── lib/                # Helper, Integrationen & Utility-Funktionen
│   │   ├── ai/             # Prompt-Templates, Response Parsing
│   │   ├── db/             # Prisma Client Wrapper
│   │   └── utils/          # Generische Utilities
│   └── types/              # TypeScript Typdefinitionen & Zod Schemas
└── ...
```

---

## 🧠 KI-Workflow

1. **Prompt-Erstellung** – User-Input wird mit Reisepräferenzen, Budget & bestehenden Notizen kombiniert.
2. **Modellaufruf** – Anfrage an Ollama (`/api/generate`) mit Streaming-Antwort.
3. **Post-Processing** – Markdown-Parsing, Extraktion strukturierter Daten (JSON für Notizen, Timeline, Budget).
4. **Persistierung** – Speicherung relevanter Datenpunkte in Prisma Models (z. B. `Trip`, `Itinerary`, `Message`).
5. **UI-Rendering** – Dynamische Komponenten aktualisieren Budgetdiagramme, Tagespläne und Checklisten.

### Modellwechsel

Sie können in `.env.local` alternative Modelle setzen:

```env
OLLAMA_MODEL=phi3:mini
```

Wenn das Modell lokal nicht existiert, lädt Ollama es beim ersten Aufruf automatisch herunter.

---

## 🗃️ Datenbankverwaltung

### SQLite (Standard für Entwicklung)

```bash
npx prisma migrate dev   # Erstellt dev.db und wendet Migrationen an
npx prisma studio        # Öffnet ein Web UI zur Dateninspektion
```

### PostgreSQL (Produktion)

```bash
export DATABASE_URL="postgresql://user:pass@host:5432/ai_travel"
npx prisma migrate deploy
```

### Seed-Daten

```bash
npx prisma db seed
```

Passen Sie `prisma/seed.ts` an, um Beispieltrips, Nutzer oder Templates zu hinterlegen.

### Datenbank zurücksetzen

```bash
npx prisma migrate reset
```

> ⚠️ Achtung: Löscht die komplette Datenbank und führt Seeds erneut aus.

---

## ✅ Qualitätssicherung

- **Linting:** `npm run lint`
- **Type Checking:** `tsc --noEmit`
- **E2E Tests (optional):** Playwright Setup möglich (`npx playwright test`)
- **CI/CD:** Empfohlen, GitHub Actions mit Checks für Linting, Tests, Build

### Empfohlener Pre-Commit Hook (Husky Beispiel)

```bash
npx husky add .husky/pre-commit "npm run lint"
```

---

## 🌐 Deployment

### Vercel (Empfohlen)

1. Repository importieren und Projekt erstellen.
2. Umgebungsvariablen aus `.env.local` im Dashboard hinterlegen.
3. Separate Ollama-Instanz bereitstellen (z. B. als eigener Server, Docker-Container, Railway).
4. `NEXTAUTH_URL` auf die Produktions-URL setzen.

### Docker & Docker Compose

```bash
docker build -t ai-travel-agent .
docker run -p 3000:3000 --env-file .env.production ai-travel-agent
```

Für lokale KI kann Ollama im Host laufen. Alternativ lässt sich ein Compose-Setup erstellen:

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env.production
    depends_on:
      - db
      - ollama
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: travel
      POSTGRES_PASSWORD: travel
      POSTGRES_DB: travel
  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
```

> Denken Sie daran, Modelle im Ollama-Container vorzubereiten (`ollama pull mistral:7b`).

### Produktions-Hardening

- Aktivieren Sie HTTPS, Rate Limiting und Authentifizierung.
- Überwachen Sie Ressourcenverbrauch des KI-Modells (RAM/VRAM).
- Nutzen Sie `npm run build` + `npm run start` statt `npm run dev`.

---

## 🆘 Troubleshooting & FAQ

| Problem | Mögliche Ursache | Lösung |
|---------|------------------|--------|
| `fetch failed` beim Chat | Ollama nicht erreichbar | Prüfen, ob `ollama serve` läuft und `OLLAMA_BASE_URL` stimmt |
| Modell lädt langsam | Modell wurde noch nie geladen | Frühzeitig `ollama pull <modell>` ausführen |
| Datenbank-Fehler | Migrationen fehlen | `npx prisma migrate dev` oder `prisma migrate deploy` |
| Styles fehlen | Tailwind Build nicht generiert | Dev-Server neu starten, `npm run build` ausführen |
| 404 bei API-Routen | Route im App Router nicht veröffentlicht | Prüfen Sie `src/app/api/*` und Exportpfade |

**FAQ**

- *Kann ich OpenAI oder andere APIs anbinden?* – Ja, über zusätzliche Provider im `src/lib/ai/` Modul.
- *Wie schalte ich Dark Mode ein?* – Derzeit geplant, aber via Tailwind `dark:` Utilities vorbereitbar.
- *Ist Mehrsprachigkeit vorgesehen?* – UI ist modular; i18n kann via `next-intl` ergänzt werden.

---

## 🧭 Roadmap

- [ ] Dark-Mode Styling
- [ ] Export von Reiseplänen (PDF/ICS)
- [ ] Integration externer Flug- & Hotel-APIs
- [ ] Team-Funktionen (geteilte Reisen, Kommentare)
- [ ] Offline-First & PWA-Modus

Aktuelle Anforderungen finden Sie in [REQUIREMENTS.md](./REQUIREMENTS.md).

---

## 🤝 Beitragen

1. Repository forken und lokalen Branch anlegen (`git checkout -b feature/<name>`)
2. Tests und Linting ausführen
3. Aussagekräftige Commits erstellen
4. Pull Request mit Beschreibung, Screenshots und Testnachweisen einreichen

Bitte beachten Sie unseren **Code of Conduct** (in Planung) und folgen Sie dem Styleguide in der Komponentenstruktur.

---

## 📄 Lizenz & Support

- **Lizenz:** MIT – siehe [LICENSE](./LICENSE)
- **Supportkanäle:**
  - 📧 E-Mail: support@example.com
  - 🐛 Issues: [GitHub Issues](https://github.com/ihr-username/ai-travel-agent/issues)
  - 📖 Wiki: [Projekt-Wiki](https://github.com/ihr-username/ai-travel-agent/wiki)

---

**Entwickelt mit ❤️ für inspirierende Reiseplanung.**
