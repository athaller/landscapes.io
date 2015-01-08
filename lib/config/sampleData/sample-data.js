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
var config = require('../config');
var fs = require('fs');
var mime = require('mime');
var path = require('path');
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Landscape = mongoose.model('Landscape');
var Deployment = mongoose.model('Deployment');
var Role = mongoose.model('Role');
var Group = mongoose.model('Group');
var AppSettings = mongoose.model('AppSettings');
var Account = mongoose.model('Account');
var GlobalTag = mongoose.model('GlobalTag');
var config = require('./../config');


function getImgFromFile(newLandscape, callback) {
    var pathToFile = path.join(config.root + '/uploads/aws.png');
    newLandscape.img.data = fs.readFileSync(pathToFile);
    newLandscape.img.contentType = mime.lookup(pathToFile);
    callback(newLandscape);
}


exports.clearDbAndPopulateWithSampleData = function() {

    var adminUser;

    config.createCryptoKey(function (err) {
        if (err) {
            winston.log('error', err);
        } else {

            Account.find({}).remove(function () {
                winston.info(' -- Account collection cleared!');

                Account.create({
                    name: 'landscapes-svc',
                    region: 'us-east-1',
                    accessKeyId: 'FAKE_ACCESS_KEY_ID_1234',
                    secretAccessKey: '1234567890+abcdefghikjlmnopqrstuvwxyz'
                }, function (err, data) {
                    if (err) winston.info('Account.create --> ' + err);
                    else winston.info(' -- AWS Account "FAKE_ACCESS_KEY_ID_1234" created.');
                });
            });

            AppSettings.find({}).remove(function () {
                winston.info(' -- AppSettings collection cleared!');

                Account.findOne({name: 'landscapes-svc'}, function (err, account) {

                    AppSettings.create({
                        defaultAccount: account
                    }, function () {
                        winston.info(' -- Default AppSettings created.');
                    });
                });
            });

            GlobalTag.find({}).remove(function () {
                winston.info(' -- GlobalTag collection cleared!');

                GlobalTag.create({
                    key: 'Owner',
                    required: true
                }, {
                    key: 'CostCenter',
                    required: false
                }, {
                    key: 'Purpose',
                    defaultValue: 'Development',
                    required: true
                }, function () {
                    winston.info(' -- GlobalTags created.');
                });
            });

            User.find({}).remove(function () {
                winston.info(' -- User collection cleared!');

                User.create({
                    provider: 'local',
                    name: 'Dan Devops',
                    email: 'devops@devops.com',
                    password: 'devops',
                    role: ['Manager']
                }, function () {
                    winston.info(' -- User "devops@devops.com" created.');

                    User.create(config.defaultUser, function () {
                        winston.info(' -- User "' + config.defaultUser.email + '" created.');
                        User.findOne({name: config.defaultUser.name}, function (err, user) {
                            if (!err) {

                                adminUser = user.userInfo;

                                Role.find({}).remove(function () {
                                    winston.info(' -- Role collection cleared!');

                                    Role.create({
                                        name: 'Administrator',
                                        description: 'Administrators have full control of the application.',
                                        permissions: [
                                            config.defaultPermissions.c,
                                            config.defaultPermissions.r,
                                            config.defaultPermissions.u,
                                            config.defaultPermissions.d,
                                            config.defaultPermissions.x,
                                            config.defaultPermissions.f
                                        ],
                                        createdBy: adminUser
                                    }, {
                                        name: 'User',
                                        description: 'Users have "signed up" and may view Landscapes.',
                                        permissions: [
                                            config.defaultPermissions.r
                                        ],
                                        createdBy: adminUser
                                    }, {
                                        name: 'Manager',
                                        description: 'Managers have full "CRUD" access and may deploy Landscapes to AWS.',
                                        permissions: [
                                            config.defaultPermissions.c,
                                            config.defaultPermissions.r,
                                            config.defaultPermissions.u,
                                            config.defaultPermissions.d,
                                            config.defaultPermissions.x
                                        ],
                                        createdBy: adminUser
                                    }, function () {
                                        winston.info(' -- Default Roles created.');
                                    });
                                });

                                var filePath = path.join(__dirname + '/sample-template.json');

                                fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
                                    if (err) winston.info(err);

                                    var template = data;
                                    winston.info(' -- Sample CF template located at ' + filePath);

                                    Landscape.find({}).remove(function () {
                                        winston.info(' -- Landscapes collection cleared!');
                                        Landscape.create({
                                            createdBy: adminUser,
                                            name: 'High Performance Tiling System',
                                            version: '1.0',
                                            description: 'Auto scaling high performance tiling system for AWS.',
                                            imageUri: 'uploads/aws.png',
                                            cloudFormationTemplate: template
                                        }, {
                                            createdBy: adminUser,
                                            name: 'Cloud Service Factory 01',
                                            version: '1.0',
                                            description: "Service factory for AWS big data.",
                                            imageUri: "uploads/aws.png",
                                            cloudFormationTemplate: template
                                        }, {
                                            createdBy: adminUser,
                                            name: 'Cloud Service Factory 02',
                                            version: '1.0',
                                            description: "Service factory for AWS big data.",
                                            imageUri: "uploads/aws.png",
                                            cloudFormationTemplate: template
                                        }, {
                                            createdBy: adminUser,
                                            name: 'Cloud Service Factory 03',
                                            version: '1.0',
                                            description: "Service factory for AWS big data.",
                                            imageUri: "uploads/aws.png",
                                            cloudFormationTemplate: template
                                        }, {
                                            createdBy: adminUser,
                                            name: 'Stacks',
                                            version: '1.0',
                                            description: "Stacks application.",
                                            imageUri: "uploads/aws.png",
                                            cloudFormationTemplate: template
                                        }, function () {

                                            Landscape.find({}, function(err, data) {
                                                for(var i=0; i < data.length; i++) {
                                                    var doc = data[i];
                                                    getImgFromFile(doc, function(doc) {
                                                        doc.save(function (err) {
                                                            if (err) { winston.log('error', err); }
                                                        })
                                                    })
                                                }
                                                winston.info(' -- Sample Landscapes created.');
                                            });
                                        });
                                    });

                                    Deployment.find({}).remove(function () {
                                        winston.info(' -- Deployments collection cleared!');

                                        Group.find({}).remove(function () {
                                            winston.info(' -- Groups collection cleared!');

                                            Landscape.findOne({name: 'Stacks'}, function (err, landscape) {

                                                User.findOne({name: 'Dan Devops'}, function (err, user) {
                                                    if (!err) {
                                                        var devopsUser = user.userInfo;
                                                        Group.create({
                                                            name: 'QA',
                                                            description: 'Group for QA testers',
                                                            users: [devopsUser],
                                                            landscapes: [landscape],
                                                            permissions: [
                                                                { value: 'R', name: 'Read', displayOrder: '20'},
                                                                { value: 'X', name: 'Execute', displayOrder: '80'}
                                                            ]
                                                        }, {
                                                            name: 'HR Project',
                                                            description: 'Group for HR Project infrastructure managers',
                                                            users: [devopsUser],
                                                            landscapes: [landscape],
                                                            permissions: [
                                                                { value: 'X', name: 'Execute', displayOrder: '80'}
                                                            ]
                                                        }, function () {
                                                            winston.info(' -- Sample Groups created.');
                                                        });
                                                    }
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    });
                });

                async.eachSeries([1,2,3,4,5,6,7,8,9], function(i, cb) {
                    var u = {
                        provider: 'local',
                            name: 'User ' + i,
                            email: 'user'+i+'@user.com',
                            password: 'user'+i,
                            role: ['user']
                    }

                    User.create(u, function () {
                        winston.info(' -- User "' + u.email + '" created.');
                        cb();
                    });

                })
            });
        }
    });
}
