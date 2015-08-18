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

  it('inserts a node with katex-error class when there is an error', function() {
    var element = compileAndDigest('<div katex="\\"></div>');
    assert.isTrue(element.children().hasClass('katex-error'));
  });
});
