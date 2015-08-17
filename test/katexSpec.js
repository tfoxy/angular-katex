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

    it('parses what is inside the tag', inject(function() {
      var element = compileAndDigest('<katex>x^2</katex>');
      expect(element.find('mrow').text()).to.equals('x2');
    }));

    it('parses the node text, not html', inject(function() {
      var element = compileAndDigest('<katex>&lt;</katex>');
      expect(element.find('mrow').text()).to.equals('<');
    }));

  });

  describe('attribute directive', function() {

    it('parses what is inside the tag if attribute has no value',
        inject(function() {
          var element = compileAndDigest('<div katex>x^3</div>');
          expect(element.find('mrow').text()).to.equals('x3');
        }));

    it('parses the attribute value if attribute has a value',
        inject(function() {
          var element = compileAndDigest('<div katex="x^3"></div>');
          expect(element.find('mrow').text()).to.equals('x3');
        }));

  });

  describe('attribute bind directive', function() {

    it('parses what is in the scope if attribute has a value',
        inject(function() {
          scope.tex = {pow: 'x^4'};
          var element = compileAndDigest('<div katex-bind="tex.pow"></div>');
          expect(element.find('mrow').text()).to.equals('x4');
        }));

    it('updates the content if scope property is changed', inject(function() {
      scope.tex = 'x^5';
      var element = compileAndDigest('<div katex-bind="tex"></div>');
      scope.tex = '2x';
      scope.$digest();
      expect(element.find('mrow').text()).to.equals('2x');
    }));

  });

  describe('html directive', function() {

    it('parses the html inside the node', inject(function() {
      var element = compileAndDigest('<katex-html>\\&lt;</katex-html>');
      expect(element.find('mrow').text()).to.equals('&lt;');
    }));

    it('parses the html in the attribute value', inject(function() {
      var element = compileAndDigest('<div katex-html="\\&lt;"></div>');
      expect(element.find('mrow').text()).to.equals('&lt;');
    }));

  });

});
