 /*
  * The Stopwatch module consists of one directives, one controller, and one filter. 
  */
angular.module('Stopwatch', [])
.controller('stopwatchCtrl', ['$scope', '$interval',    function($scope, $interval){
    
    var startTime = 0,
        currentTime = null,
        offset = 0,
        interval = null,
        self = this;
    
    if(!$scope.options.interval){
        $scope.options.interval = 100;
    }

    self.options = $scope.options;

    self.options.elapsedTime = new Date(0);

    self.running = false;
    
    function pushToLog(lap){
        if($scope.options.log !== undefined){
           $scope.options.log.push(lap); 
        }
    }
     
    self.updateTime = function(){
        currentTime = new Date().getTime();
        var timeElapsed = offset + (currentTime - startTime);
        $scope.options.elapsedTime.setTime(timeElapsed);
    };

    self.startTimer = function(){
        if(self.running === false){
            startTime = new Date().getTime();
            interval = $interval(self.updateTime,$scope.options.interval);
            self.running = true;
        }
    };

    self.stopTimer = function(){
        if( self.running === false) {
            return;
        }
        self.updateTime();
        offset = offset + currentTime - startTime;
        pushToLog(currentTime - startTime);
        $interval.cancel(interval);  
        self.running = false;
    };

    self.resetTimer = function(){
      startTime = new Date().getTime();
      self.options.elapsedTime.setTime(0);
      timeElapsed = offset = 0;
    };

}])
.directive('stopwatch', function(){
    return {
        restrict: 'EA',
        scope: {options: '='},
        replace: true,
        controller: 'stopwatchCtrl',
        templateUrl: 'directives/Stopwatch/stopwatch.tpl.html',
        compile: function(tElem, tAttrs){
            
            if (!tAttrs.options){
                 throw new Error('Must Pass an options object from the Controller For the Stopwatch to Work Correctly.');
            }
            
            return function(scope, elem, attrs, controller){    
              scope.startTimer = controller.startTimer; 
              scope.stopTimer = controller.stopTimer;
              scope.resetTimer = controller.resetTimer;
              scope.getThis = controller.getThis;
              //start the Timer
              controller.startTimer();
            };
        }
    };
})
.filter('stopwatchTime', function () {
    return function (input) {
        if(input){
            
            var elapsed = input.getTime();
            var hours = parseInt(elapsed / 3600000,10);
            elapsed %= 3600000;
            var mins = parseInt(elapsed / 60000,10);
            elapsed %= 60000;
            var secs = parseInt(elapsed / 1000,10);
            var ms = elapsed % 1000;
            
            return hours + ':' + mins + ':' + secs + ':' + ms;
        }
    };
});