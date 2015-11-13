/* rightselect javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngControls
    .directive('rightselect', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            $element.rightselect({});
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