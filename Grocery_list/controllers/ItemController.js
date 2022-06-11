var Item = require('../models/item');
var Cat = require('../models/cat');
//var BookInstance = require('../models/bookinstance');

const { body,validationResult } = require("express-validator");

var async = require('async');

exports.index = function(req, res) {

    async.parallel({
        item_count: function(callback) {
            Item.countDocuments({},callback);
        },
        cat_count: function(callback) {
            Cat.countDocuments({},callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Home', error: err, data: results });
    });
};


// Display list of all books.
exports.item_list = function(req, res, next) {

  Item.find({}, 'title')
    .sort({title : 1}).exec(function (err, list_items) {
      if (err) {return next(err)} 
      else {
            // Successful, so render
            res.render('item_list', { title: 'Item List', item_list: list_items});
        }
    });

};

// Display detail page for a specific book.
exports.item_detail = function(req, res, next) {

    async.parallel({
        item: function(callback) {

            Item.findById(req.params.id)
              .populate('cat')
              .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.item==null) { // No results.
            var err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('item_detail', { title: results.item.title, item:  results.item } );
    });

};

// Display book create form on GET.
exports.item_create_get = function(req, res, next) {

    // Get all authors and genres, which we can use for adding to our book.
    async.parallel({
        cats: function(callback) {
            Cat.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('item_form', { title: 'Create Item', cats:results.cats });
    });

};

// Handle book create on POST.
exports.item_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.cat instanceof Array)){
            if(typeof req.body.cat==='undefined')
            req.body.cat=[];
            else
            req.body.cat=new Array(req.body.cat);
        }
        next();
    },

    // Validate and sanitize fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('SKU', 'SKU must not be empty').trim().isLength({ min: 1 }).escape(),
    body('cat.*').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var item  = new Item(
          { title: req.body.title,
            summary: req.body.summary,
            SKU: req.body.SKU,
            cat: req.body.cat
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                cats: function(callback) {
                    Cat.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.cats.length; i++) {
                    if (item.cat.indexOf(results.cats[i]._id) > -1) {
                        results.cats[i].checked='true';
                    }
                }
                res.render('item_form', { title: 'Create Item', cats: results.cats, item: item, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            item.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new book record.
                   res.redirect(item.url);
                });
        }
    }
];



// Display book delete form on GET.
exports.item_delete_get = function(req, res, next) {

    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id).populate('cat').exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.item==null) { // No results.
            res.redirect('/catalog/items');
        }
        // Successful, so render.
        res.render('item_delete', { title: 'Delete Item', item: results.item } );
    });

};

// Handle book delete on POST.
exports.item_delete_post = function(req, res, next) {

    // Assume the post has valid id (ie no validation/sanitization).

    async.parallel({
        item: function(callback) {
            Item.findById(req.body.id).populate('cat').exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        else {
            // Book has no BookInstance objects. Delete object and redirect to the list of books.
            Item.findByIdAndRemove(req.body.id, function deleteItem(err) {
                if (err) { return next(err); }
                // Success - got to books list.
                res.redirect('/catalog/items');
            });

        }
        
    });

};

// Display book update form on GET.
exports.item_update_get = function(req, res, next) {


    // Get book, authors and genres for form.
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id).populate('cat').exec(callback);
        },
        cats: function(callback) {
            Cat.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.item==null) { // No results.
                var err = new Error('Item not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            // Mark our selected genres as checked.
            var x = results.cats.length;

            for (var all_g_iter = 0; all_g_iter < x; all_g_iter++) {
                for (var book_g_iter = 0; book_g_iter < results.item.cat.length; book_g_iter++) {
                    if (results.cats[all_g_iter]._id.toString()==results.item.cat[book_g_iter]._id.toString()) {
                        results.cats[all_g_iter].checked='true';
                    }
                }
            }
            res.render('item_form', { title: 'Update Item', cats: results.cats, item: results.item });
        });

};


// Handle book update on POST.
exports.item_update_post = [

    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.cat instanceof Array)){
            if(typeof req.body.cat=='undefined')
            req.body.cat=[];
            else
            req.body.cat=new Array(req.body.cat);
        }
        next();
    },
   
    // Validate and sanitize fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('SKU', 'SKU must not be empty').trim().isLength({ min: 1 }).escape(),
    body('cat.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var item = new Item(
          { title: req.body.title,
            summary: req.body.summary,
            SKU: req.body.SKU,
            cat: (typeof req.body.cat=='undefined') ? [] : req.body.cat,
            _id:req.params.id // This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form
            async.parallel({
                cats: function(callback) {
                    Cat.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.cats.length; i++) {
                    if (item.cat.indexOf(results.cats[i]._id) > -1) {
                        results.cats[i].checked='true';
                    }
                }
                res.render('item_form', { title: 'Update Item', cats: results.cats, item: item, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Item.findByIdAndUpdate(req.params.id, item, {}, function (err,theitem) {
                if (err) { return next(err); }
                   // Successful - redirect to book detail page.
                   res.redirect(theitem.url);
                });
        }
    }
];

