import { Router } from 'express';
import { getRecipes, searchRecipes } from '../controllers/recipeController.js';

const router = Router();

router.get('/recipes', getRecipes);
router.get('/recipes/search', searchRecipes);

export default router;
