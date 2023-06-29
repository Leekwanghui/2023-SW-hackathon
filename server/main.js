const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./connection');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`running port : ${PORT}.`);
});