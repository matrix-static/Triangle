/* accordion menu javascript AngularJS */

//angular.module('triangle.controls', [])
Triangle.ngControls
	.directive('accomenu', ['$rootScope', '$compile', function($rootScope, $compile){

		function link($scope, $element, $attrs, undefined, link){
			$element.accoMenu({});
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