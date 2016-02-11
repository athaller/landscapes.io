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

angular.module('landscapes')
    .controller('AdminController', function ($scope, UserService, RoleService, GroupService, PermissionService,AccountService, AppSettingsService, GlobalTagService) {

        var vm = this;

        vm.menu = [
            'Users',
            'Roles',
            'Groups',
            'Global Tags',
            'Accounts',
            'App Settings'
        ];

        vm.selected = vm.menu[5];

        $scope.buttonClick = function(text){
            vm.selected = text;
        };

        vm.errors = {};

        vm.permissions = PermissionService.retrieveAll();

        RoleService.retrieveAll()
            .then(function(data){
                vm.roles = data;
            });

        GlobalTagService.retrieve()
            .then(function(data){
                vm.globalTags = data;
            });

        GroupService.retrieve()
            .then(function(data){
                vm.groups = data;
                vm.setUserGroups(function() {
//                    console.log('setUserGroups');
                });
            });

        AccountService.retrieve()
            .then(function(data){
                vm.accounts = data;
            });

        AppSettingsService.retrieve()
            .then(function(data){
                vm.appSettings = data;
            });

        $scope.setUserGroups = function(callback) {
            vm.users = [];

            GroupService.retrieve()
                .then(function(groups) {
                    vm.groups = groups;

                    UserService.retrieveAll()
                        .then(function(users) {
                            vm.users = users;
                            for (var i = 0; i < vm.groups.length; i++) {
                                var group = vm.groups[i];

                                for (var q = 0; q < vm.users.length; q++) {
                                    var usr = vm.users[q];

                                    if (_.contains(group.users, usr._id)) {
                                        vm.users[q].groups.push(group.name);
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