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
var Landscape = mongoose.model('Landscape');
var Deployment = mongoose.model('Deployment');


// GET /api/landscapes
exports.retrieve = function (req, res) {
    winston.info(' ---> retrieveLandscapes');
    return Landscape.find(function (err, landscapes) {
        if (err) {
            return res.send(500, err);
        } else {
            return res.json(landscapes);
        }
    });
};


// GET /api/landscapes/<id>
exports.retrieveOne = function (req, res) {
    var id = req.params.id;
    return Landscape.findOne({_id: id}, function (err, landscape) {
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        } else {
            return res.json(landscape);
        }
    });
};


// POST /api/landscapes
exports.create = function (req, res) {
    winston.info(' ---> createLandscape');

    var user = req.user || {name: 'anonymous'};
    winston.info(user.name);

    var data = req.body;
    winston.info(data);

    var newLandscape = new Landscape(data);
    newLandscape.createdBy = user.name;

    newLandscape.save(function (err) {
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        } else {
            return res.json(newLandscape);
        }
    });
};


// DELETE /api/landscapes/<id>
exports.delete = function (req, res) {
    winston.info(' ---> deleteLandscape');

    var user = req.user || {name: 'anonymous'};
    winston.info(user.name);

    Landscape.findByIdAndRemove(req.params.id, function(err, docs){
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        } else {
            winston.info(' ---> deleted: ' + req.params.id);
            return res.send(200);
        }
    });
};


// PUT /api/landscapes/<id>
exports.update = function (req, res) {
    winston.info(' ---> updateLandscape');

    var user = req.user || {name: 'anonymous'};
    winston.info(user.name);

    var landscape = req.body;
    console.log(landscape);

    var query = {_id: req.params.id };

    Landscape.findOne(query, function (err, doc) {
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        } else {
            doc.name = landscape.name;
            doc.version = landscape.version;
            doc.imageUri = landscape.imageUri;
            doc.cloudFormationTemplate = landscape.cloudFormationTemplate;
            doc.infoLink = landscape.infoLink;
            doc.infoLinkText = landscape.infoLinkText;
            doc.description = landscape.description;
            doc.createdBy = user;

            doc.save(function (err) {
                if (err) {
                    winston.log('error', err);
                    return res.send(500, err);
                } else {
                    return res.json(doc);
                }
            });
        }
    });
};


// GET /api/landscapes/<id>/deployments
exports.retrieveDeployments = function (req, res) {
    var id = req.params.id;
    return Deployment.find({landscapeId: id}, function (err, deployments) {
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        } else {
            return res.json(deployments);
        }
    });
};


// WIP!
exports.retrieveHistory = function (req, res) {
    var id = req.params.id;
    return Deployment.find({landscapeId: id}, function (err, deployments) {
        if (err) {
            winston.log('error', err);
            return res.send(err);
        } else {
            return res.json(deployments);
        }
    });
};
