app.directive('hasPermission', function(permissions, LS) {
  return {
    link: function(scope, element, attrs) {
      var value = attrs.hasPermission.trim();
      var hasPermission = permissions.hasPermission(value);
      if (hasPermission) {
        element.show();
      } else {
        element.hide();
      }
    }
  };
});
