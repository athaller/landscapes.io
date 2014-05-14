'use strict';

// https://docs.angularjs.org/api/ngResource/service/$resource

angular.module('landscapesApp')
    .factory('DeploymentService', function DeploymentService($location, $rootScope, Deployment) {
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
            }
        };
    });

angular.module('landscapesApp')
    .factory('Deployment', function ($resource) {
        return $resource('/api/deployments/:id', {
            id: '@id'
        }, {
            update: {
                method: 'PUT',
                params: {}
            }
        });
    });