'use strict';

angular.module('landscapesApp')
    .controller('LoginCtrl', function ($scope, AuthService, $location, $modal) {
        $scope.user = {};
        $scope.errors = {};

        $scope.open = function (msg) {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                size: 'sm',
                resolve: {
                    msg: function () {
                        return msg;
                    }
                }
            });
        }

        $scope.login = function(form) {
            $scope.submitted = true;

            if(form.$valid) {
                AuthService.login({
                    email: $scope.user.email,
                    password: $scope.user.password
                })
                    .then( function() {
                        // Logged in, redirect to home
                        $location.path('/');
                    })
                    .catch( function(err) {
                        err = err.data;
                        $scope.errors.other = err.message;
                        $scope.submitted = false;
                        $scope.open(err.message);
                    });
            }
        };
    });

var ModalInstanceCtrl = function ($scope, $modalInstance, msg) {

    $scope.msg = msg;

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
};