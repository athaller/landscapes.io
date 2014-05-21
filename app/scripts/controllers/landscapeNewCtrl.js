'use strict';

angular.module('landscapesApp')
    .controller('LandscapeNewCtrl', function ($scope, $upload, LandscapeService, $http, $location, $routeParams, $filter) {
        $scope.landscape = {'version':'1.0', 'imageUri': 'images/ow/sf01.png'};
        $scope.errors = {};
        $scope.selectFile = true;
        $scope.templateSelected = false;

        console.log($scope.landscape);

        $scope.resetSelectTemplateForm = function (){
            $scope.templateSelected = !$scope.templateSelected;
        }

        $scope.createNewLandscape = function(form) {
            $scope.submitted = true;

            // validate cloudFormationTemplate here?

            if($scope.landscape.cloudFormationTemplate === undefined || $scope.templateSelected === false) {
                form.$valid = false;
            }

            if(form.$valid) {
                console.log('form.$valid');

                console.log ($scope.landscape);

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
                console.log(JSON.stringify(form.$error));
            }
        };

        $scope.onImageSelect = function($files) {
            console.log('onImageSelect()');
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
                    .error(function(err){
                        console.log(err);
                    });
            }
        }

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