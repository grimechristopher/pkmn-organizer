<script setup lang="ts">
import type { Box } from '../../types/box'
import BoxHeader from './BoxHeader.vue'
import BoxSlot from './BoxSlot.vue'

defineProps<{
  box: Box
}>()
</script>

<template>
  <div class="box-container">
    <BoxHeader :box-number="box.number" :generation="box.generation" />
    <div class="box-grid">
      <BoxSlot
        v-for="slot in box.slots"
        :key="`${box.id}-${slot.position}`"
        :slot="slot"
      />
    </div>
  </div>
</template>

<style scoped>
.box-container {
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.box-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 8px;
  padding: 1rem;
  background: #f5f5f5;
}

@media (max-width: 768px) {
  .box-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(10, 1fr);
    gap: 4px;
    padding: 0.5rem;
  }
}
</style>
