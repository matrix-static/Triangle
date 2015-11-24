/* anytime javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngControls
    .directive('anytime', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            // $element.AnyTime_picker({});
            $element.anytime({});
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