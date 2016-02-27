// Copyright 2014 OpenWhere, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/*jshint -W069 */
(function () {
    'use strict';

    angular
        .module('landscapes')
        .controller('LandscapesListController', LandscapesListController);

    LandscapesListController.$inject = ['$scope', '$rootScope', '$state','LandscapesService','PermissionService','Authentication'];

    function LandscapesListController($scope, $rootScope, $state,LandscapesService,PermissionService,Authentication) {
        var vm = this;
        vm.currentUser = Authentication.user;
        vm.hasPermission = PermissionService.hasPermission;
        vm.landscapes = LandscapesService.query();
        for(var i = 0; i <  vm.landscapes.length; i++) {
            if( vm.landscapes[i]['description'].length > 160){
                vm.landscapes[i]['description'] =  vm.landscapes[i]['description'].substring(0,157) + '...';
            }

            // AH - why random string ?
            vm.landscapes[i]['imageUri'] = '/api/landscapes/' +  vm.landscapes[i]._id + '/image' + $rootScope.randomQueryString();
        }
    }
})();



