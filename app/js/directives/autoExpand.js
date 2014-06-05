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

// <textarea ng-auto-expand></textarea>

angular.module('landscapesApp')
    .directive('ngAutoExpand', function() {
        return function(scope, element, attr) {
            var minHeight, paddingLeft, paddingRight, $shadow = null;

            function createShadow(){
                minHeight = element[0].offsetHeight;
                if (minHeight === 0)
                    return ;
                paddingLeft = element.css('paddingLeft');
                paddingRight = element.css('paddingRight');

                $shadow = angular.element('<div></div>').css({
                    position: 'absolute',
                    top: -10000,
                    left: -10000,
                    width: element[0].offsetWidth - parseInt(paddingLeft ? paddingLeft : 0, 10) - parseInt(paddingRight ? paddingRight : 0, 10),
                    fontSize: element.css('fontSize'),
                    fontFamily: element.css('fontFamily'),
                    lineHeight: element.css('lineHeight'),
                    resize: 'none'
                });
                angular.element(document.body).append($shadow);
            }

            var update = function() {
                if ($shadow === null)
                    createShadow();
                if ($shadow === null)
                    return ;
                var times = function(string, number) {
                    for (var i = 0, r = ''; i < number; i++) {
                        r += string;
                    }
                    return r;
                };

                var val = element.val().replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/&/g, '&amp;')
                    .replace(/\n$/, '<br/>&nbsp;')
                    .replace(/\n/g, '<br/>')
                    .replace(/\s{2,}/g, function(space) { return times('&nbsp;', space.length - 1) + ' '; });
                $shadow.html(val);

                element.css('height', Math.max($shadow[0].offsetHeight + 30, minHeight) + 'px');
            };

            element.bind('keyup keydown keypress change focus', update);
            scope.$watch(attr.ngModel, update);
            scope.$watch(function(){ return element[0].style.display != 'none'; }, update);
        };
    });