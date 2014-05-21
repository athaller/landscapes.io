'use strict';

// <div image-upload></div>

angular.module('landscapesApp')
    .directive('imageUpload', function($parse) {
        return {
            restrict: 'AE',
            templateUrl: '/scripts/directives/imageUpload.html',
            replace: true
        };
    });
