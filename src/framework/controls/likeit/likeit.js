Jx().package("T.UI.Controls", function(J){

    // 严格模式
    'use strict';


    // 全局变量、函数、对象
    var _currentPluginId = 0;

    var defaults = {
        liked: false,
        dataUrl: ''
    };
    var attributeMap = {
        liked: 'liked',
        dataUrl: 'data-url'
    };

    this.LikeIt = new J.Class({extend : T.UI.BaseControl}, {
        defaults : defaults,
        attributeMap : attributeMap,
        // 构造函数
        init:function(element, options){
            this.element = $(element);

            //this.settings,
            // this.container,
            // this.elements,

            //this.value = this.element.val();
            this.value = parseInt(this.element.text());

            // 初始化选项
            this.initSettings(options);

            // // 初始化数据
            // this.getData();

            // // 构建html DOM
            // this.buildHtml();
            // // 初始化 html DOM 元素
            // this.initElements();
            // this.transferAttributes();

            // 创建 树型 菜单对象
            //this.menu=new LevelMenu(this.elements, this.settings);

            // 绑定事件
            this.bindEvents();
            // 绑定事件接口
            // this.bindEventsInterface();

            this.reflash();
        },
        bindEvents: function(){
            this.element.on('click', $.proxy(this.toggle, this));
        },
        getValue: function(){
            return this.value;
        },
        toggle: function(){
            this.value = this.settings.liked ? this.value-1 : this.value+1;
            this.settings.liked = !this.settings.liked;
            this.postback();
        },
        postback: function(){
            if(!this.settings.dataUrl){
                return;
            }
            var context=this;
            $.ajax({
                dataType: 'json',
                url: this.settings.dataUrl,
                data: {},
                success: function(data){
                    context.reflash();
                },
                error: function(){
                    alert('控件id: ' + context.element.attr('id') + ' , ajax发送数据失败！');
                }
            });
        },
        reflash: function(){
            this.element.text(this.value);
            if(this.settings.liked){
                this.element.addClass("liked");
            }
            else{
                this.element.removeClass("liked");
            }
        }
    });

});

/* likeit javascript jQuery */
(function($) {
    // 严格模式
    'use strict';

    // 控件类名
    var pluginName = 'likeit';
    var pluginRef = 't-plugin-ref';

    // 胶水代码
    $.fn[pluginName] = function(options) {

        this.each(function () {
            if(options === 'destroy'){
                jqElement.data(pluginRef).destroy();
                jqElement.data(pluginRef).remove();
                return;
            }

            var jqElement=$(this);
            var plugin = jqElement.data(pluginRef);
            if(plugin === undefined)
            {
                plugin=new T.UI.Controls.LikeIt(this, $.extend(true, {}, options));
                jqElement.data(pluginRef, plugin);
            }
        });

        return this;
    };
})(jQuery);
