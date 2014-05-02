'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Template = mongoose.model('Template');

Template.find({}).remove(function() {
    Template.create({
            name : 'Cyber Warfare Test Range',
            description: "Live fire test range for system hardening",
            imageUrl: "images/tech3.png"
        }, {
            name : 'SATCOM Ground Station',
            description: "A cloud hosted software solution for SATCOM ground stations",
            imageUrl: "images/tech2.png"
        }, {
            name : 'LiDAR Processing Segment',
            description: "End-to-end segment for processing LiDAR sensor data",
            imageUrl: "images/tech4.png"
        },{
            name : 'Remote Metering',
            description: "Remote monitoring and smart grid solutions with M2M software services",
            imageUrl: "images/tech5.png"
        }, function() {
            console.log('finished populating Templates');
        }
    );
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
