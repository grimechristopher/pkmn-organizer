/**
 * Fetch Gen 9 Pokémon data from PokeAPI
 * Creates a data structure compatible with our pokemonRegistry
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const OUTPUT_PATH = path.join(__dirname, '../external/pokesprite/data/pokemon-gen9.json');
const GEN_9_START = 906;
const GEN_9_END = 1025;

// Sleep function to avoid rate limiting
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch data from URL
function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function fetchPokemonData(id) {
  try {
    console.log(`Fetching #${id}...`);

    // Fetch basic Pokemon data
    const pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    // Fetch species data for forms
    const speciesData = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);

    const name = speciesData.names.find(n => n.language.name === 'en')?.name || pokemonData.name;
    const slug = pokemonData.name;

    // Build forms structure
    const forms = {
      '$': true // Default form marker
    };

    // Check for additional forms
    if (pokemonData.forms && pokemonData.forms.length > 1) {
      for (const form of pokemonData.forms) {
        const formData = await fetch(form.url);
        const formName = formData.form_name || formData.name;

        // Skip default form
        if (formName === slug || formName === 'default') continue;

        // Add form
        const formKey = formName.replace(`${slug}-`, '');
        forms[formKey] = {};
      }

      await sleep(200); // Rate limit between form requests
    }

    return {
      idx: String(id).padStart(4, '0'),
      name: { eng: name },
      slug: { eng: slug },
      'gen-8': { forms } // Use gen-8 key for compatibility
    };

  } catch (error) {
    console.error(`Error fetching #${id}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🔍 Fetching Gen 9 Pokémon data from PokeAPI...\n');

  const gen9Data = {};

  for (let id = GEN_9_START; id <= GEN_9_END; id++) {
    const pokemonData = await fetchPokemonData(id);

    if (pokemonData) {
      gen9Data[id] = pokemonData;
    }

    // Rate limiting - be nice to PokeAPI
    await sleep(100);

    // Progress update every 10 Pokemon
    if (id % 10 === 0) {
      console.log(`Progress: ${id - GEN_9_START + 1}/${GEN_9_END - GEN_9_START + 1}`);
    }
  }

  console.log('\n📝 Writing Gen 9 data file...');
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(gen9Data, null, 2), 'utf-8');

  console.log(`✅ Generated ${OUTPUT_PATH}`);
  console.log(`📊 Total Gen 9 Pokémon: ${Object.keys(gen9Data).length}`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
