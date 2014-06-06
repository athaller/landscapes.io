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

var fs = require('fs');
var path = require('path');
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Landscape = mongoose.model('Landscape');
var Deployment = mongoose.model('Deployment');

exports.clearDbAndPopulateWithSampleData = function() {

    var testUser;

    User.find({}).remove(function () {

        User.create({
            provider: 'local',
            name: 'DevOps User',
            email: 'devops@devops.com',
            password: 'devops',
            roles: ['devops','operations','marketing-website']
        }, function () {
            console.log('User "devops@devops.com" created.');
        });

        User.create({
                provider: 'local',
                name: 'Admin User',
                email: 'admin@admin.com',
                password: 'admin',
                roles: ['admin']
            }, function () {
                console.log('User "admin@admin.com" created.');
                User.findOne({name: 'Admin User'}, function (err, user) {
                    if(!err) {
                        testUser = user.userInfo;
                        console.log(testUser);

                        var filePath = path.join(__dirname + '/sample-template.json');

                        fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
                            if(err) { console.log(err); }

                            var template = data;
                            console.log('sample-template: ' + filePath);

                            Landscape.find({}).remove(function () {
                                Landscape.create({
                                    createdBy: testUser,
                                    name: 'High Performance Tiling System',
                                    version: '1.0',
                                    description: 'Auto scaling high performance tiling system for AWS.',
                                    imageUri: 'images/AWS-Icon.png',
                                    cloudFormationTemplate: template
                                }, {
                                    createdBy: testUser,
                                    name: 'Cloud Service Factory 01',
                                    version: '1.0',
                                    description: "Service factory for AWS big data.",
                                    imageUri: "images/AWS-CF-Icon.png",
                                    cloudFormationTemplate: template
                                }, {
                                    createdBy: testUser,
                                    name: 'Cloud Service Factory 02',
                                    version: '1.0',
                                    description: "Service factory for AWS big data.",
                                    imageUri: "images/AWS-VPC-Icon.png",
                                    cloudFormationTemplate: template
                                }, {
                                    createdBy: testUser,
                                    name: 'Cloud Service Factory 03',
                                    version: '1.0',
                                    description: "Service factory for AWS big data.",
                                    imageUri: "images/AWS-EC2-Icon.png",
                                    cloudFormationTemplate: template
                                }, {
                                    createdBy: testUser,
                                    name: 'Stacks',
                                    version: '1.0',
                                    description: "Stacks application.",
                                    imageUri: "images/AWS-CF-Stack-Icon.png",
                                    cloudFormationTemplate: template
                                }, function () {
                                    console.log('Sample landscapes created');
                                });
                            });

                            Deployment.find({}).remove(function () {
                                console.log('Deployments MongoDB collection cleared');
                            });
                        });
                    }
                });
            }
        );
    });


}