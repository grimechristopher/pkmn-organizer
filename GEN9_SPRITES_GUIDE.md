# Gen 9 Sprites Setup Guide

## Current Status
Gen 9 Pokémon data (#906-1025) is being fetched from PokeAPI, but sprites need to be obtained manually.

## Option 1: The Spriters Resource (Recommended - HOME Style)

### Download Sprites
1. Visit [Pokémon HOME on Spriters Resource](https://www.spriters-resource.com/nintendo_switch/pokemonhome/)
2. Download "Pokémon Previews (9th Generation)" zip file
3. Extract the zip file

### Organize Sprites
The sprites should be organized into:
```
public/sprites/
├── regular/     # Normal Gen 9 sprites
│   ├── sprigatito.png
│   ├── floragato.png
│   └── ...
└── shiny/       # Shiny Gen 9 sprites
    ├── sprigatito.png
    ├── floragato.png
    └── ...
```

### Naming Convention
- Use lowercase slug names (e.g., `sprigatito.png`, `iron-valiant.png`)
- Forms: `pokemon-form.png` (e.g., `tauros-paldea-combat.png`)
- Size: Should match existing sprites (~68x56px HOME style)

## Option 2: PokeAPI Sprites (Fallback)

If HOME-style sprites aren't available, you can use PokeAPI sprites:

```bash
# Run the download script (to be created)
node scripts/downloadGen9Sprites.cjs
```

This will download front-facing sprites from PokeAPI as a temporary solution.

## Verification

After adding sprites, run:
```bash
node scripts/generatePokemonRegistry.cjs
```

The script will check for sprite existence and only include forms with available sprites.

## Notes
- Gen 9 includes Pokémon #906 (Sprigatito) through #1025 (Pecharunt)
- Some Pokémon have regional forms (Paldean Tauros, Paldean Wooper)
- Paradox Pokémon and Legendary forms are included
