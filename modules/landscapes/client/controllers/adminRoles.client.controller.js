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
    .controller('AdminRolesCtrl', function ($scope, RoleService, UserService, lodash) {
        var vm = this;
        vm.role = { };
        vm.originalRole = { };

        //vm.users = UserService.query();

        vm.addUsers = [];
        vm.removeUsers = [];

        vm.addingRole = false;
        vm.editingRole = false;
        vm.submitted = false;

        vm.compareUsers = function(obj1,obj2){
            return obj1._id === obj2._id;
        };

        // Refactor
        function manageRoleUsers() {
            $scope.$watchCollection("vm.role.users", function (newValue, oldValue) {
                if(newValue !== oldValue) {

                    var updateThisUser = _.difference(newValue, oldValue);
                    var index = null;
                    if(updateThisUser[0] !== undefined) {
                        // add User to Role
                        vm.addUsers.push(updateThisUser[0]);
                        vm.addUsers = _.uniq(vm.addUsers);

                        index = _.indexOf(vm.removeUsers, updateThisUser[0]);
                        if (index !== -1) {
                            vm.removeUsers.splice(index, 1);
                        }
                    } else {
                        // remove User from Role
                        updateThisUser = _.difference(oldValue, newValue);
                        vm.removeUsers.push(updateThisUser[0]);
                        vm.removeUsers = _.uniq(vm.removeUsers);

                        index = _.indexOf(vm.addUsers, updateThisUser[0]);
                        if (index !== -1) {
                            vm.addUsers.splice(index, 1);
                        }
                    }

                    console.log('vm.addUsers: ' + vm.addUsers);
                    console.log('vm.removeUsers: ' + vm.removeUsers);
                }
            });
        }

        vm.resetRoles = function() {
            console.log('resetRoles');

            $scope.$parent.vm.roles =  RoleService.query();
            $scope.$parent.vm.users =  UserService.query();

                vm.role = { };
                vm.originalRole = { };

                vm.addUsers = [];
                vm.removeUsers = [];

                vm.addingRole = false;
                vm.editingRole = false;
                vm.submitted = false;

        };

        vm.editRole = function(id) {
            console.log('editRole');
            vm.editingRole = true;

            RoleService.get({id:id})
                .$promise.then(function(data) {
                    vm.role = data;
                    angular.copy(data, vm.originalRole);
                })
                .then(function(){
                    manageRoleUsers(); // TODO Is this still needed - AH
                });
        };

        vm.addRole = function() {
            console.log('addRole');
            vm.addingRole = true;
        };

        vm.saveRole = function (form) {
            vm.submitted = true;
            vm.form = form;

            if (vm.form.$invalid) {
                console.log('form.$invalid: ' + JSON.stringify(form.$error));
            } else if (vm.addingRole) {

                RoleService.save({
                    name: vm.role.name,
                    description: vm.role.description,
                    permissions: vm.role.permissions
                })
                    .$promise
                    .then(function () {
                        vm.resetRoles();

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

            } else if (vm.editingRole) {
                console.log('updating Role: ' + vm.role.name);

                // update Role properties
                RoleService.update({id:vm.role._id}, {
                    name: vm.role.name,
                    permissions: vm.role.permissions,
                    description: vm.role.description
                })
                    .$promise
                    .then(function () {
                        //Find new role
                        var newUsers = lodash.differenceWith(vm.role.users,vm.originalRole.users, function(a,b){
                            return a._id === b._id;
                        });
                        // Find Deleted Roles
                        var deletedUsers = lodash.differenceWith(vm.originalRole.users, vm.role.users, function(a,b){
                            return a._id === b._id;
                        });

                        console.log('new users role ' + newUsers);
                        console.log('deleted users role ' + deletedUsers);

                        //really need an async here ...
                        for(var i = 0; i < newUsers.length; i++) {
                            console.log("UserService.update: " + newUsers[i]);
                            UserService.addRole({id:newUsers[i]._id,roleId:vm.role._id})
                                .$promise
                                .then(vm.resetRoles);
                                // .then(function (data){
                                //     vm.resetRoles();
                                // });
                        }

                        //  Users from role
                        for(var j = 0; i < deletedUsers.length; j++) {
                            console.log("UserService.update: " + deletedUsers[j]);
                            UserService.deleteRole({id:deletedUsers[j]._id,roleId:vm.role._id})
                                .$promise
                                .then(vm.resetRoles);
                                // .then(function (data){
                                //     vm.resetRoles();
                                // });
                        }
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
            }
        };

        vm.deleteRole = function() {
            console.log('delete Role: ' + vm.role.name);
            RoleService.delete({id:vm.role._id})
                .$promise
                .then(function() {
                    vm.resetRoles();
                })
                .catch(function(err) {
                    err = err.data || err;
                    console.log(err);
                });
        };
    });
