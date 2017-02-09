app.controller('ClientMasterCtrl', function($scope, $state, $rootScope, $location, httpService, LS, toastr, commonFunctions, DTOptionsBuilder, DTColumnBuilder, $q) {
    commonFunctions.checkUserSession();

    $scope.page = {
        title: 'Client Master',
        subtitle: 'List'
    };

    $scope.authorized = false;
    $scope.clients = {};
    $scope.isList = true;
    $scope.isEdit = false;
    $scope.isUpdate = false;
    $scope.isClientName = true;
    $scope.clientNameError = "";
    $scope.isClientCode = true;
    $scope.clientCodeError = "";

    $scope.init = function() {
        httpService.getData('/getClients', {}).then(function(result, error) {
            $scope.authorized = true;
            $scope.clients = result.data;
            $scope.dtOptions = DTOptionsBuilder
                .newOptions()
                .withBootstrap()
                .withOption('order', [0, 'desc'])
                .withPaginationType('full_numbers')
                .withColReorder();
            $scope.dtColumns = [
                DTColumnBuilder.newColumn(0).withTitle('Id').notVisible(),
                DTColumnBuilder.newColumn(1).withTitle('Name'),
                DTColumnBuilder.newColumn(2).withTitle('Contact No'),
                DTColumnBuilder.newColumn(3).withTitle('Email'),
                DTColumnBuilder.newColumn(4).withTitle('TIN/VAT No'),
                DTColumnBuilder.newColumn(5).withTitle('Service Tax No'),
                DTColumnBuilder.newColumn(6).withTitle('PAN No'),
                DTColumnBuilder.newColumn(7).withTitle('Client Type'),
                DTColumnBuilder.newColumn(8).withTitle('Client Type Id').notVisible(),
                DTColumnBuilder.newColumn(9).withTitle('Code'),
                DTColumnBuilder.newColumn(10).withTitle('Status'),
                DTColumnBuilder.newColumn(11).withTitle('Action')
            ];
        });

        $scope.clientTypes = {};
        httpService.getData('/ClientType', {}).then(function(result, error) {
            $scope.clientTypes = result.data;
        });
    }

    $scope.init();

    $scope.Create = function() {
        $scope.client = {};
        $scope.isUpdate = false;
        $scope.isList = false;
        $scope.isEdit = true;
        $scope.isClientName = true;
        $scope.clientNameError = "";
        $scope.isClientCode = true;
        $scope.clientCodeError = "";
        $scope.client.clientId = 0;
        $scope.client.isActive = true;
    }

    $scope.Cancel = function() {
        $scope.client = {};
        $scope.isEdit = false;
        $scope.isList = true;
        $state.reload();
    }

    $scope.edit = function(client) {
        $scope.isList = false;
        $scope.isEdit = true;
        $scope.isUpdate = true;
        $scope.isClientName = true;
        $scope.clientNameError = "";
        $scope.isClientCode = true;
        $scope.clientCodeError = "";
        $scope.client = client;
        $scope.client.clientTypeId = client.clientTypeId.toString();

    }

    $scope.checkClientName = function(value) {
        httpService.sendCommand('/checkClientName', { data: value }).then(function(result, error) {
            if (result.error) {
                $scope.isClientName = false;
                $scope.clientNameError = result.error;
            } else {
                $scope.isClientName = true;
                $scope.clientNameError = "";
            }
        });
    }

    $scope.checkClientCode = function(value) {
        httpService.sendCommand('/checkClientCode', { data: value }).then(function(result, error) {
            if (result.error) {
                $scope.isClientCode = false;
                $scope.clientCodeError = result.error;
            } else {
                $scope.isClientCode = true;
                $scope.clientCodeError = "";
            }
        });
    }

    $scope.Submit = function(formData) {
        httpService.sendCommand('/postClientData', { client: formData }).then(function(result, error) {
            if (result.data) {
                toastr.success(result.data[0].insertOrupdateClient);
                $scope.client = {}
                $scope.isEdit = false;
                $scope.isList = true;
                $state.reload();
            } else {
                toastr.error(result.error);
            }
        });

    }

})