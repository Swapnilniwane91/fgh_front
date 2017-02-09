app.controller('roleMasterCtrl', function($scope, $rootScope, httpService, $http, toastr, commonFunctions,
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
  $scope.roleList = [];
  var roleList = function() {
    httpService.getData('/roleList').then(function(result) {
      $scope.roleList = result.data;
      // console.log("$scope.roleList", $scope.roleList);
    });
  }
  roleList();
  /* Add user details */
  $scope.submitFn = function() {
      $scope.isSubmit = true;
      var userJson = {
          "roleName": $scope.roleName,
          "isActive": $scope.isActive,
          "commandType": commandType,
          "roleid": $scope.roleId
        }
        // console.log(userJson);
      httpService.sendCommand('/insertRole', userJson)
        .then(function(result) {
          // console.log('55555',result);
          $scope.isSubmit = false;
          if (result.data) {
            commonFunctions.openToastr('success', result.data)
            $scope.clearFn();
            roleList();
          } else if (result.error) {
            commonFunctions.openToastr('error', result.error)
          } else {
            commonFunctions.openToastr('error', result)
          }

        });
    } //submitFn
    /*cancel or clear function*/
  $scope.clearFn = function() {
    $scope.roleName = "";
    $scope.roleId= 0;
    $scope.isActive = true;
    $scope.buttonValue = "Submit";
    commandType = "insert";
  };
  // edit function
  $scope.action = function(id) {
    // console.log('test', id, $scope.problemList);
    $scope.buttonValue = "Update";
    commandType = "update";
    var filteredData = _.filter($scope.roleList, function(role) {
      return role.id == id;
    })[0]
    // console.log(filteredData);
    $scope.roleName = filteredData.rolename;
    $scope.isActive = filteredData.isactive;
    $scope.roleId = filteredData.id;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
})
