'use strict';

angular.module('landscapesApp')
    .factory('UserService', function LandscapeService($location, $rootScope, User) {
        return {
            update: function (id, user, callback) {
                var cb = callback || angular.noop;

                return User.update({id: id}, user,
                    function (data) {
                        return cb(data);
                    },
                    function (err) {
                        return cb(err);
                    }
                ).$promise;
            }
        }
    });


angular.module('landscapesApp')
    .factory('User', function ($resource) {
        return $resource('/api/users/:id', {
            id: '@id'
        }, {
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET',
                params: {
                    id:'me'
                }
            }
        });
    }
);
