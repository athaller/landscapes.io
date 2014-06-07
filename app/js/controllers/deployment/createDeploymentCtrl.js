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
    .controller('CreateDeploymentCtrl', function ($scope, $http, $location, $routeParams, DeploymentService) {

        $scope.deployment = {location:'US East (Northern Virginia)', flavor:'None'};
        $scope.errors = {};
        $scope.keys = [];

        $http.get('/api/landscapes/' + $routeParams.id)
            .success(function(data, status) {
                $scope.landscape = data;
                $scope.template = JSON.parse($scope.landscape.cloudFormationTemplate);

                $scope.keys = Object.keys($scope.template.Parameters);

                console.log('PARAMETERS...')
                for (var i = 0; i < $scope.keys.length; i++){
                    console.log ($scope.keys[i] + ': ' + JSON.stringify($scope.template.Parameters[$scope.keys[i]]));
                    $scope.deployment[$scope.keys[i]] = '';

                    // add AllowedValues
                    if($scope.template.Parameters[$scope.keys[i]].hasOwnProperty('AllowedValues')){
                        $scope.deployment[$scope.keys[i]].AllowedValues = $scope.template.Parameters[$scope.keys[i]].AllowedValues;
                        console.log('AllowedValues: ' + $scope.template.Parameters[$scope.keys[i]].AllowedValues);
                    }

                    // set Default
                    if($scope.template.Parameters[$scope.keys[i]].hasOwnProperty('Default')) {
                        $scope.deployment[$scope.keys[i]] = $scope.template.Parameters[$scope.keys[i]].Default;
                        console.log('Default: ' + $scope.template.Parameters[$scope.keys[i]].Default);
                    }
                }
            })
            .error(function(data){
                console.log(data);
            });

        $scope.createNewDeployment = function(form){
            $scope.submitted = true;
            // console.log('createNewDeployment: ' + JSON.stringify($scope.deployment));

            $scope.cloudFormationParameters = {};

            for (var i = 0; i < $scope.keys.length; i++) {
                $scope.cloudFormationParameters[$scope.keys[i]] = $scope.deployment[$scope.keys[i]];
            };

            console.log (JSON.stringify($scope.cloudFormationParameters));

            if(form.$valid) {
                console.log('form.$valid');

                var cleanStackName = $scope.deployment.stackName.replace(/ /g, '-');
                console.log(cleanStackName);


                DeploymentService.create({
                    landscapeId: $routeParams.id,
                    stackName: cleanStackName,
                    description: $scope.deployment.description,
                    location: $scope.deployment.location,
                    flavor: $scope.deployment.flavor,
                    billingCode: $scope.deployment.billingCode,
                    cloudFormationParameters: $scope.cloudFormationParameters
                })
                    .then(function(data) {
                        console.log(JSON.stringify(data));
                        $location.path('/landscapes/'+ $routeParams.id);
                    })
                    .catch(function(err) {
                        console.log(JSON.stringify(err));

                        err = err.data;
                        $scope.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function(error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.message;
                        });
                    }
                );
            }
        };
    });