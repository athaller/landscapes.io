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
    .controller('AdminAccountsCtrl', function ($scope, $state,$uibModal, CloudAccountService) {
        
        var vm = this;
        vm.account = { };

        vm.addingAccount = false;
        vm.editingAccount = false;

        vm.editAccount = function(id) {
            console.log('editAccount: ' + id);
            vm.editingAccount = true;
            vm.account = CloudAccountService.retrieveOne(id);
        };

        vm.updateAccount = function(id) {
            console.log('updateAccount');
            console.log(vm.account);
            //Whys is this empty - AH?
        };

        vm.addAccount = function() {
            console.log('addAccount');
            vm.account = { };
            vm.addingAccount = true;
        };

        vm.resetAccounts = function() {
            console.log('resetAccounts');

            CloudAccountService.retrieve()
                .then(function(data){
                    $scope.$parent.vm.accounts = data;
                });

            vm.addingAccount = false;
            vm.editingAccount = false;
            vm.account = { };
            vm.submitted = false;
        };

        vm.saveAccount = function (form) {
            vm.submitted = true;
            vm.form  = form;

            if (vm.form.$invalid) {
                console.log('form.$invalid: ' + (vm.form.$error)); //TODO fix error logging

            } else if (vm.addingAccount) {

                CloudAccountService.create({
                    name: vm.account.name,
                    region: vm.account.region,
                    accessKeyId: vm.account.accessKeyId,
                    secretAccessKey: vm.account.secretAccessKey
                })
                    .then(function () {
                        vm.resetAccounts();
                    })
                    .catch(function (err) {
                        err = err.data || err;
                        console.log(err);

                        vm.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function (error, field) {
                            vm.form[field].$setValidity('mongoose', false);
                            vm.errors[field] = error.message;
                        });
                    });

            } else if (vm.editingAccount) {

                console.log('editing account...')
                console.log(vm.account)

                CloudAccountService.update(vm.account._id, {
                    name: vm.account.name,
                    region: vm.account.region,
                    accessKeyId: vm.account.accessKeyId,
                    secretAccessKey: vm.account.secretAccessKey
                })
                    .then(function () {
                        vm.resetAccounts();
                    })
                    .catch(function (err) {
                        err = err.data || err;
                        console.log(err);

                        vm.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function (error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.message;
                        });
                    });
            }
        };

        vm.deleteAccount = function(){
            console.log('deleteAccount: ' + vm.account._id);

            vm.confirmDelete(vm.account.name, function(deleteConfirmed) {
                console.log('deleteAccount.deleteConfirmed: ' + deleteConfirmed);
                if (deleteConfirmed === true) {

                    CloudAccountService.delete(vm.account._id)
                        .then(function () {
                            vm.resetAccounts();
                        })
                        .catch(function (err) {
                            err = err.data || err;
                            console.log(err)
                        });
                }
            });
        };

        vm.confirmDelete = function (msg, callback) {
            var modalInstance = $uibModal.open( {
                templateUrl: 'confirmDeleteModal.html',
                controller: 'DeleteModalInstanceCtrl as vm',
                size: 'sm',
                resolve: { msg: function () { return msg; } }
            });

            modalInstance.result.then(function(result) {
                    return callback(result);
                });
        };
    });


angular.module('landscapes')
    .controller('DeleteModalInstanceCtrl', function($scope, $uibModalInstance, msg) {

        var vm = this;
        vm.msg = msg;

        vm.close = function(result) {
            $uibModalInstance.close(result); // close, but give 500ms for bootstrap to animate
    };
});
