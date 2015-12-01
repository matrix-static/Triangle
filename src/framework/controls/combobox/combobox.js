/* combobox javascript jQuery */
 
/* =============================================================
 * bootstrap-combobox.js v1.1.6
 * =============================================================
 * Copyright 2012 Daniel Farrell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */
Jx().package("T.UI.Controls", function(J){
    // 严格模式
    'use strict';

    var _crrentPluginId = 0;
    var defaults = {
        // 选项
        // 覆写 类方法
        // parseData: undefined,
        // 事件
        // onFooSelected: undefined,
        // onFooChange: function(e, data){}
    };
    var attributeMap = {
        // fooOption: 'foo-option'
    };

    this.Combobox = new J.Class({extend: T.UI.BaseControl},{
        defaults: defaults,
        attributeMap: attributeMap,

        settings: {},
        value: '',
        data: {},
        templates: {
            // menu: '<ul class="typeahead typeahead-long dropdown-menu"></ul>',
            item: '<li><a href="#"></a></li>'
        },

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
            this.matcher = this.settings.matcher || this.matcher;
            this.sorter = this.settings.sorter || this.sorter;
            this.highlighter = this.settings.highlighter || this.highlighter;
            this.shown = false;
            this.selected = false;

            this.buildHtml();
            this.initElements();

            // this.refresh();
            this.source = this.parse();
            this.settings.items = this.source.length;

            this.transferAttributes();

            this.bindEvents();
             // this.bindEventsInterface();
        },
        parse: function() {
            var that = this,
                map = {},
                source = [],
                selected = false,
                selectedValue = '';
            this.element.find('option').each(function() {
                var option = $(this);
                if (option.val() === '') {
                    that.settings.placeholder = option.text();
                    return;
                }
                map[option.text()] = option.val();
                source.push(option.text());
                if (option.prop('selected')) {
                    selected = option.text();
                    selectedValue = option.val();
                }

            })
            this.map = map;
            if (selected) {
                this.elements.input.val(selected);
                // this.elements.target.val(selectedValue);
                this.elements.original.val(selectedValue);
                this.container.addClass('combobox-selected');
                this.selected = true;
            }
            return source;
        },
        select: function() {
            var val = this.elements.menu.find('.active').attr('data-value');
            this.elements.input.val(this.updater(val)).trigger('change');
            // this.elements.target.val(this.map[val]).trigger('change');
            this.element.val(this.map[val]).trigger('change');
            this.container.addClass('combobox-selected');
            this.selected = true;
            return this.hide();
        },
        updater: function(item) {
            return item;
        },
        show: function() {
            var pos = $.extend({},
            this.elements.input.position(), {
                height: this.elements.input[0].offsetHeight

            });

            this.elements.menu
                .insertAfter(this.elements.input)
                .css({
                    top: pos.top + pos.height
                    ,
                    left: pos.left

                })
                .show();

            $('.dropdown-menu').on('mousedown', $.proxy(this.scrollSafety, this));

            this.shown = true;
            return this;
        },
        hide: function() {
            this.elements.menu.hide();
            $('.dropdown-menu').off('mousedown', $.proxy(this.scrollSafety, this));
            this.elements.input.on('blur', $.proxy(this.blur, this));
            this.shown = false;
            return this;
        },
        lookup: function(event) {
            this.query = this.elements.input.val();
            return this.process(this.source);
        },
        process: function(items) {
            var that = this;

            items = $.grep(items, 
            function(item) {
                return that.matcher(item);

            })

            items = this.sorter(items);

            if (!items.length) {
                return this.shown ? this.hide() : this;

            }

            return this.render(items.slice(0, this.settings.items)).show();
        },
        matcher: function(item) {
            return ~item.toLowerCase().indexOf(this.query.toLowerCase());
        },
        sorter: function(items) {
            var beginswith = [],
                caseSensitive = [],
                caseInsensitive = [],
                item;

            while (item = items.shift()) {
                if (!item.toLowerCase().indexOf(this.query.toLowerCase())) {
                    beginswith.push(item);
                }
                else if (~item.indexOf(this.query)) {
                    caseSensitive.push(item);
                }
                else {
                    caseInsensitive.push(item);
                }

            }

            return beginswith.concat(caseSensitive, caseInsensitive);
        },
        highlighter: function(item) {
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
            return item.replace(new RegExp('(' + query + ')', 'ig'), 
            function($1, match) {
                return '<strong>' + match + '</strong>';
            })
        },
        render: function(items) {
            var that = this;

            items = $(items).map(function(i, item) {
                i = $(that.templates.item).attr('data-value', item);
                i.find('a').html(that.highlighter(item));
                return i[0];
            })

            items.first().addClass('active');
            this.elements.menu.html(items);
            return this;
        },
        next: function(event) {
            var active = this.elements.menu.find('.active').removeClass('active'),
                next = active.next();

            if (!next.length) {
                next = $(this.elements.menu.find('li')[0]);

            }

            next.addClass('active');
        },
        prev: function(event) {
            var active = this.elements.menu.find('.active').removeClass('active'),
                prev = active.prev();

            if (!prev.length) {
                prev = this.elements.menu.find('li').last();

            }

            prev.addClass('active');
        },
        toggle: function() {
            if (!this.disabled) {
                if (this.container.hasClass('combobox-selected')) {
                    this.clearTarget();
                    this.triggerChange();
                    this.clearElement();

                } else {
                    if (this.shown) {
                        this.hide();

                    } else {
                        this.clearElement();
                        this.lookup();

                    }
                }
            }
        },
        scrollSafety: function(e) {
            if (e.target.tagName == 'UL') {
                this.elements.input.off('blur');
            }
        },
        clearElement: function() {
            this.elements.input.val('').focus();
        },
        clearTarget: function() {
            this.element.val('');
            // this.elements.target.val('');
            this.container.removeClass('combobox-selected');
            this.selected = false;
        },
        triggerChange: function() {
            this.element.trigger('change');
        },        
        eventSupported: function(eventName) {
            var isSupported = eventName in this.elements.input;
            if (!isSupported) {
                this.elements.input.setAttribute(eventName, 'return;');
                isSupported = typeof this.elements.input[eventName] === 'function';

            }
            return isSupported;
        },
        move: function(e) {
            if (!this.shown) {
                return;
            }

            switch (e.keyCode) {
                case 9:
                // tab
            case 13:
                // enter
            case 27:
                // escape
                e.preventDefault();
                break;

                case 38:
                // up arrow
                e.preventDefault();
                this.prev();
                break;

                case 40:
                // down arrow
                e.preventDefault();
                this.next();
                break;

            }

            e.stopPropagation();
        },
        keydown: function(e) {
            this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40, 38, 9, 13, 27]);
            this.move(e);
        },
        keypress: function(e) {
            if (this.suppressKeyPressRepeat) {
                return;
            }
            this.move(e);
        },
        keyup: function(e) {
            switch (e.keyCode) {
                case 40:
                // down arrow
            case 39:
                // right arrow
            case 38:
                // up arrow
            case 37:
                // left arrow
            case 36:
                // home
            case 35:
                // end
            case 16:
                // shift
            case 17:
                // ctrl
            case 18:
                // alt
                break;

                case 9:
                // tab
            case 13:
                // enter
                if (!this.shown) {
                    return;
                }
                this.select();
                break;

                case 27:
                // escape
                if (!this.shown) {
                    return;
                }
                this.hide();
                break;

                default:
                this.clearTarget();
                this.lookup();

            }

            e.stopPropagation();
            e.preventDefault();
        },
        focus: function(e) {
            this.focused = true;
        },
        blur: function(e) {
            var that = this;
            this.focused = false;
            var val = this.elements.input.val();
            if (!this.selected && val !== '') {
                this.elements.input.val('');
                this.element.val('').trigger('change');
                // this.elements.target.val('').trigger('change');

            }
            if (!this.mousedover && this.shown) {
                setTimeout(function() {
                    that.hide();
                },
                200);
            }
        },
        click: function(e) {
            e.stopPropagation();
            e.preventDefault();
            this.select();
            this.elements.input.focus();
        },
        mouseenter: function(e) {
            this.mousedover = true;
            this.elements.menu.find('.active').removeClass('active');
            $(e.currentTarget).addClass('active');
        },
        mouseleave: function(e) {
            this.mousedover = false;
        },
        buildHtml: function(){
            var template= ''+
                '<div class="combobox-container"> '+
                // '    <input type="hidden" /> '+
                '    <div class="input-group"> '+
                '       <input type="text" autocomplete="off" /> '+
                '       <span class="input-group-addon dropdown-toggle" data-dropdown="dropdown"> '+
                '       <span class="caret" /> '+
                '       <span class="glyphicon glyphicon-remove" /> </span> '+
                '    </div> '+
                '</div>';
            this.container= $(template);

            // menu: '<ul class="typeahead typeahead-long dropdown-menu"></ul>',
            // item: '<li><a href="#"></a></li>'
            

            // var combobox = $(this.template());            
            // return combobox;
        },
        initElements: function(){
            // var context= this;

            var menuTemplate= '<ul class="typeahead typeahead-long dropdown-menu"></ul>';
            // $(this.settings.menu).appendTo('body')
            var jqMenu= $(menuTemplate).appendTo('body');

            this.elements={
                original: this.element,
                input: $('input[type=text]', this.container),
                // target: $('input[type=hidden]', this.container),
                button: $('.dropdown-toggle', this.container),
                menu: jqMenu
                // view: $('input[type=text]', this.container)
                // getTab: function(levelIndex){
                //     var tabSelector='.t-level-tab-'+levelIndex;
                //     return $(tabSelector, context.container);
                // }
            };

            // this.$element = this.container.find('input[type=text]');

            this.element.before(this.container);
            this.element.hide();
        },
        bindEvents: function(){
            var context= this;
            var element= this.element;

            this.elements.input
                .on('focus', $.proxy(this.focus, this))
                .on('blur', $.proxy(this.blur, this))
                .on('keypress', $.proxy(this.keypress, this))
                .on('keyup', $.proxy(this.keyup, this));

            if (this.eventSupported('keydown')) {
                this.elements.input.on('keydown', $.proxy(this.keydown, this));

            }

            this.elements.menu
                .on('click', $.proxy(this.click, this))
                .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
                .on('mouseleave', 'li', $.proxy(this.mouseleave, this));

            this.elements.button
                .on('click', $.proxy(this.toggle, this));
            // element.on('click', $.proxy(this.onFooClick, this));
        },
        // bindEventsInterface: function(){
        //     var context= this;
        //     var element= this.element;

        //     if(this.settings.onFooSelected){
        //         element.on('click.t.template', $.proxy(this.settings.onFooSelected, this));
        //     }
        // },
        // render: function(){},

        // 事件处理
        // onFooClick: function(e, data){
        //     ;
        // },
        transferAttributes: function() {
            this.settings.placeholder = this.element.attr('data-placeholder') || this.settings.placeholder
            this.elements.input.attr('placeholder', this.settings.placeholder)
            // this.elements.target.prop('name', this.element.prop('name'))
            // this.elements.target.val(this.element.val())
            this.element.removeAttr('name')
            // Remove from source otherwise form will pass parameter twice.
            this.elements.input.attr('required', this.element.attr('required'))
            this.elements.input.attr('rel', this.element.attr('rel'))
            this.elements.input.attr('title', this.element.attr('title'))
            this.elements.input.attr('class', this.element.attr('class'))
            this.elements.input.attr('tabindex', this.element.attr('tabindex'))
            this.element.removeAttr('tabindex')
            if (this.element.attr('disabled') !== undefined){
                this.disable();
            }
        },

        // API
        refresh: function() {
            var value= this.elements.original.val();
            this.elements.input.val(this.updater(value));//.trigger('change');
            // this.elements.target.val(this.map[value]);//.trigger('change');
            // this.element.val(this.map[value]);//.trigger('change');
            this.container.addClass('combobox-selected');
            this.selected = true;
            return this.hide();
        },
        // setValue: function(value){
        //     this.elements.original.val(value);
        //     this.refresh();
        // },
        enable: function() {
            this.elements.input.prop('disabled', false);
            this.elements.button.attr('disabled', false);
            this.disabled = false;
            this.container.removeClass('combobox-disabled');

        },
        disable: function() {
            this.elements.input.prop('disabled', true);
            this.elements.button.attr('disabled', true);
            this.disabled = true;
            this.container.addClass('combobox-disabled');

        },        
        destroy: function(){}
    });
});