'use strict';
var winston = require('winston')

var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;

var Landscape = mongoose.model('Landscape');
var Deployment = mongoose.model('Deployment');
var async = require('async')

var AWS = require('aws-sdk');


// http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-anatomy.html


// http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html
AWS.config.loadFromPath('./aws/config.json');
console.log('AWS.config: ' + JSON.stringify(AWS.config));

exports.createLandscape = function (req, res) {
    winston.info(' ---> createLandscape');

    var user = req.user || {name: 'anonymous'};
    winston.info(user.name)

    var data = req.body;
    console.log(data);

    var newLandscape = new Landscape(data)
    newLandscape.createdBy = user.name;

    newLandscape.save(function (err) {
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        } else {
            console.log(newLandscape)
            return res.json(newLandscape);
        }
    });
};


exports.createDeployment = function (req, res) {
    winston.info(' ---> createDeployment');

    var user = req.user || {name: 'anonymous'};
    winston.info(user.name)

    var data = req.body;
    console.log(data);

    var newDeployment = new Deployment(data)
    newDeployment.createdBy = user.name;

    newDeployment.save(function (err) {
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        } else {
            winston.log(newDeployment)
//            return res.json(newDeployment);
        }
    })

    var parentLandscape = {};
//        = Landscape.findOne({_id: newDeployment.landscapeId}, function (err, landscape) {
//        if (!err) {
//            return landscape;
//        } else {
//            return res.send(err);
//        }
//    });


    var stackName = newDeployment.stackName;

    var createStackParams = {
        StackName: 'Frog Lips',
        TemplateBody: '{}'
    };

    var params = { StackName: stackName };
    var cloudFormation = new AWS.CloudFormation();

    async.series(
        [
            // configure parameters for upstream call to 'createStack'
            function(callback) {
                var parentLandscape = Landscape.findOne({_id: newDeployment.landscapeId}, function (err, landscape) {
                    if (!err) {
                        console.log(landscape);
                        createStackParams = {
                            StackName: stackName,
                            TemplateBody: landscape.cloudFormationTemplate
                        };
                        callback(null, parentLandscape)
                    } else {
                        callback(err);
                    }
                });
            },

            // make sure 'stack name' is available
            function (callback) {
                cloudFormation.describeStacks(params, function (err, data) {
                    if (err) {
                        console.log(err)

                        if (err.message == 'Stack:' + stackName + ' does not exist') {
                            console.log('good to go!')
                            callback(null, err.message);
                        }
                        callback(err, 'describeStacks');

                    } else {
                        var err = {message: 'stack with name "' + stackName + '" already exists'}
                        console.log(err.message)
                        callback(err, 'describeStacks');
                    }
                });
            },
            function (callback) {
                var awsRequest = cloudFormation.createStack(createStackParams, function (err, data) {
                    if (err) {
                        console.log(err);
                        callback(err, 'createStack');
                    } else {
                        console.log('--> stack created')
                        callback(null, awsRequest);
                    }
                });
            }
        ],
        function (err, results) {
            if (err) {
                return res.send(err);
            }
            else {
                console.log(JSON.stringify(results));

                results[2]
                    .on('success', function (res) {
                        console.log("Success!");
                        console.log(res);
                        return res.json(null, {success: true});
                    })
                    .on('error', function (res) {
                        console.log("Error!");
                        return res.send(res.err);
                    })
                    .send();
            }
        });
};


exports.deployments = function (req, res) {
    var id = req.params.id;
    console.log(id)
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
    console.log(id)
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
    console.log(id)
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
    console.log(id)
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


exports.landscape = function (req, res) {
    var id = req.params.id;
    console.log(id)
    return Landscape.findOne({_id: id}, function (err, landscape) {
        if (!err) {
            return res.json(landscape);
        } else {
            return res.send(err);
        }
    });
};


