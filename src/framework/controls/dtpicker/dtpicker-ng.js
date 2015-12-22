/* dtpicker javascript AngularJS */

T.UI.ngControls
    .directive('dtpicker', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            $element.dtpicker({});

            // var options = $scope.options;
            // var plugin = new T.UI.Controls.Template($element, $.extend(true, {}, options));

            // var ngModelValue=$element.attr('ng-model');
            // if(ngModelValue){
            //     $scope.$parent.$watch(ngModelValue, function(newValue, oldValue) {
            //         //plugin.setValue(newValue);
            //         plugin.refresh();
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