app.controller('estimateInvoiceCtrl', function($scope, $rootScope, httpService, $window, $location) {


  $scope.customerdetails = $rootScope.SRData;
  // console.log($rootScope.invoice_headid);
  httpService.sendCommand('/estimateinvoice', {
    data: {
      "headId": $rootScope.invoice_headid
    }
  }).then(function(result, error) {
    $scope.invoice = result;
    $scope.part = result.partdetails;
    $rootScope.viewData = {};
  });
  /* download fn for PDF*/
  $scope.downloadFn = function(){
    createPDF();

  };
  var
  form = $('#invoicepdf'),
  // form = document.getElementById('form'),
  cache_width = form.width(),
  a4  =[ 595.28,  841.89];
  function createPDF(){
  getCanvas().then(function(canvas){
    // console.log('222222');
    var
    img = canvas.toDataURL("image/png"),
    doc = new jsPDF({
          unit:'px',
          format:'a4'
        });
        var filename= $scope.invoice.invoice.invoiceno+'_'+$scope.invoice.invoice.customername;
        doc.addImage(img, 'JPEG', 20, 20);
        doc.setFontSize(40);
        // doc.addImage(img, 'JPEG', 15, 40, 180, 160);
        doc.save(filename);
        form.width(cache_width);
  });
}
// create canvas object
function getCanvas(){
  // console.log('111111');
  form.width((a4[0]*1.33333) -80).css('max-width','none');
  return html2canvas(form,{
      imageTimeout:2000,
      removeContainer:true
    });
}
//back function
$scope.invoiceback = function(){
  // $rootScope.invoice_headid ;
  if($rootScope.invoice == "estimate"){
    $location.path('/transaction/unitEstimateList')
  }else{
    $window.history.back();
  }

}
});
