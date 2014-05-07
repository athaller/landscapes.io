'use strict';

angular.module('landscapesApp')
    .controller('DeployCtrl', function ($scope, $http, $location) {

        $scope.deployment = {type:"Cyber Warfare Test Range", location:1};
        $scope.errors = {};

        $scope.go = function ( path ) {
            console.log(path);
            $location.path( path );
        };

        $scope.deploy = function(form){

            var json = {};

            $http.get('/api/awsDeploy')
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