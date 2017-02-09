app.controller('statetaxCtrl', function($scope, $http, $state, httpService, toastr, commonFunctions,
  $rootScope, $filter) {
  /* Chech user sesion */
  commonFunctions.checkUserSession();
  // Bind States
  httpService.getData("/getStateList")
    .then(function(result) {
      $scope.getStateList = result.data;
      // console.log("getStateList", result);
    });
    // Bind unmapped
    var allTaxData=[];
    var getAllTax=function(){
      httpService.getData("/getalltax")
      .then(function(result) {
        allTaxData = result.data;
        // console.log(result);
      });
    }
    getAllTax();

    var filteredData =function(input){
      var mappedId =[];
      _.each(input,function(num){
        mappedId.push(num.tid)
      })
      $scope.bindUnMapped = _.filter(allTaxData,function(num){

        return _.indexOf(mappedId,num.tid) == -1;
      })
      // console.log("mappedId",mappedId);
    }
    $scope.getStateData = function(id){
      // console.log($scope.selectedState);

      httpService.sendCommand("/mappedstatetax",{"data":{"stateId": id}})
      .then(function(result) {
        // console.log("mapped",result);

        if(result.error){
          $scope.bindUnMapped=allTaxData;
          $scope.mapped=[];
        }
        else{
          $scope.mapped = result.data;
          filteredData(result.data);
        }

      });
    }
  $scope.selection = [];    
  $scope.toggleSelection = function toggleSelection(tid) { 
    var idx = $scope.selection.indexOf(tid);
    if (idx > -1) {       
      $scope.selection.splice(idx, 1);     
    } else {
      $scope.selection.push(tid);
    }
  };

  /* Mapped to Problem Description */
  $scope.mapTax = function() {
    $scope.mapUnmap($scope.selection, "mapped");
  };

  var clearCheckboxState = function(){

    _.each($scope.bindUnMapped, function(num){
      num.selected = false;
    })

    // console.log('-----==', $scope.bindUnMapped);
    _.each($scope.mapped, function(num){
      num.selected = false;
    })
  }

  /* Stored selected in scope */
  $scope.selectiontounmapped = [];  
  $scope.toggleSelectionUnmapped = function toggleSelectionlogistic(tid) {     
    var idx = $scope.selectiontounmapped.indexOf(tid);  
    if (idx > -1) {       
      $scope.selectiontounmapped.splice(idx, 1);     
    } else {
      $scope.selectiontounmapped.push(tid); 
    } 
  };
/*mapUnmap function*/

$scope.mapUnmap=function(tIdArray,flag){
    var Values={
    "data": {
      "stateid": $scope.selectedState,
      "tid": tIdArray,
      "flags": flag
        }
      }
  httpService.sendCommand("/mapUnmappedStateTax", Values)
    .then(function(result) {
      // console.log(result.data[0].statetaxmapunmap);
      clearCheckboxState();
      if(result.data[0].statetaxmapunmap){
        commonFunctions.openToastr("success",result.data[0].statetaxmapunmap)
        // getAllTax();
        $scope.getStateData($scope.selectedState);
        $scope.selectiontounmapped = []; 
        $scope.selection = []; 
      }
    });
}
  /* Un-Assign To tax */
  $scope.unMapTax = function() {
      $scope.mapUnmap($scope.selectiontounmapped,"unmapped");
  };
});
