/*!
 * angular-katex v0.7.0
 * https://github.com/tfoxy/angular-katex
 *
 * Copyright 2015 Tomás Fox
 * Released under the MIT license
 */

(function() {
  'use strict';

  angular.module('katex', [])
      .constant('katex', katex)
      .provider('katexConfig', katexConfigProvider)
      .directive('katex', katexDirective)
      .directive('katexBind', katexBindDirective)
      .directive('katexHtml', katexHtmlDirective);


  katexConfigProvider.$inject = ['katex'];

  function katexConfigProvider(katex) {
    var service = {
      $get: function() {return service;},
      defaultOptions: {},
      errorHandler: function(err, expr, element) {
        var span = angular.element('<span class="katex-error"></span>');
        span.textContent = err;
        element.children().remove();
        element.append(span);
      },
      render: function(element, expr, elementOptions, errorHandler) {
        try {
          var options = elementOptions || service.defaultOptions;
          katex.render(expr || '', element[0], options);
        } catch (err) {
          errorHandler(err, expr, element);
        }
      }
    };

    return service;
  }


  katexDirective.$inject = ['katexConfig', '$rootScope'];

  function katexDirective(katexConfig, $rootScope) {
    return {
      restrict: 'AE',
      compile: function(element, attrs) {
        var expr = attrs.katex || element.text();
        var options = getOptions($rootScope, attrs);
        var errorHandler = getErrorHandler($rootScope, attrs, katexConfig);
        katexConfig.render(element, expr, options, errorHandler);
      }
    };
  }


  katexBindDirective.$inject = ['katexConfig'];

  function katexBindDirective(katexConfig) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = attrs.katexBind;
        var errorHandler = getErrorHandler(scope, attrs, katexConfig);

        scope.$watch(model, function(expr) {
          var options = getOptions(scope, attrs);
          katexConfig.render(element, expr, options, errorHandler);
        });
      }
    };
  }


  katexHtmlDirective.$inject = ['katexConfig', '$rootScope'];

  function katexHtmlDirective(katexConfig, $rootScope) {
    return {
      restrict: 'AE',
      compile: function(element, attrs) {
        var exprElement = attrs.katexHtml ?
            angular.element('<div>' + attrs.katexHtml + '</div>') :
            element;
        var options = getOptions($rootScope, attrs);
        var errorHandler = getErrorHandler($rootScope, attrs, katexConfig);
        katexConfig.render(element, exprElement.html(), options, errorHandler);
      }
    };
  }


  function getOptions(scope, attrs) {
    var katexOptions = attrs.katexOptions;
    return katexOptions && scope.$eval(katexOptions);
  }


  function getErrorHandler(scope, attrs, katexConfig) {
    var katexOnError = attrs.katexOnError;

    if (katexOnError) {
      return function katexOnErrorFn(err, expr, element) {
        scope.$eval(katexOnError, {
          $err: err,
          $expr: expr,
          $setText: function(text) {
            element.text(text);
          }
        });
      };
    }

    return katexConfig.errorHandler;
  }
})();
