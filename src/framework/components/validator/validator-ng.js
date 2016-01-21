/* validator javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngComponents
    .directive('validator', ['$rootScope', '$compile', function($rootScope, $compile){
        var args= {
            options: 'validatorOptions',
            ref: 'validatorRef'
        };

        function link($scope, $element, $attrs, undefined, link){
            var sArgs=$element.attr('validator');
            if(sArgs){
                args= JSON.parse(sArgs);
            }

            var options= $scope.$parent[args.options] || {};            
            var plugin= new T.UI.Components.Validator($element, options);

            var ref= $scope.$parent[args.ref];
            if(!ref){
                $scope.$parent[args.ref]= plugin;
            }

            //$element.validator({});
        }

        return {
            scope: {},
            restric: 'A',
            transclude: false,
            link: link
        };

    }]);