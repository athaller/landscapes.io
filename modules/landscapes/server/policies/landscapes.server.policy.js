'use strict';

/**
 * Module dependencies
 */
var _ = require("lodash"),
  Group = require('mongoose').model('Group'),
  util = require('util');


var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());






var isAdmin = function (roles){
  var adminRoles = _.find(roles,function(role){return role.name == 'admin'});
  if(adminRoles){
    return true
  }else{
    return false;
  }
};

var isRoleinPermission = function (roles,level){
  var fullAccessRole = _.find(roles, function(role) {
      var permissions = role.permissions;
      for(var i=0;i < permissions.length;i++){
        if(permissions[i].value == level){
          return permissions[i].value == level;
        }
      }
  });
  if(fullAccessRole){
    return true;
  }else{
    return false;
  }
};

var isGroupinPermission = function(groups, level, landscapeId){

  for(var i = 0;i <groups.length;i++){
    var permissions = groups[i].permissions;
    for(var j =0;j < permissions.length;j++){
      if(permissions[j].value == level){
        var landscapes = groups[i].landscapes;
        for(var k= 0; k < landscapes.length; k++){
          if(landscapes[k].id == landscapeId.id){
            return true;
          }
        }
      }
    }
  }
  return false;
};


/**
 * New Policy 
 * Not issug ACL - maybe merge landscapes model with ACL in the Future 
 */
 
/* Approve built in admin default role */
exports.isAdminAllowed = function (req, res, next) {
  if(!req.user || !req.user.roles ) {
    return res.status(403).json({message: 'User is not authorized'});
  };
  var roles = req.user.roles;
  //console.log(JSON.stringify(roles, null, 4));
  
  /* Approve admin default role */
  if(isAdmin(roles))
  {
    return next();
  }
  //check Roles with Full Access
  if(isRoleinPermission(roles,'F')){
    return next();
  }
  return res.status(403).json({message: 'User is not authorized'});
};


exports.isLoggedIn = function(req,res,next){
  if(!req.user ) {
    return res.status(403).json({message: 'User is not authorized'});
  }else{
    return next();
  }
}


exports.isReadAllowed = function (req, res, next) {
  if(!req.user ) {
    return res.status(403).json({message: 'User is not authorized'});
  };
  /* Approve admin default role */
  if(req.user.roles && req.user.roles.length && req.user.roles[0] != null ) {
    if (isAdmin(req.user.roles)) {
      return next();
    }
    //check Roles with Full Access
    if (isRoleinPermission(req.user.roles, 'R')) {
      return next();
    }
  }

  if(isGroupinPermission(req.user.groups, 'R', req.landscape._id)) {
      return next();
  }

  return res.status(403).json({message: 'User is not authorized'});

};


exports.isCreateAllowed = function (req, res, next) {
  if(!req.user ) {
    return res.status(403).json({message: 'User is not authorized'});
  };
  /* Approve admin default role */
  if(req.user.roles && req.user.roles.length && req.user.roles[0] != null) {
    if (isAdmin(req.user.roles)) {
      return next();
    }
    //check Roles with Full Access
    if (isRoleinPermission(req.user.roles, 'C')) {
      return next();
    }
  }
  if(isGroupinPermission(req.user.groups, 'C', req.landscape._id)) {
    return next();
  }

  return res.status(403).json({message: 'User is not authorized'});
};



exports.isUpdateAllowed = function (req, res, next) {
  if(!req.user ) {
    return res.status(403).json({message: 'User is not authorized'});
  };
  /* Approve admin default role */
  if(req.user.roles && req.user.roles.length && req.user.roles[0] != null) {
    if (isAdmin(req.user.roles)) {
      return next();
    }
    //check Roles with Full Access
    if (isRoleinPermission(req.user.roles, 'U')) {
      return next();
    }
  }
  if(isGroupinPermission(req.user.groups, 'U', req.landscape._id)) {
    return next();
  }

  return res.status(403).json({message: 'User is not authorized'});
};



exports.isDeleteAllowed = function (req, res, next) {
  if(!req.user ) {
    return res.status(403).json({message: 'User is not authorized'});
  };
  /* Approve admin default role */
  if(req.user.roles && req.user.roles.length && req.user.roles[0] != null) {
    if (isAdmin(req.user.roles)) {
      return next();
    }
    //check Roles with Full Access
    if (isRoleinPermission(req.user.roles, 'D')) {
      return next();
    }
  }
  if(isGroupinPermission(req.user.groups, 'D', req.landscape._id)) {
    return next();
  }

  return res.status(403).json({message: 'User is not authorized'});
};






exports.isDeployAllowed = function (req, res, next) {
  if(!req.user ) {
    return res.status(403).json({message: 'User is not authorized'});
  };
  /* Approve admin default role */
  if(req.user.roles) {
    if (isAdmin(req.user.roles && req.user.roles.length && req.user.roles[0] != null)) {
      return next();
    }
    //check Roles with Full Access
    if (isRoleinPermission(req.user.roles, 'X')) {
      return next();
    }
  }
  if(isGroupinPermission(req.user.groups, 'X', req.landscape._id)) {
    return next();
  }

  return res.status(403).json({message: 'User is not authorized'});
};













/**
 * Invoke Articles Permissions
 */
exports.invokeRolesPolicies = function () {
    acl.allow([
        {
            roles: ['admin'],
            allows: [
                {
                    resources: '/api/landscapes',
                    permissions: '*'
                }, 
                {
                    resources: '/api/landscapes/:landscapesId',
                    permissions: '*'
                }
            ]
        }
    ]);
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

