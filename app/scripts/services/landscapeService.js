'use strict';

// https://docs.angularjs.org/api/ngResource/service/$resource

angular.module('landscapesApp')
    .factory('LandscapeService', function LandscapeService($location, $rootScope, Landscape) {
        return {
            create: function(landscape, callback) {
                var cb = callback || angular.noop;

                return Landscape.save(landscape,
                    function(landscape) {
                        return cb(landscape);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            }
        };
    }
);

angular.module('landscapesApp')
    .factory('Landscape', function ($resource) {
        return $resource('/api/landscapes/:id', {
            id: '@id'
        }, {
            update: {
                method: 'PUT',
                params: {}
            }
        });
    });