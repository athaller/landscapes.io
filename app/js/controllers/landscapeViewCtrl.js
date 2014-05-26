'use strict';

angular.module('landscapesApp')
    .controller('LandscapeViewCtrl', function ($scope, $http, $location, $routeParams, LandscapeService) {
        $scope.isArray = angular.isArray;

        $scope.menu = [
            'Overview',
            'Template',
            'Flavors',
            'History'
        ];

        $scope.selected = $scope.menu[0];

        $scope.buttonClick = function(text){
            $scope.selected = text;
            console.log($scope.selected)
        };

        $scope.resourcesKeys = [];
        $scope.parametersKeys = [];
        $scope.mappingsKeys = [];

        LandscapeService.retrieve($routeParams.id)
            .then(function(landscape) {
                $scope.landscape = landscape;
                $scope.template = JSON.parse($scope.landscape.cloudFormationTemplate);
                $scope.template.parametersLength = $scope.template.Parameters.length;

                $scope.resourcesKeys = Object.keys($scope.template.Resources)
                $scope.parametersKeys = Object.keys($scope.template.Parameters)
                $scope.mappingsKeys = Object.keys($scope.template.Mappings)

            })
            .catch(function(err) {
                err = err.data;
                console.log(err)
            });

        // TO DO: DeploymentService.retrieveAll
        $http.get('/api/landscapes/' + $routeParams.id + '/deployments')
            .success(function(data, status) {
                $scope.deployments = data;
                console.log('deployments: ' + data.length);
            })
            .error(function(data){
                console.log(data);
                console.log(status);
            }
        );

        $scope.newWindow = function (path){
            window.open(path, '_blank');
        };

        $scope.addFlavor =function(){
            $scope.flavors.push({title: 'PROD', content: 'Production'});
        };


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

    console.log('froglips' + $scope.deployments);

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