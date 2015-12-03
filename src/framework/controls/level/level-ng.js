/* level javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngControls
    .directive('level', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            // $element.level({});

            var plugin= new T.UI.Controls.Level($element, {});

            var ngModel= $element.attr('ng-model');
            if(ngModel){
                $scope.$parent.$watch(ngModel, function(newValue, oldValue) {
                    // plugin.setValue(newValue);
                    plugin.refresh();
                }, true);
            }
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