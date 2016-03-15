/* AngularJS 胶水代码 */

T.UI.ngControls = angular.module('T.UI.ngControls', []);
T.UI.ngComponents = angular.module('T.UI.ngComponents', []);
T.UI.ngLayouts = angular.module('T.UI.ngLayouts', []);
T.UI.ngModules = angular.module('T.UI.ngModules', []);



// (function($, ng) {
//   'use strict';

//   var $val = $.fn.val; // save original jQuery function

//   // override jQuery function
//   $.fn.val = function (value) {
//     // if getter, just return original
//     if (!arguments.length) {
//       return $val.call(this);
//     }

//     // get result of original function
//     var result = $val.call(this, value);

//     // trigger angular input (this[0] is the DOM object)
//     ng.element(this[0]).triggerHandler('input');

//     // return the original result
//     return result; 
//   }
// })(window.jQuery, window.angular);
/* anytime javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngControls
    .directive('anytime', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            // $element.AnyTime_picker({});
            $element.anytime({});
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
/* carousel javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngControls
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
/* combobox javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngControls
    .directive('combobox', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            // $element.combobox({});

            // var ngModelValue=$element.attr('ng-model');
            // $scope.$parent.$watch(ngModelValue, function(newValue, oldValue) {
            //     if (newValue && newValue !== oldValue){
            //         // alert(newValue);
            //         $element.combobox('setValue', newValue)
            //     }
            // }, true);
            var plugin= new T.UI.Controls.Combobox($element, {});

            var ngModel=$element.attr('ng-model');
            if(ngModel){
                $scope.$parent.$watch(ngModel, function(newValue, oldValue) {
                    // plugin.setValue(newValue);
                    plugin.refresh();
                }, true);
            }

        }

        // var scope={
        //         instance: '=controller',
        //         templateUrl: '@',
        //         unload: '&'
        //     };
        

        return {
            scope: {
             instance: '=controller',
             templateUrl: '@',
             unload: '&'
            },
            // scope: scope,
            restric: 'A',
            transclude: false,
            link: link
        };

    }]);
/* dropdown javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngControls
    .directive('dropdown', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            $element.dropdown({});
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
/* dtpicker javascript AngularJS */

T.UI.ngControls
    .directive('dtpicker', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            $element.dtpicker({});

            // var options = $scope.options;
            // var plugin = new T.UI.Controls.Template($element, $.extend(true, {}, options));

            // var ngModelValue=$element.attr('ng-model');
            // if(ngModelValue){
            //     $scope.$parent.$watch(ngModelValue, function(newValue, oldValue) {
            //         //plugin.setValue(newValue);
            //         plugin.refresh();
            //     }, true);
            // }
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
/* level javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngControls
    .directive('level', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            // $element.level({});

            var plugin= new T.UI.Controls.Level($element, {});

            var ngModel= $element.attr('ng-model');
            if(ngModel){
                $scope.$parent.$watch(ngModel, function(newValue, oldValue) {
                    // plugin.setValue(newValue);
                    plugin.refresh();
                }, true);
            }
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
/* likeit javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngControls
    .directive('likeit', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            $element.likeit({});
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


/* multiselect javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngControls
    .directive('multiselect', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            $element.multiselect({});
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
/* spinner javascript AngularJS */

//angular.module('triangle.controls', [])
(function() {

T.UI.ngControls
    .directive('spinner', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            // $element.spinner({});

            var options = $scope.options;
            var plugin = new T.UI.Controls.Spinner($element, $.extend(true, {}, options));

            // var ngModelValue=$element.attr('ng-model');
            // if(ngModelValue){
            //     $scope.$parent.$watch(ngModelValue, function(newValue, oldValue) {
            //         //plugin.setValue(newValue);
            //         plugin.refresh();
            //     }, true);
            // }
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
/* typeahead javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngControls
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
            // var options = $.extend(true, {}, $scope.typeaheadApi);

            // $element.typeahead(options);

            //$element.typeahead({});

            var plugin= new T.UI.Controls.Typeahead($element, {});

            var ngModel= $element.attr('ng-model');
            $scope.$parent.$watch(ngModel, function(newValue, oldValue){
                plugin.refresh();
            });
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
/* template javascript AngularJS */

T.UI.ngControls
    .directive('template', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            $element.template({});

            // var options = $scope.options;
            // var plugin = new T.UI.Controls.Template($element, $.extend(true, {}, options));

            // var ngModelValue=$element.attr('ng-model');
            // if(ngModelValue){
            //     $scope.$parent.$watch(ngModelValue, function(newValue, oldValue) {
            //         //plugin.setValue(newValue);
            //         plugin.refresh();
            //     }, true);
            // }
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
/* template javascript AngularJS */

T.UI.ngComponents
    .directive('datable', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            // $element.datable({});
            $element.dataTable({});
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
/* login javascript AngularJS */

/* modal javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngComponents
    .directive('modal', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            $element.modal({});
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
/* orgselect javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngComponents
    .directive('orgselect', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            // $element.orgselect({});

            var plugin= new T.UI.Components.Orgselect($element, {});

            var ngModel= $element.attr('ng-model');
            $scope.$parent.$watch(ngModel, function(newValue, oldValue){
                plugin.refresh();
            });
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
/* rightselect javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngComponents
    .directive('rightselect', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            $element.rightselect({});
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
/* sidebar menu javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngComponents
	.directive('sidebar', ['$rootScope', '$compile', function($rootScope, $compile){

		function link($scope, $element, $attrs, undefined, link){
			$element.sidebar({});
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
/* template javascript AngularJS */

T.UI.ngComponents
    .directive('template', ['$rootScope', '$compile', function($rootScope, $compile){

        function link($scope, $element, $attrs, undefined, link){
            $element.template({});
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