'use strict';

/**
 * Module dependencies
 */
var landscapesPolicy = require('../policies/landscapes.server.policy'),
    landscapes = require('../controllers/landscapes.server.controller'),
    deployments = require('../controllers/deployments.server.controller'),
    globalTags = require('../controllers/globaltags.server.contoller'),
    cloudaccounts = require('../controllers/cloudaccounts.server.controller'),
    appSettings = require('../controllers/appSettings.server.controller'),
    Upload = require('../controllers/upload.server.controller');

module.exports = function (app) {
    // landscapes collection routes
    app.route('/api/landscapes').all(landscapesPolicy.isAllowed)
      .get(landscapes.list)
      .post(landscapes.create);

    // Single landscapes routes
    app.route('/api/landscapes/:landscapesId').all(landscapesPolicy.isAllowed)
      .get(landscapes.read)
      .put(landscapes.update)
      .delete(landscapes.delete);

    app.route('/api/landscapes/:landscapesId/deployments').all(landscapesPolicy.isAllowed)
        .get(deployments.retrieveByLandscapes);
        

    // Finish by binding the landscapes middleware
    app.param('landscapesId', landscapes.landscapesByID);

    // Upload routes
    app.route('/api/upload/image').all(landscapesPolicy.isAllowed)
      .post(Upload.postImage);
    app.route('/api/upload/template').all(landscapesPolicy.isAllowed)
      .post(Upload.postCloudFormationTemplate);


    // Deployment Routes
    app.route('/api/deployments').all(landscapesPolicy.isAllowed)
      .get(deployments.retrieve)
      .post(deployments.create);
      
    app.route('/api/deployments/:id').all(landscapesPolicy.isAllowed)
      .get(deployments.retrieveOne)
      .put(deployments.update);
      
    
    //Global tags routes
    app.route('/api/globaltags').all(landscapesPolicy.isAllowed)
      .get(globalTags.retrieve)
      .post(globalTags.create);
      
    app.route('/api/globaltags/:id').all(landscapesPolicy.isAllowed)
      .get(globalTags.retrieveOne)
      .put(globalTags.update)
      .delete(globalTags.delete);
    
    
    //Cloud Accounts routes
    app.route('/api/accounts').all(landscapesPolicy.isAllowed)
       .get(cloudaccounts.retrieve)
       .post(cloudaccounts.create);

    app.route('/api/accounts/:id').all(landscapesPolicy.isAllowed)
       .get(cloudaccounts.retrieveOne)
       .put(cloudaccounts.update)
       .delete(cloudaccounts.delete);

    // App Settings
    app.route('/api/appSettings').all(landscapesPolicy.isAllowed)
      .get(appSettings.retrieve);
      
    app.route('/api/appSettings/:id').all(landscapesPolicy.isAllowed)
      .put(appSettings.update);
    
};
