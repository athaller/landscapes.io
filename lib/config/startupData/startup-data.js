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
var winston = require('winston');
var fs = require('fs');
var path = require('path');
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Landscape = mongoose.model('Landscape');
var Deployment = mongoose.model('Deployment');

exports.createStartupData = function() {
    return User.find(function (err, users) {
        if (err) {
            winston.log('error', err);
            return res.send(500, err);
        } else if(!users.length) {

            // no users found...
            User.create({
                provider: 'local',
                name: 'Admin',
                email: 'admin@admin.com',
                password: 'admin',
                roles: ['admin']
            }, function () {
                console.log('User "admin@admin.com" created.');
            });
        }
    });
};