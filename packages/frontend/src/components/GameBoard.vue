<template>
  <div class="max-w-md mx-auto p-6 pb-20">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-primary-600">Joc de Cuvinte</h1>
      <button
        @click="$emit('reset-game')"
        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 font-medium text-sm"
      >
        Resetează
      </button>
    </div>

    <div class="space-y-6">
      <PlayerStats :players="playerStats" />

      <WordInput
        ref="wordInputRef"
        :players="players"
        :is-loading="isLoading"
        @submit-word="handleSubmitWord"
      />

      <WordHistory :used-words="usedWords" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import WordInput from './WordInput.vue';
import WordHistory from './WordHistory.vue';
import PlayerStats from './PlayerStats.vue';
import type { Player, UsedWord } from '../types';

defineProps<{
  players: Array<{ id: string; name: string; wordCount: number }>;
  usedWords: UsedWord[];
  isLoading: boolean;
  playerStats: Array<{ id: string; name: string; wordCount: number }>;
}>();

const emit = defineEmits<{
  'submit-word': [word: string, playerId: string];
  'reset-game': [];
}>();

const wordInputRef = ref<InstanceType<typeof WordInput> | null>(null);

const handleSubmitWord = (word: string, playerId: string) => {
  emit('submit-word', word, playerId);
};

defineExpose({
  wordInputRef
});
</script>
