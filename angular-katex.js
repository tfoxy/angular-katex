/*!
 * angular-katex v0.1.0
 * https://github.com/tfoxy/angular-katex
 *
 * Copyright 2015 Tomás Fox
 * Released under the MIT license
 */

(function() {
  'use strict';

  angular.module('katex', [])
      .provider('katexConfig', function() {
        this.errorTemplate = function(err) {
          return '<span class="katex-error">' + err + '</span>';
        };
        this.errorHandler = function(err, text, element) {
          element.html(this.errorTemplate(err, text));
        };

        //noinspection JSUnusedGlobalSymbols
        this.$get = function() {
          return this;
        };
      })
      .directive('katex', ['katexConfig', function(katexConfig) {
        return {
          restrict: 'AE',
          link: function(scope, element, attrs) {
            var model = attrs.katex;

            var render = function(text) {
              try {
                katex.render(text || '', element[0]);
              } catch (err) {
                katexConfig.errorHandler(err, text, element);
              }
            };

            if (model) {
              scope.$watch(model, render);
            } else {
              render(element.html());
            }
          }
        };
      }]);
})();
