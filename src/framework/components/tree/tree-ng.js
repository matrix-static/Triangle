/* tree javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngComponents
    .directive('tree', ['$rootScope', '$compile', function($rootScope, $compile){
        var args= {
            options: 'treeOptions',
            ref: 'treeRef'
        };

        function link($scope, $element, $attrs, undefined, link){

            // var options = {
            //     data: data,
            //     onNodeSelected: $scope.treeApi.onNodeSelected,
            //     onNodeCollapsed: $scope.treeApi.onNodeCollapsed
            // };
            // var options = $.extend(true, {}, $scope.treeApi);
            // $element.tree(options);

            var sArgs=$element.attr('tree');
            if(sArgs){
                args= JSON.parse(sArgs);
            }

            var options= $scope.$parent[args.options] || {};            
            var plugin= new T.UI.Components.Tree($element, options);

            var ref= $scope.$parent[args.ref];
            if(!ref){
                $scope.$parent[args.ref]= plugin;
            }

            //$element.tree({});
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