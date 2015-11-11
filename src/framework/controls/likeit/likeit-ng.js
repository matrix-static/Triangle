/* likeit javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngControls
    .directive('likeit', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            $element.likeit({});
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