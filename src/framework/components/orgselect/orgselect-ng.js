/* orgselect javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngComponents
    .directive('orgselect', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            // $element.orgselect({});

            var plugin= new T.UI.Components.Orgselect($element, {});

            var ngModel= $element.attr('ng-model');
            $scope.$parent.$watch(ngModel, function(newValue, oldValue){
                plugin.refresh();
            });
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