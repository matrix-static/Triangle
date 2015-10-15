// pn: project name

angular.module('pnApp.filters', [])
	.filter('fooFilter', ['$log', function(){

		console.log('app filter');

		return function(){
			return 0;
		};
	}]);


angular.module('pnApp.services', ['ngResource']).value('version', '0.1')
	.factory('fooService', function (){

		console.log('app service');

		return {
			foo: 'foo'
		};
	});

angular.module('pnApp.controllers', [])
	.controller('fooController', ['$scope', '$rootScope', function ($scope, $rootScope){
		console.log('app controller');
	}]



angular.module('pnApp.directives', [])
	.directive('fooDirective', ['$rootScope', '$compile', function($rootScope, $compile){
		console.log('app directive');

		function link(){
			console.log('app directive link');
		}

		return {
			scope:{
				instance: '=controller',
				templateUrl: '@'
				unload: '&'
			},
			restric: 'A',
			transclude: false,
			link: link
		};
	});

var pnApp = angular.module('pnApp', [
		'pnApp.filters', 
		'pnApp.services', 
		'pnAppdirectives', 
		'pnApp.controllers', 
		'ui.router', 
		'ui.bootstrap'
	]);

// ui-route
pnApp.config([
		'$stateProvider', 
		'$urlRouterProvider', 
		'$compileProvider', 
		'$httpProvider', 
		function ($stateProvider, $urlRouterProvider, $compileProvider, $httpProvider){
			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/),
		    $urlRouterProvider.otherwise("/home"),
		    $stateProvider.state("task", {
		        url: "/task/:uuid",
		        templateUrl: "/partials/taskview",
		        controller: "TaskviewCtrl"
		    });
		    // $httpProvider.responseInterceptors.push
		    // $httpProvider.defaults.transformRequest.push
		    // $httpProvider.interceptors.push
		}
	]);

pnApp.run(function ($rootScope) {
	;
});