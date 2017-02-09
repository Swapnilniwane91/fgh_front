app.controller('modelPlanMappingCtrl', function($scope, $http, $state, httpService, toastr, commonFunctions, $rootScope, $filter, $q) {
    /* Chech user sesion */
    commonFunctions.checkUserSession();

    $scope.loading = false;
    $scope.loading1 = false;

    /* Model DropDown*/
    httpService.getData("/getAllModelList", {})
        .then(function(result) {
            $scope.allModels = result.data;
        });

    $scope.getPlanList = function(planid) {

        var plan = {
            "data": {
                "mid": planid
            }
        };
        // Bind mapped
        httpService.sendCommand("/mappedPlans", plan)
            .then(function(result) {
                $scope.mappedPlans = result.data;
            });

        // Bind unmapped
        httpService.sendCommand("/unMappedPlans", plan)
            .then(function(result) {
                $scope.UnMappedPlans = result.data;
            });
    }

    $scope.selection = [];    
    $scope.toggleSelection = function toggleSelection(planid) { 
        var idx = $scope.selection.indexOf(planid);
        if (idx > -1) {       
            $scope.selection.splice(idx, 1);     
        } else {
            $scope.selection.push(planid);
        }
    };

    /* Mapped to Plans */
    $scope.assignPlans = function(planid) {
        if (!$scope.selectedModel) {
            toastr.error('Select Model to assign', {
                closeButton: true,
                progressBar: true,
            });
            return false;
        }
        if ($scope.selection && $scope.selection.length < 1) {
            toastr.error('Select Plan/PlanLists to assign', {
                closeButton: true,
                progressBar: true,
            });
            return false;
        }

        var mappedValued = {
            "data": {
                "modelid": $scope.selectedModel,
                "planid": $scope.selection,
                "flags": "mapped"
            }
        };
        httpService.sendCommand("/mappedUnmappedPlans", mappedValued)
            .then(function(result) {
                console.log(result.data);
                toastr.success(result.data[0].modelplanmapping, {
                    closeButton: true,
                    progressBar: true,
                });
                $state.reload();
            });
    };


    /* Stored selected Client in scope */
    $scope.selectiontounmapped = [];  
    $scope.toggleSelectionUnmapped = function toggleSelectionlogistic(planid) {     
        var idx = $scope.selectiontounmapped.indexOf(planid);  
        if (idx > -1) {       
            $scope.selectiontounmapped.splice(idx, 1);     
        } else {
            $scope.selectiontounmapped.push(planid); 
        } 
    };


    /* Un-Assign Pages */
    $scope.unassignPlans = function() {
        if (!$scope.selectedModel) {
            toastr.error('Select Model to assign', {
                closeButton: true,
                progressBar: true,
            });
            return false;
        }
        if ($scope.selectiontounmapped && $scope.selectiontounmapped.length < 1) {
            toastr.error('Select Mapped Plans to un-assign', {
                closeButton: true,
                progressBar: true,
            });
            return false;
        }
        var unmappedValues = {
            "data": {
                "modelid": $scope.selectedModel,
                "planid": $scope.selectiontounmapped,
                "flags": "unmapped"
            }
        };
        httpService.sendCommand("/mappedUnmappedPlans", unmappedValues)
            .then(function(result) {
                toastr.success(result.data[0].modelplanmapping, {
                    closeButton: true,
                    progressBar: true,
                });
                $state.reload();
            });
    };

});