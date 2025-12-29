import type { Pokemon, PokemonForm, RegionalFormPlacement } from '../types/pokemon'

// Regional form generation mapping (when each regional variant was introduced)
const REGIONAL_FORM_GENERATION: Record<string, number> = {
  'alola': 7,
  'alolan': 7,
  'galar': 8,
  'galarian': 8,
  'hisui': 8,
  'hisuian': 8,
  'paldea': 9,
  'paldean': 9,
}

/**
 * Gets the generation a regional form was introduced
 */
function getRegionalFormGeneration(form: PokemonForm): number {
  if (!form.isRegionalForm) return form.generation

  // Check form name for regional variant
  const formNameLower = form.name.toLowerCase()
  for (const [key, gen] of Object.entries(REGIONAL_FORM_GENERATION)) {
    if (formNameLower.includes(key)) {
      return gen
    }
  }

  return form.generation
}

/**
 * Gets a form offset for ordering forms within a Pokémon
 */
function getFormOffset(form: PokemonForm): number {
  if (form.isDefault) return 0

  if (form.isRegionalForm) {
    const gen = getRegionalFormGeneration(form)
    // Alolan (gen 7) = 1, Galarian (gen 8) = 2, Hisuian (gen 8) = 3, Paldean (gen 9) = 4
    const formNameLower = form.name.toLowerCase()
    if (formNameLower.includes('alola')) return 1
    if (formNameLower.includes('galar')) return 2
    if (formNameLower.includes('hisui')) return 3
    if (formNameLower.includes('paldea')) return 4
    return gen // fallback to generation
  }

  // Other form differences (Deoxys, Rotom, etc.)
  return 10
}

/**
 * Calculates the display order for a Pokémon variant
 * based on the selected placement mode
 */
export function calculateOrder(
  pokemon: Pokemon,
  form: PokemonForm,
  placementMode: RegionalFormPlacement,
  gender?: 'male' | 'female'
): number {
  let order = 0

  switch (placementMode) {
    case 'after-base': {
      // Order: National Dex # → Regional forms after base → Gender differences
      // Example: #25 Pikachu → #25 Pikachu-Alola → #25 Pikachu♀ → #26 Raichu
      order = pokemon.id * 100
      order += getFormOffset(form)
      if (gender === 'female') order += 0.5
      break
    }

    case 'after-generation': {
      // Order: All base forms Gen 1 → Regionals in Gen 1 → All base Gen 2 → Regionals in Gen 2
      // Regional forms are placed with their introduction generation
      if (form.isRegionalForm) {
        const regionalGen = getRegionalFormGeneration(form)
        order = regionalGen * 100000 + pokemon.id * 100 + 50000 // Regional forms come after base forms in gen
      } else {
        order = pokemon.generation * 100000 + pokemon.id * 100
      }
      if (gender === 'female') order += 0.5
      break
    }

    case 'after-all': {
      // Order: All base forms #1-1025 → All Alolan → All Galarian → All Hisuian → All Paldean
      if (form.isDefault) {
        order = pokemon.id * 100
      } else if (form.isRegionalForm) {
        const formOffset = getFormOffset(form)
        order = 105000 + formOffset * 10000 + pokemon.id * 100
      } else {
        // Other forms come right after base
        order = pokemon.id * 100 + 50
      }
      if (gender === 'female') order += 0.5
      break
    }
  }

  return order
}

/**
 * Compares two Pokemon variants for sorting
 */
export function comparePokemonVariants(
  a: { displayOrder: number },
  b: { displayOrder: number }
): number {
  return a.displayOrder - b.displayOrder
}
