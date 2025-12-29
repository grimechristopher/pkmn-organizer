/**
 * Download sprites for Pokemon forms that have identical visuals
 * but are tracked separately in Pokemon HOME
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const REGULAR_DIR = path.join(__dirname, '../public/sprites/regular');
const SHINY_DIR = path.join(__dirname, '../public/sprites/shiny');

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed: ${response.statusCode}`));
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

async function copySprite(sourceName, targetName, type = 'regular') {
  const dir = type === 'regular' ? REGULAR_DIR : SHINY_DIR;
  const sourcePath = path.join(dir, `${sourceName}.png`);
  const targetPath = path.join(dir, `${targetName}.png`);

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`  ✓ Copied ${type}/${targetName}.png`);
  } else {
    console.log(`  ⚠ Source not found: ${sourcePath}`);
  }
}

async function main() {
  console.log('🔍 Downloading form sprites...\n');

  // These forms have identical visuals but are separate HOME entries
  const formsToCopy = [
    // Gen 8 - Sinistea/Polteageist
    { base: 'sinistea', forms: ['sinistea-phony', 'sinistea-antique'] },
    { base: 'polteageist', forms: ['polteageist-phony', 'polteageist-antique'] },

    // Gen 9 - Maushold
    { base: 'maushold', forms: ['maushold-family-of-three', 'maushold-family-of-four'] },

    // Gen 9 - Poltchageist/Sinistcha
    { base: 'poltchageist', forms: ['poltchageist-counterfeit', 'poltchageist-artisan'] },
    { base: 'sinistcha', forms: ['sinistcha-unremarkable', 'sinistcha-masterpiece'] },
  ];

  // First, ensure base sprites exist
  const needDownload = [];
  for (const { base } of formsToCopy) {
    const regularPath = path.join(REGULAR_DIR, `${base}.png`);
    if (!fs.existsSync(regularPath)) {
      needDownload.push(base);
    }
  }

  // Download missing base sprites from PokeAPI
  if (needDownload.length > 0) {
    console.log('📥 Downloading missing base sprites:\n');
    for (const slug of needDownload) {
      try {
        // Get Pokemon ID from slug
        const idMap = {
          'polteageist': 855,
          'maushold': 925,
          'poltchageist': 1012,
          'sinistcha': 1013
        };
        const id = idMap[slug];

        if (id) {
          console.log(`  Downloading ${slug} (#${id})...`);
          const regularUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
          const shinyUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;

          await downloadImage(regularUrl, path.join(REGULAR_DIR, `${slug}.png`));
          await downloadImage(shinyUrl, path.join(SHINY_DIR, `${slug}.png`));
          console.log(`  ✓ Downloaded ${slug}`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to download ${slug}:`, error.message);
      }
    }
    console.log();
  }

  // Copy base sprites to form variants
  console.log('📋 Creating form variants (identical visuals):\n');
  for (const { base, forms } of formsToCopy) {
    console.log(`${base}:`);
    for (const formName of forms) {
      await copySprite(base, formName, 'regular');
      await copySprite(base, formName, 'shiny');
    }
    console.log();
  }

  console.log('✅ Form sprites complete!');
  console.log('\n📝 Next: Run node scripts/generatePokemonRegistry.cjs');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
