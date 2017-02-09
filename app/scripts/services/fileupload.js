var app = angular.module("espApp");

app.service('fileUpload', ['$http', function ($http,$q,config, $rootScope) {
                this.uploadFileToUrl = function(file, uploadUrl){
                   var fd = new FormData();
                   fd.append('file', file);
                   uploadUrl = config.fileurl;

                   console.log('service',uploadUrl);
                   $http.post(uploadUrl, fd, {
                      transformRequest: angular.identity,
                      // headers: {'Content-Type': undefined}
                   })

                   .success(function(){
                   })

                   .error(function(){
                   });
                }
             }]);