import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { AppConfig } from '../types/config'

/**
 * Default configuration presets
 */
const DEFAULT_PRESETS: AppConfig[] = [
  {
    id: 'normal',
    name: 'Normal Living Dex',
    isShiny: false,
    divideByGeneration: false,
    splitLegendsArceus: false,
    includeGenderDifferences: true,
    includeRegionalForms: true,
    includeAlternateForms: true,
    regionalFormPlacement: 'after-base',
    includePowerConstructForms: false
  },
  {
    id: 'shiny',
    name: 'Shiny Living Dex',
    isShiny: true,
    divideByGeneration: false,
    splitLegendsArceus: false,
    includeGenderDifferences: true,
    includeRegionalForms: true,
    includeAlternateForms: true,
    regionalFormPlacement: 'after-base',
    includePowerConstructForms: false
  }
]

/**
 * Loads a config from localStorage
 */
function loadConfigFromStorage(configId: string): AppConfig | null {
  try {
    const stored = localStorage.getItem(`pkmn-config-${configId}`)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error(`Failed to load config ${configId} from localStorage:`, error)
  }
  return null
}

/**
 * Saves a config to localStorage
 */
function saveConfigToStorage(config: AppConfig): void {
  try {
    localStorage.setItem(`pkmn-config-${config.id}`, JSON.stringify(config))
  } catch (error) {
    console.error(`Failed to save config ${config.id} to localStorage:`, error)
  }
}

/**
 * Configuration store
 */
export const useConfigStore = defineStore('config', () => {
  // State
  const presets = ref<AppConfig[]>([...DEFAULT_PRESETS])
  const activePresetId = ref<string>('normal')

  // Load or create initial config
  const loadedConfig = loadConfigFromStorage('normal')
  const currentConfig = ref<AppConfig>(loadedConfig || presets.value[0])

  // Watch for config changes and persist to localStorage
  watch(
    currentConfig,
    (newConfig) => {
      saveConfigToStorage(newConfig)
    },
    { deep: true }
  )

  // Actions
  function switchPreset(presetId: string) {
    const preset = presets.value.find(p => p.id === presetId)
    if (!preset) {
      console.error(`Preset ${presetId} not found`)
      return
    }

    activePresetId.value = presetId

    // Load from storage or use default
    const loaded = loadConfigFromStorage(presetId)
    currentConfig.value = loaded || { ...preset }
  }

  function updateConfig(updates: Partial<AppConfig>) {
    currentConfig.value = {
      ...currentConfig.value,
      ...updates
    }
  }

  function resetConfig() {
    const defaultPreset = DEFAULT_PRESETS.find(p => p.id === currentConfig.value.id)
    if (defaultPreset) {
      currentConfig.value = { ...defaultPreset }
    }
  }

  return {
    presets,
    activePresetId,
    currentConfig,
    switchPreset,
    updateConfig,
    resetConfig
  }
})
