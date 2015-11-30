describe('katexError', function() {
  'use strict';

  var scope, compileAndDigest;

  beforeEach(module('katex'));

  beforeEach(inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    compileAndDigest = function(html) {
      var element = angular.element(html);
      $compile(element)(scope);
      scope.$digest();

      return element;
    };
  }));

  describe('when there is an error', function() {

    it('inserts a node with katex-error class', function() {
      var element = compileAndDigest('<div katex="\\"></div>');
      assert.isTrue(element.children().hasClass('katex-error'), element.html());
    });

    it('inserts a node with the error text', function() {
      var element = compileAndDigest('<div katex="\\"></div>');
      expect(element.text()).to.match(/^ParseError: /);
    });

    it('evaluates katexOnError if present', function() {
      var t = '<div katex="\\" katex-on-error="$setText(\'E:\'+$expr)"></div>';
      var element = compileAndDigest(t);
      expect(element.text()).to.equal('E:\\');
    });

  });
});
