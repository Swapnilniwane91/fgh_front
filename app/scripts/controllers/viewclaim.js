app
    .controller('viewClaimCtrl', function($scope, $rootScope, $base64, httpService, $http, toastr, $location, $mdDialog, commonFunctions, config, FileSaver, Blob) {
        commonFunctions.checkUserSession();
        $scope.isSubmit = false;
        $scope.claims = [];
        $scope.problemData = [];
        // $scope.serverUrl = config.serverurl.split("/esp/api")[0];
        $scope.serverUrl = "http://code.b2x.com/smartprotectapi";
        console.log($scope.serverUrl,'----', config.serverurl.split("/esp/api"));
        $scope.uploadDocs = [];
        $scope.claims = $rootScope.viewClaimData.claim;
        $scope.headid =  $rootScope.viewClaimData.claim[0].serviceRequestHeadId;
        $scope.uploadDocs = $rootScope.viewClaimData.uploadDoc;
        $scope.problemData = $rootScope.viewClaimData.problemList;
        $scope.repairType = $rootScope.viewClaimData.repaireType;
        $scope.amount = parseInt($scope.claims[0].estimationAmount);

        /* to calculate deductible amount*/
        $scope.$watchCollection('[claims[0].estimationAmount, data.excessPayment]', function(amnt) {
            $scope.data.deductible = parseInt(amnt[0]) - parseInt(amnt[1]);
        });


        /* back button */
        $scope.back = function() {
            // $rootScope.viewClaimData.remove;
            $location.path('/insurance/claimApproval');
        }
        /*view doc function*/
        $scope.viewDoc = function() {
          $rootScope.invoice_headid = $scope.headid;
          $rootScope.invoice = "insuranceclaim";
          $location.path('/transaction/estimateInvoice');
        }
        /* alert function on accept and reject button */
        $scope.showConfirm = function(ev, action) {
          $scope.isSubmit = true;
            if (action == 'Rejected' && !$scope.data.claimRemark) {
                toastr.warning('Remarks needed for rejecting the claim.', {
                    progressBar: true,
                    closeButton: true
                });
                return false;
            }
            var expectedDateOfRepair = new Date();
            expectedDateOfRepair.setDate(expectedDateOfRepair.getDate() + $scope.claims[0].expectedDaysOfRepair);
            var temp = {
                "ticketNumber": $scope.claims[0].ticketNumber,
                "claimResult": action,
                "expectedDateOfRepair": expectedDateOfRepair,
                "advancedAmount": $scope.data.advanceAmount || null,
                "deductibleAmount": $scope.data.deductible || null,
                "advancePRemark": $scope.data.remarks || null,
                "repairType": $scope.data.repairType || null,
                "excessPayment": $scope.data.excessPayment || null,
                "claimRemark": $scope.data.claimRemark || null
            };
            if (action == "Approved") {
                var msg = 'Are you sure you want to ACCEPT this claim?'
            } else {
                var msg = 'Are you sure you want to REJECT this claim?'
            }
            var confirm = $mdDialog.confirm()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .title('Confirm your action')
                .content(msg)
                .ok('Yes')
                .cancel('No')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function() {
                httpService.sendCommand('/claimApproval', {
                    data: temp
                }).then(function(result, error) {
                  $scope.isSubmit = false;
                    if (result && result.message) {
                        toastr.success(result.message, {
                            progressBar: true,
                            closeButton: true
                        });
                        $scope.back();
                    } else {
                        toastr.error(result.message, {
                            progressBar: true,
                            closeButton: true
                        });
                    }
                });
            });
        };

        /* gallery */

        $scope.download = function(imgUrl) {

            var fileName = imgUrl.split("/").pop()
            var a = document.createElement('a');
            a.href = imgUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        };
    });
