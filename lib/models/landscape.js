'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LandscapeSchema = new Schema({
    name: String,
    description: String,
    templateUrl: String,
    imageUrl: String
});

module.exports = mongoose.model('Landscape', LandscapeSchema);