'use strict';

angular.module('landscapes')
    .controller('NavbarCtrl', function ($scope, $state, Authentication, lodash) {
        $scope.authentication = Authentication;



            $scope.isActive = function(route) {
                return route === $state.current;
            };
        }
    );
