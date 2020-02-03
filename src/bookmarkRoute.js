const express = require('express');
// Use express.router class to create modular route handlers
// Similar to a mini app
const bookmarkRouter = express.Router();
const logger = require('./logger');
const BookmarkService = require('./bookmark-service');

bookmarkRouter
  .route('/')
  .get((req, res) => {
    BookmarkService
      .getBookmarks(req.app.get('db'))
      .then(bookmarks => res.json(bookmarks));
  })
  .post((req, res, next) => {
    const { title, url, description = '', rating } = req.body; 
  
    if( !title || !url || !rating ) {
      logger.error('Title, Url and Rating are required');
      return res
      .status(400)
      .json({error: {message: 'Title, Url and Rating are required'}});
    }
  
    const newBookmark = {
      title,
      url,
      description,
      rating
    };
    
    BookmarkService
      .addBookmark(res.app.get('db'), newBookmark)
      .then(newlyAdded => 
        res
        .status(201)
        .location(`/bookmarks/${newlyAdded.id}`)
        .json(newlyAdded))
      .catch(next);
  });

bookmarkRouter
  .route('/:id')
  .get((req, res) => {
    const { id } = req.params; //this is the user id 
    BookmarkService
      .getByID(req.app.get('db'), id)
      .then(foundItem => res.json(foundItem));
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    BookmarkService
      .removeBookmark(req.app.get('db'), id)
      .then(() => res.status(204).end())
      .catch(next);

  
    logger.info(`List with id ${id} deleted.`);
  })
  .patch((req,res,next) => {
    const {title, url, description, rating} = req.body;
    const updatedBookmark = {title, url, description, rating};

    const numberOfValues = Object.values(updatedBookmark).filter(Boolean).length;
    if(numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain title, url, description, or rating`
        }
      });
    }

    BookmarkService
      .updateBookmark(
        req.app.get('db'), 
        req.params.id,
        updatedBookmark)
      .then(() => res.status(204).end());
  });

  module.exports = bookmarkRouter;