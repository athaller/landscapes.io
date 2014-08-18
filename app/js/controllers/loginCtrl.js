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
    .controller('LoginCtrl', function ($scope, $rootScope, $cookieStore, AuthService, $modal, _) {

        $scope.$on('$viewContentLoaded', function() {
            AuthService.logout()
                .then(function() {
                    $cookieStore.remove('user');
//                    console.log("$cookieStore.remove('user')");
                });
        });

        $scope.user = {};
        $scope.errors = {};

        $scope.open = function (msg) {
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: ModalInstanceCtrl,
                size: 'sm',
                resolve: { msg: function () { return msg; }
                }
            });
        };

        $scope.login = function(form) {
            $scope.submitted = true;

            if(form.$valid) {
                AuthService.login({
                    email: $scope.user.email,
                    password: $scope.user.password
                })
                    .then( function() {
                        $scope.go('/');
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