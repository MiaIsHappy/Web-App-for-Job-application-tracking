var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreSchema = new Schema(
    {
        genre: {type: String, required: true, maxLength: 100}, //reference to the associated book
      }
    );

    // Virtual for book's URL
GenreSchema
.virtual('url')
.get(function () {
  return '/catalog/book/' + this._id;
});

//Export model
module.exports = mongoose.model('Genre', GenreSchema);