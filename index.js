// index.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { router } from './routes.js';
import { initializeDatabase } from './database.js';

// Configure dotenv
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api', router);

// Root route
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Initialize database and start server
const PORT = process.env.PORT || 3000;

try {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
} catch (error) {
  console.error('Failed to initialize the application:', error);
  process.exit(1);
}