#!/bin/bash

# Farben für bessere Ausgabe
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AI Travel Agent - Development Server${NC}"
echo ""

# Prüfe ob Ollama installiert ist
if command -v ollama &> /dev/null; then
    echo -e "${GREEN}✅ Ollama ist installiert${NC}"

    # Prüfe ob Ollama läuft
    if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo -e "${YELLOW}🔄 Starte Ollama...${NC}"
        ollama serve &
        sleep 2
    else
        echo -e "${GREEN}✅ Ollama läuft bereits${NC}"
    fi

    # Prüfe ob das Modell verfügbar ist
    MODEL=${OLLAMA_MODEL:-"mistral:7b"}
    if ! ollama list 2>/dev/null | grep -q "$MODEL"; then
        echo -e "${YELLOW}📥 Lade Modell ${MODEL} herunter...${NC}"
        ollama pull "$MODEL"
    else
        echo -e "${GREEN}✅ Modell ${MODEL} ist verfügbar${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Ollama ist nicht installiert - KI-Funktionen sind eingeschränkt${NC}"
fi

echo ""
echo -e "${BLUE}🔄 Starte Next.js Development Server...${NC}"
exec npx next dev --turbopack
