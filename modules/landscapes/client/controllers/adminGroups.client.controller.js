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
    .controller('AdminGroupsCtrl', function ($scope, UserService, GroupService, LandscapesService, PermissionService) {

        var vm = this;

        vm.group = { permissions: [] };
//       $scope.errors = {};


        vm.addingGroup = false;
        vm.editingGroup = false;
        vm.viewingGroup = false;

        vm.viewGroup = function(group){
            vm.group = group;
            vm.viewingGroup = true;
        };

        vm.editGroup = function(id) {
            console.log('editGroup: ' + id);
            vm.editingGroup = true;
            vm.group = GroupService.retrieveOne(id);
        };

        vm.addGroup = function() {
            console.log('addGroup');
            vm.addingGroup = true;
        };

        vm.resetGroups = function() {
            console.log('resetGroups');
            //vm.setUserGroups();

            vm.addingGroup = false;
            vm.editingGroup = false;
            vm.viewingGroup = false;
            vm.group = {};
            vm.submitted = false;
            $scope.setUserGroups();
        };

        vm.saveGroup = function (form) {
            vm.form = form;
            vm.submitted = true;

            if (vm.form.$invalid) {
                console.log('form.$invalid: ' + JSON.stringify(vm.form.$error));
            } else if (vm.addingGroup) {

                GroupService.create({
                    name: vm.group.name,
                    description: vm.group.description,
                    users: vm.group.users,
                    permissions: vm.group.permissions,
                    landscapes: vm.group.landscapes
                })
                    .then(function () {
                        vm.resetGroups();
                    })
                    .catch(function (err) {
                        err = err.data || err;
                        console.log(err);

                        vm.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function (error, field) {
                            vm.form[field].$setValidity('mongoose', false);
                            vm.errors[field] = error.message;
                        });
                    });

            } else if (vm.editingGroup) {

                GroupService.update(vm.group._id, {
                    name: vm.group.name,
                    description: vm.group.description,
                    users: vm.group.users,
                    permissions: vm.group.permissions,
                    landscapes: vm.group.landscapes
                })
                    .then(function () {
                        vm.resetGroups();
                    })
                    .catch(function (err) {
                        err = err.data || err;
                        console.log(err);

                        $scope.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function (error, field) {
                            vm.form[field].$setValidity('mongoose', false);
                            vm.errors[field] = error.message;
                        });
                    });
            }
        };

        vm.deleteGroup = function(){
            console.log('deleteGroup: ' + vm.group._id)
            GroupService.delete(vm.group._id)
                .then(function() {
                    vm.resetGroups();
                })
                .catch(function(err) {
                    err = err.data || err;
                    console.log(err)
                });
        };
    });
