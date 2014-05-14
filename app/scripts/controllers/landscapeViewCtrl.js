'use strict';

angular.module('landscapesApp')
    .controller('LandscapeViewCtrl', function ($scope, $http, $location, $routeParams) {

        console.log($routeParams.id);

        $http.get('/api/landscapes/' + $routeParams.id)
            .success(function(data, status) {
                $scope.landscape = data;
                $scope.landscape.frog = 'lips';
                console.log(data);
                console.log(status);

            })
            .error(function(data){
                console.log(data);
            }
        );

        $http.get('/api/landscapes/' + $routeParams.id + '/deployments')
            .success(function(data, status) {

                $scope.deployments = data;
                console.log(data);
                console.log(status);
            })
            .error(function(data){
                console.log(data);
            }
        );

        $scope.go = function ( path ) {
            console.log(path);
            $location.path( path );
        };
    }
);

function AccordionDemoCtrl($scope) {
    $scope.oneAtATime = true;

    $scope.groups = [
        {
            title: 'DEV',
            content: 'Development'
        },
        {
            title: 'PROD',
            content: 'Production'
        }
    ];

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

    $scope.status1 = {};

    $scope.status2 = {};

    $scope.status3 = {};
}