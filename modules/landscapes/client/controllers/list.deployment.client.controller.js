(function () {
    'use strict';

    angular
        .module('landscapes')
        .controller('ListDeployments', ListDeployments);

    ListDeployments.$inject = ['$scope', '$state','DeploymentService','PermissionService','Authentication'];

    function ListDeployments($scope, $state,DeploymentService,PermissionService,Authentication) {

        // TO DO: poll AWS for CloudFormation events by isOpenIndex
        var vm = this;
        vm.addNote = false;
        vm.newNote = {};
        vm.deployments = [{'test':'test'}];

        vm.headerColor = function(deployment){
            if(deployment.awsErrors){
                return 'panel-danger';
            }else if(deployment.open){
                return 'panel-primary';
            }else{
                return 'panel-default';
            }
        };


        vm.loadDeployments = function(isOpenIndex) {
            DeploymentService.retrieveForLandscape($state.params.landscapeId,
                function (err, deployments) {
                    if (err) {
                        err = err.data || err;
                        console.log(err)
                    } else {
                        vm.deployments = deployments;
                        if(isOpenIndex !== undefined) {
                            vm.deployments[isOpenIndex].open = true;
                        }
                    }
                });
        };

        vm.loadDeployments();

        vm.cancelNote = function(index) {
            vm.newNote.text = undefined;
            vm.addNote = false;
            vm.loadDeployments(index);
        };

        vm.saveNote = function(id, index) {
            console.log('saveNote: ' + id);
            console.log(vm.newNote.text);

            if(vm.newNote.text !== undefined) {
                var newNote = { text: $scope.newNote.text };
                DeploymentService.update(id, { _id: id, note: newNote},
                    function (err, data) {
                        if (err) {
                            err = err.data || err;
                            console.log(err);
                        } else {
                            $scope.addNote = false;
                        }
                    });
            }
            vm.newNote.text = undefined;
            vm.addNote = false;
            vm.loadDeployments(index);
        };
    };

})();
