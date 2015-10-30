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
            //this.initElements();
            //this.transferAttributes();

            // 绑定事件
            this.bindEvents();
            // 绑定事件接口
            this.bindEventsInterface();

        },
        buildHtml:function () {

            var template = ''
            + '<div class="address-container">' 
            + '    <input type="hidden" />' 
            + '    <input type="text" autocomplete="off" />'
            + '</div>';

            this.container = $(template);
            this.element.before(this.container);
            this.element.hide();

            this.elements = {
                target: $('input[type=hidden]', this.container),
                view: $('input[type=text]', this.container),
                menu: $('<div class="dropdown-menu">'+
                    '<div class="content">' +
                        '<div class="m JD-stock" id="JD-stock" data-widget="tabs"><div class="mt">' +
                        '<ul class="tab">        <li class="curr" data-widget="tab-item" data-index="0"><a class="hover" href="#none"><em>湖南</em><i></i></a></li>        <li data-widget="tab-item" data-index="1"><a title="益阳市" href="#none"><em>益阳市</em><i></i></a></li>        <li style="display: list-item;" data-widget="tab-item" data-index="2"><a title="桃江县" href="#none"><em>桃江县</em><i></i></a></li>        <li style="display: none;" data-widget="tab-item" data-index="3"><a href="#none"><em>请选择</em><i></i></a></li>    </ul>    <div class="stock-line"></div></div><div class="mc" id="stock_province_item" style="display: block;" data-widget="tab-content" data-area="0">    <ul class="area-list">       <li><a href="#none" data-value="1">北京</a></li><li><a href="#none" data-value="2">上海</a></li><li><a href="#none" data-value="3">天津</a></li><li><a href="#none" data-value="4">重庆</a></li><li><a href="#none" data-value="5">河北</a></li><li><a href="#none" data-value="6">山西</a></li><li><a href="#none" data-value="7">河南</a></li><li><a href="#none" data-value="8">辽宁</a></li><li><a href="#none" data-value="9">吉林</a></li><li><a href="#none" data-value="10">黑龙江</a></li><li><a href="#none" data-value="11">内蒙古</a></li><li><a href="#none" data-value="12">江苏</a></li><li><a href="#none" data-value="13">山东</a></li><li><a href="#none" data-value="14">安徽</a></li><li><a href="#none" data-value="15">浙江</a></li><li><a href="#none" data-value="16">福建</a></li><li><a href="#none" data-value="17">湖北</a></li><li><a href="#none" data-value="18">湖南</a></li><li><a href="#none" data-value="19">广东</a></li><li><a href="#none" data-value="20">广西</a></li><li><a href="#none" data-value="21">江西</a></li><li><a href="#none" data-value="22">四川</a></li><li><a href="#none" data-value="23">海南</a></li><li><a href="#none" data-value="24">贵州</a></li><li><a href="#none" data-value="25">云南</a></li><li><a href="#none" data-value="26">西藏</a></li><li><a href="#none" data-value="27">陕西</a></li><li><a href="#none" data-value="28">甘肃</a></li><li><a href="#none" data-value="29">青海</a></li><li><a href="#none" data-value="30">宁夏</a></li><li><a href="#none" data-value="31">新疆</a></li><li><a href="#none" data-value="32">台湾</a></li><li><a href="#none" data-value="42">香港</a></li><li><a href="#none" data-value="43">澳门</a></li><li><a href="#none" data-value="84">钓鱼岛</a></li>    </ul></div><div class="mc" id="stock_city_item" style="display: none;" data-widget="tab-content" data-area="1"><ul class="area-list"><li><a href="#none" data-value="1482">长沙市</a></li><li><a href="#none" data-value="1488">株洲市</a></li><li><a href="#none" data-value="1495">湘潭市</a></li><li><a href="#none" data-value="1499">韶山市</a></li><li><a href="#none" data-value="1501">衡阳市</a></li><li><a href="#none" data-value="1511">邵阳市</a></li><li><a href="#none" data-value="1522">岳阳市</a></li><li><a href="#none" data-value="1530">常德市</a></li><li><a href="#none" data-value="1540">张家界市</a></li><li><a href="#none" data-value="1544">郴州市</a></li><li><a href="#none" data-value="1555">益阳市</a></li><li><a href="#none" data-value="1560">永州市</a></li><li><a href="#none" data-value="1574">怀化市</a></li><li><a href="#none" data-value="1586">娄底市</a></li><li><a href="#none" data-value="1592">湘西州</a></li></ul></div><div class="mc" id="stock_area_item" style="display: none;" data-widget="tab-content" data-area="2"><ul class="area-list"><li><a href="#none" data-value="1556">南县</a></li><li><a href="#none" data-value="1557">桃江县</a></li><li><a href="#none" data-value="1558">安化县</a></li><li><a href="#none" data-value="1565">沅江市</a></li><li><a href="#none" data-value="29463">赫山区</a></li><li><a href="#none" data-value="29464">资阳区</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '<div class="mc" id="stock_town_item" style="display: none;" data-widget="tab-content" data-area="3"></div></div><span class="clr"></span>' +
                    '</div>' +
                    +'</div>').appendTo('body')
            };

            // transferAttributes
            //this.options.placeholder = this.$source.attr('data-placeholder') || this.options.placeholder
            //this.$element.attr('placeholder', this.options.placeholder)
            this.elements.target.prop('name', this.element.prop('name'))
            this.elements.target.val(this.element.val())
            this.element.removeAttr('name')  // Remove from source otherwise form will pass parameter twice.
            this.elements.view.attr('required', this.element.attr('required'))
            this.elements.view.attr('rel', this.element.attr('rel'))
            this.elements.view.attr('title', this.element.attr('title'))
            this.elements.view.attr('class', this.element.attr('class'))
            this.elements.view.attr('tabindex', this.element.attr('tabindex'))
            this.element.removeAttr('tabindex')
            //if (this.element.attr('disabled')!==undefined)
            //    this.disable();


        },
        //initElements:function () {},
        bindEvents:function () {
            var context=this;

            var element=this.element;
            var elements=this.elements;

            element.on('keydown', function(e) {
                ;
            });

            /*elements.up.on('keyup', function(ev) {
                ;
            });*/

            elements.view
                .on('focus',    $.proxy(this.show, this))
                .on('blur',     $.proxy(this.hide, this))
                //.on('click', $.proxy(this.toggle, this));

              /*
              if (this.eventSupported('keydown')) {
                this.$element.on('keydown', $.proxy(this.keydown, this));
              }
              this.$menu
                .on('click', $.proxy(this.click, this))
                .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
                .on('mouseleave', 'li', $.proxy(this.mouseleave, this));*/
                

        },
        bindEventsInterface:function () {
            var context=this;
            var element=this.element;

            element.on('address.foo', function() {
                context.foo();
                foo();
            });
        },
        show: function () {
            var pos = $.extend({}, this.elements.view.position(), {
                height: this.elements.view[0].offsetHeight
            });

            this.elements.menu
            .insertAfter(this.elements.view)
            .css({
                top: pos.top + pos.height, 
                left: pos.left
            })
            .show();
        },
        hide: function(){
            this.elements.menu.hide();
        }
    });

});




/* address javascript jQuery */

(function($) {
    // 严格模式
    'use strict';

    // 控件类名
    var pluginName = "address";

        // 胶水代码
    $.fn[pluginName] = function(options) {

        this.each(function () {
            var jElement = $(this);
            if (jElement.data(pluginName)) {
                jElement.data(pluginName).remove();
            }
            jElement.data(pluginName, new T.UI.Controls.Address(this, options));
        });

        return this;

    };

})(jQuery);