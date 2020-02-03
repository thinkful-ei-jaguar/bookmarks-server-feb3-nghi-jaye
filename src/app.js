//Configure create variables written in .env file to the environment
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, DB_URL } = require('./config');
const bookmarkRouter = require('./bookmarkRoute');
const validateToken = require('./validateToken');
const errorHandling = require('./errorHandling');


const app = express();


const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

// Mounting our middleware, always put helmet before cors!
app.use(morgan(morganOption)); 
app.use(helmet());
app.use(cors());
app.use(express.json());
//app.use(validateToken);


// Routes
app.use('/api/bookmarks', bookmarkRouter);





// Error handling
app.use(errorHandling);

module.exports = app;