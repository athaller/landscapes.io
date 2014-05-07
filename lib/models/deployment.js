'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
Schema = mongoose.Schema;


var DeploymentSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    createdBy: String,

    landscape: { type: Schema.ObjectId, ref: 'Landscape', index: true },

    name: String,
    description: String,
    location: String,
    billingCode: String,

    cloudFormationTemplate: String,
    cloudFormationParameters: [{
        key:String,
        value: String
    }]
});

mongoose.model('Deployment', DeploymentSchema);

