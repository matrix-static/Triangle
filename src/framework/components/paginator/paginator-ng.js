/* paginator javascript AngularJS */

T.UI.ngComponents
    .directive('paginator', ['$rootScope', '$compile', function($rootScope, $compile){
        var args= {
            options: 'paginatorOptions',
            ref: 'paginatorRef'
        };

        function link($scope, $element, $attrs, undefined, link){
            // $element.paginator({});
            // var plugin= new T.UI.Components.Paginator($element, {});

            var sArgs=$element.attr('paginator');
            if(sArgs){
                args= JSON.parse(sArgs);
            }

            var options= args.options ? $scope.$parent[args.options] : {};
            var plugin= new T.UI.Components.Paginator($element, options);

            var ref= $scope.$parent[args.ref];
            if(!ref){
                $scope.$parent[args.ref]=plugin;
            }

            // var ngModel=$element.attr('ng-model');
            // if(ngModel){
            //     $scope.$parent.$watch(ngModel, function(newValue, oldValue) {
            //         // plugin.setValue(newValue);
            //         plugin.refresh();
            //     }, true);
            // }
        }

        return directive={
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