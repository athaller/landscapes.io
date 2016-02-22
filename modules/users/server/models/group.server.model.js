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

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
Schema = mongoose.Schema;

var schemaOptions = { toObject: { virtuals: true } ,toJSON: { virtuals: true } };

var GroupSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.ObjectId, ref: 'User'},

    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true  },
    permissions: { type : Array , "default" : [] },
    landscapes: [Schema.Types.ObjectId]
}, schemaOptions);

GroupSchema
    .virtual('users')
    .set(function(users) {
        this._users = users;
    })
    .get(function() {
        if(this._users === undefined) {
            return [];
        } else {
            return this._users;
        }
    });

mongoose.model('Group', GroupSchema);
