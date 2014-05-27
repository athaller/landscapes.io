'use strict';

// https://docs.angularjs.org/api/ngResource/service/$resource

angular.module('landscapesApp')
    .factory('DeploymentService', function DeploymentService($location, $rootScope, Deployment, $http) {
        return {
            create: function(deployment, callback) {
                var cb = callback || angular.noop;

                return Deployment.save(deployment,
                    function(deployment) {
                        return cb(deployment);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            },
            retrieveForLandscape: function(id, callback) {
                var cb = callback || angular.noop;

                $http.get('/api/landscapes/' + id + '/deployments')
                    .success(function(deployments) {
                        return cb(null, deployments);
                    })
                    .error(function(err) {
                        return cb(err);
                    })
            },
            update: function(id, deployment, callback) {
                var cb = callback || angular.noop;

                $http.put('/api/deployments/' + id, deployment)
                    .success(function(data) {;
                        return cb(null, data);
                    })
                    .error(function(err) {
                        return cb(err);
                    })
            }
        };
    });

angular.module('landscapesApp')
    .factory('Deployment', function ($resource) {
        return $resource('/api/deployments/:id', {
            id: '@id'
        }, {
            update: { method: 'PUT' }
        });
    });