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
    .controller('CreateLandscapeCtrl', function ($scope, $upload, LandscapeService, ValidationService, $http, $location, $routeParams, $filter) {
        $scope.landscape = {'version':'1.0', 'imageUri': 'images/AWS-CF-Icon.png'};
        $scope.errors = {};
        $scope.selectFile = true;
        $scope.templateSelected = false;

        $scope.toggleUploadNewImage = function() {
            $scope.showUploadNewImage = !$scope.showUploadNewImage;
            $scope.imageError = false;
        };

        $scope.resetSelectCloudFormationTemplatePanel = function (form){
            if($scope.landscape.description == JSON.parse($scope.landscape.cloudFormationTemplate).Description){
                $scope.landscape.description = undefined;
            }
            $scope.landscape.cloudFormationTemplate = undefined;
            $scope.templateSelected = false;
            form['template'].$setValidity('required', false);
            form['template'].$setValidity('json', true);
        };

        $scope.createNewLandscape = function(form) {
            $scope.submitted = true;

            if($scope.landscape.cloudFormationTemplate === undefined || $scope.templateSelected === false) {
                form.$valid = false;
            } else {
                var obj = ValidationService.tryParseJSON($scope.landscape.cloudFormationTemplate);
                if (!obj) {
                    form.$valid = false;
                    form['template'].$setValidity('json', false);
                    console.log("form['template']: " + JSON.stringify(form['template']))
                }
            }

            if(form.$valid) {
                console.log('form.$valid');
                console.log($scope.landscape);

                LandscapeService.create({
                    name: $scope.landscape.name,
                    version: $scope.landscape.version,
                    imageUri: $scope.landscape.imageUri,
                    cloudFormationTemplate: $scope.landscape.cloudFormationTemplate,
                    infoLink: $scope.landscape.infoLink,
                    infoLinkText: $scope.landscape.infoLinkText,
                    description: $scope.landscape.description
                })
                    .then( function() {
                        $location.path('/');
                    })
                    .catch( function(err) {
                        err = err.data;
                        console.log(err)

                        $scope.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function(error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.message;
                        });
                    });
            } else {
                console.log('form.$invalid: ' + JSON.stringify(form.$error));
            }
        };

        $scope.onImageSelect = function($files) {
            $scope.imageError = false;

            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: '/api/upload/image',
                    method: 'POST',
                    withCredentials: true,
                    data: {myObj: $scope.myModelObj},
                    file: file
                })
                    .success(function (data, status, headers, config) {
                        data = JSON.parse($filter('json')(data));
                        $scope.landscape.imageUri = data.imageUri;
                        $scope.imageSelected = true;
                        $scope.showUploadNewImage = false;
                        $scope.form.$dirty = true;
                    })
                    .error(function(err, status, headers){
                        if(status == 400) {
                            $scope.imageError = err.msg || err;
                            console.log(err);
                        } else if(status == 500) {
                            $scope.imageError = '500 (Internal Server Error)';
                            console.log(err);
                        }
                    }
                );
            }
        };

        $scope.onFileSelect = function($files, form) {
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: '/api/upload/template',
                    method: 'POST',
                    withCredentials: true,
                    data: {myObj: $scope.myModelObj},
                    file: file
                })
                    .success(function (data, status, headers, config) {
                        $scope.landscape.cloudFormationTemplate = $filter('json')(data);
                        $scope.templateSelected = true;
                        form['template'].$setValidity('required', true);
                        form['template'].$setValidity('json', true);
                        form.template.$valid = true;
                        form.template.$invalid = false;

                        var templateDescription = JSON.parse($scope.landscape.cloudFormationTemplate).Description;

                        console.log(templateDescription);
                        console.log($scope.landscape.description);
                        $scope.landscape.description = $scope.landscape.description || templateDescription;
                    })
                    .error(function(err){
                        console.log(err);
                    });
            }
        };
    });