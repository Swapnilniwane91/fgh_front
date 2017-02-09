app.controller('excessPaymentCtrl', function ($scope, $rootScope, $state, httpService, $location, toastr, commonFunctions, DTOptionsBuilder, DTColumnBuilder, $mdDialog) {

    commonFunctions.checkUserSession();

    $scope.Menu = {
        title: 'Transaction',
        subtitle: 'Pending For Excess Payment Received'
    };
    $scope.authorized = false;
    var getExcessPaymentRequest = function () {
        httpService.getData('/excesPaymentList').then(function (result, error) {
            $scope.authorized = true;
            $scope.excessPaymentRequestList = result.data;

            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withBootstrap()
                .withPaginationType('full_numbers')

            $scope.dtColumns = [
                DTColumnBuilder.newColumn(0).withTitle('Ticket No'),
                DTColumnBuilder.newColumn(1).withTitle('Customer Name'),
                DTColumnBuilder.newColumn(2).withTitle('IMEI No'),
                DTColumnBuilder.newColumn(3).withTitle('Model Name'),
                DTColumnBuilder.newColumn(4).withTitle('Deductible Amount'),
                DTColumnBuilder.newColumn(5).withTitle('Status'),
                DTColumnBuilder.newColumn(6).withTitle('Action')
            ];
        });
    }
    getExcessPaymentRequest();

    /* alert function on accept the excess payment */
    $scope.showConfirm = function (ev, headid) {
        var data = {
            "headid": headid
        }
        var msg = 'Are you sure you want to Receive Excess Payment?'
        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .title('Confirm your action')
            .content(msg)
            .ok('Yes')
            .cancel('No')
            .targetEvent(ev);
        $mdDialog.show(confirm).then(function () {
                httpService.sendCommand('/excessReceived', {
                    data: data
                }).then(function (result, error) {
                    if (result && result.data.message) {
                        toastr.success(result.data.message, {
                            progressBar: true,
                            closeButton: true
                        });
                        $state.reload();
                    } else {
                        toastr.error(result.message, {
                            progressBar: true,
                            closeButton: true
                        });
                    getExcessPaymentRequest();    
                    }
                });
            },
            function () {
                ev.target.checked = false;
            });
    };
});