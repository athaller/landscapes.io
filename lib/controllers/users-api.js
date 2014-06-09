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
var User = mongoose.model('User');


// GET /api/users
exports.retrieve = function (req, res) {
    winston.info(' ---> retrieving users');

    var user = req.user.userInfo;
    if(user === undefined) {
        return res.send(401);
    }

    return User.find(function (err, users) {
        if (err) {
            winston.log('error', err);
            return res.send(500, err);
        } else {
            winston.info(' ---> users retrieved: ' + users.length);
            return res.json(users);
        }
    });
};

// POST /api/users
exports.create = function (req, res, next) {
    winston.info(' ---> creating user');

    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.roles = ['user'];
    newUser.save(function(err) {
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        }

        req.logIn(newUser, function(err) {
            if (err) {
                winston.log('error', err);
                return next(err);
            } else {
                return res.json(req.user.userInfo);
            }
        });
    });
};

// GET /api/users/<id>
exports.retrieveOne = function (req, res, next) {
    var userId = req.params.id;

    var user = req.user.userInfo;
    if(user === undefined) {
        return res.send(401);
    }

    User.findById(userId, function (err, user) {
        if (err) {
            winston.log('error', err);
            return next(err);
        }
        if (!user) {
            return res.send(404);
        }

        res.send({ profile: user.profile });
    });
};


exports.changePassword = function(req, res, next) {

    var user = req.user.userInfo;
    if(user === undefined) {
        return res.send(401);
    }

    winston.info(' ---> changing password');
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    User.findById(userId, function (err, user) {
        if(user.authenticate(oldPass)) {
            user.password = newPass;
            user.save(function(err) {
                if(err) {
                    winston.log('error', err);
                    return res.send(400);
                }
                else {
                    winston.info(' ---> password changed');
                    res.send(200);
                }
            });
        } else {
            res.send(403);
        }
    });
};


exports.update = function(req, res, next) {
    winston.info(' ---> updating User');

    var user = req.user.userInfo;
    if(user === undefined) {
        return res.send(401);
    }

    var userId = req.params.id;
    var data = req.body;

    User.findById(userId, function (err, user) {
        if(err) {
            winston.log('error', err);
            return res.send(500, err);
        } else if (!user) {
            return res.send(404);
        } else {
            user.name = data.name;
            user.role = data.role;
            user.email = data.email;

            user.save(function(err) {
                if (err) {
                    winston.log('error', err);
                    return res.send(400);
                }
                else {
                    winston.info(' ---> updated: ' + userId);
                    return res.json(user);
                }
            });
        }
    });
};


exports.me = function(req, res) {
    res.json(req.user || null);
};