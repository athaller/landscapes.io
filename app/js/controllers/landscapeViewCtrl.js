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
    .controller('LandscapeViewCtrl', function ($scope, $route, $http, $location, $routeParams, LandscapeService) {
        $scope.isArray = angular.isArray;

        $scope.menu = [
            'Overview',
            'Template'
            // 'Flavors',
            // 'History'
        ];

        $scope.selected = $scope.menu[0];

        $scope.buttonClick = function(text){
            $scope.selected = text;
            console.log($scope.selected)
        };

        $scope.resourcesKeys = [];
        $scope.parametersKeys = [];
        $scope.mappingsKeys = [];

        LandscapeService.retrieve($routeParams.id)
            .then(function(landscape) {
                $scope.landscape = landscape;
                $scope.landscape.createdBy = landscape.createdBy;
                console.log( $scope.landscape.createdBy);

                $scope.template = JSON.parse($scope.landscape.cloudFormationTemplate);
                $scope.template.parametersLength = $scope.template.Parameters.length;

                $scope.resourcesKeys = Object.keys($scope.template.Resources)
                $scope.parametersKeys = Object.keys($scope.template.Parameters)
                $scope.mappingsKeys = Object.keys($scope.template.Mappings)

            })
            .catch(function(err) {
                err = err.data;
                console.log(err)
            });

        $scope.newWindow = function (path){
            window.open(path, '_blank');
        };

        $scope.addFlavor =function(){
            $scope.flavors.push({title: 'PROD', content: 'Production'});
        };


        $scope.flavors = [
            { title: 'DEV', content: 'Development' },
            { title: 'TEST', content: 'Development' }
        ];

        $scope.items = [{key:'Apple', value:'One hundred'}, {key:'Banana', value:'Two thousand'}, {key:'Cherry', value:'Three million'}];

        $scope.addItem = function() {
            var newItemNo = $scope.items.length + 1;
            $scope.items.push({key:'Date', value:'Four billion'});
        };

        $scope.deleteItem = function() {
            $scope.items.pop();
        };
    }
);

angular.module('landscapesApp')
    .controller('DeploymentsCtrl', function ($scope, $http, $routeParams, DeploymentService) {

        $scope.addNote = false;
        $scope.newNote = {};
        $scope.deployments = [];

        $scope.loadDeployments = function(isOpenIndex) {
            //console.log(isOpenIndex)
            DeploymentService.retrieveForLandscape($routeParams.id,
                function (err, deployments) {
                    if (err) {
                        err = err.data;
                        console.log(err)
                    } else {
                        $scope.deployments = deployments;
                        if(isOpenIndex !== undefined) {
                            $scope.deployments[isOpenIndex].open = true;
                        }
                    }
                });
        };

        $scope.loadDeployments();

        $scope.cancelNote = function(index) {
            $scope.newNote.text = undefined;
            $scope.addNote = false;
            $scope.loadDeployments(index);
        }

        $scope.saveNote = function(id, index) {
            console.log('saveNote: ' + id);
            console.log($scope.newNote.text);

            if($scope.newNote.text !== undefined) {
                var newNote = { text: $scope.newNote.text };
                DeploymentService.update(id, { _id: id, note: newNote},
                    function (err, data) {
                        if (err) {
                            err = err.data || err;
                            console.log(err);
                        } else {
                            $scope.addNote = false;
                        }
                    });
            }
            $scope.newNote.text = undefined;
            $scope.addNote = false;
            $scope.loadDeployments(index);
        };
    });