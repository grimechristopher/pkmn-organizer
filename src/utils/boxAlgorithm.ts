import type { Pokemon, PokemonVariant } from '../types/pokemon'
import type { Box, BoxSlot } from '../types/box'
import type { AppConfig } from '../types/config'
import { calculateOrder, comparePokemonVariants } from './pokemonOrder'

/**
 * Creates an empty box
 */
function createEmptyBox(number: number, generation?: number): Box {
  const slots: BoxSlot[] = Array.from({ length: 30 }, (_, i) => ({
    position: i,
    variant: null,
  }))

  return {
    id: `box-${number}`,
    number,
    generation,
    slots,
  }
}

/**
 * Generates all variants of Pokémon based on configuration
 */
function generateVariants(allPokemon: Pokemon[], config: AppConfig): PokemonVariant[] {
  const variants: PokemonVariant[] = []

  for (const pokemon of allPokemon) {
    // Skip if generation filtering is needed (future enhancement)

    for (const form of pokemon.forms) {
      // Skip regional forms if not included
      if (form.isRegionalForm && !config.includeRegionalForms) {
        continue
      }

      // Skip alternate forms if not included (only keep default forms)
      if (!config.includeAlternateForms && !form.isDefault && !form.isRegionalForm) {
        continue
      }

      // Skip special ability forms unless enabled (Power Construct, Own Tempo)
      if (!config.includePowerConstructForms) {
        // Zygarde Power Construct forms
        if (pokemon.id === 718 && (form.id === 'zygarde-power-construct' || form.id === 'zygarde-10-power-construct')) {
          continue
        }
        // Rockruff Own Tempo form
        if (pokemon.id === 744 && form.id === 'rockruff-own-tempo') {
          continue
        }
      }

      // Determine if this variant is unobtainable (shiny-locked in shiny mode)
      const isUnobtainable = config.isShiny && pokemon.isShinyLocked

      // Gender differences rules:
      // - Default forms: show gender diffs if Pokemon has them
      // - Regional forms: NO gender diffs EXCEPT Sneasel (#215)
      // - Special forms (Pikachu caps): NO gender diffs
      const isPikachuCapForm = pokemon.id === 25 && form.id.includes('-cap')
      const isRegionalFormWithGenderDiff = form.isRegionalForm && pokemon.id === 215 // Sneasel only

      const shouldIncludeGenderVariants =
        config.includeGenderDifferences &&
        pokemon.hasGenderDifference &&
        !isPikachuCapForm &&
        (form.isDefault || isRegionalFormWithGenderDiff)

      // Add base variant (no gender or genderless)
      if (!shouldIncludeGenderVariants) {
        variants.push({
          pokemon,
          form,
          isShiny: config.isShiny,
          displayOrder: calculateOrder(pokemon, form, config.regionalFormPlacement),
          isUnobtainable,
        })
      } else {
        // Add gender variants (only for default form)
        for (const gender of ['male', 'female'] as const) {
          variants.push({
            pokemon,
            form,
            gender,
            isShiny: config.isShiny,
            displayOrder: calculateOrder(pokemon, form, config.regionalFormPlacement, gender),
            isUnobtainable,
          })
        }
      }
    }
  }

  return variants
}

/**
 * Checks if a Pokémon is from Legends: Arceus
 */
function isLegendsArceusPokemon(pokemon: Pokemon): boolean {
  // Legends: Arceus new Pokémon: #899-905
  // Wyrdeer, Kleavor, Ursaluna, Basculegion, Sneasler, Overqwil, Enamorus
  return pokemon.id >= 899 && pokemon.id <= 905
}

/**
 * Checks if a new box should be started based on division settings
 */
function shouldStartNewBox(
  variant: PokemonVariant,
  currentBox: Box,
  config: AppConfig,
  isInLegendsArceusSection: boolean
): boolean {
  // Check generation boundaries
  if (config.divideByGeneration) {
    if (currentBox.generation !== undefined && variant.pokemon.generation !== currentBox.generation) {
      return true
    }
  }

  // Check Legends: Arceus boundary
  if (config.splitLegendsArceus) {
    const isLegendsArceus = isLegendsArceusPokemon(variant.pokemon)
    // Start new box when entering or leaving Legends: Arceus section
    if (isLegendsArceus !== isInLegendsArceusSection) {
      return true
    }
  }

  return false
}

/**
 * Organizes Pokémon into boxes based on configuration
 */
export function organizeIntoBoxes(config: AppConfig, allPokemon: Pokemon[]): Box[] {
  const boxes: Box[] = []

  // Step 1: Generate and filter variants
  const variants = generateVariants(allPokemon, config)

  // Step 2: Sort variants by display order
  const sortedVariants = [...variants].sort(comparePokemonVariants)

  // Step 3: Fill boxes
  if (sortedVariants.length === 0) {
    // Return at least one empty box
    return [createEmptyBox(1)]
  }

  let currentBox: Box
  if (config.divideByGeneration) {
    currentBox = createEmptyBox(1, sortedVariants[0].pokemon.generation)
  } else {
    currentBox = createEmptyBox(1)
  }

  let slotIndex = 0
  let isInLegendsArceusSection = isLegendsArceusPokemon(sortedVariants[0].pokemon)

  for (const variant of sortedVariants) {
    // Check if we need to start a new box due to boundary
    if (shouldStartNewBox(variant, currentBox, config, isInLegendsArceusSection)) {
      // Update Legends: Arceus section tracker
      isInLegendsArceusSection = isLegendsArceusPokemon(variant.pokemon)
      // Fill remaining slots in current box
      while (slotIndex < 30) {
        currentBox.slots[slotIndex] = { position: slotIndex, variant: null }
        slotIndex++
      }

      boxes.push(currentBox)
      currentBox = createEmptyBox(boxes.length + 1, variant.pokemon.generation)
      slotIndex = 0
    }

    // Check if current box is full
    if (slotIndex >= 30) {
      boxes.push(currentBox)
      if (config.divideByGeneration) {
        currentBox = createEmptyBox(boxes.length + 1, variant.pokemon.generation)
      } else {
        currentBox = createEmptyBox(boxes.length + 1)
      }
      slotIndex = 0
    }

    // Add variant to current box
    currentBox.slots[slotIndex] = {
      position: slotIndex,
      variant,
    }
    slotIndex++
  }

  // Fill remaining slots in last box
  while (slotIndex < 30) {
    currentBox.slots[slotIndex] = { position: slotIndex, variant: null }
    slotIndex++
  }

  // Add final box
  boxes.push(currentBox)

  return boxes
}
