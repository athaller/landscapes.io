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

angular.module('landscapesApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'angularFileUpload',
    'underscore',
    'checklist-model'
])
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                redirectTo: '/landscapes'
            })
            .when('/login', {
                templateUrl: 'partials/login',
                controller: 'LoginCtrl'
            })
            .when('/signup', {
                templateUrl: 'partials/signup',
                controller: 'SignupCtrl'
            })
            .when('/settings', {
                templateUrl: 'partials/settings',
                controller: 'SettingsCtrl',
                authenticate: true
            })
            .when('/admin', {
                templateUrl: 'partials/admin/admin-main',
                controller: 'AdminCtrl',
                authenticate: true
            })
            .when('/landscape/new', {
                templateUrl: 'partials/landscape/create-landscape',
                controller: 'CreateLandscapeCtrl',
                authenticate: true
            })
            .when('/landscapes/:id/edit', {
                templateUrl: 'partials/landscape/edit-landscape',
                controller: 'EditLandscapeCtrl',
                authenticate: true
            })
            .when('/landscapes', {
                templateUrl: 'partials/landscape/list-landscapes',
                controller: 'ListLandscapesCtrl'
            })
            .when('/landscapes/:id', {
                templateUrl: 'partials/landscape/view-landscape',
                controller: 'ViewLandscapeCtrl',
                authenticate: true
            })
            .when('/landscapes/:id/history', {
                templateUrl: 'partials/landscape/view-landscape-history',
                controller: 'LandscapeViewCtrl',
                authenticate: true
            })
            .when('/deploy/:id', {
                templateUrl: 'partials/deployment/create-deployment',
                controller: 'CreateDeploymentCtrl',
                authenticate: true
            })
//            .otherwise({
//                redirectTo: '/landscapes'
//            });

        $locationProvider.html5Mode(true);

        // Intercept 401s and redirect you to login
        $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
            return {
                'responseError': function(response) {
                    if(response.status === 401) {
                        $location.path('/login');
                        return $q.reject(response);
                    }
                    else {
                        return $q.reject(response);
                    }
                }
            };
        }]);
    })
    .run(function ($rootScope, $location, AuthService) {

        $rootScope.$on('$routeChangeStart', function (event, next) {
            if (next.authenticate && !AuthService.isLoggedIn()) {
                $location.path('/login');
            }
        });

        $rootScope.go = function ( path ) {
            $location.path( path );
        };
    });

