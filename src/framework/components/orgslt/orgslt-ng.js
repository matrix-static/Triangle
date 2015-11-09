/* orgslt javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngComponents
    .directive('orgslt', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            $element.orgslt({});
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