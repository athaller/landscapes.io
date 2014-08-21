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
var Role = mongoose.model('Role');
var User = mongoose.model('User');


// GET /api/roles
exports.retrieve = function (req, res) {
    winston.info(' ---> retrieving Roles');

    var user = req.user || undefined;
    if(user === undefined) {
        return res.send(401);
    }

    return Role.find(function (err, roles) {
        if (err) {
            winston.log('error', err);
            return res.send(500, err);
        } else {
            winston.info(' ---> roles retrieved: ' + roles.length);
            return res.json(roles);
        }
    });
};


// GET /api/roles/<id>
exports.retrieveOne = function (req, res, next) {
    var roleId = req.params.id;

    var user = req.user || undefined;
    if(user === undefined) {
        return res.send(401);
    }

    Role.findById(roleId, function (err, role) {
        if (err) {
            winston.log('error', err);
            return next(err);
        }
        if (!role) {
            return res.send(404);
        }

        res.json(role);
    });
};


// GET /api/roles/<id>/users
exports.retrieveUsers = function (req, res, next) {
    winston.info(' ---> retrieving users for role');
    var roleId = req.params.id;

    var user = req.user || undefined;
    if(user === undefined) {
        return res.send(401);
    }

    Role.findById(roleId, function (err, role) {
        if (err) {
            winston.log('error', err);
            return next(err);
        }
        if (!role) {
            return res.send(404);
        }

        User.find({role: role.name}, function (err, users) {
            if (err) {
                winston.log('error', err);
                return res.send(500, err);
            } else {
                winston.info(' ---> users retrieved for role "' + role.name + '": ' + users.length);

                var userList = [];
                for(var i = 0; i < users.length; i++) {
                    userList.push(users[i].userInfo);
                }

                return res.json(userList);
            }
        });
    });
};


// POST /api/roles
exports.create = function (req, res, next) {
    winston.info(' ---> creating Role');

    var user = req.user || undefined;
    if(user === undefined) {
        return res.send(401);
    }

    var data = req.body;
    console.log(data);

    var newRole = new Role(req.body);
    newRole.createdBy = user._id;
    newRole.save(function(err) {
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        } else {
            console.log(JSON.stringify(newRole));
            return res.json(newRole);
        }
    });
};


// PUT /api/roles/<id>
exports.update = function(req, res, next) {
    winston.info(' ---> updating Role');

    var user = req.user || undefined;
    if(user === undefined) {
        return res.send(401);
    }

    var roleId = req.params.id;
    var data = req.body;

    Role.findById(roleId, function (err, role) {
        if(err) {
            winston.log('error', err);
            return res.send(500, err);
        } else if (!role) {
            return res.send(404);
        } else {
            role.name = data.name;
            role.description = data.description;
            role.permissions = data.permissions;
            role.createdBy = user._id;

            role.save(function(err) {
                if (err) {
                    winston.log('error', err);
                    return res.send(400);
                }
                else {
                    winston.info(' ---> Role updated: ' + roleId);
                    return res.json(role);
                }
            });
        }
    });
};

// DELETE /api/roles/<id>
exports.delete = function (req, res, next) {
    winston.info(' ---> deleting Role');

    var user = req.user || undefined;
    if(user === undefined) {
        return res.send(401);
    }

    Role.findByIdAndRemove(req.params.id, function(err, docs){
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        } else {
            winston.info(' ---> Role deleted: ' + req.params.id);
            return res.send(200);
        }
    });
};


exports.me = function(req, res) {
    res.json(req.user || null);
};
