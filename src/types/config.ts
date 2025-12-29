import type { RegionalFormPlacement } from './pokemon'

// Configuration types

export interface AppConfig {
  id: string                          // Config identifier ('normal' | 'shiny')
  name: string                        // Display name
  isShiny: boolean                    // Show shiny sprites
  divideByGeneration: boolean         // Start new box at generation boundaries
  splitLegendsArceus: boolean         // Split Legends: Arceus Pokémon (899-905) into separate box
  includeGenderDifferences: boolean   // Show gender variants as separate entries
  includeRegionalForms: boolean       // Show regional forms (Alolan, Galarian, etc.)
  includeAlternateForms: boolean      // Show alternate forms (Vivillon patterns, Rotom forms, etc.)
  regionalFormPlacement: RegionalFormPlacement // Where to place regional forms
  includePowerConstructForms: boolean // Show Zygarde Complete forme (Power Construct)
}
