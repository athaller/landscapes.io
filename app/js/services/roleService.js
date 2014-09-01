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
    .factory('RoleService', function RoleService($http, $rootScope, $q, Role) {
        return {
            create: function(role, callback) {
                var cb = callback || angular.noop;
                return Role.save(role,
                    function(role) {
                        return cb(role);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            },
            retrieveOne: function(id, callback) {
                    var cb = callback || angular.noop;

                return Role.get({id:id},
                        function(data) {
                            return cb(data);
                        },
                        function(err) {
                            return cb(err);
                        }
                    ).$promise;

            },
            retrieveAll: function(callback) {
                var cb = callback || angular.noop;

                return Role.query({},
                    function(data) {
                        return cb(data);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            },

            retrieveUsersInRole: function(id, callback) {
                console.log(id)
                console.log(callback)
                var cb = callback || angular.noop;

                return $http({method: 'GET', url: '/api/roles/'+id+'/users'})
                    .success(function(data, status) {
                        console.log('RoleService:' + JSON.stringify(data));
                        cb(data);
                    })
                    .error(function(data, status) {
                        var error = data || 'ERROR: RoleService.retrieveUsersInRole(' + id + ')';
                        cb(error);
                    });
            },

            update: function(id, role, callback) {
                var cb = callback || angular.noop;

                return Role.update({id:id}, role,
                    function(data) {
                        return cb(data);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            },
            delete: function(id, callback) {
                var cb = callback || angular.noop;

                console.log('delete Role: ' + id);

                return Role.remove({id: id},
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
    .factory('Role', function ($resource) {
        return $resource('/api/roles/:id', {
            id: '@id'
        }, {
            update: { method: 'PUT' }
        });
    });