'use strict';
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Landscape = mongoose.model('Landscape');
var Deployment = mongoose.model('Deployment');

Landscape.find({}).remove(function() {
    Landscape.create({
            createdBy: "dummydata",
            name: 'Cyber Warfare Test Range',
            description: "Live fire test range for system hardening.",
            imageUri: "images/tech3.png"
        }, {
            createdBy: "dummydata",
            name: 'SATCOM Ground Station',
            description: "A cloud hosted software solution for SATCOM ground stations.",
            imageUri: "images/server_sm.png"
        }, {
            createdBy: "dummydata",
            name: 'LiDAR Processing Segment',
            description: "End-to-end segment for processing LiDAR sensor data.",
            imageUri: "images/tech4.png"
        }, {
            createdBy: "dummydata",
            name: 'Remote Metering',
            description: "Remote monitoring and smart grid solutions with M2M software services.",
            imageUri: "images/tech5.png"
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
