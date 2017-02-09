angular.module('espApp').constant('config', {
    serverurl: '<%=coreurl%>',
    defaultHeaders: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json'
     }
});
