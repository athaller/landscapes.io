'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config'));

/**
 * Module init function.
 */
module.exports = function (app, db) {


    config.getCryptoKey = function (callback) {
        fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
            if (err) {
                callback(err);
            } else {
                var key = JSON.parse(data);
                callback(null, key.key);
            }
        });
    };

    config.createCryptoKey =  function(callback){
        var filePath = path.join(__dirname + '/../accountsKeyFile.json');
        try {
            var data = '{ "key": "' + uuid.v4() + '" }';
            fs.writeFileSync(filePath, data, 'utf8');
            callback();
        } catch (err) {
            callback(err);
        }
        winston.log('Encryption key file -> ' + filePath);
    };

};
