app.controller('ticketDetailsCtrl', function ($scope, $state, $rootScope, $location, httpService, LS, toastr, commonFunctions, DTOptionsBuilder, DTColumnBuilder, $window) {
  commonFunctions.checkUserSession();
  $scope.tickets = [];
  $scope.tickets = $rootScope.ticketsDtls;

  var ticketNo = $scope.tickets[0].ticketnumber;

// console.log('td ', ticketNo);
  var ticketNumberObj = {
    "data": {
      "ticketNumber": ticketNo
    }
  };
  //Ticket Details
  httpService.sendCommand('/ticketDetails/' + ticketNo, {})
    .then(function (result, err) {
      $rootScope.ticketsDtls = result.data;
    });

  //problemCatAndDescription
  httpService.sendCommand('/problemCatAndDescription', ticketNumberObj)
    .then(function (result, err) {
      $rootScope.problemCatAndDescription = result.data;
    });
  //AssignmentDetails
  httpService.sendCommand('/AssignmentDetails', ticketNumberObj)
    .then(function (result, err) {
      $rootScope.AssignmentDetails = result.data;
    });

  /* back button */
  $scope.back = function () {
    $window.history.back();
  }

});