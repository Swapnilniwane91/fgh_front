app.controller('pincodeMasterCtrl', function($scope, $http, $state, httpService, toastr, commonFunctions, $rootScope, DTOptionsBuilder, DTColumnBuilder) {

    commonFunctions.checkUserSession();
    $scope.disableCenter = true;
    $scope.buttonSubmit = "Submit";
    $scope.isState = true;
    $scope.isDistrict = true;

    $scope.zipErrors = '';
    $scope.zipChanges = function zipChanges(pincode) {
        $scope.zipErrors = '';
        if (!pincode) return
        if (pincode.length < 6 && pincode.length > 0) {
            $scope.zipErrors = "Please Enter 6 digit Pincode";
            return;
        }
        httpService.sendCommand('/pincode_map', {
        pincode: pincode
        }).then(function(result) {
        if (result.error) {
            $scope.zipErrors = '';
        } else {
            $scope.zipErrors = 'Pincode is Already Exists';
        }
        });
    };
    // Bind All countries
    $scope.getCountries = {};
    httpService.getData("/getCountries", {})
        .then(function(result) {
            $scope.getCountries = result.data;
    });

    //bind States....
    $scope.getState ={};
    $scope.getStates = function(countryid) {
        $scope.selectedState = '';
        $scope.selecteddistrict = '';
        if(!countryid){
            $scope.isState = true;
            $scope.isDistrict = true;
        }else{
            $scope.isState = false;
        }
        var country= {
            "data": {
                "countryid": countryid
            }
        };
        httpService.sendCommand("/getStates", country)
            .then(function(result) {
                $scope.getState = result.data;
        });
    }

    //bind District....
    $scope.getDistrict = {};
    $scope.getDistrics = function(stateid) {
        $scope.selecteddistrict = '';
        if(!stateid){
            $scope.isDistrict = true;
        }else{
            $scope.isDistrict = false;
        }
        var state= {
            "data": {
                "stateid": stateid
            }
        };
        httpService.sendCommand("/getDistrics", state)
            .then(function(result) {
                $scope.getDistrict = result.data;
        });
    }

    //  Submit function
    $scope.submitData = function() {
        var newPincode = {
            "data": {
                "pincode": $scope.pincode,                
                "districtid": $scope.selecteddistrict,
                "stateid": $scope.selectedState,
                "countryid": $scope.selectedcountry
            }
        };
        httpService.sendCommand("/insertNewPincode", newPincode)
            .then(function(result) {
                if (result.data  == "Pincode Added Successfully") {
                    toastr.success(result.data, {
                        closeButton: true,
                        progressBar: true,
                    });
                    $scope.reset();
                }
            });
    };

    $scope.reset = function() {
        $scope.pincode = '';
        $scope.selecteddistrict = '';
        $scope.selectedState = '';
        $scope.selectedcountry = '';
        $scope.zipErrors = '';
        $scope.isState = true;
        $scope.isDistrict = true;
        $scope.buttonSubmit = "Submit"
    }
});
