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
    .controller('AdminRolesCtrl', function ($scope, RoleService, PermissionService) {

        $scope.role = { permissions: [] };
//        $scope.errors = {};

//        $scope.roles = RoleService.retrieve();
//        $scope.permissions = PermissionService.retrieveAll();

        $scope.addingRole = false;
        $scope.editingRole = false;

        $scope.editRole = function(id) {
            console.log('editRole: ' + id);
            $scope.editingRole = true;
            $scope.role = RoleService.retrieveOne(id);
        };

        $scope.addRole = function() {
            console.log('addRole');
            $scope.addingRole = true;
        };

        $scope.resetRoles = function() {
            $scope.roles = RoleService.retrieve();
            $scope.addingRole = false;
            $scope.editingRole = false;
            $scope.role = { permissions: [] };
            $scope.submitted = false;
        };

        $scope.saveRole = function (form) {
            $scope.submitted = true;

            if (form.$invalid) {
                console.log('form.$invalid: ' + JSON.stringify(form.$error));
            } else if ($scope.addingRole) {

                RoleService.create({
                    name: $scope.role.name,
                    description: $scope.role.description,
                    permissions: $scope.role.permissions
                })
                    .then(function () {
                        $scope.resetRoles();
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

            } else if ($scope.editingRole) {

                RoleService.update($scope.role._id, {
                    name: $scope.role.name,
                    permissions: $scope.role.permissions,
                    description: $scope.role.description
                })
                    .then(function () {
                        $scope.resetRoles();
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

        $scope.deleteRole = function(){
            console.log('deleteRole: ' + $scope.role._id)
            RoleService.delete($scope.role._id)
                .then(function() {
                    $scope.resetRoles();
                })
                .catch(function(err) {
                    err = err.data || err;
                    console.log(err)
                });
        };
    });