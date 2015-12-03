/* combobox javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngControls
    .directive('combobox', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            // $element.combobox({});

            // var ngModelValue=$element.attr('ng-model');
            // $scope.$parent.$watch(ngModelValue, function(newValue, oldValue) {
            //     if (newValue && newValue !== oldValue){
            //         // alert(newValue);
            //         $element.combobox('setValue', newValue)
            //     }
            // }, true);
            var plugin= new T.UI.Controls.Combobox($element, {});

            var ngModel=$element.attr('ng-model');
            if(ngModel){
                $scope.$parent.$watch(ngModel, function(newValue, oldValue) {
                    // plugin.setValue(newValue);
                    plugin.refresh();
                }, true);
            }

        }

        // var scope={
        //         instance: '=controller',
        //         templateUrl: '@',
        //         unload: '&'
        //     };
        

        return {
            scope: {
             instance: '=controller',
             templateUrl: '@',
             unload: '&'
            },
            // scope: scope,
            restric: 'A',
            transclude: false,
            link: link
        };

    }]);