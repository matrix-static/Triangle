// pn: project name

angular.module('pnApp.filters', [])
	.filter('fooFilter', ['$log', function(){

		console.log('app filter');

		return function(){
			return 0;
		};
	}]);


angular.module('pnApp.services', []).value('version', '0.1')	// 'ngResource'
	.factory('fooService', function (){

		console.log('app service');

		return {
			foo: 'foo'
		};
	});

angular.module('pnApp.controllers', [])
	.controller('fooController', ['$scope', '$rootScope', function ($scope, $rootScope){
		console.log('app controller');
	}])
    .controller('treeController', ['$scope', '$rootScope', function ($scope, $rootScope){
        // console.log('app controller');

        var treeOptions={
            // onNodeChecked: function(e, node){ alert( node.text + ': onNodeChecked') },
            // onNodeCollapsed: function(e, node){ alert( node.text + ': onNodeCollapsed') },
            // onNodeDisabled: function(e, node){ alert( node.text + ': onNodeDisabled') },
            // onNodeEnabled: function(e, node){ alert( node.text + ': onNodeEnabled') },
            // onNodeExpanded: function(e, node){ alert( node.text + ': onNodeExpanded') },
            onNodeSelected: function(e, node){ alert( node.text + ': onNodeSelected') }//,
            // onNodeUnchecked: function(e, node){ alert( node.text + ': onNodeUnchecked') },
            // onNodeUnselected: function(e, node){ alert( node.text + ': onNodeUnselected') },
            // onSearchComplete: function(e, node){ alert( node.text + ': onSearchComplete') },
            // onSearchCleared: function(e, node){ alert( node.text + ': onSearchCleared') }
        };
        $scope.treeApi = treeOptions;
    }]);

        


angular.module('pnApp.directives', [])
    .directive('fooDirective', ['$rootScope', '$compile', function($rootScope, $compile){
		console.log('app directive');

		function link(){
			console.log('app directive link');
		}

		return {
			scope:{
				instance     : '=controller',
				templateUrl  : '@',
				unload       : '&'
			},
			restric          : 'A',
			transclude       : false,
			//replace          : false,
			//template         : '<div></div>'
			link             : link
		};
	}]);


var pnApp = angular.module('pnApp', [
		'ngRoute',
		'T.UI.ngControls',
        'T.UI.ngComponents',
		'pnApp.filters', 
		'pnApp.services', 
		'pnApp.directives', 
		'pnApp.controllers'//, 
		//'ui.router', 
		//'ui.bootstrap'
	]);

// ui-route
pnApp.config([
		//'$stateProvider', 
		'$routeProvider',
		//'$urlRouterProvider', 
		//'$compileProvider', 
		//'$httpProvider', 
		//function ($stateProvider, $urlRouterProvider, $compileProvider, $httpProvider){
		function ($routeProvider){
			//$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/),
		    //$urlRouterProvider.otherwise("/home"),
		    //$stateProvider.state("task", {
		    //    url: "/task/:uuid",
		    //    templateUrl: "/partials/taskview",
		    //    controller: "TaskviewCtrl"
		    //});
		    // $httpProvider.responseInterceptors.push
		    // $httpProvider.defaults.transformRequest.push
		    // $httpProvider.interceptors.push
		    $routeProvider
		    	.when('/home',{
		    		templateUrl:'/demo/home/index.html'
		    	})
		    	.otherwise({
		    		redirectTo:'/home'
		    	});
		}
	])
	.run(function($rootScope){
		// console.log('app run');
	});

angular.bootstrap(document, ['pnApp']);

/*pnApp.run(function ($rootScope) {
	;
});*/