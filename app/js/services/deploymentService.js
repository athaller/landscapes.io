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
    .factory('DeploymentService', function DeploymentService($location, $rootScope, Deployment, $http) {
        return {
            create: function(deployment, callback) {
                var cb = callback || angular.noop;

                return Deployment.save(deployment,
                    function(deployment) {
                        return cb(deployment);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            },
            retrieveForLandscape: function(id, callback) {
                var cb = callback || angular.noop;

                $http.get('/api/landscapes/' + id + '/deployments')
                    .success(function(deployments) {
                        return cb(null, deployments);
                    })
                    .error(function(err) {
                        return cb(err);
                    })
            },
            update: function(id, deployment, callback) {
                var cb = callback || angular.noop;

                $http.put('/api/deployments/' + id, deployment)
                    .success(function(data) {;
                        return cb(null, data);
                    })
                    .error(function(err) {
                        return cb(err);
                    })
            }
        };
    });

angular.module('landscapesApp')
    .factory('Deployment', function ($resource) {
        return $resource('/api/deployments/:id', {
            id: '@id'
        }, {
            update: { method: 'PUT' }
        });
    });