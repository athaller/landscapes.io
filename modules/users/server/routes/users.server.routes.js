'use strict';

module.exports = function (app) {
  // User Routes
    var users = require('../controllers/users.server.controller'),
        roles = require('../controllers/roles.server.controller'),
        groups = require('../controllers/groups.server.controller'),
        path = require('path'),
        landscapesPolicy = require(path.resolve('./modules/landscapes/server/policies/landscapes.server.policy'));

    // Setting up the users profile api
    app.route('/api/users/me').get(users.me);
    app.route('/api/users').put(users.update);
    app.route('/api/users/accounts').delete(users.removeOAuthProvider);
    app.route('/api/users/password').post(users.changePassword);
    app.route('/api/users/picture').post(users.changeProfilePicture);

    // Finish by binding the user middleware
    app.param('userId', users.userByID);
  
  
  
  // admin routes
    app.get('/api/roles', roles.retrieve);
    app.post('/api/roles', roles.create);
    app.get('/api/roles/:id', roles.retrieveOne);
    app.put('/api/roles/:id', roles.update);
    app.delete('/api/roles/:id', roles.delete);
    app.get('/api/roles/:id/users', roles.retrieveUsers);

    app.get('/api/groups',  groups.retrieve);
    app.post('/api/groups',  groups.create);
    app.get('/api/groups/:id', groups.retrieveOne);
    app.put('/api/groups/:id',  groups.update);
    app.delete('/api/groups/:id', groups.delete);
  
  
};
