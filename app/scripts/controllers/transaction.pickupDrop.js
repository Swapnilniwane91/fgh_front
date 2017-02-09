app.controller('pickupDropCtrl', function($scope, $rootScope, $state, httpService, $location, $uibModal, toastr,
    $filter, LS, commonFunctions, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $window) {

    commonFunctions.checkUserSession();
    // console.log($location.absUrl().split("#/")[0]);
    var url = $location.absUrl().split("#/")[0];

    $scope.authorized = false;
    $scope.ticket = false;

    $scope.Menu = {
        title: 'Transactions',
        subtitle: 'Pickup Assignment Details'
    };

    $scope.arr1 = [];
    $scope.arr2 = [];

    httpService.sendCommand("/getServiceRequestFromASP", {})
        .then(function(result) {

            $scope.authorized = true;
            $scope.pickupList = result.data;

            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withPaginationType('full_numbers')
                .withBootstrap()
                .withColReorder()

            $scope.dtColumns = [
                DTColumnBuilder.newColumn(0).withTitle('Ticket Number'),
                DTColumnBuilder.newColumn(1).withTitle('Customer Name'),
                DTColumnBuilder.newColumn(2).withTitle('IMEI Number'),
                DTColumnBuilder.newColumn(3).withTitle('Model Name'),
                DTColumnBuilder.newColumn(4).withTitle('Customer Address'),
                DTColumnBuilder.newColumn(5).withTitle('ServiceCenter Address'),
                DTColumnBuilder.newColumn(6).withTitle('PickUp Date'),
                DTColumnBuilder.newColumn(7).withTitle('Action')
            ];

        });

    function displayPickupDetails(pickupData) {
        /* rootScope variables */
        $rootScope.hd = $scope.identity = pickupData.id;
        $rootScope.userId = $scope.userid = pickupData.userid;
        $rootScope.checkStatus = $scope.checkStatus = pickupData.isloanerapplicable;
        $rootScope.serialno = $scope.serialno = pickupData.serialno;
        $rootScope.ticket = $scope.ticket = pickupData.ticketnumber;
        // $rootScope.statusId = $scope.statusId = pickupData.actionstatusid;

        $scope.fA = false;
        $scope.sA = true;

        /* Request json to get checklist */
        var detailsObj = {
            "data": {
                "pageName": "pickupDrop"
            }
        };
        /* Post json to API route */
        httpService.sendCommand("/bindCheckList", detailsObj)
            .then(function(result) {
                $scope.pickupDetails = result.data;
                $scope.serialno = $scope.serialno;
            });

        /*Loaner Device Number*/
        httpService.sendCommand("/bindLoanerSerialNo", {})
            .then(function(result) {
                $scope.bindLoaner = result.data;
            });

        /*END Loaner Device */
        $rootScope.loaner = $rootScope.loanerData;
    };

    if ($rootScope.pageDoc == undefined) {
        $scope.fA = true;
        $scope.sA = false;
    } else {

        var data = {
            id: $rootScope.hd,
            isloanerapplicable: $rootScope.checkStatus,
            serialno: $rootScope.serialno,
            ticketnumber: $rootScope.ticket,
            statusId: $rootScope.statusId
        }
        displayPickupDetails(data);
        $scope.fA = false;
        $scope.sA = true;

        $scope.bindLoaner = $rootScope.addloaner;
        $scope.pickupDetails = $rootScope.CheckList;
        $scope.serialno = $rootScope.serialno;
    }

    $scope.chckList = [];
    $scope.chckList1 = [];

    $scope.statusId;

    //pickup from customer
    $scope.submitstate = false;
    $scope.selecteddevice = function(id) {
        if (id) {
            $scope.submitstate = true;
            $scope.selectedloanerId = id;
        } else {
            $scope.submitstate = false;
        }
    }

    $scope.isPickUpFromCustomer = false;
    $scope.pickUp = function(pickupData) {
        $scope.statusId = pickupData.actionstatusid;
        $scope.isSelectLoanerShow = pickupData.isloanerapplicable;
        $scope.isPickUpFromCustomer = true;
        $scope.isPickUpFromStore = false;
        $scope.ticketnumbershow = pickupData.ticketnumber;
        displayPickupDetails(pickupData)
    };

    //pickup from store
    $scope.isPickUpFromStore = false;
    $scope.pickUpFromStore = function(pickupData) {
        $scope.statusId = pickupData.actionstatusid;
        $scope.isLoanerShow = pickupData.isloanerapplicable;
        $scope.isPickUpFromCustomer = false;
        $scope.isPickUpFromStore = true;
        $scope.ticketnumbershow = pickupData.ticketnumber;
        displayPickupDetails(pickupData)
    }

    $scope.loanerReceived = false;
    $scope.loanerChecked = function(val) {
        $scope.loanerReceived = val;
    }

    // Final Submit 
    $scope.finalSubmit = [];
    $scope.submit = function(index, id, isloanerapplicable) {
        var checklistval = [];
        angular.forEach($scope.pickupDetails, function(key) {
            checklistval.push({
                checklistId: key.checklistid,
                isChecked: (key.selected) ? true : false
            });
        });
        var req_json = {
            "data": {
                "headId": $scope.identity,
                "loanerId": $scope.selectedloanerId || null,
                "remarks": $scope.remarks || "",
                "docketNo": $scope.docketNumber || "",
                "checklistDetails": checklistval,
                "loanerReceived": $scope.loanerReceived || null,
                "actionstatusid": $scope.statusId
            }
        };
        //  Checked  End
        httpService.sendCommand("/UnitPickupFromASP", req_json)
            .then(function(result) {
                toastr.success(result.data, {
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
        $state.reload();
    };


    /* PickUp Document */
    $rootScope.data.selectedTicket = [];
    $scope.printDoc = function(ticketNumber) {
            $rootScope.data.selectedTicket = $scope.ticket;
            LS.setData($rootScope.data);
            $window.open(url +'#/transaction/pickupDocument', $rootScope.selectedTicket);
        }
        /* End Doc */

    /* Upload Multiple Images */
    $rootScope.data.headId = [];
    $scope.uploadImg = function(ticketNumber) {
            $rootScope.data.selectedTicket = $scope.ticket;
            $rootScope.data.headId = $scope.identity;
            LS.setData($rootScope.data);
            $window.open(url +'#/transaction/uploadImage', $rootScope.headId);
        }
        /* End Upload */
          /* Logistic Remarks */
    $rootScope.data.headId = [];
    $scope.logisticRemarks = function(ticketNumber) {
            $rootScope.data.selectedTicket = $scope.ticket;
            $rootScope.data.headId = $rootScope.hd;
            $rootScope.data.userId=$rootScope.userId; 
            LS.setData($rootScope.data);
            $window.open(url +'#/transaction/logisticRemarks',$rootScope.headId);
        }
        /* End Upload */

});