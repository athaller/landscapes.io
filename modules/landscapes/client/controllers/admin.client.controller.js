(function () {
    'use strict';

    angular
        .module('landscapes')
        .controller('AdminController', AdminController);

    AdminController.$inject = ['$scope', '$state','lodash','LandscapesService','UserService', 'RoleService','GroupService','PermissionService','CloudAccountService', 'AppSettingsService','GlobalTagService', 'Authentication'];

    function AdminController($scope, $state, lodash, LandscapesService, UserService, RoleService, GroupService, PermissionService,CloudAccountService, AppSettingsService, GlobalTagService, Authentication) {


        var vm = this;

        vm.menu = [
            'Users',
            'Roles',
            'Groups',
            'Global Tags',
            'Accounts',
            'AppSettings'
        ];

        vm.selected = vm.menu[5];

        vm.buttonClick = function(text){
            vm.selected = text;
        };

        vm.errors = {};

        vm.landscapes = LandscapesService.query();

        vm.permissions = PermissionService.retrieveAll();

        vm.roles = RoleService.query();

        vm.globalTags = GlobalTagService.query();

        GroupService.retrieve()
            .then(function(data){
                vm.groups = data;
                vm.setUserGroups(function() {
                   console.log('setUserGroups');
                });
            });

        CloudAccountService.retrieve()
            .then(function(data){
                vm.accounts = data;
            });

        AppSettingsService.retrieve()
            .then(function(data){
                vm.appSettings = data;
            });

        vm.setUserGroups = function(callback) {
            vm.users = [];

            GroupService.retrieve()
                .then(function(groups) {
                    vm.groups = groups;

                    UserService.query()
                        .$promise.then(function(users) {
                            vm.users = users;
                            for (var i = 0; i < vm.groups.length; i++) {
                                var group = vm.groups[i];

                                for (var q = 0; q < vm.users.length; q++) {
                                    var usr = vm.users[q];

                                    if (lodash.indexOf(group.users, usr._id) >-1 ) {
                                        vm.users[q].groups.push(group.name);
                                    }
                                }
                            }
                        }
                    );
                }
            );
            if(callback) callback();

        }

        $scope.setUserGroups = vm.setUserGroups; // Tmp BACK
    };
})();
