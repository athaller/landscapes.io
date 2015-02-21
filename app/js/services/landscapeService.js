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
    .factory('LandscapeService', function LandscapeService($location, $rootScope, Landscape) {
        return {
            create: function(landscape, callback) {
                var cb = callback || angular.noop;

                return Landscape.save(landscape,
                    function(landscape) {
                        return cb(landscape);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            },
            retrieve: function(id, callback) {
                var cb = callback || angular.noop;

                return Landscape.get({id:id}, function(landscape) {
                        return cb(landscape);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            },
            update: function(id, landscape, callback) {
                var cb = callback || angular.noop;

                return Landscape.update({id:id}, landscape,
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

                return Landscape.remove({id: id},
                    function(data) {
                        return cb(data);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            }
        };
    });

angular.module('landscapesApp')
    .factory('Landscape', function ($resource) {
        return $resource('/api/landscapes/:id', {
            id: '@id'
        }, {
            update: { method: 'PUT' }
        });
    });