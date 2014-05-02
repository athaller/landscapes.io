'use strict';

var mongoose = require('mongoose');
var Template = mongoose.model('Template');
var async = require('async')

var AWS = require('aws-sdk');

// http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html
AWS.config.loadFromPath('./aws/config.json');

console.log('AWS.config: ' + JSON.stringify(AWS.config));

exports.awsDeploy = function(req, res) {
    var stackName = 'mfincher-test05';

    var createStackParams = {
        StackName: stackName,
        TemplateURL: 'https://s3.amazonaws.com/cloudformation-samples-us-east-1/WordPress_Simple.template'
    };
    var params = { StackName: stackName };

    var cloudFormation = new AWS.CloudFormation();


    async.series([
            function (callback) {
                cloudFormation.describeStacks(params, function (err, data) {
                    if (err) {
                        console.log(err)

                        if(err.message == 'Stack:'+ stackName +' does not exist'){
                            console.log('good to go!')
                            callback(null, 'describeStacks');
                        }
                        callback(err, 'describeStacks');
                    } else {
                        var err = {message:'stack with name "' + stackName + '" already exists'}
                        console.log(err.message)
                        callback(err, 'describeStacks');
                    }
                });
            },
            function (callback) {
                var awsRequest = cloudFormation.createStack(createStackParams, function (err, data) {
                    if (err) {
                        console.log(err);
                        callback(err, 'describeStacks');
                    } else {
                            callback(null, awsRequest);
                        }
                    });

            }
        ],
        function (err, results) {
            if(err){
                return res.send(err);
            }
            else {
                results[1]
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
}


exports.awesomeThings = function(req, res) {
  return Template.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};