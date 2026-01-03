export interface Player {
  id: string;
  name: string;
}

export interface UsedWord {
  word: string;
  playerId: string;
  playerName: string;
  timestamp: Date;
  definition: string;
}

export interface GameState {
  players: Player[];
  usedWords: UsedWord[];
  isGameStarted: boolean;
}

export interface WordValidationResponse {
  exists: boolean;
  word: string;
  definition: string;
  fullData?: any;
}
