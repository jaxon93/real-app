const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'test123456',  // your MySQL password
  database: 'realapp'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// get all users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// create user
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ id: results.insertId, name, email, password });
    }
  });
});

// delete user
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  db.query('DELETE FROM users WHERE id = ?', userId, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(`User with ID ${userId} deleted successfully`);
    }
  });
});

// Edit user info
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;
  db.query(
    'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
    [name, email, password, userId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(`User with ID ${userId} updated successfully`);
      }
    }
  );
});


app.listen(3000, () => {
  console.log('Server running on port 3000');
});
