'use strict';
app.controller('DashboardCtrl', function($scope, $http, $rootScope, $state, httpService, $location, toastr) {
    $scope.page = {
        title: 'Dashboard',
        subtitle: 'Activity statistics.'
    };

    //global search
    $rootScope.globalSearch = function() {
        $location.path('/master/globalSearch');
    };

    //Dashboard List
    $scope.dashboardList = {}
    httpService.getData('/dashboard', {}).then(function(result, error) {
        $scope.dashboardList = result.data;
    });

});