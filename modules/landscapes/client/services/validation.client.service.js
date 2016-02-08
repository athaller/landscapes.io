(function () {
    'use strict';


angular.module('landscapes.services')
    .factory('ValidationService', ValidationService);


ValidationService.$inject = ['$resource'];

  function ValidationService($resource) {

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
        }
    }
})();
