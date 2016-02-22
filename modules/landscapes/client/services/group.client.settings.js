(function () {
    'use strict';

    angular
        .module('landscapes.services')
        .factory('GroupService', GroupService);

    GroupService.$inject = ['$resource'];

    function GroupService($resource) {
        return $resource('/api/groups/:id', {
            id: '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
})();
