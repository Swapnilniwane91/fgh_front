app.controller('modelMasterCtrl', function($scope, $rootScope, httpService, $http, toastr, commonFunctions,
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
    $scope.clearFn();
  }

  /*to get oem list*/
  $scope.oems = [];
  httpService.getData('/get_oem').then(function(result, error) {
    $scope.oems = result.data;
    // console.log(result.data);
  });

  $scope.product_list = function(oemid) {
      $scope.productName = '';
      $scope.isSubmit = true;
      var oemid = {
          "oemid": oemid
        }
        httpService.sendCommand('/productList', oemid).then(function(result) {
          $scope.productlist = result.data;
        });
  }

  // toggling in button text of update and submit
  $scope.buttonValue = "Submit"

  /* to get list of added users*/
  $scope.modelList = [];
  var modelList = function() {
    httpService.getData('/modelList').then(function(result) {
      $scope.modelList = result.data;
      // console.log("$scope.productList", $scope.productList);
    });
  }
  
  modelList();
  /* Add user details */
  $scope.submitFn = function() {
      $scope.isSubmit = true;
      var modelJson = {
          "modelId": $scope.modelId || null,
          "modelName": $scope.modelName || '',
          "modelDesc": $scope.modelDesc || '',
          "productId": $scope.productName || null,
          "isActive": $scope.isActive,
          "commandType": commandType,
        }
        // console.log(userJson);
      httpService.sendCommand('/insertModel', modelJson)
        .then(function(result) {
          $scope.isSubmit = false;
          if (result.data) {
            commonFunctions.openToastr('success', result.data)
            $scope.clearFn();
            $scope.back();
            modelList();
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
    $scope.modelName = "";
    $scope.modelDesc = "";
    $scope.modelId = "";
  };
  // edit function
  $scope.action = function(id) {
    // console.log('test', id, $scope.productList);
    $scope.showForm();
    $scope.buttonValue = "Update";
    commandType = "update";
    var filteredData = _.filter($scope.modelList, function(product) {
      return product.id == id;
    })[0]
    
    $scope.oemName = filteredData.oemid.toString();
    
    var oemid = {
      "oemid": $scope.oemName
    }
    httpService.sendCommand('/productList', oemid).then(function(result) {
      $scope.productlist = result.data;
    });
    $scope.productName = filteredData.productid.toString();
    $scope.isActive = filteredData.isactive;
    $scope.modelName = filteredData.modelname;
    $scope.modelDesc = filteredData.modeldesc;
    $scope.modelId = filteredData.id;
  }
})
