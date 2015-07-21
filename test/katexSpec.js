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
      expect(element.text().slice(0, 2)).to.equals('x2');
    }));

  });

  describe('attribute directive', function() {

    it('parses what is inside the tag if attribute has no value',
        inject(function() {
          var element = compileAndDigest('<div katex>x^3</div>');
          expect(element.text().slice(0, 2)).to.equals('x3');
        }));

  });

  describe('attribute bind directive', function() {

    it('parses what is in the scope if attribute has a value',
        inject(function() {
          scope.tex = {pow: 'x^4'};
          var element = compileAndDigest('<div katex-bind="tex.pow"></div>');
          expect(element.text().slice(0, 2)).to.equals('x4');
        }));

    it('updates the content if scope property is changed', inject(function() {
      scope.tex = 'x^5';
      var element = compileAndDigest('<div katex-bind="tex"></div>');
      scope.tex = '2x';
      scope.$digest();
      expect(element.text().slice(0, 2)).to.equals('2x');
    }));

  });

});
