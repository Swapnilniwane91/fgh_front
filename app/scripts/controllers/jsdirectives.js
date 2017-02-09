app.directive('numberOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                      var transformedInput = text.replace(/[^-0-9\.]/g, '');
                    var decimalPlace = transformedInput.split('.').length > 1? transformedInput.split('.').pop():'';
                 if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    if(decimalPlace.length > 2)
                    {
                      transformedInput= transformedInput.split('.')[0]+'.'+decimalPlace.substring(0, 2)
                      ngModelCtrl.$setViewValue(transformedInput);
                      ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
/*directive for alphabets without white spaces in between*/

app.directive('alphabetsOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                      var transformedInput = text.replace(/[^a-zA-Z]/g,'');
                 if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
/*directive for alphabets without white spaces in between*/

app.directive('capitalOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                      var transformedInput = text.replace(/[^A-Z]/g,'');
                 if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

/*directive for alphanumeric*/

app.directive('alphaOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
              // console.log('hhhhh');
                if (text) {
                      var transformedInput = text.replace(/[^a-zA-Z0-9]/g, '');
                 if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

/*directive for restricting white spaces from starting of a word and ending of the word*/
  app.directive('restrictField', function () {
    return {
        restrict: 'AE',
        scope: {
            restrictField: '='
        },
        link: function (scope) {
          // this will match spaces, tabs, line feeds etc
          // you can change this regex as you want
          var regex = /\s/g;
          scope.$watch('restrictField', function (newValue, oldValue) {
              if (newValue != oldValue && regex.test(newValue)) {
                scope.restrictField = newValue.replace(regex, '');
              }
          });
        }
    };
  });

  /*directive for number only without decimal*/

  app.directive('numbOnly', function () {
      return {
          require: 'ngModel',
          link: function (scope, element, attr, ngModelCtrl) {
              function fromUser(text) {
                  if (text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');
                   if (transformedInput !== text) {
                          ngModelCtrl.$setViewValue(transformedInput);
                          ngModelCtrl.$render();
                      }
                      return transformedInput;
                  }
                  return undefined;
              }
              ngModelCtrl.$parsers.push(fromUser);
          }
      };
  });

  /*directive for alphabets charater with spaces*/

  app.directive('alphabetCharacter', function () {
      return {
          require: 'ngModel',
          link: function (scope, element, attr, ngModelCtrl) {
              function fromUser(text) {
                  if (text) {
                        var transformedInput = text.replace(/[^a-zA-Z\s]/g,'');
                   if (transformedInput !== text) {
                          ngModelCtrl.$setViewValue(transformedInput);
                          ngModelCtrl.$render();
                      }
                      return transformedInput;
                  }
                  return undefined;
              }
              ngModelCtrl.$parsers.push(fromUser);
          }
      };
  });
