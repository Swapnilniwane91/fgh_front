app.controller('pickupAssignCtrl', function($scope, $rootScope, $state, httpService, $location, toastr, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, commonFunctions) {

    commonFunctions.checkUserSession();

    $scope.arr1 = [];
    $scope.arr2 = [];
    $scope.arr3 = [];

    $scope.Menu = {
        title: 'Transaction',
        subtitle: 'Pickup Assignment Details'
    };
    $scope.ticket = false;
    $scope.fA = true;
    $scope.sA = false;
     $scope.authorized = false;

    $scope.serviceAssignmeFn = function(deviceObj) {
        httpService.sendCommand("/getServiceRequestList", {})
            .then(function(result) {
                $scope.pickupList = result.data;
                
                $scope.authorized = true;
                $scope.dtOptions = DTOptionsBuilder.newOptions()
                    .withPaginationType('full_numbers')
                    .withBootstrap()
                    .withColReorder()

                $scope.dtColumns = [
                    DTColumnBuilder.newColumn(0).withTitle('Ticket Number'),
                    DTColumnBuilder.newColumn(1).withTitle('Customer Name'),
                    DTColumnBuilder.newColumn(2).withTitle('IMEI Number'),
                    DTColumnBuilder.newColumn(3).withTitle('Model Name'),
                    DTColumnBuilder.newColumn(4).withTitle('Service Center Name'),
                    DTColumnBuilder.newColumn(5).withTitle('Pickup Request Address'),
                    DTColumnBuilder.newColumn(6).withTitle('City'),
                    DTColumnBuilder.newColumn(7).withTitle('State'),
                    DTColumnBuilder.newColumn(8).withTitle('Assign To'),
                    DTColumnBuilder.newColumn(9).withTitle('Action')
                ];
            });
    };

    $scope.serviceAssignmeFn();

    // first Assignment   
    var assignOne = [];
    var assignTwo = {};

    $scope.addAssign = function(index, headid, pincode, ticketnumber) {
        $scope.ticket = true;
        $scope.fA = false;
        $scope.sA = true;
        $scope.index = index;
        var detailsObj = {
            "data": {
                "headId": headid
            }
        };
        $scope.ticketnumbershow = ticketnumber;
        $scope.selectedheadId = headid;

        httpService.sendCommand("/pendingServiceRequestSelectList", detailsObj)
            .then(function(data) {
                $scope.pickupDetails = data.data;
            });

        //  Service Centers
        var districtReq = {
            "data": {
                "pincode": pincode
            }
        };
        httpService.sendCommand("/getServiceCenterbyarea", districtReq)
            .then(function(data) {
                $scope.serviceCenters = data.data;
            });

        // Logistics 
        var logisticReq = {
            "data": {
                "pincode": pincode
            }
        };
        httpService.sendCommand("/getLogisticsbyarea", logisticReq)
            .then(function(data) {
                $scope.logistics = data.data;
            });
    };

    // reAssign  
    $scope.serviceReAssignmeFn = function(reassgnObj) {
    $scope.addReAssign = function(index, headid, pincode, ticketnumber) {
        $scope.ticket = true;
        $scope.fA = false;
        $scope.sA = true;
        $scope.index = index;
        var detailsObj = {
            "data": {
                "headId": headid
            }
        };
        $scope.selectedheadId = headid;
        $scope.ticketnumbershow = ticketnumber;
        httpService.sendCommand("/pendingServiceRequestSelectList", detailsObj)
            .then(function(data) {
                $scope.pickupDetails = data.data;
            });

        //  Service Centers
        var districtReq = {
            "data": {
                "pincode": pincode
            }
        };
        httpService.sendCommand("/getServiceCenterbyarea", districtReq)
            .then(function(data) {
                $scope.serviceCenters = data.data;
            });

        // Logistics 
        var logisticReq = {
            "data": {
                "pincode": pincode
            }
        };
        httpService.sendCommand("/getLogisticsbyarea", logisticReq)
            .then(function(data) {
                $scope.logistics = data.data;
            });
      };
    };
    $scope.serviceReAssignmeFn();


    // 2nd Assignment
    $scope.assignToLogistick = function(center, logistick) {
        var updateReq = {
            "data": {
                "headId": $scope.selectedheadId,
                "assignToLogistic": logistick,
                "assignBy": $rootScope.currentUser.userId,
                "assignedToServiceCenter": center
            }
        };
        httpService.sendCommand("/assignservicecentertomanager", updateReq)
            .then(function(data) {
                $scope.updateReq = data;
                $scope.serviceAssignmeFn(updateReq);
                $scope.fA = true;
                $scope.sA = false;
                toastr.success(data.message, {
                    closeButton: true,
                    progressBar: true,
                });
                $state.reload();
            });
    };

    $scope.cancel = function(index) {
        $scope.fA = true;
        $scope.sA = false;
        $scope.ticket = false;
    };

});