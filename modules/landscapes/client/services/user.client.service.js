(function () {
    'use strict';

    angular
        .module('landscapes.services')
        .factory('UserService', UserService);

    UserService.$inject = ['$resource'];

    function UserService($resource) {
        return $resource('/api/users/:id',
            {id: '@id', roleId: '@roleId', groupId:'@groupId'}, {
            update: {
                method: 'PUT'
            },
            addRole: {
                method: 'POST',
                url: '/api/users/:id/:roleId'
            },
            deleteRole: {
                method: 'Delete',
                url: '/api/users/:id/:roleId'
            },
            addGroup: {
                    method: 'POST',
                    url: '/api/users/:id/group/:groupId'
                },
            deleteGroup: {
                    method: 'Delete',
                    url: '/api/users/:id/group/:groupId'
                }
        });
    }
})();
