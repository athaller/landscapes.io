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
    .controller('AdminAccountsCtrl', function ($scope, CloudAccountService) {
        $scope.account = { };

        $scope.addingAccount = false;
        $scope.editingAccount = false;

        $scope.editAccount = function(id) {
            console.log('editAccount: ' + id);
            $scope.editingAccount = true;
            $scope.account = AccountService.retrieveOne(id);
        };

        $scope.updateAccount = function(id) {
            console.log('updateAccount');
            console.log($scope.account);
        };

        $scope.addAccount = function() {
            console.log('addAccount');
            $scope.account = { };
            $scope.addingAccount = true;
        };

        $scope.resetAccounts = function() {
            console.log('resetAccounts');

            AccountService.retrieve()
                .then(function(data){
                    $scope.accounts = data;
                });

            $scope.addingAccount = false;
            $scope.editingAccount = false;
            $scope.account = { };
            $scope.submitted = false;
        };

        $scope.saveAccount = function (form) {
            $scope.submitted = true;

            if (form.$invalid) {
                console.log('form.$invalid: ' + JSON.stringify(form.$error));

            } else if ($scope.addingAccount) {

                AccountService.create({
                    name: $scope.account.name,
                    region: $scope.account.region,
                    accessKeyId: $scope.account.accessKeyId,
                    secretAccessKey: $scope.account.secretAccessKey
                })
                    .then(function () {
                        $scope.resetAccounts();
                    })
                    .catch(function (err) {
                        err = err.data || err;
                        console.log(err);

                        $scope.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function (error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.message;
                        });
                    });

            } else if ($scope.editingAccount) {

                console.log('editing account...')
                console.log($scope.account)

                AccountService.update($scope.account._id, {
                    name: $scope.account.name,
                    region: $scope.account.region,
                    accessKeyId: $scope.account.accessKeyId,
                    secretAccessKey: $scope.account.secretAccessKey
                })
                    .then(function () {
                        $scope.resetAccounts();
                    })
                    .catch(function (err) {
                        err = err.data || err;
                        console.log(err);

                        $scope.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function (error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.message;
                        });
                    });
            }
        };

        $scope.deleteAccount = function(){
            console.log('deleteAccount: ' + $scope.account._id);

            $scope.confirmDelete($scope.account.name, function(deleteConfirmed) {
                console.log('deleteAccount.deleteConfirmed: ' + deleteConfirmed);
                if (deleteConfirmed === true) {

                    AccountService.delete($scope.account._id)
                        .then(function () {
                            $scope.resetAccounts();
                        })
                        .catch(function (err) {
                            err = err.data || err;
                            console.log(err)
                        });
                }
            });
        };

        $scope.confirmDelete = function (msg, callback) {
            var modalInstance = $modal.open( {
                templateUrl: 'confirmDeleteModal.html',
                controller: DeleteModalInstanceCtrl,
                size: 'sm',
                resolve: { msg: function () { return msg; } }
            });

            modalInstance.result
                .then(function(deleteIsConfirmed) {
                    return callback(deleteIsConfirmed);
                });
        };
    });

var DeleteModalInstanceCtrl = function ($scope, $modalInstance, msg) {
    $scope.msg = msg;

    $scope.confirmDeleteButtonClick = function (deleteConfirmed) {
        $modalInstance.close(deleteConfirmed);
    };
};
