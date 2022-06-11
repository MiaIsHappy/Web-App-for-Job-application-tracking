var express = require('express');
var router = express.Router();


// Require our controllers.
var book_controller = require('../controllers/ItemController'); 
var author_controller = require('../controllers/ProducerController');
var genre_controller = require('../controllers/CatController');


/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', book_controller.index);  

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/item/create', book_controller.item_create_get);

// POST request for creating Book.
router.post('/item/create', book_controller.item_create_post);

// GET request to delete Book.
router.get('/item/:id/delete', book_controller.item_delete_get);

// POST request to delete Book.
router.post('/item/:id/delete', book_controller.item_delete_post);

// GET request to update Book.
router.get('/item/:id/update', book_controller.item_update_get);

// POST request to update Book.
router.post('/item/:id/update', book_controller.item_update_post);

// GET request for one Book.
router.get('/item/:id', book_controller.item_detail);

// GET request for list of all Book.
router.get('/items', book_controller.item_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/producer/create', author_controller.producer_create_get);

// POST request for creating Author.
router.post('/producer/create', author_controller.producer_create_post);

// GET request to delete Author.
router.get('/producer/:id/delete', author_controller.producer_delete_get);

// POST request to delete Author
router.post('/producer/:id/delete', author_controller.producer_delete_post);

// GET request to update Author.
router.get('/producer/:id/update', author_controller.producer_update_get);

// POST request to update Author.
router.post('/producer/:id/update', author_controller.producer_update_post);

// GET request for one Author.
router.get('/producer/:id', author_controller.producer_detail);

// GET request for list of all Authors.
router.get('/producers', author_controller.producer_list);


/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/cat/create', genre_controller.cat_create_get);

// POST request for creating Genre.
router.post('/cat/create', genre_controller.cat_create_post);

// GET request to delete Genre.
router.get('/cat/:id/delete', genre_controller.cat_delete_get);

// POST request to delete Genre.
router.post('/cat/:id/delete', genre_controller.cat_delete_post);

// GET request to update Genre.
router.get('/cat/:id/update', genre_controller.cat_update_get);

// POST request to update Genre.
router.post('/cat/:id/update', genre_controller.cat_update_post);

// GET request for one Genre.
router.get('/cat/:id', genre_controller.cat_detail);

// GET request for list of all Genre.
router.get('/cats', genre_controller.cat_list);





module.exports = router;
