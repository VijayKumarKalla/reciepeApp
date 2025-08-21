import { countAll, getAll, search } from '../models/recipeModel.js';

export async function getRecipes(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const [total, data] = await Promise.all([countAll(), getAll({ page, limit })]);

    res.json({ page, limit, total, data: data.map(formatRow) });
  } catch (e) {
    next(e);
  }
}

export async function searchRecipes(req, res, next) {
  try {
    const { title, cuisine, rating, total_time, calories } = req.query;
    const rows = await search({ title, cuisine, rating, total_time, calories });
    res.json({ data: rows.map(formatRow) });
  } catch (e) {
    next(e);
  }
}

function formatRow(row) {
  return {
    id: row.id,
    title: row.title,
    cuisine: row.cuisine,
    rating: row.rating,
    prep_time: row.prep_time,
    cook_time: row.cook_time,
    total_time: row.total_time,
    description: row.description,
    nutrients: row.nutrients ? JSON.parse(row.nutrients) : null,
    serves: row.serves
  };
}
