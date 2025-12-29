<script setup lang="ts">
import ConfigPanel from './components/layout/ConfigPanel.vue'
import BoxList from './components/ui/BoxList.vue'
import { useBoxOrganizer } from './composables/useBoxOrganizer'

const { boxes } = useBoxOrganizer()
</script>

<template>
  <div id="app">
    <header class="app-header">
      <h1>Pokémon Living Dex Organizer</h1>
      <p>Configure and visualize your living dex organization</p>
    </header>

    <main class="app-main">
      <ConfigPanel />
      <div class="stats">
        <p>Total Boxes: {{ boxes.length }}</p>
      </div>
      <BoxList :boxes="boxes" />
    </main>
  </div>
</template>

<style scoped>
.app-header {
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.app-header h1 {
  margin: 0 0 0.5rem 0;
}

.app-header p {
  margin: 0;
  opacity: 0.95;
  font-size: 1.1rem;
}

.app-main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stats {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 500;
  color: #555;
}
</style>
