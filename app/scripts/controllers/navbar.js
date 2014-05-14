'use strict';

angular.module('landscapesApp')
    .controller('NavbarCtrl', function ($scope, $location, AuthService) {
        $scope.menu = [{
            'title': 'Home',
            'link': '/landscapes'
        }, {
            'title': 'Settings',
            'link': '/settings'
        }];

        $scope.logout = function() {
            AuthService.logout()
                .then(function() {
                    $location.path('/login');
                });
        };

        $scope.isActive = function(route) {
            return route === $location.path();
        };
    }
);
