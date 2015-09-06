describe('katexConfigProvider', function() {
  'use strict';

  var provider;

  beforeEach(module('katex', function(katexConfigProvider) {
    provider = katexConfigProvider;
  }));

  // Kick off the above function
  beforeEach(inject(function() {}));

  it('has an errorHandler function', function() {
    expect(provider).to.have.property('errorHandler')
        .that.is.a('function');
  });

  it('has a defaultOptions object', function() {
    expect(provider).to.have.property('defaultOptions')
        .that.is.an('object');
  });
});
