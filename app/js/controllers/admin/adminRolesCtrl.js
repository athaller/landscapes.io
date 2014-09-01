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
    .controller('AdminRolesCtrl', function ($scope, RoleService, UserService, _) {
        $scope.role = { };
        $scope.originalRole = { };

        $scope.addUsers = [];
        $scope.removeUsers = [];

        $scope.addingRole = false;
        $scope.editingRole = false;

        $scope.submitted = false;

        function manageRoleUsers() {
            $scope.$watchCollection("role.users", function (newValue, oldValue) {
                if(newValue !== oldValue) {

                    var updateThisUser = _.difference(newValue, oldValue);
                    if(updateThisUser[0] !== undefined) {
                        // add User to Role
                        $scope.addUsers.push(updateThisUser[0]);
                        $scope.addUsers = _.uniq($scope.addUsers);

                        var index = _.indexOf($scope.removeUsers, updateThisUser[0]);
                        if (index !== -1) {
                            $scope.removeUsers.splice(index, 1);
                        }
                    } else {
                        // remove User from Role
                        updateThisUser = _.difference(oldValue, newValue);
                        $scope.removeUsers.push(updateThisUser[0]);
                        $scope.removeUsers = _.uniq($scope.removeUsers);

                        var index = _.indexOf($scope.addUsers, updateThisUser[0]);
                        if (index !== -1) {
                            $scope.addUsers.splice(index, 1);
                        }
                    }

                    console.log('$scope.addUsers: ' + $scope.addUsers);
                    console.log('$scope.removeUsers: ' + $scope.removeUsers);
                }
            })
        }

        $scope.resetRoles = function() {
            console.log('resetRoles');

            RoleService.retrieveAll()
                .then(function(data){
                    $scope.roles = data;

                    $scope.role = { };
                    $scope.originalRole = { };

                    $scope.addUsers = [];
                    $scope.removeUsers = [];

                    $scope.addingRole = false;
                    $scope.editingRole = false;
                    $scope.submitted = false;
                })
        };

        $scope.editRole = function(id) {
            console.log('editRole');
            $scope.editingRole = true;

            RoleService.retrieveOne(id)
                .then(function(data) {
                    $scope.role = data;
                    angular.copy(data, $scope.originalRole);
                })
                .then(function(){
                    manageRoleUsers();
                });
        };

        $scope.addRole = function() {
            console.log('addRole');
            $scope.addingRole = true;
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
                        $scope.setUserGroups();
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
                console.log('updating Role: ' + $scope.role.name);

                // update Role properties
                RoleService.update($scope.role._id, {
                    name: $scope.role.name,
                    permissions: $scope.role.permissions,
                    description: $scope.role.description
                })
                    .then(function () {
                        // add Users to Role
                        for(var i = 0; i < $scope.addUsers.length; i++) {
                            console.log("UserService.update: " + $scope.addUsers[i]);

                            UserService.update($scope.addUsers[i], {role: $scope.role.name})
                                .then(function (data) {
                                    console.log('User added to Role: ' + data.name);
                                })
                                .catch(function (err) {
                                    console.log(err);
                                })
                        }

                        // remove Users from role
                        for(var i = 0; i < $scope.removeUsers.length; i++) {
                            console.log("UserService.update: " + $scope.removeUsers[i]);

                            UserService.update($scope.addUsers[i], {role: undefined})
                                .then(function (data) {
                                    console.log(data);
                                })
                                .catch(function (err) {
                                    console.log(err);
                                })
                        }
                        $scope.resetRoles();
                        $scope.setUserGroups();
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

        $scope.deleteRole = function() {
            console.log('delete Role: ' + $scope.role.name);
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