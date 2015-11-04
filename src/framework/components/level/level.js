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

            var treePath=this.inputElements.orginal.val().split(',');
            // 设置初始值时大于二级的话，二级及二级以上的 content 没有内容需要添加内容
            var node=this.data;
            for(var i=0; i<treePath.length; i++){
                this._buildNodes(node, i);
                node=node.childs[treePath[i]];
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
                    context.activeRankIndex = parseInt(rankIndex);
                    context._activeTab();

                    e.preventDefault();
                });

            var treePath=this.inputElements.orginal.val().split(',');
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
                context.change(id);
                // 刷新视图
                context.reflash();
            })
        },
        reflash:function(){
            var treePath=this.inputElements.orginal.val().split(',');
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

            if(treePath.length < this.ranks.length){
                // 不是最后一级
                
                // 显示 下一级 tab
                this.activeRankIndex++;    
                // 显示 下一级 节点
                this._buildNodes(node, treePath.length);
                // 重新绑定 下一级 点击事件
                this._bindNodes(this.activeRankIndex);

                // 清空下一级后的 tab
                //for(var i=this.activeRankIndex; i < this.ranks.length; i++){
                for(var i=treePath.length; i < this.ranks.length; i++){
                    this._reflashTab(i, this.ranks[i]);
                }
                // 清空下两级后的 content
                //for(var i=this.activeRankIndex+1; i < this.ranks.length; i++){
                for(var i=treePath.length+1; i < this.ranks.length; i++){
                    this._clearContent(i);
                }
            }
            
            if(!node.childs){
                // 选完最后一级隐藏 树型菜单
                this.hide();
            }

            this._activeTab();
        },
        _reflashTab:function(index, text){
            var jqActiveTab=$('.level-tabs .tab-level-' + index, this.container);
            jqActiveTab.html('<a href="#">'+ text +'<span class="caret"></span>');
        },
        _activeTab:function(){
            var tabSelector = '.tab-level-' + this.activeRankIndex;
            var contentSelector = '.level-' + this.activeRankIndex;

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
        change:function(id){
            var treePath=this.inputElements.orginal.val().split(',');

            // 选了低级别再选高级别，树路径回滚
            while(treePath.length>this.activeRankIndex){
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