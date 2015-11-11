/* carousel javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngComponents
    .directive('carousel', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            $element.carousel({});
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