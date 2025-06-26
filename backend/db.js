const Database = require('better-sqlite3');
require('dotenv').config();

const dbPath = process.env.DB_PATH || 'database.sqlite';
const db = new Database(dbPath);

// Ensure base tables exist
const createUsers = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)`;

const createMatches = `
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  round INTEGER NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  match_date TEXT NOT NULL,
  home_score INTEGER,
  away_score INTEGER
)`;

const createPredictions = `
CREATE TABLE IF NOT EXISTS predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  match_id INTEGER NOT NULL,
  home_score INTEGER NOT NULL,
  away_score INTEGER NOT NULL,
  UNIQUE(user_id, match_id)
)`;

db.exec(createUsers);
db.exec(createMatches);
db.exec(createPredictions);

// Seed example data if database is empty
const matchesCount = db.prepare('SELECT COUNT(*) as count FROM matches').get().count;
if (matchesCount === 0) {
  const stmt = db.prepare('INSERT INTO matches (round, home_team, away_team, match_date) VALUES (?, ?, ?, ?)');
  stmt.run(1, 'Flamengo', 'Palmeiras', new Date().toISOString());
  stmt.run(1, 'Santos', 'Corinthians', new Date().toISOString());
}

module.exports = db;

