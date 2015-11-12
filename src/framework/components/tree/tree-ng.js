/* tree javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngComponents
    .directive('tree', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){

            var data=[
                {
                    text: 'Parent 1',
                    href: '#parent1',
                    tags: ['4'],
                    nodes: [
                        {
                            text: 'Child 1',
                            href: '#child1',
                            tags: ['2'],
                            nodes: [
                                {
                                    text: 'Grandchild 1',
                                    href: '#grandchild1',
                                    tags: ['0']
                                },
                                {
                                    text: 'Grandchild 2',
                                    href: '#grandchild2',
                                    tags: ['0']
                                }
                            ]
                        },
                        {
                            text: 'Child 2',
                            href: '#child2',
                            tags: ['0']
                        }
                    ]
                },
                {
                    text: 'Parent 2',
                    href: '#parent2',
                    tags: ['0']
                },
                {
                    text: 'Parent 3',
                    href: '#parent3',
                    tags: ['4'],
                    nodes: [
                        {
                            text: 'Child 3',
                            href: '#child3',
                            tags: ['2'],
                            nodes: [
                                {
                                    text: 'Grandchild 31',
                                    href: '#grandchild31',
                                    tags: ['0']
                                },
                                {
                                    text: 'Grandchild 32',
                                    href: '#grandchild32',
                                    tags: ['0']
                                }
                            ]
                        },
                        {
                            text: 'Child 2',
                            href: '#child2',
                            tags: ['0']
                        }
                    ]
                },
                {
                    text: 'Parent 4',
                    href: '#parent4',
                    tags: ['0']
                },
                {
                    text: 'Parent 5',
                    href: '#parent5'  ,
                    tags: ['0']
                }
            ];

            // var options = {
            //     data: data,
            //     onNodeSelected: $scope.treeApi.onNodeSelected,
            //     onNodeCollapsed: $scope.treeApi.onNodeCollapsed
            // };
            var options = $.extend(true, {data:data}, $scope.treeApi);

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