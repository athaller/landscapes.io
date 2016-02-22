(function () {
    'use strict';

    angular
        .module('landscapes.services')
        .factory('PermissionService', PermissionService);

    PermissionService.$inject = ['lodash'];

    function PermissionService() {

        var permissions = [
            {value: 'C', name: 'Create', displayOrder: '10'},
            {value: 'R', name: 'Read', displayOrder: '20'},
            {value: 'U', name: 'Update', displayOrder: '30'},
            {value: 'D', name: 'Delete', displayOrder: '40'},
            {value: 'X', name: 'Execute', displayOrder: '80'},
            {value: 'F', name: 'Full Control', displayOrder: '90'}
        ];

        return {
            retrieveAll: function (callback) {
                return permissions;
            },
            hasPermission :  function(user, permission, landscapeId) {
                if(!user) {
                    return false;
                };
                if(user.roles && user.roles.length > 0 && user.roles[0] != null) {
                    var adminRoles = _.find(user.roles, function (role) {
                        return role.name == 'admin'
                    });
                    if (adminRoles) {
                        return true;
                    } else {
                        var found = false;
                        _.each(user.roles, function (role, key) {
                            _.each(role.permissions, function (p, key) {
                                if (p.value === permission) {
                                    return true;
                                }
                            });
                        });
                    }
                }
                // check group permisions
                if(landscapeId){
                    _.each(user.groups, function(group, key){    //check each group
                        _.each(group.permissions, function (p, key) { //check permission
                            if (p.value === permission) {
                                _.each(group.landscapes, function (l, key) {
                                    if (l == landscapeId) {
                                        return true;
                                    }
                                });


                            }
                        });

                    })
                }
                return false;



            }

    }
    }
})();
