Jx().package("T.Utilities", function(J){
    // 严格模式
    'use strict';
    
    String.format = function() {
        if( arguments.length === 0 )
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

    // 获取属性值
    function parseAttributes(element, attributeMap) {
        var data = {};

        for(var p in attributeMap){
            var value = attributeMap[p]
            var attrName = 't-' + value + '';
            // if (element.is('[data-' + attrName + ']')){
            //     data[p] = element.data(attrName);
            // }
            var d = element.data(attrName);
            data[p] = d || undefined;
        }

        return data;
    }

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
		initSettings: function(element, options){
            /*
                (BaseControl)t-plugin-id 和 ($.toc)t-plugin-ref 属于控件的内部属性
                保存在 element.data 中，不能在 defalut 中暴露给外界
                也不在 parseAttributes 中解析，同理不加 data-s 前缀
            */
            // 区分一个页面中存在多个控件实例
            _currentPluginId += 1;
            // element.data('t-plugin-id', _currentPluginId);
            this.pluginId = _currentPluginId;

            // TODO: 临时向前兼容方案，dtpicker完成后要移除
            if(typeof element.data === 'undefined'){
                options=element;
                element=this.element;
            }

            var attributes = parseAttributes(element, this.attributeMap);
			this.settings = $.extend({}, this.defaults, attributes, options);
		},
        
        // 初始化字符串值，对象/数组值，状态值等
        initStates: function(){},
        
        bindEvents: function(){},
        unbindEvents: function(){},

        enable: function(){},
        disable: function(){},

        destroy: function () {            
            // this.container.remove();
            // this.container = null;
            // Switch off events
            this.unbindEvents();

            // this.elements.original.data('t-plugin-id').remove();
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
        refresh: function(){
            ;
        },
        actionOne: function(){
            this.element.trigger('controlname.on.eventname');
        }
        */

	});
});



