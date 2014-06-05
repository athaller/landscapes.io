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
    .factory('RoleService', function RoleService($location, $rootScope, Landscape) {
        return {
            retrieveAll: function (callback) {
                var roles = ['user', 'editor', 'admin'];
                return roles;
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