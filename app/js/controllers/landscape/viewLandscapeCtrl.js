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

'use strict';

angular.module('landscapesApp')
    .controller('ViewLandscapeCtrl', function ($rootScope, $scope, $routeParams, AuthService, LandscapeService, UserService, PermissionService,  _) {
        $scope.isArray = angular.isArray;
        $scope._ = _;

        $scope.menu = [
            'Overview',
            'Template'
            // 'Flavors',
            // 'History'
        ];

        $scope.selected = $scope.menu[0];

        $scope.buttonClick = function(text){
            $scope.selected = text;
        };

        $scope.resourcesKeys = [];
        $scope.parametersKeys = [];
        $scope.mappingsKeys = [];

        LandscapeService
            .retrieve($routeParams.id)
            .then(function(landscape) {
                $scope.landscape = landscape;
                $scope.landscape.createdBy = landscape.createdBy;

                $scope.landscape.imageUri = '/api/landscapes/' + $scope.landscape._id + '/image' + $rootScope.randomQueryString();

                $scope.template = JSON.parse($scope.landscape.cloudFormationTemplate);
                $scope.template.parametersLength = $scope.template.Parameters.length;

                $scope.resourcesKeys = Object.keys($scope.template.Resources);
                $scope.parametersKeys = Object.keys($scope.template.Parameters);
                $scope.mappingsKeys = Object.keys($scope.template.Mappings);
            })
            .catch(function(err) {
                err = err.data || err;
                console.log(err)
            });

        $scope.newWindow = function (path){
            window.open(path, '_blank');
        };

        // WIP...
        $scope.addFlavor =function(){
            $scope.flavors.push({title: 'PROD', content: 'Production'});
        };
        $scope.flavors = [
            { title: 'DEV', content: 'Development' },
            { title: 'TEST', content: 'Development' }
        ];
        $scope.items = [
            {key:'Apple', value:'One hundred'}, {key:'Banana', value:'Two thousand'}, {key:'Cherry', value:'Three million'}
        ];
        $scope.addItem = function() {
            var newItemNo = $scope.items.length + 1;
            $scope.items.push({key:'Date', value:'Four billion'});
        };
        $scope.deleteItem = function() {
            $scope.items.pop();
        };
    }
);