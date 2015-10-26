/* combobox javascript AngularJS */

//angular.module('triangle.controls', [])
Triangle.ngControls
	.directive('combobox', ['$rootScope', '$compile', function($rootScope, $compile){

		function link($scope, $element, $attrs, undefined, link){
			$element.combobox({});
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