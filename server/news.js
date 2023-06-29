const express = require('express');
const router = express.Router();
const pool = require('./connection');

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Get a list of news
 *     responses:
 *       200: 
 *         description: news list (OK)
 */
router.get('/', (req, res) => {
  pool.query('SELECT * FROM news ORDER BY id', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      throw error;
    }
    res.status(200).json(results);
  });
});

/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: Get a single news with {id}
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the news to retrieve.
 *     responses:
 *       200:
 *         description: A single news (OK).
 *       400:
 *         description: Invalid ID.
 *       404:
 *         description: News not found.
 */
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

/**
 * @swagger
 * /news/new:
 *   post:
 *     summary: Create a new news
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               summary:
 *                 type: string
 *               link:
 *                 type: string
 *               published_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: News created (OK).
 *       400:
 *         description: Invalid input, object invalid.
 *       500:
 *         description: Internal Server Error.
 */
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