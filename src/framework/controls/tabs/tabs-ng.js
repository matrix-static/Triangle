/* tabs javascript AngularJS */

T.UI.ngControls
    .directive('tabs', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            $element.tabs({});
        }

        return {
            scope: {
                instance: '=controller',
                tabsUrl: '@',
                unload: '&'
            },
            restric: 'A',
            transclude: false,
            link: link
        };

    }]);