'use strict';
var winston = require('winston')
var async = require('async')
var fs = require('fs');
var sys = require('sys');


function readFileSync(path) {
    if (typeof window !== 'undefined') return null;
    return require('fs').readFileSync(path, 'utf-8');
}

var cloudFormationTemplateFileExtensions = ['json','template'];

exports.postCloudFormationTemplate = function (req, res) {
    winston.info(' ---> postCloudFormationTemplate');

    var user = req.user || {name: 'anonymous'};
    winston.info(user.name);

    var f = req.files
    winston.info(f);

    var templateJson = readFileSync(f.file.path)

    // validate template
    // http://docs.aws.amazon.com/cli/latest/reference/cloudformation/validate-template.html

    res.send(readFileSync(f.file.path));
};

exports.postImage = function (req, res) {
    winston.info(' ---> postImage');

    var user = req.user || {name: 'anonymous'};
    winston.info(user.name);

    var f = req.files
    winston.info(f);

    res.json({imageUri: f.file.path});
};
