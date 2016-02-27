// Copyright 2014 OpenWhere, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
(function () {
    'use strict';

    angular
        .module('landscapes')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = ['$scope', '$state','UserService', 'RoleService','GroupService','PermissionService','AccountService', 'AppSettingsService','GlobalTagService', 'Authentication'];

    function SettingsController($scope, $state, UserService, RoleService, Authentication) {


        $scope._ = _;

        $scope.roles = RoleService.retrieveAll();
        $scope.editingAccountSettings = false;
        $scope.changingPassword = false;
        $scope.errors = {};

        $scope.editAccountSettings = function() {
            $scope.editingAccountSettings = true;
            $scope.currentUser.role_old = $scope.currentUser.role;
            $scope.currentUser.name_old = $scope.currentUser.name;
            $scope.message = undefined;
        };

        $scope.cancelEditAccountSettings = function(form) {
            form.$dirty = false;
            $scope.editingAccountSettings = false;
            $scope.currentUser.role = $scope.currentUser.role_old;
            $scope.currentUser.name = $scope.currentUser.name_old;
        };

        $scope.updateAccountSettings = function(form) {
            $scope.submitted = true;

        };

        // $scope.changePassword = function (form) {
        //     $scope.submitted = true;

        //     if (form.$valid) {
        //         AuthService.changePassword($scope.user.oldPassword, $scope.user.newPassword)
        //             .then(function () {
        //                 $scope.message = 'Password successfully changed.';
        //             })
        //             .catch(function () {
        //                 form.password.$setValidity('mongoose', false);
        //                 $scope.errors.other = 'Incorrect password';
        //             });
        //     } else {
        //         console.log(JSON.stringify(form.$error));
        //     }
        // };

        $scope.updateUser = function (form) {

            $scope.submitted = true;
            if (form.$valid) {
                var id = $scope.currentUser._id;
                var userData = {
                    name: $scope.currentUser.name,
                    email: $scope.currentUser.email,
                    role: $scope.currentUser.role
                };
                UserService.update(id, userData)
                    .then(function () {
                        $scope.message = 'User account settings updated.';
                        $scope.editingAccountSettings = false;
                    })
                    .catch(function (err) {
                        err = err.data;
                        console.log(err);

                        $scope.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function(error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.message;
                        });
                    });
            } else {
                console.log(JSON.stringify(form.$error));
            }
        };
    }

})();
