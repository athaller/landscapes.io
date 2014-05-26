'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
Schema = mongoose.Schema;


var DeploymentSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    stackName: { type: String, required: true },
    landscapeId: { type: Schema.ObjectId, ref: 'Landscape', index: true },

    description: String,
    location: String,
    billingCode: String,
    flavor: String,

    cloudFormationTemplate: String,
    cloudFormationParameters: { type : Array , "default" : [] },

    notes: { type : Array , "default" : [] },

    stackId: String,
    awsErrors: String
});

mongoose.model('Deployment', DeploymentSchema);