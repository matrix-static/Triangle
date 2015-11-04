Jx().package("T.UI.Controls", function(J){

    // 严格模式
    'use strict';

    // 全局变量、函数、对象
    var _currentPluginId = 0;
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
            
            //this.transferAttributes();

            // 绑定事件
            this.bindEvents();
            // 绑定事件接口
            this.bindEventsInterface();

            // 根据值，状态，设置等刷新视图
            this.reflash();
        },
        /*getData:function(){
            //this.data.areaTree=areaTree;
        },*/
        buildHtml:function(){
            // 构建容器DOM
            this.buildContainer();

            // 初始化 html DOM 元素
            this.initElements();

            // 构建内容DOM
            this.buildContent();
        },
        buildContainer:function(){
            var htmlTabs='';
            var htmlContents='';
            for(var i=0; i<this.levels.length; i++){
                var levelName=this.levels[i];
                htmlTabs += '<li data-s-level="'+ i +'" class="tab-level-' + i + '"><a href="#">' + levelName + '<span class="caret"></span></a></li>';
                htmlContents += '<div class="level-' + i + ' level-content"></div>';
            }

            var htmlTemplate = ''+
                '<div class="level-pop dropdown-menu">'+
                '    <div class="level-path">'+
                '        <ul class="level-tabs">'+
                htmlTabs +
                '        </ul>'+
                '    </div>'+
                htmlContents +
                '</div>';

            this.container=$(htmlTemplate);
            this.container.insertAfter(this.inputElements.view);
        },
        initElements:function(){
            this.elements={
                tabs: $('.level-tabs li', this.container),
                contents: $('.level-content', this.container),
                getTab: function(levelIndex){
                    var tabSelector = '.tab-level-' + levelIndex;
                    return $(tabSelector, this.container);
                },
                getContent: function(levelIndex){
                    var contentSelector = '.level-' + levelIndex;
                    return $(contentSelector,this.container);
                },
                getNodes: function(levelIndex){
                    var nodesSelector='.level-'+ levelIndex +' li';
                    return $(nodesSelector,this.container);
                }
            };
        },
        buildContent:function(){
            var treePath = this.getPath();
            if(treePath.length === 0){
                // treepath可能为空
                this.activeLevelIndex = 0;

                this._buildNodes(this.data, 0);
            }
            else{
                this.activeLevelIndex = treePath.length == this.levels.length ? this.levels.length -1 : treePath.length;

                var node=this.data;
                for(var i=0; i<=treePath.length; i++){
                    this._buildNodes(node, i);
                    node= node.childs[treePath[i]];
                }
            }
        },
        _buildNodes:function(node, levelIndex){
            var childs=node.childs;
            var htmlTemplate='<ul class="level-node">';
            for(var p in childs){
                var childId=p;
                var childName=childs[p].name;
                htmlTemplate += '<li data-s-id="'+childId+'">'+childName+'</li>'; 
            }
            htmlTemplate+='</ul>';

            this.elements.getContent(levelIndex).empty().append(htmlTemplate);
        },        
        bindEvents:function(){
            var context=this;

            var element=this.element;
            var elements=this.elements;

            elements.tabs
                .on('click',function(e){
                    // $.peoxy 不能取 $(this).data('s-foo'); 
                    // 只有elements.foo是单个控件的情况下，能在这里被引用时才能使用。
                    var levelIndex = $(this).data('s-level');
                    levelIndex = parseInt(levelIndex);
                    context._activeTab(levelIndex);

                    e.preventDefault();
                });

            var treePath = this.getPath();
            for(var i=0; i <= treePath.length; i++){
                this._bindNodes(i);
            }
        },
        bindEventsInterface:function () {},
        _bindNodes:function(levelIndex){
            var context=this;

            var jqNodes=this.elements.getNodes(levelIndex);
            jqNodes.on('click',function(e){
                var id = $(this).data('s-id');

                // 更新值
                context.change(id, context.activeLevelIndex);
                

                var treePath = context.getPath();
                var parentNode=context.data;
                for(var i=0; i<context.activeLevelIndex; i++){
                    var nodeId=treePath[i];
                    parentNode=parentNode.childs[nodeId];
                }
                var node = parentNode.childs[id];

                if(treePath.length < context.levels.length){
                    // 显示 下一级 tab
                    context.activeLevelIndex++;
                    
                    // 显示 下一级 节点
                    context._buildNodes(node, treePath.length);
                    // 重新绑定 下一级 点击事件
                    context._bindNodes(context.activeLevelIndex);

                    // 清空下一级后的 tab
                    for(var i=treePath.length; i < context.levels.length; i++){
                        context._setTab(i, context.levels[i]);
                    }
                    // 清空下两级后的 content
                    for(var i=treePath.length+1; i < context.levels.length; i++){
                        context.elements.getContent(i).empty();
                    }
                }

                if(!node.childs){
                    // 选完最后一级隐藏 树型菜单
                    context.hide();
                }

                // 刷新视图
                context.reflash();
            })
        },
        reflash:function(){
            this._activeTab(this.activeLevelIndex);

            var treePath = this.getPath();

            // 初始化时 value 可能为空
            if(treePath.length === 0){
                return;
            }

            var id=treePath[treePath.length-1];

            // 查找节点
            var nodeNamePath = '';
            var parentNode=this.data;
            for(var i=0; i<treePath.length-1; i++){
                var nodeId=treePath[i];
                parentNode=parentNode.childs[nodeId];
                nodeNamePath += parentNode.name + '/';
                this._setTab(i, parentNode.name);
            }
            var node = parentNode.childs[id];

            // 修改视图中的文字
            nodeNamePath += node.name;
            this.inputElements.view.val(nodeNamePath);
            this._setTab(treePath.length-1, node.name);             
        },
        _setTab:function(index, text){
            var jqActiveTab= this.elements.getTab(index);
            jqActiveTab.html('<a href="#">'+ text +'<span class="caret"></span>');
        },
        _activeTab:function(levelIndex){
            this.activeLevelIndex=levelIndex;

            this.elements.tabs.removeClass('active');
            this.elements.getTab(levelIndex).addClass('active');
            
            this.elements.contents.hide();            
            this.elements.getContent(levelIndex).show();
        },
        getPath:function(){
            var initValue = this.inputElements.orginal.val();
            var treePath = initValue === '' ? [] : initValue.split(',');
            return treePath;
        },
        change:function(id, levelIndex){
            var treePath = this.getPath();

            // 选了低级别再选高级别，树路径回滚
            while(treePath.length > levelIndex){
                treePath.pop();
            }
            // 选中当前ID
            treePath.push(id);

            this.inputElements.orginal.val(treePath.join(','));
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
            alert(this.inputElements.orginal.val());
        }
        
    });

    this.Level = new J.Class({extend : T.UI.BaseControl}, {
        defaults : defaults,
        attributeMap : attributeMap,
        data:{},

        // 构造函数
        init:function(element, options){
            this.element = $(element);
            //this.settings,

            this.container,
            this.elements,

            this.value = this.element.val();

            /*
                initialized 和 plugin-id 属于控件的内部属性， 保存在 element.data 中，不能在 defalut 中暴露给外界。
                也不在 parseAttributes 中解析，同理不加 data-s 前缀
            */
            // 防止多次初始化
            if (this.element.data('initialized')) { return; }
            this.element.data('initialized', true);
            // 区分一个页面中存在多个控件实例
            _currentPluginId += 1;
            this.element.data('plugin-id', _currentPluginId);

            // 初始化选项
            this.initSettings(options);

            // 初始化数据
            this.getData();

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
                '<div class="level-container">'+ 
                //'    <input type="hidden" />'+
                '    <input type="text" autocomplete="off" />'+
                '</div>';

            this.container = $(htmlTemplate);
            this.element.before(this.container);
        },
        getData:function(){
            /*
            // 省/市/区县 树
            var areaTree={
                name:'行政区划树',
                childs:{}
            };
            */
            var context = this;
            $.ajax({
                dataType: 'json',
                url: this.settings.dataUrl,
                data: {},
                success: function(data){
                    context.createMenu(data);
                }
            });
        },
        createMenu:function(data){
            this.menu=new LevelMenu(this.elements, this.settings, data);
        },
        initElements:function () {
            this.elements = {
                orginal: this.element,
                view: $('input[type=text]', this.container)
            };

            this.elements.orginal.hide();
            this.elements.view.attr("readonly","readonly");
        },
        bindEvents:function () {
            var context=this;

            var element=this.element;
            var elements=this.elements;

            // element.on('keydown', function(e) {
            //     ;
            // });

            elements.view
                .on('focus',    $.proxy(this._showMenu, this))      // $proxy 用 当前 this 替代 控件 this
                .on('blur',     $.proxy(this._hideMenu, this));
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
            this.elements.orginal.removeAttr('tabindex')
            //if (this.element.attr('disabled')!==undefined)
            //    this.disable();
        },
        _showMenu:function(){
            this.menu.show();
        },
        _hideMenu:function(){
            //this.menu.hide();
        }
    });

});




/* level javascript jQuery */

(function($) {
    // 严格模式
    'use strict';

    // 控件类名
    var pluginName = "level";

        // 胶水代码
    $.fn[pluginName] = function(options) {

        this.each(function () {
            var jElement = $(this);
            if (jElement.data(pluginName)) {
                jElement.data(pluginName).remove();
            }
            jElement.data(pluginName, new T.UI.Controls.Level(this, options));
        });

        return this;

    };

})(jQuery);