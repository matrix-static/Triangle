Jx().package("T.UI.Components", function(J){
    // 严格模式
    'use strict';

    var _crrentPluginId = 0;
    var defaults = {
        // 选项
        // fooOption: true,
        // 覆写 类方法
        // parseData: undefined,
        // 事件
        // onFooSelected: undefined,
        // onFooChange: function(e, data){}
    };
    var attributeMap = {
        // fooOption: 'foo-option'
    };

    this.Template = new J.Class({extend: T.UI.BaseControl},{
        defaults: defaults,
        attributeMap: attributeMap,

        settings: {},
        value: '',
        data: {},
        templates: {},

        // 构造函数
        init: function(element, options){
            this.element=$(element);

            // // 防止多次初始化
            // if (this.isInitialized()) { 
            //     return this.getRef(); 
            // }
            // this.initialize(element);

            this.initSettings(options);
            // this.value= this.element.val();

            this.buildHtml();
            this.initElements();

            var context= this;
            $.when(this.getData())
             .done(function(){
                context.render();
             });

             this.bindEvents();
             // this.bindEventsInterface();
        },

        // 模板模式 方法
        getData: function(){
            var d = $.Deferred();

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
                    context.data= $.extend(true, [], data);

                    d.resolve();
                },
                error: function(xmlHttpRequest, status, error){
                    alert('控件id：' + context.element.attr('id')+'，ajax获取数据失败!');

                    d.resolve();
                }
            });

            return d.promise();
        },
        parseData: function(data){
            var innerData= $.extend(true, [], data);
            return innerData;
        },
        buildHtml: function(){},
        initElements: function(){
            // var context= this;
            this.elements={
                original: this.element//,
                // view: $('input[type=text]', this.container)
                // getTab: function(levelIndex){
                //     var tabSelector='.t-level-tab-'+levelIndex;
                //     return $(tabSelector, context.container);
                // }
            };
        },
        transferAttributes: function(){},
        bindEvents: function(){
            var context= this;
            var element= this.element;

            // element.on('click', $.proxy(this.onFooClick, this));
        },
        // bindEventsInterface: function(){
        //     var context= this;
        //     var element= this.element;

        //     if(this.settings.onFooSelected){
        //         element.on('click.t.template', $.proxy(this.settings.onFooSelected, this));
        //     }
        // },
        render: function(){},

        // 事件处理
        // onFooClick: function(e, data){
        //     ;
        // },

        // API
        refresh: function(){},
        enable: function(){},
        disable: function(){},
        destroy: function(){}
    });
});