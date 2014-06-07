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

var path = require('path');

exports.partials = function(req, res) {
    var stripped = req.url.split('.')[0];

    console.log('stripped: ' + stripped);

    var requestedView = path.join('./', stripped);

    console.log('requestedView: ' + requestedView);

    res.render(requestedView, function(err, html) {
        if(err) {
            console.log("Error rendering partial '" + requestedView + "'\n", err);
            res.status(404);
            res.send(404);
        } else {
            res.send(html);
        }
    });
};

exports.index = function(req, res) {
    res.render('index');
};