'use strict';



angular.module('landscapesApp')
  .factory('Deploy', function Deploy($location, $rootScope, Session, User, $cookieStore) {

    return {

        deployLandscape: function(templateJson, callback) {
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