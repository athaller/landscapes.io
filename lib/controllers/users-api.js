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
var User = mongoose.model('User');


// https://github.com/trentm/node-ldapauth
// Simple node.js module to authenticate against an LDAP server


// GET /api/users
exports.retrieve = function (req, res) {
    winston.info(' ---> retrieving Users');

    var user = req.user.userInfo;
    if(user === undefined) {
        return res.send(401);
    }

    return User.find(function (err, users) {
        if (err) {
            winston.log('error', err);
            return res.send(500, err);
        } else {
            winston.info(' ---> Users retrieved: ' + users.length);

            var userList = [];
            for(var i = 0; i < users.length; i++) {
                userList.push(users[i].userInfo);
            }

            return res.json(userList);
        }
    });
};

// POST /api/users
exports.create = function (req, res, next) {
    winston.info(' ---> creating User');

    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.roles = ['user'];   // TO DO: set "default-role" in config or UI
    newUser.save(function(err, data) {
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        }

        winston.info(' ---> User created');

        User.findById(data._id, function (err, user) {
            if (err) {
                winston.log('error', err);
                return next(err);
            }
            res.json(user.profile);
        });
    });
};

// GET /api/users/<id>
exports.retrieveOne = function (req, res, next) {
    winston.info(' ---> retrieving user');
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

        res.send(user.profile);
    });
};

// PUT /api/users
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


function administratorOnly(req, res, next) {
    winston.warn('---> Administrator only!');
    var u = req.user || undefined;
    if(u === undefined) {
        winston.warn('---> "req.user" is undefined!');
        return res.send(401);
    }

    if(u.role !== 'administrator') {
        var userName = u.name || 'unknown';
        winston.warn('user "' + userName + '" is not authorized!');
        return res.send(401);
    }

    return next();
}

function updateUser(req, res, next) {
    var userId = req.params.id;
    var data = req.body;

    User.findById(userId, function (err, user) {
        if(err) {
            winston.log('error', err);
            return res.send(500, err);
        } else if (!user) {
            return res.send(404);
        } else {
            if(data.name) user.name = data.name;
            if(data.role) user.role = data.role;
            if(data.email) user.email = data.email;

            user.save(function(err) {
                if (err) {
                    winston.log('error', err);
                    return res.send(400);
                }
                else {
                    winston.info('---> User updated: ' + userId);
                    return res.json(user);
                }
            });
        }
    });
}

function deleteUser(req, res, next) {
    User.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        } else {
            winston.info('---> User deleted: ' + req.params.id);
            return res.send(200);
        }
    });
}


// PUT /api/users/<id>
exports.update = function(req, res, next) {
    winston.info('---> updating User');

    administratorOnly(req, res, function() {
        updateUser(req, res, next);
    })

};

// DELETE /api/users/<id>
exports.delete = function (req, res, next) {
    winston.info('---> deleting User');

    administratorOnly(req, res, function(){
        deleteUser(req, res, next);
    });
};

// GET /api/users/me
exports.me = function(req, res) {
    res.json(req.user || null);
};