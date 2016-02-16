(function () {
    'use strict';

    angular
        .module('landscapes')
        .controller('CreateDeploymentController', CreateDeploymentController);

    CreateDeploymentController.$inject = ['$scope', '$state','landscapesResolve', 'DeploymentService','GlobalTagService','CloudAccountService','PermissionService', 'ValidationService', 'Authentication'];

    function CreateDeploymentController($scope, $state, landscape, DeploymentService, GlobalTagService, CloudAccountService, PermissionService, ValidationService, Authentication) {

        var vm = this;
        vm.form = {};
        vm.landscapeId = $state.params.landscapeId;
        vm.deployment = { };
        vm.error = null;
        vm.keys = [];
        vm.accounts = [];
        vm.deployment = { };

        CloudAccountService.retrieve()
            .then(function(data){
                vm.accounts = data;
                if(data.length > 0) {
                    //why take the first - AH ?
                    vm.deployment.account = vm.accounts[0].id;
                    vm.deployment.location = vm.accounts[0].region;
                }
            });

        GlobalTagService.query().$promise
            .then(function(data){
                vm.globalTags = data;

                // set default values
                for(var i=0; i<vm.globalTags.length; i++) {
                    if(vm.globalTags[i].defaultValue) {
                        vm.deployment.tags[vm.globalTags[i].key] = vm.globalTags[i].defaultValue
                    }
                }
            });


        vm.landscape = landscape;
        vm.template = JSON.parse(vm.landscape.cloudFormationTemplate);

        vm.keys = Object.keys(vm.template.Parameters);

        console.log('PARAMETERS...')
         for (var i = 0; i < vm.keys.length; i++){
             console.log (vm.keys[i] + ': ' + JSON.stringify(vm.template.Parameters[vm.keys[i]]));
             vm.deployment[vm.keys[i]] = '';

                    // add AllowedValues
                    // This isn't used; the view uses $scope.template.Parameters.AllowedValues
                    //if($scope.template.Parameters[$scope.keys[i]].hasOwnProperty('AllowedValues')){
                    //    $scope.deployment[$scope.keys[i]].AllowedValues = $scope.template.Parameters[$scope.keys[i]].AllowedValues;
                    //    console.log('AllowedValues: ' + $scope.template.Parameters[$scope.keys[i]].AllowedValues);
                    //}

             // set Default
             if(vm.template.Parameters[vm.keys[i]].hasOwnProperty('Default')) {
                  vm.deployment[vm.keys[i]] = vm.template.Parameters[vm.keys[i]].Default;
                  console.log('Default: ' + vm.template.Parameters[vm.keys[i]].Default);
             }
         }

        vm.changeAccount = function() {
            for(var i = 0; i < vm.accounts.length; i++) {
                if(vm.accounts[i].id == vm.deployment.account) {
                    vm.deployment.location = vm.accounts[i].region;
                }
            }
        };


        vm.createNewDeployment = function(form){
            vm.submitted = true;
            vm.form = form;
            vm.cloudFormationParameters = {};

            for (var x = 0; x < vm.keys.length; x++) {
                vm.cloudFormationParameters[vm.keys[x]] = vm.deployment[vm.keys[x]];
            }

            // TO DO: set form.$invalid if required GlobalTag is empty

            if(!form.$valid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.deploymentForm');
                return false;
            }

                var cleanStackName = vm.deployment.stackName.replace(/ /g, '-');

                if(vm.accounts.length !== 0) {
                    for(var i = 0; i < vm.accounts.length; i++) {
                        if(vm.accounts[i].id === vm.deployment.account) {
                            vm.deployment.accessKeyId = vm.accounts[i].accessKeyId;
                            vm.deployment.secretAccessKey = vm.accounts[i].secretAccessKey;
                        }
                    }
                }

                DeploymentService.create({
                    landscapeId: vm.landscapeId,
                    stackName: cleanStackName,
                    description: vm.deployment.description,

                    location: vm.deployment.location,
                    accessKeyId: vm.deployment.accessKeyId,
                    secretAccessKey: vm.deployment.secretAccessKey,

                    flavor: vm.deployment.flavor,
                    billingCode: vm.deployment.billingCode,
                    tags: vm.deployment.tags,
                    cloudFormationParameters: vm.cloudFormationParameters
                })
                    .then(function(data) {
                        console.log(JSON.stringify(data));
                        $location.path('/landscapes/'+ $routeParams.id);
                    })
                    .catch(function(err) {
                        console.log(JSON.stringify(err));

                        err = err.data;
                        $scope.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function(error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.message;
                        });
                    }
                );

        };
    }
})();
