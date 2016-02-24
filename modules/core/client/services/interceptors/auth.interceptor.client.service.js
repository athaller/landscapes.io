'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector', 'Authentication',
  function ($q, $injector, Authentication) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
                $injector.get('$state').go('forbidden');
              } else {
                $injector.get('$state').go('authentication.signin').then(function () {
                //  storePreviousState(toState, toParams);
                });
              }
              break;

             // $injector.get('$state').transitionTo('forbidden');

          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);
