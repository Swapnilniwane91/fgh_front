app.controller('clientOemMappingCtrl', function($scope, $http, $state, httpService, toastr, commonFunctions, $rootScope, $filter, $q) {
    /* Chech user sesion */
    commonFunctions.checkUserSession();

    $scope.loading = false;
    $scope.loading1 = false;

    /* Client DropDown*/
    httpService.getData("/Clients", {})
        .then(function(result) {
            $scope.allClients = result.data;
        });

    $scope.getOemList = function(clientid) {

        var clientId = {
            "data": {
                "cid": clientid
            }
        };
        // Bind mapped
        httpService.sendCommand("/getMappedOem", clientId)
            .then(function(result) {
                $scope.bindMappedOEM = result.data;
            });

        // Bind unmapped
        httpService.sendCommand("/getUnmappedOem", clientId)
            .then(function(result) {
                $scope.bindUnMappedOEM = result.data;
            });
    }


    $scope.selection = [];    
    $scope.toggleSelection = function toggleSelection(clientid) { 
        var idx = $scope.selection.indexOf(clientid);
        if (idx > -1) {       
            $scope.selection.splice(idx, 1);     
        } else {
            $scope.selection.push(clientid);
        }
    };

    /* Mapped to OEM */
    $scope.assignOEM = function(stateid) {
        if (!$scope.selectedClient) {
            toastr.error('Select Client to assign', {
                closeButton: true,
                progressBar: true,
            });
            return false;
        }
        if ($scope.selection && $scope.selection.length < 1) {
            toastr.error('Select Oem/Oemlist to assign', {
                closeButton: true,
                progressBar: true,
            });
            return false;
        }

        var mappedValued = {
            "data": {
                "clientid": $scope.selectedClient,
                "oemid": $scope.selection,
                "flags": "mapped"
            }
        };
        httpService.sendCommand("/mapUnmappedOem", mappedValued)
            .then(function(result) {
                toastr.success(result.data[0].clientoemmapping, {
                    closeButton: true,
                    progressBar: true,
                });
                $state.reload();
            });
    };


    /* Stored selected Client in scope */
    $scope.selectiontounmapped = [];  
    $scope.toggleSelectionUnmapped = function toggleSelectionlogistic(clientid) {     
        var idx = $scope.selectiontounmapped.indexOf(clientid);  
        if (idx > -1) {       
            $scope.selectiontounmapped.splice(idx, 1);     
        } else {
            $scope.selectiontounmapped.push(clientid); 
        } 
    };


    /* Un-Assign OEM */
    $scope.unassignOEM = function() {
        if (!$scope.selectedClient) {
            toastr.error('Select Client to assign', {
                closeButton: true,
                progressBar: true,
            });
            return false;
        }
        if ($scope.selectiontounmapped && $scope.selectiontounmapped.length < 1) {
            toastr.error('Select Un-Mapped OEM to un-assign', {
                closeButton: true,
                progressBar: true,
            });
            return false;
        }
        var unmappedValues = {
            "data": {
                "clientid": $scope.selectedClient,
                "oemid": $scope.selectiontounmapped,
                "flags": "unmapped"
            }
        };
        httpService.sendCommand("/mapUnmappedOem", unmappedValues)
            .then(function(result) {
                toastr.success(result.data[0].clientoemmapping, {
                    closeButton: true,
                    progressBar: true,
                });
                $state.reload();
            });
    };

});