

(function () {
    'use strict';

    angular
        .module('landscapes.services')
        .factory('RoleService', RoleService);

    RoleService.$inject = ['$resource'];

    function RoleService($resource) {
        return $resource('/api/roles/:id', {
            articleId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
})();

