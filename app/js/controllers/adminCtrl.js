'use strict';

angular.module('landscapesApp')
    .controller('AdminCtrl', function ($scope, User, AuthService) {
        $scope.menu = [
            'Roles',
            'Users',
            'Global',
            'MongoDB'
        ];

        $scope.selected = $scope.menu[0];

        $scope.buttonClick = function(text){
            $scope.selected = text;
            console.log($scope.selected);
        };

        $scope.errors = {};

        $scope.roles = [{name: 'Admin'},{name: 'Editor'},{name: 'User'}]

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
