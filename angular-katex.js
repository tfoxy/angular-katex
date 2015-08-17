/*!
 * angular-katex v0.5.0
 * https://github.com/tfoxy/angular-katex
 *
 * Copyright 2015 Tomás Fox
 * Released under the MIT license
 */

(function() {
  'use strict';

  angular.module('katex', [])
      .constant('katex', katex)
      .provider('katexConfig', ['katex', function(katex) {
        var self = this;

        self.defaultOptions = {};

        self.errorTemplate = function(err) {
          return '<span class="katex-error">' + err + '</span>';
        };
        self.errorHandler = function(err, expr, element) {
          element.html(self.errorTemplate(err, expr));
        };

        self.render = function(element, expr) {
          try {
            katex.render(expr || '', element[0], self.defaultOptions);
          } catch (err) {
            self.errorHandler(err, expr, element);
          }
        };

        //noinspection JSUnusedGlobalSymbols
        this.$get = function() {
          return this;
        };
      }])
      .directive('katex', ['katexConfig', function(katexConfig) {
        return {
          restrict: 'AE',
          compile: function(element, attrs) {
            katexConfig.render(element, attrs.katex || element.text());
          }
        };
      }])
      .directive('katexBind', ['katexConfig', function(katexConfig) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            var model = attrs.katexBind;

            scope.$watch(model, function(expr) {
              katexConfig.render(element, expr);
            });
          }
        };
      }])
      .directive('katexHtml', ['katexConfig', function(katexConfig) {
        return {
          restrict: 'AE',
          compile: function(element, attrs) {
            var exprElement = attrs.katexHtml ?
                angular.element('<div>' + attrs.katexHtml + '</div>') :
                element;
            katexConfig.render(element, exprElement.html());
          }
        };
      }]);
})();
