'use strict';

angular.module('landscapes')
    .controller('NavbarCtrl', function ($scope, $state,  $location, Authentication) {
        $scope.authentication = Authentication;



            $scope.isActive = function(route) {
                var href = $location.path();
                return route === href;
            };
        }
    );
