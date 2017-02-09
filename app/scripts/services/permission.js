var app = angular.module("espApp");
app.factory('permissions', function($rootScope, LS) {
  return {

    hasPermission: function(permission) {
      //var role = LS.getData() != null ? LS.getData().currentUser.response.role : "";
      var role = ["superadmin"];
      var pageUrls = ["editCustomer","ticketDetail","viewCustomerBase","ticketSummaryReport","masterReport","addPincode","importCustomerBase","userMaster","#"];
      //var pageUrls = LS.getData() != null ? LS.getData().currentUser.response.pageUrls : "";


      var permissionList = role.concat(pageUrls);
      // console.log('===permissionList==', permissionList);
      if (permissionList && _.indexOf(permissionList, permission) > -1) {
        return true;
      } else {
        return false;
      }
    }
  };
});
