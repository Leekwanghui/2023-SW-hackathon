const express = require('express');
const router = express.Router();
const pool = require('./connection');

router.get('/', (req, res) => {
  pool.query('SELECT * FROM my_news ORDER BY id DESC', (error, results) => {
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
    return res.status(400).json({ error: 'Invalid MyNews ID' });
  }

  pool.query('SELECT * FROM my_news WHERE id = ?', [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      throw error;
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'MyNews not found' });
    }
    res.status(200).json(results);
  });
});

router.post('/new', (req, res) => {
	const { title, author, body } = req.body;
  
	if (!title || !author || !body ) {
	  return res.status(400).json({ error: 'title, author, body values should be provided' });
	}

	const created_at = new Date().toISOString();

	pool.query('INSERT INTO my_news (title, author, body, created_at) VALUES (?, ?, ?, ?)', [title, author, body, created_at], (error, results) => {
	  if (error) {
		res.status(500).json({ error: 'Internal Server Error' });
		throw error;
	  }
	  res.status(201).json({ message: `MyNews added with ID: ${results.insertId}` });
	});
  });

router.put('/like/:id', (req, res) => {
	const id = parseInt(req.params.id);
	if (isNaN(id)) {
	  return res.status(400).json({ error: 'Invalid MyNews ID' });
	}
  
	pool.query('UPDATE my_news SET like_cnt = like_cnt + 1 WHERE id = ?', [id], (error, results) => {
	  if (error) {
		res.status(500).json({ error: 'Internal Server Error' });
		throw error;
	  }
	  if (results.affectedRows === 0) {
		return res.status(404).json({ error: 'MyNews not found' });
	  }
	  res.status(200).json({ message: `MyNews with ID: ${id} liked` });
	});
  });  
  
module.exports = router;
