Jx().package("T.UI", function(J){
	// 严格模式
	'use strict';

    // 全局变量、函数、对象
    var _currentPluginId = 0;

	this.BaseControl = new J.Class({

        /*
		defaults: {},
		attributeMap: {},
        templates:{},
        
        element: {},
        container: {},
        elements: {},
        init: function{},
        */

        // 是否已经初始化
        isInitialized: function(){
            return this.element.data('initialized') === true;
        },
        // 初始化
        initialize: function(){
            /*
                initialized, plugin-id 和 plugin-ref 属于控件的内部属性， 保存在 element.data 中，不能在 defalut 中暴露给外界。
                也不在 parseAttributes 中解析，同理不加 data-s 前缀
            */
            
            // 区分一个页面中存在多个控件实例
            _currentPluginId += 1;
            this.element.data('plugin-id', _currentPluginId);
        },
        // 初始化完成
        initialized: function(){
            this.element.data('plugin-ref', this);
            // js单线程无需锁
            this.element.data('initialized', true);
        },
        // 初始化设置
		initSettings: function(options){
            var attributes = this.parseAttributes();
			this.settings = $.extend({}, this.defaults, attributes, options);
		},
		parseAttributes: function () {
			var context=this;

			var data = {};
			$.each(this.attributeMap, function(key, value) {
				var attrName = 's-' + value + '';
				if (context.element.is('[data-' + attrName + ']')) {
					data[key] = context.element.data(attrName);
				}
			});
			return data;
		},
        // 初始化值
        initValue: function(){},
        // 获得存储在 element.data 中的 plugin 引用
        getRef: function(){
            return this.element.data('plugin-ref'); 
        },

        enable: function(){},
        disable: function(){},

        destroy: function () {
            if(!this.isInitialized()){
                return;
            }
            
            this.container.remove();
            this.container = null;

            // Switch off events
            this.unbindEvents();

            this.element.data('initialized').remove();
            this.element.data('plugin-id').remove();
            this.element.data('plugin-ref').remove();
        }//,

        /*
        buildHtml: function () {
            ;
        },
        initElements: function () {
            this.elements = {
                input: $('.tui-controlname-elementname', this.container)
            }
        },
        bindEvents: function () {
            var context=this;

            var element=this.element;
            var elements=this.elements;

            element.on('eventname', function(e) {
                actionOne();
            });

            elements.up.on('eventname', function(ev) {
                ;
            });
        },
        bindEventsInterface: function () {
            var context=this;
            var element=this.element;

            element.on('address.foo', function() {
                context.foo();
                foo();
            });
        },
        unbindEvents: function () {
            this.element.off();
        },
        reflash: function(){
            ;
        },
        actionOne: function(){
            this.element.trigger('controlname.on.eventname');
        }
        */

	});
});