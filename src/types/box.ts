import type { PokemonVariant } from './pokemon'

// Box and layout types

export interface Box {
  id: string                    // Unique box identifier
  number: number                // Box number (1, 2, 3, etc.)
  title?: string                // Optional custom title
  generation?: number           // Generation label if organized by generation
  slots: BoxSlot[]              // Always 30 slots (6×5 grid)
}

export interface BoxSlot {
  position: number              // Position within box (0-29)
  variant: PokemonVariant | null // The Pokémon variant in this slot (null = empty)
}
