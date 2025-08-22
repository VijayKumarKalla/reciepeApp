import fs from 'fs';
import path from 'path';

// Change these paths as needed
const inputPath = path.resolve('../data/US_recipes.json');
const outputPath = path.resolve('../data/US_recipes_clean.json');

// Read file as text and clean known bad values
function cleanRawJSON(rawText) {
  return rawText
    .replace(/\bNaN\b/g, 'null')
    .replace(/\bundefined\b/g, 'null')
    .replace(/\bInfinity\b/g, 'null')
    .replace(/\b-Infinity\b/g, 'null');
}

try {
  const raw = fs.readFileSync(inputPath, 'utf-8');
  const cleanedText = cleanRawJSON(raw);
  const parsed = JSON.parse(cleanedText); // now it works!

  const asArray = Array.isArray(parsed) ? parsed : Object.values(parsed);
  fs.writeFileSync(outputPath, JSON.stringify(asArray, null, 2));

  console.log(`✅ Cleaned and saved to ${outputPath}`);
} catch (err) {
  console.error('❌ Failed to clean JSON:', err.message);
}
