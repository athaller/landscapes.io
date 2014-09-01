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
    .controller('AdminUsersCtrl', function ($scope, UserService, AuthService) {
        $scope.addingUser = false;
        $scope.editingUser = false;
        $scope.viewingUser = false;

        $scope.user = { email: '', password: ''};
        $scope.errors = {};

        function retrieveUser(user) {
            UserService.retrieve(user._id)
                .then(function(data) {
                    $scope.user = data;
                });
        }

        $scope.resetUsers = function() {
            $scope.addingUser = false;
            $scope.editingUser = false;
            $scope.viewingUser = false;

            // value in input[email] and/or input[password] will not bind to model while !valid
            $scope.user = { email: '', password: ''};
            $scope.errors = {};

            $scope.submitted = false;

            // in adminCtrl
            $scope.setUserGroups();
        };


        $scope.deleteUser = function(user) {
            UserService.delete( user._id )
                .then(function() {
                    $scope.resetUsers();
                })
                .catch(function(err) {
                    err = err.data || err;
                    console.log(err)
                });
        };


        $scope.editUser = function(user) {
            $scope.editingUser = true;
            retrieveUser(user);
        };


        $scope.viewUser = function(user) {
            $scope.viewingUser = true;
            retrieveUser(user);
        };


        $scope.addUser = function() {
            $scope.addingUser = true;
        };


        function formatMongooseErrors(err, form){}

        $scope.saveUser = function(form) {

            $scope.submitted = true;

            if(form.$valid && $scope.addingUser) {
                AuthService.createUser({
                    name: $scope.user.name,
                    email: $scope.user.email,
                    password: $scope.user.password,
                    role: $scope.user.role || 'user'
                })
                    .then( function() {
                        $scope.resetUsers()
                    })
                    .catch( function(err) {
                        console.log('UserService.update Error: ' + JSON.stringify(err));

                        err = err.data;
                        $scope.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function(error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.message;
                            console.log(error.message)
                        });
                    });
            } else if(form.$valid && $scope.editingUser) {
                UserService.update($scope.user._id, {
                    name: $scope.user.name,
                    email: $scope.user.email,
                    role: $scope.user.role
                })
                    .then( function() {
                        $scope.resetUsers()
                    })
                    .catch( function(err) {
                        console.log('UserService.update Error: ' + JSON.stringify(err));

                        err = err.data;
                        $scope.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function(error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.message;
                            console.log(error.message)
                        });
                    });
            }
        };
    });