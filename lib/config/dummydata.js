'use strict';
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Landscape = mongoose.model('Landscape');
var Deployment = mongoose.model('Deployment');

Landscape.find({}).remove(function() {
    Landscape.create({
            name: 'Cyber Warfare Test Range',
            description: "Live fire test range for system hardening",
            imageUrl: "images/tech3.png"
        }, {
            name: 'SATCOM Ground Station',
            description: "A cloud hosted software solution for SATCOM ground stations",
            imageUrl: "images/tech2.png"
        }, {
            name: 'LiDAR Processing Segment',
            description: "End-to-end segment for processing LiDAR sensor data",
            imageUrl: "images/tech4.png"
        }, {
            name: 'Remote Metering',
            description: "Remote monitoring and smart grid solutions with M2M software services",
            imageUrl: "images/tech5.png"
        }, function () {
            console.log('finished populating Landscapes');
        }
        , function (err) {
            Landscape.findOne({'name': 'Cyber Warfare Test Range'}, function (err, landscape) {
                Deployment.find({}).remove(function () {
                    Deployment.create({
                            createdBy: 'dummydata',
                            landscape: landscape._id,
                            name: 'frog',
                            description: 'lips',
                            location: 'USA',
                            billingCode: '123',
                            cloudFormationTemplate: '{"good": "luck"}',
                            cloudFormationParameters: [
                                {key: 'wife', value: 'heather'},
                                {key: 'dog', value: 'mojo'}
                            ]
                        }
                    )
                })
            });

        });
});

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
