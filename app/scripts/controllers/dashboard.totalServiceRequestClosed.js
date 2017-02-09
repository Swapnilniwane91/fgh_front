app.controller('TotalServiceRequestClosedCtrl', function($scope, $state, $rootScope, $location, httpService, LS, toastr, commonFunctions, DTOptionsBuilder, DTColumnBuilder, $q) {
    commonFunctions.checkUserSession();

    $scope.Menu = {
        title: 'Dashboard',
        subtitle: 'Total Service Request Closed'
    };

    $scope.authorized = false;
    $scope.totalCollectedList = {}

    httpService.sendCommand('/getTotalServiceRequestClosed', {}).then(function(result, error) {
        var getTableData = function() {
            var deferred = $q.defer();
            deferred.resolve(result.data || {});
            return deferred.promise;
        };
        $scope.authorized = true;
        $scope.dtOptions = DTOptionsBuilder.fromFnPromise(getTableData)
            .withPaginationType('full_numbers')
            .withBootstrap()
            .withColReorder()

        $scope.dtColumns = [
            DTColumnBuilder.newColumn('ticketnumber').withTitle('Ticket Number'),
            DTColumnBuilder.newColumn('name').withTitle('Customer Name'),
            DTColumnBuilder.newColumn('imeino').withTitle('IMEI Number'),
            DTColumnBuilder.newColumn('modelname').withTitle('Model Name'),
            DTColumnBuilder.newColumn('status').withTitle('Action Status')
        ];
    });
});