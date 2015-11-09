Jx().package("T.UI.Components", function(J){

    // 严格模式
    'use strict';

    // 全局变量、函数、对象
    var _currentPluginId = 0;
    var defaults = {
        //orgsltNames: '一级名称,二级名称,三级名称',
        dataUrl: ''
    };
    var attributeMap = {
        //orgsltNames: 'orgslt-names',
        dataUrl: 'data-url'
    };


    var OrgsltModal=new J.Class({
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
            // var htmlTabs='';
            // var htmlContents='';
            // for(var i=0; i<this.levels.length; i++){
            //     var levelName=this.levels[i];
            //     htmlTabs += '<li data-s-level="'+ i +'" class="t-level-tab-' + i + '"><a href="#">' + levelName + '<span class="caret"></span></a></li>';
            //     htmlContents += '<div class="t-level-' + i + ' t-level-content"></div>';
            // }

            // var htmlTemplate = ''+
            //     '<div class="t-level-menu dropdown-menu">'+
            //     '    <div class="t-level-path">'+
            //     '        <ul class="t-level-tabs">'+
            //     htmlTabs +
            //     '        </ul>'+
            //     '    </div>'+
            //     htmlContents +
            //     '</div>';

            var htmlTemplate = '' +            
                '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' + 
                '    <div class="modal-dialog" role="document">' + 
                '        <div class="modal-content">' + 
                '            <div class="modal-header">' + 
                '                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + 
                '                <h4 class="modal-title" id="myModalLabel">选择员工</h4>' + 
                '            </div>' + 
                '            <div class="modal-body">' + 
                '                .a.b. ' + 
                '            </div>' + 
                '            <div class="modal-footer">' + 
                '                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>' + 
                '                <button type="button" class="btn btn-primary">确定</button>' + 
                '            </div>' + 
                '        </div>' + 
                '    </div>' + 
                '</div>';

            this.container=$(htmlTemplate);
            this.container.insertAfter(this.inputElements.view);
        },
        initElements:function(){
            var context=this;

            this.elements={
                // tabs: $('.t-level-tabs li', this.container),
                // contents: $('.t-level-content', this.container),
                // getTab: function(levelIndex){
                //     var tabSelector = '.t-level-tab-' + levelIndex;
                //     return $(tabSelector, context.container);
                // },
                // getContent: function(levelIndex){
                //     var contentSelector = '.t-level-' + levelIndex;
                //     return $(contentSelector,context.container);
                // },
                // getNodes: function(levelIndex){
                //     var nodesSelector='.t-level-'+ levelIndex +' li';
                //     return $(nodesSelector,context.container);
                // }
            };
        },
        buildContent:function(){
            // var treePath = this.getPath();
            // if(treePath.length === 0){
            //     // treepath可能为空
            //     this.activeLevelIndex = 0;

            //     this._buildNodes(this.data, 0);
            // }
            // else{
            //     this.activeLevelIndex = treePath.length == this.levels.length ? this.levels.length -1 : treePath.length;

            //     var node=this.data;
            //     for(var i=0; i<=treePath.length; i++){
            //         this._buildNodes(node, i);
            //         node= node.childs[treePath[i]];
            //     }
            // }
        },
        _buildNodes:function(node, levelIndex){
            // var childs=node.childs;
            // var htmlTemplate='<ul class="t-level-nodes">';
            // for(var p in childs){
            //     var childId=p;
            //     var childName=childs[p].name;
            //     htmlTemplate += '<li data-s-id="'+childId+'">'+childName+'</li>'; 
            // }
            // htmlTemplate+='</ul>';

            // this.elements.getContent(levelIndex).empty().append(htmlTemplate);
        },        
        bindEvents:function(){
            var context=this;

            var elements=this.elements;

            this.inputElements.button
                .on('click',       $.proxy(this.show, this));
        },
        bindEventsInterface:function () {},
        _bindNodes:function(levelIndex){
            ;
        },
        reflash:function(){
                      
        },
        getPath:function(){
            // var initValue = this.inputElements.orginal.val();
            // var treePath = initValue === '' ? [] : initValue.split(',');
            // return treePath;
        },
        change:function(id, levelIndex){
            // var treePath = this.getPath();

            // // 选了低级别再选高级别，树路径回滚
            // while(treePath.length > levelIndex){
            //     treePath.pop();
            // }
            // // 选中当前ID
            // treePath.push(id);

            // this.inputElements.orginal.val(treePath.join(','));
        },
        show: function () {
            alert('show');
            // var pos = $.extend({}, this.inputElements.view.position(), {
            //     height: this.inputElements.view[0].offsetHeight
            // });

            // this.container
            //     .css({
            //         top: pos.top + pos.height, 
            //         left: pos.left
            //     })
            //     .show();
            this.container.show();
        },
        hide: function(){
            this.container.hide();
            //alert(this.inputElements.orginal.val());
        }
        
    });


    this.Orgslt = new J.Class({extend : T.UI.BaseControl}, {
        defaults : defaults,
        attributeMap : attributeMap,
        // data:{},

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
            //this.menu=new OrgsltMenu(this.elements, this.settings);

            // 绑定事件
            this.bindEvents();
            // 绑定事件接口
            this.bindEventsInterface();
        },
        buildHtml:function () {
            var htmlTemplate = ''+ 
                '<div class="t-orgslt-container input-group">' + 
                '    <input type="text" class="form-control" aria-label="...">' + 
                '    <div class="input-group-btn">' + 
                '        <button type="button" class="btn btn-default" aria-label="Help"' +     //  data-toggle="modal" data-target="#myModal">
                '            <span class="glyphicon glyphicon-user"></span>' + 
                '        </button>' + 
                '    </div>' + 
                '</div>';

            this.container = $(htmlTemplate);
            this.element.before(this.container);
        },
        getData:function(){
            var context = this;
            $.ajax({
                dataType: 'json',
                url: this.settings.dataUrl,
                data: {},
                success: function(data){
                    context.createModal(data);
                },
                error: function(){
                    alert('控件id:' + context.element.attr('id') + ' , ajax 获取数据失败!');
                }
            });
        },
        createModal:function(data){
            this.modal=new OrgsltModal(this.elements, this.settings, data);
        },
        initElements:function () {
            this.elements = {
                orginal: this.element,
                view: $('input[type=text]', this.container),
                button: $('button', this.container),
            };

            this.elements.orginal.hide();
            this.elements.view.prop("readonly","readonly");
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

            // element.on('orgslt.foo', function() {
            //     context.foo();
            //     foo();
            // });
        },
        transferAttributes: function(){
            //this.options.placeholder = this.$source.attr('data-placeholder') || this.options.placeholder
            //this.$element.attr('placeholder', this.options.placeholder)
            // this.elements.target.attr('name', this.element.attr('name'))
            // this.elements.target.val(this.element.val())
            // this.element.removeAttr('name')  // Remove from source otherwise form will pass parameter twice.
            this.elements.view.attr('required', this.element.attr('required'))
            this.elements.view.attr('rel', this.element.attr('rel'))
            this.elements.view.attr('title', this.element.attr('title'))
            this.elements.view.attr('class', this.element.attr('class'))
            this.elements.view.attr('tabindex', this.element.attr('tabindex'))
            this.elements.orginal.removeAttr('tabindex')
            if (this.element.attr('disabled')!==undefined){
               this.disable();
            }
        },
        enable: function(){
            this.element.attr('disabled', false);
            this.elements.view.attr('disabled', false);
            this.disabled=false;
        },
        disable: function(){
            this.element.attr('disabled', true);
            this.elements.view.attr('disabled', true);
            this.disabled=true;
        }
    });

});




/* orgslt javascript jQuery */

(function($) {
    // 严格模式
    'use strict';

    // 控件类名
    var pluginName = "orgslt";

        // 胶水代码
    $.fn[pluginName] = function(options) {

        this.each(function () {
            var jqElement = $(this);
            if (jqElement.data(pluginName)) {
                jqElement.data(pluginName).remove();
            }
            jqElement.data(pluginName, new T.UI.Components.Orgslt(this, options));
        });

        return this;

    };

})(jQuery);