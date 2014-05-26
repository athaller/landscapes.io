'use strict';

angular.module('landscapesApp')
    .controller('LandscapeNewCtrl', function ($scope, $upload, LandscapeService, ValidationService, $http, $location, $routeParams, $filter) {
        $scope.landscape = {'version':'1.0', 'imageUri': 'images/AWS-CF-Icon.png'};
        $scope.errors = {};
        $scope.selectFile = true;
        $scope.templateSelected = false;

        $scope.toggleUploadNewImage = function() {
            $scope.showUploadNewImage = !$scope.showUploadNewImage;
            $scope.imageError = false;
        };

        $scope.resetSelectCloudFormationTemplatePanel = function (form){
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

//            var imageFileExtensions = ['png','jpg','jpeg'];
//            if(imageFileExtensions.indexOf(f.file.extension) === -1){
//                res.send(f.file.extension + ' is not a supported image format.'), 400
//            }

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
                    .error(function(err, status, headers){
                        if(status == 400) {
                            $scope.imageError = err.msg;
                            console.log(err);
                        } else if(status == 500) {
                            $scope.imageError = 'POST /api/upload/image --> 500 (Internal Server Error)';
                            console.log(err);
                        }
                    });
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
                    })
                    .error(function(err){
                        console.log(err);
                    });
            }
        };
    });