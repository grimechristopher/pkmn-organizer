<script setup lang="ts">
import type { BoxSlot as BoxSlotType } from '../../types/box'
import PokemonSprite from './PokemonSprite.vue'

defineProps<{
  slot: BoxSlotType
}>()
</script>

<template>
  <div class="box-slot" :class="{ empty: !slot.variant }">
    <PokemonSprite v-if="slot.variant" :variant="slot.variant" />
    <div v-else class="empty-slot"></div>
  </div>
</template>

<style scoped>
.box-slot {
  width: 100%;
  height: 100%;
  min-height: 60px;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.box-slot:hover {
  border-color: #b0b0b0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.box-slot.empty {
  background: #f9f9f9;
}

.empty-slot {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
}
</style>
