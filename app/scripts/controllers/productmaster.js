app.controller('productMasterCtrl', function($scope, $rootScope, httpService, $http, toastr, commonFunctions,
  $timeout, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $location, LS, $state) {

  commonFunctions.checkUserSession();
  $scope.grid = true;
  $scope.showAddUser = false;
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
    DTColumnDefBuilder.newColumnDef(4),
    DTColumnDefBuilder.newColumnDef(5)
  ];
  /*to hide and show form on clicking add user button*/
  $scope.showForm = function() {
      $scope.grid = false;
      $scope.showAddUser = true;
    }
    /*to back button*/
  $scope.back = function() {
    $scope.grid = true;
    $scope.showAddUser = false;
    $state.reload()
    $scope.clearFn();
  }

  /*to get oem list*/
  $scope.oems = [];
  httpService.getData('/get_oem').then(function(result, error) {
    $scope.oems = result.data;
    // console.log(result.data);
  });
  // toggling in button text of update and submit
  $scope.buttonValue = "Submit"

  /* to get list of added users*/
  $scope.productList = [];
  var productList = function() {
    httpService.getData('/productList').then(function(result) {
      $scope.productList = result.data;
      // console.log("$scope.productList", $scope.productList);
    });
  }
  productList();
  /* Add user details */
  $scope.submitFn = function() {
      $scope.isSubmit = true;
      var userJson = {
          "productName": $scope.productName,
          // "oemName": $scope.oemName,
          "oemId": $scope.oemName,
          "isActive": $scope.isActive,
          "commandType": commandType,
          "productid": $scope.productId
        }
        // console.log(userJson);
      httpService.sendCommand('/insertProduct', userJson)
        .then(function(result) {
          // console.log('55555',result);
          $scope.isSubmit = false;
          if (result.data) {
            commonFunctions.openToastr('success', result.data)
            $scope.clearFn();
            $scope.back();
            productList();
          } else if (result.error) {
            commonFunctions.openToastr('error', result.error)
          } else {
            commonFunctions.openToastr('error', result)
          }

        });
    } //submitFn
    /*cancel or clear function*/
  $scope.clearFn = function() {
    $scope.productName = "";
    $scope.oemName = "";
    $scope.isActive = true;
    $scope.buttonValue = "Submit";
    commandType = "insert";
  };
  // edit function
  $scope.action = function(id) {
    // console.log('test', id, $scope.productList);
    $scope.showForm();
    $scope.buttonValue = "Update";
    commandType = "update";
    var filteredData = _.filter($scope.productList, function(product) {
      return product.id == id;
    })[0]
    // console.log(filteredData);
    $scope.productName = filteredData.productname;
    $scope.isActive = filteredData.isactive;
    $scope.oemName = filteredData.oemid.toString();
    $scope.productId = filteredData.id;
  }
})
