app.controller('globalCtrl', function ($scope, $state, $rootScope, $location, httpService, LS, toastr, commonFunctions, DTOptionsBuilder, DTColumnBuilder, $q) {
  commonFunctions.checkUserSession();
  // $state.reload();
  var count = 0;
  $rootScope.reloadsearch = function () {
    var url = $state.current.url;
    if (count > 0) {
      count = 0;
      url == '/globalSearch' ? $state.reload() : $state.go('app.globalSearch');
    }
    $scope.authorized = false;

    var searchtext = $scope.txtglobal = $rootScope.searchResult;
    var ipjson = {
      "data": {
        "search": searchtext
      }
    };
    httpService.sendCommand("/globalSearch", ipjson)
      .then(function (result) {
        $scope.searchResult = result.data;
        count++;
        var getTableData = function () {
          var deferred = $q.defer();
          deferred.resolve(result.data);
          return deferred.promise;
        };

        $scope.authorized = true;
        $scope.viewTicket = function (ticketNumber) {
          httpService.sendCommand('/ticketDetails/' + ticketNumber, {})
            .then(function (result, err) {
              $rootScope.ticketsDtls = result.data;
              $location.path('/reports/ticketDetails');
            });
        }
        $scope.dtOptions = DTOptionsBuilder
          .newOptions()
          .withBootstrap()
          .withPaginationType('full_numbers')
          .withColReorder();
        $scope.dtColumns = [
          DTColumnBuilder.newColumn(0).withTitle('Ticket Number'),
          DTColumnBuilder.newColumn(1).withTitle('Customer Name'),
          DTColumnBuilder.newColumn(2).withTitle('ImeiNo'),
          DTColumnBuilder.newColumn(3).withTitle('Product Name'),
          DTColumnBuilder.newColumn(4).withTitle('Model Name'),
          DTColumnBuilder.newColumn(5).withTitle('Status'),
          DTColumnBuilder.newColumn(6).withTitle('Pickup Request Date')
        ];

      });
  }
  $rootScope.reloadsearch();
});