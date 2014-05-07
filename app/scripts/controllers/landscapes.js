'use strict';

angular.module('landscapesApp')
    .controller('LandscapesCtrl', function ($scope, $http, $location, $routeParams) {

        console.log($routeParams.landscapeId)

        $http.get('/api/landscapes/' + $routeParams.landscapeId)
            .success(function(data, status) {
                $scope.landscape = data;
                console.log(data)
                console.log(status)
            })
            .error(function(data){
                console.log(data)
            });

        $http.get('/api/landscapes/' + $routeParams.landscapeId + '/deployments')
            .success(function(data, status) {

                $scope.deployments = data;
                console.log(data)
                console.log(status)
            })
            .error(function(data){
                console.log(data)
            });

        $scope.go = function ( path ) {
            console.log(path);
            $location.path( path );
        }
  });