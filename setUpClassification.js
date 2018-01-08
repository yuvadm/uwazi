//babel polyfill ES6
require('babel-core/register')();

var dbConfig = require('./app/api/config/database.js');
var index = process.argv[2] || 'development';

var mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect(dbConfig[index], {useMongoClient: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  require('./app/api/evidences/setUp.js');
});
