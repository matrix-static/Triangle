/* spinner javascript AngularJS */

//angular.module('triangle.controls', [])
(function() {

T.UI.ngControls
    .directive('spinner', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            var options = $scope.options;
            var control = new T.UI.Controls.Spinner($element, $.extend(true, {}, options));
            // $element.spinner({});
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

})();