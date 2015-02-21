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

var fs = require('fs');
var uuid = require('node-uuid');
var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');
var filePath = path.join(rootPath + '/lib/config/accountsKeyFile.json');

module.exports = {
    root: rootPath,
    port: process.env.PORT || 9000,
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },
    
    /*
    *
    */
    openStack :{
        keystoneURL:"http://os-controller1:5000/v2.0",
        heatURL: "http://os-controller1:8004/v1/6f6b98c21a7a42b4acbf406eac35ac72",
        tenant: "Mission/Service"
    },

    getCryptoKey: function getCryptoKey(callback) {
        fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
            if (err) {
                callback(err);
            } else {
                var key = JSON.parse(data);
                callback(null, key.key);
            }
        });
    },

    setCryptoKey: function(callback){
        var filePath = path.join(__dirname + '/../accountsKeyFile.json');
        console.log(' -- writing encryption key file -> ' + filePath);
        try {
            var data = '{ "key": "' + uuid.v4() + '" }';
            fs.writeFileSync(filePath, data, 'utf8');
            callback();
        } catch (err) {
            callback(err);
        }
    }
};
