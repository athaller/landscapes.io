'use strict';

// https://bitbucket.org/danhunsaker/angular-dynamic-forms

angular.module('landscapesApp')
    .controller('DeployCtrl', function ($scope, $http, $location, $routeParams, DeploymentService) {

        $scope.parameters = {'last': 'sandwich'}

        // setup URL for dynamic-form... this is not working
        $scope.formTemplate = {
            "first": {
                "type": "text",
                "label": "First Name"
            },
            "last": {
                "type": "text",
                "label": "Last Name"
            }
        };

// https://bitbucket.org/danhunsaker/angular-dynamic-forms/src

        $http.get('/api/landscapes/' + $routeParams.id)
            .success(function(data, status) {
                $scope.landscape = data;
                console.log(data);

                // introspect json and get parameters
                var cft = JSON.parse(data.cloudFormationTemplate);

                console.log(cft.Parameters);
                var keys = Object.keys(cft.Parameters);

                for (var i=0;i<keys.length;i++){
                    console.log(cft.Parameters[keys[i]]);
                    $scope.formTemplate[keys[i]] = {"type": "text", "label": keys[i], "model": keys[i]}
                }

                console.log($scope.formTemplate)

            })
            .error(function(data){
                console.log(data);
            });

//        $scope.formTemplate["test"] = {"type": "text", "label": "Frog Lips"}

        $scope.deployment = {location:'US East (Northern Virginia)', flavor:'None'};
        $scope.errors = {};

        $scope.createNewDeployment = function(form){

            $scope.formTemplate["test"] = {"type": "text", "label": "Matthew Test"};
            console.log($scope.formTemplate)
            return;

            $scope.submitted = true;

            console.log(form)

            console.log('createNewDeployment')

            if(form.$valid) {
                console.log('form.$valid');

                var cleanStackName = $scope.deployment.stackName.replace(' ', '-');
                console.log(cleanStackName);

                DeploymentService.create({
                    landscapeId: $routeParams.id,
                    stackName: cleanStackName,
                    description: $scope.deployment.description,
                    location: $scope.deployment.location,
                    flavor: $scope.deployment.flavor,
                    billingCode: $scope.deployment.billingCode
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
            }
        };

        $scope.go = function ( path ) {
            console.log(path);
            $location.path( path );
        };
    });