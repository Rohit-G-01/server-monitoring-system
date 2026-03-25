const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new Database('metrics.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    host TEXT
  );
  CREATE TABLE IF NOT EXISTS metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id INTEGER,
    cpu REAL,
    ram REAL,
    storage REAL,
    timestamp INTEGER,
    FOREIGN KEY(server_id) REFERENCES servers(id)
  );
`);

function getOrCreateServer(name, host) {
  const row = db.prepare('SELECT id FROM servers WHERE name = ?').get(name);
  if (row) {
    db.prepare('UPDATE servers SET host = ? WHERE id = ?').run(host, row.id);
    return row.id;
  } else {
    const info = db.prepare('INSERT INTO servers (name, host) VALUES (?, ?)').run(name, host);
    return info.lastInsertRowid;
  }
}

app.post('/api/metrics', (req, res) => {
  const { name, host, cpu, ram, storage } = req.body;
  if (!name || !host || cpu === undefined || ram === undefined || storage === undefined) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const serverId = getOrCreateServer(name, host);
  const timestamp = Math.floor(Date.now() / 1000);
  db.prepare('INSERT INTO metrics (server_id, cpu, ram, storage, timestamp) VALUES (?, ?, ?, ?, ?)')
    .run(serverId, cpu, ram, storage, timestamp);
  res.json({ status: 'ok' });
});

app.get('/api/servers', (req, res) => {
  const servers = db.prepare('SELECT id, name, host FROM servers').all();
  const now = Math.floor(Date.now() / 1000);
  const fiveMinAgo = now - 300;

  const result = servers.map(server => {
    const latest = db.prepare(`
      SELECT cpu, ram, storage, timestamp
      FROM metrics
      WHERE server_id = ?
      ORDER BY timestamp DESC
      LIMIT 1
    `).get(server.id);

    const avgRow = db.prepare(`
      SELECT AVG(cpu) as avg_cpu
      FROM metrics
      WHERE server_id = ? AND timestamp >= ?
    `).get(server.id, fiveMinAgo);
    const cpuAvg = avgRow.avg_cpu ? Math.round(avgRow.avg_cpu * 100) / 100 : (latest ? latest.cpu : null);

    return {
      id: server.id,
      name: server.name,
      host: server.host,
      cpu: latest ? latest.cpu : null,
      ram: latest ? latest.ram : null,
      storage: latest ? latest.storage : null,
      cpu_avg_5min: cpuAvg
    };
  });
  res.json(result);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});