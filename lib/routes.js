// Copyright 2014 OpenWhere, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var landscapes = require('./controllers/api/landscapes');
var api = require('./controllers/api');
var index = require('./controllers');
var users = require('./controllers/users');
var session = require('./controllers/session');
var upload = require('./controllers/upload');
var middleware = require('./middleware');

module.exports = function(app) {
    app.post('/api/upload/template', upload.postCloudFormationTemplate);
    app.post('/api/upload/image', upload.postImage);


    app.get('/api/landscapes', landscapes.retrieve);
    app.post('/api/landscapes', landscapes.create);
    app.get('/api/landscapes/:id', landscapes.retrieveOne);
    app.put('/api/landscapes/:id', landscapes.update);
    app.delete('/api/landscapes/:id', landscapes.delete);
    app.get('/api/landscapes/:id/deployments', landscapes.retrieveDeployments);


    app.get('/api/deployments', api.deployments);
    app.post('/api/deployments', api.createDeployment);

    app.get('/api/deployments/:id', api.deployment);
    app.put('/api/deployments/:id', api.updateDeployment);


    app.get('/api/users', users.retrieve);
    app.post('/api/users', users.create);
    app.put('/api/users', users.changePassword);
    app.get('/api/users/me', users.me);
    app.get('/api/users/:id', users.retrieveOne);
    app.put('/api/users/:id', users.update);


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