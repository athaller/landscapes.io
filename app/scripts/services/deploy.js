'use strict';



angular.module('seahawkApp')
  .factory('Deploy', function Deploy($location, $rootScope, Session, User, $cookieStore) {

    return {

        deployTemplate: function(templateJson, callback) {
            var cb = callback || angular.noop;

//            var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});

//            call services/deploy

//            return cb().$promise;
            return cb();
        },

      /**
       * Create a new user
       * 
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}            
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(user) {
            $rootScope.currentUser = user;
            return cb(user);
          },
          function(err) {
            return cb(err);
          }).$promise;
      }
    };
  });