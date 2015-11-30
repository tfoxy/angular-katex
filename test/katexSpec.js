describe('katex', function() {
  'use strict';

  var scope, compileAndDigest;

  beforeEach(module('katex', function(katexConfigProvider) {
    katexConfigProvider.errorHandler = function(err) {
      throw err;
    };
  }));

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    compileAndDigest = function(html) {
      var element = angular.element(html);
      $compile(element)(scope);
      scope.$digest();

      return element;
    };
  }));

  describe('tag element directive', function() {

    it('parses what is inside the tag', function() {
      var element = compileAndDigest('<katex>x^2</katex>');
      expect(element.find('mrow').text()).to.equals('x2');
    });

    it('parses the node text, not html', function() {
      var element = compileAndDigest('<katex>&lt;</katex>');
      expect(element.find('mrow').text()).to.equals('<');
    });

  });

  describe('attribute directive', function() {

    it('parses what is inside the tag if attribute has no value', function() {
      var element = compileAndDigest('<div katex>x^3</div>');
      expect(element.find('mrow').text()).to.equals('x3');
    });

    it('parses the attribute value if attribute has a value', function() {
      var element = compileAndDigest('<div katex="x^3"></div>');
      expect(element.find('mrow').text()).to.equals('x3');
    });

    it('renders the expression in display mode if katexOptions is used',
        function() {
          var t = '<div katex="x" katex-options="{displayMode: true}"></div>';
          var element = compileAndDigest(t);
          var displayElement = angular.element(element[0].firstChild);
          assert.isTrue(displayElement.hasClass('katex-display'), element.html());
        });

  });

  describe('attribute bind directive', function() {

    it('parses what is in the scope if attribute has a value', function() {
      scope.tex = {pow: 'x^4'};
      var element = compileAndDigest('<div katex-bind="tex.pow"></div>');
      expect(element.find('mrow').text()).to.equals('x4');
    });

    it('updates the content if scope property is changed', function() {
      scope.tex = 'x^5';
      var element = compileAndDigest('<div katex-bind="tex"></div>');
      scope.tex = '2x';
      scope.$digest();
      expect(element.find('mrow').text()).to.equals('2x');
    });

  });

  /*
  describe('html directive', function() {

    it('parses the html inside the node', function() {
      var element = compileAndDigest('<katex-html>\\&lt;</katex-html>');
      expect(element.find('mrow').text()).to.equals('&lt;');
    });

    it('parses the html in the attribute value', function() {
      var element = compileAndDigest('<div katex-html="\\&lt;"></div>');
      expect(element.find('mrow').text()).to.equals('&lt;');
    });

  });
  */

  describe('katexConfig', function() {

    it('has a defaultOptions that is used as the render options',
        inject(function(katexConfig) {
          katexConfig.defaultOptions = {displayMode: true};
          var element = compileAndDigest('<div katex="x^2"></div>');
          var displayElement = angular.element(element[0].firstChild);
          assert.isTrue(displayElement.hasClass('katex-display'));
        }));

  });

});
