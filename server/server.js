const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

const HISTORY_FILE = path.join(__dirname, 'history.json');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.post('/save', (req, res) => {
  const { entry } = req.body;
  let history = [];

  if (fs.existsSync(HISTORY_FILE)) {
    history = JSON.parse(fs.readFileSync(HISTORY_FILE));
  }

  history.unshift(entry);
  if (history.length > 10) history.pop();

  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history));
  res.sendStatus(200);
});

app.get('/history', (req, res) => {
  if (fs.existsSync(HISTORY_FILE)) {
    const data = JSON.parse(fs.readFileSync(HISTORY_FILE));
    res.json(data);
  } else {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
