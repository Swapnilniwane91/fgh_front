app.controller('centerMasterCtrl', function($scope, $rootScope, httpService, $http, toastr, commonFunctions,
  $timeout, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $location, LS) {

  commonFunctions.checkUserSession();
  $scope.grid = true;
  $scope.showAddCenter = false;
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
    DTColumnDefBuilder.newColumnDef(6),
    DTColumnDefBuilder.newColumnDef(7)
  ];
  /*to hide and show form on clicking add user button*/
  $scope.showForm = function() {
      $scope.grid = false;
      $scope.showAddCenter = true;
    }
    /*to back button*/
  $scope.back = function() {
    $scope.grid = true;
    $scope.showAddCenter = false;
    // $state.reload()
    $scope.clearFn();
  }
  // toggling in button text of update and submit
  $scope.buttonValue = "Submit"
  /* to get list of added users*/
  $scope.centerList = [];
  var centerList = function() {
    httpService.getData('/centerList').then(function(result) {
      $scope.centerList = result.data;
      // console.log("$scopeList", $scope.centerList);
    });
  }
  centerList();
  /*to get center type*/
  $scope.centerTypeList = [];
  httpService.getData('/centerTypeList').then(function(result) {
    $scope.centerTypeList = result.data;
    // console.log("$scopeList", $scope.centerTypeList);
  });
  $scope.Id = 0;
  $scope.centerNameError = '';
  $scope.centerNameChanges = function centerNameChanges(centerid, centername) {
    $scope.centerNameError = '';
    if (!centername) return;
    if (!centerid) {
      centerid = 0;
    }
    httpService.sendCommand('/check_center_name_and_code', {
      centerid : centerid,
      centername: centername,
      type : 'name'
    }).then(function(result) {
      if (result.data == 0) {
          $scope.centerNameError = "Center Name already Exists";
      } else {
        $scope.centerNameError = '';
      }
    });
  };

  $scope.centerCodeError = '';
  $scope.centerCodeChanges = function centerCodeChanges(centerid, centercode) {
    $scope.centerCodeError = '';
    if (!centercode) return;
    if (!centerid) {
      centerid = 0;
    }
    httpService.sendCommand('/check_center_name_and_code', {
      centerid : centerid,
      centername: centercode,
      type : 'code'
    }).then(function(result) {
      if (result.data == 0) {
          $scope.centerCodeError = "Center Code already Exists";
      } else {
        $scope.centerCodeError = '';
      }
    });
  };

  $scope.emailError = '';
  $scope.emailChanges = function emailChanges(centerid, emailid) {
    $scope.emailError = '';
    if (!emailid) return;
    if (!centerid) {
      centerid = 0;
    }
    httpService.sendCommand('/check_center_email', {
      centerid: centerid,
      emailid: emailid
    }).then(function(result) {
      if (result.data == 0) {
        $scope.emailError = "Email-ID already Exists";
      } else {
        $scope.emailError = '';
      }
    });
  };

  $scope.contactError = '';
  $scope.contactChanges = function contactChanges(centerid, contactNo) {
    $scope.contactError = '';
    if (!contactNo) return;
    if (!centerid) {
      centerid = 0;
    }
    httpService.sendCommand('/check_center_contact', {
      centerid : centerid,
      contactNo: contactNo
    }).then(function(result) {
      if (result.data == 0) {
        $scope.contactError = "Contact Number already Exists";
      } else {
        $scope.contactError = '';
      }
    });
  };

  $scope.alternatecontactError = '';
  $scope.alternateContactChanges = function alternateContactChanges(centerid, contactNo) {
    $scope.alternatecontactError = '';
    if (!contactNo) return;
    if(contactNo == $scope.contactNo){
      $scope.alternatecontactError = "Alternate Number should be different than Contact Number";
      return;
    }
    if (!centerid) {
      centerid = 0;
    }
    httpService.sendCommand('/check_center_contact', {
      centerid : centerid,
      contactNo: contactNo
    }).then(function(result) {
      if (result.data == 0) {
        $scope.alternatecontactError = "Contact Number already Exists";
      } else {
        $scope.alternatecontactError = '';
      }
    });
  };

  $scope.primryContactPersonError = '';
  $scope.primryContactPersonChanges = function primryContactPersonChanges(centerid, contactNo) {
    $scope.primryContactPersonError = '';
    if (!contactNo) return;
    if (!centerid) {
      centerid = 0;
    }
    httpService.sendCommand('/check_center_contact', {
      centerid : centerid,
      contactNo: contactNo
    }).then(function(result) {
      if (result.data == 0) {
        $scope.primryContactPersonError = "Contact Number already Exists";
      } else {
        $scope.primryContactPersonError = '';
      }
    });
  };

  /* Add user details */
  $scope.submitFn = function() {

      $scope.isSubmit = true;
      var userJson = {
          "centerName": $scope.centerName,
          "email": $scope.email,
          "contactNo": $scope.contactNo,
          "primaryContactPersonName": $scope.primaryContactPersonName,
          "centerCode": $scope.centerCode,
          "isActive": $scope.isActive,
          "centerType": $scope.centerType,
          "centerAddress": $scope.centerAddress,
          "alternateNo": $scope.alternateNo || '',
          "primryContactPersonPhone": $scope.primryContactPersonPhone,
          "centerid": $scope.Id || null,
          "commandType": commandType
        }
        // console.log(userJson);
      httpService.sendCommand('/insertCenter', userJson)
        .then(function(result) {
          // console.log('55555',result);
          $scope.isSubmit = false;

          if (result.data) {
            commonFunctions.openToastr('success', result.data)
            $scope.clearFn();
            $scope.back();
            centerList();
          } else if (result.error) {
            commonFunctions.openToastr('error', result.error)
          } else {
            commonFunctions.openToastr('error', result)
          }
        });
    } //submitFn
    /*cancel or clear function*/
  $scope.clearFn = function() {
    $scope.centerName = "";
    $scope.email = "";
    $scope.contactNo = ""
    $scope.centerAddress = "";
    $scope.primaryContactPersonName = "";
    $scope.centerCode = "";
    $scope.alternateNo = "";
    $scope.centerType = "";
    $scope.isActive = true;
    $scope.primryContactPersonPhone = "";
    $scope.Id = 0;
    $scope.buttonValue = "Submit";
    $scope.emailError = '';
    $scope.contactError = '';
    $scope.alternatecontactError = '';
    $scope.primryContactPersonError = '';
    $scope.centerNameError = '';
    $scope.centerCodeError = '';
    commandType = "insert";

  };
  // edit function
  $scope.action = function(id) {
    // console.log('test',id);
    $scope.showForm();
    $scope.buttonValue = "Update";
    commandType = "update";
    var filteredData = _.filter($scope.centerList, function(center) {
        return center.id == id;
      })[0]
      // console.log(filteredData);
    $scope.centerName = filteredData.centername;
    $scope.email = filteredData.email;
    $scope.centerAddress = filteredData.centeraddress;
    $scope.primaryContactPersonName = filteredData.primarycontactpersonname;
    $scope.centerCode = filteredData.centercode;
    $scope.alternateNo = filteredData.alternatecontactno;
    $scope.centerType = filteredData.centertypeid.toString();
    $scope.isActive = filteredData.isactive;
    $scope.contactNo = filteredData.contactno;
    $scope.primryContactPersonPhone = filteredData.primrycontactpersonphone;
    $scope.Id = id
      // document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
})
