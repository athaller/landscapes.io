'use strict';

angular.module('landscapesApp')
    .controller('AdminCtrl', function ($scope, User, AuthService, RoleService) {
        $scope.menu = [
            'Settings',
            'Roles',
            'Users',
            'Globals',
            'AWS Accounts'
        ];

        $scope.selected = $scope.menu[0];

        $scope.buttonClick = function(text){
            $scope.selected = text;
            console.log($scope.selected);
        };

        $scope.roles = RoleService.retrieveAll();
        $scope.users = User.query();

        $scope.errors = {};

        $scope.saveChanges = function (form) {
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
