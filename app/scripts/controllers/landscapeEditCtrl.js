'use strict';

angular.module('landscapesApp')
    .controller('LandscapeEditCtrl',
    function ($scope,
              $upload, $filter,
              $location,
              $routeParams,
              ValidationService,
              LandscapeService) {

        $scope.showUploadNewImage = false;
        $scope.showUploadNewTemplate = false;

        $scope.go = function ( path ) {
            $location.path( path );
        };

        $scope.incrementVersion = function() {
            $scope.landscape.version = (Number($scope.landscape.version) + 0.1).toFixed(1);
            $scope.form.$dirty = true;
        };

        $scope.deleteLandscape = function(){
            LandscapeService.delete($routeParams.id)
                .then(function(data) {
                    console.log(data)
                    // show modal?
                    $location.path('/');
                })
                .catch(function(err) {
                    err = err.data;
                    console.log(err)
                });

        };

        LandscapeService.retrieve($routeParams.id)
            .then(function(landscape) {
                $scope.landscape = landscape
            })
            .catch(function(err) {
                err = err.data;
                console.log(err)
            });

        $scope.updateLandscape = function(form) {
            $scope.submitted = true;

            console.log($scope.landscape.cloudFormationTemplate);
            // validate cloudFormationTemplate here?

            if ($scope.landscape.cloudFormationTemplate === undefined || $scope.templateSelected === false) {
                console.log($scope.templateSelected)
                form.$valid = false;
            }

//            if(!ValidationService.tryParseJSON($scope.landscape.cloudFormationTemplate)) {
//                console.log("tryParseJSON")
//                form.$valid = false;
//            }

            if(form.$valid) {
                console.log('form.$valid');

                console.log ($scope.landscape);

                LandscapeService.update($routeParams.id, {
                    name: $scope.landscape.name,
                    version: $scope.landscape.version,
                    imageUri: $scope.landscape.imageUri,
                    cloudFormationTemplate: $scope.landscape.cloudFormationTemplate,
                    infoLink: $scope.landscape.infoLink,
                    infoLinkText: $scope.landscape.infoLinkText,
                    description: $scope.landscape.description
                })
                    .then( function() {
                        $location.path('/landscapes/' + $routeParams.id)
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

        $scope.readFile = function() {
            console.log('readFile()');
        }

        $scope.onFileSelect = function($files) {
            console.log('onFileSelect()');
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
                    })
                    .error(function(err){
                        console.log(err);
                    });
                //.then(success, error, progress);
                //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
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

    }
);

function AccordionDemoCtrl($scope) {
    $scope.oneAtATime = true;

    $scope.items = [{key:'Apple', value:'One hundred'}, {key:'Banana', value:'Two thousand'}, {key:'Cherry', value:'Three million'}];

    $scope.addItem = function() {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push({key:'Date', value:'Four billion'});
    };

    $scope.deleteItem = function() {
        $scope.items.pop();
    };

    $scope.status = {
        isFirstOpen: false,
        isFirstDisabled: false
    };
}