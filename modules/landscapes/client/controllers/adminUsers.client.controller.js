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
    .controller('AdminUsersController', function ($scope, UserService, Authentication) {
        var vm = this;
        vm.addingUser = false;
        vm.editingUser = false;
        vm.viewingUser = false;

        vm.user = { email: '', password: ''};
        vm.errors = {};

        vm.retrieveUser =  function(user) {
            vm.user = UserService.get({id:user._id});

        }

        vm.resetUsers = function() {
            vm.addingUser = false;
            vm.editingUser = false;
            vm.viewingUser = false;

            // value in input[email] and/or input[password] will not bind to model while !valid
            vm.user = { email: '', password: ''};
            vm.errors = {};

            vm.submitted = false;

            // in adminCtrl
            $scope.setUserGroups();
        };


        vm.deleteUser = function(user) {
            UserService.delete( {id:user._id} )
            $.promise.then(function() {
                    $scope.resetUsers();
                })
                .catch(function(err) {
                    err = err.data || err;
                    console.log(err)
                });
        };


        vm.editUser = function(user) {
            vm.editingUser = true;
            vm.retrieveUser(user);
        };


        vm.viewUser = function(user) {
            vm.viewingUser = true;
            vm.retrieveUser(user);
        };


        vm.addUser = function() {
            vm.addingUser = true;
        };


        function formatMongooseErrors(err, form){}

        vm.saveUser = function(form) {
            vm.form = form;
            vm.submitted = true;

            if(vm.form.$valid && vm.addingUser) {
                UserService.save({
                    username: vm.user.username,
                    displayName: vm.user.username,
                    email: vm.user.email,
                    password: vm.user.password,
                    role: vm.user.role
                })
                    .$promise.then( function() {
                        vm.resetUsers()
                    })
                    .catch( function(err) {
                        console.log('UserService.update Error: ' + JSON.stringify(err));

                        err = err.data;
                        vm.message = err;
                        vm.form.$invald = true;
                        vm.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function(error, field) {
                            vm.form[field].$setValidity('mongoose', false);
                            vm.errors[field] = error.message;
                            console.log(error.message)
                        });
                    });
            } else if(vm.form.$valid && vm.editingUser) {
                UserService.update({id:vm.user._id}, {
                    username: vm.user.username,
                    displayName: vm.user.username,
                    email: vm.user.email,
                    role: vm.user.role
                })
                    .$promise.then( function() {
                        vm.resetUsers()
                    })
                    .catch( function(err) {
                        console.log('UserService.update Error: ' + JSON.stringify(err));

                        err = err.data;
                        vm.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function(error, field) {
                            vm.form[field].$setValidity('mongoose', false);
                            vm.errors[field] = error.message;
                            console.log(error.message)
                        });
                    });
            }
        };
    });
