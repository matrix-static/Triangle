/* orgselect javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngComponents
    .directive('orgselect', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            $element.orgselect({});
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