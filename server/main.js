const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./connection');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const newsRouter = require('./news');
const myNewsRouter = require('./my_news');
const commentRouter = require('./comment');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/news', newsRouter);
app.use('/mynews', myNewsRouter);
app.use('/comment', commentRouter);

const swaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
		title: 'LittleBit Backend Api',
		description: 'SWUniv News Service API Server',
		servers:['http://localhost:8080']
		}
	},
	apis: ['./news.js', './my_news.js', './comment.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger/apis', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`running port : ${PORT}.`);
});