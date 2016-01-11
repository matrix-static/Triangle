/* =============================================================
 * bootstrap3-typeahead.js v3.1.0
 * https://github.com/bassjobsen/Bootstrap-3-Typeahead
 * =============================================================
 * Original written by @mdo and @fat
 * =============================================================
 * Copyright 2014 Bass Jobsen @bassjobsen
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


Jx().package("T.UI.Controls", function(J){
    // 严格模式
    'use strict';

    // 全局变量、函数、对象
    var _currentPluginId = 0;

    var defaults = {
        source: [], 
        items: 8, 
        menu: '<ul class="typeahead dropdown-menu" role="listbox"></ul>',
        item: '<li><a href="#" role="option"></a></li>', 
        minLength: 1, 
        scrollHeight: 0, 
        autoSelect: true, 
        afterSelect: $.noop, 
        addItem: false, 
        delay: 0
    };

    var attributeMap = {
        source: 'source',
        dataUrl: 'data-url'
    };

    this.Typeahead = new J.Class({extend : T.UI.BaseControl}, {
        defaults: defaults,
        attributeMap: attributeMap,

        init: function(element, options){
            this.element = $(element);

            // 区分一个页面中存在多个控件实例
            _currentPluginId += 1;
            this.element.data('plugin-id', _currentPluginId);
            
            //this.container;
            //this.elements;

            // this.value = this.element.val();

            // 初始化选项
            // this.initSettings(options);
            var jqElement=$(element);
            this.initSettings(jqElement, options);

            this.matcher = this.settings.matcher || this.matcher;
            this.sorter = this.settings.sorter || this.sorter;
            this.select = this.settings.select || this.select;
            this.autoSelect = typeof this.settings.autoSelect == 'boolean' ? this.settings.autoSelect : true;
            this.highlighter = this.settings.highlighter || this.highlighter;
            this.render = this.settings.render || this.render;
            this.updater = this.settings.updater || this.updater;
            this.displayText = this.settings.displayText || this.displayText;

            this.source = this.settings.source;
            this.delay = this.settings.delay;

            this.menu = $(this.settings.menu);

            this.appendTo = this.settings.appendTo ? $(this.settings.appendTo) : null;

            this.shown = false;

            this.bindEvents();

            this.showHintOnFocus = typeof this.settings.showHintOnFocus == 'boolean' ? this.settings.showHintOnFocus : false;
            this.afterSelect = this.settings.afterSelect;
            this.addItem = false;


            

            
            // var href= this.element.attr('href');
            // this.settings.remote= !/#/.test(href) && href;

            // // // 初始化数据
            // // this.getData();

            // // 初始化 html DOM 元素
            // this.initElements();

            // // 创建 树型 菜单对象
            // this.pop=new ModalPop(this.elements, this.settings);

            // this.initialized();
        },
        postback: function(){
            if(this.settings.dataUrl.length === 0){
                return;
            }

            var context= this;
            $.ajax({
                dataType: 'json',
                url: context.settings.dataUrl,
                data:{'keyword': context.element.val()},
                success: function(data){
                    context.setSource(data);
                },
                error: function(xmlHttpRequest, status, error){
                    alert('控件id：' + context.element.attr('id')+'，ajax获取数据失败!');
                }
            });
        },
        select: function () {
            var val = this.menu.find('.active').data('value');
            this.element.data('active', val);
            if(this.autoSelect || val) {
                var newVal = this.updater(val);
                this.element
                    .val(this.displayText(newVal) || newVal)
                    .change();
                this.afterSelect(newVal);
            }
            return this.hide();
        },

        updater: function (item) {
            return item;
        },

        setSource: function (source) {
            this.source = source;
        },

        show: function () {
            var pos = $.extend({}, this.element.position(), {
                height: this.element[0].offsetHeight
            }), scrollHeight;

            scrollHeight = typeof this.settings.scrollHeight == 'function' ?
                    this.settings.scrollHeight.call() :
                    this.settings.scrollHeight;

            (this.appendTo ? this.menu.appendTo(this.appendTo) : this.menu.insertAfter(this.element))
                .css({
                    top: pos.top + pos.height + scrollHeight
                , left: pos.left
                })
                .show();

            this.shown = true;
            return this;
        },

        hide: function () {
            this.menu.hide();
            this.shown = false;
            return this;
        },

        lookup: function (query) {
            var items;
            if (typeof(query) != 'undefined' && query !== null) {
                this.query = query;
            } else {
                this.query = this.element.val() ||  '';
            }

            if (this.query.length < this.settings.minLength) {
                return this.shown ? this.hide() : this;
            }

            this.postback();

            var worker = $.proxy(function() {
                
                if($.isFunction(this.source)) this.source(this.query, $.proxy(this.process, this));
                else if (this.source) {
                    this.process(this.source);
                }
            }, this);

            clearTimeout(this.lookupWorker);
            this.lookupWorker = setTimeout(worker, this.delay);
        },

        process: function (items) {
            var context = this;

            items = $.grep(items, function (item) {
                return context.matcher(item);
            });

            items = this.sorter(items);

            if (!items.length && !this.settings.addItem) {
                return this.shown ? this.hide() : this;
            }
            
            if (items.length > 0) {
                this.element.data('active', items[0]);
            } else {
                this.element.data('active', null);
            }
            
            // Add item
            if (this.settings.addItem){
                items.push(this.settings.addItem);
            }

            if (this.settings.items == 'all') {
                return this.render(items).show();
            } else {
                return this.render(items.slice(0, this.settings.items)).show();
            }
        },

        matcher: function (item) {
        var it = this.displayText(item);
            return ~it.toLowerCase().indexOf(this.query.toLowerCase());
        },

        sorter: function (items) {
            var beginswith = []
                , caseSensitive = []
                , caseInsensitive = []
                , item;

            while ((item = items.shift())) {
                var it = this.displayText(item);
                if (!it.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item);
                else if (~it.indexOf(this.query)) caseSensitive.push(item);
                else caseInsensitive.push(item);
            }

            return beginswith.concat(caseSensitive, caseInsensitive);
        },

        highlighter: function (item) {
                    var html = $('<div></div>');
                    var query = this.query;
                    var i = item.toLowerCase().indexOf(query.toLowerCase());
                    var len, leftPart, middlePart, rightPart, strong;
                    len = query.length;
                    if(len === 0){
                            return html.text(item).html();
                    }
                    while (i > -1) {
                            leftPart = item.substr(0, i);
                            middlePart = item.substr(i, len);
                            rightPart = item.substr(i + len);
                            strong = $('<strong></strong>').text(middlePart);
                            html
                                    .append(document.createTextNode(leftPart))
                                    .append(strong);
                            item = rightPart;
                            i = item.toLowerCase().indexOf(query.toLowerCase());
                    }
                    return html.append(document.createTextNode(item)).html();
        },

        render: function (items) {
            var context = this;
            var self = this;
            var activeFound = false;
            items = $(items).map(function (i, item) {
                var text = self.displayText(item);
                i = $(context.settings.item).data('value', item);
                i.find('a').html(context.highlighter(text));
                if (text == self.element.val()) {
                        i.addClass('active');
                        self.element.data('active', item);
                        activeFound = true;
                }
                return i[0];
            });

            if (this.autoSelect && !activeFound) {        
                items.first().addClass('active');
                this.element.data('active', items.first().data('value'));
            }
            this.menu.html(items);
            return this;
        },

        displayText: function(item) {
            return item.name || item;
        },

        next: function (event) {
            var active = this.menu.find('.active').removeClass('active')
                , next = active.next();

            if (!next.length) {
                next = $(this.menu.find('li')[0]);
            }

            next.addClass('active');
        },

        prev: function (event) {
            var active = this.menu.find('.active').removeClass('active')
                , prev = active.prev();

            if (!prev.length) {
                prev = this.menu.find('li').last();
            }

            prev.addClass('active');
        },

        bindEvents: function () {
            this.element
                .on('focus',    $.proxy(this.focus, this))
                .on('blur',     $.proxy(this.blur, this))
                .on('keypress', $.proxy(this.keypress, this))
                .on('keyup',    $.proxy(this.keyup, this));

            if (this.eventSupported('keydown')) {
                this.element.on('keydown', $.proxy(this.keydown, this));
            }

            this.menu
                .on('click', $.proxy(this.click, this))
                .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
                .on('mouseleave', 'li', $.proxy(this.mouseleave, this));
        },
        
        destroy : function () {
            this.element.data('typeahead',null);
            this.element.data('active',null);
            this.element
                .off('focus')
                .off('blur')
                .off('keypress')
                .off('keyup');

            if (this.eventSupported('keydown')) {
                this.element.off('keydown');
            }

            this.menu.remove();
        },
        
        eventSupported: function(eventName) {
            var isSupported = eventName in this.element;
            if (!isSupported) {
                this.element.setAttribute(eventName, 'return;');
                isSupported = typeof this.element[eventName] === 'function';
            }
            return isSupported;
        },

        move: function (e) {
            if (!this.shown) return;

            switch(e.keyCode) {
                case 9: // tab
                case 13: // enter
                case 27: // escape
                    e.preventDefault();
                    break;

                case 38: // up arrow
                    // with the shiftKey (this is actually the left parenthesis)
                    if (e.shiftKey) return;
                    e.preventDefault();
                    this.prev();
                    break;

                case 40: // down arrow
                    // with the shiftKey (this is actually the right parenthesis)
                    if (e.shiftKey) return;
                    e.preventDefault();
                    this.next();
                    break;
            }

            e.stopPropagation();
        },

        keydown: function (e) {
            this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27]);
            if (!this.shown && e.keyCode == 40) {
                this.lookup();
            } else {
                this.move(e);
            }
        },

        keypress: function (e) {
            if (this.suppressKeyPressRepeat) return;
            this.move(e);
        },

        keyup: function (e) {
            switch(e.keyCode) {
                case 40: // down arrow
                case 38: // up arrow
                case 16: // shift
                case 17: // ctrl
                case 18: // alt
                    break;

                case 9: // tab
                case 13: // enter
                    if (!this.shown) return;
                    this.select();
                    break;

                case 27: // escape
                    if (!this.shown) return;
                    this.hide();
                    break;
                default:
                    this.lookup();
            }

            e.stopPropagation();
            e.preventDefault();
        },

        focus: function (e) {
            if (!this.focused) {
                this.focused = true;
                if (this.settings.showHintOnFocus) {
                    this.lookup('');
                }
            }
        },

        blur: function (e) {
            this.focused = false;
            if (!this.mousedover && this.shown) this.hide();
        },

        click: function (e) {
            e.stopPropagation();
            e.preventDefault();
            this.select();
            this.element.focus();
        },

        mouseenter: function (e) {
            this.mousedover = true;
            this.menu.find('.active').removeClass('active');
            $(e.currentTarget).addClass('active');
        },

        mouseleave: function (e) {
            this.mousedover = false;
            if (!this.focused && this.shown) this.hide();
        },

        refresh: function(){
            var value= this.element.val();
            this.element.data('active', value);
            if(this.autoSelect || value) {
                var newValue = this.updater(value);
                this.element
                    .val(this.displayText(newValue) || newValue)
                    .change();
                this.afterSelect(newValue);
            }
            return this.hide();
        }
    });
});