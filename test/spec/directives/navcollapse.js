'use strict';

describe('Directive: navCollapse', function () {

  // load the directive's module
  beforeEach(module('espApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<nav-collapse></nav-collapse>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the navCollapse directive');
  }));
});
