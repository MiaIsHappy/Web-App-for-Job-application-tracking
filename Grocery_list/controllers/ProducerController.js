var Producer = require('../models/producer')
var async = require('async')
var Item = require('../models/item')

const { body,validationResult } = require("express-validator");

// Display list of all Authors.
exports.producer_list = function (req, res, next) {

    Producer.find()
        .sort([['producer_name', 'ascending']])
        .exec(function (err, list_producers) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('producer_list', { title: 'Producer List', producer_list: list_producers });
        })

};

// Display detail page for a specific producer
exports.producer_detail = function (req, res, next) {

    async.parallel({
        producer: function (callback) {
            Producer.findById(req.params.id)
                .exec(callback)
        },
        producers_items: function (callback) {
            Item.find({ 'producer': req.params.id }, 'title summary')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.producer == null) { // No results.
            var err = new Error('Producer not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('producer_detail', { title: 'Producer Detail', producer: results.producer, producer_items: results.producers_items });
    });

};

// Display Author create form on GET.
exports.producer_create_get = function (req, res, next) {
    res.render('producer_form', { title: 'Create Producer' });
};

// Handle Author create on POST.
exports.producer_create_post = [

    // Validate and sanitize fields.
    body('producer_name').trim().isLength({ min: 1 }).escape().withMessage('producer name must be specified.')
        .isAlphanumeric().withMessage('producer name has non-alphanumeric characters.'),
    body('address').trim().isLength({ min: 1 }).escape().withMessage('address must be specified.')
        .isAlphanumeric().withMessage('address has non-alphanumeric characters.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        // Create Author object with escaped and trimmed data
        var producer = new Producer(
            {
                producer_name: req.body.producer_name,
                address: req.body.address,
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('producer_form', { title: 'Create Producer', producer: producer, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save author.
            producer.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(producer.url);
            });
        }
    }
];



// Display Author delete form on GET.
exports.producer_delete_get = function (req, res, next) {

    async.parallel({
        producer: function (callback) {
            Producer.findById(req.params.id).exec(callback)
        },
        producers_items: function (callback) {
            Item.find({ 'producer': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.producer == null) { // No results.
            res.redirect('/catalog/producers');
        }
        // Successful, so render.
        res.render('producer_delete', { title: 'Delete Producer', producer: results.producer, producer_items: results.producers_items });
    });

};

// Handle Author delete on POST.
exports.producer_delete_post = function (req, res, next) {

    async.parallel({
        producer: function (callback) {
            Producer.findById(req.body.authorid).exec(callback)
        },
        producers_items: function (callback) {
            Item.find({ 'producer': req.body.authorid }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success.
        if (results.producers_items.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render('producer_delete', { title: 'Delete Producer', producer: results.producer, producer_items: results.producers_items });
            return;
        }
        else {
            // Author has no books. Delete object and redirect to the list of authors.
            Producer.findByIdAndRemove(req.body.authorid, function deleteProducer(err) {
                if (err) { return next(err); }
                // Success - go to author list.
                res.redirect('/catalog/producers')
            })

        }
    });

};

// Display Author update form on GET.
exports.producer_update_get = function (req, res, next) {

    Producer.findById(req.params.id, function (err, author) {
        if (err) { return next(err); }
        if (producer == null) { // No results.
            var err = new Error('Producer not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('producer_form', { title: 'Update Producer', produce: producer });

    });
};

// Handle Author update on POST.
exports.producer_update_post = [

    // Validate and santize fields.
    body('producer_name').trim().isLength({ min: 1 }).escape().withMessage('producer name must be specified.')
    .isAlphanumeric().withMessage('producer name has non-alphanumeric characters.'),
    body('address').trim().isLength({ min: 1 }).escape().withMessage('address must be specified.')
    .isAlphanumeric().withMessage('address has non-alphanumeric characters.'),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Author object with escaped and trimmed data (and the old id!)
        var producer = new Producer(
            {
                producer_name: req.body.producer_name,
                address: req.body.address,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('producer_form', { title: 'Update Producer', producer: producer, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Producer.findByIdAndUpdate(req.params.id, producer, {}, function (err, theproducer) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect(theproducer.url);
            });
        }
    }
];
