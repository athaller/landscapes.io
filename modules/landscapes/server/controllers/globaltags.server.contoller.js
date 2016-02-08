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
    GlobalTag = mongoose.model('GlobalTag');


// GET /api/globalTags
exports.retrieve = function (req, res) {
    winston.info('---> retrieving GlobalTags');

    return GlobalTag.find(function (err, data) {
        if (err) {
            winston.log('error', err);
            return res.send(500, err);
        } else {
            winston.info('---> GlobalTags retrieved: ' + data.length);
            return res.json(data);
        }
    });
};


// POST /api/globalTags
exports.create = function (req, res) {
    winston.info('---> creating GlobalTag');

    var u = req.user || undefined;
    if(u === undefined) {
        return res.send(401);
    }

    console.log(req.body);

    var newGlobalTag = new GlobalTag(req.body);
    newGlobalTag.createdBy = u._id;
    newGlobalTag.createdAt = new Date();

    newGlobalTag.save(function(err, data) {
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        } else {
            console.log(JSON.stringify(data));
            return res.json(data);
        }
    });
};


function validateObjectId(id, res, next) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        var msg = 'ObjectId is not valid: ' + id;
        winston.warn('---> ' + msg);
        return res.json(400, msg);
    }
    return next();
}


// GET /api/globalTags/<id>
exports.retrieveOne = function (req, res, next) {
    winston.info('---> retrieving GlobalTag');
    var id = req.params.id;

    validateObjectId(id, res, function() {
        GlobalTag.findById(id, function (err, data) {
            if (err) {
                winston.log('error', err);
                return next(err);
            } else if (!data) {
                winston.info('---> GlobalTag not found:', id);
                return res.send(404);
            } else {
                res.json(data);
            }
        });
    });
};


// PUT /api/globalTags/<id>
exports.update = function(req, res, next) {
    winston.info('---> updating GlobalTag');

    var u = req.user || undefined;
    if(u === undefined) return res.send(401);

    var id = req.params.id;

    validateObjectId(id, res, function() {
        var data = req.body;

        GlobalTag.findById(id, function (err, globalTag) {
            if (err) {
                winston.log('error', err);
                return res.send(500, err);
            } else if (!globalTag) {
                winston.info('---> GlobalTag not found:', id);
                return res.send(404);
            } else {
                globalTag.createdBy = u._id;
                globalTag.createdAt = new Date();
                globalTag.key = data.key;
                globalTag.isRequired = data.isRequired;

                if (globalTag.defaultValue)
                    globalTag.defaultValue = data.defaultValue;

                globalTag.save(function (err, data) {
                    if (err) {
                        winston.log('error', err);
                        return res.send(400);
                    }
                    else {
                        winston.info('---> GlobalTag updated: ' + id);
                        return res.json(data);
                    }
                });
            }
        });
    });
};


// DELETE /api/globalTags/<id>
exports.delete = function (req, res, next) {
    winston.info('---> deleting GlobalTag');
    var id = req.params.id;

    validateObjectId(id, res, function() {
        GlobalTag.findByIdAndRemove(id, function(err, data) {
            if (err) {
                winston.log('error', err);
                return res.json(400, err);
            } else if (!data) {
                winston.info('---> GlobalTag not found:', id);
                return res.send(404);
            } else {
                winston.info('---> GlobalTag deleted: ' + id);
                return res.send(200);
            }
        });
    });
};
