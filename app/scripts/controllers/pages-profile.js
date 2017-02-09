'use strict';

/**
 * @ngdoc function
 * @name espApp.controller:PagesProfileCtrl
 * @description
 * # PagesProfileCtrl
 * Controller of the espApp
 */
app
  .controller('ProfileCtrl', function ($scope) {
    $scope.page = {
      title: 'Profile Page',
      subtitle: 'Place subtitle here...'
    };
  });
