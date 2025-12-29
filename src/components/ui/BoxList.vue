<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVirtualList } from '@vueuse/core'
import type { Box } from '../../types/box'
import BoxGrid from '../box/BoxGrid.vue'

const props = defineProps<{
  boxes: Box[]
}>()

// Container ref for virtual scrolling
const containerRef = ref<HTMLElement | null>(null)

// Virtual list configuration
// Each box is approximately 400px tall (grid + header + padding)
const { list: virtualBoxes, containerProps, wrapperProps } = useVirtualList(
  computed(() => props.boxes),
  {
    itemHeight: 400,
    overscan: 2  // Render 2 extra boxes above/below viewport for smoother scrolling
  }
)
</script>

<template>
  <div class="box-list">
    <div v-if="boxes.length === 0" class="no-boxes">
      <p>No Pokémon to display with current configuration</p>
    </div>

    <!-- Virtual scrolling container -->
    <div
      v-else
      ref="containerRef"
      v-bind="containerProps"
      class="box-list-container"
    >
      <div v-bind="wrapperProps">
        <div
          v-for="{ data: box, index } in virtualBoxes"
          :key="box.id"
          class="box-wrapper"
        >
          <BoxGrid :box="box" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box-list {
  width: 100%;
}

.box-list-container {
  height: 80vh;  /* Fixed height container for virtual scrolling */
  overflow-y: auto;
  overflow-x: hidden;
}

.box-wrapper {
  margin-bottom: 2rem;
}

.no-boxes {
  text-align: center;
  padding: 3rem;
  color: #999;
  font-size: 1.1rem;
}
</style>
