// Copyright 2014 OpenWhere, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
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

    tags: { type : Array , "default" : [] },

    notes: { type : Array , "default" : [] },

    stackId: String,
    awsErrors: String
});

mongoose.model('Deployment', DeploymentSchema);
