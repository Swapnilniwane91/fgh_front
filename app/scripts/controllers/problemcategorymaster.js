app.controller('problemCategoryCtrl', function($scope, $rootScope, httpService, $http, toastr, commonFunctions,
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
    DTColumnDefBuilder.newColumnDef(4),
    DTColumnDefBuilder.newColumnDef(5)
  ];

  // toggling in button text of update and submit
  $scope.buttonValue = "Submit"

  /* to get list of problem list*/
  $scope.problemCatList = [];
  var problemList = function() {
    httpService.getData('/problemCategoryList').then(function(result) {
      $scope.problemCatList = result.data;
    });
  }
  problemList();
  /* Add user details */
  $scope.submitFn = function() {
      $scope.isSubmit = true;
      var userJson = {
          "problemCatCode": $scope.problemCatCode,
          "problemCatName": $scope.problemCatName,
          "isActive": $scope.isActive,
          "commandType": commandType,
          "problemid": $scope.problemId
        }
        // console.log(userJson);
      httpService.sendCommand('/insertProblemCategory', userJson)
        .then(function(result) {
          // console.log('55555',result);
          $scope.isSubmit = false;
          if (result.data) {
            commonFunctions.openToastr('success', result.data)
            $scope.clearFn();
            problemList();
          } else if (result.error) {
            commonFunctions.openToastr('error', result.error)
          } else {
            commonFunctions.openToastr('error', result)
          }

        });
    } //submitFn
    /*cancel or clear function*/
  $scope.clearFn = function() {
    $scope.problemCatCode = "";
    $scope.problemCatName = "";
    $scope.isActive = true;
    $scope.buttonValue = "Submit";
    commandType = "insert";
  };
  // edit function
  $scope.action = function(id) {
    // console.log('test', id, $scope.problemList);
    $scope.buttonValue = "Update";
    commandType = "update";
    var filteredData = _.filter($scope.problemCatList, function(problem) {
        return problem.id == id;
      })[0]
      // console.log(filteredData);
    $scope.problemCatCode = filteredData.problemcatcode;
    $scope.problemCatName = filteredData.problemcatname;
    $scope.isActive = filteredData.isactive;
    $scope.problemId = filteredData.id;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
})
