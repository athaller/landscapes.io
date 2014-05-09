'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
Schema = mongoose.Schema;


var DeploymentSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    name: { type: String, required: true },
    landscapeId: { type: Schema.ObjectId, ref: 'Landscape', index: true },

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

