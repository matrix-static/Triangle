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
        $scope.treeOptions = treeOptions;

        var data= [
            {
                "text": "Parent 2",
                "href": "#parent2",
                "tags": ["0"]
            },
            {
                "text": "Parent 3",
                "href": "#parent3",
                "tags": ["4"],
                "nodes": [
                    {
                        "text": "Child 3",
                        "href": "#child3",
                        "tags": ["2"],
                        "nodes": [
                            {
                                "text": "Grandchild 31",
                                "href": "#grandchild31",
                                "tags": ["0"]
                            },
                            {
                                "text": "Grandchild 32",
                                "href": "#grandchild32",
                                "tags": ["0"]
                            }
                        ]
                    },
                    {
                        "text": "Child 2",
                        "href": "#child2",
                        "tags": ["0"]
                    }
                ]
            },
            {
                "text": "Parent 5",
                "href": "#parent5"  ,
                "tags": ["0"]
            }
        ];

        $scope.collapseAll= function(){
            $scope.treeRef.collapseAll();
        };
        $scope.expandAll= function(){
            $scope.treeRef.expandAll();
        };
        $scope.changeData= function(){
            $scope.treeRef.updateData(data);
            $scope.treeRef.refresh();
        };


    }])
	.controller('bindController', ['$scope', '$rootScope', function ($scope, $rootScope){
        $scope.comboboxValue= 'CO';
        $scope.spinnerValue= 55;
        $scope.typeaheadValue= 'Virginia';
        $scope.levelValue= '230000,230200,230227';	// 330000,330600,330682 浙江 / 绍兴 / 上虞
        $scope.dtpickerValue= '2001-11-11 11:11:11';
    }])
    .controller('paginatorController', ['$scope', '$rootScope', function ($scope, $rootScope){
        function reloadList(pageIndex){
            var queryData={
                name: $('#formQuery #name').val(),
                pageSize: 10,
                pageIndex: pageIndex,
            };

            $.ajax({
                dataType: 'json',
                url: '/demo/components/paginator/data.json',
                data: queryData,
                success: function(data){
                    for(var i=0; i<data.entities.length; i++){
                        data.entities[i].name += (pageIndex+1); // 模拟查询结果数据
                    }

                    $scope.pageRef.updateOptions({pageIndex: pageIndex, totalRecords: data.totalRecords});

                    $scope.entities= data.entities;// $.extend(true, [], data);
                    $scope.$apply();
                },
                error: function(xmlHttpRequest, status, error){
                    alert('控件id：paginator，ajax获取数据失败!');
                }
            });
        }

        $('#paginatorx').on('paginator.on.pageindexchange', function(e, pageIndex){
            reloadList(pageIndex);
        });

        $scope.query=function(){
            reloadList(0);
        }

        $scope.toggleCheckBoxes = function (event) {
            var checkedAll = $(event.target).is(':checked');
            $('#tblListData tbody :checkbox').prop('checked', checkedAll);
        };

        $scope.edit=function(id, e){
            e.preventDefault();

            if(!confirm('你确定要修改id: '+id+' 吗？')){
                return;
            }
        }

        $scope.deleteEntity=function(id, e){
            e.preventDefault();

            if(!confirm('你确定要删除id: '+id+' 吗？')){
                return;
            }
        }

        $scope.batchDelete=function(){
            var selectedEntities = $('#tblListData tbody :checkbox:checked');
            if (selectedEntities.length === 0) {
                alert('请选择要删除的行！');
                return;
            }

            if (!confirm('确定要删除选定行么？')) {
                return;
            }            

            function done(data) {
                context.ajaxDone.call(context, data);
            }

            var ids=[];
            selectedEntities.each(function (index) {
                var id = $(this).val();
                // context.options.restfulService.remove('/admin/' + context.options.entityName + '/remove', id, done);
                ids.push(id);
            });

            alert('删除选中id: '+ids.join(','));
        }

        $scope.pageOptions={
            pageSize: 20,       // 每页记录数
            pageIndex: 0,       // 当前页
            pageButtons: 7      // 分页按钮数 必须为奇数 3, 5, 7 ,9 ....
        };
        reloadList(0);
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