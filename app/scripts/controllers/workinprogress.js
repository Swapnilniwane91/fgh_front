app.controller('workInProgressCtrl', function($scope, $rootScope, $state, httpService, $location, toastr, commonFunctions, $q, DTOptionsBuilder, DTColumnBuilder) {
    commonFunctions.checkUserSession();

    $scope.Menu = {
        title: 'Transaction',
        subtitle: 'Work In Progress Service Request'
    };
    $scope.authorized = false;

    var getWIP = function() {
        httpService.getData('/workInProgressList').then(function(result, error) {
            $scope.authorized = true;
            $scope.workInProgressList = result.data;
            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withBootstrap()
                .withPaginationType('full_numbers')
            $scope.dtColumns = [
                DTColumnBuilder.newColumn(0).withTitle('Action'),
                DTColumnBuilder.newColumn(1).withTitle('Ticket No'),
                DTColumnBuilder.newColumn(2).withTitle('Customer Name'),
                DTColumnBuilder.newColumn(3).withTitle('IMEI No'),
                DTColumnBuilder.newColumn(4).withTitle('Model Name'),
                DTColumnBuilder.newColumn(5).withTitle('Status')
            ];
        });
    }
    getWIP();

    $scope.checklistval = [];
    $scope.SelectedTicketNow = function(headid) {
        var idx = $scope.checklistval.indexOf(headid);  
        if (idx > -1) {       
            $scope.checklistval.splice(idx, 1);     
        } else {
            $scope.checklistval.push(headid);     
        } 
    }

    $scope.repair = function(headid) {
        var temp = $scope.checklistval;
        if (temp.length < 1) {
            toastr.error('Please Select Checkbox', {
                closeButton: true,
                progressBar: true,
            });
            return false;
        }
        var headObj = {
                "data": temp
            }
        httpService.sendCommand('/repairComplete', headObj)
            .then(function(result, error) {
                if (result && result.data.message) {
                    toastr.success(result.data.message, {
                        progressBar: true,
                        closeButton: true
                    });
                    getWIP();
                } else {
                    toastr.error(result.data.message, {
                        progressBar: true,
                        closeButton: true
                    });
                    getWIP();
                }
            });
    }
});