app.controller('logisticsLoanerMappingCtrl', function($scope, $http, httpService, toastr, commonFunctions, $rootScope, $filter, $q) {
  /* Chech user sesion */
  commonFunctions.checkUserSession();

  /* Local variables */
  $scope.deviceDetails = [];

  // Bind oem
  httpService.getData("/bindOem", {})
    .then(function(result) {
      $scope.alloem = result.data;
    });

  // Bind logistics
  httpService.getData("/bindLogistics", {})
    .then(function(result) {
      $scope.allLogistics = result.data;
    });


  // Bind tables
  $scope.reloadloaner = function() {
    var def = $q.defer();
    httpService.getData("/loanerDeviceSerialNo", {})
      .then(function(result) {
        $scope.deviceDetails = result.data;
        def.resolve();
      });
    return def.promise;
  }
  $scope.reloadloaner();

  /* Oem DropDown*/
  $scope.getOemLoanerData = function(oemid) {
    $scope.unassignedloaner = _.filter($scope.deviceDetails, function(device) {
      return device.oemid == oemid && device.logisticid == null;
    });
  }

  /* Logistics DropDown*/
  $scope.getLosgistics = function(logisticid) {
    $scope.logisticsDetails = _.filter($scope.deviceDetails, function(device) {
      return device.logisticid == logisticid;
    });
  }

  /* Loaner table checkBox All Select*/
  $scope.loanerMapping = function() {
    if (this.loaner.selected) {} else {
      $scope.selectedAllMapp = false;
    }
  }
  $scope.selectedAllMapp = false;
  $scope.selectAllMapp = function() {
    angular.forEach($scope.unassignedloaner, function(item) {
      item.selected = $scope.selectedAllMapp;
    });
  };

  /*END Loaner table checkBox All Select*/

  /* Logistics table checkBox All Select*/
  $scope.logisticMapping = function() {
    if (this.mapp1.selected) {} else {
      $scope.selectedAll1 = false;
    }
  }

  $scope.selectedAll1 = false;
  $scope.selectAll1 = function() {
    angular.forEach($scope.logisticsDetails, function(mapp1) {
      mapp1.selected = $scope.selectedAll1;
    });
  };
  /* END Logistics table checkBox All Select*/

  /* Stored selected loaners in scope */
  $scope.selection = [];    
  $scope.toggleSelection = function toggleSelection(loanerid) { 
    var idx = $scope.selection.indexOf(loanerid);
    if (idx > -1) {       
      $scope.selection.splice(idx, 1);     
    } else {
      $scope.selection.push(loanerid);
    }
  };

  /* Function For All */
  $scope.reloaddata = function() {
    //get loaner details
    $scope.reloadloaner().then(function() {
      $scope.getOemLoanerData($scope.selectedOem);
      $scope.getLosgistics($scope.selectedLogistic);
      $scope.selection = [];
      $scope.selectiontologistic = [];
    });
  };

  /* Assign To Logistics */
  $scope.assignLoaner = function(loanerid) {

    if ($scope.selection && $scope.selection.length < 1) {
      toastr.error('Select loaner to assign', {
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
    var oemtologistic = {
      "data": {
        "logisticsId": $scope.selectedLogistic,
        "loanerIds": $scope.selection,
        "flag": "assign"
      }
    };

    httpService.sendCommand("/loanerMappedForLogistics", oemtologistic)
      .then(function(result) {
        $scope.reloaddata();
        toastr.success(result.data.message, {
          closeButton: true,
          progressBar: true,
        });
      });
  };

  /* Stored selected loaners in scope */
  $scope.selectiontologistic = [];  
  $scope.toggleSelectionlogistic = function toggleSelectionlogistic(loanerid) {     
    var idx = $scope.selectiontologistic.indexOf(loanerid);  
    if (idx > -1) {       
      $scope.selectiontologistic.splice(idx, 1);     
    } else {
      $scope.selectiontologistic.push(loanerid);     
    } 
  };

  /* Un-Assign Loaner */
  $scope.unassignLoaner = function() {
    if (!$scope.selectedLogistic) {
      toastr.error('Select logistic to assign', {
        closeButton: true,
        progressBar: true,
      });
      return false;
    }
    if ($scope.selectiontologistic && $scope.selectiontologistic.length < 1) {
      toastr.error('Select loaner to un-assign', {
        closeButton: true,
        progressBar: true,
      });
      return false;
    }
    var logisticstoloaner = {
      "data": {
        "logisticsId": null,
        "loanerIds": $scope.selectiontologistic,
        "flag": "Unassign"
      }
    };

    httpService.sendCommand("/loanerMappedForLogistics", logisticstoloaner)
      .then(function(result) {
        $scope.reloaddata();
        toastr.success(result.data.message, {
          closeButton: true,
          progressBar: true,
        });
      });
  };
  /*End Un-Assign To Oem */

});
