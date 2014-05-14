'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LandscapeSchema = new Schema({
    parentLandscapeId:  { type: Schema.ObjectId, ref: 'Landscape'},

    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },

    name: { type: String, required: true },
    version: { type: String, required: true },
    imageUri: { type: String, required: true },
    cloudFormationTemplate: { type: String, required: true },

//   http://docs.aws.amazon.com/cli/latest/reference/cloudformation/validate-template.html

    description: String
});

module.exports = mongoose.model('Landscape', LandscapeSchema);