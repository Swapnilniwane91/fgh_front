app.controller('pickupdocCtrl', function($scope, httpService, $window, $uibModal, Upload, config, $log, $rootScope, $location, $http, $state, commonFunctions, $templateCache) {

    commonFunctions.checkUserSession();
    
   $rootScope.pageDoc = $rootScope.hd;  

    var ticketNumberObj = {
        "data": {
            "ticketnumber": $rootScope.selectedTicket
        }
    };
    // post command to view a PickUp Document in another page
    httpService.sendCommand("/getServiceRequestDocument", ticketNumberObj)
        .then(function(result) {            
            $scope.claimdata = result.data;
        });

    /* back button */
    // $scope.goBack = function() {              
    //     $location.path('/transaction/pickupDrop');
    // }

    $scope.close = function() {              
         $window.close();
    }
});