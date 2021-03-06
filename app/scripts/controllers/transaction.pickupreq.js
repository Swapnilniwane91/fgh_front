app.controller('pickupReqCtrl', function($scope, $rootScope, httpService, $http,
  toastr, commonFunctions, $timeout, $location) {
  commonFunctions.checkUserSession();
  $scope.dTmax = new Date();
  $scope.isFetch = false;
  $scope.isSubmit = false;

  $scope.radioValue = function(val) {
    $scope.radioF = val;
  };
  $scope.prefContact = function(val) {
    $scope.radioPrefCont = val;
  };
  $scope.radio1Value = function(val) {
    $scope.fetch.senario = val;
  };
  $scope.imeiNumberFn = function(imeiNumber) {
    $scope.isSubmit = true;


    var imeiObj = {
      "data": {        
        "serialOrIMEINo": imeiNumber    
      }
    };

    httpService.sendCommand("/validateSerialOrImeiNo", imeiObj)
      .then(function(data) {
        $scope.isSubmit = false;
        if (data.data && data.data.message && data.data.message == "valid") {
          $scope.isFetch = true;
          $scope.radioF = "given";
          $scope.fetch = data.data.response;
          if (!$scope.fetch.alternateContactNo)
          {
            $scope.isAlternateNumberExist = false;
          } else {
            $scope.isAlternateNumberExist = true;
          }
          $scope.fetch.loaner = false;
          $scope.getPinCodeFn($scope.fetch.pincode);

          toastr.success("Valid IMEI Number.", {
            progressBar: true,
            closeButton: true
          });
        } else if (data.data.message != "Ticket is running for Serial / IMEI Number") {
          $scope.isFetch = false;
          toastr.error(data.data.message, {
            progressBar: true,
            closeButton: true
          });

          $scope.cancelFn();
        } else {
          toastr.error(data.data.message, {
            progressBar: true,
            closeButton: true
          });

          $scope.cancelFn();
        }
      });
  };
  $scope.getPinCodeFn = function(pincode) {
    var pinCodeObj = {
      "pincode": pincode
    };
    httpService.sendCommand("/pincode_map", pinCodeObj)
      .then(function(result) {
        $scope.results = result.data[0];
      });
  };

  $scope.zip2Res = {};
  // $scope.zipError = {};
  $scope.zipChange = function zipChange(pincode) {
    console.log(pincode, pincode.length);
    if (pincode.length < 6) {
      var zip2Res = {
        'state': '',
        'district': '',
        'country': ''
      }
      $scope.zip2Res = zip2Res;
    } else if (pincode.length == 6) {
      httpService.sendCommand('/pincode_map', {
        pincode: pincode
      }).then(function(result, err) {
        if (result.error) {
          $scope.zipRes = {};
          $scope.zipError = result.error;
        } else {
          $scope.zipError = "";
          $scope.zip2Res = result.data[0];
        }
      });
    }
  };

  $scope.problemCat = {};
  httpService.getData('/device_problem')
    .then(function(result, error) {
      $scope.problemCat = result.data;
    });

  $scope.problemDescription = {};
  $scope.getProblemCategory = function(problemCatCode) {
    httpService.getData('/device_problem/'+problemCatCode).then(function(result, error) {
      $scope.problemDescription = result.data;
    })
  };
  $scope.problemJson = [];
  $scope.problemData = [];
  $scope.addProblem = function(cat, des) {
    var maxProblemAllowed = 3;
    if ($scope.problemData.length < maxProblemAllowed) {
      $scope.tblProblem = true;
      var a = _.filter($scope.problemCat, function(num) {
        return num.problemCatCode == cat;
      })
      var b = _.filter($scope.problemDescription, function(num) {
        return num.Id == des;
      })

      $scope.problemAdded = true;
      var probCat = a[0].problemCatName;
      var probType = b[0].problemDescription;
      var problemInTable = false;
      for (var i = 0; i < $scope.problemData.length; ++i) {
        var data = $scope.problemData[i];
        if (data.category == probCat && data.type == probType) {
          problemInTable = true;
          break;
        }
      }
      if (!problemInTable) {
        $scope.problemData.push({
          category: a[0].problemCatName,
          type: b[0].problemDescription
        })
        $scope.problemJson.push({
          problemCategoryId: cat,
          problemDesciptionId: des
        });
        $scope.fetch.problemCategory = '';
        $scope.fetch.problemDes = '';
      } else {
        toastr.error('This problem is already added.', 'Error');
      }
    } else {
      toastr.error('You can add maximum 3 problems.', 'Error');
    }
  };

  $scope.removeProblem = function(probCat, probType, index) {
      $scope.problemData.splice(index, 1);
      $scope.problemJson.splice(index, 1);
      if ($scope.problemData.length == 0) {
        $scope.tblProblem = false;
        $scope.problemAdded = false;
      }
    } //removeProblem                                                                                                                                                                                                                                                                                                                     

  $scope.today = function() {
    $scope.pop = new Date();
    $scope.policyDate = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.pop = null;
    $scope.policyDate = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    minDate: new Date(),
    maxDate: new Date(),
    startingDay: 1
  };

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };
  $scope.setDate = function(year, month, day) {
    $scope.pop = new Date(year, month, day);
    $scope.policyDate = new Date(year, month, day);
  };

  $scope.format = "dd/MM/yyyy"

  $scope.popup1 = {
    opened: false
  };

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }

  $scope.submitFn = function() {
    if ($scope.radioPrefCont == 'alternate') {
      if (!$scope.fetch.alternateContactNo) {
        toastr.error('Please Enter Valid Alternate Contact No');
        return false;
      }
    }
    $scope.isSubmit = true;
    var temp = {
      "imeiOrSerialNumber": $scope.imeiNumber,
      "customerName": $scope.fetch.customerName,
      "emailId": $scope.fetch.emailId,
      "contactNo": $scope.fetch.contactNo,
      "alternateContactNo": $scope.fetch.alternateContactNo || '',
      "whichAddress": $scope.radioF,
      "address1": $scope.fetch.address1,
      "pincode": $scope.fetch.pincode,
      "state": $scope.results.state,
      "district": $scope.results.district,
      "country": $scope.results.country,
      "address2": $scope.fetch.address2 || "",
      "pincode2": $scope.fetch.pincode2 || "",
      "state2": $scope.zip2Res.state || "",
      "district2": $scope.zip2Res.district || "",
      "country2": $scope.zip2Res.country || "",
      "oemName": $scope.fetch.oemName,
      "modelName": $scope.fetch.modelName,
      "ticketType": $scope.fetch.ticketType,
      "planName": $scope.fetch.planName,
      "productName": $scope.fetch.productName,
      "remarks": $scope.fetch.remarks || "",
      "problems": $scope.problemJson,
      "otherProblem": $scope.fetch.otherProblem || "",
      "case": $scope.fetch.senario,
      "modelId": $scope.fetch.modelId,
      "damageDate": $scope.fetch.damageDate,
      "isLoaner": $scope.fetch.loaner,
      "clientId": $scope.fetch.clientId,
      "clientName": $scope.fetch.clientName,
      "preferredContact":$scope.radioPrefCont
    };
    // console.log(temp);
    httpService.sendCommand('/serviceRequestRegistration', {
      data: temp
    }).then(function(result, error) {
      $scope.isSubmit = false;
      if (result.data && result.data.code == 200) {
        console.log($location.absUrl().split("/").pop());
          $scope.mail();
        toastr.success(result.data.message, {
          progressBar: true,
          closeButton: true
        });
        $scope.cancelFn();
      } else {
        toastr.error(result.message, {
          progressBar: true,
          closeButton: true
        });
      }
      $scope.cancelFn();
    });
  }; //modelSubmitFn

  // sending Mail
  $scope.mail=function(){
   var temp= {
    "pageUrl":  $location.absUrl().split("/").pop()
   }
    httpService.sendCommand('/getPageUrl', {
      data: temp
    }).then(function(result) {
        console.log(result);
       });
  }

  $scope.cancelFn = function() {
    $scope.imeiNumber = ""
    $scope.removeProblem();
    $scope.isFetch = false;
  };
});
