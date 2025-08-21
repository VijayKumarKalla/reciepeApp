import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, '..', 'recipes.db');
const SCHEMA_FILE = path.join(__dirname, 'schema.sql');

export const db = new sqlite3.Database(DB_FILE);

export function initDb() {
  const schema = fs.readFileSync(SCHEMA_FILE, 'utf-8');
  return new Promise((resolve, reject) => {
    db.exec(schema, (err) => (err ? reject(err) : resolve()));
  });
}

process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
