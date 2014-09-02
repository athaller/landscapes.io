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
    .factory('GlobalTagService', function GlobalTagService($location, GlobalTag) {
        return {
            create: function(group, callback) {
                var cb = callback || angular.noop;
                return GlobalTag.save(group,
                    function(data) {
                        return cb(data);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            },
            retrieve: function(callback) {
                var cb = callback || angular.noop;

                return GlobalTag.query({},
                    function(data) {
                        return cb(data);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            },
            retrieveOne: function(id) {
                return Tag.get({id:id}, function(){});
            },
            update: function(id, account, callback) {
                var cb = callback || angular.noop;

                return GlobalTag.update({id:id}, account,
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

                console.log('delete: ', id)

                return GlobalTag.remove({id: id},
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
    .factory('GlobalTag', function ($resource) {
        return $resource('/api/globalTags/:id', {
            id: '@id'
        }, {
            update: { method: 'PUT' }
        });
    });