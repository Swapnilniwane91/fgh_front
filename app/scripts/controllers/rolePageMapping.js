app.controller('rolePageMappingCtrl', function($scope, $http, $state, httpService, toastr, commonFunctions, $rootScope, $filter, $q) {
    /* Chech user sesion */
    commonFunctions.checkUserSession();

    $scope.loading = false;
    $scope.loading1 = false;

    /* Client DropDown*/
    httpService.getData("/getAllRoleList", {})
        .then(function(result) {
            $scope.allRoles = result.data;
        });

    $scope.getPageList = function(roleid) {

        var role = {
            "data": {
                "rid": roleid
            }
        };
        // Bind mapped
        httpService.sendCommand("/mappedPages", role)
            .then(function(result) {
                $scope.mappedPages = result.data;
            });

        // Bind unmapped
        httpService.sendCommand("/unMappedPages", role)
            .then(function(result) {
                $scope.UnMappedPages = result.data;
            });
    }

    $scope.selection = [];    
    $scope.toggleSelection = function toggleSelection(roleid) { 
        var idx = $scope.selection.indexOf(roleid);
        if (idx > -1) {       
            $scope.selection.splice(idx, 1);     
        } else {
            $scope.selection.push(roleid);
        }
    };

    /* Mapped to Pages */
    $scope.assignPages = function(roleid) {
        if (!$scope.selectedRole) {
            toastr.error('Select Role to assign', {
                closeButton: true,
                progressBar: true,
            });
            return false;
        }
        if ($scope.selection && $scope.selection.length < 1) {
            toastr.error('Select Page/PageLists to assign', {
                closeButton: true,
                progressBar: true,
            });
            return false;
        }

        var mappedValued = {
            "data": {
                "roleid": $scope.selectedRole,
                "pageid": $scope.selection,
                "flags": "mapped"
            }
        };
        httpService.sendCommand("/mappedUnmappedPages", mappedValued)
            .then(function(result) {
                toastr.success(result.data[0].rolepagemapping, {
                    closeButton: true,
                    progressBar: true,
                });
                $state.reload();
            });
    };


    /* Stored selected Client in scope */
    $scope.selectiontounmapped = [];  
    $scope.toggleSelectionUnmapped = function toggleSelectionlogistic(roleid) {     
        var idx = $scope.selectiontounmapped.indexOf(roleid);  
        if (idx > -1) {       
            $scope.selectiontounmapped.splice(idx, 1);     
        } else {
            $scope.selectiontounmapped.push(roleid); 
        } 
    };


    /* Un-Assign Pages */
    $scope.unassignPages = function() {
        if (!$scope.selectedRole) {
            toastr.error('Select Role to assign', {
                closeButton: true,
                progressBar: true,
            });
            return false;
        }
        if ($scope.selectiontounmapped && $scope.selectiontounmapped.length < 1) {
            toastr.error('Select Mapped Pages to un-assign', {
                closeButton: true,
                progressBar: true,
            });
            return false;
        }
        var unmappedValues = {
            "data": {
                "roleid": $scope.selectedRole,
                "pageid": $scope.selectiontounmapped,
                "flags": "unmapped"
            }
        };
        httpService.sendCommand("/mappedUnmappedPages", unmappedValues)
            .then(function(result) {
                toastr.success(result.data[0].rolepagemapping, {
                    closeButton: true,
                    progressBar: true,
                });
                $state.reload();
            });
    };

});