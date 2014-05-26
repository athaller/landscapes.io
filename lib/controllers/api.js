'use strict';

var winston = require('winston');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Landscape = mongoose.model('Landscape');
var Deployment = mongoose.model('Deployment');
var async = require('async');
var AWS = require('aws-sdk');

// http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html
// http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html

AWS.config.loadFromPath('./aws/config.json');
//console.log('AWS.config: ' + JSON.stringify(AWS.config));

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


exports.deployment = function (req, res) {
    var id = req.params.id;
    return Deployment.findOne({_id: id}, function (err, deployment) {
        if (!err) {
            return res.json(deployment);
        } else {
            return res.send(err);
        }
    });
};


exports.landscapeDeployments = function (req, res) {
    var id = req.params.id;
    return Deployment.find({landscapeId: id}, function (err, deployments) {
        if (!err) {
            return res.json(deployments);
        } else {
            return res.send(err);
        }
    });
};


exports.landscapeHistory = function (req, res) {
    var id = req.params.id;
    return Deployment.find({landscapeId: id}, function (err, deployments) {
        if (!err) {
            return res.json(deployments);
        } else {
            return res.send(err);
        }
    });
};


exports.landscapes = function (req, res) {
    return Landscape.find(function (err, landscapes) {
        if (!err) {
            return res.json(landscapes);
        } else {
            return res.send(err);
        }
    });
};


exports.createLandscape = function (req, res) {
    winston.info(' ---> createLandscape');

    var user = req.user || {name: 'anonymous'};
    winston.info(user.name);

    var data = req.body;

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


exports.deleteLandscape = function (req, res) {
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


exports.updateLandscape = function (req, res) {
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
                    return res.json(400, err);
                } else {
                    return res.json(doc);
                }
            });
        }
    });
};


exports.landscape = function (req, res) {
    var id = req.params.id;
    return Landscape.findOne({_id: id}, function (err, landscape) {
        if (err) {
            winston.log('error', err);
            return res.send(err);
        } else {
            return res.json(landscape);
        }
    });
};


