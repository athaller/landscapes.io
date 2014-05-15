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
            name: 'High Performance Tiling System',
            version: '1.0',
            description: 'Auto scaling high performance tiling system for AWS.',
            imageUri: 'images/ow/HATS.png',
            cloudFormationTemplate: dummyTemplate
        }, {
            createdBy: "dummydata",
            name: 'Cloud Service Factory 01',
            version: '1.0',
            description: "Service factory for AWS big data.",
            imageUri: "images/ow/sf01.png",
            cloudFormationTemplate: dummyTemplate
        }, {
            createdBy: "dummydata",
            name: 'Cloud Service Factory 02',
            version: '1.0',
            description: "Service factory for AWS big data.",
            imageUri: "images/ow/sf02.png",
            cloudFormationTemplate: dummyTemplate
        }, {
            createdBy: "dummydata",
            name: 'Cloud Service Factory 03',
            version: '1.0',
            description: "Service factory for AWS big data.",
            imageUri: "images/ow/sf03.png",
            cloudFormationTemplate: dummyTemplate
        }, {
            createdBy: "dummydata",
            name: 'Stacks',
            version: '1.0',
            description: "Stacks application.",
            imageUri: "images/ow/stacks.png",
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
