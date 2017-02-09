app.controller('userRoleClientMappingCtrl', function($scope, $http, $state, httpService, toastr, commonFunctions, $rootScope, DTOptionsBuilder, DTColumnBuilder) {

    commonFunctions.checkUserSession();
    $scope.searchFields = {};
    $scope.authorized = false;
    $scope.disableCenter = true;

     /* Bind GridView */
    $scope.getAllUsers = function() {
        httpService.getData('/userRoleClientDetailsShow').then(function(result, error) {
            $scope.authorized = true;
            $scope.userRoleClientMappingDetails = result.data;
            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withBootstrap()
                .withPaginationType('full_numbers')
            $scope.dtColumns = [            
                DTColumnBuilder.newColumn(0).withTitle('User Name'),
                DTColumnBuilder.newColumn(1).withTitle('Clients'),
                DTColumnBuilder.newColumn(2).withTitle('Roles'),
                DTColumnBuilder.newColumn(3).withTitle('Action'),
            ];
        });
    }

    $scope.buttonSubmit = "Submit"
    $scope.getAllUsers();

    // Bind Users
    httpService.getData("/getAllUsers", {})
        .then(function(result) {
            $scope.allusers = result.data;
        });

    // Bind All Clients
    httpService.getData("/getAllClients", {})
        .then(function(result) {
            $scope.allClients = result.data;
        });

    // Bind User & Client Wise
    $scope.getRoleClient = function(id, cid) {
        var getRoles = {
            "data": {
                "userid": $scope.searchFields.users,
                "clientid": $scope.searchFields.clients
            }
        };
        // Bind All Roles
        $scope.allRoles={};
        httpService.sendCommand("/getAllRoles", getRoles)
            .then(function(result) {
                $scope.allRoles = result.data;
            });
    }

    // Edit Center On Seleted the Store
    $scope.getRoleDetails = function(id) {
        if ($scope.searchFields.multipleRoles.indexOf(4) > -1) {
            $scope.disableCenter = false;
        } else {
            $scope.disableCenter = true;
        }
    }

    // Bind All centers
    httpService.getData("/getAllCenters", {})
        .then(function(result) {
            $scope.allCenters = result.data;
        });
    /* edit */
    $scope.editData = function(userroleclientid) {
        $scope.buttonSubmit = "Update";
        var editableData = _.filter($scope.userRoleClientMappingDetails, function(user) {
            return user.userroleclientid == userroleclientid;            
        })[0];
        $scope.disableUser = true;
        $scope.searchFields.users = editableData.userid.toString();
        $scope.searchFields.oldUserRoleClientId = editableData.userroleclientid.toString();
        $scope.searchFields.clients = editableData.clientid.toString();
        $scope.getRoleClient(editableData.userid, editableData.clientid);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    };

    //  Submit function
    $scope.submitData = function() {
        var userClientRoleObj = {
            "data": {
                "userid": $scope.searchFields.users,                
                "clientid": $scope.searchFields.clients,
                "roleid": $scope.searchFields.multipleRoles,
                "olduserroleclientId": $scope.searchFields.oldUserRoleClientId || null,
                "centerid": $scope.searchFields.centers || null
            }
        };
        httpService.sendCommand("/insertUserRoleClient", userClientRoleObj)
            .then(function(result) {
                if (result.data.message == 'User Role Mapping Done Successfully.') {
                    toastr.success(result.data.message, {
                        closeButton: true,
                        progressBar: true,
                    });
                    $scope.getAllUsers();
                    $scope.reset();
                }
            });
    };
    $scope.isStoreSelected = false
    $scope.$watch(function($scope){ return $scope.searchFields.multipleRoles }, function(){
        // console.log( $scope.searchFields.multipleRoles, _.indexOf($scope.searchFields.multipleRoles, 4))
        if(_.indexOf($scope.searchFields.multipleRoles, 4) >= 0){
            $scope.isStoreSelected = true
        }
        else{
            $scope.isStoreSelected = false
        }
    })

    $scope.reset = function() {
        $scope.searchFields = {};
        $scope.disableUser = false;
        $scope.buttonSubmit = "Submit"
        $scope.disableCenter = true;
    }
});

// app.filter('filterExtension', function() {
//     return function(input, splitChar, splitIndex) {
//         var a = []
//         //  a= _.map(input, function(num){
//         //     return _.object(num)
//         //     //  console.log(_.object(num))
//         // })
//         _.each(input, function(num){
//             console.log(num);
//         })
//         // console.log(a)
//     }

// });
