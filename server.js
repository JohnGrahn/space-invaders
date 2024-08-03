import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Add CSP headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
  );
  next();
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create leaderboard table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS leaderboard (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    waves INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add score to leaderboard
app.post('/api/leaderboard', async (req, res) => {
  const { name, score, waves } = req.body;
  try {
    await pool.query('INSERT INTO leaderboard (name, score, waves) VALUES ($1, $2, $3)', [name, score, waves]);
    res.status(201).json({ message: 'Score added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding score' });
  }
});

// Get top 10 scores
app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query('SELECT name, score, waves FROM leaderboard ORDER BY score DESC LIMIT 10');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
