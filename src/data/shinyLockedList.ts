/**
 * List of Pokémon National Dex IDs that are shiny-locked in Pokémon HOME
 * These Pokémon cannot be obtained as shiny through normal gameplay
 */
export const SHINY_LOCKED_IDS = new Set<number>([
  151,  // Mew (most distributions)
  251,  // Celebi (most distributions)
  // Add more shiny-locked Pokémon here as needed
  // This list can be expanded based on research from Serebii.net
])

/**
 * Checks if a Pokémon ID is shiny-locked
 */
export function isShinyLocked(pokemonId: number): boolean {
  return SHINY_LOCKED_IDS.has(pokemonId)
}
