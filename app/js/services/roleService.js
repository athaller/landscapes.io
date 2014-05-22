angular.module('landscapesApp')
    .factory('RoleService', function RoleService($location, $rootScope, Landscape) {
        return {
            retrieveAll: function (callback) {
                var roles = ['user', 'editor', 'admin'];
                return roles;
            }
        }
    });

angular.module('landscapesApp')
    .factory('Role', function ($resource) {
        return $resource('/api/roles/:id', {
            id: '@id'
        }, {
            update: { method: 'PUT' }
        });
    });