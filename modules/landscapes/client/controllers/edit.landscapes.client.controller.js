(function () {
    'use strict';

    angular
        .module('landscapes')
        .controller('LandscapeEditController', LandscapeEditController);

    LandscapeEditController.$inject = ['$scope', '$state', '$filter', 'landscapesResolve', 'LandscapesService','PermissionService', 'Upload','ValidationService', 'Authentication','$uibModal'];

    function LandscapeEditController($scope, $state, $filter, landscape, LandscapesService, PermissionService, Upload, ValidationService, Authentication, $uibModal) {

        var vm = this;
        vm.currentUser = Authentication.user;
        vm.hasPermission = PermissionService.hasPermission;
        vm.landscape = landscape;
        vm.template = JSON.parse(vm.landscape.cloudFormationTemplate);
        vm.imgSrc = '/api/landscapes/' + landscape._id + '/image';

        vm.showUploadNewImage = false;
        vm.showUploadNewTemplate = false;
        vm.newImg = null;

        vm.selectFile = true;
        vm.templateSelected = false;

        vm.imgSrc = vm.landscape.imageUri;


        vm.error = null;
        vm.form = {};


        //Cna this be rmeoved now ?
        $scope.$watchCollection('newImg', function () {
                if (vm.newImg)
                    vm.imgSrc = vm.newImg;
        });

        vm.confirmDelete = function (msg, callback) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'confirmDeleteModal.html',
                controller: 'DeleteModalInstanceCtrl as vm',
                size: 'sm',
                resolve: {
                    msg: function () {
                        return msg;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                callback(result);
            });
        };



        vm.toggleUploadNewImage = function () {
                vm.showUploadNewImage = !vm.showUploadNewImage;
                vm.imageError = false;
            };

        vm.incrementVersion = function () {
                vm.landscape.version = (Number(vm.landscape.version) + 0.1).toFixed(1);
                vm.form.$dirty = true;
            };

        vm.deleteLandscape = function (name) {
                vm.confirmDelete(name, function (deleteConfirmed) {
                    if (deleteConfirmed === true) {
                        LandscapesService.remove({landscapeId:vm.landscape._id})
                            .$promise
                            .then(function (data) {
                                $state.go('landscapes.list');
                            })
                            .catch(function (err) {
                                err = err.data;
                                console.log(err);
                            });
                    }
                });
            };

        vm.updateLandscape = function (form) {
                vm.submitted = true;
                vm.form = form;
            
                // validate cloudFormationTemplate here?

               // if (vm.landscape.cloudFormationTemplate === undefined || vm.templateSelected === false) {
               if (vm.landscape.cloudFormationTemplate === undefined) {
                    vm.form.$valid = false;
                }

                if ( vm.form.$valid) {
                    LandscapesService.update({landscapeId:vm.landscape._id}, {
                            name:  vm.landscape.name,
                            version:  vm.landscape.version,
                            imageUri:  vm.landscape.imageUri,
                            cloudFormationTemplate:  vm.landscape.cloudFormationTemplate,
                            infoLink:  vm.landscape.infoLink,
                            infoLinkText:  vm.landscape.infoLinkText,
                            description:  vm.landscape.description
                        })
                        .$promise
                        .then(function () {
                            $state.go('landscapes.view',{landscapeId:vm.landscape._id});
                        })
                        .catch(function (err) {
                            err = err.data;
                            console.log(err);
                            vm.errors = {};

                            // Update validity of form fields that match the mongoose errors
                            angular.forEach(err.errors, function (error, field) {
                                vm.form[field].$setValidity('mongoose', false);
                                vm.errors[field] = error.message;
                            });
                        });
                } else {
                    console.log(JSON.stringify( vm.form.$error));
                }
            };

        vm.readFile = function () {
                console.log('readFile()');
            };

        vm.onFileSelect = function (files) {
                console.log('onFileSelect()');
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    vm.upload = Upload.upload({
                            url: '/api/upload/template',
                            method: 'POST',
                            withCredentials: true,
                            data: {myObj:' vm.myModelObj'},
                            file: file
                        })
                        .success(function (data) {
                            vm.landscape.cloudFormationTemplate = $filter('json')(data);
                            vm.templateSelected = true;
                        })
                        .error(function (err) {
                            console.log(err);
                        });
                }
            };

        vm.onImageSelect = function (files) {
                vm.imageError = false;

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    vm.upload = Upload.upload({
                            url: '/api/upload/image',
                            method: 'POST',
                            withCredentials: true,
                            data: {myObj: 'vm.myModelObj'},
                            file: file
                        })
                        .success(function (data) {
                            data = JSON.parse($filter('json')(data));
                            vm.landscape.imageUri = data.imageUri;
                            vm.imageSelected = true;
                            vm.showUploadNewImage = false;
                            vm.form.$dirty = true;
                            vm.newImg = data.imageUri;
                        })
                        .error(function (err, status, headers) {
                                if (status === 400) {
                                    vm.imageError = err.msg || err;
                                    console.log(err);
                                } else if (status === 500) {
                                    vm.imageError = '500 (Internal Server Error)';
                                    console.log(err);
                                }
                            }
                        );
                }
            };
    }

    angular.module('landscapes')
    .controller('DeleteModalInstanceCtrl', function($scope, $uibModalInstance, msg) {

        var vm = this;
        vm.msg = msg;
        vm.close = function(result) {
            $uibModalInstance.close(result); // close, but give 500ms for bootstrap to animate
        };
    });
})();



