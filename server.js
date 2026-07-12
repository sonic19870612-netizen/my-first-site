const path = require('path');
const fs = require('fs');
const express = require('express');
const { DatabaseSync } = require('node:sqlite');

const dataDir = path.join(__dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(path.join(dataDir, 'guestbook.db'));
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/messages', (req, res) => {
  const rows = db
    .prepare('SELECT id, name, message, created_at FROM messages ORDER BY id DESC LIMIT 100')
    .all();
  res.json(rows);
});

app.post('/api/messages', (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';

  if (!name || !message) {
    return res.status(400).json({ error: '名字和留言都不能空白喔' });
  }
  if (name.length > 30 || message.length > 200) {
    return res.status(400).json({ error: '名字最多 30 字,留言最多 200 字' });
  }

  const info = db
    .prepare('INSERT INTO messages (name, message) VALUES (?, ?)')
    .run(name, message);
  const row = db
    .prepare('SELECT id, name, message, created_at FROM messages WHERE id = ?')
    .get(info.lastInsertRowid);
  res.status(201).json(row);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Guestbook server listening on port ${port}`);
});
