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

var winston = require('winston');
var async = require('async');
var fs = require('fs');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick: true });


function readFileSync(path) {
    if (typeof window !== 'undefined') return null;
    return require('fs').readFileSync(path, 'utf-8');
}


function deleteFile(filePath, callback) {
    winston.info(' ---> deleting file');

    fs.unlink(filePath, function(err) {
        if (err) {
            callback(err);
        } else {
            winston.info('file deleted --> ' + filePath);
            callback(null);
        }
    });
}


function tryParseJSON(jsonString) {
    winston.info(' ---> validating JSON');
    try {
        var o = JSON.parse(jsonString);

        if (o && typeof o === "object" && o !== null) {
            return o;
        }
    }
    catch (e) { }

    return false;
}


exports.postCloudFormationTemplate = function (req, res) {
    winston.info(' ---> posting cloudFormationTemplate');

    var user = req.user || {name: 'anonymous'};
    winston.info(user.name);

    var f = req.files;
    winston.info(f);

    // validate template
    // http://docs.aws.amazon.com/cli/latest/reference/cloudformation/validate-template.html

    var templateJson = readFileSync(f.file.path);

    if(tryParseJSON(templateJson)) {
        winston.info('JSON is valid: ' + f.file.path);
        deleteFile(f.file.path, function (err) {
            if (err) {
                winston.log('error', 'deleteFile Error: ' + err);
            }
            res.send(templateJson);
        });
    } else {
        winston.log('error', 'invalid JSON: ' + f.file.path);
        deleteFile(f.file.path, function (err) {
            if (err) {
                winston.log('error', 'deleteFile Error: ' + err);
            }
            res.send(400, {msg: 'File \"' + f.file.name + '\"' + ' does not contain a valid AWS CloudFormation Template.' } );
        });
    }
};


exports.postImage = function (req, res) {
    winston.info(' ---> posting image');

    var user = req.user.userInfo;

    if(user === undefined) {
        return res.send(401);
    }

    console.log('req.files', req.files)

    var f = req.files;
    winston.info(f);

    var imageFileExtensions = ['png','jpg','jpeg'];
    if(imageFileExtensions.indexOf(f.file.extension) === -1) {
        deleteFile(f.file.path, function(err) {
            if(err) { winston.log('error', err); }
            res.send(400, {msg: 'Images of type \"' + f.file.extension + '\"' + ' are not supported; use \"png\" or \"jpg\".' } );
        });
    } else {
        var exec = require('child_process').exec;
        exec("convert", function (err) {
            if (err) {
                winston.log('error', err);
                deleteFile(f.file.path, function (err) {
                    if (err) {
                        winston.log('error', err);
                    }
                    var msg = "Image processing error; ImageMagick was not found.";
                    winston.log('error', msg);
                    return res.send(500, msg);
                });
            } else {
                winston.info('---> ImageMagick found');
                imageMagick(f.file.path)
                    .resize(null, 128)
                    .write(f.file.path, function (err) {
                        if (err) {
                            winston.log('error', 'imageMagick Error: ' + err);

                            deleteFile(f.file.path, function (err) {
                                if (err) {
                                    winston.log('error', 'deleteFile Error: ' + err);
                                }
                                res.send(400, err);
                            });
                        } else {
                            winston.info(' ---> image posted: ' + f.file.path);
                            res.json({imageUri: f.file.path});
                        }
                    }
                );
            }
        });
    }
};
