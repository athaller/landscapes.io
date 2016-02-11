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
    .controller('AdminGroupsCtrl', function ($scope, $rootScope, $http, User, GroupService) {

        $scope.group = { permissions: [] };
//        $scope.errors = {};

        $http.get('/api/landscapes')
            .success(function(data, status) {
                $scope.landscapes = data;
            });

        $scope.addingGroup = false;
        $scope.editingGroup = false;
        $scope.viewingGroup = false;

        $scope.viewGroup = function(group){
            $scope.group = group;
            $scope.viewingGroup = true;
        };

        $scope.editGroup = function(id) {
            console.log('editGroup: ' + id);
            $scope.editingGroup = true;
            $scope.group = GroupService.retrieveOne(id);
        };

        $scope.addGroup = function() {
            console.log('addGroup');
            $scope.addingGroup = true;
        };

        $scope.resetGroups = function() {
            console.log('resetGroups');
            $scope.setUserGroups();

            $scope.addingGroup = false;
            $scope.editingGroup = false;
            $scope.viewingGroup = false;
            $scope.group = {};
            $scope.submitted = false;
        };

        $scope.saveGroup = function (form) {
            $scope.submitted = true;

            if (form.$invalid) {
                console.log('form.$invalid: ' + JSON.stringify(form.$error));
            } else if ($scope.addingGroup) {

                GroupService.create({
                    name: $scope.group.name,
                    description: $scope.group.description,
                    users: $scope.group.users,
                    permissions: $scope.group.permissions,
                    landscapes: $scope.group.landscapes
                })
                    .then(function () {
                        $scope.resetGroups();
                    })
                    .catch(function (err) {
                        err = err.data || err;
                        console.log(err);

                        $scope.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function (error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.message;
                        });
                    });

            } else if ($scope.editingGroup) {

                GroupService.update($scope.group._id, {
                    name: $scope.group.name,
                    description: $scope.group.description,
                    users: $scope.group.users,
                    permissions: $scope.group.permissions,
                    landscapes: $scope.group.landscapes
                })
                    .then(function () {
                        $scope.resetGroups();
                    })
                    .catch(function (err) {
                        err = err.data || err;
                        console.log(err);

                        $scope.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function (error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.message;
                        });
                    });
            }
        };

        $scope.deleteGroup = function(){
            console.log('deleteGroup: ' + $scope.group._id)
            GroupService.delete($scope.group._id)
                .then(function() {
                    $scope.resetGroups();
                })
                .catch(function(err) {
                    err = err.data || err;
                    console.log(err)
                });
        };
    });
