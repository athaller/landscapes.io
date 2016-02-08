'use strict';

/**
 * Module dependencies
 */
var landscapesPolicy = require('../policies/landscapes.server.policy'),
    landscapes = require('../controllers/landscapes.server.controller'),
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

  // Finish by binding the landscapes middleware
  app.param('landscapesId', landscapes.landscapesByID);


  app.route('/api/upload/image').all(landscapesPolicy.isAllowed)
      .post(Upload.postImage);
  app.route('/api/upload/template').all(landscapesPolicy.isAllowed)
      .post(Upload.postCloudFormationTemplate);


};
