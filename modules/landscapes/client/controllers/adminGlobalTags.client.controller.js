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



angular.module('landscapes')
    .controller('AdminGlobalTagsCtrl', function ($scope, $state,GlobalTagService, ModalService) {

        var vm = this;

        vm.errorMessage = undefined;
        vm.infoMessage = undefined;
        vm.globalTag = {key:'', defaultValue:'', required:false};
        
        if(!vm.globalTags ){
            vm.globalTags = GlobalTagService.query();
        }

        function resetGlobalTags() {
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

                GlobalTagService.create({
                    key: vm.globalTag.key,
                    defaultValue: vm.globalTag.defaultValue,
                    required: vm.globalTag.required
                })
                    .then(function () {
                        resetGlobalTags();
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
            console.log('deleteGlobalTag:', globalTag._id);

            vm.confirmDelete(globalTag.key, function(deleteConfirmed) {
                console.log('deleteGlobalTag.deleteConfirmed: ' + deleteConfirmed);
                if (deleteConfirmed === true) {

                    GlobalTagService.delete(globalTag._id)
                        .then(function (data) {
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
            ModalService.showModal({
                templateUrl: "confirmGlobalTagDeleteModal.html",
                controller: DeleteGlobalTagModalInstanceCtrl
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(deleteIsConfirmed) {
                    //$scope.yesNoResult = result ? "You said Yes" : "You said No";
                    return callback(deleteIsConfirmed);
                    
                });
            });

            /*
            var modalInstance = ModalService.open( {
                templateUrl: 'confirmGlobalTagDeleteModal.html',
                controller: DeleteGlobalTagModalInstanceCtrl,
                size: 'sm',
                resolve: { msg: function () { return msg; } }
            });
            modalInstance.result
                .then(function(deleteIsConfirmed) {
                    return callback(deleteIsConfirmed);
                });
            };
            */
    };

    var DeleteGlobalTagModalInstanceCtrl = function ($scope, $modalInstance, msg) {
        vm.msg = msg;
        $scope.confirmDeleteButtonClick = function (deleteConfirmed) {
            $modalInstance.close(deleteConfirmed);
        };
    };
});

angular.module('landscapes')
    .controller('DeleteGlobalTagModalInstanceCtrl', ['$scope', 'close', function($scope, close) {

  $scope.close = function(result) {
 	  close(result, 500); // close, but give 500ms for bootstrap to animate
  };

}]);
