'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport');

// GET /api/users
exports.retrieve = function (req, res) {
    console.log('retrieve users')
    return User.find(function (err, users) {
        if (err) {
            return res.send(500, err);
        } else {
            return res.json(users);
        }
    });
};

exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.save(function(err) {
    if (err) return res.json(400, err);
    
    req.logIn(newUser, function(err) {
      if (err) return next(err);

      return res.json(req.user.userInfo);
    });
  });
};

exports.retrieveOne = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.send({ profile: user.profile });
  });
};

exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return res.send(400);

        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

exports.update = function(req, res, next) {
    var userId = req.params.id;

    var data = req.body;

    console.log('user update: ' + userId);

    User.findById(userId, function (err, user) {
        if(err) {
            return res.send(500, err);
        } else if (!user) {

        } else {
            user.name = data.name;
            user.role = data.role;
            user.email = data.email;

            user.save(function(err) {
                if (err) {
                    return res.send(400);
                }
                else {
                    return res.json(user);
                }
            });
        }
    });
};

exports.me = function(req, res) {
  res.json(req.user || null);
};