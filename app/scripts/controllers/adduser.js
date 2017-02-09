app.controller('addUserCtrl', function($scope, $rootScope, httpService, $http, toastr, commonFunctions,
  Upload, config,$timeout, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $location, LS, $state) {

  commonFunctions.checkUserSession();
  $scope.grid = true;
  $scope.showAddUser = false;
  var commandType = 'insert';
  $scope.isActive = true;
  $scope.isSubmit = false;
  $scope.data = {};
  var password;
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
    DTColumnDefBuilder.newColumnDef(6),
    DTColumnDefBuilder.newColumnDef(7)
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

  /*password policy check */
  $scope.invalidPass = false;
  $scope.passwordCheck = function(password) {
    if (!password) {
      $scope.invalidPass = false;
      return;
    }
    var pattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,20}$/)
      // console.log(count);
    if (!pattern.test(password)) {
      $scope.invalidPass = true;
      //  console.log('invalid');
    } else {
      $scope.invalidPass = false;
    }

  }

  $scope.$watch(function($scope) {
      return $scope.password
    }, function() {
      $scope.passwordCheck($scope.password);

    })
    /*password policy check for updating  */
  $scope.invalidPassNew = false;
  $scope.passwordCheckNew = function(password) {
    if (!password) {
      $scope.invalidPassNew = false;
      return;
    }
    var pattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,20}$/)
      // console.log(count);
    if (!pattern.test(password)) {
      $scope.invalidPassNew = true;
      //  console.log('invalid');
    } else {
      $scope.invalidPassNew = false;
    }

  }

  $scope.$watch(function($scope) {
      return $scope.newPassword
    }, function() {
      $scope.passwordCheckNew($scope.newPassword);
      // console.log($scope.newPassword);
    })
    // toggling in button text of update and submit
  $scope.buttonValue = "Submit"
    // to get pincode
  $scope.zipRes = {};
  $scope.zipError = '';
  $scope.zipChange = function zipChange(pincode) {
    if (!pincode) return;
    if (pincode.length < 6) {
      $scope.zipRes = {};
      return;
    }
    httpService.sendCommand('/pincode_map', {
      pincode: pincode
    }).then(function(result) {
      // console.log(result.error);
      if (result.error) {
        $scope.zipRes = {};
        $scope.zipError = result.error.split('Error: ')[1];
      } else {
        $scope.zipError = "";
        $scope.zipRes = result.data[0];
      }
    });
  };
  /* to get list of added users*/
  $scope.userList = [];
  var userList = function() {
    httpService.getData('/admingetProvider').then(function(result) {
      $scope.userList = result.response;
      //console.log("$scope.userList", $scope.userList);
    });
  }
  userList();
  /* Add user details */
  $scope.submitFn = function() {
      var url = config.serverurl + '/uploadmultiplefile/';
      Upload.upload({
          url: url,
          data: {
              file: $scope.file
          }
      }).then(function(resp) {
          $scope.isSubmit = true;
          if (resp.data.files[0].docURL) {
            $scope.filePath = resp.data.files[0].docURL;
            var userJson = {
                "user": {
                  "firstName": $scope.firstName,
                  "lastName": $scope.lastName,
                  "address": $scope.address,
                  "emailId": $scope.emailId,
                  "contactNo": $scope.contactNo,
                  "companyName" : $scope.companyName,
                  "location" : $scope.location || '',
                  "pincode": $scope.pincode,
                  "isActive": $scope.isActive,
                  "userId": $scope.fUserId || null,
                  "userImage": $scope.filePath,
                },
                "commandType": commandType
              }
              // console.log(userJson);
            httpService.sendCommand('/create_provider', userJson)
              .then(function(result) {
                $scope.isSubmit = false;

                if (result.data) {
                  commonFunctions.openToastr('success', result.data)
                  $scope.clearFn();
                  $scope.back();
                  userList();
                } else if (result.error) {
                  commonFunctions.openToastr('error', result.error)
                } else {
                  commonFunctions.openToastr('error', result)
                }

              });
          } else {
              toastr.error('Please select file size of maximum 2 MB, Please Try Again', {
                  progressBar: true,
                  closeButton: true
              });
              $scope.file = {};
              angular.element("input[type='file']").val(null);
              $scope.clearFn();
              //$scope.cancelFn();
          }
      });
    } //submitFn
    /*cancel or clear function*/
  $scope.clearFn = function() {
    $scope.firstName = "";
    $scope.lastName = "";
    $scope.address = "";
    $scope.emailId = "";
    $scope.contactNo = "";
    $scope.companyName = "";
    $scope.pincode = "";
    $scope.isActive = true;
    $scope.userId = "";
    $scope.location = "";
    $scope.buttonValue = "Submit";
    commandType = "insert";

  };

  // edit function
  $scope.action = function(id) {
      // console.log('test',id);
      $scope.showForm();
      $scope.buttonValue = "Update";
      commandType = "update";
      var filteredData = _.filter($scope.userList, function(user) {
          return user.Id == id;
        })[0]
      //console.log(filteredData);
      $scope.firstName = filteredData.fName;
      $scope.lastName = filteredData.lName;
      $scope.companyName = filteredData.companyName;
      $scope.address = filteredData.address;
      $scope.emailId = filteredData.emailId;
      $scope.contactNo = filteredData.mobileNumber;
      $scope.pincode = filteredData.pincode;
      $scope.isActive = filteredData.isActive;
      $scope.file = filteredData.profileImage;
      $scope.fUserId = filteredData.Id;
      // document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
    // console.log("...",password);
})
