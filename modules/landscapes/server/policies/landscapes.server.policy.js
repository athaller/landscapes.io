'use strict';

/**
 * Module dependencies
 */
var _ = require("lodash");


var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Articles Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/landscapes',
      permissions: '*'
    }, {
      resources: '/api/landscapes/:landscapesId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/landscapes',
      permissions: ['get', 'post']
    }, {
      resources: '/api/landscapes/:landscapesId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/landscapes',
      permissions: ['get']
    }, {
      resources: '/api/landscapes/:landscapesId',
      permissions: ['get']
    }]
  }]);
};

/**
 * New Policy
 */
exports.isAllowed = function (req, res, next) {
  if(!req.user ) {
    return res.status(403).json({message: 'User is not authorized'});
  };
  if(req.user.roles){
    /* Approve admin default role */
    var adminRoles = _.find(req.user.roles,function(role){return role.name == 'admin'})
    if(adminRoles)
    {
      return next();
    }else{

      //check Roles for

      return res.status(403).json({message: 'User is not authorized'});

    }




  }



};

/*
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an landscapes is being processed and the current user created it then allow any manipulation
  if (req.landscapes && req.user && req.landscapes.user && req.landscapes.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({message: 'User is not authorized'});
      }
    }
  });
  */

