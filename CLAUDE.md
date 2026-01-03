# CLAUDE.md - Project Documentation for AI Assistants

## Project Overview

**Name**: Cuvinte Game (Romanian Word Game)
**Type**: Monorepo web application
**Language**: Romanian
**Purpose**: A word game application where players take turns saying Romanian words. The app validates words against Dexonline dictionary and tracks which player said which word.

## Tech Stack

### Frontend
- **Framework**: Vue.js 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Vue Composables (reactive state)
- **Persistence**: IndexedDB (via `idb` library)
- **HTTP Client**: Axios
- **Port**: 5173 (binds to 0.0.0.0)

### Backend
- **Runtime**: Node.js 18+ (native TypeScript execution)
- **Framework**: Express
- **Language**: TypeScript
- **API Integration**: dexonline-scraper
- **Port**: 3000 (binds to 0.0.0.0)

### Monorepo
- **Tool**: pnpm workspaces
- **Structure**: `packages/backend` and `packages/frontend`

## Directory Structure

```
cuvinte/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   └── index.ts          # Express server + API endpoints
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/       # Vue components
│   │   │   │   ├── PlayerSetup.vue      # Pre-game player management
│   │   │   │   ├── GameBoard.vue        # Main game container
│   │   │   │   ├── WordInput.vue        # Word entry form
│   │   │   │   ├── WordHistory.vue      # List of used words
│   │   │   │   └── PlayerStats.vue      # Player statistics
│   │   │   ├── composables/      # Vue composables
│   │   │   │   ├── useGameState.ts      # Game state management
│   │   │   │   ├── useWordValidation.ts # API calls for word validation
│   │   │   │   └── usePersistence.ts    # IndexedDB operations
│   │   │   ├── types/
│   │   │   │   └── index.ts      # TypeScript interfaces
│   │   │   ├── App.vue           # Root component
│   │   │   ├── main.ts           # Application entry point
│   │   │   └── style.css         # Global styles (Tailwind)
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── ...
├── pnpm-workspace.yaml
├── package.json                   # Root package with scripts
├── README.md                      # User documentation
└── CLAUDE.md                      # This file
```

## Key Features

### 1. Player Management
- Add/remove players before game starts (minimum 2 required)
- Players have unique IDs and names
- Cannot modify players after game starts

### 2. Word Validation
- **Duplicate Check**: Verifies if word was already used
  - Shows who used it and when (with human-readable time difference)
- **Dictionary Check**: Validates against Dexonline Romanian dictionary
  - Uses backend API to scrape Dexonline
  - Returns word definitions
- **Real-time Feedback**: Notifications for errors, warnings, and success

### 3. Persistence
- **Automatic Save**: State saved to IndexedDB on every change
- **Auto-Load**: State restored on page load/refresh
- **Reset**: Complete state clear including IndexedDB

### 4. Mobile-First Design
- Responsive Tailwind CSS
- Optimized for mobile devices
- Touch-friendly interface

## Important Implementation Details

### State Management (`useGameState.ts`)

**Global Reactive State**:
```typescript
const state = reactive<GameState>({
  players: [],
  usedWords: [],
  isGameStarted: false
});
```

**Automatic Persistence**:
- Vue watcher monitors state changes
- Saves to IndexedDB on every change
- Only after initialization to avoid overwriting saved data

**Initialization Flow**:
1. Component mounts → calls `initializeState()`
2. Loads saved state from IndexedDB
3. Populates reactive state
4. Sets `isInitialized = true`
5. Watcher now active → future changes persist

### Word Validation Flow

1. User enters word and selects player
2. **Local Check**: `checkIfWordUsed()` - searches `usedWords` array
   - If found → show warning notification
3. **Remote Check**: API call to `/api/validate-word`
   - Backend calls `Dexonline.get(word)`
   - Returns `{ exists, word, definition }`
4. **Success**: Add to `usedWords`, show definition
5. **Failure**: Show error notification

### API Endpoint

**POST `/api/validate-word`**

Request:
```json
{
  "word": "exemple"
}
```

Response (exists):
```json
{
  "exists": true,
  "word": "exemple",
  "definition": "Model, specimen...",
  "fullData": { ... }
}
```

Response (not exists):
```json
{
  "exists": false,
  "word": "exemplu",
  "definition": ""
}
```

### IndexedDB Schema (`usePersistence.ts`)

**Database**: `cuvinte-game-db`
**Version**: 1
**Store**: `gameState`
**Key**: `current-game`

**Operations**:
- `saveGameState(state)`: Saves entire game state
- `loadGameState()`: Loads saved state, converts timestamps to Date objects
- `clearGameState()`: Deletes saved state

### Important Package Notes

**dexonline-scraper**: Must use namespace import
```typescript
// ✅ Correct
import * as Dexonline from 'dexonline-scraper';
const result = await Dexonline.get(word);

// ❌ Wrong
import dexonline from 'dexonline-scraper';
```

**Node.js TypeScript**: Native execution supported
```bash
# No tsx, ts-node, or compilation needed
node src/index.ts
```

## Development Commands

```bash
# Install all dependencies
pnpm install

# Run both frontend and backend in parallel
pnpm dev

# Run backend only (port 3000)
pnpm backend

# Run frontend only (port 5173)
pnpm frontend

# Build for production
pnpm build
```

## Component Hierarchy

```
App.vue
├── PlayerSetup.vue (if !isGameStarted)
│   └── Form for adding/removing players
└── GameBoard.vue (if isGameStarted)
    ├── PlayerStats.vue
    ├── WordInput.vue
    └── WordHistory.vue
```

## State Flow

### Adding a Word
```
WordInput (user input)
  → App.handleSubmitWord()
    → useGameState.checkIfWordUsed() [local]
    → useWordValidation.validateWord() [API]
    → useGameState.addWord() [success]
      → state.usedWords.push()
        → watcher detects change
          → usePersistence.saveGameState()
            → IndexedDB.put()
```

### Resetting Game
```
GameBoard (user clicks "Resetează")
  → App.handleResetGame()
    → confirm("Ești sigur?")
      → useGameState.resetGame()
        → state = { players: [], usedWords: [], isGameStarted: false }
        → usePersistence.clearGameState()
          → IndexedDB.delete()
```

## TypeScript Interfaces

### Core Types (`types/index.ts`)

```typescript
interface Player {
  id: string;
  name: string;
}

interface UsedWord {
  word: string;
  playerId: string;
  playerName: string;
  timestamp: Date;
  definition: string;
}

interface GameState {
  players: Player[];
  usedWords: UsedWord[];
  isGameStarted: boolean;
}

interface WordValidationResponse {
  exists: boolean;
  word: string;
  definition: string;
  fullData?: any;
}
```

## Romanian UI Text

All UI text is in Romanian:
- Button labels: "Adaugă", "Șterge", "Începe Jocul", "Resetează"
- Confirmations: "Ești sigur?"
- Notifications: "Cuvânt deja folosit!", "Cuvânt invalid!"
- Placeholders: "Nume jucător", "Introdu cuvântul"
- Time formatting: "acum", "acum X minute", "acum X ore"

## Common Tasks

### Adding a new component
1. Create `.vue` file in `packages/frontend/src/components/`
2. Use `<script setup lang="ts">` for Composition API
3. Import in parent component or `App.vue`

### Adding a new API endpoint
1. Add route in `packages/backend/src/index.ts`
2. Follow existing pattern with TypeScript interfaces
3. Update frontend composables if needed

### Modifying game state
1. Update `GameState` interface in `types/index.ts`
2. Update initial state in `useGameState.ts`
3. Persistence will automatically handle new fields

### Styling
- Use Tailwind utility classes
- Primary color: `primary-*` (blue)
- Mobile-first: default styles for mobile, use breakpoints for desktop

## Network Configuration

Both servers bind to `0.0.0.0` for external access:
- Frontend: `http://0.0.0.0:5173`
- Backend: `http://0.0.0.0:3000`
- Vite proxy: `/api/*` → `http://localhost:3000/api/*`

## Testing the App Locally

1. Start both servers: `pnpm dev`
2. Open browser to `http://localhost:5173`
3. Add 2+ players
4. Start game
5. Add words - test validation:
   - Valid word (e.g., "carte") → should show definition
   - Invalid word (e.g., "xyzabc") → should show error
   - Duplicate word → should show who used it
6. Refresh page → state should persist
7. Click "Resetează" → should clear everything

## Known Constraints

- Minimum 2 players required to start
- Players cannot be modified after game starts
- Word validation requires backend connection
- State persists in browser's IndexedDB (per-origin)
- All text/UI in Romanian language
