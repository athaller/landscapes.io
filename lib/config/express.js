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

var winston = require('winston');
var express = require('express');
var path = require('path');
var config = require('./config');
var passport = require('passport');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var multer  = require('multer');

module.exports = function(app) {

    app.set('views', config.root + '/app/views');
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'app')));

    var environment = app.get('env');

    switch(environment) {
        case 'development':
            app.use(require('connect-livereload')());
            app.use(function noCache(req, res, next) {
                if (req.url.indexOf('/js/') === 0) {
                    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
                    res.header('Pragma', 'no-cache');
                    res.header('Expires', 0);
                }
                next();
            });
            break;

        case 'test':
            break;

        case 'production':
            break;
    }

    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(morgan('combined'));
    app.use(methodOverride('X-HTTP-Method-Override'));
    app.use(cookieParser());

    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: 'The secret text!',
        store: new mongoStore({
            url: config.mongo.uri,
            collection: 'sessions'
        }, function () {
            winston.info("Express session db connection set.");
        })
    }));

    //use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // file upload configuration...
    app.use(multer({
        dest: './uploads/',
        rename: function (fieldname, filename) {
            return filename.replace(/\W+/g, '-').toLowerCase();
        }
    }));

    // Development error handler
    if ('development' == app.get('env')) {
        app.use(errorHandler());
    }
};
