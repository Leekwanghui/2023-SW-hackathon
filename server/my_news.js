const express = require('express');
const router = express.Router();
const pool = require('./connection');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const fs = require('fs');

const s3 = new aws.S3({
	accessKeyId: process.env.accessKeyId,
	secretAccessKey: process.env.secretAccessKey,
	region: process.env.region
  });
  
  const upload = multer({
	storage: multerS3({
	  s3: s3,
	  bucket: process.env.bucketName,
	  acl: 'public-read',
	  metadata: function (req, file, cb) {
		cb(null, {fieldName: file.fieldname});
	  },
	  key: function (req, file, cb) {
		cb(null, Date.now().toString())
	  }
	})
  });

/**
 * @swagger
 * /mynews:
 *   get:
 *     summary: Get a list of MyNews
 *     responses:
 *       200: 
 *         description: MyNews list (OK)
 */
router.get('/', (req, res) => {
  pool.query('SELECT * FROM my_news ORDER BY id DESC', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      throw error;
    }
    res.status(200).json(results);
  });
});

/**
 * @swagger
 * /mynews/{id}:
 *   get:
 *     summary: Get a single MyNews with {id}
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Mynews to retrieve.
 *     responses:
 *       200:
 *         description: A single Mynews (OK).
 *       400:
 *         description: Invalid ID.
 *       404:
 *         description: MyNews not found.
 */
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

/**
 * @swagger
 * /mynews/new:
 *   post:
 *     summary: Create a new MyNews and upload an image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               body:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: MyNews created and image uploaded (OK).
 *       400:
 *         description: Invalid input, object invalid.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/new', upload.single('image'), (req, res) => {
	const { title, author, body, image } = req.body;
  
	if (!title || !author || !body) {
	  return res.status(400).json({ error: 'title, author, body should be provided' });
	}
  
	const created_at = new Date().toISOString();
  
	// Decoding base64 image
	const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
	const newImagePath = `./uploads/${title}-${Date.now()}.jpg`;
	fs.writeFile(newImagePath, base64Data, 'binary', (err) => { //export image
	  if (err) {
		return res.status(500).json({ error: 'Error while saving image' });
	  }
	  const fileContent = fs.readFileSync(newImagePath);
  
	  const params = {
		Bucket: process.env.bucketName,
		Key: `news_images/${title}-${Date.now()}.jpg`,
		Body: fileContent
	  };
  
	  // Uploading files to the bucket
	  s3.upload(params, function(err, data) {
		if (err) {
		  throw err;
		}
		fs.unlinkSync(newImagePath);
  
		pool.query('INSERT INTO my_news (title, author, body, image_url, created_at) VALUES (?, ?, ?, ?, ?)', [title, author, body, data.Location, created_at], (error, results) => {
		  if (error) {
			res.status(500).json({ error: 'Internal Server Error' });
			throw error;
		  }
		  res.status(201).json({ message: `MyNews added with ID: ${results.insertId}, Image URL: ${data.Location}` });
		});
	  });
	});
  });
  

  /**
 * @swagger
 * /mynews/like/{id}:
 *   put:
 *     summary: Increment the like count of a MyNews with {id}
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the MyNews to like.
 *     responses:
 *       200:
 *         description: MyNews liked (OK).
 *       400:
 *         description: Invalid ID.
 *       404:
 *         description: MyNews not found.
 *       500:
 *         description: Internal Server Error.
 */
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
