<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold mb-4">Cuvinte Folosite ({{ usedWords.length }})</h2>

    <div v-if="usedWords.length === 0" class="text-gray-500 text-center py-4">
      Niciun cuvânt încă
    </div>

    <div v-else class="space-y-3 max-h-96 overflow-y-auto">
      <div
        v-for="(wordEntry, index) in sortedWords"
        :key="index"
        class="bg-gray-50 rounded-lg p-3"
      >
        <div class="flex justify-between items-start mb-1">
          <span class="font-semibold text-lg">{{ wordEntry.word }}</span>
          <span class="text-xs text-gray-500">{{ formatTime(wordEntry.timestamp) }}</span>
        </div>
        <p class="text-sm text-gray-600 mb-1">{{ wordEntry.definition }}</p>
        <p class="text-xs text-primary-600 font-medium">{{ wordEntry.playerName }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UsedWord } from '../types';

const props = defineProps<{
  usedWords: UsedWord[];
}>();

const sortedWords = computed(() => {
  return [...props.usedWords].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
});

const formatTime = (timestamp: Date) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return 'acum';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;

  return date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
};
</script>
