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

                var adminRoles = _.find(user.roles,function(role){return role.name == 'admin'});
                if(adminRoles){
                    return true;
                }else{
                    var found =false;
                    _.each(user.roles, function(role,key){
                        _.each(role.permissions, function(p,key){
                            if(p.value === permission){
                                found=true;
                            }
                        });
                    });

                    return found;
                }




                /*

                 _.each(user.roles, function(value, key){
                 if(value.name === 'admin')
                 {
                 return true;
                 }else if(value.permissions.value === permission){
                 return true;
                 }else{
                 //check groups

                 return false;

                 }


                 });



                if(landscapeId) {
                    _.each(user.permissions, function (e, i) {
                        if (e[landscapeId]) {
                            if (_.contains(e[landscapeId], permission)) {
                                found = true;
                            }
                        }
                    });
                } else {
                    _.each(user.permissions, function (e, i) {
                        var p = _.values(e)[0];
                        if(_.contains(p, permission)) {
                            found = true;
                        }
                    });
                }
                */

            }

    }
    }
})();
