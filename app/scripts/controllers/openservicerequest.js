app.controller('openSRCtrl', function($scope, $rootScope, httpService, toastr, commonFunctions,
  $timeout, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $mdDialog) {
  $scope.ticket = false;
  $scope.isSubmit = false;
  $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withPaginationType('full_numbers')
    .withBootstrap()
    // Activate col reorder plugin
    .withColReorder();

  $scope.dtColumnDefs = [
    DTColumnDefBuilder.newColumnDef(0),
    DTColumnDefBuilder.newColumnDef(1),
    DTColumnDefBuilder.newColumnDef(2),
    DTColumnDefBuilder.newColumnDef(3),
    DTColumnDefBuilder.newColumnDef(4),
    DTColumnDefBuilder.newColumnDef(5)
  ];
  $scope.data = {};
  $scope.data.star = {};
  $scope.SRData = [];
  /*get data in data table*/
  $scope.openReq = function() {
    $scope.ticket = false;
    httpService.getData('/getOpenRequest').then(function(result, error) {
      $scope.SRData = result.data;
    });
  };
  $scope.openReq();
  // get feedback
  httpService.getData('/getfeedback').then(function(result, error) {
    $scope.feedback = result.data;
    // console.log($scope.feedback);
  });
  // view feedback section
  $scope.show = false;
  $scope.list = true;
  $scope.view = function(TicketNumber, id) {
    $scope.ticket = true;
    $scope.show = !$scope.show;
    $scope.list = !$scope.list;
    $scope.feedBackId = id;
    $scope.ticketnumbershow = TicketNumber;
  }

  // closeRequest function
  $scope.closeReq = function() {
    $scope.isSubmit = true;
    var temp = {
      "headid": $scope.feedBackId,
      "receivedby": $scope.data.recievedBy,
      "remarks": $scope.data.remarks,
      "ratings": $scope.data.star
    };
    httpService.sendCommand('/closerequest', {
      data: temp
    }).then(function(result, error) {
      $scope.isSubmit = false;
      // console.log('55555',result);
      if (result && result.message) {
        toastr.success(result.message, {
          progressBar: true,
          closeButton: true
        });
        $scope.ticket = false;
        $scope.show = false;
        $scope.list = true;
        $scope.openReq();
      } else {
        toastr.error(result, {
          progressBar: true,
          closeButton: true
        });
      }
      $scope.clear();
    });
  };
  //clear function
  $scope.clear = function() {
      $scope.data.recievedBy = "";
      $scope.data.remarks = "";
      $scope.data.star = {};
      // $scope.show = false;
      // $scope.list = true;
    }
    // back button
  $scope.back = function() {
    $scope.ticket = false;
    $scope.show = false;
    $scope.list = true;
    $scope.clear();
  }
})
