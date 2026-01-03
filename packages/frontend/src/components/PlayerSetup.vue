<template>
  <div class="max-w-md mx-auto p-6">
    <h1 class="text-3xl font-bold text-center mb-6 text-primary-600">Joc de Cuvinte</h1>

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Adaugă Jucători</h2>

      <form @submit.prevent="handleAddPlayer" class="mb-4">
        <div class="flex gap-2">
          <input
            v-model="newPlayerName"
            type="text"
            placeholder="Nume jucător"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            maxlength="20"
          />
          <button
            type="submit"
            class="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 active:bg-primary-700 font-medium"
            :disabled="!newPlayerName.trim()"
          >
            Adaugă
          </button>
        </div>
      </form>

      <div v-if="players.length === 0" class="text-gray-500 text-center py-4">
        Nu există jucători. Adaugă cel puțin 2 jucători pentru a începe.
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="player in players"
          :key="player.id"
          class="flex items-center justify-between bg-gray-50 rounded-lg p-3"
        >
          <span class="font-medium">{{ player.name }}</span>
          <button
            @click="$emit('remove-player', player.id)"
            class="text-red-500 hover:text-red-700 font-medium"
          >
            Șterge
          </button>
        </div>
      </div>
    </div>

    <button
      @click="$emit('start-game')"
      :disabled="players.length < 2"
      class="w-full py-3 bg-green-500 text-white rounded-lg font-bold text-lg hover:bg-green-600 active:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      {{ players.length < 2 ? 'Adaugă cel puțin 2 jucători' : 'Începe Jocul' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Player } from '../types';

defineProps<{
  players: Player[];
}>();

const emit = defineEmits<{
  'add-player': [name: string];
  'remove-player': [id: string];
  'start-game': [];
}>();

const newPlayerName = ref('');

const handleAddPlayer = () => {
  if (newPlayerName.value.trim()) {
    emit('add-player', newPlayerName.value.trim());
    newPlayerName.value = '';
  }
};
</script>
