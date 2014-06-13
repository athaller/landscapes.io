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

var landscapes = require('./controllers/landscapes-api');
var deployments = require('./controllers/deployments-api');
var index = require('./controllers');
var users = require('./controllers/users-api');
var roles = require('./controllers/roles-api');
var groups = require('./controllers/groups-api');
var session = require('./controllers/session-api');
var upload = require('./controllers/upload-api');
var middleware = require('./middleware');

module.exports = function(app) {
    app.post('/api/upload/template', middleware.auth, upload.postCloudFormationTemplate);
    app.post('/api/upload/image', middleware.auth, upload.postImage);

    app.get('/api/landscapes', middleware.auth, landscapes.retrieve);
    app.post('/api/landscapes', middleware.auth, landscapes.create);
    app.get('/api/landscapes/:id', middleware.auth, landscapes.retrieveOne);
    app.put('/api/landscapes/:id', middleware.auth, landscapes.update);
    app.delete('/api/landscapes/:id', middleware.auth, landscapes.delete);
    app.get('/api/landscapes/:id/deployments', middleware.auth, landscapes.retrieveDeployments);


    app.get('/api/deployments', middleware.auth, deployments.retrieve);
    app.post('/api/deployments', middleware.auth, deployments.create);
    app.get('/api/deployments/:id', middleware.auth, deployments.retrieveOne);
    app.put('/api/deployments/:id', middleware.auth, deployments.update);

    app.get('/api/roles', middleware.auth, roles.retrieve);
    app.post('/api/roles', middleware.auth, roles.create);
    app.get('/api/roles/:id', middleware.auth, roles.retrieveOne);
    app.put('/api/roles/:id', middleware.auth, roles.update);
    app.delete('/api/roles/:id', middleware.auth, roles.delete);

    app.get('/api/groups', middleware.auth, groups.retrieve);
    app.post('/api/groups', middleware.auth, groups.create);
    app.get('/api/groups/:id', middleware.auth, groups.retrieveOne);
    app.put('/api/groups/:id', middleware.auth, groups.update);
    app.delete('/api/groups/:id', middleware.auth, groups.delete);

    app.get('/api/users', middleware.auth, users.retrieve);
    app.put('/api/users', middleware.auth, users.changePassword);
    app.get('/api/users/me', middleware.auth, users.me);
    app.get('/api/users/:id', middleware.auth, users.retrieveOne);
    app.put('/api/users/:id', middleware.auth, users.update);

    app.post('/api/users', users.create);
    app.post('/api/session', session.login);
    app.delete('/api/session', session.logout);

    // All undefined api routes should return a 404
    app.get('/api/*', function(req, res) {
        res.send(404);
    });

    // All other routes to use Angular routing in app/scripts/app.js
    app.get('/partials/*', index.partials);

    app.get('/*', middleware.setUserCookie, index.index);
};