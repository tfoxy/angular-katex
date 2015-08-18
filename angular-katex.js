/*!
 * angular-katex v0.6.0
 * https://github.com/tfoxy/angular-katex
 *
 * Copyright 2015 Tomás Fox
 * Released under the MIT license
 */

(function() {
  'use strict';

  angular.module('katex', [])
      .constant('katex', katex)
      .factory('katexConfig', katexConfigFactory)
      .directive('katex', katexDirective)
      .directive('katexBind', katexBindDirective)
      .directive('katexHtml', katexHtmlDirective);


  katexConfigFactory.$inject = ['katex', '$document'];

  function katexConfigFactory(katex, $document) {
    var service = {
      defaultOptions: {},
      errorHandler: function(err, expr, element) {
        var span = $document[0].createElement('span');
        span.className = 'katex-error';
        span.textContent = err;
        element.children().remove();
        element.append(span);
      },
      render: function(element, expr, elementOptions) {
        try {
          var options = elementOptions || service.defaultOptions;
          katex.render(expr || '', element[0], options);
        } catch (err) {
          service.errorHandler(err, expr, element);
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
        katexConfig.render(element, expr, options);
      }
    };
  }


  katexBindDirective.$inject = ['katexConfig'];

  function katexBindDirective(katexConfig) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = attrs.katexBind;

        scope.$watch(model, function(expr) {
          var options = getOptions(scope, attrs);
          katexConfig.render(element, expr, options);
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
        katexConfig.render(element, exprElement.html(), options);
      }
    };
  }


  function getOptions(scope, attrs) {
    var katexOptions = attrs.katexOptions;
    return katexOptions && scope.$eval(katexOptions);
  }
})();
