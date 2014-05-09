'use strict';

angular.module('landscapesApp')
    .controller('DeployCtrl', function ($scope, $http, $location, $routeParams) {

        console.log($routeParams.id)

        $http.get('/api/landscapes/' + $routeParams.id)
            .success(function(data, status) {
                $scope.landscape = data;
                console.log(data)
                console.log(status)
            })
            .error(function(data){
                console.log(data)
            });


        $scope.deployment = {location:1, flavor:1};
        $scope.errors = {};

        $scope.go = function ( path ) {
            console.log(path);
            $location.path( path );
        };

        $scope.deploy = function(form){

            var json = {};

            $http.get('/api/aws-deploy')
                .success(function(err, deployResultMsg) {
                    if(err){
                        console.log('err: ' + JSON.stringify(err));
                    }
                    else {
                        $scope.deployResultMsg = deployResultMsg;
                        console.log(deployResultMsg)
                        $location.path('/?msg=' + JSON.stringify(deployResultMsg));
                    }
                })
        };
  });