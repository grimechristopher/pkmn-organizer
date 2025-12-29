<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useConfigStore } from '../../stores/configStore'

const configStore = useConfigStore()
const { presets, activePresetId, currentConfig } = storeToRefs(configStore)
const { switchPreset, updateConfig } = configStore
</script>

<template>
  <div class="config-panel">
    <h2 class="panel-title">Configuration</h2>

    <!-- Preset Switcher -->
    <div class="config-section">
      <label class="config-label">Preset:</label>
      <div class="preset-buttons">
        <button
          v-for="preset in presets"
          :key="preset.id"
          class="preset-button"
          :class="{ active: activePresetId === preset.id }"
          @click="switchPreset(preset.id)"
        >
          {{ preset.name }}
        </button>
      </div>
    </div>

    <!-- Configuration Options -->
    <div class="config-section">
      <label class="config-label">
        <input
          type="checkbox"
          :checked="currentConfig.divideByGeneration"
          @change="updateConfig({ divideByGeneration: !currentConfig.divideByGeneration })"
        />
        Divide by Generation
      </label>
      <p class="config-help">Start a new box at each generation boundary</p>
    </div>

    <div class="config-section">
      <label class="config-label">
        <input
          type="checkbox"
          :checked="currentConfig.splitLegendsArceus"
          @change="updateConfig({ splitLegendsArceus: !currentConfig.splitLegendsArceus })"
        />
        Split Legends: Arceus Pokémon
      </label>
      <p class="config-help">Put Legends: Arceus Pokémon (#899-905: Wyrdeer, Kleavor, Ursaluna, etc.) in separate box</p>
    </div>

    <div class="config-section">
      <label class="config-label">
        <input
          type="checkbox"
          :checked="currentConfig.includeGenderDifferences"
          @change="updateConfig({ includeGenderDifferences: !currentConfig.includeGenderDifferences })"
        />
        Include Gender Differences
      </label>
      <p class="config-help">Show separate entries for male and female Pokémon with visual differences</p>
    </div>

    <div class="config-section">
      <label class="config-label">
        <input
          type="checkbox"
          :checked="currentConfig.includeRegionalForms"
          @change="updateConfig({ includeRegionalForms: !currentConfig.includeRegionalForms })"
        />
        Include Regional Forms
      </label>
      <p class="config-help">Show Alolan, Galarian, Hisuian, and Paldean forms</p>
    </div>

    <div class="config-section">
      <label class="config-label">
        <input
          type="checkbox"
          :checked="currentConfig.includeAlternateForms"
          @change="updateConfig({ includeAlternateForms: !currentConfig.includeAlternateForms })"
        />
        Include Alternate Forms
      </label>
      <p class="config-help">Show alternate forms (Vivillon patterns, Rotom appliances, Alcremie sweets, Unown letters, etc.)</p>
    </div>

    <div class="config-section">
      <label class="config-label">
        <input
          type="checkbox"
          :checked="currentConfig.includePowerConstructForms"
          @change="updateConfig({ includePowerConstructForms: !currentConfig.includePowerConstructForms })"
        />
        Include Special Ability Forms
      </label>
      <p class="config-help">Show forms with special abilities (Zygarde Power Construct, Rockruff Own Tempo)</p>
    </div>

    <div class="config-section">
      <label class="config-label">Regional Form Placement:</label>
      <select
        :value="currentConfig.regionalFormPlacement"
        @change="updateConfig({ regionalFormPlacement: ($event.target as HTMLSelectElement).value as any })"
        class="config-select"
      >
        <option value="after-base">After Base Form</option>
        <option value="after-generation">After Generation Boxes</option>
        <option value="after-all">After All Base Pokémon</option>
      </select>
      <p class="config-help">
        <template v-if="currentConfig.regionalFormPlacement === 'after-base'">
          Regional forms appear right after their base form (e.g., Pikachu → Pikachu-Alola)
        </template>
        <template v-else-if="currentConfig.regionalFormPlacement === 'after-generation'">
          All Gen 1 base forms, then Gen 1 regional forms, then Gen 2 base forms, etc.
        </template>
        <template v-else>
          All base forms #1-1025, then all regional forms grouped by region
        </template>
      </p>
    </div>
  </div>
</template>

<style scoped>
.config-panel {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.panel-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: #333;
}

.config-section {
  margin-bottom: 1.5rem;
}

.config-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.config-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.config-help {
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
  color: #777;
  line-height: 1.4;
}

.preset-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preset-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-button:hover {
  background: #f0f4ff;
}

.preset-button.active {
  background: #667eea;
  color: white;
}

.config-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  background: white;
  transition: border-color 0.2s;
}

.config-select:hover {
  border-color: #b0b0b0;
}

.config-select:focus {
  outline: none;
  border-color: #667eea;
}
</style>
