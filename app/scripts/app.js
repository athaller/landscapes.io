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
                authenticate: true
            })
            .when('/landscapes/:id/edit', {
                templateUrl: 'partials/landscape-edit',
                controller: 'LandscapeEditCtrl',
                authenticate: true
            })
            .when('/landscapes/:id/history', {
                templateUrl: 'partials/landscape-history',
                controller: 'LandscapeViewCtrl',
                authenticate: true
            })
            .when('/landscape/new', {
                templateUrl: 'partials/landscape-new',
                controller: 'LandscapeNewCtrl',
                authenticate: false
            })
            .otherwise({
                redirectTo: '/'
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
    .run(function ($rootScope, $location, Auth) {
        $rootScope.$on('$routeChangeStart', function (event, next) {
            if (next.authenticate && !Auth.isLoggedIn()) {
                $location.path('/login');
            }
        });
    });