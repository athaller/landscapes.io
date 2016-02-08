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
    async = require('async'),
    fs = require('fs'),
    gm = require('gm'),
    imageMagick = gm.subClass({ imageMagick: true });


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
    winston.info('Uploading posting cloudFormationTemplate');

    var user = req.user || {name: 'anonymous'};

    if(!req.file){
        return res.send(500, 'No Files Uploaded');
    }
    var f = req.file;

    // validate template
    // http://docs.aws.amazon.com/cli/latest/reference/cloudformation/validate-template.html

    var templateJson = readFileSync(f.path);

    if(tryParseJSON(templateJson)) {
        winston.info('JSON is valid: ' + f.path);
        deleteFile(f.path, function (err) {
            if (err) {
                winston.log('error', 'deleteFile Error: ' + err);
            }
            res.send(templateJson);
        });
    } else {
        winston.log('error', 'invalid JSON: ' + f.path);
        deleteFile(f.path, function (err) {
            if (err) {
                winston.log('error', 'deleteFile Error: ' + err);
            }
            res.send(400, {msg: 'File \"' + f.name + '\"' + ' does not contain a valid AWS CloudFormation Template.' } );
        });
    }
};


exports.postImage = function (req, res) {
    winston.info('Uploading Image image');

    //Move this to Policy
    //var user = req.user.userInfo;
    //if(user === undefined) {
    //    return res.send(401);
    //}
    if(!req.file){
        return res.send(500, 'No Files Uploaded');
    }
    var f = req.file;

    var mimetype = ['image/png','image/jpg','image/jpeg'];
    if(mimetype.indexOf(f.mimetype) === -1) {
        deleteFile(f.path, function(err) {
            if(err) { winston.log('error', err); }
            res.send(400, {msg: 'Images of type \"' + f.mimetype + '\"' + ' are not supported; use \"png\" or \"jpg\".' } );
        });
    } else {
        var exec = require('child_process').exec;
        exec("convert -version", function (err) {
            if (err) {
                winston.log('error', err);
                deleteFile(f.path, function (err) {
                    if (err) {
                        winston.log('error', err);
                    }
                    var msg = "Image processing error; ImageMagick was not found.";
                    winston.log('error', msg);
                    return res.send(500, msg);
                });
            } else {
                winston.info('---> ImageMagick found');
                imageMagick(f.path)
                    .resize(null, 128)
                    .write(f.path, function (err) {
                        if (err) {
                            winston.log('error', 'imageMagick Error: ' + err);

                            deleteFile(f.path, function (err) {
                                if (err) {
                                    winston.log('error', 'deleteFile Error: ' + err);
                                }
                                res.send(400, err);
                            });
                        } else {
                            winston.info(' ---> image posted: ' + f.path);
                            res.json({imageUri: f.path});
                        }
                    }
                );
            }
        });
    }
};
