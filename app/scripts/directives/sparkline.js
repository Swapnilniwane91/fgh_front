'use strict';

/**
 * @ngdoc directive
 * @name espApp.directive:sparkline
 * @description
 * # sparkline
 */
app
  .directive('sparkline', [
  function() {
    return {
      restrict: 'A',
      scope: {
        data: '=',
        options: '='
      },
      link: function($scope, $el) {
        var data = $scope.data,
            options = $scope.options,
            chartResize,
            chartRedraw = function() {
              return $el.sparkline(data, options);
            };
        angular.element(window).resize(function() {
          clearTimeout(chartResize);
          chartResize = setTimeout(chartRedraw, 200);
        });
        return chartRedraw();
      }
    };
  }
]);