app.controller('problemCategoryDescriptionMappingCtrl', function($scope, $http, $state, httpService, toastr, commonFunctions, $rootScope, $filter, $q) {
  /* Chech user sesion */
  commonFunctions.checkUserSession();

  $scope.loading = false;
  $scope.loading1 = false; 
  
  // Bind States
  httpService.getData("/getProblemCat", {})
    .then(function(result) {
      $scope.allProbCategory = result.data;      
    });
  
  /* State DropDown*/
  $scope.getProbDesc = function(pdid) {
    $scope.newBindPincodeList = [];
    // $scope.loading = true;
    $scope.selectedProbCat = {};
    $scope.centerdetails = [];
    var probdescId = {
      "data": {
        "pcatid": pdid
      }
    };
    // Bind mapped
    httpService.sendCommand("/getMappedValue", probdescId)
      .then(function(result) {
        $scope.bindMappedPrbDesc = result.data;
      });

      // Bind unmapped
      httpService.sendCommand("/getUnmappedvalue", probdescId)
      .then(function(result) {
        $scope.bindUnMapped = result.data;
      });
  }
 
  
  $scope.selection = [];    
  $scope.toggleSelection = function toggleSelection(pdid) { 
    var idx = $scope.selection.indexOf(pdid);
    if (idx > -1) {       
      $scope.selection.splice(idx, 1);     
    } else {
      $scope.selection.push(pdid);      
    } 
  };

  /* Mapped to Problem Description */
  $scope.assignProbDesc = function(stateid) {

    if ($scope.selection && $scope.selection.length < 1) {
      toastr.error('Select Mapped Description to assign', {
        closeButton: true,
        progressBar: true,
      });
      return false;
    }
    if (!$scope.selectedProblem) {
      toastr.error('Select Mapped Description to assign', {
        closeButton: true,
        progressBar: true,
      });
      return false;
    }
    var mappedValued = {
      "data": {
        "catid": $scope.selectedProblem,
        "descid": $scope.selection,
        "flags": "mapped"
      }
    };
    httpService.sendCommand("/mapUnmappedProbDesc", mappedValued)
      .then(function(result) {
        toastr.success(result.data[0].problemcategorydescriptionmapping, {
          closeButton: true,
          progressBar: true,
        });
        $state.reload();
      });
  };


  /* Stored selected centers in scope */
  $scope.selectiontounmapped = [];  
  $scope.toggleSelectionUnmapped = function toggleSelectionlogistic(pdid) {     
    var idx = $scope.selectiontounmapped.indexOf(pdid);  
    if (idx > -1) {       
      $scope.selectiontounmapped.splice(idx, 1);     
    } else {
      $scope.selectiontounmapped.push(pdid); 
    } 
  };


  /* Un-Assign To Problem Description */
  $scope.unassignProbDesc = function() {
    if (!$scope.selectedProblem) {
      toastr.error('Select Un-Mapped Description to assign', {
        closeButton: true,
        progressBar: true,
      });
      return false;
    }
    if ($scope.selectiontounmapped && $scope.selectiontounmapped.length < 1) {
      toastr.error('Select Un-Mapped Description to un-assign', {
        closeButton: true,
        progressBar: true,
      });
      return false;
    }
    var unmappedValues = {
      "data": {
        "catid": $scope.selectedProblem,
        "descid": $scope.selectiontounmapped,
        "flags": "unmapped"
      }
    };
    httpService.sendCommand("/mapUnmappedProbDesc", unmappedValues)
      .then(function(result) {
        toastr.success(result.data[0].problemcategorydescriptionmapping, {
          closeButton: true,
          progressBar: true,
        });
        $state.reload();
      });
  }; 

});