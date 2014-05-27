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
            },
            retrieve: function(id, callback) {
                var cb = callback || angular.noop;

                return Landscape.get({id:id},
                    function(landscape) {
                        return cb(landscape);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            },
            update: function(id, landscape, callback) {
                var cb = callback || angular.noop;

                return Landscape.update({id:id}, landscape,
                    function(data) {
                        return cb(data);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            },
            delete: function(id, callback) {
                var cb = callback || angular.noop;

                console.log('delete Landscape: ' + id)

                return Landscape.remove({id: id},
                    function(data) {
                        return cb(data);
                    },
                    function(err) {
                        return cb(err);
                    }
                ).$promise;
            }
        };
    });

angular.module('landscapesApp')
    .factory('Landscape', function ($resource) {
        return $resource('/api/landscapes/:id', {
            id: '@id'
        }, {
            update: { method: 'PUT' }
        });
    });