'use strict';
app.controller('loanerMasterCtrl', function($scope, $rootScope, $http, $state, $location, httpService,
    FileUploader, config, commonFunctions, LS, toastr, DTOptionsBuilder, DTColumnBuilder, $q) {

    commonFunctions.checkUserSession();

    var headers = '';
    // $t = _.now();
    $scope.loading = false;
    $scope.fileRes = false;
    $scope.errorRes = {};
    $scope.errResData = {};
    $scope.authorized = false;

    $scope.templateHref = {}
    $http.get('config/template_href.json').success(function(data) {
        $scope.templateHref = data;
    });

    $scope.launchFilePicker = function() {
        angular.element('#fileDialog').trigger('click');
    };

    var uploader = $scope.uploader = new FileUploader({
        headers: {
            'sessionId': ($rootScope.currentUser.response == null) ? null : $rootScope.currentUser.response.sessionID
        },
        url: config.serverurl + '/loanermaster'
    });

    uploader.filters.push({
        name: 'customFilter',
        fn: function() {
            if (this.queue.length == 1 && $scope.fileRes) {
                angular.element('#clearQ').trigger('click');
            }
            return (this.queue.length < 1) || (this.queue.length == 1 && $scope.fileRes);
        }
    });

    uploader.filters.push({
        name: 'fileFormatFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            var type = '|' + item.type + '|';
            return '|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|application/vnd.ms-excel|application/ms-excel|text/csv|'.indexOf(type) !== -1;
        }
    });

    uploader.filters.push({
        name: 'fileExtensionFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            var fileExt = '|' + item.name.split('.').pop() + '|';
            return '|csv|xls|xlsx|'.indexOf(fileExt) !== -1;
        }
    });

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
        if (filter.name == 'customFilter') {
            var errorMsg = 'You can select only one file at a time.';
            commonFunctions.openToastr('error', errorMsg);
        } else if (filter.name == 'fileFormatFilter' || filter.name == 'fileExtensionFilter') {
            var errorMsg = 'Incorrect File Format.';
            commonFunctions.openToastr('error', errorMsg);
        } else {
            var errorMsg = 'Oops! Something went wrong.';
            commonFunctions.openToastr('error', errorMsg);
        }
    };
    uploader.onAfterAddingFile = function(fileItem) {
        document.getElementById('fileDialog').value = null;
        $scope.fileRes = false;
    };

    uploader.onBeforeUploadItem = function(item) {
        $scope.loading = true;
        item.formData.push({ "fileSize": item.file.size });
    };
    uploader.onProgressItem = function(fileItem, progress) {};
    uploader.onSuccessItem = function(fileItem, response, status, headers) {};
    uploader.onErrorItem = function(fileItem, response, status, headers) {};
    uploader.onCancelItem = function(fileItem, response, status, headers) {};
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        if (!_.isEmpty(response) && _.isObject(response)) {
            if (response.error) {

                if (response.data) {
                    $scope.errResData = response.data;

                    //promise function for get data from table
                    var getTableData = function() {
                        var deferred = $q.defer();
                        deferred.resolve(response.data);
                        return deferred.promise;
                    };

                    function render(data) {
                        return '<p style="color: red" /p>' + data;
                    };

                    $scope.authorized = true;
                    //rander data in table or download data in to excel
                    $scope.dtOptions = DTOptionsBuilder.fromFnPromise(getTableData)
                        .withBootstrap()
                        .withDOM('frtip')
                        .withPaginationType('full_numbers')
                        .withButtons([{
                            extend: 'excel',
                            exportOptions: {
                                columns: [2, 3]
                            }
                        }]);
                    //table columns
                    $scope.dtColumns = [
                        DTColumnBuilder.newColumn('Id').withTitle('Id'),
                        DTColumnBuilder.newColumn('flag').withTitle('flag').renderWith(render),
                        //DTColumnBuilder.newColumn('product_name').withTitle('product_name'),
                        DTColumnBuilder.newColumn('model_name').withTitle('model_name'),
                        DTColumnBuilder.newColumn('serial_no').withTitle('serial_no')
                    ];
                }

                $scope.loading = false;
                $scope.errorRes = response.error;
                toastr.error(response.error);
            } else if (response.success) {
                $scope.authorized = false;
                $scope.loading = false;
                toastr.success(response.success, {
                    closeButton: true
                });
            }
        } else {
            if (response == "auth fail redirect to login") {
                commonFunctions.openToastr('error', 'Session Expired');
                setTimeout(function() {
                    LS.setData(null);
                    $state.go('core.login');
                }, 1000);

            } else {
                commonFunctions.openToastr('error', response);
            }

            $scope.loading = false;
            $scope.fileRes = true;
            $scope.response = false;
        }
    };

});