/*!
 * angular-katex v0.8.2
 * https://github.com/tfoxy/angular-katex
 *
 * Copyright 2015 Tomás Fox
 * Released under the MIT license
 */

(function() {
  'use strict';

  angular.module('katex', [])
      .constant('katex', katex)
      .constant('renderMathInElement', getRenderMathInElement())
      .provider('katexConfig', katexConfigProvider)
      .directive('katex', katexDirective)
      .directive('katexBind', katexBindDirective);
  // These directives are not being used
  //  .directive('katexHtmlBind', katexHtmlBindDirective)
  //  .directive('katexHtml', katexHtmlDirective);


  function getRenderMathInElement() {
    return typeof renderMathInElement !== 'undefined' ?
        renderMathInElement :
        undefined;
  }


  katexConfigProvider.$inject = ['katex', 'renderMathInElement'];

  function katexConfigProvider(katex, renderMathInElement) {
    var service = {
      $get: function() {return service;},
      defaultOptions: {},
      errorElement: '<span class="katex-error"></span>',
      errorHandler: function(err, expr, element) {
        var span = angular.element(service.errorElement);
        span.text(err);
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
      },
      autoRender: function(element, elementOptions, errorHandler) {
        try {
          var options = elementOptions || service.defaultOptions;
          renderMathInElement(element[0], options);
        } catch (err) {
          errorHandler(err, null, element);
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
        var options = getOptions($rootScope, attrs);
        var errorHandler = getErrorHandler($rootScope, attrs, katexConfig);
        if ('katexAutoRender' in attrs) {
          if (attrs.katex) {
            element.text(attrs.katex);
          }
          katexConfig.autoRender(element, options, errorHandler);
        } else {
          var expr = attrs.katex || element.text();
          katexConfig.render(element, expr, options, errorHandler);
        }
      }
    };
  }


  katexBindDirective.$inject = ['katexConfig'];

  function katexBindDirective(katexConfig) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var errorHandler = getErrorHandler(scope, attrs, katexConfig);

        scope.$watch(attrs.katexBind, function(expr) {
          var options = getOptions(scope, attrs);
          if ('katexAutoRender' in attrs) {
            element.text(expr);
            katexConfig.autoRender(element, options, errorHandler);
          } else {
            katexConfig.render(element, expr, options, errorHandler);
          }
        });
      }
    };
  }


  /*
  katexHtmlBindDirective.$inject = ['katexConfig'];

  function katexHtmlBindDirective(katexConfig) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var errorHandler = getErrorHandler(scope, attrs, katexConfig);

        scope.$watch(attrs.katexHtmlBind, function(expr) {
          var options = getOptions(scope, attrs);
          if ('katexAutoRender' in attrs) {
            element.html(expr);
            katexConfig.autoRender(element, options, errorHandler);
          } else {
            var exprElement = angular.element('<div>' + expr + '</div>');
            var htmlExpr = exprElement.html();
            katexConfig.render(element, htmlExpr, options, errorHandler);
          }
        });
      }
    };
  }


  katexHtmlDirective.$inject = ['katexConfig', '$rootScope'];

  function katexHtmlDirective(katexConfig, $rootScope) {
    return {
      restrict: 'AE',
      compile: function(element, attrs) {
        var options = getOptions($rootScope, attrs);
        var errorHandler = getErrorHandler($rootScope, attrs, katexConfig);
        if ('katexAutoRender' in attrs) {
          katexConfig.autoRender(element, options, errorHandler);
        } else {
          var exprElement = attrs.katexHtml ?
              angular.element('<div>' + attrs.katexHtml + '</div>') :
              element;
          var expr = exprElement.html();
          katexConfig.render(element, expr, options, errorHandler);
        }
      }
    };
  }
  */

  function getOptions(scope, attrs) {
    var katexOptions = attrs.katexOptions;
    return katexOptions && scope.$eval(katexOptions);
  }


  function getErrorHandler(scope, attrs, katexConfig) {
    if ('katexOnError' in attrs) {
      return function katexOnErrorFn(err, expr, element) {
        scope.$eval(attrs.katexOnError, {
          $err: err,
          $expr: expr,
          $setText: function(text) {
            element.text(text);
          }
        });
      };
    } else {
      return katexConfig.errorHandler;
    }
  }
})();
