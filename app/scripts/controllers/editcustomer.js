app.controller('editCustomerCtrl', function($scope, $rootScope, httpService, $http, toastr, commonFunctions, $timeout, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $location, LS) {

  commonFunctions.checkUserSession();
  $scope.isActive = true;
  $scope.isSubmit = false;
  $scope.custdetail = false;
  $scope.custlist = true;
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
    DTColumnDefBuilder.newColumnDef(5)
  ];
 

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
      if (result.error) {

        $scope.zipRes = {};
        $scope.zipError = result.error.split('Error: ')[1];
      } else {
        $scope.zipError = "";
        $scope.zipRes = result.data[0];
      }
    });
  };

  $scope.zipRest = {};
  $scope.zipErrors = '';
  $scope.zipChanges = function zipChanges(pincode) {
    $scope.zipErrors = '';
    if (!pincode) {
      $scope.zipErrors = '';
      return;
    }
    if (pincode.length < 6 && pincode.length > 0) {
        $scope.zipErrors = "Please Enter 6 digit Pincode";
        $scope.zipRest = {};
        return;
      }
    httpService.sendCommand('/pincode_map', {
      pincode: pincode
    }).then(function(result) {
      if (result.error) {
        $scope.zipRest = {};
        $scope.zipErrors = result.error.split('Error: ')[1];
      } else {
        $scope.zipErrors = '';
        $scope.zipRest = result.data[0];
      }
    });
  };
  
  $scope.emailError = '';
  $scope.emailChanges = function emailChanges(custid, emailid) {
    $scope.emailError = '';
    if (!emailid) return;
    httpService.sendCommand('/check_customer_email', {
      customerid : custid,
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
  $scope.contactChanges = function contactChanges(custid, contactNo) {
    $scope.contactError = '';
    if (!contactNo) return;
    httpService.sendCommand('/check_customer_contact', {
      customerid : custid,
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
  $scope.alternatecontactChanges = function alternatecontactChanges(custid, alternatecontactNo) {
    $scope.alternatecontactError = '';
    if (!alternatecontactNo) return;
    if(alternatecontactNo == $scope.contactNo){
      $scope.alternatecontactError = "Alternate Number should be different than Contact Number";
      return;
    }
    httpService.sendCommand('/check_customer_contact', {
      customerid : custid,
      contactNo: alternatecontactNo
    }).then(function(result) {
      if (result.data == 0) {
        $scope.alternatecontactError = "Alternate Number already Exists";
      } else {
         $scope.alternatecontactError = '';
      }
    });
  };

  /* to get list of added users*/
  $scope.customerList = [];
  var customerList = function() {
    httpService.getData('/customer_list').then(function(result) {
      $scope.customerList = result.data;
    });
  }
  customerList();
  /* Add user details */
  $scope.submitFn = function() {
      $scope.isSubmit = true;
      var customerJson = {
        "customer": {
          "alternateAddress": $scope.alternateAddress || '',
          "emailId": $scope.emailId,
          "contactNo": $scope.contactNo,
          "alternateNo": $scope.alternateNo || '',
          "alternatePincode": $scope.alternatePincode || null,
          "customerId": $scope.custId
        }
      }
      
      httpService.sendCommand('/update_customer', customerJson)
        .then(function(result) {
          $scope.isSubmit = false;

          if (result.data) {
            commonFunctions.openToastr('success', result.data)
            $scope.clearFn();
            customerList();
          } else if (result.error) {
            commonFunctions.openToastr('error', result.error)
          } else {
            commonFunctions.openToastr('error', result)
          }

        });
    } //submitFn
    /*cancel or clear function*/
  $scope.clearFn = function() {
    $scope.custdetail = false;
    $scope.custlist = true;
  };

  // edit function
  $scope.action = function(id) {
    $scope.buttonValue = "Update";
     $scope.custdetail = true;
     $scope.custlist = false;
     $scope.zipRest = {};
     $scope.emailError = '';
     $scope.contactError = '';
     $scope.alternatecontactError = '';
    var filteredData = _.filter($scope.customerList, function(customer) {
        return customer.id == id;
      })[0]
    var name = filteredData.name.split(" ");
    $scope.custId = id;
    $scope.firstName = name[0];
    $scope.lastName = name[1];
    $scope.address = filteredData.address1;
    $scope.emailId = filteredData.emailid;
    $scope.contactNo = filteredData.contactno;
    $scope.alternateNo = filteredData.alteranatecontactno;
    $scope.pincode = filteredData.pincode;
    $scope.alternatePincode = filteredData.alternatepincode;
    $scope.alternateAddress= filteredData.alternateaddress;
    $scope.isActive = filteredData.isactive;
    $scope.zipChange(filteredData.pincode);
    $scope.zipChanges(filteredData.alternatepincode);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

})
