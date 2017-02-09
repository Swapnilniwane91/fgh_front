'use strict';

var app = angular.module("espApp");

app.service('httpService', function($http, $location, $q, config, $rootScope, LS) {
  this.sendCommand = function(url, cmdObject, responseType) {
    cmdObject.platform = "webApp";
    var d = $q.defer();
    var url = config.serverurl + url;
    //var sessionId = ($rootScope.currentUser == null) ? null : $rootScope.currentUser.response.sessionID;

    $http({
        method: 'POST',
        url: url,
        // headers: {
        //   'sessionId': sessionId
        // },
        responseType: responseType,
        data: cmdObject
      })
      .success(function(data, status, headers) {
        if (data == "auth fail redirect to login") {
          alert('Your session has been expired.');
          $location.path('/login');
        } else {
          d.resolve(data);
        }
      })
      .error(function(data) {
        d.reject(data);
      });
    return d.promise;
  };

  this.getData = function(url) {
    //var sessionId = ($rootScope.currentUser == null) ? null : $rootScope.currentUser.response.sessionID;
    var url = config.serverurl + url;
    var d = $q.defer();
    $http({
      method: 'GET',
      url: url
      // headers: {
      //   'sessionId': sessionId
      // }
    }).success(function(data) {
      d.resolve(data);
    }).error(function() {
      d.reject('error');
    });
    return d.promise;
  };

  this.httpGet = function(url) {
    var d = $q.defer();
    //var sessionId = ($rootScope.currentUser == null) ? null : $rootScope.currentUser.response.sessionID;
    var url = config.serverurl + url;
    $http({
      method: 'GET',
      url: url
      // headers: {
      //   'sessionId': sessionId
      // }
    }).success(function(data) {
      d.resolve(data);
    }).error(function() {
      d.reject('error');
    });
    return d.promise;
  };

  this.httpPost = function(url, cmdObject) {
    var d = $q.defer();
    var url = config.serverurl + url;
    $http.post(url, cmdObject)
      .success(function(data) {
        d.resolve(data);
      })
      .error(function(data) {
        d.reject(data);
      });
    return d.promise;
  };
});
