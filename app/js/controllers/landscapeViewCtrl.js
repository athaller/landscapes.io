'use strict';

angular.module('landscapesApp')
    .controller('LandscapeViewCtrl', function ($scope, $http, $location, $routeParams) {

        $http.get('/api/landscapes/' + $routeParams.id)
            .success(function(data, status) {
                $scope.landscape = data;
            })
            .error(function(data){
                console.log(data);
            }
        );

        $http.get('/api/landscapes/' + $routeParams.id + '/deployments')
            .success(function(data, status) {
                $scope.deployments = data;
                console.log(data);
            })
            .error(function(data){
                console.log(data);
                console.log(status);
            }
        );

        $scope.newWindow = function (path){
            window.open(path, '_blank');
        }

        $scope.go = function ( path ) {
            console.log(path);
//            window.location = path;
            $location.path( path );
        };

        $scope.addFlavor =function(){
            $scope.flavors.push({title: 'PROD', content: 'Production'});
        }


        $scope.flavors = [
            {
                title: 'DEV',
                content: 'Development'
            },
            {
                title: 'TEST',
                content: 'Development'
            }
        ];
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