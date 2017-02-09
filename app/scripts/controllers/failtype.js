app.controller('failTypeCtrl', function($scope, $rootScope, httpService, $http, toastr, commonFunctions,
  $timeout, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $location, LS, $state) {

  commonFunctions.checkUserSession();
  var commandType = 'insert';
  $scope.isActive = true;
  $scope.isSubmit = false;
  $scope.data = {};
  $scope.dtOptions = DTOptionsBuilder.newOptions()
    .withOption('order', [0, "desc"])
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
    DTColumnDefBuilder.newColumnDef(4)
  ];

  // toggling in button text of update and submit
  $scope.buttonValue = "Submit"

  /* to get list of problem list*/
  $scope.failList = [];
  var failList = function() {
    httpService.getData('/failList').then(function(result) {
      $scope.failList = result.data;
      // console.log("$scope.problemList", $scope.problemList);
    });
  }
  failList();
  /* Add user details */
  $scope.submitFn = function() {
      $scope.isSubmit = true;
      var userJson = {
          "failType": $scope.failType,
          "isActive": $scope.isActive,
          "commandType": commandType,
          "failtypeid": $scope.failtypeid
        }
        // console.log(userJson);
      httpService.sendCommand('/insertFailType', userJson)
        .then(function(result) {
          // console.log('55555',result);
          $scope.isSubmit = false;
          if (result.data) {
            commonFunctions.openToastr('success', result.data)
            $scope.clearFn();
            failList();
          } else if (result.error) {
            commonFunctions.openToastr('error', result.error)
          } else {
            commonFunctions.openToastr('error', result)
          }

        });
    } //submitFn
    /*cancel or clear function*/
  $scope.clearFn = function() {
    $scope.failType = "";
    $scope.failtypeid= 0;
    $scope.isActive = true;
    $scope.buttonValue = "Submit";
    commandType = "insert";
  };
  // edit function
  $scope.action = function(id) {
    // console.log('test', id, $scope.failList);
    $scope.buttonValue = "Update";
    commandType = "update";
    var filteredData = _.filter($scope.failList, function(fail) {
      return fail.id == id;
    })[0]
    // console.log(filteredData);
    $scope.failType = filteredData.failtypename;
    $scope.isActive = filteredData.isactive;
    $scope.failtypeid = filteredData.id;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
})
