var app = angular.module("espApp");

app.service('commonFunctions', function($rootScope, $location, toastr, LS) {
    this.checkUserSession = function() {
        /*===== This code logsout user if local storage userdata is null --- starts =======*/
        if (LS.getData() == null) {
            //$rootScope.logout();
            LS.setData(null);
            $rootScope.currentUser = undefined;
            $location.path('/');
        } else {
            $rootScope.currentUser = LS.getData().currentUser;
            $rootScope.viewClaimData = LS.getData().viewClaimData;
            $rootScope.selectedTicket = LS.getData().selectedTicket;
            $rootScope.globalSearch = LS.getData().globalSearch;
            $rootScope.headId = LS.getData().headId;
            $rootScope.userId=  LS.getData().userId;
            $rootScope.data = LS.getData();
        }
    };

    this.openToastr = function(msgType, msg) {
        toastr.clear();
        if (msgType == 'success') {
            toastr.success(msg, {
                closeButton: true,
                progressBar: true,
            });
        } else {
            toastr.error(msg, {
                closeButton: true,
                progressBar: true
            });
        }
    };

});