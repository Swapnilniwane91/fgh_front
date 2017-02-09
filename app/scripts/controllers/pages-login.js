'use strict';

/**
 * @ngdoc function
 * @name espApp.controller:PagesLoginCtrl
 * @description
 * # PagesLoginCtrl
 * Controller of the espApp
 */
app
  .controller('LoginCtrl', function ($scope, $state) {
    $scope.login = function() {
      $state.go('app.dashboard');
    };
  });
