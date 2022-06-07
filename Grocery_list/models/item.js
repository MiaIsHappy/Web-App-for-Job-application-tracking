var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    title: {type: String, required: true},
    summary: {type: String, required: true},
    SKU: {type: String, required: true},
    cat: [{ type: Schema.ObjectId, ref: 'Cat' }]
});

// Virtual for this book instance URL.
ItemSchema
.virtual('url')
.get(function () {
  return '/catalog/item/'+this._id;
});

// Export model.
module.exports = mongoose.model('Item', ItemSchema);
