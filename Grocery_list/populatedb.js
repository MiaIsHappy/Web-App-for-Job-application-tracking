#! /usr/bin/env node

console.log('This script populates some grocery itemsa to your database. ');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require('async')
var Item = require('./models/item')
var Cat = require('./models/cat')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var cats = []
var items = []


function catCreate(name, cb) {
  var cat = new Cat({ name: name });
       
  cat.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Cat: ' + cat);
    cats.push(cat)
    cb(null, cat);
  }   );
}

function itemCreate(title, summary, SKU, cat, cb) {
  itemdetail = { 
    title: title,
    summary: summary,
    SKU: SKU
  }
  if (SKU != false) itemdetail.cat = cat
    
  var item = new Item(itemdetail);    
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}



function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate("Item1", 'this a pepsi drink in sold in bottle, 600ml', '9781473211896', [cats[0],], callback);
        },
        function(callback) {
          itemCreate("Item2", 'this is a good food sold in Mexico', '9788401352836', [cats[0],], callback);
        },
        function(callback) {
          itemCreate("Item3", 'this is a good food sold in Mexico3', '9788401351111', [cats[0],], callback);
        },
        function(callback) {
          itemCreate("Item4", 'this is a good food sold in Mexico5', '9788401351122', [cats[1],], callback);
        },
        function(callback) {
          itemCreate("Item5", 'this is a good food sold in Mexico5', '9788401351155', [cats[1],], callback);
        },
        function(callback) {
          itemCreate("Item6", 'this is a good food sold in Oregon', '9788401351156', [cats[2],], callback);
        },
        function(callback) {
          itemCreate("Item6", 'this is a good food sold in New York', '9788401351101', [cats[2],], callback);
        },
        function(callback) {
          itemCreate("Item7", 'this is a good food sold in Washington', '9788401351201', [cats[2],], callback);
        }
        
        ],
        // optional callback
        cb);
}



async.series([
    createItems
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('No logs');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




