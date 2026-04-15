# Inversion-

Plataforma personal de análisis de inversiones para el mercado argentino.

## Módulos
- **Inicio** — resumen ejecutivo diario con señales top
- **Análisis** — mercado + señales IA + actualidad unificados
- **Portafolio** — posiciones, rendimiento, simulador e historial
- **Aprender** — guías interactivas por instrumento

## Stack
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + Socket.io
- **Base de datos**: PostgreSQL 15
- **ML**: Python + scikit-learn
- **IA**: Claude API (Anthropic)

## Setup rápido
```bash
# 1. Base de datos
psql -U postgres -c "CREATE DATABASE invar;"
psql -U postgres -d invar -f backend/src/db/schema.sql
psql -U postgres -d invar -f backend/src/db/schema_ml.sql

# 2. Backend
cd backend && cp .env.example .env
npm install && npm run dev

# 3. Frontend
cd frontend && cp .env.example .env
npm install && npm run dev

# 4. ML (opcional)
cd ml && pip install -r requirements.txt
```

## Documentación
Ver `/docs/` para especificación técnica completa.

## Variables de entorno
Ver `backend/.env.example` y `frontend/.env.example`.
