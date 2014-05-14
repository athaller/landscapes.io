'use strict';

var api = require('./controllers/api');
var index = require('./controllers');
var users = require('./controllers/users');
var session = require('./controllers/session');
var upload = require('./controllers/upload');

var middleware = require('./middleware');

module.exports = function(app) {
    app.post('/api/upload/template', upload.postCloudFormationTemplate);
    app.post('/api/upload/image', upload.postImage);

    app.get('/api/landscapes', api.landscapes);
    app.post('/api/landscapes', api.createLandscape);

    app.get('/api/landscapes/:id', api.landscape);
    app.get('/api/landscapes/:id/deployments', api.landscapeDeployments);


    app.get('/api/deployments', api.deployments);
    app.get('/api/deployments/:id', api.deployment);
    app.post('/api/deployments', api.createDeployment);


    app.post('/api/users', users.create);
    app.put('/api/users', users.changePassword);
    app.get('/api/users/me', users.me);
    app.get('/api/users/:id', users.show);

    app.post('/api/session', session.login);
    app.del('/api/session', session.logout);

    // All undefined api routes should return a 404
    app.get('/api/*', function(req, res) {
        res.send(404);
    });

    // All other routes to use Angular routing in app/scripts/app.js
    app.get('/partials/*', index.partials);
    app.get('/*', middleware.setUserCookie, index.index);
};