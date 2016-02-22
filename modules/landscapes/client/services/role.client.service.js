

(function () {
    'use strict';

    angular
        .module('landscapes.services')
        .factory('RoleService', RoleService);

    RoleService.$inject = ['$resource'];

    function RoleService($resource) {
        return $resource('/api/roles/:id', {
            id: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
})();

