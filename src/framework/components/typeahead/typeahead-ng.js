/* typeahead javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngComponents
    .directive('typeahead', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){

            // var options = {
            //     data: data,
            //     onNodeSelected: $scope.typeaheadApi.onNodeSelected,
            //     onNodeCollapsed: $scope.typeaheadApi.onNodeCollapsed
            // };
            //var data=["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
            // "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
            // "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York",
            // "North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
            // "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

            //var options = $.extend(true, {source:data}, $scope.typeaheadApi);
            var options = $.extend(true, {}, $scope.typeaheadApi);

            $element.typeahead(options);

            //$element.typeahead({});
        }

        return {
            scope: {
                instance: '=controller',
                templateUrl: '@',
                unload: '&',

                treeApi: '=typeaheadApi'
            },
            restric: 'A',
            transclude: false,
            link: link
        };

    }]);