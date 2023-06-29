const express = require('express');
const router = express.Router();
const pool = require('./connection');

/**
 * @swagger
 * /comment/{id}:
 *   get:
 *     summary: Get a list of comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MyNews Id
 *     responses:
 *       200: 
 *         description: comment list (OK)
 */
router.get('/:id', (req, res) => {
  pool.query('SELECT * FROM comment WHERE post_num=? ORDER BY id DESC', [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      throw error;
    }
    res.status(200).json(results);
  });
});

/**
 * @swagger
 * /comment/new:
 *   post:
 *     summary: Create a new comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post_num:
 *                 type: string
 *               author:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       201:
 *         description: comment created (OK).
 *       400:
 *         description: Invalid input, object invalid.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/new', (req, res) => {
  const { post_num, author, body } = req.body;

  if (!post_num || !author || !body) {
    return res.status(400).json({ error: 'post_num, author, body, values should be provided' });
  }

  pool.query('INSERT INTO comments (post_num, author, body) VALUES (?, ?, ?)', [post_num, author, body], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      throw error;
    }
    res.status(201).json({ message: `Comment added with ID: ${results.insertId}` });
  });
});

module.exports = router;