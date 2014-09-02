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

angular.module('landscapesApp')
    .controller('AdminGlobalTagsCtrl', function ($scope, $modal, GlobalTagService) {

        $scope.errorMessage = undefined;
        $scope.infoMessage = undefined;
        $scope.globalTag = {key:'', defaultValue:'', required:false};

        function resetGlobalTags() {
            console.log('resetGlobalTag');

            GlobalTagService.retrieve()
                .then(function(data){
                    $scope.globalTags = data;
                });

            $scope.errorMessage = undefined;

            $scope.globalTag = {key:'', defaultValue:'', required:false};
            $scope.submitted = false;
            $scope.errorMessage = undefined;
            $scope.infoMessage = undefined;
        };

        $scope.saveGlobalTag = function (form) {
            console.log('saveGlobalTag: ', $scope.globalTag);

            $scope.submitted = true;

            if (form.$invalid) {
                console.log('form.$invalid: ' + JSON.stringify(form.$error));
            } else {

                GlobalTagService.create({
                    key: $scope.globalTag.key,
                    defaultValue: $scope.globalTag.defaultValue,
                    required: $scope.globalTag.required
                })
                    .then(function () {
                        resetGlobalTags();
                    })
                    .catch(function (err) {
                        err = err.data || err;
                        console.log('GlobalTagService.create Error:', err);

                        $scope.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function (error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.message;
                        });
                    }
                );
            }
        }

        $scope.deleteGlobalTag = function(globalTag){
            console.log('deleteGlobalTag:', globalTag._id);

            $scope.confirmDelete(globalTag.key, function(deleteConfirmed) {
                console.log('deleteGlobalTag.deleteConfirmed: ' + deleteConfirmed);
                if (deleteConfirmed === true) {

                    GlobalTagService.delete(globalTag._id)
                        .then(function (data) {
                            resetGlobalTags();
                            $scope.infoMessage = 'Global Tag "' + globalTag.key + '" was deleted.';
                        })
                        .catch(function (err) {
                            err = err.data || err;
                            console.log('GlobalTagService.delete Error:', err);
                            $scope.errorMessage = err
                        });
                }
            });
        };

        $scope.confirmDelete = function (msg, callback) {
            var modalInstance = $modal.open( {
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
    });

var DeleteGlobalTagModalInstanceCtrl = function ($scope, $modalInstance, msg) {
    $scope.msg = msg;

    $scope.confirmDeleteButtonClick = function (deleteConfirmed) {
        $modalInstance.close(deleteConfirmed);
    };
};