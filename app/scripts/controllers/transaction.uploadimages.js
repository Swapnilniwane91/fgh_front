app.controller('uploadimageCtrl', function($window, $scope, $rootScope, $http, $state, $location, httpService, Upload, FileUploader, config, commonFunctions, LS, toastr) {

    commonFunctions.checkUserSession();
    $scope.serverUrl = config.serverurl.split("/esp/api")[0];
    $rootScope.pageDoc = $rootScope.hd;

    $scope.loading = false;
    $scope.fileRes = false;

    $scope.fileUpload = true;
    $scope.filedetail = false;

    $scope.launchFilePicker = function() {
        angular.element('#fileDialog').trigger('click');

    };


    var url = config.serverurl + '/uploadmultiplefile';
    var uploader = $scope.uploader = new FileUploader({
        //enable this option to get f
        url: url
    });

    uploader.filters.push({
        name: 'customFilter',
        fn: function() {
            return this.queue.length < 12;
        }
    });

    uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    // CALLBACKS
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {};
    uploader.onAfterAddingFile = function(fileItem) {};
    uploader.onAfterAddingAll = function(addedFileItems) {};
    uploader.uploadall = function(item) {};
    uploader.onBeforeUploadItem = function(item) {};
    uploader.onProgressItem = function(fileItem, progress) {};
    uploader.onProgressAll = function(progress) {};
    uploader.onSuccessItem = function(fileItem, response, status, headers) {};
    uploader.onErrorItem = function(fileItem, response, status, headers) {};
    uploader.onCancelItem = function(fileItem, response, status, headers) {};

    /* Get Files Details  */
    var files = [];
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        files.push(response.files[0]);
        $scope.fileDetails = files;
        $scope.filedetail = true;
        $scope.fileUpload = false;
    };
    /* End File Details */

    /* Remove Button */
    $scope.remove = function(index) {
            // console.log(index);
            // for (var i = $scope.fileDetails.length - 1; i >= 0; i--) {
            // if ($scope.fileDetails[i] == $scope.fileDetails.file) {
            $scope.fileDetails.splice(index, 1);
            console.log($scope.fileDetails);
            // }
            // }
        }
        /* End Remove Button */
    uploader.onCompleteAll = function(fileItem) {};

    /* Submit Files With Remarks */
    $scope.submit = function() {

        $scope.finalSubmit = [];
        var imagefiles = $scope.fileDetails;

        for (var i = 0; i < imagefiles.length; i++) {
            imagefiles[i] && !imagefiles[i].remarks ? imagefiles[i].remarks = '' : imagefiles[i]
            $scope.finalSubmit.push(imagefiles[i]);
        }

        var images = {
            "data": {
                "headId": $rootScope.pageDoc,
                "uploadDocDetails": $scope.finalSubmit
            }
        }

        httpService.sendCommand("/storeMultiplefiles", images)
            .then(function(result) {
                toastr.success(result.data[0].multipleuploaddoc, {
                    closeButton: true,
                    progressBar: true,
                });
                //$location.path('/transaction/pickupdrop');
                $window.history.back();
            });
        // $scope.filedetail = false;
    }

    $scope.goBack = function() {
        //$location.path('/transaction/pickupdrop');
        $window.history.back();
    }

});