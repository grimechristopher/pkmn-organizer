// Core Pokemon types

export interface Pokemon {
  id: number                    // National Dex number
  name: string                  // English name
  slug: string                  // URL-safe identifier
  generation: number            // 1-9
  hasGenderDifference: boolean  // Whether this Pokémon has visible gender differences
  forms: PokemonForm[]          // All forms for this Pokémon
  isShinyLocked: boolean        // Whether this Pokémon is unobtainable as shiny in HOME
}

export interface PokemonForm {
  id: string                    // Unique form identifier (e.g., "pikachu-alola")
  name: string                  // Form name (e.g., "Alolan", "Galarian", "Default")
  isRegionalForm: boolean       // Whether this is a regional variant
  isDefault: boolean            // Whether this is the default/base form
  spritePath: string            // Path to sprite image
  generation: number            // Generation this form was introduced
}

export interface PokemonVariant {
  pokemon: Pokemon              // Reference to base Pokémon
  form: PokemonForm             // Specific form
  gender?: 'male' | 'female'    // Only present if gender differences exist
  isShiny: boolean              // Whether this is the shiny version
  displayOrder: number          // Computed ordering position
  isUnobtainable?: boolean      // For shiny-locked Pokémon in shiny mode
}

export type RegionalFormPlacement = 'after-base' | 'after-generation' | 'after-all'
