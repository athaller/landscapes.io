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
    .factory('PermissionService', function PermissionService($rootScope, GroupService, _) {

        var permissions = [
            { value: 'C', name:'Create',        displayOrder: '10'},
            { value: 'R', name:'Read',          displayOrder: '20'},
            { value: 'U', name:'Update',        displayOrder: '30'},
            { value: 'D', name:'Delete',        displayOrder: '40'},
            { value: 'X', name:'Execute',       displayOrder: '80'},
            { value: 'F', name:'Full Control',  displayOrder: '90'}
        ];

        return {
            retrieveAll: function (callback) {
                return permissions;
            }
        }
    });