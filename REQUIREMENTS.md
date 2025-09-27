# 📋 Requirements & Setup Guide - AI Travel Agent

## 🎯 Projekt-Übersicht

AI Travel Agent ist eine Next.js-basierte Webanwendung mit integrierter KI für Reiseplanung. Das Projekt verwendet Ollama für lokale KI-Verarbeitung und Prisma für Datenbankmanagement.

---

## 🖥️ System-Anforderungen

### Mindestanforderungen
- **Betriebssystem**: macOS 10.15+, Ubuntu 18.04+, Windows 10+
- **RAM**: 8GB (16GB empfohlen für bessere Performance)
- **Speicher**: 10GB freier Speicherplatz
- **CPU**: Multi-Core Prozessor (Apple Silicon M1/M2 empfohlen)
- **GPU**: Optional, aber empfohlen für bessere KI-Performance

### Empfohlene Hardware
- **RAM**: 16GB+
- **Speicher**: SSD mit 20GB+ freiem Speicherplatz
- **GPU**: Apple Silicon M1/M2, NVIDIA RTX 3060+ oder AMD RX 6600+

---

## 🔧 Voraussetzungen installieren

### 1. Node.js & npm
```bash
# macOS (mit Homebrew)
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows
# Download von https://nodejs.org/en/download/

# Version prüfen
node --version  # Sollte 20.x oder höher sein
npm --version   # Sollte 10.x oder höher sein
```

### 2. Git
```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt-get install git

# Windows
# Download von https://git-scm.com/download/win

# Konfiguration
git config --global user.name "Ihr Name"
git config --global user.email "ihre.email@example.com"
```

### 3. Ollama (KI-Engine)
```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# Download von https://ollama.ai/download

# Version prüfen
ollama --version
```

### 4. PostgreSQL (Datenbank)
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Windows
# Download von https://www.postgresql.org/download/windows/

# Datenbank erstellen
createdb ai_travel_agent
```

### 5. Optional: Docker (für Container-basierte Entwicklung)
```bash
# macOS
brew install --cask docker

# Ubuntu/Debian
sudo apt-get install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# Windows
# Download von https://www.docker.com/products/docker-desktop/
```

---

## 📦 Projekt-Setup

### 1. Repository klonen
```bash
git clone https://github.com/ihr-username/ai-travel-agent.git
cd ai-travel-agent
```

### 2. Dependencies installieren
```bash
# NPM Dependencies installieren
npm install

# Oder mit Yarn (falls bevorzugt)
yarn install

# Oder mit pnpm (schneller)
npm install -g pnpm
pnpm install
```

### 3. Environment Variables konfigurieren
```bash
# .env.local erstellen
cp .env.example .env.local
```

**Wichtige Environment Variables:**
```env
# Datenbank
DATABASE_URL="postgresql://username:password@localhost:5432/ai_travel_agent"

# Ollama Konfiguration
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="qwen2.5:7b"

# NextAuth (falls Authentifizierung benötigt)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Optional: OpenAI (als Fallback)
OPENAI_API_KEY="your-openai-api-key"
```

### 4. Datenbank initialisieren
```bash
# Prisma Client generieren
npx prisma generate

# Datenbank-Migrationen ausführen
npx prisma migrate dev

# Optional: Seed-Daten laden
npx prisma db seed
```

### 5. Ollama Modell herunterladen
```bash
# Standard-Modell herunterladen (kann mehrere Minuten dauern)
ollama pull qwen2.5:7b

# Alternative Modelle (je nach Ressourcen)
ollama pull mistral:7b
ollama pull qwen2.5:3b
```

---

## 🚀 Entwicklung starten

### Automatischer Start (Empfohlen)
```bash
# Startet automatisch Ollama und Next.js
npm run dev
```

### Manueller Start
```bash
# Terminal 1: Ollama starten
ollama serve

# Terminal 2: Next.js starten
npm run dev:next
```

### Build für Produktion
```bash
# Production Build erstellen
npm run build

# Production Server starten
npm start
```

---

## 📚 Verfügbare Scripts

```bash
# Development
npm run dev              # Startet Ollama + Next.js automatisch
npm run dev:next         # Nur Next.js Development Server
npm run dev:ollama       # Nur Ollama Server

# Build & Deploy
npm run build           # Production Build
npm run start           # Production Server
npm run lint            # Code Linting
npm run type-check      # TypeScript Prüfung

# Datenbank
npx prisma generate     # Prisma Client generieren
npx prisma migrate dev  # Migrationen ausführen
npx prisma studio       # Datenbank GUI öffnen
npx prisma db seed      # Seed-Daten laden

# Ollama
ollama list             # Verfügbare Modelle anzeigen
ollama pull <model>     # Modell herunterladen
ollama run <model>      # Modell direkt testen
```

---

## 🔍 Troubleshooting

### Häufige Probleme

#### 1. Ollama startet nicht
```bash
# Port prüfen
lsof -i :11434

# Ollama neu starten
pkill ollama
ollama serve
```

#### 2. Datenbank-Verbindung fehlschlägt
```bash
# PostgreSQL Status prüfen
sudo systemctl status postgresql

# Datenbank-Verbindung testen
psql -h localhost -U postgres -d ai_travel_agent
```

#### 3. Modell nicht gefunden
```bash
# Verfügbare Modelle prüfen
ollama list

# Modell neu herunterladen
ollama pull qwen2.5:7b
```

#### 4. Speicherplatz knapp
```bash
# Ollama Cache löschen
rm -rf ~/.ollama

# Node modules neu installieren
rm -rf node_modules
npm install
```

#### 5. Port 3000 bereits belegt
```bash
# Prozess finden
lsof -i :3000

# Prozess beenden
kill -9 <PID>
```

---

## 🛠️ Entwicklungstools

### Empfohlene IDEs
- **VS Code** mit Extensions:
  - TypeScript Importer
  - Tailwind CSS IntelliSense
  - Prisma
  - ESLint
  - Prettier
  - GitLens

### Browser Extensions
- React Developer Tools
- Redux DevTools (falls Redux verwendet wird)

### Terminal Tools
- **Oh My Zsh** (macOS/Linux)
- **PowerShell** (Windows)
- **iTerm2** (macOS)

---

## 📊 Performance-Optimierung

### Ollama Optimierung
```bash
# GPU-Beschleunigung aktivieren (falls verfügbar)
export OLLAMA_HOST=0.0.0.0
export OLLAMA_ORIGINS=*

# Kleinere Modelle für bessere Performance
ollama pull qwen2.5:0.5b  # ~1GB
ollama pull qwen2.5:3b    # ~2GB
ollama pull qwen2.5:7b    # ~4GB
```

### Next.js Optimierung
```bash
# Turbopack verwenden (schneller als Webpack)
npm run dev -- --turbo

# Production Build optimieren
npm run build
npm run start
```

---

## 🔒 Sicherheit

### Environment Variables
- Niemals `.env` Dateien committen
- Sichere Secrets verwenden
- Production-Keys von Development-Keys trennen

### Datenbank
- Sichere Passwörter verwenden
- Regelmäßige Backups erstellen
- Zugriff auf localhost beschränken

### Ollama
- Nur lokale Verbindungen erlauben
- Firewall konfigurieren
- Regelmäßige Updates

---

## 📈 Monitoring & Logs

### Logs anzeigen
```bash
# Next.js Logs
npm run dev 2>&1 | tee logs/nextjs.log

# Ollama Logs
ollama serve 2>&1 | tee logs/ollama.log

# System Logs
tail -f /var/log/syslog  # Linux
log show --predicate 'process == "ollama"' --last 1h  # macOS
```

### Performance Monitoring
```bash
# System-Ressourcen
htop
nvidia-smi  # Falls NVIDIA GPU

# Netzwerk
netstat -tulpn | grep :11434
netstat -tulpn | grep :3000
```

---

## 🚀 Deployment

### Vercel (Empfohlen)
```bash
# Vercel CLI installieren
npm i -g vercel

# Deploy
vercel

# Environment Variables in Vercel Dashboard setzen
```

### Docker
```bash
# Docker Image bauen
docker build -t ai-travel-agent .

# Container starten
docker run -p 3000:3000 ai-travel-agent
```

### Self-Hosted
```bash
# Production Build
npm run build

# PM2 für Process Management
npm install -g pm2
pm2 start npm --name "ai-travel-agent" -- start
```

---

## 📞 Support

### Dokumentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Ollama Docs](https://ollama.ai/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Community
- GitHub Issues
- Discord Server
- Stack Overflow

### Debugging
```bash
# Debug-Modus aktivieren
DEBUG=* npm run dev

# Ollama Debug
OLLAMA_DEBUG=1 ollama serve
```

---

**Viel Erfolg beim Entwickeln! 🚀** 