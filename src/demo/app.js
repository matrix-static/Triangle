// pn: project name

angular.module('pnApp.filters', [])
	.filter('fooFilter', ['$log', function(){

		console.log('app filter');

		return function(){
			return 0;
		};
	}]);

angular.module('pnApp.services', []).value('version', '0.1')	// 'ngResource'
    .factory('tModalService', function ($compile){

        console.log('app tModalService');
        var modalScope;

        return {
            create: function(options){
                var parseData= function(data){
                    if(modalScope){
                        modalScope.$destroy();
                    }
                    modalScope=options.scope.$new();
                    return $compile(data)(modalScope);
                };

                var onInitialized= function(){
                    // modal.show();
                    this.show();
                };

                var modal= new T.UI.Components.Modal(options.targetElement, {
                    modalId: options.modalId,
                    show: false,
                    bindTarget: false,
                    remote: options.remote,     //'/demo/components/paginator/remoteEditor.html',
                    parseData: options.parseData || parseData,
                    onInitialized: options.onInitialized || onInitialized,
                    buttons: options.buttons
                    // close $scope.distroy
                });

                return modal;
            }
        };
    })
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
    .controller("validatorController", ['$scope', '$rootScope', function ($scope, $rootScope){
        var validatorOptions= {
            rules: {
                name: {
                    // required: true,
                    minlength: 4
                },
                password: {
                    required: true,
                    minlength: 5
                },
                password_again: {
                    equalTo: "#password"
                },
                email: {
                    required: true,
                    email: true
                },
                // agree: "required",
                agree: {
                    required: true
                },
                topic: {
                    required: "#newsletter:checked",
                    minlength: 2
                },
                comment: {
                    required: true
                }
            },
            messages: {
                name: {
                    required: "请输入一个名称",
                    minlength: "名称至少需要4个字符"
                },
                password: {
                    required: "请输入一个密码",
                    minlength: "密码至少需要5个字符"
                },
                confirm_password: {
                    required: "请输入一个密码",
                    minlength: "密码至少需要5个字符",
                    equalTo: "两次输入的密码不一致"
                },
                email: "请输入一个有效的邮箱地址",
                agree: "请接受我们的服务条款"
            },
            // errorContainer: '#ErrorsSummary, #ErrorsSummary2',
            // errorLabelContainer: "#ErrorsSummary ul",
            // wrapper: "li", 
            // invalidHandler: function() {
            //     $( "#ErrorsSummary" ).text( this.numberOfInvalids() + " field(s) are invalid" );
            // },
            submitHandler: function() { alert("Submitted!") }

            // showErrors: function(errorMap, errorList) {
            //     if (submitted) {
            //         var summary = "You have the following errors: \n";
            //         $.each(errorList, function() { summary += " * " + this.message + "\n"; });
            //         alert(summary);
            //         submitted = false;
            //     }
            //     this.defaultShowErrors();
            // },          
            // invalidHandler: function(form, validator) {
            //     submitted = true;
            // }
        };

        $scope.validatorOptions= validatorOptions;
    }])
    .controller('paginatorController', ['$scope', '$rootScope', '$compile', 'tModalService', function ($scope, $rootScope, $compile, Modal){
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

        $scope.query=function(e){
            reloadList(0);
        }

        $scope.toggleCheckBoxes = function (e) {
            var checkedAll = $(event.target).is(':checked');
            $('#tblListData tbody :checkbox').prop('checked', checkedAll);
        };

        var creatorScope;
        $scope.create= function(e){
            var creator= new T.UI.Components.Modal(e.target, {
                modalId: '#demoPopCreatorModal',
                show: false,
                bindTarget: false,
                remote: '/demo/components/paginator/remoteCreator.html',
                parseData: function(data){
                    if(creatorScope){
                        creatorScope.$destroy();
                    }
                    creatorScope=$scope.$new();
                    return $compile(data)(creatorScope);
                },
                onInitialized: function(){
                    $scope.$broadcast("craeteEntity");  //, entity
                    creator.show();
                },
                buttons: {
                    submit: {
                        selector: '.submit',
                        eventName: 'click',
                        handler: function(e){
                            $scope.$broadcast("craeteEntitySubmit");  //, entity
                        }
                    }
                }
                // close $scope.distroy
            });
        };

        // 动态加载的内容compiled以后，从dom中移除还不够，还需要销毁$scope
        var editorScope;
        $scope.edit=function(entity, e){
            e.preventDefault();

            // if(!confirm('你确定要修改id: '+entity.id+' 吗？')){
            //     return;
            // }

            // get html
            // get data
            // bind data
            // show

            // var editor= new T.UI.Components.Modal(e.target, {
            //     modalId: '#demoPopEditorModal',
            //     show: false,
            //     bindTarget: false,
            //     remote: '/demo/components/paginator/remoteEditor.html',
            //     parseData: function(data){
            //         if(editorScope){
            //             editorScope.$destroy();
            //         }
            //         editorScope=$scope.$new();
            //         return $compile(data)(editorScope);
            //     },
            //     onInitialized: function(){
            //         $scope.$broadcast("editEntity", entity);
            //         editor.show();
            //     },
            //     buttons: {
            //         submit: {
            //             selector: '.submit',
            //             eventName: 'click',
            //             handler: function(e){
            //                 $scope.$broadcast("editorEntitySubmit");  //, entity
            //             }
            //         }
            //     }
            //     // close $scope.distroy
            // });

            var editor= Modal.create({
                modalId: '#demoPopEditorModal',
                targetElement: e.target,
                remote: '/demo/components/paginator/remoteEditor.html',
                scope: $scope,
                onInitialized: function(){
                    $scope.$broadcast("editEntity", entity);
                    this.show();
                }//,
                // buttons: {
                //     submit: {
                //         selector: '.submit',
                //         eventName: 'click',
                //         handler: function(e){
                //             $scope.$broadcast("editorEntitySubmit");  //, entity
                //         }
                //     }
                // }
            });

            var unRegister= $scope.$on('editorSubmitSuccess', function(event){
                editor.hide();

                // 必须取消事件注册，否则会在$scope.$listener里重复添加事件注册。
                // 导致不同的动态窗口重复调用$scope.$on的handler函数。
                unRegister();
            });

            // TODO: doesn't work ($scope haven't distroyed)
            // $scope.$on('$destroy', function() {
            //     unRegister();
            // });

            // this.inputElements.original.trigger('modal.on.initialized');
        };

        $scope.deleteEntity=function(entity, e){
            e.preventDefault();

            if(!confirm('你确定要删除id: '+entity.id+' 吗？')){
                return;
            }
        };

        $scope.batchDelete=function(e){
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
        };

        $scope.pageOptions={
            pageSize: 20,       // 每页记录数
            pageIndex: 0,       // 当前页
            pageButtons: 7      // 分页按钮数 必须为奇数 3, 5, 7 ,9 ....
        };
        reloadList(0);
    }])
    .controller("createController", ['$scope', '$rootScope', function ($scope, $rootScope){
        var validatorOptions= {
            rules: {
                name: {
                    // required: true,
                    minlength: 4
                },
                password: {
                    required: true,
                    minlength: 5
                },
                password_again: {
                    equalTo: "#password"
                },
                email: {
                    required: true,
                    email: true
                },
                // agree: "required",
                agree: {
                    required: true
                },
                topic: {
                    required: "#newsletter:checked",
                    minlength: 2
                },
                comment: {
                    required: true
                }
            },
            messages: {
                name: {
                    required: "请输入一个名称",
                    minlength: "名称至少需要4个字符"
                },
                password: {
                    required: "请输入一个密码",
                    minlength: "密码至少需要5个字符"
                },
                confirm_password: {
                    required: "请输入一个密码",
                    minlength: "密码至少需要5个字符",
                    equalTo: "两次输入的密码不一致"
                },
                email: "请输入一个有效的邮箱地址",
                agree: "请接受我们的服务条款"
            },
            // errorContainer: '#ErrorsSummary, #ErrorsSummary2',
            // errorLabelContainer: "#ErrorsSummary ul",
            // wrapper: "li", 
            // invalidHandler: function() {
            //     $( "#ErrorsSummary" ).text( this.numberOfInvalids() + " field(s) are invalid" );
            // },
            submitHandler: function() { alert("Submitted!") }

            // showErrors: function(errorMap, errorList) {
            //     if (submitted) {
            //         var summary = "You have the following errors: \n";
            //         $.each(errorList, function() { summary += " * " + this.message + "\n"; });
            //         alert(summary);
            //         submitted = false;
            //     }
            //     this.defaultShowErrors();
            // },          
            // invalidHandler: function(form, validator) {
            //     submitted = true;
            // }
        };

        $scope.validatorOptions= validatorOptions;

        $scope.$on("createEntity",function (event){ // , entity
            // $scope.entity= entity;

            $scope.validatorRef.resetForm();
        });

        $scope.$on("craeteEntitySubmit",function (event){ // , entity
            // $scope.entity= entity;

            $scope.validatorRef.checkForm();
        });
    }])
    .controller("editController", ['$scope', '$rootScope', function ($scope, $rootScope){
        var validatorOptions= {
            rules: {
                name: {
                    // required: true,
                    minlength: 4
                },
                password: {
                    required: true,
                    minlength: 5
                },
                password_again: {
                    equalTo: "#password"
                },
                email: {
                    required: true,
                    email: true
                },
                // agree: "required",
                agree: {
                    required: true
                },
                topic: {
                    required: "#newsletter:checked",
                    minlength: 2
                },
                comment: {
                    required: true
                }
            },
            messages: {
                name: {
                    required: "请输入一个名称",
                    minlength: "名称至少需要4个字符"
                },
                password: {
                    required: "请输入一个密码",
                    minlength: "密码至少需要5个字符"
                },
                confirm_password: {
                    required: "请输入一个密码",
                    minlength: "密码至少需要5个字符",
                    equalTo: "两次输入的密码不一致"
                },
                email: "请输入一个有效的邮箱地址",
                agree: "请接受我们的服务条款"
            },
            // errorContainer: '#ErrorsSummary, #ErrorsSummary2',
            // errorLabelContainer: "#ErrorsSummary ul",
            // wrapper: "li", 
            // invalidHandler: function() {
            //     $( "#ErrorsSummary" ).text( this.numberOfInvalids() + " field(s) are invalid" );
            // },
            submitHandler: function() { alert("Submitted!") }

            // showErrors: function(errorMap, errorList) {
            //     if (submitted) {
            //         var summary = "You have the following errors: \n";
            //         $.each(errorList, function() { summary += " * " + this.message + "\n"; });
            //         alert(summary);
            //         submitted = false;
            //     }
            //     this.defaultShowErrors();
            // },          
            // invalidHandler: function(form, validator) {
            //     submitted = true;
            // }
        };

        $scope.validatorOptions= validatorOptions;

        $scope.$on("editEntity",function (event, entity){
            $scope.entity= entity;

            $scope.validatorRef.resetForm();
        });

        $scope.onSubmit= function(e){
            var successed= $scope.validatorRef.checkForm();
            // alert(successed);
            // $scope.$parent.
            if(successed){
                $scope.$emit('editorSubmitSuccess');
            }
        };
        // $scope.$on("editorEntitySubmit",function (event){ // , entity
        //     // $scope.entity= entity;
        //     $scope.validatorRef.checkForm();
        // });
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
pnApp
    .config([
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