<template>
  <div id="app" class="min-h-screen">
    <PlayerSetup
      v-if="!gameState.isGameStarted"
      :players="gameState.players"
      @add-player="handleAddPlayer"
      @remove-player="handleRemovePlayer"
      @start-game="handleStartGame"
    />

    <GameBoard
      v-else
      ref="gameBoardRef"
      :players="gameState.players"
      :used-words="gameState.usedWords"
      :player-stats="getPlayerStats"
      :is-loading="isLoading"
      @submit-word="handleSubmitWord"
      @reset-game="handleResetGame"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PlayerSetup from './components/PlayerSetup.vue';
import GameBoard from './components/GameBoard.vue';
import { useGameState } from './composables/useGameState';
import { useWordValidation } from './composables/useWordValidation';

const { state: gameState, addPlayer, removePlayer, startGame, resetGame, addWord, checkIfWordUsed, getPlayerStats, initializeState } = useGameState();
const { validateWord } = useWordValidation();
const isLoading = ref(false);
const gameBoardRef = ref<InstanceType<typeof GameBoard> | null>(null);

// Initialize state from IndexedDB on mount
onMounted(async () => {
  await initializeState();
});

const handleAddPlayer = (name: string) => {
  addPlayer(name);
};

const handleRemovePlayer = (id: string) => {
  removePlayer(id);
};

const handleStartGame = () => {
  startGame();
};

const handleResetGame = async () => {
  if (confirm('Ești sigur?')) {
    await resetGame();
  }
};

const handleSubmitWord = async (word: string, playerId: string) => {
  if (isLoading.value) return;

  const normalizedWord = word.trim().toLowerCase();

  // Check if word was already used
  const usedWord = checkIfWordUsed(normalizedWord);
  if (usedWord) {
    const timeDiff = new Date().getTime() - new Date(usedWord.timestamp).getTime();
    const minutesAgo = Math.floor(timeDiff / 60000);
    const hoursAgo = Math.floor(minutesAgo / 60);

    let timeAgoText = '';
    if (minutesAgo < 1) {
      timeAgoText = 'acum';
    } else if (minutesAgo < 60) {
      timeAgoText = `acum ${minutesAgo} ${minutesAgo === 1 ? 'minut' : 'minute'}`;
    } else {
      timeAgoText = `acum ${hoursAgo} ${hoursAgo === 1 ? 'oră' : 'ore'}`;
    }

    gameBoardRef.value?.wordInputRef?.showNotification(
      'Cuvânt deja folosit!',
      `"${normalizedWord}" a fost folosit de ${usedWord.playerName} ${timeAgoText}.`,
      'warning'
    );
    return;
  }

  // Validate word with backend
  isLoading.value = true;
  try {
    const result = await validateWord(normalizedWord);

    if (!result.exists) {
      gameBoardRef.value?.wordInputRef?.showNotification(
        'Cuvânt invalid!',
        `"${normalizedWord}" nu există în dicționar.`,
        'error'
      );
    } else {
      // Word is valid and not used before
      addWord(normalizedWord, playerId, result.definition);
      gameBoardRef.value?.wordInputRef?.showValidWord(normalizedWord, result.definition);
      gameBoardRef.value?.wordInputRef?.clearForm();
    }
  } catch (error) {
    gameBoardRef.value?.wordInputRef?.showNotification(
      'Eroare',
      'A apărut o eroare la verificarea cuvântului. Verifică conexiunea la server.',
      'error'
    );
  } finally {
    isLoading.value = false;
  }
};
</script>
