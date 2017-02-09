app.controller('NavCtrl', function ($scope, $state, $rootScope, $location, httpService, LS, toastr,commonFunctions, $q) {
  commonFunctions.checkUserSession();
  $scope.oneAtATime = false;

  $scope.status = {
    isFirstOpen: true,
    isSecondOpen: true,
    isThirdOpen: true
  };

  $scope.fName = $rootScope.currentUser.response.fName;
  $scope.lName = $rootScope.currentUser.response.lName;
  $rootScope.logout = function () {
     httpService.getData("/logout")
      .then(function(loginRes) {
        var flag = false;
        if (loginRes.response == null && loginRes.message == 'Logout sucessfully...') {
          toastr.success(loginRes.message, {
            closeButton: true,
            progressBar: true,
            preventDuplicates: true
          });
          LS.setData(null);
          $rootScope.currentUser = undefined;
          $location.path('/');
        } else {
          toastr.error('Please Try Again', {
            closeButton: true,
            progressBar: true,
          });
        }
      })
      .catch(function(e) {
        toastr.error('Some error occured, please try again.', 'Error');
      })
  }

  $scope.globalsearch = function (val) {
    if (!val) {
      return false;
    }
    $rootScope.searchResult = val;
    LS.setData($rootScope.data);
    $location.path('/globalSearch');
    if ($rootScope.reloadsearch)
      $rootScope.reloadsearch();
  }
});