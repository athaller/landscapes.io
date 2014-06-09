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
    .controller('AdminUsersCtrl', function ($scope, User, AuthService, RoleService, GroupService, _) {
        console.log('AdminUsersCtrl');

        $scope.addingUser = false;

        $scope.editUser = function() {
            console.log('editRole');
        };

        $scope.addUser = function() {
            console.log('addUser');
            $scope.addingUser = true;
        };

        $scope.reset = function(form){
            $scope.addingUser = false;
        };

        $scope.setUserGroups();

    });