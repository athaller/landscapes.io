(function () {
  'use strict';

  angular
    .module('landscapes.services')
    .factory('LandscapesService', LandscapesService);

  LandscapesService.$inject = ['$resource'];

  function LandscapesService($resource) {
    return $resource('/api/landscapes/:landscapeId',
        {
          landscapesId: '@_id'
        },
        {
          update: {
          method: 'PUT'
        }
    });
  }
})();
