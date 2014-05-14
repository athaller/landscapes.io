'use strict';

angular.module('landscapesApp')
    .controller('LandscapesCtrl', function ($scope, $http, $location) {

        $http.get('/api/landscapes')
            .success(function(data, status) {
                $scope.landscapes = data;
                console.log(data);
                console.log(status);
            })
            .error(function(data){
                console.log(data);
            });

        $scope.go = function ( path ) {
            console.log(path);
            $location.path( path );
        };
    }
);