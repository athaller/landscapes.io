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

var express = require('express');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var multer = require('multer');
var config = require('./lib/config/config');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Load models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

if(process.env.NODE_ENV == 'development') {
    var devDb = require('./lib/config/sampleData/sample-data');
    devDb.clearDbAndPopulateWithSampleData();
} else {
    var db = require('./lib/config/startupData/startup-data');
    db.createStartupData();
}

var passport = require('./lib/config/passport');

var app = express();

// file upload configuration...
app.configure(function () {
    app.use(multer({
        dest: './static/uploads/',
        rename: function (fieldname, filename) {
            return filename.replace(/\W+/g, '-').toLowerCase();
        }
    }));
    app.use('/static', express.static(__dirname + '/static'));
});

require('./lib/config/express')(app);
require('./lib/routes')(app);

app.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

exports = module.exports = app;