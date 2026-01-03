<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold mb-4">Statistici Jucători</h2>

    <div class="space-y-2">
      <div
        v-for="player in sortedPlayers"
        :key="player.id"
        class="flex items-center justify-between bg-gray-50 rounded-lg p-3"
      >
        <span class="font-medium">{{ player.name }}</span>
        <span class="text-primary-600 font-semibold">
          {{ player.wordCount }} {{ player.wordCount === 1 ? 'cuvânt' : 'cuvinte' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface PlayerWithStats {
  id: string;
  name: string;
  wordCount: number;
}

const props = defineProps<{
  players: PlayerWithStats[];
}>();

const sortedPlayers = computed(() => {
  return [...props.players].sort((a, b) => b.wordCount - a.wordCount);
});
</script>
