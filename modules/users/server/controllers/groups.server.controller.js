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
var winston = require('winston'),
    mongoose = require('mongoose'),
    Group = mongoose.model('Group');


// GET /api/groups
exports.retrieve = function (req, res) {
    winston.info(' ---> retrieving Groups');

    return Group.find(function (err, data) {
        if (err) {
            winston.log('error', err);
            return res.send(500, err);
        } else {
            winston.info(' ---> Groups retrieved: ' + data.length);
            return res.json(data);
        }
    });
};


// GET /api/groups/<id>
exports.retrieveOne = function (req, res, next) {
    var groupId = req.params.id;


    Group.findById(groupId, function (err, group) {
        if (err) {
            winston.log('error', err);
            return next(err);
        } else if (!group) {
            return res.send(404);
        } else {
            res.json(group);
        }
    });
};


// POST /api/groups
exports.create = function (req, res, next) {
    winston.info(' ---> creating Group');

    var data = req.body;
    var newGroup = new Group(data);
    newGroup.createdBy = req.user._id;
    newGroup.save(function(err) {
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        } else {
            console.log(JSON.stringify(newGroup));
            return res.json(newGroup);
        }
    });
};


// PUT /api/groups/<id>
exports.update = function(req, res, next) {
    winston.info(' ---> updating Group');



    var groupId = req.params.id;
    var data = req.body;

    Group.findById(groupId, function (err, group) {
        if(err) {
            winston.log('error', err);
            return res.send(500, err);
        } else if (!group) {
            return res.send(404);
        } else {
            group.createdBy = req.user._id;
            group.name = data.name;
            group.description = data.description;
            group.users = data.users;
            group.permissions = data.permissions;
            group.landscapes = data.landscapes;

            group.save(function(err) {
                if (err) {
                    winston.log('error', err);
                    return res.send(400);
                }
                else {
                    winston.info(' ---> Group updated: ' + groupId);
                    return res.json(group);
                }
            });
        }
    });
};

// DELETE /api/groups/<id>
exports.delete = function (req, res, next) {
    winston.info(' ---> deleting Group');


    Group.findByIdAndRemove(req.params.id, function(err, docs){
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        } else {
            winston.info(' ---> Group deleted: ' + req.params.id);
            return res.send(200);
        }
    });
};