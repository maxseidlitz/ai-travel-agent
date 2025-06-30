#!/bin/bash

# Farben für bessere Ausgabe
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AI Travel Agent - Quick Start Setup${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Funktion zum Prüfen von Kommandos
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $1 ist installiert${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 ist NICHT installiert${NC}"
        return 1
    fi
}

# Funktion zum Ausführen von Kommandos mit Fehlerbehandlung
run_command() {
    echo -e "${BLUE}🔄 Führe aus: $1${NC}"
    if eval $1; then
        echo -e "${GREEN}✅ Erfolgreich: $1${NC}"
        return 0
    else
        echo -e "${RED}❌ Fehler bei: $1${NC}"
        return 1
    fi
}

echo -e "${YELLOW}📋 Prüfe Voraussetzungen...${NC}"
echo ""

# Prüfe Node.js
if ! check_command "node"; then
    echo -e "${RED}❌ Node.js ist erforderlich!${NC}"
    echo -e "${YELLOW}Installation:${NC}"
    echo "  macOS: brew install node"
    echo "  Linux: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"
    echo "  Windows: https://nodejs.org/en/download/"
    exit 1
fi

# Prüfe npm
if ! check_command "npm"; then
    echo -e "${RED}❌ npm ist erforderlich!${NC}"
    exit 1
fi

# Prüfe Git
if ! check_command "git"; then
    echo -e "${RED}❌ Git ist erforderlich!${NC}"
    echo -e "${YELLOW}Installation:${NC}"
    echo "  macOS: brew install git"
    echo "  Linux: sudo apt-get install git"
    echo "  Windows: https://git-scm.com/download/win"
    exit 1
fi

# Prüfe Ollama
if ! check_command "ollama"; then
    echo -e "${YELLOW}⚠️  Ollama ist nicht installiert${NC}"
    echo -e "${YELLOW}Installation:${NC}"
    echo "  macOS: brew install ollama"
    echo "  Linux: curl -fsSL https://ollama.ai/install.sh | sh"
    echo "  Windows: https://ollama.ai/download"
    echo ""
    read -p "Möchten Sie fortfahren ohne Ollama? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}✅ Alle Voraussetzungen erfüllt!${NC}"
echo ""

# Node.js Version prüfen
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js Version 18+ erforderlich (aktuell: $(node -v))${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Installiere Dependencies...${NC}"
if ! run_command "npm install"; then
    echo -e "${RED}❌ Fehler beim Installieren der Dependencies${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔧 Konfiguriere Environment Variables...${NC}"

# Prüfe ob .env.local existiert
if [ ! -f ".env.local" ]; then
    if [ -f "env.example" ]; then
        echo -e "${BLUE}📝 Erstelle .env.local aus env.example...${NC}"
        cp env.example .env.local
        echo -e "${GREEN}✅ .env.local erstellt${NC}"
        echo -e "${YELLOW}⚠️  Bitte bearbeiten Sie .env.local mit Ihren Einstellungen${NC}"
    else
        echo -e "${YELLOW}⚠️  Keine env.example gefunden, erstelle minimale .env.local...${NC}"
        cat > .env.local << EOF
# Minimal-Konfiguration für lokale Entwicklung
DATABASE_URL="postgresql://postgres:password@localhost:5432/ai_travel_agent"
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.1:8b"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
EOF
        echo -e "${GREEN}✅ .env.local erstellt${NC}"
    fi
else
    echo -e "${GREEN}✅ .env.local existiert bereits${NC}"
fi

echo ""
echo -e "${YELLOW}🗄️  Initialisiere Datenbank...${NC}"

# Prüfe ob Prisma installiert ist
if [ -d "node_modules/@prisma" ]; then
    echo -e "${BLUE}🔄 Generiere Prisma Client...${NC}"
    if run_command "npx prisma generate"; then
        echo -e "${GREEN}✅ Prisma Client generiert${NC}"
    else
        echo -e "${YELLOW}⚠️  Prisma Client konnte nicht generiert werden${NC}"
    fi
    
    echo -e "${BLUE}🔄 Führe Datenbank-Migrationen aus...${NC}"
    if run_command "npx prisma migrate dev --name init"; then
        echo -e "${GREEN}✅ Datenbank-Migrationen ausgeführt${NC}"
    else
        echo -e "${YELLOW}⚠️  Migrationen konnten nicht ausgeführt werden${NC}"
        echo -e "${YELLOW}Möglicherweise ist PostgreSQL nicht installiert oder läuft nicht${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Prisma nicht gefunden, überspringe Datenbank-Setup${NC}"
fi

echo ""
echo -e "${YELLOW}🤖 Konfiguriere Ollama...${NC}"

if command -v ollama &> /dev/null; then
    echo -e "${BLUE}🔄 Prüfe verfügbare Modelle...${NC}"
    if ollama list | grep -q "llama3.1:8b"; then
        echo -e "${GREEN}✅ Standard-Modell ist verfügbar${NC}"
    else
        echo -e "${YELLOW}📥 Lade Standard-Modell herunter...${NC}"
        echo -e "${YELLOW}Dies kann mehrere Minuten dauern...${NC}"
        if run_command "ollama pull llama3.1:8b"; then
            echo -e "${GREEN}✅ Modell erfolgreich heruntergeladen${NC}"
        else
            echo -e "${RED}❌ Fehler beim Herunterladen des Modells${NC}"
            echo -e "${YELLOW}Sie können das Modell später manuell herunterladen: ollama pull llama3.1:8b${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Ollama nicht installiert, überspringe Modell-Setup${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Setup abgeschlossen!${NC}"
echo ""
echo -e "${BLUE}📋 Nächste Schritte:${NC}"
echo "1. Bearbeiten Sie .env.local mit Ihren Einstellungen"
echo "2. Starten Sie die Anwendung mit: npm run dev"
echo "3. Öffnen Sie http://localhost:3000 in Ihrem Browser"
echo ""
echo -e "${BLUE}📚 Weitere Informationen:${NC}"
echo "- README.md - Projekt-Übersicht"
echo "- REQUIREMENTS.md - Detaillierte Setup-Anleitung"
echo "- TECHNOLOGY_STACK.md - Technologie-Stack"
echo ""
echo -e "${YELLOW}🚀 Viel Erfolg beim Entwickeln!${NC}" 