'use strict';

angular.module('landscapesApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'angularFileUpload'
])
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                redirectTo: '/landscapes'
            })
            .when('/landscapes', {
                templateUrl: 'partials/landscapes',
                controller: 'LandscapesCtrl'
            })
            .when('/admin', {
                templateUrl: 'partials/admin',
                controller: 'AdminCtrl'
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
            .when('/deploy/:id', {
                templateUrl: 'partials/deploy',
                controller: 'DeployCtrl',
                authenticate: false             // DEV ONLY!
            })
            .when('/landscapes/:id', {
                templateUrl: 'partials/landscape-view',
                controller: 'LandscapeViewCtrl',
                authenticate: false             // DEV ONLY!
            })
            .when('/landscapes/:id/edit', {
                templateUrl: 'partials/landscape-edit',
                controller: 'LandscapeEditCtrl',
                authenticate: false             // DEV ONLY!
            })
            .when('/landscapes/:id/history', {
                templateUrl: 'partials/landscape-history',
                controller: 'LandscapeViewCtrl',
                authenticate: true
            })
            .when('/landscape/new', {
                templateUrl: 'partials/landscape-new',
                controller: 'LandscapeNewCtrl',
                authenticate: false             // DEV ONLY!
            })
            .otherwise({
                redirectTo: '/landscapes'
            });

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

