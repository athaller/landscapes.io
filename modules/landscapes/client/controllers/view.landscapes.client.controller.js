/**
 * Created by aheifetz on 2/7/2016.
 */

(function () {
    'use strict';

    angular
        .module('landscapes')
        .controller('LandscapesViewController', LandscapesViewController);

    LandscapesViewController.$inject = ['$scope', '$state', 'Upload', 'landscapesResolve', 'ValidationService','PermissionService', 'Authentication'];

    function LandscapesViewController($scope, $state, Upload, landscape, ValidationService, PermissionService, Authentication) {
        var vm = this;
        vm.currentUser = Authentication.user;
        vm.hasPermission = PermissionService.hasPermission;
        vm.landscape = landscape;
        vm.error = null;

        $scope.menu = [
            'Overview',
            'Template'
            // 'Flavors',
            // 'History'
        ];

        $scope.selected = $scope.menu[0];

        $scope.isSelect = function(pannel){
            return($scope.selected === pannel );
        };

        $scope.buttonClick = function(text){
            $scope.selected = text;
            console.log($scope.selected ==='Template');
        };

        vm.resourcesKeys = [];
        vm.parametersKeys = [];
        vm.mappingsKeys = [];
        vm.template = JSON.parse(vm.landscape.cloudFormationTemplate);
        vm.template.parametersLength = vm.template.Parameters.length;

        vm.resourcesKeys = Object.keys(vm.template.Resources);
        vm.parametersKeys = Object.keys(vm.template.Parameters);
        vm.mappingsKeys = Object.keys(vm.template.Mappings);
    }

})();

