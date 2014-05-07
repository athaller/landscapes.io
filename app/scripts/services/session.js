'use strict';

angular.module('landscapesApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
