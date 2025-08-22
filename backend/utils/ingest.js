import path from 'path';
import { fileURLToPath } from 'url';
import { db, initDb } from '../db/database.js';
import { loadRecipes } from './parseJSON.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  await initDb();

  const jsonFile = path.join(__dirname, '..', 'data', 'US_recipes_clean.json');
  if (!fs.existsSync(jsonFile)) {
    console.error(`Data file not found at: ${jsonFile}`);
    process.exit(1);
  }

  const rows = loadRecipes(jsonFile);

  await new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('DELETE FROM recipes', (err) => {
        if (err) return reject(err);

        const stmt = db.prepare(
          `INSERT INTO recipes
          (cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves, calories_value)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );

        for (const r of rows) {
          stmt.run([
            r.cuisine,
            r.title,
            r.rating,
            r.prep_time,
            r.cook_time,
            r.total_time,
            r.description,
            r.nutrients,
            r.serves,
            r.calories_value
          ]);
        }

        stmt.finalize((e) => (e ? reject(e) : resolve()));
      });
    });
  });

  console.log(`Ingested ${rows.length} recipes.`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
