app.controller('claimApprovalCtrl', function($scope, $rootScope, httpService, $http, toastr, commonFunctions, $timeout, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $location, LS) {

  commonFunctions.checkUserSession();

  $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withPaginationType('full_numbers')
    .withBootstrap()
    // Activate col reorder plugin
    .withColReorder()
    //withPaginationType('full_numbers').withDisplayLength(2);

  $scope.dtColumnDefs = [
    DTColumnDefBuilder.newColumnDef(0),
    DTColumnDefBuilder.newColumnDef(1),
    DTColumnDefBuilder.newColumnDef(2),
    DTColumnDefBuilder.newColumnDef(3),
    DTColumnDefBuilder.newColumnDef(4),
    DTColumnDefBuilder.newColumnDef(5),
    DTColumnDefBuilder.newColumnDef(6)
  ];

  $scope.claimData = [];
  /*calling  all claim api to get data*/
  httpService.getData('/getAllClaims').then(function(result, error) {
    $scope.claimData = result.data;
  });

  $rootScope.data.viewClaimData = [];
  $scope.view = function(ticketNumber) {
    var ticketNumberObj = {
      "data": {
        "ticketNumber": ticketNumber
      }
    };
    // post command to view a particular claim in another page
    httpService.sendCommand('/viewclaim', ticketNumberObj)
      .then(function(result, err) {
        $rootScope.data.viewClaimData = result;
        LS.setData($rootScope.data);
        $location.path('/insurance/viewClaim');
      });

  }
})
