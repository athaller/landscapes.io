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

angular.module('landscapesApp')
    .factory('AuthService', function AuthService($location, $rootScope, Session, User, $cookieStore) {

        // Get currentUser from cookie
        $rootScope.currentUser = $cookieStore.get('user') || null;
//        console.log("$cookieStore.get('user') --> " + JSON.stringify($rootScope.currentUser));

        return {
            login: function(user, callback) {
                var cb = callback || angular.noop;

                return Session.save({
                    email: user.email,
                    password: user.password
                }, function(user) {
                    $rootScope.currentUser = user;
                    return cb();
                }, function(err) {
                    return cb(err);
                }).$promise;
            },

            logout: function(callback) {
                var cb = callback || angular.noop;

                return Session.delete(function() {
                        $rootScope.currentUser = null;
                        return cb();
                    },
                    function(err) {
                        return cb(err);
                    }).$promise;
            },

//            addUser: function(user, callback) {
//                var cb = callback || angular.noop;
//
//                return User.save(user,
//                    function(user) {
//                        return cb(user);
//                    },
//                    function(err) {
//                        return cb(err);
//                    }).$promise;
//            },

            createUser: function(user, callback) {
                var cb = callback || angular.noop;

                return User.save(user,
                    function(user) {
//                        $rootScope.currentUser = user;
                        return cb(user);
                    },
                    function(err) {
                        return cb(err);
                    }).$promise;
            },

            changePassword: function(oldPassword, newPassword, callback) {
                var cb = callback || angular.noop;

                return User.update({
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }, function(user) {
                    return cb(user);
                }, function(err) {
                    return cb(err);
                }).$promise;
            },
            isLoggedIn: function() {
                var user = $rootScope.currentUser;
                return !!user;
            }
        };
    });