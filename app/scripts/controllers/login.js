app.controller('loginCtrl', function($scope, httpService, $rootScope, $state, $location, toastr, LS) {

  $scope.login = function() {
    //  $state.go('app.dashboard');
    //    return false;

    var userName = $scope.email;
    var password = $scope.password;
    //===========loginReq=============
    var loginReq = {
      "data": {
        "loginId": userName,
        "password": password
      }
    };
    //$scope.password = '';
    httpService.sendCommand("/adminlogin", loginReq)
      .then(function(loginRes) {
        $scope.result = loginRes;
        var flag = false;
        if (loginRes != null && loginRes.message != 'failed') {
          var currentUser = {};
          // $rootScope.data = $rootScope.data ? $rootScope.data : {};
          $rootScope.data = {};
          $rootScope.data.currentUser = $rootScope.currentUser = loginRes;
          //console.log("$rootScope.data.currentUser",$rootScope.data.currentUser);
          /* Set user data in local storage */
          LS.setData($rootScope.data);
          toastr.success(loginRes.message, {
            closeButton: true,
            progressBar: true,
            preventDuplicates: true
          });
          $location.path('/dashboard');
          $scope.show = false;
        } else if (loginRes.error == 'Invaild username/password.') {
          toastr.error('Invalid Username / Password.', {
            closeButton: true,
            progressBar: true
          });
        } else {
          toastr.error('Invaild username/password.', {
            closeButton: true,
            progressBar: true,
          });
        }
      })
      .catch(function(e) {
        toastr.error('Some error occured, please try again.', 'Error');
      })
  };
});
