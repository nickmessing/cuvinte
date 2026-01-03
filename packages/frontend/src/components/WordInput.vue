<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold mb-4">Adaugă Cuvânt</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">Cuvânt</label>
        <input
          v-model="word"
          type="text"
          placeholder="Introdu cuvântul"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          :disabled="isLoading"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Jucător</label>
        <select
          v-model="selectedPlayerId"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          :disabled="isLoading"
        >
          <option value="">Selectează jucătorul</option>
          <option v-for="player in players" :key="player.id" :value="player.id">
            {{ player.name }}
          </option>
        </select>
      </div>

      <button
        type="submit"
        :disabled="!word.trim() || !selectedPlayerId || isLoading"
        class="w-full py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 active:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {{ isLoading ? 'Verificare...' : 'Verifică Cuvântul' }}
      </button>
    </form>

    <!-- Notification Area -->
    <div v-if="notification" class="mt-4 p-4 rounded-lg" :class="notificationClass">
      <p class="font-medium mb-1">{{ notification.title }}</p>
      <p class="text-sm">{{ notification.message }}</p>
    </div>

    <!-- Word Definition Display -->
    <div v-if="lastValidWord" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 class="font-semibold text-green-800 mb-2">{{ lastValidWord.word }}</h3>
      <p class="text-sm text-green-700">{{ lastValidWord.definition }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Player } from '../types';

defineProps<{
  players: Player[];
  isLoading: boolean;
}>();

const emit = defineEmits<{
  'submit-word': [word: string, playerId: string];
}>();

const word = ref('');
const selectedPlayerId = ref('');
const notification = ref<{ title: string; message: string; type: 'error' | 'warning' | 'success' } | null>(null);
const lastValidWord = ref<{ word: string; definition: string } | null>(null);

const notificationClass = computed(() => {
  if (!notification.value) return '';

  switch (notification.value.type) {
    case 'error':
      return 'bg-red-50 border border-red-200 text-red-800';
    case 'warning':
      return 'bg-yellow-50 border border-yellow-200 text-yellow-800';
    case 'success':
      return 'bg-green-50 border border-green-200 text-green-800';
    default:
      return '';
  }
});

const handleSubmit = () => {
  if (word.value.trim() && selectedPlayerId.value) {
    emit('submit-word', word.value, selectedPlayerId.value);
  }
};

const showNotification = (title: string, message: string, type: 'error' | 'warning' | 'success') => {
  notification.value = { title, message, type };
  setTimeout(() => {
    notification.value = null;
  }, 5000);
};

const showValidWord = (wordText: string, definition: string) => {
  lastValidWord.value = { word: wordText, definition };
  setTimeout(() => {
    lastValidWord.value = null;
  }, 8000);
};

const clearForm = () => {
  word.value = '';
  selectedPlayerId.value = '';
};

defineExpose({
  showNotification,
  showValidWord,
  clearForm
});
</script>
