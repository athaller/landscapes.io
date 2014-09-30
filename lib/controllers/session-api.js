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
var mongoose = require('mongoose');
var passport = require('passport');
var Group = mongoose.model('Group');

exports.logout = function (req, res) {
    req.logout();
    res.status(200).end();
};

exports.login = function (req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        console.log(' ---> login > passport.authenticate');

        var error = err || info;
        if (error) {
            winston.log('error', error);
            return res.json(401, error);

        } else {
            req.logIn(user, function (err) {
                console.log(' ---> login > req.logIn');
                if (err) {
                    winston.log('error', err);
                    return res.send(500, err);
                } else {

                    Group.find({ users: user._id }, function (err, groups) {
                        if (err) {
                            winston.log('error', err);
                            return res.send(500, err);

                        } else if(groups.length) {

                            var userGroups = [];
                            for (var i = 0; i < groups.length; i++ ){
                                userGroups.push(groups[i].name);
                            }
                            req.user.groups = userGroups;
                            console.log(' ---> login > req.user.groups: ' + JSON.stringify(userGroups));

                            console.log(' ---> login > get Permissions for user...');

                            var userPermissions = [];
                            for(var a = 0; a < groups.length; a++) {
                                var landScapeId = '';
                                for(var b = 0; b < groups[a].landscapes.length; b++) {
                                    landScapeId = groups[a].landscapes[b];
                                    var landscapePermissions = [];
                                    for (var c = 0; c < groups[a].permissions.length; c++) {
                                        landscapePermissions.push(groups[a].permissions[c].value);
                                    }
                                    var obj = { };
                                    obj[landScapeId] = landscapePermissions;
                                    userPermissions.push(obj);
                                }
                            }
                            req.user.permissions.push.apply(req.user.permissions, userPermissions);
                            console.log(' ---> login > req.user.permissions = ' + JSON.stringify(req.user.permissions));
                        }
                        res.cookie('user', JSON.stringify(req.user.userInfo));

                        res.json(req.user.userInfo);
                    });
                }
            });
        }
    })(req, res, next);
};