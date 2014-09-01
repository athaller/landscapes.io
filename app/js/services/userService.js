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
    .factory('UserService', function LandscapeService($location, $rootScope, User) {
        return {
            create: function(user, callback) {
                var cb = callback || angular.noop;
                return User.save(user,
                    function(data) {
                        return cb(data);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            },
            retrieve: function(id, callback) {
                var cb = callback || angular.noop;
                return User.get({id:id},
                    function(user) {
                        return cb(user);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            },
            retrieveAll: function(callback) {
                var cb = callback || angular.noop;
                return User.query({},
                    function(user) {
                        return cb(user);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            },
            update: function (id, user, callback) {
                var cb = callback || angular.noop;
                return User.update({id: id}, user,
                    function (data) {
                        return cb(data);
                    },
                    function (err) {
                        return cb(err);
                    }
                ).$promise;
            },
            delete: function(id, callback) {
                var cb = callback || angular.noop;

                console.log('delete User: ' + id);

                return User.remove({id: id},
                    function(data) {
                        return cb(data);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            }
        }
    });


angular.module('landscapesApp')
    .factory('User', function ($resource) {
        return $resource('/api/users/:id', {
            id: '@id'
        }, {
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET',
                params: {
                    id:'me'
                }
            }
        });
    }
);
