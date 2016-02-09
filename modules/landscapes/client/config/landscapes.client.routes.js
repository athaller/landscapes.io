(function () {
  'use strict';

  angular
    .module('landscapes.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('landscapes', {
        abstract: true,
        url: '/landscapes',
        template: '<ui-view/>'
      })
      .state('landscapes.list', {
        url: '',
        templateUrl: 'modules/landscapes/client/views/list-landscapes.client.view.html',
        controller: 'LandscapesListController',
        controllerAs: 'vm'
      })
      .state('landscapes.create', {
        url: '/create',
        templateUrl: 'modules/landscapes/client/views/form-landscape.client.view.html',
        controller: 'LandscapesController',
        controllerAs: 'vm',
        resolve: {
          landscapesResolve: newLandscape
        }
      })
      .state('landscapes.view', {
        url: '/:landscapeId',
        templateUrl: 'modules/landscapes/client/views/view-landscape.client.view.html',
        controller: 'LandscapesViewController',
        controllerAs: 'vm',
        resolve: {
          landscapesResolve: getLandscape
        }
      })
      .state('landscapes.createdeploy', {
          url: '/deploy/:landscapeId',
          templateUrl: 'modules/landscapes/client/views/create-deployment.client.view.html',
          controller: 'CreateDeploymentController',
          controllerAs: 'vm',
          resolve: {
            landscapesResolve: getLandscape
          }
        });
  }



  getLandscape.$inject = ['$stateParams', 'LandscapesService'];

  function getLandscape($stateParams, LandscapeService) {
    return LandscapeService.get({
      landscapeId: $stateParams.landscapeId
    }).$promise;
  }

  newLandscape.$inject = ['LandscapesService'];

  function newLandscape(LandscapesService) {
    return new LandscapesService();
  }
})();
