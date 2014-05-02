'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DeploymentSchema = new Schema({
    name: String,
    description: String,
    location: String,
    billingCode: String
});

mongoose.model('Deployment', DeploymentSchema);

/**
 * Validations
 */
//TemplateSchema.path('awesomeness').validate(function (num) {
//  return num >= 1 && num <= 10;
//}, 'Awesomeness must be between 1 and 10');

