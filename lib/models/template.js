'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TemplateSchema = new Schema({
    name: String,
    description: String,
    templateUrl: String,
    imageUrl: String
});

module.exports = mongoose.model('Template', TemplateSchema);