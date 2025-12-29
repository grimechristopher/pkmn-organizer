/**
 * Download Gen 9 sprites from PokeAPI as placeholders
 * These are NOT HOME-style sprites but will work until proper sprites are obtained
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const REGULAR_DIR = path.join(__dirname, '../public/sprites/regular');
const SHINY_DIR = path.join(__dirname, '../public/sprites/shiny');
const GEN_9_START = 906;
const GEN_9_END = 1025;

// Ensure directories exist
if (!fs.existsSync(REGULAR_DIR)) fs.mkdirSync(REGULAR_DIR, { recursive: true });
if (!fs.existsSync(SHINY_DIR)) fs.mkdirSync(SHINY_DIR, { recursive: true });

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function downloadSprites() {
  console.log('🔍 Downloading Gen 9 sprites from PokeAPI...\n');
  console.log('⚠️  Note: These are placeholder sprites from PokeAPI');
  console.log('⚠️  For HOME-style sprites, see GEN9_SPRITES_GUIDE.md\n');

  let downloaded = 0;
  let failed = 0;

  for (let id = GEN_9_START; id <= GEN_9_END; id++) {
    try {
      // Get Pokemon name/slug from our Gen 9 data
      const gen9DataPath = path.join(__dirname, '../external/pokesprite/data/pokemon-gen9.json');
      const gen9Data = JSON.parse(fs.readFileSync(gen9DataPath, 'utf-8'));
      const pokemonData = gen9Data[id];

      if (!pokemonData) {
        console.log(`⏭️  Skipping #${id} (no data)`);
        continue;
      }

      const slug = pokemonData.slug.eng;
      console.log(`📥 Downloading #${id}: ${pokemonData.name.eng} (${slug})`);

      // Download regular sprite
      const regularUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
      const regularPath = path.join(REGULAR_DIR, `${slug}.png`);
      await downloadImage(regularUrl, regularPath);

      // Download shiny sprite
      const shinyUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;
      const shinyPath = path.join(SHINY_DIR, `${slug}.png`);
      await downloadImage(shinyUrl, shinyPath);

      downloaded++;

      // Rate limiting
      await sleep(100);

      if (id % 10 === 0) {
        console.log(`Progress: ${id - GEN_9_START + 1}/${GEN_9_END - GEN_9_START + 1}`);
      }

    } catch (error) {
      console.error(`❌ Failed to download #${id}:`, error.message);
      failed++;
    }
  }

  console.log(`\n✅ Download complete!`);
  console.log(`📊 Downloaded: ${downloaded} Pokémon`);
  if (failed > 0) {
    console.log(`⚠️  Failed: ${failed}`);
  }
  console.log(`\n📝 Next step: Run 'node scripts/generatePokemonRegistry.cjs'`);
}

downloadSprites().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
