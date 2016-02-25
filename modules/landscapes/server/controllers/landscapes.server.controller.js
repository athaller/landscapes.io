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
/**
 * Module dependencies
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Landscape = mongoose.model('Landscape'),
    Deployment = mongoose.model('Deployment'),
    fs = require('fs'),
    mime = require('mime'),
    winston = require('winston'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));




// GET /api/landscapes
exports.list = function(req, res) {
    winston.info('list for GET /api/landscapes');
    Landscape.find().sort('-created').populate('user', 'displayName').exec(function(err, landscapes) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            winston.info('Retrieved landscapes: ' + landscapes.length);
            res.json(landscapes);
        }
    });
};


// GET /api/landscapes/<id>
exports.read = function(req, res) {
    res.json(req.landscape);
};


//Middleware Call - Reuse find by one function
exports.landscapesByID = function(req, res, next, id) {
    winston.info(' ---> retrieving Landscape');
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Landscapes is invalid'
        });
    }

    Landscape.findById(id).populate('createdBy', 'name email').exec(function(err, landscape) {
        if (err) {
            winston.log('error', err);
            return next(err);
        }
        else if (!landscape) {
            return res.status(404).send({
                message: 'No landscape with that identifier has been found'
            });
        }
        winston.info(' ---> retrieved: ' + req.params.id);
        req.landscape = landscape;
        next();
    });
};



// GET /api/landscapes/<id>/image
exports.retrieveImage = function(req, res) {
    winston.info(' ---> retrieving image');
    var id = req.params.id;
    Landscape.findOne({
        _id: id
    }, function(err, landscape) {
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        }
        else if (!landscape || !landscape.img.data || !landscape.img.contentType) {
            res.send(404);
        }
        else {
            winston.info(' ---> retrieved image for: ' + req.params.id);
            res.contentType(landscape.img.contentType);
            return res.send(new Buffer(landscape.img.data, 'binary'));
        }
    });
};


// POST /api/landscapes
exports.create = function(req, res) {
    winston.info(' ---> creating Landscape');
    var newLandscape = new Landscape(req.body);
    newLandscape.createdBy = req.user;

    newLandscape.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            winston.info(' ---> created: ' + newLandscape._id);
            res.json(newLandscape);
        }
    });
};


// DELETE /api/landscapes/<id>

exports.delete = function(req, res) {
    winston.info('DELETE /api/landscapes/ ---> deleting Landscape');
    var landscape = req.landscape;

    landscape.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            winston.info(' ---> deleted: ' + landscape._id);
            res.send(200);
        }
    });
};


// PUT /api/landscapes/<id>

exports.update = function(req, res) {
    winston.info(' ---> updating Landscape');
    var landscape = req.landscape;

    landscape.name = req.name;
    landscape.version = req.version;
    landscape.imageUri = req.imageUri;
    landscape.cloudFormationTemplate = req.cloudFormationTemplate;
    landscape.infoLink = req.infoLink;
    landscape.infoLinkText = req.infoLinkText;
    landscape.description = req.description;
    landscape.createdAt = new Date();
    landscape.createdBy = user;

    landscape.img.data = fs.readFileSync(req.imageUri);
    landscape.img.contentType = mime.lookup(req.imageUri);



    landscape.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(landscape);
        }
    });
};


// GET /api/landscapes/<id>/deployments
exports.retrieveDeployments = function(req, res) {
    var id = req.params.id;
    return Deployment.find({
        landscapeId: id
    }, function(err, deployments) {
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        }
        else {
            return res.json(deployments);
        }
    });
};


// WIP!
exports.retrieveHistory = function(req, res) {
    var id = req.params.id;
    return Deployment.find({
        landscapeId: id
    }, function(err, deployments) {
        if (err) {
            winston.log('error', err);
            return res.send(err);
        }
        else {
            return res.json(deployments);
        }
    });
};
