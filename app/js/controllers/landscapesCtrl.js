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
    .controller('LandscapesCtrl', function ($scope, $http) {

        $http.get('/api/landscapes')
            .success(function(data, status) {
                $scope.landscapes = data;

                // if 'description' is over 192 characters, get substring and add ellipsis
                for(var i = 0; i < $scope.landscapes.length; i++){
                    if($scope.landscapes[i]['description'].length > 128){
                        $scope.landscapes[i]['description'] = $scope.landscapes[i]['description'].substring(0,125) + '...';
                    }
                }
            })
            .error(function(data){
                console.log(data);
            });
    }
);