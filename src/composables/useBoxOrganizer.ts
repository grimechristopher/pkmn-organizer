import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '../stores/configStore'
import { getAllPokemon } from '../data/pokemonRegistry'
import { organizeIntoBoxes } from '../utils/boxAlgorithm'
import type { Box } from '../types/box'

/**
 * Composable for organizing Pokemon into boxes
 */
export function useBoxOrganizer() {
  const configStore = useConfigStore()
  const { currentConfig } = storeToRefs(configStore)

  // Get all Pokemon (non-reactive for performance)
  const allPokemon = getAllPokemon()

  // Compute boxes reactively based on config
  const boxes = computed<Box[]>(() => {
    return organizeIntoBoxes(currentConfig.value, allPokemon)
  })

  return {
    boxes
  }
}
