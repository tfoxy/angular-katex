describe('katex directive', function() {
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

  describe('expr attribute', function() {

    it('should render its value', function() {
      var element = compileAndDigest('<katex expr="x^2"/>');
      expect(element.find('mrow').text()).to.equals('x2');
    });

    it('should render html entities ', function() {
      var element = compileAndDigest('<katex expr="1&lt;2"/>');
      expect(element.find('mrow').text()).to.equals('1<2');
    });

    it('should render html tags as text', function() {
      var element = compileAndDigest('<katex expr="<div>"/>');
      expect(element.find('mrow').text()).to.equals('<div>');
    });

    describe('with htmlMode attribute', function() {

      it('should render html entities as text', function() {
        var element = compileAndDigest('<katex expr="\\&lt;" html-mode/>');
        expect(element.find('mrow').text()).to.equals('&lt;');
      });

      it('should translate symbols to html entities', function() {
        var element = compileAndDigest('<katex expr="\\<" html-mode/>');
        expect(element.find('mrow').text()).to.equals('&lt;');
      });

    });

    describe('with displayMode attribute', function() {

      it('should render the equation in display mode', function() {
        var element = compileAndDigest('<katex expr="x^2" display-mode/>');
        var displayElement = angular.element(element[0].firstChild);
        assert.isTrue(displayElement.hasClass('katex-display'));
      });

    });

    describe('with options attribute', function() {

      it('should render the equation in display mode if displayMode is true', function() {
        var t = '<katex expr="x^2" options="{displayMode: true}"/>';
        var element = compileAndDigest(t);
        var displayElement = angular.element(element[0].firstChild);
        assert.isTrue(displayElement.hasClass('katex-display'));
      });

    });

    describe('with autoRender attribute', function() {

      it('should render the expression as html without htmlMode', function() {
        var expr = '<span>x^2</span><span>$$x^2$$</span>';
        var element = compileAndDigest('<katex auto-render>' + expr + '</katex>');
        var spans = element.find('span');
        expect(spans.eq(0).text()).to.equals('x^2');
        expect(spans.eq(1).find('mrow').text()).to.equals('x2');
      });

    });

    describe('with onError attribute', function() {

      it('is evaluated if expression has an error', function() {
        var t = '<katex expr="\\" on-error="$setText(\'E:\'+$expr)"/>';
        var element = compileAndDigest(t);
        expect(element.text()).to.equal('E:\\');
      });

    });

  });

  describe('bind attribute', function() {

    it('should render its value if it is a string', function() {
      var element = compileAndDigest('<katex bind="\'x^2\'"/>');
      expect(element.find('mrow').text()).to.equals('x2');
    });

    it('should render its scope value', function() {
      scope.tex = 'x^2';
      var element = compileAndDigest('<katex bind="tex"/>');
      expect(element.find('mrow').text()).to.equals('x2');
    });

    it('should watch changes in the scope value', function() {
      scope.tex = 'x^2';
      var element = compileAndDigest('<katex bind="tex"/>');
      scope.tex = 'x^3';
      scope.$digest();
      expect(element.find('mrow').text()).to.equals('x3');
    });

    it('should not render html entities in scope value', function() {
      scope.tex = '\\&lt;';
      var element = compileAndDigest('<katex bind="tex"/>');
      expect(element.find('mrow').text()).to.equals('&lt;');
    });

    describe('with autoRender attribute', function() {

      it('should render its scope value as html without htmlMode', function() {
        scope.tex = '<span>x^2</span><span>$$x^2$$</span>';
        var element = compileAndDigest('<katex bind="tex" auto-render/>');
        var spans = element.find('span');
        expect(spans.eq(0).text()).to.equals('x^2');
        expect(spans.eq(1).find('mrow').text()).to.equals('x2');
      });

      it('should render its scope value as text with htmlMode set to false', function() {
        scope.tex = '<span>x^2</span><span>$$x^2$$</span>';
        var element = compileAndDigest('<katex bind="tex" auto-render html-mode="false"/>');
        var startsWithStr = '<span>x^2</span><span>';
        expect(element.text().slice(0, startsWithStr.length)).to.equals(startsWithStr);
        expect(element.find('mrow').text()).to.equals('x2');
      });

    });

  });

});
