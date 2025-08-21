import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initDb } from './db/database.js';
import recipeRoutes from './routes/recipeRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', recipeRoutes);
app.use(errorHandler);

const INIT_ONLY = process.argv.includes('--init-only');

initDb()
  .then(() => {
    console.log('DB initialized');
    if (!INIT_ONLY) {
      app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    } else {
      process.exit(0);
    }
  })
  .catch((e) => {
    console.error('DB init failed:', e);
    process.exit(1);
  });
