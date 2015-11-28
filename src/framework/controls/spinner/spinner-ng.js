/* spinner javascript AngularJS */

//angular.module('triangle.controls', [])
(function() {

T.UI.ngControls
    .directive('spinner', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            // $element.spinner({});

            var options = $scope.options;
            var plugin = new T.UI.Controls.Spinner($element, $.extend(true, {}, options));

            // var ngModelValue=$element.attr('ng-model');
            // if(ngModelValue){
            //     $scope.$parent.$watch(ngModelValue, function(newValue, oldValue) {
            //         //plugin.setValue(newValue);
            //         plugin.reflesh();
            //     }, true);
            // }
        }

        return {
            scope: {
                instance: '=controller',
                templateUrl: '@',
                unload: '&'
            },
            restric: 'A',
            transclude: false,
            link: link
        };

    }]);

})();