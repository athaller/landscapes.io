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
    console.log('cloudFormationTemplate');

    var user = req.user || 'anonymous';
    console.log(user);

    var f = req.files
    console.log(f);
    console.log(f.file.path);

    // parse json
    console.log(readFileSync(f.file.path));
    var templateJson = readFileSync(f.file.path)

    // validate template
    // http://docs.aws.amazon.com/cli/latest/reference/cloudformation/validate-template.html

    winston.log('info', f.file.path);
    winston.log('info', templateJson);
    res.send(readFileSync(f.file.path));

};

exports.postImage = function (req, res) {
    console.log('cloudFormationTemplate')

    var user = req.user || 'anonymous';
    console.log(user)

    console.log(req.files);

    res.send({image: true});
};
