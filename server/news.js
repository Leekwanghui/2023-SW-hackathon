const express = require('express');
const router = express.Router();
const pool = require('./connection');

router.get('/', (req, res) => {
  pool.query('SELECT * FROM news ORDER BY id', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      throw error;
    }
    res.status(200).json(results);
  });
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid News ID' });
  }

  pool.query('SELECT * FROM news WHERE id = ?', [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      throw error;
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'News not found' });
    }
    res.status(200).json(results);
  });
});

router.post('/new', (req, res) => {
  const { title, author, category, summary, link, published_at } = req.body;

  if (!title || !author || !category || !link) {
    return res.status(400).json({ error: 'title, author, category, link values should be provided' });
  }

  pool.query('INSERT INTO news (title, author, category, summary, link, published_at) VALUES (?, ?, ?, ?, ?, ?)', [title, author, category, summary, link, published_at], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      throw error;
    }
    res.status(201).json({ message: `News added with ID: ${results.insertId}` });
  });
});

module.exports = router;
