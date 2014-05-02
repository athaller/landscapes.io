'use strict';

angular.module('seahawkApp')
    .controller('MainCtrl', function ($scope, $http, $location) {
        $http.get('/api/awesomeThings').success(function(awesomeThings) {
            $scope.awesomeThings = awesomeThings;
            console.log(awesomeThings)
        });
        $scope.go = function ( path ) {
            console.log(path);
            $location.path( path );
        }
  });