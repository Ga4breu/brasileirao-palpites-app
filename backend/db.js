const Database = require('better-sqlite3');
require('dotenv').config();

const dbPath = process.env.DB_PATH || 'database.sqlite';
const db = new Database(dbPath);

// Ensure users table exists
const createTable = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)`;

db.exec(createTable);

module.exports = db;

