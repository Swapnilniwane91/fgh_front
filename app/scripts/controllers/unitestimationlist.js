app.controller('unitestimationlistCtrl', function($scope, $rootScope, httpService, $http, toastr, commonFunctions, $timeout, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $location) {
  $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withPaginationType('full_numbers')
    .withBootstrap()
    // Activate col reorder plugin
    .withColReorder()


  $scope.dtColumnDefs = [
    DTColumnDefBuilder.newColumnDef(0),
    DTColumnDefBuilder.newColumnDef(1),
    DTColumnDefBuilder.newColumnDef(2),
    DTColumnDefBuilder.newColumnDef(3),
    DTColumnDefBuilder.newColumnDef(4)
    // DTColumnDefBuilder.newColumnDef(5)
  ];

  $scope.SRData = [];
  /*get data in data table*/
  httpService.getData('/unitEstimation').then(function(result, error) {
    $scope.SRData = result.data;
  });

  $scope.estimate = function(data) {
    $rootScope.viewData = data;
    $location.path('/transaction/viewEstimate');
  }
})
