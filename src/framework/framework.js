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
            var value = element.data(attrName);
            data[p] = value || undefined;
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

            var attributes = parseAttributes(element, this.attributeMap);
			this.settings = $.extend(true, {}, this.defaults, attributes, options);
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



// Jx().package("T.UI", function(J){    
//     var emptyFun= function(){};
//     // 静态对象不要在运行时修改.
//     var defaults = {
//         // 选项
//         // fooOption: true,
//         content: '',        // html dom      (content和remote二选一, content 优先)
//         remote: '',         // html dom url  (content和remote二选一, content 优先)
//         // 覆写 类方法
//         // parseData: undefined,
//         // 事件
//         // onFooClick: emptyFun,
//         // onFooChange: function(e, data){}
//     };

//     // 静态对象不要在运行时修改.
//     var attributeMap = {
//         // fooOption: 'foo-option'
//     };

//     // 静态对象不要在运行时修改.
//     var htmlTemplates= {
//         container: '<div Class="t-uibase-container"></div>',
//         content: '<div Class="t-uibase-content"></div>'
//     };

//     var BaseControl= new J.Class({
//         defaults: defaults,             // 默认 options
//         attributeMap: attributeMap,     // html标签属性指令 "data-t-* 属性" 和 "init options" 映射

//         settings: {},       // a options config to a settings
//         data: {},           // 数据
//         value: {},          // 值
//         template: {},       // html模板
//         elements: {},       // dom对象引用
//         observers: {},      // 事件响应

//         init: function(options){
//             // this.initSettings(jqElement, options);
//             this.updateOptions(options);
            
//             var context= this;
//             // $.when(this.getData())
//             //  .done(function(){
//             //     context.render();
//             //  });
//             var d1= $.Deferred();
//             var d2= $.Deferred();
//             $.when(this.getTemplate(d1), this.getData(d2))
//              .done(function(){
//                 context.render();
//              });
//         },

//         // 从服务器上获取html模板
//         getTemplate: function(deferred){
//             if (this.settings.template) {
//                 this.template= this.updateTemplate(template);;
//                 delete this.settings.template;

//                 deferred.resolve();
//                 return deferred.promise();
//             }

//             var context = this;
//             var errorMessage= '控件id：' + context.element.attr('id')+'，ajax获取数据失败!';
//             $.ajax({
//                 dataType: 'json',
//                 url: context.settings.remote,
//                 data: {},
//                 success: function(template){
//                     context.updateTemplate(template);

//                     deferred.resolve();
//                 },
//                 error: function(xmlHttpRequest, status, error){
//                     alert(errorMessage);

//                     deferred.resolve();
//                 }
//             });

//             return deferred.promise();
//         },
//         parseTemplate: function(template){
//             return template;
//         },

//         getData: function(deferred){
//             if (this.settings.data) {
//                 var data = this.settings.data;
//                 this.updateData(data);
//                 delete this.settings.data;

//                 deferred.resolve();
//                 return deferred.promise();
//             }

//             var context = this;
//             $.ajax({
//                 dataType: 'json',
//                 url: context.settings.dataUrl,
//                 data: {},
//                 success: function(data){
//                     var innerData= context.parseData(data);
//                     context.data= innerData;    //$.extend(true, [], innerData);
//                     deferred.resolve();
//                 },
//                 error: function(xmlHttpRequest, status, error){
//                     alert('控件id：' + context.element.attr('id')+'，ajax获取数据失败!');

//                     deferred.resolve();
//                 }
//             });

//             return deferred.promise();
//         },
//         parseData: function(data){
//             // var innerData= $.extend(true, {}, data);
//             // var innerData= $.extend(true, [], data);
//             // return innerData;
//             return data;
//         },

//         getValue: function(){},
//         setValue: function(value){},

//         // 渲染
//         render: function(){
//             // -----------------------------------------------
//             // html
//             // -----------------------------------------------
//             this.buildHtml();
//             this.transferAttributes();
//             this.initElements();
//             this.refresh();
//             // -----------------------------------------------
//             // states
//             // -----------------------------------------------
//             this.initStates();
//             // -----------------------------------------------
//             // events
//             // -----------------------------------------------
//             this.buildObservers();
//             this.bindEvents();
//             this.bindEventsInterface();
//         },

//         // 从htmlTemplates中获取html模板
//         buildHtml: function(){},
        
//         initElements: function(){
//             // var context= this;
//             // this.elements={
//             //     // 获取构建时创建的静态dom对象(buildHtml)
//             //     view: $('input[type=text]', this.container),
//             //     // 获取运行时动态创建的dom对象(getTemplate / getData refresh / render)
//             //     getTab: function(levelIndex){
//             //         var tabSelector='.t-level-tab-'+levelIndex;
//             //         return $(tabSelector, context.container);
//             //     }
//             // };
//         },
//         transferAttributes: function(){},

//         // 初始化内部状态
//         initStates: function(){},

//         // 刷新
//         refresh: function(){},

//         buildObservers: function(){
//             var observers= {
//                 // global
//                 windowResize: function(e){},
//                 documentReady: function(e){},
//                 scrollbar: function(e){},
//                 // mouse
//                 fooClick: function(e){},
//                 fooSelected: function(e){},
//                 // keys
//                 esc: function(e){},
//                 enter: function(e){},
//                 up: function(e){},
//                 // customs
//             };

//             this.observers= observers;
//         },
//         bindEvents: function(){},
//         bindEventsInterface: function(){
//             // this.elements.original.on('click.t.uibase', $.proxy(this.settings.onFooClick, this));
//             // this.elements.original.on('change.t.uibase', $.proxy(this.settings.onFooChange, this));
//         },
//         unbindEvents: function(){
//             // this.elements.original.off('click.t.uibase');
//             // this.elements.original.off('change.t.uibase');
//         },

//         updateOptions: function(options){
//             this.settings= this.parseOptions(options);
//         },
//         overrides: function(){
//             // if(typeof this.settings.parseTemplate !== 'undefined'){
//             //     this.parseTemplate= this.settings.parseTemplate;
//             //     delete this.settings.parseTemplate;
//             // }
//             // if(typeof this.settings.parseData !== 'undefined'){
//             //     this.parseData= this.settings.parseData;
//             //     delete this.settings.parseData;
//             // }
//         },
//         updateData: function(data){
//             this.data= this.parseData(data);
//         },
//         updateTemplate: function(template){
//             this.template= this.parseTemplate(template);
//         },

//         enable: function(){},
//         disable: function(){},

//         show: function(){},
//         hide:  function(){},

//         destroy: function(){
//             // this.container.remove();
//             // this.container = null;
//             // Switch off events
//             this.unbindEvents();

//             // this.elements.original.data('t-plugin-id').remove();
//         }
//     });

//     // var BaseTemplate= new J.Class({
//     //     defaults: {
//     //         parseTemplate: undefined
//     //     },
//     //     // init: function(){},
//     //     parseOptions: function(options){
//     //         this.settings= $.extend(true, {}, this.defaults,  options);
//     //     },
//     //     overrides: function(){
//     //         if(typeof this.settings.parseTemplate !== 'undefined'){
//     //             this.parseTemplate= this.settings.parseTemplate;
//     //             delete this.settings.parseTemplate;
//     //         }
//     //     },
//     //     parseTemplate: function(template){
//     //         return template;
//     //     },
//     //     // destroy: function(){}

//     //     // api (interface)
//     //     getTemplate: function(){
//     //         return this.template;
//     //     }
//     // });

//     // var StaticTemplate= new J.Class({extend : BaseTemplate}, {
//     //     defaults: {
//     //         content: '',
//     //     },
//     //     init: function(){
//     //         this.parseOptions(options);
//     //         this.overrides();
//     //     },
//     //     destroy: function(){},
//     // });

//     // var DynamicTemplate= new J.Class({extend : BaseTemplate}, {
//     //     defaults: {
//     //         remote: ''
//     //     },
//     //     init: function(options){
//     //         this.parseOptions(options);
//     //         this.overrides();
//     //     },
//     //     // 从服务器上获取html模板
//     //     load: function(deferred){
//     //         var context = this;
//     //         var errorMessage= '控件id：' + context.element.attr('id')+'，ajax获取数据失败!';
//     //         $.ajax({
//     //             dataType: 'json',
//     //             url: context.settings.remote,
//     //             data: {},
//     //             success: function(template){
//     //                 context.updateTemplate(template);

//     //                 deferred.resolve();
//     //             },
//     //             error: function(xmlHttpRequest, status, error){
//     //                 alert(errorMessage);

//     //                 deferred.resolve();
//     //             }
//     //         });

//     //         return deferred.promise();
//     //     },
//     //     destroy: function(){}
//     // });


//     // var StaticTemplateControl= new J.Class({});
//     // var StaticDataControl= new J.Class({});    
//     // var DynamicTemplateControl= new J.Class({});
//     // var DynamicDataControl= new J.Class({});
// });