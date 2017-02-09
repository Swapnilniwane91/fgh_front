app.controller('dispatchAssignmentCtrl', function($scope, $window, $rootScope, $state, httpService, $location, toastr, commonFunctions, DTOptionsBuilder, DTColumnBuilder) {
    commonFunctions.checkUserSession();
    var url = $location.absUrl().split("#/")[0];
    $scope.Menu = {
        title: 'Transaction',
        subtitle: 'Unit Dispatch Assignment'
    };

    $scope.dtColumn = [];
    $scope.authorized = false;
    $scope.isReplacement = false;
    $scope.isDispatchProcess = false;
    $scope.isChecked = false;
    $scope.list = true;
    $scope.dispatchForm = {};
    $scope.ticket = false;

    $scope.dispatchList = {};
    $scope.logistics = {};

    var dispatchlist = function() {
        httpService.sendCommand('/getDispatchList', {}).then(function(result, error) {
            $scope.authorized = true;
            $scope.dispatchList = result.data;
            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withBootstrap()
                .withPaginationType('full_numbers')
                .withColReorder()

            $scope.dtColumns = [
                DTColumnBuilder.newColumn(0).withTitle('Ticket No'),
                DTColumnBuilder.newColumn(1).withTitle('Customer Name'),
                DTColumnBuilder.newColumn(2).withTitle('IMEI No'),
                DTColumnBuilder.newColumn(3).withTitle('Model Name'),
                DTColumnBuilder.newColumn(4).withTitle('Delivery Address'),
                DTColumnBuilder.newColumn(5).withTitle('Excess Payment'),
                DTColumnBuilder.newColumn(6).withTitle('Status'),
                DTColumnBuilder.newColumn(7).withTitle('Action')
            ];
        });
    }

    dispatchlist();

    // $scope.checkList = {};

    $scope.addAssign = function(unit) {
        $scope.unit = unit;
        $scope.list = false;
        $scope.ticket = true;
        $scope.ticketnumbershow = unit.ticketNumber;
        var data = {
            pageName: 'unitDispatchList'
        };
        httpService.sendCommand('/bindCheckList', { data: data }).then(function(result, error) {
            $scope.checkList = result.data;
            $scope.isDispatchProcess = true;
        });
        var data = {
            pincode: $rootScope.currentUser.userDetails.pincode
        }
        httpService.sendCommand('/getLogisticsbyarea', { data: data }).then(function(result, error) {
            $scope.logistics = result.data;
        });

        httpService.getData('/getRepairType').then(function(result, error) {
            $scope.repairTypes = result.data;
        });

        if (unit.pickupRequire == true) {
            $scope.ispickup = false;
            $scope.is_show = true;
        } else {
            $scope.ispickup = true;
            $scope.is_show = false;
        }

        $scope.isRepairType = false;
        if (unit.repairTypeId == 2) {
            $scope.isRepairType = true;
        }

        /* Upload Multiple Images */
        $scope.uploadImg = function(ticketNumber) {
                $rootScope.selectedTicket = unit.ticketNumber;
                $rootScope.hd = unit.headId;
                $window.open(url + '#/transaction/uploadImage', $rootScope.headId);
            }
            /* End Upload */

    };

    $scope.checkedVal = [];
    $scope.isChecked = function(checkedId) {
        var i = $scope.checkedVal.indexOf(checkedId);
        if (i > -1) {
            $scope.checkedVal.splice(i, 1);
        } else {
            $scope.checkedVal.push(checkedId);
        }
    }

    $scope.dispatchSubmit = function(formData) {
        var selectedchecklist = [];
        _.each($scope.checkList, function(key) {
            selectedchecklist.push({
                checklistId: key.checklistid,
                isChecked: (key.selected) ? true : false
            });
        });

        var data = {
            headId: $scope.unit.headId,
            logisticId: formData.selectedLogistic || null,
            pickupRequire: $scope.unit.pickupRequire,
            repairType: formData.selectedRepairType || null,
            isReplacement: formData.replacementCheckbox || null,
            replaceSerialNo: formData.replacedSerialNo || null,
            replaceIMEINo: formData.replacedIMEINo || null,
            remark: formData.remark || null,
            checkListDetails: JSON.stringify(selectedchecklist)
        }

        httpService.sendCommand('/dispatch', { data: data }).then(function(result, error) {
            if (result) {
                dispatchlist();
                $scope.list = true;
                $scope.isDispatchProcess = false;
                toastr.success(result.data, {
                    closeButton: true
                });
            } else {
                toastr.error(error);
            }
        });
    }

    $scope.cancel = function() {
        // dispatchlist();
        $scope.ticket = false;
        $state.reload();
        $scope.list = true;
        $scope.isDispatchProcess = false;
    }

});