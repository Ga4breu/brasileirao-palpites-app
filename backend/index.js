const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

function getUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

function getUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

function createUser(name, email, password) {
  const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
  const info = stmt.run(name, email, password);
  return { id: String(info.lastInsertRowid), name, email, password };
}

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Missing token' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

function getMatches() {
  return db.prepare('SELECT * FROM matches ORDER BY match_date').all();
}

function createMatch(round, homeTeam, awayTeam, matchDate) {
  const stmt = db.prepare('INSERT INTO matches (round, home_team, away_team, match_date) VALUES (?, ?, ?, ?)');
  const info = stmt.run(round, homeTeam, awayTeam, matchDate);
  return info.lastInsertRowid;
}

function savePrediction(userId, matchId, homeScore, awayScore) {
  const stmt = db.prepare(`
    INSERT INTO predictions (user_id, match_id, home_score, away_score)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, match_id) DO UPDATE SET home_score=excluded.home_score, away_score=excluded.away_score
  `);
  stmt.run(userId, matchId, homeScore, awayScore);
}

function getPredictionsByUser(userId) {
  return db.prepare('SELECT * FROM predictions WHERE user_id = ?').all(userId);
}

function calculatePoints(match, prediction) {
  if (match.home_score == null || match.away_score == null) return 0;
  if (match.home_score === prediction.home_score && match.away_score === prediction.away_score) {
    return 3;
  }
  const matchOutcome = Math.sign(match.home_score - match.away_score);
  const predOutcome = Math.sign(prediction.home_score - prediction.away_score);
  return matchOutcome === predOutcome ? 1 : 0;
}

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  const existing = getUserByEmail(email);
  if (existing) return res.status(409).json({ message: 'User exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = createUser(name, email, hashed);
  const token = generateToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = generateToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.get('/api/profile', authMiddleware, (req, res) => {
  const user = getUserById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.get('/api/matches', (req, res) => {
  res.json(getMatches());
});

app.post('/api/predictions', authMiddleware, (req, res) => {
  const { matchId, homeScore, awayScore } = req.body;
  if (!matchId || homeScore === undefined || awayScore === undefined) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  savePrediction(req.user.id, matchId, homeScore, awayScore);
  res.json({ message: 'Prediction saved' });
});

app.get('/api/predictions', authMiddleware, (req, res) => {
  res.json(getPredictionsByUser(req.user.id));
});

app.get('/api/ranking', (req, res) => {
  const users = db.prepare('SELECT id, name FROM users').all();
  const matches = db.prepare('SELECT * FROM matches WHERE home_score IS NOT NULL AND away_score IS NOT NULL').all();
  const preds = db.prepare('SELECT * FROM predictions').all();

  const ranking = users.map(u => {
    const userPreds = preds.filter(p => p.user_id === u.id);
    let points = 0;
    for (const p of userPreds) {
      const match = matches.find(m => m.id === p.match_id);
      if (match) {
        points += calculatePoints(match, p);
      }
    }
    return { id: String(u.id), name: u.name, points };
  }).sort((a, b) => b.points - a.points);

  ranking.forEach((r, i) => { r.position = i + 1; });

  res.json(ranking);
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
