'use strict';

app
  .controller('MainCtrl', function($scope, $http, httpService, $translate, $rootScope, $location, LS, config, commonFunctions) {

    commonFunctions.checkUserSession();

    $scope.main = {

      title: 'Minovate',
      settings: {
        navbarHeaderColor: 'scheme-light',
        sidebarColor: 'scheme-light',
        brandingColor: 'scheme-light',
        activeColor: 'cyan-scheme-color',
        headerFixed: true,
        asideFixed: true,
        rightbarShow: false
      }
    };

    $scope.ajaxFaker = function() {
      $scope.data = [];
      var url = 'http://www.filltext.com/?rows=10&fname={firstName}&lname={lastName}&delay=5&callback=JSON_CALLBACK';

      $http.jsonp(url).success(function(data) {
        $scope.data = data;
        angular.element('.tile.refreshing').removeClass('refreshing');
      });
    };

    // Custom Changes

    $scope.changeLanguage = function(langKey) {
      $translate.use(langKey);
      $scope.currentLanguage = langKey;
    };
    $scope.currentLanguage = $translate.proposedLanguage() || $translate.use();


    // if (LS.getData() == null) {
    //   destroyUserSession();
    // } else {
    //   httpService.httpGet('/checkusersession')
    //     .then(function(res) {
    //       if (res == "auth fail redirect to login") {
    //         destroyUserSession();
    //       }
    //
    //     }); //checkusersession
    //
    // } //if else

    // function destroyUserSession() {
    //   $rootScope.currentUser = undefined;
    //   LS.setData(null);
    //   $location.path('/');
    //   return false;
    // }; //destroyUserSession


  });
