app.controller('pageMasterCtrl', function($scope, $rootScope, httpService, $http, toastr, commonFunctions,
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
    DTColumnDefBuilder.newColumnDef(5),
    DTColumnDefBuilder.newColumnDef(6)
  ];

  // toggling in button text of update and submit
  $scope.buttonValue = "Submit"

  /* to get list of problem list*/
  $scope.pageList = [];
  var pageList = function() {
    httpService.getData('/pageList').then(function(result) {
      $scope.pageList = result.data;
      console.log("$scope.pageList", $scope.pageList);
    });
  }
  pageList();
  /* Add user details */
  $scope.submitFn = function() {
      $scope.isSubmit = true;
      var userJson = {
          "pageName": $scope.pageName,
          "pageDesc": $scope.pageDesc,
          "pageUrl": $scope.pageUrl,
          "isActive": $scope.isActive,
          "pageid": $scope.pageId,
          "commandType": commandType
        }
        console.log(userJson);
      httpService.sendCommand('/insertPage', userJson)
        .then(function(result) {
          // console.log('55555',result);
          $scope.isSubmit = false;
          if (result.data) {
            commonFunctions.openToastr('success', result.data)
            $scope.clearFn();
            pageList();
          } else if (result.error) {
            commonFunctions.openToastr('error', result.error)
          } else {
            commonFunctions.openToastr('error', result)
          }

        });
    } //submitFn
    /*cancel or clear function*/
  $scope.clearFn = function() {
    $scope.pageName = "";
    $scope.pageDesc = "";
    $scope.pageUrl = "";
    $scope.pageId= 0;
    $scope.isActive = true;
    $scope.buttonValue = "Submit";
    commandType = "insert";
  };
  // edit function
  $scope.action = function(id) {
    // console.log('test', id, $scope.problemList);
    $scope.buttonValue = "Update";
    commandType = "update";
    var filteredData = _.filter($scope.pageList, function(page) {
      return page.id == id;
    })[0]
    console.log(filteredData);
    $scope.pageName= filteredData.pagename;
    $scope.pageDesc= filteredData.pagedesc;
    $scope.pageUrl= filteredData.pageurl;
    $scope.isActive= filteredData.isactive;
    $scope.pageId = filteredData.id;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
})
