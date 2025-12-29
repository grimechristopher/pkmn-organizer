import type { Pokemon, PokemonForm, PokemonVariant } from '../types/pokemon'

/**
 * Resolves the sprite path for a given Pokémon variant
 */
export function getSpritePathFromVariant(variant: PokemonVariant): string {
  return getSpritePath(variant.pokemon, variant.form, variant.isShiny, variant.gender)
}

/**
 * Resolves the sprite path for a given Pokémon form
 */
export function getSpritePath(
  pokemon: Pokemon,
  form: PokemonForm,
  isShiny: boolean,
  gender?: 'male' | 'female'
): string {
  const base = '/sprites'
  const shinyPrefix = isShiny ? 'shiny' : 'regular'

  // Build filename from slug
  let filename = pokemon.slug

  // Add form suffix if not default
  if (!form.isDefault && form.id !== pokemon.slug) {
    // Extract form suffix from form.id (e.g., "pikachu-alola" -> "-alola")
    let formSuffix = form.id.replace(pokemon.slug, '')

    // Special handling for Zygarde Power Construct forms (use same sprites as normal forms)
    if (pokemon.id === 718) {
      if (formSuffix === '-power-construct') {
        formSuffix = '' // Use default Zygarde sprite
      } else if (formSuffix === '-10-power-construct') {
        formSuffix = '-10' // Use 10% forme sprite
      }
    }

    // Special handling for Rockruff Own Tempo (use same sprite as default)
    if (pokemon.id === 744 && formSuffix === '-own-tempo') {
      formSuffix = '' // Use default Rockruff sprite
    }

    filename += formSuffix
  }

  // NOTE: PokéSprite doesn't have separate gender sprites for most Pokémon
  // Gender differences are tracked in the data model but use the same sprite
  // Future enhancement: Add -f suffix only for Pokémon with actual sprite differences

  return `${base}/${shinyPrefix}/${filename}.png`
}

/**
 * Checks if a sprite file exists (for fallback handling)
 */
export function getSpritePathWithFallback(
  pokemon: Pokemon,
  form: PokemonForm,
  isShiny: boolean
): string {
  // For now, just return the path - we'll handle 404s in the component
  return getSpritePath(pokemon, form, isShiny)
}
