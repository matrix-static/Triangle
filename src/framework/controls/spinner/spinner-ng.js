/* spinner javascript AngularJS */

//angular.module('triangle.controls', [])
T.UI.ngControls
	.directive('spinner', ['$rootScope', '$compile', function($rootScope, $compile){

		function link($scope, $element, $attrs, undefined, link){
			$element.spinner({});
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