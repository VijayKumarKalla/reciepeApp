import fs from 'fs';
import path from 'path';

/**
 * Clean numeric value: converts NaN/"NaN"/invalid -> null
 */
export function cleanNumber(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') {
    return Number.isFinite(val) ? val : null;
  }
  const s = String(val).trim();
  if (s.length === 0) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/**
 * Extract integer calories from strings like "389 kcal" or "389kcal"
 */
export function extractCalories(nutrients) {
  if (!nutrients || typeof nutrients !== 'object') return null;
  const raw = nutrients.calories || nutrients.calorieContent || nutrients.cal || null;
  if (!raw) return null;
  const match = String(raw).match(/(\d+(\.\d+)?)/);
  if (!match) return null;
  return Math.round(Number(match[1]));
}

/**
 * Load and normalize recipe records from US_recipes.json
 */
export function loadRecipes(jsonPath) {
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const arr = JSON.parse(raw);

  if (!Array.isArray(arr)) {
    throw new Error('JSON root must be an array of recipes');
  }

  return arr.map((r) => {
    const rating = cleanNumber(r.rating);
    const prep_time = cleanNumber(r.prep_time);
    const cook_time = cleanNumber(r.cook_time);
    const total_time = cleanNumber(r.total_time);
    const nutrients = r.nutrients && typeof r.nutrients === 'object' ? r.nutrients : null;
    const calories_value = extractCalories(nutrients);

    return {
      cuisine: r.cuisine || null,
      title: r.title || null,
      rating,
      prep_time,
      cook_time,
      total_time,
      description: r.description || null,
      nutrients: nutrients ? JSON.stringify(nutrients) : null,
      serves: r.serves || null,
      calories_value
    };
  });
}
