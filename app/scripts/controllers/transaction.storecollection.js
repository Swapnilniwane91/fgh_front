app.controller('storecollectionCtrl', function($scope, $rootScope, httpService, $http, $state, toastr, commonFunctions, $timeout) {
    commonFunctions.checkUserSession();

    $scope.fA = false;

    $scope.imeiNumberFn = function(imeiNumber) {

        var getCollectionList = {
            "data": {        
                "searchdata": imeiNumber    
            }
        };
        httpService.sendCommand("/unitCollection", getCollectionList)
            .then(function(result) {
                console.log('result=', result);
                if (result.error == 'Record Not Found') {
                    $scope.fA = false;
                    toastr.error(result.error, {
                        closeButton: true,
                        progressBar: true,
                    });
                    $scope.imeiNumber = '';
                } else {
                    $scope.pickupList = result.data;
                    $scope.fA = true;
                }
            });
    };


    $scope.collect = function(index, headid) {

        var detailsObj = {
            "data": {
                "headId": headid
            }
        };

        httpService.sendCommand("/collectUnit", detailsObj)
            .then(function(data) {
                toastr.success(data.data.message, {
                    closeButton: true,
                    progressBar: true,
                });
                $state.reload();
            });

    };

});