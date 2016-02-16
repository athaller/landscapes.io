// Copyright 2014 OpenWhere, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var winston = require('winston'),
    fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose'),
    Account = mongoose.model('Account');


// GET /api/accounts
exports.retrieve = function (req, res) {
    winston.info(' ---> retrieving Accounts');

    var user = req.user || undefined;
    if(user === undefined) {
        return res.send(401);
    }

    return Account.find(function (err, data) {
        if (err) {
            winston.log('error', err);
            return res.send(500, err);
        } else {
            winston.info(' ---> Accounts retrieved: ' + data.length);
            return res.json(data);
        }
    });
};


// GET /api/accounts/<id>
exports.retrieveOne = function (req, res, next) {
    winston.info(' ---> retrieving Single Account');
    var accountId = req.params.id;


    Account.findById(accountId, function (err, group) {
        if (err) {
            winston.log('error', err);
            return next(err);
        } else if (!group) {
            return res.send(404);
        } else {
            res.json(group);
        }
    });
};


// POST /api/accounts
exports.create = function (req, res) {
    winston.info(' ---> creating Account');

    var data = req.body;
   // console.log(data);

    var newAccount = new Account(req.body);
    newAccount.createdBy = req.user._id;
    newAccount.save(function(err) {
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        } else {
            console.log(JSON.stringify(newAccount));
            return res.json(newAccount);
        }
    });
};


// PUT /api/accounts/<id>
exports.update = function(req, res, next) {
    winston.info(' ---> updating Account');

    var user = req.user || undefined;
    if(user === undefined) {
        return res.send(401);
    }

    var accountId = req.params.id;
    var data = req.body;

    Account.findById(accountId, function (err, account) {
        if(err) {
            winston.log('error', err);
            return res.send(500, err);
        } else if (!account) {
            return res.send(404);
        } else {
            account.increment();
            account.createdBy = user._id;
            account.name = data.name;
            account.region = data.region;
            account.accessKeyId = data.accessKeyId;
            account.secretAccessKey = data.secretAccessKey;

            account.save(function(err) {
                if (err) {
                    winston.log('error', err);
                    return res.send(400);
                }
                else {
                    winston.info(' ---> Account updated: ' + accountId);
                    return res.json(account);
                }
            });
        }
    });
};

// DELETE /api/accounts/<id>
exports.delete = function (req, res, next) {
    winston.info(' ---> deleting Account');

    var user = req.user || undefined;
    if(user === undefined) {
        return res.send(401);
    }

    Account.findByIdAndRemove(req.params.id, function(err, docs){
        if (err) {
            winston.log('error', err);
            return res.json(400, err);
        } else {
            winston.info(' ---> Account deleted: ' + req.params.id);
            return res.send(200);
        }
    });
};
