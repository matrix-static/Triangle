/* sidebar menu javascript AngularJS */

//angular.module('triangle.controls', [])
T.ngComponents
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