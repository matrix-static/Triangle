/* tree javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngComponents
    .directive('tree', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){

            // var options = {
            //     data: data,
            //     onNodeSelected: $scope.treeApi.onNodeSelected,
            //     onNodeCollapsed: $scope.treeApi.onNodeCollapsed
            // };
            var options = $.extend(true, {}, $scope.treeApi);

            $element.tree(options);

            //$element.tree({});
        }

        return {
            scope: {
                instance: '=controller',
                templateUrl: '@',
                unload: '&',

                treeApi: '=treeApi'
            },
            restric: 'A',
            transclude: false,
            link: link
        };

    }]);