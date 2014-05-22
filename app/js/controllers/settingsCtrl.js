'use strict';

angular.module('landscapesApp')
    .controller('SettingsCtrl', function ($scope, User, AuthService, RoleService) {
        $scope.roles = RoleService.retrieveAll();
        $scope.editingAccountSettings = false;
        $scope.changingPassword = false;
        $scope.errors = {};

        $scope.editAccountSettings = function() {
            $scope.editingAccountSettings = true;
            $scope.currentUser.role_old = $scope.currentUser.role;
            $scope.currentUser.name_old = $scope.currentUser.name;
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

        $scope.changePassword = function (form) {
            $scope.submitted = true;

            if (form.$valid) {
                AuthService.changePassword($scope.user.oldPassword, $scope.user.newPassword)
                    .then(function () {
                        $scope.message = 'Password successfully changed.';
                    })
                    .catch(function () {
                        form.password.$setValidity('mongoose', false);
                        $scope.errors.other = 'Incorrect password';
                    });
            }
        };
    });
