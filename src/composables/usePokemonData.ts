import { getAllPokemon, getPokemonById } from '../data/pokemonRegistry'
import type { Pokemon } from '../types/pokemon'

/**
 * Composable for accessing Pokemon data
 */
export function usePokemonData() {
  const allPokemon: Pokemon[] = getAllPokemon()

  function getPokemon(id: number): Pokemon | undefined {
    return getPokemonById(id)
  }

  const totalPokemonCount = allPokemon.length

  return {
    allPokemon,
    getPokemon,
    totalPokemonCount
  }
}
