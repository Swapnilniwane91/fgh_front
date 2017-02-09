app.controller('dragCtrl', function($scope, dragularService, ipsumService, $element, httpService, $timeout) {


  $scope.page = {
    title: 'Dragula',
    subtitle: 'Place subtitle here...'
  };


  $scope.tasks = {
    "new": [],
    "progress": [],
    "finished": []
  };


    httpService.getData("/loanerDeviceSerialNo") 
        .then(function(result) {    
         $scope.tasks.new = result.data;
      // console.log(result); 
        });
     $scope.$watchCollection('[tasks.new, tasks.progress, tasks.finished]',
       function(task)
        {
        //  console.log('log for',task);
          $scope.dragularOptions1 =
          {
            containersModel: task[1],
             classes: { mirror: 'drag-task' },
             nameSpace: 'common'
           };

          $scope.dragularOptions2 =
          {
             containersModel: task[2],
              classes: { mirror: 'drag-task' },
              nameSpace: 'common'
          };
          $scope.dragularOptions3 =
          {
            containersModel: task[3],
            classes: { mirror: 'drag-task' },
            nameSpace: 'common'
          };
        });
});
