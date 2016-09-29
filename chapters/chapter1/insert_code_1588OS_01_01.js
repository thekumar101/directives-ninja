var definitionObject = {
  restrict: 'EA',
  link: function(scope, element, attrs){
    element.text('Hello World');
  }
};

app.directive('bbHelloWorld', function(){
  return definitionObject;
});