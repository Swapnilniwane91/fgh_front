app.controller('PendingUnitsForPickupCtrl', function($scope, $state, $rootScope, $location, httpService, LS, toastr, commonFunctions, DTOptionsBuilder, DTColumnBuilder, $q) {
    commonFunctions.checkUserSession();

    $scope.Menu = {
        title: 'Dashboard',
        subtitle: 'Pending Units For Pickup'
    };

    $scope.authorized = false;
    $scope.totalCollectedList = {}

    httpService.sendCommand('/getPendingUnitsForPickup', { actionStatusId: 2 }).then(function(result, error) {
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
            DTColumnBuilder.newColumn('custname').withTitle('Customer Name'),
            DTColumnBuilder.newColumn('imeino').withTitle('IMEI Number'),
            DTColumnBuilder.newColumn('modelname').withTitle('Model Name'),
            DTColumnBuilder.newColumn('custaddress').withTitle('Customer Address'),
            DTColumnBuilder.newColumn('servicecenteraddress').withTitle('Service Center Address'),
            DTColumnBuilder.newColumn('pickupdate').withTitle('Pickup Date')
        ];
    });
});