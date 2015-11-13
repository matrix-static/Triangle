/* multiselect javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngControls
    .directive('multiselect', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            $element.multiselect({});
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