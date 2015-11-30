describe('katexAutoRender', function() {
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

    it('does not renders math without delimiters', function() {
      var t = '<katex katex-auto-render>x^2</katex>';
      var element = compileAndDigest(t);
      expect(element.text()).to.equals('x^2');
    });

    it('renders math with delimiters', function() {
      var t = '<katex katex-auto-render>$$x^3$$</katex>';
      var element = compileAndDigest(t);
      expect(element.find('mrow').text()).to.equals('x3');
    });

    it('renders multiple math formulas with delimiters', function() {
      var t = '<katex katex-auto-render>$$x^4$$ + $$x^5$$</katex>';
      var element = compileAndDigest(t);
      var formulas = element.find('mrow');
      expect(formulas).to.have.length(2);
      expect(formulas[0].textContent).to.equal('x4');
      expect(formulas[1].textContent).to.equal('x5');
    });

    it('renders math inside child nodes', function() {
      var t = '<katex katex-auto-render><div>$$x^6$$</div></katex>';
      var element = compileAndDigest(t);
      expect(element.find('mrow').text()).to.equals('x6');
    });

  });

  describe('attribute directive', function() {

    it('inserts attribute value as text if attribute has a value', function() {
      var element = compileAndDigest('<div katex="x^3" katex-auto-render></div>');
      expect(element.text()).to.equals('x^3');
    });

    it('renders math in the attribute value', function() {
      var element = compileAndDigest('<div katex="$$x^4$$" katex-auto-render></div>');
      expect(element.find('mrow').text()).to.equals('x4');
    });

  });

  describe('attribute bind directive', function() {

    it('does not renders math without delimiters', function() {
      scope.tex = 'x^2';
      var t = '<div katex-bind="tex" katex-auto-render></div>';
      var element = compileAndDigest(t);
      expect(element.text()).to.equals('x^2');
    });

    it('renders math with delimiters', function() {
      scope.tex = '$$x^3$$';
      var t = '<div katex-bind="tex" katex-auto-render></div>';
      var element = compileAndDigest(t);
      expect(element.find('mrow').text()).to.equals('x3');
    });

    it('renders multiple math formulas with delimiters', function() {
      scope.tex = '$$x^4$$ + $$x^5$$';
      var t = '<div katex-bind="tex" katex-auto-render></div>';
      var element = compileAndDigest(t);
      var formulas = element.find('mrow');
      expect(formulas).to.have.length(2);
      expect(formulas[0].textContent).to.equal('x4');
      expect(formulas[1].textContent).to.equal('x5');
    });

    it('does not renders html', function() {
      scope.tex = '<div>$$x^6$$</div>';
      var t = '<div katex-bind="tex" katex-auto-render></div>';
      var element = compileAndDigest(t);
      expect(element.text().slice(0, 5)).to.equals('<div>');
    });

  });
});
