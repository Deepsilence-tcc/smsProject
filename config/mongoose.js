var mongoose = require('mongoose');
var config = require('./config.js');

module.exports = function() {
    var db = mongoose.connect(config.mongodb);
    require('../model/user.model');
    require('../model/version.model');
    require('../model/key.model');
    return db;
};