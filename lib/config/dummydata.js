'use strict';
var fs = require('fs');
var path = require('path');
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Landscape = mongoose.model('Landscape');
var Deployment = mongoose.model('Deployment');

exports.clearDbAndPopulateWithSampleData = function() {

    var filePath = path.join(__dirname + '/EC2Instance.template');

    fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
        if(err) { console.log(err); }

        var dummyTemplate = data;
        console.log('dummydata: ' + filePath);

        Landscape.find({}).remove(function () {
            Landscape.create({
                createdBy: "dummydata",
                name: 'High Performance Tiling System',
                version: '1.0',
                description: 'Auto scaling high performance tiling system for AWS.',
                imageUri: 'images/AWS-Icon.png',
                cloudFormationTemplate: dummyTemplate
            }, {
                createdBy: "dummydata",
                name: 'Cloud Service Factory 01',
                version: '1.0',
                description: "Service factory for AWS big data.",
                imageUri: "images/AWS-CF-Icon.png",
                cloudFormationTemplate: dummyTemplate
            }, {
                createdBy: "dummydata",
                name: 'Cloud Service Factory 02',
                version: '1.0',
                description: "Service factory for AWS big data.",
                imageUri: "images/AWS-VPC-Icon.png",
                cloudFormationTemplate: dummyTemplate
            }, {
                createdBy: "dummydata",
                name: 'Cloud Service Factory 03',
                version: '1.0',
                description: "Service factory for AWS big data.",
                imageUri: "images/AWS-EC2-Icon.png",
                cloudFormationTemplate: dummyTemplate
            }, {
                createdBy: "dummydata",
                name: 'Stacks',
                version: '1.0',
                description: "Stacks application.",
                imageUri: "images/AWS-CF-Stack-Icon.png",
                cloudFormationTemplate: dummyTemplate
            }, function () {
                console.log('dummydata landscapes populated');
            });
        });

        User.find({}).remove(function () {
            User.create({
                    provider: 'local',
                    name: 'Test User',
                    email: 'test@test.com',
                    password: 'test'
                }, function () {
                    console.log('dummydata users populated');

                }
            );
        });

    });
}