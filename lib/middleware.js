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

module.exports = {
    // Protect routes on api from unauthenticated access
    auth: function(req, res, next) {
        console.log(' ---> auth');

        if (req.isAuthenticated()) {
            console.log('req.user.userInfo: ' + req.user.userInfo);
            return next();
        }
        res.send(401);
    },

    // Set a cookie for angular so it knows we have an http session
    setUserCookie: function(req, res, next) {
        console.log(' ---> setUserCookie');

        if(req.user) {

            req.user.permissions = ['frog'];
            console.log(req.user.userInfo);

            res.cookie('user', JSON.stringify(req.user.userInfo));
        }
        next();
    }
};