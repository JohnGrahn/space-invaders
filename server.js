import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create leaderboard table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS leaderboard (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add score to leaderboard
app.post('/api/leaderboard', async (req, res) => {
  const { name, score } = req.body;
  try {
    await pool.query('INSERT INTO leaderboard (name, score) VALUES ($1, $2)', [name, score]);
    res.status(201).json({ message: 'Score added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding score' });
  }
});

// Get top 10 scores
app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await pool.query('SELECT name, score FROM leaderboard ORDER BY score DESC LIMIT 10');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving leaderboard' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));