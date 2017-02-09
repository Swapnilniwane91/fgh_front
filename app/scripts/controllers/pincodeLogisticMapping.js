app.controller('pincodeLogisticMappingCtrl', function($scope, $http, $state, httpService, toastr, commonFunctions, $rootScope, $filter, $q) {
  /* Chech user sesion */
  commonFunctions.checkUserSession();

  $scope.loading = false;
  $scope.loading1 = false;

  /* Set Global Array */
  $scope.getGlobalPincode = [];

  // Bind States
  httpService.getData("/getAllStates", {})
    .then(function(result) {
      $scope.allstate = result.data;
    });

  // Bind logistics
  // bindLogistics
  httpService.getData("/allLogisticsDet", {})
    .then(function(result) {
      $scope.allLogistics = result.data;
    });

  /* State DropDown*/
  $scope.getAllPincodeList = function(stateid) {
    $scope.newBindPincodeList = [];
    // $scope.loading = true;
    $scope.selectedLogistic = {};
    $scope.logisticsDetails = [];
    var stateToPincode = {
      "data": {
        "stateId": stateid
      }
    };
    // Bind PinCode
    httpService.sendCommand("/getStatePincodes", stateToPincode)
      .then(function(result) {
        $scope.bindPincodeList = result.data;
        // $scope.loading = false;
      });
  }

  /*  Global Function */

  // $scope.reloadloaner = function() {
  //   var def = $q.defer();
  //   $scope.statePincodedata;
  //   $scope.logisticdata;
  //   return def.promise;
  // }
  // $scope.reloadloaner();

  /* Logistics DropDown*/
  $scope.getLosgistics = function(logisticsid) {

    $scope.loading = true;
    $scope.loading1 = true;
    var logisticsToPincode = {
      "data": {
        "logisticPincode": logisticsid
      }
    };
    // Bind PinCode
    var logisticdata = []
    httpService.sendCommand("/getLogisticsPincodes", logisticsToPincode)
      .then(function(result) {
        $scope.statePincodedata = $scope.logisticsDetails = result.data;
        logisticdata = result.data;
        $scope.loading1 = false;
        $scope.loading = false;
        // var js1 = [];
        // _.each($scope.bindPincodeList, function(num) {
        //   return js1.push(num.statepincode)
        // });
        var js2 = [];
        _.each(logisticdata, function(num) {
          return js2.push(num.logisticspincode)
        });

        var statePin = [];
        _.each($scope.bindPincodeList, function(pin) {
          if (js2.indexOf(pin.statepincode) < 0) {
            statePin.push(pin);
          }
        });
        $scope.logisticdata = $scope.newBindPincodeList = statePin;
      });

    // var statePin = [];
    // _.each($scope.bindPincodeList, function(pin) {
    //   if (logisticdata.indexOf(pin.statepincode) < 0) {
    //     statePin.push(pin.statepincode);
    //   }
    // });

    // console.log('State Pin = ', statePin);

    // console.log('Logistic Pin = ', logisticPin);
    //   console.log(statePincode);
    // var lid = statePincode.indexOf(statePincode);
    // console.log(lid);
    // if (lid < 0) {
    //   logisticPin.push(statePincode);
    // }
    // console.log('logisticPin=', logisticPin);
  }


  /* Stored selected Pincode in scope */
  $scope.selection = [];    
  $scope.toggleSelection = function toggleSelection(stateid) { 
    var idx = $scope.selection.indexOf(stateid);
    if (idx > -1) {       
      $scope.selection.splice(idx, 1);     
    } else {
      $scope.selection.push(stateid);
    }  
  };

  /* Assign to logistics */
  $scope.assignPincode = function(stateid) {

    if ($scope.selection && $scope.selection.length < 1) {
      toastr.error('Select Pincode to assign', {
        closeButton: true,
        progressBar: true,
      });
      return false;
    }
    if (!$scope.selectedLogistic) {
      toastr.error('Select logistic to assign', {
        closeButton: true,
        progressBar: true,
      });
      return false;
    }
    var pincodetologistic = {
      "data": {
        "logisticsid": $scope.selectedLogistic,
        "mappingvalue": $scope.selection,
        "flag": "assign"
      }
    };
    // console.log('pincodetologistic=', pincodetologistic);
    httpService.sendCommand("/mapPincodeLogistics", pincodetologistic)
      .then(function(result) {
        // $scope.reloaddata();
        toastr.success(result.data[0].pincodelogisticsmapping, {
          closeButton: true,
          progressBar: true,
        });
        $state.reload();
      });
  };


  /* Stored selected loaners in scope */
  $scope.selectiontologistic = [];  
  $scope.toggleSelectionlogistic = function toggleSelectionlogistic(pinid) {     
    var idx = $scope.selectiontologistic.indexOf(pinid);  
    if (idx > -1) {       
      $scope.selectiontologistic.splice(idx, 1);     
    } else {
      $scope.selectiontologistic.push(pinid);     
    } 
    // console.log($scope.selectiontologistic);
  };


  /* Un-Assign Loaner */
  $scope.unassignPincode = function() {
    if (!$scope.selectedLogistic) {
      toastr.error('Select logistic to assign', {
        closeButton: true,
        progressBar: true,
      });
      return false;
    }
    if ($scope.selectiontologistic && $scope.selectiontologistic.length < 1) {
      toastr.error('Select Pincode to un-assign', {
        closeButton: true,
        progressBar: true,
      });
      return false;
    }
    var logisticsUnassign = {
      "data": {
        "logisticsid": $scope.selectedLogistic,
        "mappingvalue": $scope.selectiontologistic,
        "flag": "Unassign"
      }
    };
    // console.log('logisticsUnassign=', logisticsUnassign);
    httpService.sendCommand("/mapPincodeLogistics", logisticsUnassign)
      .then(function(result) {
        // $scope.reloaddata();
        toastr.success(result.data[0].pincodelogisticsmapping, {
          closeButton: true,
          progressBar: true,
        });
        $state.reload();
      });
  };
  /*End Un-Assign To Oem */

});