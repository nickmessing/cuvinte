import { reactive, computed, watch } from 'vue';
import type { Player, UsedWord, GameState } from '../types';
import { usePersistence } from './usePersistence';

const state = reactive<GameState>({
  players: [],
  usedWords: [],
  isGameStarted: false
});

const { saveGameState, loadGameState, clearGameState } = usePersistence();

// Watch state changes and persist to IndexedDB
let isInitialized = false;
watch(
  () => ({ ...state, usedWords: [...state.usedWords], players: [...state.players] }),
  (newState) => {
    // Only save after initialization to avoid saving empty state on load
    if (isInitialized) {
      saveGameState(newState);
    }
  },
  { deep: true }
);

export function useGameState() {
  const initializeState = async () => {
    const savedState = await loadGameState();
    if (savedState) {
      state.players = savedState.players;
      state.usedWords = savedState.usedWords;
      state.isGameStarted = savedState.isGameStarted;
    }
    isInitialized = true;
  };
  const addPlayer = (name: string) => {
    if (name.trim() && !state.isGameStarted) {
      state.players.push({
        id: Date.now().toString(),
        name: name.trim()
      });
    }
  };

  const removePlayer = (id: string) => {
    if (!state.isGameStarted) {
      state.players = state.players.filter(p => p.id !== id);
    }
  };

  const startGame = () => {
    if (state.players.length >= 2) {
      state.isGameStarted = true;
    }
  };

  const resetGame = async () => {
    state.players = [];
    state.usedWords = [];
    state.isGameStarted = false;
    await clearGameState();
  };

  const addWord = (word: string, playerId: string, definition: string) => {
    const player = state.players.find(p => p.id === playerId);
    if (player) {
      state.usedWords.push({
        word: word.toLowerCase().trim(),
        playerId,
        playerName: player.name,
        timestamp: new Date(),
        definition
      });
    }
  };

  const checkIfWordUsed = (word: string): UsedWord | null => {
    const normalizedWord = word.toLowerCase().trim();
    return state.usedWords.find(w => w.word === normalizedWord) || null;
  };

  const getPlayerStats = computed(() => {
    return state.players.map(player => ({
      ...player,
      wordCount: state.usedWords.filter(w => w.playerId === player.id).length
    }));
  });

  return {
    state,
    addPlayer,
    removePlayer,
    startGame,
    resetGame,
    addWord,
    checkIfWordUsed,
    getPlayerStats,
    initializeState
  };
}
