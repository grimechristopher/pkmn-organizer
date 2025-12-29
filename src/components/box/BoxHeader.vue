<script setup lang="ts">
defineProps<{
  boxNumber: number
  generation?: number
}>()
</script>

<template>
  <div class="box-header">
    <h3 class="box-title">
      Box {{ boxNumber }}
      <span v-if="generation" class="generation-label">Gen {{ generation }}</span>
    </h3>
  </div>
</template>

<style scoped>
.box-header {
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px 8px 0 0;
}

.box-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.generation-label {
  font-size: 0.9rem;
  font-weight: 400;
  opacity: 0.9;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
}
</style>
