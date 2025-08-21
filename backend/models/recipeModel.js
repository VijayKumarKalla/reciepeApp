import { db } from '../db/database.js';

export function countAll() {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as cnt FROM recipes', (err, row) => {
      if (err) return reject(err);
      resolve(row.cnt || 0);
    });
  });
}

export function getAll({ page = 1, limit = 10 }) {
  const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10));
  const offset = (Math.max(1, Number(page) || 1) - 1) * safeLimit;

  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, title, cuisine, rating, prep_time, cook_time, total_time, description, nutrients, serves
       FROM recipes
       ORDER BY rating DESC NULLS LAST, id ASC
       LIMIT ? OFFSET ?`,
      [safeLimit, offset],
      (err, rows) => {
        if (err) {
          // Some sqlite builds don't support "NULLS LAST"
          // Fallback: order by (rating IS NULL), rating DESC
          if (String(err).includes('near "NULLS"')) {
            return db.all(
              `SELECT id, title, cuisine, rating, prep_time, cook_time, total_time, description, nutrients, serves
               FROM recipes
               ORDER BY (rating IS NULL), rating DESC, id ASC
               LIMIT ? OFFSET ?`,
              [safeLimit, offset],
              (e2, rows2) => (e2 ? reject(e2) : resolve(rows2))
            );
          }
          return reject(err);
        }
        resolve(rows);
      }
    );
  });
}

function parseOpParam(paramVal) {
  // Supports: ">=4.5", "<=400", "=30", "> 10", "< 90"
  // Returns {op, value} or null
  if (!paramVal) return null;
  const s = String(paramVal).trim();
  const m = s.match(/^(<=|>=|=|<|>)\s*(\d+(\.\d+)?)/);
  if (!m) return null;
  return { op: m[1], value: Number(m[2]) };
}

export function search({ title, cuisine, rating, total_time, calories }) {
  const clauses = [];
  const params = [];

  if (title) {
    clauses.push('title LIKE ?');
    params.push(`%${title}%`);
  }
  if (cuisine) {
    clauses.push('cuisine = ?');
    params.push(cuisine);
  }

  const r = parseOpParam(rating);
  if (r) {
    clauses.push(`rating ${r.op} ?`);
    params.push(r.value);
  }

  const t = parseOpParam(total_time);
  if (t) {
    clauses.push(`total_time ${t.op} ?`);
    params.push(t.value);
  }

  const c = parseOpParam(calories);
  if (c) {
    clauses.push(`calories_value ${c.op} ?`);
    params.push(Math.round(c.value));
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const sql = `
    SELECT id, title, cuisine, rating, prep_time, cook_time, total_time, description, nutrients, serves
    FROM recipes
    ${where}
    ORDER BY rating DESC, id ASC
    LIMIT 200
  `;

  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}
