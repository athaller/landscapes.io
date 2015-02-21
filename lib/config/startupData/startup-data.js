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
var config = require('../config');
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Role = mongoose.model('Role');
var AppSettings = mongoose.model('AppSettings');

function createDefaultAppSettings(callback) {
    AppSettings.create({}, function (err) {
        if (err) {
            callback(err);
        } else {
            winston.info(' ...AppSettings defaults created;');
            callback();
        }
    });
}

function createDefaultUserAndRoles(callback) {
    User.create(config.defaultUser, function () {
        winston.info(' ...User "' + config.defaultUser.name + '" created;');

        User.findOne({name: config.defaultUser.name}, function (err, newUser) {
            if (err) {
                callback(err);
            } else {
                Role.find({}).remove(function () {
                    async.each(config.defaultRoles, function(role, callback) {
                        role.createdBy = newUser.userInfo;
                        Role.create(role, function () {
                            winston.info(' ...Role "' + role.name + '" created;');
                            callback()
                        });
                    }, function(err) {
                        if (err) callback(err);
                        else callback();
                    });
                });
            }
        });
    });
}


exports.createStartupData = function() {

    return User.find(function (err, users) {
        if (err) {
            winston.log('error', err);
            return res.send(500, err);
        } else if (!users.length) {

            winston.info('No users found! Creating start-up data for ' + process.env.NODE_ENV + ' environment...');

            async.series({
                    cryptoKey: function (callback) {
                        config.createCryptoKey(function (err) {
                            if (err) callback(err);
                            else callback();
                        })
                    },
                    appSettings: function (callback) {
                        createDefaultAppSettings(function (err) {
                            if (err) callback(err);
                            else callback();
                        })
                    },
                    userAndRoles: function (callback) {
                        createDefaultUserAndRoles(function (err) {
                            if (err) callback(err);
                            else callback();
                        })
                    }
                }
                , function (err, data) {
                    if (err) winston.log('error', err);
                    else winston.info(' ...Start-up data creation was successful.')
                });
        }
    })
};
