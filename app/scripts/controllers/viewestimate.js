app
  .controller('viewEstimateCtrl', function($scope, $rootScope, httpService, $http, toastr,
    commonFunctions, $location, commonFunctions, $filter, $window, LS) {
    var url = $location.absUrl().split("#/")[0];
    commonFunctions.checkUserSession();
    if(_.isEmpty($rootScope.viewData)){
    $location.path('/transaction/unitEstimateList')
    }
    $scope.isSubmit = false;
    $scope.data = {};
    $scope.serviceTax = {}
    $scope.vat = {}

    // set default
    $scope.setDefault = function() {
      $scope.withLabour = 0;
      $scope.data.labourCharge = '';
      $scope.vatTax = 0;
      $scope.serviceRs = 0;
      $scope.vatAmount = 0;
      $scope.serviceAmount = 0;
      $scope.finalAmount = 0;
      $scope.total = 0;
      $scope.data.partCode = '';
      $scope.data.partDescription='';
      $scope.data.partAmount =0;
      $scope.vatFix = 0;
    }
    $scope.setDefault();
    /* to clean amount fields in case fail type changes*/
    $scope.$watch('data.failTypeID', function(failType) {
      if (failType == 2) {
        $scope.data.edr = '';
        // $scope.viewData[0].estimateRemarks='';
        $scope.partData = [];
        $scope.setDefault();
      }

    });
    $scope.viewData=$rootScope.viewData;
    // console.log($scope.viewData);
    /* back button */
    $scope.back = function() {
      $rootScope.viewData={};
      $location.path('/transaction/unitEstimateList');
    }

    /*grid functionality */
    $scope.checkList = [];
    $scope.partData = [];
    $scope.total = 0;

    // $scope.tblPart = false;
    $scope.addPart = function(code, des, amnt) {
      if ($scope.partData.length < 15) {
        $scope.tblPart = true;
        $scope.checkList = _.pluck($scope.partData, 'partCode');
        if (_.indexOf($scope.checkList, code)) {

          $scope.partData.push({
            "partCode": code,
            "partDescription": des,
            "partAmount": amnt
          })
          // var total = parse()+parse()

          //  $scope.total = parseFloat($scope.total) + parseFloat(amnt);
          //  $scope.total = $filter('number')($scope.total, 2)
          $scope.total = parseFloat($scope.total) + parseFloat(amnt);

          // console.log($scope.total);


          $scope.data.partCode = '';
          $scope.data.partDescription = '';
          $scope.data.partAmount = '';

        } else {
          toastr.error('This part code is already added.', 'Error');
        }
      } else {
        toastr.error('You can add maximum 15 Parts.', 'Error');
      }
    };

    $scope.removePart = function(partCode, partDescription, partAmount, index) {
        $scope.partData.splice(index, 1);
        $scope.total = parseFloat($scope.total) - parseFloat(partAmount);
        $scope.checkList.splice(index, 1);
        if ($scope.partData.length == 0) {
          $scope.tblPart = false;
        }
      } //removePart

    // calculations

    $scope.$watchCollection('[total, data.labourCharge]', function(total) {
      // console.log(total);
      $scope.vatTax = parseFloat(total[0]) * (parseFloat($scope.vat.taxPercentage) / 100);
      if (total[0] != 0) {
        $scope.vatFix = parseFloat(total[0]) + parseFloat($scope.vatTax);
        $scope.withLabour = parseFloat(total[1]) * (parseFloat($scope.serviceTax.taxPercentage) / 100);
        $scope.serviceRs = parseFloat($scope.withLabour) + parseFloat(total[1]);
        $scope.finalAmount = $scope.serviceRs + $scope.vatFix;
      } else {
        $scope.setDefault();
      }
    });

    // get tax details
    $scope.taxDetails = {};
    httpService.getData('/taxdetails').then(function(result, error) {
      // console.log(result);
      $scope.taxDetails = result.data;
      $scope.vat = $scope.taxDetails[3];
      $scope.serviceTax = $scope.taxDetails[0];
    });


    // getFailTypeList
    $scope.failtypes = {};
    httpService.getData('/getFailTypeList').then(function(result, error) {
      $scope.failtypes = result.data;
    });

    //submit function
    $scope.submit = function() {
      $scope.isSubmit = true;
      var temp = {

        "partcharges": $scope.partData,
        "partChargesTotal": $scope.total,
        "edr": $scope.data.edr,
        "failtypeid": $scope.data.failTypeID,
        "labourcharges": $scope.data.labourCharge || 0,
        "estimationamount": $scope.finalAmount,
        "vatName": $scope.vat.taxName,
        "serviceName": $scope.serviceTax.taxName,
        "vatPercent": $scope.vat.taxPercentage,
        "serviceTaxPercent": $scope.serviceTax.taxPercentage,
        "serviceCharges": $scope.withLabour,
        "vatCharges": $scope.vatTax,
        "remarks": $scope.viewData.estimateRemarks || '',
        "headid": $scope.viewData.headid

      };
      // console.log(temp);
      httpService.sendCommand('/saveestimate', {
        data: temp
      }).then(function(result, error) {
        // console.log('>> ', result);
        $scope.isSubmit = false;
        if (result && result.message == 'Unit Estimated Successfully') {
          toastr.success(result.message, {
            progressBar: true,
            closeButton: true
          });
          if (result.data.invoiceNo == 'Warranty Case') {
            // console.log("inner if working");
            $scope.back();


          } else {
            $rootScope.invoice_headid = temp.headid;
            $rootScope.invoice = "estimate";
            $location.path('/transaction/estimateInvoice');
          }

        } else {
          toastr.error(error, {
            progressBar: true,
            closeButton: true
          });
          $scope.cancelFn();
          $scope.back();
        }

      });
    }; //SubmitFn
    // upload function

    $rootScope.data.headId = [];
    $scope.uploadImage = function(ticketNumber) {
            $rootScope.data.selectedTicket = $scope.viewData.ticketnumber;
            $rootScope.data.headId = $scope.viewData.headid;
            LS.setData($rootScope.data);
            $window.open(url +'#/transaction/uploadImage', $rootScope.headId);
        }

    $scope.cancelFn = function() {
      $scope.viewData.estimateRemarks = "",

        $scope.data.edr = "",
        $scope.total = 0,
        $scope.data.failTypeID = ""
      $scope.tblPart = false;
      $scope.setDefault();


      // $scope.cancelFn;
    };

  });
