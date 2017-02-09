app.controller('taxMasterCtrl', function($scope, $rootScope, httpService, $http, toastr, commonFunctions,
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
  $scope.taxList = [];
  var taxList = function() {
    httpService.getData('/taxList').then(function(result) {
      $scope.taxList = result.data;
      // console.log($scope.taxList);
    });
  }
  taxList();
  /* Add user details */
  $scope.submitFn = function() {
      $scope.isSubmit = true;
      var userJson = {
          "taxType": $scope.taxType,
          "taxPercentage": $scope.taxPercentage,
          "isActive": $scope.isActive,
          "commandType": commandType,
          "taxid": $scope.taxId
        }
        // console.log(userJson);
      httpService.sendCommand('/insertTax', userJson)
        .then(function(result) {
          // console.log('55555',result);
          $scope.isSubmit = false;
          if (result.data) {
            commonFunctions.openToastr('success', result.data)
            $scope.clearFn();
            taxList();
          } else if (result.error) {
            commonFunctions.openToastr('error', result.error)
          } else {
            commonFunctions.openToastr('error', result)
          }

        });
    } //submitFn
    /*cancel or clear function*/
  $scope.clearFn = function() {
    $scope.taxType = "";
    $scope.taxPercentage = "";
    $scope.isActive = true;
    $scope.buttonValue = "Submit";
    commandType = "insert";
    $scope.taxId=0;
  };
  // edit function
  $scope.action = function(id) {
    // console.log('test', id, $scope.problemList);
    $scope.buttonValue = "Update";
    commandType = "update";
    var filteredData = _.filter($scope.taxList, function(tax) {
        return tax.Id == id;
      })[0]
      // console.log(filteredData);
    $scope.taxType = filteredData.type;
    $scope.taxPercentage = filteredData.amountInPercentage;
    $scope.isActive = filteredData.isActive;
    $scope.taxId = filteredData.Id;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
})
