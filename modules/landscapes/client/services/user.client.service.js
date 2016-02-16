(function () {
    'use strict';

    angular
        .module('landscapes.services')
        .factory('UserService', UserService);

    UserService.$inject = ['$resource'];

    function UserService($resource) {
        return $resource('/api/users/:id', {
            id: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
})();
