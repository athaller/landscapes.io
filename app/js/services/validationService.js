'use strict';

angular.module('landscapesApp')
    .factory('ValidationService', function ($rootScope) {

        return {

            tryParseJSON: function (jsonString) {
                try {
                    var o = JSON.parse(jsonString);

                    if (o && typeof o === "object" && o !== null) {
                        return o;
                    }
                }
                catch (e) { }

                return false;
            },

            isValidCloudFormationTemplate: function (template) {
                // call AWS CloudFormation ValidateTemplate
                return true;
            }
        };
    });