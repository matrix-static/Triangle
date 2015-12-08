Jx().package("T.Utilities", function(J){
    // 严格模式
    'use strict';
    
    String.format = function() {
        if( arguments.length == 0 )
            return null;

        var str = arguments[0]; 
        for(var i=1;i<arguments.length;i++) {
            var re = new RegExp('\\{' + (i-1) + '\\}','gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    };
});

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
        */

        // 构造函数
        init: function(){},
        // 初始化设置
		initSettings: function(options){
            /*
                (BaseControl)t-plugin-id 和 ($.toc)t-plugin-ref 属于控件的内部属性
                保存在 element.data 中，不能在 defalut 中暴露给外界
                也不在 parseAttributes 中解析，同理不加 data-s 前缀
            */
            // 区分一个页面中存在多个控件实例
            _currentPluginId += 1;
            this.element.data('t-plugin-id', _currentPluginId);

            var attributes = this.parseAttributes();
			this.settings = $.extend({}, this.defaults, attributes, options);
		},
        // 获取属性值
		parseAttributes: function () {
			var data = {};

            for(var p in this.attributeMap){
                var value = this.attributeMap[p]
                var attrName = 't-' + value + '';
                // if (this.element.is('[data-' + attrName + ']')){
                //     data[p] = this.element.data(attrName);
                // }
                var d=this.element.data(attrName);
                data[p] = d || undefined;
            }

			return data;
		},
        // 初始化值
        initValue: function(){},
        
        bindEvents: function(){},
        unbindEvents: function(){},

        enable: function(){},
        disable: function(){},

        destroy: function () {            
            // this.container.remove();
            // this.container = null;
            // Switch off events
            this.unbindEvents();

            this.element.data('t-plugin-id').remove();
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



