(function () {
  'use strict';

  angular
    .module('landscapes.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider','$urlMatcherFactoryProvider','$urlRouterProvider'];

  function routeConfig($stateProvider,$urlMatcherFactoryProvider,$urlRouterProvider) {

     //$urlMatcherFactoryProvider.strictMode(false);

      $urlRouterProvider.rule(function ($injector, $location) {
          var path = $location.url();

          // check to see if the path already has a slash where it should be
          if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
              return;
          }

          if (path.indexOf('?') > -1) {
              return path.replace('?', '/?');
          }

          return path + '/';
      });


      $stateProvider
          .state('landscapes', {
            abstract: true,
          //  url: '/landscapes/',
            template: '<ui-view/>'
          })
          .state('landscapes.list', {
            url: '/landscapes/',
            templateUrl: 'modules/landscapes/client/views/list-landscapes.client.view.html',
            controller: 'LandscapesListController',
            controllerAs: 'vm'
          })
          .state('landscapes.create', {
            url: '/landscapes/create/',
            templateUrl: 'modules/landscapes/client/views/form-landscape.client.view.html',
            controller: 'LandscapesController',
            controllerAs: 'vm',
            resolve: {
              landscapesResolve: newLandscape
            }
          })
          .state('landscapes.view', {
            url: '/landscapes/:landscapeId/',
            templateUrl: 'modules/landscapes/client/views/view-landscape.client.view.html',
            controller: 'LandscapesViewController',
            controllerAs: 'vm',
            resolve: {
              landscapesResolve: getLandscape
            }
          })
          .state('landscapes.createdeploy', {
            url: '/landscapes/deploy/:landscapeId/',
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
          return LandscapeService.get({landscapeId: $stateParams.landscapeId}).$promise;
  }

  newLandscape.$inject = ['LandscapesService'];

  function newLandscape(LandscapesService) {
    return new LandscapesService();
  }
})();
