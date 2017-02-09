var app = angular
    .module('espApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'ngMessages',
        'picardy.fontawesome',
        'ui.bootstrap',
        'ui.router',
        'ui.utils',
        'angular-loading-bar',
        'angular-momentjs',
        'FBAngular',
        'lazyModel',
        'toastr',
        'angularBootstrapNavTree',
        'oc.lazyLoad',
        'ui.select',
        'ui.tree',
        'textAngular',
        'colorpicker.module',
        'angularFileUpload',
        'ngFileUpload',
        'ngImgCrop',
        'datatables',
        'datatables.bootstrap',
        'datatables.colreorder',
        'datatables.colvis',
        'datatables.tabletools',
        'datatables.scroller',
        'datatables.columnfilter',
        'datatables.buttons',
        'ui.grid',
        'ui.grid.resizeColumns',
        'ui.grid.edit',
        'ui.grid.moveColumns',
        'ngTable',
        'smart-table',
        'angular-flot',
        'angular-rickshaw',
        'easypiechart',
        'uiGmapgoogle-maps',
        'ui.calendar',
        'ngTagsInput',
        'pascalprecht.translate',
        'ngMaterial',
        'localytics.directives',
        'leaflet-directive',
        'wu.masonry',
        'ipsum',
        'angular-intro',
        'dragularModule',
        'ngFileSaver',
        'base64'
    ])
    .run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeSuccess', function(event, toState) {
            event.targetScope.$watch('$viewContentLoaded', function() {
                angular.element('html, body, #content').animate({
                    scrollTop: 0
                }, 200);

                setTimeout(function() {
                    angular.element('#wrap').css('visibility', 'visible');
                    if (!angular.element('.dropdown').hasClass('open')) {
                        angular.element('.dropdown').find('>ul').slideUp();
                    }
                }, 200);
            });
            $rootScope.containerClass = toState.containerClass;
        });
    }])
    .config(['uiSelectConfig', function(uiSelectConfig) {
        uiSelectConfig.theme = 'bootstrap';
    }])

.config(function(toastrConfig) {
        angular.extend(toastrConfig, {
            autoDismiss: false,
            containerId: 'toast-container',
            maxOpened: 0,
            newestOnTop: true,
            positionClass: 'toast-top-right',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            target: 'body'
        });
    })
    //angular-language
    .config(['$translateProvider', function($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'languages/',
            suffix: '.json'
        });
        $translateProvider.useLocalStorage();
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy(null);
    }])
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state('app', {
                abstract: true,
                url: '',
                templateUrl: 'views/tmpl/app.html'
            })
            // global search
            .state('app.globalSearch', {
                url: '/globalSearch',
                templateUrl: 'views/tmpl/master/globalSearch.html'
            })
            //dashboard
            .state('app.dashboard', {
                url: '/dashboard',
                controller: 'DashboardCtrl',
                templateUrl: 'views/tmpl/dashboard.html',
                // resolve: {
                //   plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                //     return $ocLazyLoad.load([
                //       'scripts/vendor/datatables/datatables.bootstrap.min.css',
                //       'scripts/vendor/datatables/datatables.bootstrap.min.css'
                //     ]);
                //   }]
                // }
            })
            //
            .state('app.totalServiceRequestGenerated', {
                url: '/totalServiceRequestGenerated',
                templateUrl: 'views/tmpl/dashboard/totalServiceRequestGenerated.html'
            })
            .state('app.totalUnitsEstimated', {
                url: '/totalUnitsEstimated',
                templateUrl: 'views/tmpl/dashboard/totalUnitsEstimated.html'
            })
            .state('app.totalServiceRequestClosed', {
                url: '/totalServiceRequestClosed',
                templateUrl: 'views/tmpl/dashboard/totalServiceRequestClosed.html'
            })
            .state('app.pendingUnitsForPickup', {
                url: '/pendingUnitsForPickup',
                templateUrl: 'views/tmpl/dashboard/pendingUnitsForPickup.html'
            })
            .state('app.pendingUnitsForDrop', {
                url: '/pendingUnitsForDrop',
                templateUrl: 'views/tmpl/dashboard/pendingUnitsForDrop.html'
            })
            .state('app.totalUnitsPickedUp', {
                url: '/totalUnitsPickedUp',
                templateUrl: 'views/tmpl/dashboard/totalUnitsPickedUp.html'
            })
            .state('app.totalUnitsDropped', {
                url: '/totalUnitsDropped',
                templateUrl: 'views/tmpl/dashboard/totalUnitsDropped.html'
            })
            .state('app.totalClaimsRejected', {
                url: '/totalClaimsRejected',
                templateUrl: 'views/tmpl/dashboard/totalClaimsRejected.html'
            })
            .state('app.totalClaimsApproved', {
                url: '/totalClaimsApproved',
                templateUrl: 'views/tmpl/dashboard/totalClaimsApproved.html'
            })
            //mail
            .state('core', {
                abstract: true,
                url: '',
                template: '<div ui-view></div>'
            })
            //login
            .state('core.login', {
                url: '/login',
                controller: 'loginCtrl',
                templateUrl: 'views/login.html'
            })
            // forgot password
            .state('core.forgotpass', {
                url: '/forgotpass',
                controller: 'ForgotPasswordCtrl',
                templateUrl: 'views/tmpl/pages/forgotpass.html'
            })
            .state('app.sale', {
                url: '/sale',
                template: '<div ui-view></div>'
            })
            // policy forms
            .state('app.sale.sales', {
                url: '/sales',
                templateUrl: 'views/tmpl/sales/product.html'
            })
            // sale invoice
            .state('app.sale.invoice', {
                url: '/invoice',
                templateUrl: 'views/tmpl/sales/invoice.html'
            })
            //loaner master
            .state('app.addLoanerDevice', {
                url: '/addLoanerDevice',
                templateUrl: 'views/tmpl/master/loanermaster.html',
                // resolve: {
                //     plugins: ['$ocLazyLoad', function ($ocLazyLoad) {
                //         return $ocLazyLoad.load([
                //             'https://cdn.datatables.net/buttons/1.2.2/css/buttons.dataTables.min.css',
                //             'scripts/vendor/datatables/Responsive/dataTables.responsive.css',
                //             'scripts/vendor/datatables/Responsive/dataTables.responsive.js',
                //             'scripts/vendor/datatables/datatables.bootstrap.min.css'
                //         ]);
                //     }]
                // }
            })
            //forms
            .state('app.transaction', {
                url: '/transaction',
                template: '<div ui-view></div>'
            })
            //dispatch unit list
            .state('app.transaction.unitDispatchList', {
                url: '/unitDispatchList',
                templateUrl: 'views/tmpl/transaction/dispatch_assginment.html'
            })
            // pickup request forms
            .state('app.transaction.serviceRequest', {
                url: '/serviceRequest',
                controller: 'pickupReqCtrl',
                templateUrl: 'views/tmpl/transaction/pickuprequest.html'
            })
            // logistic Remarks forms
            .state('app.transaction.logisticRemarks', {
                url: '/logisticRemarks',
                controller: 'logisticRemarksCtrl',
                templateUrl: 'views/tmpl/transaction/logisticRemarks.html'
            })
            //PickUp Assignment List
            .state('app.transaction.serviceAssignmentList', {
                url: '/serviceAssignmentList',
                controller: 'pickupAssignCtrl',
                templateUrl: 'views/tmpl/transaction/pickupassignment.html'
            })

        // Pickup Document
        .state('app.transaction.pickupDocument', {
                url: '/pickupDocument',
                controller: 'pickupdocCtrl',
                templateUrl: 'views/tmpl/transaction/pickupdocument.html'
            })
            // Store Collection
            .state('app.transaction.storeCollection', {
                url: '/storeCollection',
                controller: 'storecollectionCtrl',
                templateUrl: 'views/tmpl/transaction/storecollection.html'
            })
            // Work In Progress
            .state('app.transaction.workinProgress', {
                url: '/workinProgress',
                controller: 'workInProgressCtrl',
                templateUrl: 'views/tmpl/transaction/workinprogress.html',
                // containerClass: ''
            })
            // Pending for excess payment list
            .state('app.transaction.excessPayment', {
                url: '/excessPayment',
                controller: 'excessPaymentCtrl',
                templateUrl: 'views/tmpl/transaction/excesspaymentreceive.html',
                // containerClass: ''
            })

        // UpLoad Images
        .state('app.transaction.uploadImage', {
            url: '/uploadImage',
            controller: 'uploadimageCtrl',
            templateUrl: 'views/tmpl/transaction/uploadImage.html'
        })

        // Store Unit Estimation List
        .state('app.transaction.unitEstimateList', {
                url: '/unitEstimateList',
                controller: 'unitestimationlistCtrl',
                templateUrl: 'views/tmpl/transaction/unitestimationlist.html'
            })
            // View for Estimation
            .state('app.transaction.viewEstimate', {
                url: '/viewEstimate',
                controller: 'viewEstimateCtrl',
                templateUrl: 'views/tmpl/transaction/viewestimate.html'
            })
            .state('app.transaction.estimateInvoice', {
                url: '/estimateInvoice',
                controller: 'estimateInvoiceCtrl',
                templateUrl: 'views/tmpl/transaction/estimateinvoice.html'
            })
            // View for Open service request
            .state('app.transaction.openServiceRequest', {
                url: '/openServiceRequest',
                controller: 'openSRCtrl',
                templateUrl: 'views/tmpl/transaction/openservicerequest.html'
            })

        // Reports
        .state('app.reports', {
                url: '/reports',
                template: '<div ui-view></div>'
            })
            // ticket Details
            .state('app.reports.ticketDetails', {
                url: '/ticketDetails',
                templateUrl: 'views/tmpl/reports/ticketDetails.html'
            })

        //Insurance
        .state('app.insurance', {
                url: '/insurance',
                template: '<div ui-view></div>'
            })
            // pickup request forms
            .state('app.insurance.claimApproval', {
                url: '/claimApproval',
                controller: '',
                templateUrl: 'views/tmpl/insurance/claimapproval.html'
            })
            .state('app.insurance.viewClaim', {
                url: '/viewClaim',
                controller: 'viewClaimCtrl',
                templateUrl: 'views/tmpl/insurance/viewclaim.html',
                // resolve: {
                //     plugins: ['$ocLazyLoad', function ($ocLazyLoad) {
                //         return $ocLazyLoad.load(['scripts/vendor/mixitup/jquery.mixitup.js']);
                //     }]
                // }
            })
            // Pickup & Drop
            .state('app.transaction.pickupDrop', {
                url: '/pickupDrop',
                templateUrl: 'views/tmpl/transaction/pickupDrop.html',
                // containerClass: ''
            })
            // master
            .state('app.master', {
                url: '/master',
                template: '<div ui-view></div>'
            })
            .state('app.importCustomerBase', {
                url: '/importCustomerBase',
                templateUrl: 'views/tmpl/master/importcustomerbase.html',
                // resolve: {
                //     plugins: ['$ocLazyLoad', function ($ocLazyLoad) {
                //         return $ocLazyLoad.load([
                //             'https://cdn.datatables.net/buttons/1.2.2/css/buttons.dataTables.min.css',
                //             'scripts/vendor/datatables/Responsive/dataTables.responsive.css',
                //             'scripts/vendor/datatables/Responsive/dataTables.responsive.js',
                //             'scripts/vendor/datatables/datatables.bootstrap.min.css'
                //         ]);
                //     }]
                // }
            })
            // State- tax Mapping
            .state('app.master.stateTaxMapping', {
                url: '/stateTaxMapping',
                templateUrl: 'views/tmpl/master/statetaxmapping.html',
            })
            // User Role Client Mapping
            .state('app.master.userRoleClientMapping', {
                url: '/userRoleClientMapping',
                templateUrl: 'views/tmpl/master/userRoleClientMapping.html',
            })
            // Pincode Logistics Mapping
             .state('app.master.pincodeLogisticMapping', {
                url: '/pincodeLogisticMapping',
                templateUrl: 'views/tmpl/master/pincodeLogisticMapping.html',
            })
            // Pincode Centers Mapping
             .state('app.master.pincodeServiceCenterMapping', {
                url: '/pincodeServiceCenterMapping',
                templateUrl: 'views/tmpl/master/pincodeServiceCenterMapping.html',
            })
            // Problem Category & Description Mapping
             .state('app.master.problemCategoryDescriptionMapping', {
                url: '/problemCategoryDescriptionMapping',
                templateUrl: 'views/tmpl/master/problemCategoryDescriptionMapping.html',
            })
            // Client OEM Mapping
             .state('app.master.clientOemMapping', {
                url: '/clientOemMapping',
                templateUrl: 'views/tmpl/master/clientOemMapping.html',
            })
             // Role Page Mapping
             .state('app.master.rolePageMapping', {
                url: '/rolePageMapping',
                templateUrl: 'views/tmpl/master/rolePageMapping.html',
            })
             // Model Plan Mapping
             .state('app.master.modelPlanMapping', {
                url: '/modelPlanMapping',
                templateUrl: 'views/tmpl/master/modelPlanMapping.html',
            })
            // Logistic loaner mapping
            .state('app.master.logisticsLoanerMapping', {
                url: '/logisticsLoanerMapping',
                controller: 'logisticsLoanerMappingCtrl',
                templateUrl: 'views/tmpl/master/logisticsloanermapping.html',
                // resolve: {
                //     plugins: ['$ocLazyLoad', function($ocLazyLoad) {
                //         return $ocLazyLoad.load([
                //             'https://cdn.datatables.net/buttons/1.2.2/css/buttons.dataTables.min.css',
                //             'scripts/vendor/datatables/Responsive/dataTables.responsive.css',
                //             'scripts/vendor/datatables/Responsive/dataTables.responsive.js',
                //             'scripts/vendor/datatables/datatables.bootstrap.min.css'
                //         ]);
                //     }]
                // }
            })
            // add user
            .state('app.master.userMaster', {
                url: '/userMaster',
                // controller: 'addUserCtrl',
                templateUrl: 'views/tmpl/master/adduser.html'

            })
            // product master
            .state('app.master.productMaster', {
                url: '/productMaster',
                // controller: 'productMasterCtrl',
                templateUrl: 'views/tmpl/master/productmaster.html'

            })
            // problem description master
            .state('app.master.problemCategoryMaster', {
                url: '/problemCategoryMaster',
                // controller: 'problemMasterCtrl',
                templateUrl: 'views/tmpl/master/problemcategorymaster.html'
              })

            // problem description master
            .state('app.master.problemDescriptionMaster', {
                url: '/problemDescriptionMaster',
                // controller: 'problemMasterCtrl',
                templateUrl: 'views/tmpl/master/problemdescriptionmaster.html'

            })
            // fail type master
            .state('app.master.failTypeMaster', {
                url: '/failTypeMaster',
                templateUrl: 'views/tmpl/master/failtype.html'
            })
            // role master
            .state('app.master.roleMaster', {
                url: '/roleMaster',
                templateUrl: 'views/tmpl/master/rolemaster.html'
            })
            // OEM master
            .state('app.master.oemMaster', {
                url: '/oemMaster',
                templateUrl: 'views/tmpl/master/oemmaster.html'
            })
            // Client Master
            .state('app.master.clientMaster', {
                url: '/clientMaster',
                templateUrl: 'views/tmpl/master/clientMaster.html'
            })
            // tax Master
            .state('app.master.taxMaster', {
                url: '/taxMaster',
                templateUrl: 'views/tmpl/master/taxmaster.html'
            })
            // Pincode Master
            .state('app.master.pincodeMaster', {
                url: '/pincodeMaster',
                templateUrl: 'views/tmpl/master/pincodemaster.html',

            })

            // Model Master
            .state('app.master.modelMaster', {
                url: '/modelMaster',
                templateUrl: 'views/tmpl/master/modelmaster.html',

            })
            // page Master
            .state('app.master.pageMaster', {
                url: '/pageMaster',
                templateUrl: 'views/tmpl/master/pagemaster.html',
            })
            // Center Master
            .state('app.master.centerMaster', {
                url: '/centerMaster',
                templateUrl: 'views/tmpl/master/centermaster.html',
            })
            // edit Customer
            .state('app.master.editCustomer', {
                url: '/editCustomer',
                controller: 'editCustomerCtrl',
                templateUrl: 'views/tmpl/master/editcustomer.html',

            })
            // master drag
            .state('app.master.dragIt', {
                url: '/dragIt',
                controller: 'dragCtrl',
                templateUrl: 'views/tmpl/master/dragit.html',

            });
    }]);


/* localStorage for logged-in user */
app.factory("LS", function($window, $rootScope) {
    angular.element($window).on('storage', function(event) {
        if (event.key === 'my-storage') {
            $rootScope.$apply();
        }
    });
    return {
        setData: function(val) {
            val = JSON.stringify(val);
            $window.localStorage && $window.localStorage.setItem('my-storage', val);
            return this;
        },
        getData: function() {
            var data = JSON.parse($window.localStorage && $window.localStorage.getItem('my-storage'));
            return data;
        }
    };
});

/* ====== This block is for checking permissions for URL routing ===== */

app.run(function($rootScope, $state, $location, permissions, LS) {
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        var url1 = $location.absUrl().split("#/")[1].split('/')[0];
        var isSubUrl = $location.absUrl().split("/")[4] ? true : false;
        var mainUrl = $location.absUrl().split("/")[$location.absUrl().split("/").length - 2]
        var isSubUrl = mainUrl != '#' ? true : false;
        // console.log('====', isSubUrl, $location.absUrl().split("/"), $location.absUrl().split("/")[$location.absUrl().split("/").length-2]);
        var url = $location.absUrl().split("/").pop();
        // console.log('check per-----',  url, permissions.hasPermission(url));

        if (url != 'login') {
            if (permissions.hasPermission(url) || url == 'dashboard') {
                // console.log('----', 'app.' + url1+'.'+url);
                if (isSubUrl) {
                    // console.log('in if');
                    $state.go('app.' + mainUrl + '.' + url);
                } else {
                    // console.log('in else');
                    $state.go('app.' + url);
                }
            } else {
                LS.setData(null);
                $rootScope.currentUser = undefined;
                $location.path('/login');
            }
        } else {
            LS.setData(null);
            $rootScope.currentUser = undefined;
            $location.path('/login');
        }
    });
});
