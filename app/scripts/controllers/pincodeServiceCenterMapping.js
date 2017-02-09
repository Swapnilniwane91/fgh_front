app.controller('pincodeServiceCenterMappingCtrl', function($scope, $http, $state, httpService, toastr, commonFunctions, $rootScope, $filter, $q) {
  /* Chech user sesion */
  commonFunctions.checkUserSession();

  $scope.loading = false;
  $scope.loading1 = false;
  
  /* Set Global Array */
  $scope.getGlobalPincode = [];

  // Bind States
  httpService.getData("/getStates", {})
    .then(function(result) {
      $scope.allstate = result.data;      
    });

  // Bind logistics
  httpService.getData("/getCenters", {})
    .then(function(result) {
      $scope.allCenters = result.data;      
    });

  /* State DropDown*/
  $scope.getStatePincodeList = function(stateid) {
    $scope.newBindPincodeList = [];
    // $scope.loading = true;
    $scope.selectedCenters = {};
    $scope.centerdetails = [];
    var stateToPincode = {
      "data": {
        "stateId": stateid
      }
    };
    // Bind PinCode
    httpService.sendCommand("/getPincodeState", stateToPincode)
      .then(function(result) {
        $scope.bindPincodeList = result.data;
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
  $scope.getLosgistics = function(centerpincode) {

    $scope.loading = true;
    $scope.loading1 = true;
    var centerToPincode = {
      "data": {
        "centerpincodeid": centerpincode
      }
    };

    // Bind PinCode    
    var logisticdata = []
    httpService.sendCommand("/getCenterwisePincode", centerToPincode)    
      .then(function(result) {
         $scope.loading1 = false;
        $scope.loading = false;
         if(result.data != "No Result Found."){     
        $scope.statePincodedata = $scope.centerdetails = result.data;        
        logisticdata = result.data;
        
        // $scope.loading1 = false;
        // $scope.loading = false;
        // var js1 = [];
        // _.each($scope.bindPincodeList, function(num) {
        //   return js1.push(num.statepincode)
        // });        
        var js2 = [];
        //  if(logisticdata != "No Result Found."){
        //   console.log(1);
        _.each(logisticdata, function(num) {
          return js2.push(num.centerpincode)
        });    
       
         var statePin = [];
        _.each($scope.bindPincodeList, function(pin) {
          if (js2.indexOf(pin.statepincode) < 0) {
            statePin.push(pin);
          }
        });
        $scope.logisticdata = $scope.newBindPincodeList = statePin;                 
         }
        else{
        $scope.newBindPincodeList = $scope.bindPincodeList; 
        }
      });

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
    if (!$scope.selectedCenters) {
      toastr.error('Select pincode to assign', {
        closeButton: true,
        progressBar: true,
      });
      return false;
    }
    var pincodetocenters = {
      "data": {
        "centerid": $scope.selectedCenters,
        "mappingvalue": $scope.selection,
        "flag": "assign"
      }
    };
    httpService.sendCommand("/mapPincodecenters", pincodetocenters)
      .then(function(result) {
        // $scope.reloaddata();
        toastr.success(result.data[0].pincodecentersmapping, {
          closeButton: true,
          progressBar: true,
        });
        $state.reload();
      });
  };


  /* Stored selected centers in scope */
  $scope.selectiontocenters = [];  
  $scope.toggleSelectionlogistic = function toggleSelectionlogistic(pinid) {     
    var idx = $scope.selectiontocenters.indexOf(pinid);  
    if (idx > -1) {       
      $scope.selectiontocenters.splice(idx, 1);     
    } else {
      $scope.selectiontocenters.push(pinid);     
    }
  };


  /* Un-Assign Loaner */
  $scope.unassignPincode = function() {
    if (!$scope.selectedCenters) {
      toastr.error('Select Center to assign', {
        closeButton: true,
        progressBar: true,
      });
      return false;
    }
    if ($scope.selectiontocenters && $scope.selectiontocenters.length < 1) {
      toastr.error('Select Pincode to un-assign', {
        closeButton: true,
        progressBar: true,
      });
      return false;
    }
    var centersUnassign = {
      "data": {
        "centerid": $scope.selectedCenters,
        "mappingvalue": $scope.selectiontocenters,
        "flag": "Unassign"
      }
    };
    httpService.sendCommand("/mapPincodecenters", centersUnassign)
      .then(function(result) {
        // $scope.reloaddata();
        toastr.success(result.data[0].pincodecentersmapping, {
          closeButton: true,
          progressBar: true,
        });
        $state.reload();
      });
  };
  /*End Un-Assign To Oem */

});