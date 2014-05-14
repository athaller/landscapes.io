'use strict';
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Landscape = mongoose.model('Landscape');
var Deployment = mongoose.model('Deployment');


var dummyTemplate = '{' +
    '"AWSTemplateFormatVersion": "2010-09-09",' +
    '"Parameters": {' +
    '  "ChefRepoGitPassword": { "Description": "The Git Password", "Type": "String", "MinLength": "1", "NoEcho": "true" },' +
    '  "LocalIP": { "Description": "IP address for Firewall access", "Type": "String", "Default": "216.54.166.199" }' +
    '}, ' +
    '"Mappings": "none", ' +
    '"Conditions": "none", ' +
    '"Resources": "none", ' +
    '"Outputs": "none"' +
    '}'

Landscape.find({}).remove(function() {
    Landscape.create({
            createdBy: "dummydata",
            name: 'Cyber Warfare Test Range',
            version: '1.0',
            description: 'Live fire test range for system hardening.',
            imageUri: 'images/tech3.png',
            cloudFormationTemplate: dummyTemplate
        }, {
            createdBy: "dummydata",
            name: 'SATCOM Ground Station',
            version: '1.0',
            description: "A cloud hosted software solution for SATCOM ground stations.",
            imageUri: "images/server_sm.png",
            cloudFormationTemplate: dummyTemplate
        }, {
            createdBy: "dummydata",
            name: 'LiDAR Processing Segment',
            version: '1.0',
            description: "End-to-end segment for processing LiDAR sensor data.",
            imageUri: "images/tech4.png",
            cloudFormationTemplate: dummyTemplate
        }, {
            createdBy: "dummydata",
            name: 'Remote Metering',
            version: '1.0',
            description: "Remote monitoring and smart grid solutions with M2M software services.",
            imageUri: "images/tech5.png",
            cloudFormationTemplate: dummyTemplate
        }, function () {
            console.log('finished populating Landscapes');
        }
        , function (err) {
            Landscape.find({}, function (err, landscapes) {
                Deployment.find({}).remove(function () {
                    for (var i = 0; i < landscapes.length; i++) {
                        console.log(i + ': ' + landscapes[i]);
                        createDeployment(landscapes[i]);
                        createDeployment(landscapes[i]);
                    }
                })
            });
        });
    }
);

function createDeployment(parentLandscape){
    Deployment.create({
        createdBy: parentLandscape.createdBy,
        landscapeId: parentLandscape._id,
        name: 'Test Deployment',
        description: 'this is a test',
        location: 'US East (Northern Virginia)',
        billingCode: '123abc',
        cloudFormationTemplate: '{ "good": "luck" }',
        cloudFormationParameters: [
            {key: 'a', value: '1'},
            {key: 'b', value: '2'}
        ]
    })
}

// Clear old users, then add a default user
    User.find({}).remove(function() {
        User.create({
                provider: 'local',
                name: 'Test User',
                email: 'test@test.com',
                password: 'test'
            }, function() {
                console.log('finished populating users');
            }
        );
    });
