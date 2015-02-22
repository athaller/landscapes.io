'use strict';

var winston = require('winston');
var openclient = require('openclient');
var config = require('../config/config');

function Stacks() {
  this.username ;
  this.password ;
  
};

Stacks.prototype.config = function(_username, _password){
  this.username = _username;
  this.password = _password;
  
};

Stacks.prototype.authenticate = function(callback){
  var Keystone = openclient.getAPI('openstack', 'identity', '2.0');
  var client = new Keystone({
    url: config.openStack.keystoneURL,
    debug: false
  });
  client.authenticate({
    username: this.username,
    password: this.password,
    project:  config.openStack.tenant
  },function (err, token) {
    if(err){
      winston.error(err);
      callback(err);
    }
    winston.info('Successfully authenticated to OpenStack ');
    winston.debug('Open Stack Token' + JSON.stringify(token));
    callback(null,token);
    
  });
};


Stacks.prototype.describeStacks = function(params, callback){

  this.authenticate(function (err, token) {
    if(err){
      callback(err);
    }

    var Heat =openclient.getAPI('openstack', 'orchestration', '1.0');
    var heatclient = new Heat({
      url: config.openStack.heatURL,
      debug: false,
      unscoped_token: token.token
    });

    heatclient.stacks.get({
      endpoint_type: "adminURL", 
      id: params.StackName,
      success: function (stack) {
        callback(null,stack);
      },
      error: function (err) {
        if (err.message.indexOf('The resource could not be found') !== -1) {
          // The resource could not be found.
          var fakeError = {};
          fakeError.message = "does not exist";
          callback(fakeError);
        }else{
          //its a real error
          callback(err);
        }
      }
    });
  })
};





Stacks.prototype.createStack = function(params, callback){
  this.authenticate(function (err, token) {
    if(err){
      callback(err);
    }

    var Heat = openclient.getAPI('openstack', 'orchestration', '1.0');
    var heatclient = new Heat({
      url: config.openStack.heatURL,
      debug: true,
      unscoped_token: token.token,
    });
   
    var userInputParameters = params.Parameters;
    var heatParameters ={};
    for(var i=0; i< userInputParameters.length;i++){
      var paramKey = userInputParameters[i].ParameterKey;
      var paramValue = userInputParameters[i].ParameterValue;
      heatParameters[paramKey]= paramValue;
    }
    
    heatclient.stacks.create({
      endpoint_type: "adminURL",  // Defaults to "publicURL". 
      data: {"stack_name": params.StackName, "template": JSON.stringify( JSON.parse(params.TemplateBody)), "parameters" : heatParameters},
      success: function (stack) {
        callback(null,stack);
      },
      error: function (err) {
        winston.error("Error Creating Open stack"  + err.message);
        callback(err);
      }
    });
  })
};



module.exports = Stacks;'use strict';

var winston = require('winston');
var openclient = require('openclient');
var config = require('../config/config');

function Stacks() {
  this.username ;
  this.password ;
  
};

Stacks.prototype.config = function(_username, _password){
  this.username = _username;
  this.password = _password;
  
};

Stacks.prototype.authenticate = function(callback){
  var Keystone = openclient.getAPI('openstack', 'identity', '2.0');
  var client = new Keystone({
    url: config.openStack.keystoneURL,
    debug: false
  });
  client.authenticate({
    username: this.username,
    password: this.password,
    project:  config.openStack.tenant
  },function (err, token) {
    if(err){
      winston.error(err);
      callback(err);
    }
    winston.log('Successfully authenticated to OpenStack ');
    winston.debug('Open Stack Token' + JSON.stringify(token));
    callback(null,token);
    
  });
};


Stacks.prototype.describeStacks = function(params, callback){

  this.authenticate(function (err, token) {
    if(err){
      callback(err);
    }

    var Heat =openclient.getAPI('openstack', 'orchestration', '1.0');
    var heatclient = new Heat({
      url: config.openStack.heatURL,
      debug: false,
      //tenant: 'Mission/Service',
      unscoped_token: token.token,
    });

    heatclient.stacks.get({
      endpoint_type: "adminURL", 
      id: params.StackName,
      success: function (stack) {
        callback(null,stack);
      },
      error: function (err) {
        if (err.message.indexOf('The resource could not be found') !== -1) {
          // The resource could not be found.
          var fakeError = {};
          fakeError.message = "does not exist";
          callback(fakeError);
        }else{
          //its a real error
          callback(err);
        }
      }
    });
  })
};





Stacks.prototype.createStack = function(params, callback){

 
  this.authenticate(function (err, token) {
    if(err){
      callback(err);
    }

    var Heat = openclient.getAPI('openstack', 'orchestration', '1.0');
    var heatclient = new Heat({
      url: config.openStack.heatURL,
      debug: true,
     // tenant: 'Mission/Service',
      unscoped_token: token.token,
    });
   
    var userInputParameters = params.Parameters;
    var heatParameters =[];
    for(var i=0; i< userInputParameters.length;i++){
      var paramKey = userInputParameters[i].ParameterKey;
      var paramValue = userInputParameters[i].ParameterValue;
      heatParameters.push({paramKey:paramValue});
    }
    
    

    heatclient.stacks.create({
      endpoint_type: "adminURL",  // Defaults to "publicURL". 
      data: {"stack_name": params.StackName, "template": JSON.stringify( JSON.parse(params.TemplateBody)), "parameters" : heatParameters},
      success: function (stack) {
        callback(null,stack);
      },
      error: function (err) {
        winston.error("Error Creating Open stack"  + err);
        callback(err);
      }
    });
  })
};



module.exports = Stacks;