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
var async = require('async');
var AWS = require('aws-sdk');

AWS.config.loadFromPath('./lib/config/aws/config.json');

// POST
exports.createDeployment = function (req, res) {
    winston.info(' ---> createDeployment <---');

    var user = req.user || {name: 'anonymous'};
    winston.info(user.name);

    var data = req.body;
    console.log('data: ' + JSON.stringify(data));

    var newDeployment = {};
    var parentLandscape = {};
    var stackParams = {};
    var stackName = {};
    var params = {};

    var cloudFormation = new AWS.CloudFormation();

    async.series({
            saveDeploymentData: function (callback) {
                winston.info(' ---> saving deployment data');
                try {
                    newDeployment = new Deployment(data);
                    newDeployment.createdBy = user.name;

                    var keys = Object.keys(data.cloudFormationParameters);
                    for (var i = 0; i < keys.length; i++) {
                        var cloudFormationParameter = { ParameterKey: keys[i], ParameterValue: data.cloudFormationParameters[keys[i]] };
                        newDeployment.cloudFormationParameters.push(cloudFormationParameter);
                        winston.info(cloudFormationParameter);
                    }

                    newDeployment.save(function (err, data) {
                        if (err) {
                            winston.log('error', err);
                            return res.json(500, err);
                        } else {
                            winston.info(' ---> deployment data saved: ' + newDeployment);
                            stackName = newDeployment.stackName;
                            params = { StackName: stackName };
                            callback(null, 'saveDeployment');
                        }
                    });
                }
                catch (err) {
                    winston.log('error' + err);
                    return res.json(500, err);
                }
            },
            setStackParameters: function(callback) {
                winston.info(' ---> setting stack parameters');
                Landscape.findOne({_id: newDeployment.landscapeId}, function (err, landscape) {
                    if (err) {
                        landscape.cloudFormationTemplate('error', err);
                        callback(err);
                    } else {
                        parentLandscape = landscape;

                        winston.info(landscape.cloudFormationTemplate);

                        stackParams = {
                            StackName: stackName,
                            TemplateBody: landscape.cloudFormationTemplate,
                            Parameters: newDeployment.cloudFormationParameters
                        };

                        stackParams.Parameters = newDeployment.cloudFormationParameters;
                        winston.info(stackParams.Parameters);

                        stackParams.Tags = []

                        if(newDeployment.flavor !== 'None') {
                            stackParams.Tags.push({ Key: "Flavor", Value: newDeployment.flavor })
                        }
                        if(newDeployment.description) {
                            stackParams.Tags.push({ Key: "Description", Value: newDeployment.description })
                        }
                        if(newDeployment.billingCode) {
                            stackParams.Tags.push({ Key: "Billing Code", Value: newDeployment.billingCode })
                        }

                        callback(null, 'createStack');
                    }
                });
            },
            verifyStackNameAvailability: function(callback) {
                winston.info(' ---> verifying availability of stack name');
                cloudFormation.describeStacks(params, function (err, data) {
                    if (err) {
                        if (err.message.indexOf('does not exist') !== -1) {
                            winston.info(' - - stack name ' + stackName + ' available - -');
                            callback(null);
                        } else {
                            // It's a real error...
                            callback(err);
                        }

                    } else {
                        var e = { message: 'Stack with name \'' + stackName + '\' already exists.' };
                        winston.info(' > > stack name ' + stackName + ' already exists! < <');
                        callback(e);
                    }
                });
            },
            createStack: function(callback) {
                winston.info(' ---> creating stack');

                // fix single quote issue...
                var cleanStackParams = JSON.parse(JSON.stringify(stackParams));

                var awsRequest = cloudFormation.createStack(cleanStackParams, function (err, data) {
                    if (err) {
                        winston.log('error', err);
                        winston.log('error', 'data: ' + data);
                        callback(err, 'createStack');

                    } else {
                        winston.info(' ---> stack created');
                        winston.info('cloudFormation.createStack: ' + data);

                        newDeployment.stackId = data.StackId;
                        newDeployment.save(function (err) {
                            if(err) { winston.log('error', err); }
                            callback(null, data); // awsRequest?
                        });
                    }
                });
            }
        },
        function (err, results) {
            if (err) {
                winston.info(' ---> async final callback: ERR');
                winston.log('error', err);

                newDeployment.awsErrors = err.message || err;
                newDeployment.save(function (err) {
                    if(err) { winston.log('error', err); }
                    return res.send(err);
                });

            }
            else {
                winston.info(' ---> async final callback');
                winston.info("Success!");
                return res.json({success: true});
            }
        }
    ); // end - async.series
};


// GET /api/deployments
exports.deployments = function (req, res) {
    var id = req.params.id;
    return Deployment.find(function (err, deployments) {
        if (!err) {
            return res.json(deployments);
        } else {
            return res.send(err);
        }
    });
};


// PUT /api/deployments/<api>
exports.updateDeployment = function (req, res) {
    winston.info(' ---> updateDeployment');

    var user = req.user || {name: 'anonymous'};
    winston.info(user.name);

    var data = req.body;
    winston.info(data);

    var query = {_id: req.params.id };

    Deployment.findOne(query, function (err, doc) {
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        } else {
            var newNote = { createdBy: user, createdAt: new Date(), text: data.note.text };
            doc.notes.push(newNote);

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


// GET /api/deployments/<id>
exports.deployment = function (req, res) {
    var id = req.params.id;
    return Deployment.findOne({_id: id}, function (err, deployment) {
        if (!err) {
            return res.json(deployment);
        } else {
            return res.send(err);
        }
    });
}