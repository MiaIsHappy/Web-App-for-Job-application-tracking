var mongoose = require('mongoose');
const { DateTime } = require("luxon");  //for date handling

var Schema = mongoose.Schema;

var ProducerSchema = new Schema({
  producer_name: { type: String, required: true, maxLength: 100 },
  address: { type: String, required: true, maxLength: 100 }
  //date_of_produce: { type: Date },
  //good_before: { type: Date }
});

// Virtual for manufacturer name.
//ProducerSchema.virtual('producer_name').get(function() {
//  return this.producer_name;
//});

//ProducerSchema.virtual('address').get(function() {
//  return this.address;
//});

// Virtual for this author instance URL.
ProducerSchema.virtual('url').get(function() {
  return '/catalog/producer/' + this._id;
});


// Export model.
module.exports = mongoose.model('Producer', ProducerSchema);

