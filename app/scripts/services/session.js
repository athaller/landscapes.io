'use strict';

angular.module('seahawkApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
