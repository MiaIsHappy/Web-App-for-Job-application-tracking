var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CatSchema = new Schema({
    name: {type: String, required: true, minLength: 3, maxLength: 100}
});

// Virtual for this genre instance URL.
CatSchema
.virtual('url')
.get(function () {
  return '/catalog/cat/'+this._id;
});

// Export model.
module.exports = mongoose.model('Cat', CatSchema);
