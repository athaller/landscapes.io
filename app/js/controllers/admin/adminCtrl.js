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
    .controller('AdminCtrl', function ($scope, UserService, RoleService, GroupService, PermissionService,AccountService, AppSettingsService, GlobalTagService) {

        $scope.menu = [
            'Users',
            'Roles',
            'Groups',
            'Global Tags',
            'Accounts',
            'App Settings'
        ];

        $scope.selected = $scope.menu[5];

        $scope.buttonClick = function(text){
            $scope.selected = text;
        };

        $scope.errors = {};

        $scope.permissions = PermissionService.retrieveAll();

        RoleService.retrieveAll()
            .then(function(data){
                $scope.roles = data;
            });

        GlobalTagService.retrieve()
            .then(function(data){
                $scope.globalTags = data;
            });

        GroupService.retrieve()
            .then(function(data){
                $scope.groups = data;
                $scope.setUserGroups(function() {
//                    console.log('setUserGroups');
                });
            });

        AccountService.retrieve()
            .then(function(data){
                $scope.accounts = data;
            });

        AppSettingsService.retrieve()
            .then(function(data){
                $scope.appSettings = data;
            });

        $scope.setUserGroups = function(callback) {
            $scope.users = [];

            GroupService.retrieve()
                .then(function(groups) {
                    $scope.groups = groups;

                    UserService.retrieveAll()
                        .then(function(users) {
                            $scope.users = users;
                            for (var i = 0; i < $scope.groups.length; i++) {
                                var group = $scope.groups[i];

                                for (var q = 0; q < $scope.users.length; q++) {
                                    var usr = $scope.users[q];

                                    if (_.contains(group.users, usr._id)) {
                                        $scope.users[q].groups.push(group.name);
                                    }
                                }
                            }
                        }
                    );
                }
            );
            if(callback) callback();
        }
    });