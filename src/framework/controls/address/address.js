Jx().package("T.UI.Controls", function(J){

    // 严格模式
    'use strict';

      // 全局变量、函数、对象
    var _currentPluginId = 0;
    var defaults = {};
    var attributeMap = {};

    this.Address = new J.Class({extend : T.UI.BaseControl}, {
        defaults : defaults,
        attributeMap : attributeMap,
        // 构造函数
        init:function(element, options){

            this.element = $(element);
            //this.settings,
            this.element_data = this.element.data(),

            this.container,
            this.elements,

            this.value = '';

            // 防止多次初始化
            if (this.element.data('alreadyinitialized')) { return; }
            this.element.data('alreadyinitialized', true);
            // 区分一个页面中存在多个控件实例
            _currentPluginId += 1;
            this.element.data('pluginId', _currentPluginId);

            // 初始化选项
            this.initSettings(options);

            // 构建html DOM
            this.buildHtml();
            // 初始化 html DOM 元素
            this.initElements();

            // 绑定事件
            this.bindEvents();
            // 绑定事件接口
            this.bindEventsInterface();

        },
        buildHtml:function () {
            ;
        },
        initElements:function () {
            this.elements = {
                input: $('.neo-address-input', this.container)
            }
        },
        bindEvents:function () {
            var context=this;

            var element=this.element;
            var elements=this.elements;

            element.on('keydown', function(e) {
                ;
            });

            elements.up.on('keyup', function(ev) {
                ;
            });
        },
        bindEventsInterface:function () {
            var context=this;
            var element=this.element;

            element.on('address.foo', function() {
                context.foo();
                foo();
            });
        }
    });

});