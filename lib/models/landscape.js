'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LandscapeSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    name: { type: String, required: true },
    parentLandscapeId:  { type: Schema.ObjectId, ref: 'Landscape'},

    description: String,
    imageUri: String,
    templateUri: String

});

module.exports = mongoose.model('Landscape', LandscapeSchema);