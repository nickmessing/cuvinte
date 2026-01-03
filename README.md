# Joc de Cuvinte

O aplicație de joc în limba română pentru verificarea și înregistrarea cuvintelor folosite de jucători.

## Caracteristici

- 🎮 **Gestionare Jucători**: Adaugă jucători înainte de a începe jocul
- 📝 **Validare Cuvinte**: Verifică automat dacă cuvintele există în dicționar folosind Dexonline
- 🔍 **Istoric**: Urmărește cine a spus ce cuvânt și când
- 📊 **Statistici**: Vezi câte cuvinte a spus fiecare jucător
- 📱 **Mobile-First**: Optimizat pentru dispozitive mobile

## Stack Tehnologic

- **Frontend**: Vue.js 3 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **API**: Dexonline Scraper pentru verificarea cuvintelor
- **Monorepo**: pnpm workspace

## Instalare

### Cerințe

- Node.js 18+ (suportă native TypeScript execution)
- pnpm

### Pași

1. Clonează repository-ul:
```bash
git clone <repository-url>
cd cuvinte
```

2. Instalează dependențele:
```bash
pnpm install
```

## Rulare

### Dezvoltare

Pentru a rula ambele servere (frontend și backend) în paralel:

```bash
pnpm dev
```

Sau pentru a le rula separat:

**Backend** (pe portul 3000):
```bash
pnpm backend
```

**Frontend** (pe portul 5173):
```bash
pnpm frontend
```

### Producție

Build pentru producție:
```bash
pnpm build
```

## Structura Proiectului

```
cuvinte/
├── packages/
│   ├── backend/          # Server Node.js + Express
│   │   ├── src/
│   │   │   └── index.ts  # API pentru validare cuvinte
│   │   └── package.json
│   └── frontend/         # Aplicație Vue.js
│       ├── src/
│       │   ├── components/    # Componente Vue
│       │   ├── composables/   # Vue composables
│       │   ├── types/         # TypeScript types
│       │   ├── App.vue        # Componenta principală
│       │   └── main.ts
│       └── package.json
├── pnpm-workspace.yaml
└── package.json
```

## Cum se Joacă

1. **Adaugă Jucători**: Introdu numele jucătorilor (minimum 2)
2. **Începe Jocul**: Apasă butonul "Începe Jocul"
3. **Adaugă Cuvinte**:
   - Introdu un cuvânt
   - Selectează jucătorul care l-a spus
   - Aplicația verifică automat:
     - Dacă cuvântul există în dicționar
     - Dacă cuvântul a mai fost folosit anterior
4. **Urmărește Progresul**: Vezi statistici și istoric în timp real

## API Endpoints

### POST `/api/validate-word`

Verifică dacă un cuvânt există în Dexonline.

**Request:**
```json
{
  "word": "exemplu"
}
```

**Response (cuvânt valid):**
```json
{
  "exists": true,
  "word": "exemplu",
  "definition": "Definiție din Dexonline...",
  "fullData": { ... }
}
```

**Response (cuvânt invalid):**
```json
{
  "exists": false,
  "word": "exemplu",
  "definition": ""
}
```

## Licență

MIT
