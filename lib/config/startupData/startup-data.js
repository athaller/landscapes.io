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
var config = require('config');
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Role = mongoose.model('Role');
var AppSettings = mongoose.model('AppSettings');

exports.createStartupData = function() {

    return User.find(function (err, users) {
        if (err) {
            winston.log('error', err);
            return res.send(500, err);
        } else if(!users.length) {

            // no users found...

            config.setCryptoKey(function(err) {
                if(err) {
                    winston.log('error', err);
                } else {
                    AppSettings.create({}, function () {
                        console.log(' -- Default AppSettings created.');
                    });

                    User.create({
                        provider: 'local',
                        name: 'Admin',
                        email: 'admin@admin.com',
                        password: 'admin',
                        role: ['administrator']
                    }, function () {
                        console.log('User "admin@admin.com" created.');

                        User.findOne({name: 'Admin'}, function (err, user) {
                            if (!err) {

                                var adminUser = user.userInfo;

                                Role.find({}).remove(function () {
                                    Role.create({
                                        name: 'administrator',
                                        description: 'Administrators have full control of the application.',
                                        permissions: [
                                            { value: 'C', name:'Create',        displayOrder: '10'},
                                            { value: 'R', name:'Read',          displayOrder: '20'},
                                            { value: 'U', name:'Update',        displayOrder: '30'},
                                            { value: 'D', name:'Delete',        displayOrder: '40'},
                                            { value: 'X', name:'Execute',       displayOrder: '80'},
                                            { value: 'F', name:'Full Control',  displayOrder: '90'}
                                        ],
                                        createdBy: testUser
                                    }, {
                                        name: 'user',
                                        description: 'Users have "signed up" and may view Landscapes.',
                                        permissions: [ { value: 'R', name:'Read', displayOrder: '20'} ],
                                        createdBy: testUser
                                    }, {
                                        name: 'manager',
                                        description: 'Managers have full "CRUD" access and may deploy Landscapes to AWS.',
                                        permissions: [
                                            { value: 'C', name:'Create',        displayOrder: '10'},
                                            { value: 'R', name:'Read',      displayOrder: '20'},
                                            { value: 'U', name:'Update',        displayOrder: '30'},
                                            { value: 'D', name:'Delete',        displayOrder: '40'},
                                            { value: 'X', name:'Execute',       displayOrder: '80'}
                                        ],
                                        createdBy: testUser
                                    }, function () {
                                        console.log('default Roles created.');
                                    });
                                });
                            }
                        });
                    });
                }
            });
        };
    });
};