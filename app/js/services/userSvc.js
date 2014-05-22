'use strict';

// https://docs.angularjs.org/api/ngResource/service/$resource

angular.module('landscapesApp')
    .factory('User', function ($resource) {
        return $resource('/api/users/:id', {
            id: '@id'
        }, {
            update: {
                method: 'PUT',
                params: {}
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
