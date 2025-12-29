/**
 * Script to generate a complete Pokemon registry from PokéSprite data
 */
const fs = require('fs');
const path = require('path');

// Function to check if sprite file exists
function spriteExists(slug, formKey) {
  const spritePath = path.join(__dirname, '../public/sprites/regular', `${slug}${formKey === '$' ? '' : '-' + formKey}.png`);
  return fs.existsSync(spritePath);
}

// Paths
const pokeSpriteDataPath = path.join(__dirname, '../external/pokesprite/data/pokemon.json');
const gen9DataPath = path.join(__dirname, '../external/pokesprite/data/pokemon-gen9.json');
const outputPath = path.join(__dirname, '../src/data/pokemonRegistry.ts');

// Load PokéSprite data (Gen 1-8)
const pokeSpriteData = JSON.parse(fs.readFileSync(pokeSpriteDataPath, 'utf-8'));

// Load Gen 9 data (if exists)
let gen9Data = {};
if (fs.existsSync(gen9DataPath)) {
  gen9Data = JSON.parse(fs.readFileSync(gen9DataPath, 'utf-8'));
  console.log(`📦 Loaded Gen 9 data: ${Object.keys(gen9Data).length} Pokémon`);
}

// Merge Gen 1-8 and Gen 9 data
const allPokemonData = { ...pokeSpriteData, ...gen9Data };

// Generation boundaries (National Dex numbers)
const GENERATION_RANGES = {
  1: { start: 1, end: 151 },
  2: { start: 152, end: 251 },
  3: { start: 252, end: 386 },
  4: { start: 387, end: 493 },
  5: { start: 494, end: 649 },
  6: { start: 650, end: 721 },
  7: { start: 722, end: 809 },
  8: { start: 810, end: 905 },
  9: { start: 906, end: 1025 }
};

// Shiny-locked Pokémon (expand this list based on research)
const SHINY_LOCKED = new Set([
  151,  // Mew (most distributions)
  251,  // Celebi (most distributions)
  385,  // Jirachi (some distributions)
  // Add more as needed
]);

// Pokémon with gender differences in sprites
const HAS_GENDER_DIFFERENCES = new Set([
  3,    // Venusaur
  12,   // Butterfree
  19,   // Rattata
  20,   // Raticate
  25,   // Pikachu
  26,   // Raichu
  41,   // Zubat
  42,   // Golbat
  44,   // Gloom
  45,   // Vileplume
  64,   // Kadabra
  65,   // Alakazam
  84,   // Doduo
  85,   // Dodrio
  97,   // Hypno
  111,  // Rhyhorn
  112,  // Rhydon
  118,  // Goldeen
  119,  // Seaking
  123,  // Scyther
  129,  // Magikarp
  130,  // Gyarados
  154,  // Meganium
  165,  // Ledyba
  166,  // Ledian
  178,  // Xatu
  185,  // Sudowoodo
  186,  // Politoed
  190,  // Aipom
  194,  // Wooper
  195,  // Quagsire
  198,  // Murkrow
  202,  // Wobbuffet
  203,  // Girafarig
  207,  // Gligar
  208,  // Steelix
  212,  // Scizor
  214,  // Heracross
  215,  // Sneasel
  217,  // Ursaring
  221,  // Piloswine
  224,  // Octillery
  229,  // Houndoom
  232,  // Donphan
  255,  // Torchic
  256,  // Combusken
  257,  // Blaziken
  267,  // Beautifly
  269,  // Dustox
  272,  // Ludicolo
  274,  // Nuzleaf
  275,  // Shiftry
  307,  // Meditite
  308,  // Medicham
  315,  // Roselia
  316,  // Gulpin
  317,  // Swalot
  322,  // Numel
  323,  // Camerupt
  332,  // Cacturne
  350,  // Milotic
  369,  // Relicanth
  396,  // Starly
  397,  // Staravia
  398,  // Staraptor
  399,  // Bidoof
  400,  // Bibarel
  401,  // Kricketot
  402,  // Kricketune
  403,  // Shinx
  404,  // Luxio
  405,  // Luxray
  407,  // Roserade
  415,  // Combee
  417,  // Pachirisu
  418,  // Buizel
  419,  // Floatzel
  424,  // Ambipom
  443,  // Gible
  444,  // Gabite
  445,  // Garchomp
  449,  // Hippopotas
  450,  // Hippowdon
  453,  // Croagunk
  454,  // Toxicroak
  456,  // Finneon
  457,  // Lumineon
  459,  // Snover
  460,  // Abomasnow
  461,  // Weavile
  464,  // Rhyperior
  465,  // Tangrowth
  473,  // Mamoswine
  521,  // Unfezant
  592,  // Frillish
  593,  // Jellicent
  668,  // Pyroar
  678,  // Meowstic
  902   // Basculegion
  // NOTE: Oinkologne (916) uses explicit forms instead of gender flag
]);

function getGeneration(dexNum) {
  for (const [gen, range] of Object.entries(GENERATION_RANGES)) {
    if (dexNum >= range.start && dexNum <= range.end) {
      return parseInt(gen);
    }
  }
  return 1; // Default to Gen 1
}

function processPokemon() {
  const pokemonList = [];

  for (const [dexNum, data] of Object.entries(allPokemonData)) {
    const nationalDex = parseInt(dexNum);
    if (isNaN(nationalDex) || nationalDex === 0) continue;

    const name = data.name?.eng || `Pokemon ${dexNum}`;
    const slug = data.slug?.eng || name.toLowerCase();
    const generation = getGeneration(nationalDex);
    const hasGenderDifference = HAS_GENDER_DIFFERENCES.has(nationalDex);
    const isShinyLocked = SHINY_LOCKED.has(nationalDex);

    // Process forms
    const forms = [];
    const gen8Forms = data['gen-8']?.forms || {};

    // For Pokemon with only form variations (no default), skip default form
    const formOnlyPokemon = [854, 855, 869, 666, 1012, 1013, 774, 925, 931, 978, 982]; // Sinistea, Polteageist, Alcremie, Vivillon, Poltchageist, Sinistcha, Minior, Maushold, Squawkabilly, Tatsugiri, Dudunsparce
    const skipDefaultForm = formOnlyPokemon.includes(nationalDex);

    // Add default form (unless Pokemon only has form variations)
    if (!skipDefaultForm) {
      forms.push({
        id: slug,
        name: 'Default',
        isRegionalForm: false,
        isDefault: true,
        spritePath: '',
        generation: generation
      });
    }

    // Add regional and special forms (skip Mega, Gmax, type variations, etc.)
    for (const [formKey, formData] of Object.entries(gen8Forms)) {
      if (formKey === '$') continue; // Skip default form marker

      // Skip non-HOME forms
      if (formKey.includes('mega') || formKey.includes('gmax') ||
          formKey.includes('primal') || formKey.includes('totem')) {
        continue;
      }

      // Skip type-variation forms (held-item based, not in HOME as separate entries)
      // Arceus: fighting, flying, poison, ground, rock, bug, ghost, steel, fire, water, grass, electric, psychic, ice, dragon, dark, fairy, normal, unknown
      // Silvally: same type variations
      // Genesect: douse, shock, burn, chill (drive forms)
      const typeVariations = ['fighting', 'flying', 'poison', 'ground', 'rock', 'bug',
                              'ghost', 'steel', 'fire', 'water', 'grass', 'electric',
                              'psychic', 'ice', 'dragon', 'dark', 'fairy', 'normal', 'unknown',
                              'douse', 'shock', 'burn', 'chill'];

      if (typeVariations.some(type => formKey === type || formKey.endsWith(`-${type}`))) {
        continue;
      }

      // Skip Pikachu forms that are NOT depositable in HOME
      if (nationalDex === 25) { // Pikachu
        // NOT allowed: cosplay forms, starter
        if (formKey.includes('cosplay') || formKey.includes('rock-star') ||
            formKey.includes('belle') || formKey.includes('pop-star') ||
            formKey.includes('phd') || formKey.includes('libre') ||
            formKey.includes('starter')) {
          continue;
        }
        // ALLOWED: All cap forms including partner-cap (per Serebii)
      }

      // Skip Pichu Spiky-eared (cannot be transferred to HOME)
      if (nationalDex === 172 && formKey === 'spiky-eared') {
        continue;
      }

      // Skip Spinda pattern forms (billions of patterns, only default in HOME)
      if (nationalDex === 327 && (formKey === 'blank' || formKey === 'filled')) {
        continue;
      }

      // Skip Castform weather forms (battle-only transformations)
      if (nationalDex === 351 && (formKey === 'sunny' || formKey === 'rainy' || formKey === 'snowy')) {
        continue;
      }

      // Skip Cherrim Sunshine form (battle-only transformation)
      if (nationalDex === 421 && formKey === 'sunshine') {
        continue;
      }

      // Skip Origin formes (revert to Altered/default in HOME)
      if ((nationalDex === 483 || nationalDex === 484 || nationalDex === 487) && formKey === 'origin') {
        continue; // Dialga, Palkia, Giratina Origin formes
      }

      // Skip Darmanitan Zen mode (battle-only transformation)
      if (nationalDex === 555 && formKey.includes('zen')) {
        continue;
      }

      // Skip Floette Eternal Flower (unreleased event, not depositable)
      if (nationalDex === 670 && formKey === 'eternal') {
        continue;
      }

      // Skip Xerneas Active form (battle-only transformation)
      if (nationalDex === 716 && formKey === 'active') {
        continue;
      }

      // Skip Zygarde Complete forme (not depositable in HOME)
      if (nationalDex === 718 && formKey === 'complete') {
        continue;
      }

      // Skip fusion forms (not depositable in HOME) - Pokemon-specific to avoid false matches
      if (nationalDex === 646 && (formKey === 'black' || formKey === 'white')) {
        continue; // Kyurem Black/White fusions
      }
      if (nationalDex === 800 && (formKey.includes('dawn') || formKey.includes('dusk') || formKey.includes('ultra'))) {
        continue; // Necrozma Dawn Wings/Dusk Mane/Ultra fusions
      }
      if (nationalDex === 898 && (formKey.includes('shadow-rider') || formKey.includes('ice-rider'))) {
        continue; // Calyrex Shadow Rider/Ice Rider fusions
      }

      // Skip battle-only and forms without sprites
      const battleOnlyForms = [
        'gorging', 'gulping',        // Cramorant (battle-only)
        'eternamax',                  // Eternatus (battle-only)
        'hero-of-many-battles',       // Zacian/Zamazenta (same sprite as default)
        'full-belly', 'ice',          // Morpeko/Eiscue (default sprites)
        'school',                     // Wishiwashi (battle form)
        'disguised',                  // Mimikyu (same as default)
        'incarnate',                  // Enamorus, Landorus, etc (default form)
        'aria',                       // Meloetta (default form)
        'pirouette',                  // Meloetta (battle-only transformation)
        'shield', 'blade',            // Aegislash (battle forms)
        'solo',                       // Dudunsparce (default)
        'noble',                      // Legends Arceus Noble Pokemon (battle-only bosses)
        'shadow'                      // Shadow Pokemon (XD: Gale of Darkness, not transferable)
      ];

      if (battleOnlyForms.some(form => formKey === form || formKey.includes(form))) {
        continue;
      }

      // Skip Alcremie "plain" forms (not one of the 7 official sweets in HOME)
      // Alcremie has 9 creams × 7 sweets = 63 forms (no "plain" sweet exists)
      if (nationalDex === 869 && formKey.includes('plain')) {
        continue;
      }

      // All Furfrou trims ARE depositable in HOME (when transferred from Pokemon GO)
      // 9 trims total: Heart, Star, Diamond, Debutante, Matron, Dandy, La Reine, Kabuki, Pharaoh

      // Skip default form aliases (forms that are the default but have a different name in data)
      const defaultFormAliases = [
        { dex: 550, forms: ['red-striped'] },           // Basculin (red-striped is default)
        { dex: 669, forms: ['red'] },                    // Flabébé (red is default)
        { dex: 670, forms: ['red'] },                    // Floette (red is default)
        { dex: 671, forms: ['red'] },                    // Florges (red is default)
        { dex: 745, forms: ['midday'] }                  // Lycanroc (midday is default)
      ];

      const aliasMatch = defaultFormAliases.find(a => a.dex === nationalDex);
      if (aliasMatch && aliasMatch.forms.includes(formKey)) {
        continue;
      }

      // Skip Minior meteor form (only colored cores are depositable)
      if (nationalDex === 774) {
        if (formKey === '$' || formKey.includes('-gen7') || formKey.includes('-meteor')) {
          continue; // Skip default meteor form, gen7 variants, and meteor duplicates
        }
      }

      // Skip Marshadow gen7 duplicate form
      if (nationalDex === 802 && formKey === 'gen7') {
        continue;
      }

      // Skip Zacian/Zamazenta crowned forms (revert to base in HOME)
      if ((nationalDex === 888 || nationalDex === 889) && formKey === 'crowned') {
        continue;
      }

      // Urshifu: Keep both rapid-strike and default (single-strike is default)
      // Both forms are depositable in HOME

      // Oricorio: Keep all dance style forms (baile, pom-pom, pau, sensu)
      // All are depositable in HOME

      // Alcremie: Already filtered above - too many variations

      // Minior: Keep core forms if they have sprites
      // Wishiwashi: School form already filtered (battle-only)

      // Zacian/Zamazenta: Keep crowned form, hero-of-many-battles already filtered

      // Track sprite form key separately (may differ from display form key)
      let spriteFormKey = formKey;

      // Special handling for forms that reuse sprites
      if (nationalDex === 718) {
        if (formKey === 'power-construct') {
          spriteFormKey = '$'; // Use default sprite
        } else if (formKey === '10-power-construct') {
          spriteFormKey = '10'; // Use 10% sprite
        }
      }

      // Rockruff Own Tempo (same sprite as default)
      if (nationalDex === 744 && formKey === 'own-tempo') {
        spriteFormKey = '$'; // Use default sprite
      }

      // CRITICAL: Check if sprite actually exists before including form
      if (!spriteExists(slug, spriteFormKey)) {
        continue; // Skip forms without sprites
      }

      // Check if it's a regional form (but exclude cap forms like "alola-cap" which aren't regional)
      const isRegional = !formKey.includes('-cap') && (
        formKey.includes('alola') || formKey.includes('galar') ||
        formKey.includes('hisui') || formKey.includes('paldea')
      );

      let formName = formKey.charAt(0).toUpperCase() + formKey.slice(1);

      // Only rename to regional form names if it's actually a regional form (not cap forms)
      if (isRegional) {
        if (formKey.includes('alola')) formName = 'Alolan';
        if (formKey.includes('galar')) formName = 'Galarian';
        if (formKey.includes('hisui')) formName = 'Hisuian';
        if (formKey.includes('paldea')) {
          // Special handling for Paldean Tauros breeds
          if (nationalDex === 128) {
            if (formKey.includes('combat')) formName = 'Paldea-combat';
            else if (formKey.includes('blaze')) formName = 'Paldea-blaze';
            else if (formKey.includes('aqua')) formName = 'Paldea-aqua';
          } else {
            formName = 'Paldean';
          }
        }
      }

      // Special handling for Zygarde Power Construct form names
      if (nationalDex === 718) {
        if (formKey === 'power-construct') {
          formName = 'Power Construct';
        } else if (formKey === '10-power-construct') {
          formName = '10% Power Construct';
        }
      }

      // Special handling for Rockruff Own Tempo
      if (nationalDex === 744 && formKey === 'own-tempo') {
        formName = 'Own Tempo';
      }

      const formGen = isRegional ? (
        formKey.includes('alola') ? 7 :
        formKey.includes('galar') ? 8 :
        formKey.includes('hisui') ? 8 :
        formKey.includes('paldea') ? 9 :
        generation
      ) : generation;

      // For form-only Pokemon, mark first form as default
      const isDefaultForm = skipDefaultForm && forms.length === 0;

      forms.push({
        id: `${slug}-${formKey}`,
        name: formName,
        isRegionalForm: isRegional,
        isDefault: isDefaultForm,
        spritePath: '',
        generation: formGen
      });
    }

    pokemonList.push({
      id: nationalDex,
      name,
      slug,
      generation,
      hasGenderDifference,
      isShinyLocked,
      forms
    });
  }

  // Sort by National Dex number
  pokemonList.sort((a, b) => a.id - b.id);

  return pokemonList;
}

function escapeString(str) {
  return str.replace(/'/g, "\\'");
}

function generateTypeScriptFile(pokemonList) {
  let output = `import type { Pokemon } from '../types/pokemon'\n\n`;
  output += `/**\n * Pokemon Registry - Complete list from PokéSprite\n */\n`;
  output += `export const ALL_POKEMON: Pokemon[] = [\n`;

  for (const pokemon of pokemonList) {
    output += `  {\n`;
    output += `    id: ${pokemon.id},\n`;
    output += `    name: '${escapeString(pokemon.name)}',\n`;
    output += `    slug: '${escapeString(pokemon.slug)}',\n`;
    output += `    generation: ${pokemon.generation},\n`;
    output += `    hasGenderDifference: ${pokemon.hasGenderDifference},\n`;
    output += `    isShinyLocked: ${pokemon.isShinyLocked},\n`;
    output += `    forms: [\n`;

    for (const form of pokemon.forms) {
      output += `      { id: '${escapeString(form.id)}', name: '${escapeString(form.name)}', isRegionalForm: ${form.isRegionalForm}, isDefault: ${form.isDefault}, spritePath: '', generation: ${form.generation} },\n`;
    }

    output += `    ]\n`;
    output += `  },\n`;
  }

  output += `]\n\n`;
  output += `export function getAllPokemon(): Pokemon[] {\n`;
  output += `  return ALL_POKEMON\n`;
  output += `}\n\n`;
  output += `export function getPokemonById(id: number): Pokemon | undefined {\n`;
  output += `  return ALL_POKEMON.find(p => p.id === id)\n`;
  output += `}\n`;

  return output;
}

// Main execution
try {
  console.log('🔍 Processing PokéSprite data...');
  const pokemonList = processPokemon();
  console.log(`✅ Processed ${pokemonList.length} Pokémon`);

  // Count total forms
  const totalForms = pokemonList.reduce((sum, pokemon) => sum + pokemon.forms.length, 0);
  console.log(`📊 Total forms: ${totalForms}`);

  console.log('📝 Generating TypeScript file...');
  const tsContent = generateTypeScriptFile(pokemonList);

  console.log('💾 Writing to file...');
  fs.writeFileSync(outputPath, tsContent, 'utf-8');

  console.log(`✅ Generated ${outputPath}`);
  console.log(`📊 Total Pokémon: ${pokemonList.length}`);
  console.log(`📊 Total forms in registry: ${totalForms}`);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
