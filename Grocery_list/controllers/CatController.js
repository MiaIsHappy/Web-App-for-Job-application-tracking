var Cat = require('../models/cat');
var Item = require('../models/item');
var async = require('async');

const { body,validationResult } = require("express-validator");

// Display list of all Genre.
exports.cat_list = function(req, res, next) {

  Cat.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_cats) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('cat_list', { title: 'Cat List', list_cats:  list_cats});
    });

};

// Display detail page for a specific Genre.
exports.cat_detail = function(req, res, next) {

    async.parallel({
        cat: function(callback) {

            Cat.findById(req.params.id)
              .exec(callback);
        },

        cat_items: function(callback) {
          Item.find({ 'cat': req.params.id })
          .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.cat==null) { // No results.
            var err = new Error('Cat not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('cat_detail', { title: 'Cat Detail', cat: results.cat, cat_items: results.cat_items } );
    });

};

// Display Genre create form on GET.
exports.cat_create_get = function(req, res, next) {
    res.render('cat_form', { title: 'Create Cat'});
};

// Handle Genre create on POST.
exports.cat_create_post = [

    // Validate and santise the name field.
    body('name', 'Cat name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var cat = new Cat(
          { name: req.body.name }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('cat_form', { title: 'Create Cat', cat: cat, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Cat.findOne({ 'name': req.body.name })
                .exec( function(err, found_cat) {
                     if (err) { return next(err); }

                     if (found_cat) {
                         // Genre exists, redirect to its detail page.
                         res.redirect(found_cat.url);
                     }
                     else {

                         cat.save(function (err) {
                           if (err) { return next(err); }
                           // Genre saved. Redirect to genre detail page.
                           res.redirect(cat.url);
                         });

                     }

                 });
        }
    }
];

// Display Genre delete form on GET.
exports.cat_delete_get = function(req, res, next) {

    async.parallel({
        cat: function(callback) {
            Cat.findById(req.params.id).exec(callback);
        },
        cat_items: function(callback) {
            Item.find({ 'cat': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.cat==null) { // No results.
            res.redirect('/catalog/cats');
        }
        // Successful, so render.
        res.render('cat_delete', { title: 'Delete Cat', cat: results.cat, cat_items: results.cat_items } );
    });

};

// Handle Genre delete on POST.
exports.cat_delete_post = function(req, res, next) {

    async.parallel({
        cat: function(callback) {
            Cat.findById(req.params.id).exec(callback);
        },
        cat_items: function(callback) {
            Item.find({ 'cat': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.cat_items.length > 0) {
            // Genre has books. Render in same way as for GET route.
            res.render('cat_delete', { title: 'Delete Cat', cat: results.cat, cat_items: results.cat_items } );
            return;
        }
        else {
            // Genre has no books. Delete object and redirect to the list of genres.
            Cat.findByIdAndRemove(req.body.id, function deleteCat(err) {
                if (err) { return next(err); }
                // Success - go to genres list.
                res.redirect('/catalog/cats');
            });

        }
    });

};

// Display Genre update form on GET.
exports.cat_update_get = function(req, res, next) {

    Cat.findById(req.params.id, function(err, cat) {
        if (err) { return next(err); }
        if (cat==null) { // No results.
            var err = new Error('Cat not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('cat_form', { title: 'Update Cat', cat: cat });
    });

};

// Handle Genre update on POST.
exports.cat_update_post = [
   
    // Validate and sanitze the name field.
    body('name', 'Cate name must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),
    

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data (and the old id!)
        var cat = new Cat(
          {
          name: req.body.name,
          _id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('cat_form', { title: 'Update Cat', cat: cat, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Cat.findByIdAndUpdate(req.params.id, cat, {}, function (err,thecat) {
                if (err) { return next(err); }
                   // Successful - redirect to genre detail page.
                   res.redirect(thecat.url);
                });
        }
    }
];
