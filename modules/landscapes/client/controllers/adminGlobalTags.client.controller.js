// Copyright 2014 OpenWhere, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

//ModalService

angular.module('landscapes')
    .controller('AdminGlobalTagsCtrl', function ($scope, $state,GlobalTagService, $uibModal) {

        var vm = this;

        vm.errorMessage = undefined;
        vm.infoMessage = undefined;
        vm.globalTag = {key:'', defaultValue:'', required:false};
        
        if(!vm.globalTags ){
            vm.globalTags = GlobalTagService.query();
        }

        vm.resetGlobalTags = function () {
            console.log('resetGlobalTag');

            vm.globalTags = GlobalTagService.query();

            vm.errorMessage = undefined;
            vm.globalTag = {key:'', defaultValue:'', required:false};
            vm.submitted = false;
            vm.errorMessage = undefined;
            vm.infoMessage = undefined;
        };

        vm.saveGlobalTag = function (form) {
            console.log('saveGlobalTag: ', vm.globalTag);

            vm.form = form;

            vm.submitted = true;

            if (vm.form.$invalid) {
                console.log('form.$invalid: ' + JSON.stringify(vm.form.$error));
                
                //TODO - why no error handling - AH 
            } else {

                GlobalTagService.save({
                    key: vm.globalTag.key,
                    defaultValue: vm.globalTag.defaultValue,
                    required: vm.globalTag.required
                }).$promise
                    .then(function () {
                        vm.resetGlobalTags();
                    })
                    .catch(function (err) {
                        err = err.data || err;
                        console.log('GlobalTagService.create Error:', err);

                        vm.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function (error, field) {
                            vm.form[field].$setValidity('mongoose', false);
                            vm.errors[field] = error.message;
                        });
                    }
                );
            }
        }

        vm.deleteGlobalTag = function(globalTag){
            console.log('starting deleteGlobalTag:', globalTag._id);

            vm.globalTag = globalTag;

            vm.confirmDelete(vm.globalTag.key, function(deleteConfirmed) {
                console.log('deleteGlobalTag.deleteConfirmed: ' + deleteConfirmed);
                if (deleteConfirmed === true) {

                    GlobalTagService.remove({id: globalTag._id})
                        .$promise.then(function (data) {
                            vm.resetGlobalTags();
                            vm.infoMessage = 'Global Tag "' + vm.globalTag.key + '" was deleted.';
                        })
                        .catch(function (err) {
                            err = err.data || err;
                            console.log('GlobalTagService.delete Error:', err);
                            vm.errorMessage = err
                        });
                }
            });
        };

        vm.confirmDelete = function (msg, callback) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'confirmGlobalTagDeleteModal.html',
                controller: 'DeleteGlobalTagModalInstanceCtrl as vm',
                size: 'sm',
                resolve: { msg: function () { return msg; } }
            });

            modalInstance.result.then(function (result) {
               callback(result);
            });
    };
});

angular.module('landscapes')
    .controller('DeleteGlobalTagModalInstanceCtrl', function($scope, $uibModalInstance, msg) {

        var vm = this;
        vm.msg = msg;
        vm.close = function(result) {
            $uibModalInstance.close(result); // close, but give 500ms for bootstrap to animate
  };

});
