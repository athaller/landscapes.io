'use strict';

angular.module('landscapesApp')
    .controller('LandscapeNewCtrl', function ($scope, $upload, LandscapeService, $http, $location, $routeParams, $filter) {
        $scope.landscape = {'version':'1.0'};
        $scope.errors = {};
        $scope.selectFile = true;
        $scope.templateSelected = false;

        console.log($scope.landscape);

        $scope.resetSelectTemplateForm = function (){
            $scope.templateSelected = !$scope.templateSelected;
        }

        $scope.createNewLandscape = function(form) {
            $scope.submitted = true;

            // console.log($scope.landscape.cloudFormationTemplate);
            // validate cloudFormationTemplate here?


            if($scope.landscape.cloudFormationTemplate === undefined || $scope.templateSelected === false) {
                form.$valid = false;
            }




            if(form.$valid) {
                console.log('form.$valid');


                LandscapeService.create({
                    name: $scope.landscape.name,
                    version: $scope.landscape.version,
                    imageUri: 'images/tech4.png',
                    cloudFormationTemplate: $scope.landscape.cloudFormationTemplate,
                    infoLink: $scope.landscape.infoLink,
                    description: $scope.landscape.description
                })
                    .then( function() {
                        $location.path('/');
                    })
                    .catch( function(err) {
                        err = err.data;
                        $scope.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function(error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.message;
                        });
                    });
            } else {
                console.log(JSON.stringify(form.$error));
            }
        };

        $scope.onFileSelect = function($files) {
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: '/api/upload/template',
                    method: 'POST',
                    withCredentials: true,
                    data: {myObj: $scope.myModelObj},
                    file: file
                })
                    .progress(function (evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                })
                    .success(function (data, status, headers, config) {
                        $scope.landscape.cloudFormationTemplate = $filter('json')(data);
                        $scope.templateSelected = true;
                });
                //.error(...)
                //.then(success, error, progress);
                //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
            }
        }
    });