'use strict';

/**
 * @ngdoc function
 * @name espApp.controller:PagesChatCtrl
 * @description
 * # PagesChatCtrl
 * Controller of the espApp
 */
app
  .controller('ChatCtrl', function ($scope, $resource) {
    $scope.inbox = $resource('scripts/jsons/chats.json').query();

    $scope.archive = function(index) {
      $scope.inbox.splice(index, 1);
    };
  });
