app.controller('saleProductCtrl', function($scope, $rootScope, httpService, Upload, config, toastr, $location) {

    $scope.page = {
        title: 'Sales',
        subtitle: 'Product'
    };

    $scope.isDisabled = false;

    $scope.today = function() {
        $scope.pop = new Date();
        $scope.policyDate = new Date();
    };
    $scope.today();

    $scope.clear = function() {
        $scope.pop = null;
        $scope.policyDate = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        // dateDisabled: disabled,
        formatYear: 'yy',
        minDate: new Date(),
        maxDate: new Date(),
        startingDay: 1
    };

    $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.pop = new Date(year, month, day);
        $scope.policyDate = new Date(year, month, day);
    };

    $scope.format = "dd/MM/yyyy"

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
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



    $scope.ProductCats = {};
    httpService.getData('/getProductCategory').then(function(result, error) {
        $scope.ProductCats = result.data;
    });

    $scope.clients = {};
    $scope.pPlans = {};
    $scope.ewPlans = {};
    $scope.proCatChange = function(proCatId) {
        httpService.sendCommand('/getClient', { clientsId: $rootScope.currentUser.response.clientIds, proCatId: proCatId })
            .then(function(result, err) {
                $scope.clients = result.data;
            });
        if (proCatId == 1) {
            httpService.getData('/getPolicyPlans/' + proCatId).then(function(result, error) {
                $scope.pPlans = result.data;
            });

        } else {
            $scope.form4Data.policyDate = "";
            $scope.form4Data.policyId = ""
            $scope.modelChange = function(modelId) {
                httpService.getData('/getEWPlans/' + modelId).then(function(result, error) {
                    $scope.ewPlans = result.data;
                });
            };
        }
    };

    $scope.zipRes = {};
    $scope.zipError = {};
    $scope.zipChange = function zipChange(pincode) {
        httpService.sendCommand('/pincode_map', {
            pincode: pincode
        }).then(function(result, err) {
            if (result.error) {
                $scope.zipRes = {};
                $scope.zipError = result.error;
            } else {
                $scope.zipError = "";
                $scope.zipRes = result.data[0];
            }
        });
    };

    $scope.checkIMEI = function(id, value) {
        httpService.sendCommand('/check_imei', { id: id, imei: value }).then(function(result, error) {
            if (result.flag == false) {
                $scope.existIMEI = result.message;
                toastr.error($scope.existIMEI);
            } else {
                $scope.existIMEI = "";
            }
        })
    }

    $scope.oems = {};
    httpService.getData('/get_oem').then(function(result, error) {
        $scope.oems = result.data;
    });

    $scope.pfamilies = {};
    httpService.getData('/get_product_family').then(function(result, error) {
        $scope.pfamilies = result.data;
    });

    $scope.oss = {};
    httpService.getData('/get_OS').then(function(result, error) {
        $scope.oss = result.data;
    });

    $scope.products = {};
    $scope.oemChange = function(oemId) {
        httpService.getData('/get_product/' + oemId).then(function(result, error) {
            $scope.products = result.data;
        });
        $scope.pfdisable = false;

        if (oemId == 1) {
            $scope.pfdisable = true;
        }
    };

    $scope.models = {};
    $scope.productChange = function(productId) {
        httpService.getData('/get_model/' + productId).then(function(result, error) {
            $scope.models = result.data;
        })
    };

    $scope.formData = [];
    $scope.file1 = [];
    $scope.step0Submit = function(value) {
        $scope.form0Data = value;
    };

    $scope.arr = [];
    $scope.step1Submit = function(value) {
        var f = $scope.file1.file;
        $scope.form1Data = value;
        $scope.isDisabled = false;

    };

    $scope.step2Submit = function(value) {
        $scope.form2Data = value;
        $scope.isDisabled = false;
    };

    $scope.step3Submit = function(value) {
        $scope.form3Data = value;
        $scope.isDisabled = false;
    };

    $scope.form4Data = {};
    $scope.isDisabled = false;

    $scope.submitPolicy = function(value) {
        $scope.form4Data = value;
        $scope.formData = [$scope.form0Data, $scope.form1Data, $scope.form2Data, $scope.form3Data, $scope.form4Data];
        $rootScope.current_customer = $scope.formData;
        var url = config.serverurl + '/uploaddoc/';
        Upload.upload({
            url: url,
            data: {
                file: $scope.file1.file
            }
        }).then(function(resp) {
            var file = resp.data.filename;
            $scope.form1Data.filePath = file;
            if (resp.data.filename != null) {
                httpService.sendCommand('/generatePolicy', {
                    data: $scope.formData
                }).then(function(result, error) {
                    if (result.flag == false) {
                        toastr.error(result.message);
                        $scope.isDisabled = true;
                    } else if (result.flag == true) {
                        $scope.isDisabled = true;
                        toastr.success(result.message, {
                            closeButton: true
                        });
                        $scope.isDisabled = false;
                        $scope.formData = [];
                        $rootScope.sale_product_invoice = result;
                        $location.path('/sale/invoice');
                    }
                });
            } else {
                alert('an error occured');
            }
        });    
    };  
});


app.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);