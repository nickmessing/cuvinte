import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { GameState } from '../types';

interface GameDB extends DBSchema {
  gameState: {
    key: string;
    value: GameState;
  };
}

const DB_NAME = 'cuvinte-game-db';
const DB_VERSION = 1;
const STORE_NAME = 'gameState';
const STATE_KEY = 'current-game';

let dbPromise: Promise<IDBPDatabase<GameDB>> | null = null;

const getDB = async (): Promise<IDBPDatabase<GameDB>> => {
  if (!dbPromise) {
    dbPromise = openDB<GameDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
};

export function usePersistence() {
  const saveGameState = async (state: GameState): Promise<void> => {
    try {
      const db = await getDB();
      await db.put(STORE_NAME, state, STATE_KEY);
    } catch (error) {
      console.error('Error saving game state to IndexedDB:', error);
    }
  };

  const loadGameState = async (): Promise<GameState | null> => {
    try {
      const db = await getDB();
      const state = await db.get(STORE_NAME, STATE_KEY);

      if (state) {
        // Convert timestamp strings back to Date objects
        const usedWords = state.usedWords.map(word => ({
          ...word,
          timestamp: new Date(word.timestamp)
        }));

        return {
          ...state,
          usedWords
        };
      }

      return null;
    } catch (error) {
      console.error('Error loading game state from IndexedDB:', error);
      return null;
    }
  };

  const clearGameState = async (): Promise<void> => {
    try {
      const db = await getDB();
      await db.delete(STORE_NAME, STATE_KEY);
    } catch (error) {
      console.error('Error clearing game state from IndexedDB:', error);
    }
  };

  return {
    saveGameState,
    loadGameState,
    clearGameState
  };
}
