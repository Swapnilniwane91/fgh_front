app.controller('logisticRemarksCtrl', function ($scope, $log, $rootScope, $window, httpService, $http, toastr, commonFunctions, DTOptionsBuilder, DTColumnBuilder, $q, $state) {
    commonFunctions.checkUserSession();
    // ----------------------------date-----------------
    $scope.today = function () {
        $scope.pop = new Date();
        $scope.policyDate = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.pop = null;
        $scope.policyDate = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        //minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        minDate: new Date(),
        //maxDate: new Date(),
        startingDay: 1
    };

    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };
    $scope.setDate = function (year, month, day) {
        $scope.pop = new Date(year, month, day);
        $scope.policyDate = new Date(year, month, day);
    };

    $scope.format = "dd/MM/yyyy"

    $scope.popup1 = {
        opened: false
    };

    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }
        return '';
    }
    //Display Logistic Remarks 
    var hd = {
        "data": {
            "headId": $rootScope.headId
        }
    };
    httpService.sendCommand("/logisticRemarks", hd)
        .then(function (result) {
            if (result.data.length > 0) {
                $scope.remarksDetails = true;
                $scope.searchResult = result.data;
            }
            else{
                 $scope.remarksDetails = false;
            }
        });

    //Final Submit Remarks
    $scope.submitRemarks = function () {
        var req_json = {
            "data": {
                "headId": $rootScope.headId,
                "createdBy": $rootScope.userId,
                "remarks": $scope.data.Remarks,
                "appointmentDate": $scope.data.Appointmentdate
            }
        };
        httpService.sendCommand("/insertLogisticRemarks", req_json)
            .then(function (result) {
                toastr.success(result.data.massage, {
                    closeButton: true,
                    progressBar: true,
                });
                $state.reload();
            });
    };
    // Back Button Function
    $scope.back = function () {
        $window.close();
    };
});