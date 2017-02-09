app.controller('saleInvoiceCtrl', function($scope, $rootScope, httpService) {
    $scope.page = {
        title: 'Sales',
        subtitle: 'Invoice'
    };
    $scope.invoice_detail = $rootScope.sale_product_invoice;
    $scope.current_customer = $rootScope.current_customer;
});
