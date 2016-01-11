Jx().package("T.UI.Controls", function(J){

    // 严格模式
    'use strict';

    // 全局变量、函数、对象
    var defaults = {
        levelNames: '一级名称,二级名称,三级名称',
        dataUrl: ''
    };
    var attributeMap = {
        levelNames: 'level-names',
        dataUrl: 'data-url'
    };

    var LevelMenu=new J.Class({
        data:{},
        init:function(elements, options, data){
            this.inputElements = elements;

            // 初始化选项
            //this.initSettings(options);
            // 直接使用地址类实例的设置
            this.settings=options;
            this.levels=this.settings.levelNames.split(',');

            // 初始化数据
            //this.getData();
            this.data=data;

            // 保存当前行政级别
            this.activeLevelIndex=0;

            // 构建html DOM
            this.buildHtml();
            this.initElements();
            
            //this.transferAttributes();

            // 绑定事件
            this.bindEvents();
            // 绑定事件接口
            this.bindEventsInterface();

            // 根据值，状态，设置等刷新视图
            this.refresh();
        },
        /*getData:function(){
            //this.data.areaTree=areaTree;
        },*/
        buildHtml:function(){
            var htmlTabs='';
            var htmlContents='';
            for(var i=0; i<this.levels.length; i++){
                var levelName=this.levels[i];
                htmlTabs += '<li data-t-level="'+ i +'" class="t-level-tab-' + i + '"><a href="#">' + levelName + '<span class="caret"></span></a></li>';
                htmlContents += '<div class="t-level-' + i + ' t-level-content"></div>';
            }

            var htmlTemplate = ''+
                '<div class="t-level-menu dropdown-menu">'+
                '    <div class="t-level-path">'+
                '        <ul class="t-level-tabs">'+
                htmlTabs +
                '        </ul>'+
                '    </div>'+
                htmlContents +
                '    <span class="t-level-close glyphicon glyphicon-remove"></span>'+
                '</div>';

            this.container=$(htmlTemplate);
            this.container.insertAfter(this.inputElements.view);
        },
        buildContainer:function(){
            
        },
        initElements:function(){
            var context=this;

            this.elements={
                tabs: $('.t-level-tabs li', this.container),
                contents: $('.t-level-content', this.container),
                close: $('.t-level-close', this.container),
                getTab: function(levelIndex){
                    var tabSelector = '.t-level-tab-' + levelIndex;
                    return $(tabSelector, context.container);
                },
                getContent: function(levelIndex){
                    var contentSelector = '.t-level-' + levelIndex;
                    return $(contentSelector,context.container);
                },
                getNodes: function(levelIndex){
                    var nodesSelector='.t-level-'+ levelIndex +' li';
                    return $(nodesSelector,context.container);
                }
            };
        },
        grep: function(nodes, nodeId){
            for(var i=0; i<nodes.length; i++){
                if(nodeId === nodes[i].id){
                    var node= nodes[i];
                    return node;
                }
            }
        },
        _buildNodes:function(nodes, levelIndex){
            var htmlTemplate='<ul class="t-level-nodes">';
            for(var i=0; i<nodes.length; i++){
                var node= nodes[i];
                htmlTemplate += '<li data-t-id="'+node.id+'">'+node.name+'</li>'; 
            }
            htmlTemplate+='</ul>';

            this.elements.getContent(levelIndex).empty().append(htmlTemplate);
        },        
        bindEvents:function(){
            var context=this;

            var elements=this.elements;

            this.inputElements.view
                .on('click',       $.proxy(this.show, this))
                .on('blur',       $.proxy(this.blur, this));

            this.container
                .on('mouseenter', $.proxy(this.mouseenter, this))
                .on('mouseleave', $.proxy(this.mouseleave, this));

            elements.tabs
                .on('click',function(e){
                    // $.peoxy 不能取 $(this).data('t-foo'); 
                    // 只有elements.foo是单个控件的情况下，能在这里被引用时才能使用。
                    var levelIndex = $(this).data('t-level');
                    context.activeLevelIndex = parseInt(levelIndex);
                    context._activeTab();

                    e.preventDefault();
                });

            elements.close.on('click', function(e){
                context.hide();
            });

            var treePath = this.getPath();
            for(var i=0; i <= treePath.length; i++){
                this._bindEventsNodes(i);
            }
        },
        bindEventsInterface:function () {},
        _bindEventsNodes:function(levelIndex){
            var context=this;

            var jqNodes=this.elements.getNodes(levelIndex);
            jqNodes.on('click',function(e){
                var id = $(this).data('t-id');

                // 更新值
                context.change(id, context.activeLevelIndex);
                context.refresh();
                

                var treePath = context.getPath();
                if(treePath.length < context.levels.length){
                    // 清空下一级后的 tab
                    for(var i=treePath.length; i < context.levels.length; i++){
                        context._setTab(i, context.levels[i]);
                    }
                    // 清空下两级后的 content
                    for(var i=treePath.length+1; i < context.levels.length; i++){
                        context.elements.getContent(i).empty();
                    }
                }
                else{
                    // 选完最后一级，隐藏菜单
                    context.hide();
                }
            })
        },
        refresh:function(){
            var treePath = this.getPath();

            this._refreshInputView(treePath);
            this._refreshTabs(treePath);
            this._refreshTabContents(treePath);
            
            this.activeLevelIndex= this.getLastestTabIndex(treePath);
            this._activeTab();
        },
        _refreshTabs: function(treePath){
            var nodes= this.data;
            var node;
            for(var i=0; i<treePath.length; i++){
                var nodeId= treePath[i];
                node= this.grep(nodes, nodeId);
                nodes= node.childs;

                this._setTab(i, node.name);
            }
        },
        _setTab:function(index, text){
            var jqActiveTab= this.elements.getTab(index);
            jqActiveTab.html('<a href="#">'+ text +'<span class="caret"></span>');
        },
        _activeTab:function(){
            this.elements.tabs.removeClass('active');
            this.elements.getTab(this.activeLevelIndex).addClass('active');
            
            this.elements.contents.hide();            
            this.elements.getContent(this.activeLevelIndex).show();
        },
        _refreshTabContents: function(treePath){
            var nodes= this.data;
            var node;
            var lastestTabIndex= this.getLastestTabIndex(treePath);
            for(var i=0; i<lastestTabIndex+1; i++){
                this._buildNodes(nodes, i);
                this._bindEventsNodes(i);

                var nodeId= treePath[i];
                if(!nodeId){
                    break;
                }
                node= this.grep(nodes, nodeId);
                nodes= node.childs;
            }
        },
        _refreshInputView: function(treePath){
            var nodeNames= [];
            var nodes= this.data;
            var node;
            for(var i=0; i<treePath.length; i++){
                var nodeId= treePath[i];
                node= this.grep(nodes, nodeId);
                nodes= node.childs;

                nodeNames.push(node.name);
            }
            var nodeNamePath= nodeNames.join(' / ');
            this.inputElements.view.val(nodeNamePath);
        },
        getPath:function(){
            var initValue = this.inputElements.original.val();
            var treePath = initValue === '' ? [] : initValue.split(',');
            return treePath;
        },
        getLastestTabIndex: function(treePath){
            var lastestTabIndex= treePath.length === this.levels.length ? treePath.length-1 : treePath.length;
            return lastestTabIndex;
        },
        change:function(id, levelIndex){
            var treePath = this.getPath();

            // 选了低级别再选高级别，树路径回滚
            while(treePath.length > levelIndex){
                treePath.pop();
            }
            // 选中当前ID
            treePath.push(id);

            this.inputElements.original.val(treePath.join(','));
            // 触发 AngularJS 双向绑定
            this.inputElements.original.trigger('change');
        },        
        blur: function (e) {
            var context = this;
            if (!this.mousedover) {
                setTimeout(function () { 
                    context.hide(); 
                }, 200);
            }
        },
        mouseenter: function (e) {
            this.mousedover = true;
        },
        mouseleave: function (e) {
            var context = this;
            if (!this.mousedover) {
                setTimeout(function () { 
                    context.hide(); 
                }, 200);
            }

            this.mousedover = false;
        },
        show: function () {
            var pos = $.extend({}, this.inputElements.view.position(), {
                height: this.inputElements.view[0].offsetHeight
            });

            this.container
                .css({
                    top: pos.top + pos.height, 
                    left: pos.left
                })
                .show();
        },
        hide: function(){
            this.container.hide();
            //alert(this.inputElements.original.val());
        }        
    });

    this.Level = new J.Class({extend : T.UI.BaseControl}, {
        defaults : defaults,
        attributeMap : attributeMap,

        // 构造函数
        init:function(element, options){
            this.element = $(element);

            //this.settings,

            this.container,
            this.elements,

            this.value = this.element.val();

            // 初始化选项
            // this.initSettings(options);
            var jqElement=$(element);
            this.initSettings(jqElement, options);

            // // 初始化数据
            // this.getData();

            var context= this;
            // var d = $.Deferred();
            this.d = $.Deferred();
            $.when(this.getData(this.d))
             .done(function(){
                context.render();
             });

            // 构建html DOM
            this.buildHtml();
            // 初始化 html DOM 元素
            this.initElements();
            this.transferAttributes();

            // 创建 树型 菜单对象
            //this.menu=new LevelMenu(this.elements, this.settings);

            // 绑定事件
            this.bindEvents();
            // 绑定事件接口
            this.bindEventsInterface();
        },
        buildHtml:function () {
            var htmlTemplate = ''+ 
                '<div class="t-level-container">'+
                //'    <input type="hidden" />'+
                '    <input type="text" autocomplete="off" />'+
                '</div>';

            this.container = $(htmlTemplate);
            this.element.before(this.container);
        },
        getData:function(d){
            /*
            // 省/市/区县 树
            var areaTree={
                name:'行政区划树',
                childs:{}
            };
            */
            // var context = this;
            // $.ajax({
            //     dataType: 'json',
            //     url: this.settings.dataUrl,
            //     data: {},
            //     success: function(data){
            //         context.createMenu(data);
            //     }
            // });

            if (this.settings.data) {
                this.data = $.extend(true, [], this.settings.data);
                delete this.settings.data;

                d.resolve();

                return d.promise();
            }

            var context = this;
            $.ajax({
                dataType: 'json',
                url: this.settings.dataUrl,
                data: {},
                success: function(data){
                    context.data=data;// $.extend(true, [], data);

                    d.resolve();
                },
                error: function(xmlHttpRequest, status, error){
                    alert('控件id：' + context.element.attr('id')+'，ajax获取数据失败!');

                    d.resolve();
                }
            });

            return d.promise();
        },
        // createMenu:function(data){
        //     this.menu=new LevelMenu(this.elements, this.settings, data);
        // },
        render: function(){
            this.menu=new LevelMenu(this.elements, this.settings, this.data);
        },
        initElements:function () {
            this.elements = {
                original: this.element,
                view: $('input[type=text]', this.container)
            };

            this.elements.original.hide();
            this.elements.view.attr("readonly","readonly");
        },
        bindEvents:function () {
            var context=this;

            var element=this.element;
            var elements=this.elements;

            // element.on('keydown', function(e) {
            //     ;
            // });

            // elements.view
            //     .on('focus',    $.proxy(this._showMenu, this))      // $proxy 用 当前 this 替代 控件 this
            //     .on('blur',     $.proxy(this._hideMenu, this));
        },        
        bindEventsInterface:function () {
            var context=this;
            var element=this.element;

            // element.on('level.foo', function() {
            //     context.foo();
            //     foo();
            // });
        },
        transferAttributes: function(){
            //this.options.placeholder = this.$source.attr('data-placeholder') || this.options.placeholder
            //this.$element.attr('placeholder', this.options.placeholder)
            // this.elements.target.prop('name', this.element.prop('name'))
            // this.elements.target.val(this.element.val())
            // this.element.removeAttr('name')  // Remove from source otherwise form will pass parameter twice.
            this.elements.view.attr('required', this.element.attr('required'))
            this.elements.view.attr('rel', this.element.attr('rel'))
            this.elements.view.attr('title', this.element.attr('title'))
            this.elements.view.attr('class', this.element.attr('class'))
            this.elements.view.attr('tabindex', this.element.attr('tabindex'))
            this.element.removeAttr('tabindex')
            if (this.element.attr('disabled')!==undefined){
               this.disable();
            }
        },
        // setValue: function(value){
        //     this.element.val(value); // ng-model修改时，值已改变，不需要再设置
        //     this.menu.reflesh();
        // },
        refresh: function(){
            // this.menu.reflesh();
            var context= this;
            $.when(this.d.promise())
             .done(function(){
                context.menu.refresh();
             });
        },
        enable: function(){
            this.element.prop('disabled', false);
            this.elements.view.prop('disabled', false);
            this.disabled=false;
        },
        disable: function(){
            this.element.prop('disabled', true);
            this.elements.view.prop('disabled', true);
            this.disabled=true;
        }
    });
});