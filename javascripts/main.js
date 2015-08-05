angular.module('app', ['katex'])
    .controller('Ctrl', Ctrl);

Ctrl.$inject = ['$scope'];

function Ctrl($scope) {
  'use strict';

  $scope.tex = 'x^2';
}
