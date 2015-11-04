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
            this.ranks=this.settings.levelNames.split(',');

            // 初始化数据
            //this.getData();
            this.data=data;

            // 保存当前行政级别
            this.activeRankIndex=0;

            // 构建html DOM
            this.buildHtml();
            // 初始化 html DOM 元素
            this.initElements();
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
            this._buildTab();

            var treePath = this.getPath();
            if(treePath.length === 0){
                // treepath可能为空
                this.activeRankIndex = 0;

                this._buildNodes(this.data, 0);
            }
            else{
                this.activeRankIndex = treePath.length == this.ranks.length ? this.ranks.length -1 : treePath.length;

                var node=this.data;
                for(var i=0; i<=treePath.length; i++){
                    this._buildNodes(node, i);
                    node= node.childs[treePath[i]];
                }
            }
        },
        _buildTab:function(){
            var htmlTabs='';
            var htmlContents='';
            for(var i=0; i<this.ranks.length; i++){
                var levelName=this.ranks[i];
                htmlTabs += '<li data-s-rank="'+ i +'" class="tab-level-' + i + '"><a href="#">' + levelName + '<span class="caret"></span></a></li>';
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
        _buildNodes:function(node, rankIndex){
            var childs=node.childs;
            var htmlTemplate='<ul class="level-node">';
            for(var p in childs){
                var childId=p;
                var childName=childs[p].name;
                htmlTemplate += '<li data-s-id="'+childId+'">'+childName+'</li>'; 
            }
            htmlTemplate+='</ul>';

            var nodesContainerSelector='.level-'+rankIndex;
            var nodesContainer= $(nodesContainerSelector, this.container);

            nodesContainer.empty().append(htmlTemplate);
        },
        initElements:function(){
            this.elements={
                tabs: $('.level-tabs li', this.container),
                contents: $('.level-content', this.container)
            };
        },
        bindEvents:function(){
            var context=this;

            var element=this.element;
            var elements=this.elements;

            elements.tabs
                .on('click',function(e){
                    var rankIndex = $(this).data('s-rank');
                    rankIndex = parseInt(rankIndex);
                    context._activeTab(rankIndex);

                    e.preventDefault();
                });

            var treePath = this.getPath();
            for(var i=0; i <= treePath.length; i++){
                this._bindNodes(i);
            }
        },
        bindEventsInterface:function () {},
        _bindNodes:function(rankIndex){
            var context=this;

            var nodesSelector='.level-'+ rankIndex +' li';
            var jqNodes=$(nodesSelector,this.container);

            //nodes.on('click', context.renderChild);
            jqNodes.on('click',function(e){
                var id = $(this).data('s-id');

                // 更新值
                context.change(id, context.activeRankIndex);
                

                var treePath = context.getPath();
                var parentNode=context.data;
                for(var i=0; i<context.activeRankIndex; i++){
                    var nodeId=treePath[i];
                    parentNode=parentNode.childs[nodeId];
                }
                var node = parentNode.childs[id];

                if(treePath.length < context.ranks.length){
                    // 显示 下一级 tab
                    context.activeRankIndex++;
                    
                    // 显示 下一级 节点
                    context._buildNodes(node, treePath.length);
                    // 重新绑定 下一级 点击事件
                    context._bindNodes(context.activeRankIndex);

                    // 清空下一级后的 tab
                    for(var i=treePath.length; i < context.ranks.length; i++){
                        context._reflashTab(i, context.ranks[i]);
                    }
                    // 清空下两级后的 content
                    for(var i=treePath.length+1; i < context.ranks.length; i++){
                        context._clearContent(i);
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
            this._activeTab(this.activeRankIndex);

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
                this._reflashTab(i, parentNode.name);
            }
            var node = parentNode.childs[id];

            // 修改视图中的文字
            nodeNamePath += node.name;
            this.inputElements.view.val(nodeNamePath);
            this._reflashTab(treePath.length-1, node.name);             
        },
        _reflashTab:function(index, text){
            var jqActiveTab=$('.level-tabs .tab-level-' + index, this.container);
            jqActiveTab.html('<a href="#">'+ text +'<span class="caret"></span>');
        },
        _activeTab:function(rankIndex){
            this.activeRankIndex=rankIndex;

            var tabSelector = '.tab-level-' + rankIndex;
            var contentSelector = '.level-' + rankIndex;

            this.elements.tabs.removeClass('active');
            this.elements.contents.hide();
            $(tabSelector,this.container).addClass('active');
            $(contentSelector,this.container).show();
        },
        _clearContent:function(index){
            var nodesContainerSelector='.level-'+index;
            var nodesContainer= $(nodesContainerSelector, this.container);
            nodesContainer.empty();
        },
        getPath:function(){
            var initValue = this.inputElements.orginal.val();
            var treePath = initValue === '' ? [] : initValue.split(',');
            return treePath;
        },
        change:function(id, rankIndex){
            var treePath = this.getPath();

            // 选了低级别再选高级别，树路径回滚
            while(treePath.length > rankIndex){
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
            //this.element_data = this.element.data(),

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

            element.on('keydown', function(e) {
                ;
            });

            elements.view
                .on('focus',    $.proxy(this._showMenu, this))
                .on('blur',     $.proxy(this._hideMenu, this));
        },        
        bindEventsInterface:function () {
            var context=this;
            var element=this.element;

            element.on('level.foo', function() {
                context.foo();
                foo();
            });
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