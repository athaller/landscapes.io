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
    .controller('ListLandscapeDeployments', function ($scope, $http, $routeParams, DeploymentService) {

        // TO DO: poll AWS for CloudFormation events by isOpenIndex

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