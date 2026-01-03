import { reactive, computed } from 'vue';
import type { Player, UsedWord, GameState } from '../types';

const state = reactive<GameState>({
  players: [],
  usedWords: [],
  isGameStarted: false
});

export function useGameState() {
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

  const resetGame = () => {
    state.usedWords = [];
    state.isGameStarted = false;
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
    getPlayerStats
  };
}
