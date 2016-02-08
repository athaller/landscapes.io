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

var LandscapeSchema = new Schema({
    parentLandscapeId:  { type: Schema.ObjectId, ref: 'Landscape'},

    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.ObjectId, ref: 'User'},

    name: { type: String, required: true },
    version: { type: String, required: true },
    imageUri: { type: String, required: true },
    img: { data: Buffer, contentType: String },
    cloudFormationTemplate: { type: String, required: true },

    infoLink: String,
    infoLinkText: String,
    description: String
});
mongoose.model('Landscape', LandscapeSchema);
