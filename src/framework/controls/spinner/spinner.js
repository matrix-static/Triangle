Jx().package("T.UI.Controls", function(J){

    // 严格模式
    'use strict';


    // 全局变量、函数、对象
    var _currentPluginId = 0;

    function _scopedEventName(name, id) {
        return name + '.touchspin_' + id;
    }

    function _scopeEventNames(names, id) {
        return $.map(names, function(name) {
            return _scopedEventName(name, id);
        });
    }

    var defaults = {
        min: 0,
        max: 100,
        initval: '',
        step: 1,
        decimals: 0,
        stepinterval: 100,
        forcestepdivisibility: 'round', // none | floor | round | ceil
        stepintervaldelay: 500,
        verticalbuttons: false,
        verticalupclass: 'glyphicon glyphicon-chevron-up',
        verticaldownclass: 'glyphicon glyphicon-chevron-down',
        prefix: '',
        postfix: '',
        prefix_extraclass: '',
        postfix_extraclass: '',
        booster: true,
        boostat: 10,
        maxboostedstep: false,
        mousewheel: true,
        buttondown_class: 'btn btn-default',
        buttonup_class: 'btn btn-default'
    };

    var attributeMap = {
        min: 'min',
        max: 'max',
        initval: 'init-val',
        step: 'step',
        decimals: 'decimals',
        stepinterval: 'step-interval',
        verticalbuttons: 'vertical-buttons',
        verticalupclass: 'vertical-up-class',
        verticaldownclass: 'vertical-down-class',
        forcestepdivisibility: 'force-step-divisibility',
        stepintervaldelay: 'step-interval-delay',
        prefix: 'prefix',
        postfix: 'postfix',
        prefix_extraclass: 'prefix-extra-class',
        postfix_extraclass: 'postfix-extra-class',
        booster: 'booster',
        boostat: 'boostat',
        maxboostedstep: 'max-boosted-step',
        mousewheel: 'mouse-wheel',
        buttondown_class: 'button-down-class',
        buttonup_class: 'button-up-class'
    };

    this.Spinner = new J.Class({extend : T.UI.BaseControl}, {
        defaults : defaults,
        attributeMap : attributeMap,
        // 构造函数
        init:function(element, options){
            if (options === 'destroy') {
                this.each(function() {
                    var element = $(this),
                    element_data = element.data();
                    $(document).off(_scopeEventNames([
                    'mouseup',
                    'touchend',
                    'touchcancel',
                    'mousemove',
                    'touchmove',
                    'scroll',
                    'scrollstart'], element_data.pluginId).join(' '));
                });
                return;
            }

            this.element = $(element);
            //this.settings,
            this.element_data = this.element.data();

            this.container;
            this.elements;

            this.value;

            this.downSpinTimer;
            this.upSpinTimer;
            this.downDelayTimeout;
            this.upDelayTimeout;
            this.spincount = 0;
            this.spinning = false;

            if (!this.element.is('input')) {
                console.log('Must be an input.');
                return;
            }

            if (this.element.data('alreadyinitialized')) {
                return;
            }
            this.element.data('alreadyinitialized', true);
            _currentPluginId += 1;
            this.element.data('pluginId', _currentPluginId);      

            // 初始化选项
            this.initSettings(options);
            // 设置初始值
            if (this.settings.initval !== '' && this.element.val() === '') {
                this.element.val(this.settings.initval);
            }
            // 校验值是否合法
            this._checkValue();
            // 构建html DOM
            this.buildHtml();
            // 初始化 html DOM 元素
            this._initElements();
            // 隐藏空的前后缀
            this._hideEmptyPrefixPostfix();
            // 绑定事件
            this._bindEvents();
            // 绑定事件接口
            this._bindEventsInterface();
            // ...
            this.elements.input.css('display', 'block');
        },

        changeSettings:function(newsettings) {
            this._updateSettings(newsettings);
            this._checkValue();

            var value = elements.input.val();

            if (value !== '') {
                value = Number(elements.input.val());
                elements.input.val(value.toFixed(this.settings.decimals));
            }
        },

        _updateSettings:function (newsettings) {
            this.settings = $.extend({}, settings, newsettings);
        },

        buildHtml:function () {
            var initval = this.element.val(),
                parentelement = this.element.parent();

            if (initval !== '') {
                initval = Number(initval).toFixed(this.settings.decimals);
            }

            this.element.data('initvalue', initval).val(initval);
            this.element.addClass('form-control');

            if (parentelement.hasClass('input-group')) {
                this._advanceInputGroup(parentelement);
            }
            else {
                this._buildInputGroup();
            }
        },

        _advanceInputGroup:function (parentelement) {
            parentelement.addClass('bootstrap-spinner');

            var prev = this.element.prev(),
                next = this.element.next();

            var downhtml,
                uphtml,
                prefixhtml = '<span class="input-group-addon bootstrap-spinner-prefix">' + this.settings.prefix + '</span>',
                postfixhtml = '<span class="input-group-addon bootstrap-spinner-postfix">' + this.settings.postfix + '</span>';

            if (prev.hasClass('input-group-btn')) {
                downhtml = '<button class="' + this.settings.buttondown_class + ' bootstrap-spinner-down" type="button">-</button>';
                prev.append(downhtml);
            }
            else {
                downhtml = '<span class="input-group-btn"><button class="' + this.settings.buttondown_class + ' bootstrap-spinner-down" type="button">-</button></span>';
                $(downhtml).insertBefore(this.element);
            }

            if (next.hasClass('input-group-btn')) {
                uphtml = '<button class="' + this.settings.buttonup_class + ' bootstrap-spinner-up" type="button">+</button>';
                next.prepend(uphtml);
            }
            else {
                uphtml = '<span class="input-group-btn"><button class="' + this.settings.buttonup_class + ' bootstrap-spinner-up" type="button">+</button></span>';
                $(uphtml).insertAfter(this.element);
            }

            $(prefixhtml).insertBefore(this.element);
            $(postfixhtml).insertAfter(this.element);

            this.container = parentelement;
        },

        _buildInputGroup:function () {
            var html;

            if (this.settings.verticalbuttons) {
                html = '<div class="input-group bootstrap-spinner"><span class="input-group-addon bootstrap-spinner-prefix">' + this.settings.prefix + '</span><span class="input-group-addon bootstrap-spinner-postfix">' + this.settings.postfix + '</span><span class="input-group-btn-vertical"><button class="' + this.settings.buttondown_class + ' bootstrap-spinner-up" type="button"><i class="' + this.settings.verticalupclass + '"></i></button><button class="' + this.settings.buttonup_class + ' bootstrap-spinner-down" type="button"><i class="' + this.settings.verticaldownclass + '"></i></button></span></div>';
            }
            else {
                html = '<div class="input-group bootstrap-spinner"><span class="input-group-btn"><button class="' + this.settings.buttondown_class + ' bootstrap-spinner-down" type="button">-</button></span><span class="input-group-addon bootstrap-spinner-prefix">' + this.settings.prefix + '</span><span class="input-group-addon bootstrap-spinner-postfix">' + this.settings.postfix + '</span><span class="input-group-btn"><button class="' + this.settings.buttonup_class + ' bootstrap-spinner-up" type="button">+</button></span></div>';
            }

            this.container = $(html).insertBefore(this.element);

            $('.bootstrap-spinner-prefix', this.container).after(this.element);

            if (this.element.hasClass('input-sm')) {
                this.container.addClass('input-group-sm');
            }
            else if (this.element.hasClass('input-lg')) {
                this.container.addClass('input-group-lg');
            }
        },

        _initElements:function () {
            this.elements = {
                down: $('.bootstrap-spinner-down', this.container),
                up: $('.bootstrap-spinner-up', this.container),
                input: $('input', this.container),
                prefix: $('.bootstrap-spinner-prefix', this.container).addClass(this.settings.prefix_extraclass),
                postfix: $('.bootstrap-spinner-postfix', this.container).addClass(this.settings.postfix_extraclass)
            };
        },

        _hideEmptyPrefixPostfix:function () {
            if (this.settings.prefix === '') {
                this.elements.prefix.hide();
            }

            if (this.settings.postfix === '') {
                this.elements.postfix.hide();
            }
        },

        _bindEvents:function () {
            var context=this;

            var element=this.element;
            var elements=this.elements;

            element.on('keydown', function(ev) {
                var code = ev.keyCode || ev.which;

                if (code === 38) {
                    if (context.spinning !== 'up') {
                        upOnce();
                        startUpSpin();
                    }
                    ev.preventDefault();
                }
                else if (code === 40) {
                    if (context.spinning !== 'down') {
                        downOnce();
                        startDownSpin();
                    }
                    ev.preventDefault();
                }
            });

            element.on('keyup', function(ev) {
                var code = ev.keyCode || ev.which;

                if (code === 38) {
                    context.stopSpin();
                }
                else if (code === 40) {
                    context.stopSpin();
                }
            });

            element.on('blur', function() {
                context._checkValue();
            });

            elements.down.on('keydown', function(ev) {
                var code = ev.keyCode || ev.which;

                if (code === 32 || code === 13) {
                    if (context.spinning !== 'down') {
                        context.downOnce();
                        context.startDownSpin();
                    }
                    ev.preventDefault();
                }
            });

            elements.down.on('keyup', function(ev) {
                var code = ev.keyCode || ev.which;

                if (code === 32 || code === 13) {
                    context.stopSpin();
                }
            });

            elements.up.on('keydown', function(ev) {
                var code = ev.keyCode || ev.which;

                if (code === 32 || code === 13) {
                    if (context.spinning !== 'up') {
                        context.upOnce();
                        context.startUpSpin();
                    }
                    ev.preventDefault();
                }
            });

            elements.up.on('keyup', function(ev) {
                var code = ev.keyCode || ev.which;

                if (code === 32 || code === 13) {
                    context.stopSpin();
                }
            });

            elements.down.on('mousedown.spinner', function(ev) {
                elements.down.off('touchstart.spinner');  // android 4 workaround

                if (element.is(':disabled')) {
                    return;
                }

                context.downOnce();
                context.startDownSpin();

                ev.preventDefault();
                ev.stopPropagation();
            });

            elements.down.on('touchstart.spinner', function(ev) {
                elements.down.off('mousedown.spinner');  // android 4 workaround

                if (element.is(':disabled')) {
                    return;
                }

                context.downOnce();
                context.startDownSpin();

                ev.preventDefault();
                ev.stopPropagation();
            });

            elements.up.on('mousedown.spinner', function(ev) {
                elements.up.off('touchstart.spinner');  // android 4 workaround

                if (element.is(':disabled')) {
                    return;
                }

                context.upOnce();
                context.startUpSpin();

                ev.preventDefault();
                ev.stopPropagation();
            });

            elements.up.on('touchstart.spinner', function(ev) {
                elements.up.off('mousedown.spinner');  // android 4 workaround

                if (element.is(':disabled')) {
                    return;
                }

                context.upOnce();
                context.startUpSpin();

                ev.preventDefault();
                ev.stopPropagation();
            });

            elements.up.on('mouseout touchleave touchend touchcancel', function(ev) {
                if (!context.spinning) {
                    return;
                }

                ev.stopPropagation();
                context.stopSpin();
            });

            elements.down.on('mouseout touchleave touchend touchcancel', function(ev) {
                if (!context.spinning) {
                    return;
                }

                ev.stopPropagation();
                context.stopSpin();
            });

            elements.down.on('mousemove touchmove', function(ev) {
                if (!context.spinning) {
                    return;
                }

                ev.stopPropagation();
                ev.preventDefault();
            });

            elements.up.on('mousemove touchmove', function(ev) {
                if (!context.spinning) {
                    return;
                }

                ev.stopPropagation();
                ev.preventDefault();
            });

            $(document).on(_scopeEventNames(['mouseup', 'touchend', 'touchcancel'], _currentPluginId).join(' '), function(ev) {
                if (!context.spinning) {
                    return;
                }

                ev.preventDefault();
                context.stopSpin();
            });

            $(document).on(_scopeEventNames(['mousemove', 'touchmove', 'scroll', 'scrollstart'], _currentPluginId).join(' '), function(ev) {
                if (!context.spinning) {
                    return;
                }

                ev.preventDefault();
                context.stopSpin();
            });

            element.on('mousewheel DOMMouseScroll', function(ev) {
                if (!context.settings.mousewheel || !context.element.is(':focus')) {
                    return;
                }

                var delta = ev.originalEvent.wheelDelta || -ev.originalEvent.deltaY || -ev.originalEvent.detail;

                ev.stopPropagation();
                ev.preventDefault();

                if (delta < 0) {
                    context.downOnce();
                }
                else {
                    context.upOnce();
                }
            });
        },

        _bindEventsInterface:function () {
            var context=this;
            var element=this.element;

            element.on('spinner.uponce', function() {
                context.stopSpin();
                context.upOnce();
            });

            element.on('spinner.downonce', function() {
                context.stopSpin();
                context.downOnce();
            });

            element.on('spinner.startupspin', function() {
                context.startUpSpin();
            });

            element.on('spinner.startdownspin', function() {
                context.startDownSpin();
            });

            element.on('spinner.stopspin', function() {
                context.stopSpin();
            });

            element.on('spinner.updatesettings', function(e, newsettings) {
                context.changeSettings(newsettings);
            });
        },

        _forcestepdivisibility: function (value) {
            var settings=this.settings;
            switch (settings.forcestepdivisibility) {
            case 'round':
                return (Math.round(value / settings.step) * settings.step).toFixed(settings.decimals);
            case 'floor':
                return (Math.floor(value / settings.step) * settings.step).toFixed(settings.decimals);
            case 'ceil':
                return (Math.ceil(value / settings.step) * settings.step).toFixed(settings.decimals);
            default:
                return value;
            }
        },

        _checkValue: function () {
            var val, parsedval, returnval;

            val = this.element.val();

            if (val === '') {
                return;
            }

            if (this.settings.decimals > 0 && val === '.') {
                return;
            }

            parsedval = parseFloat(val);

            if (isNaN(parsedval)) {
                parsedval = 0;
            }

            returnval = parsedval;

            if (parsedval.toString() !== val) {
                returnval = parsedval;
            }

            if (parsedval < this.settings.min) {
                returnval = this.settings.min;
            }

            if (parsedval > this.settings.max) {
                returnval = this.settings.max;
            }

            returnval = this._forcestepdivisibility(returnval);

            if (Number(val).toString() !== returnval.toString()) {
                this.element.val(returnval);
                this.element.trigger('change');
            }
        },

        _getBoostedStep: function () {
            if (!this.settings.booster) {
                return this.settings.step;
            }
            else {
                var boosted = Math.pow(2, Math.floor(this.spincount / this.settings.boostat)) * this.settings.step;

                if (this.settings.maxboostedstep) {
                    if (boosted > this.settings.maxboostedstep) {
                        boosted = this.settings.maxboostedstep;
                        this.value = Math.round((this.value / boosted)) * boosted;
                    }
                }

                return Math.max(this.settings.step, boosted);
            }
        },

        upOnce:function () {
            this._checkValue();

            var value = parseFloat(this.elements.input.val());
            if (isNaN(value)) {
                value = 0;
            }

            var initvalue = value,
                boostedstep = this._getBoostedStep();

            value = value + boostedstep;

            if (value > this.settings.max) {
                value = this.settings.max;
                this.element.trigger('spinner.on.max');
                this.stopSpin();
            }

            this.elements.input.val(Number(value).toFixed(this.settings.decimals));

            if (initvalue !== value) {
                this.element.trigger('change');
            }
        },

        downOnce:function () {
            this._checkValue();

            var value = parseFloat(this.elements.input.val());
            if (isNaN(value)) {
                value = 0;
            }

            var initvalue = value,
                boostedstep = this._getBoostedStep();

            value = value - boostedstep;

            if (value < this.settings.min) {
                value = this.settings.min;
                this.element.trigger('spinner.on.min');
                this.stopSpin();
            }

            this.elements.input.val(value.toFixed(this.settings.decimals));

            if (initvalue !== value) {
                this.element.trigger('change');
            }
        },

        startDownSpin : function () {
            var context=this;
            this.stopSpin();

            this.spincount = 0;
            this.spinning = 'down';

            this.element.trigger('spinner.on.startspin');
            this.element.trigger('spinner.on.startdownspin');

            this.downDelayTimeout = setTimeout(function() {
                context.downSpinTimer = setInterval(function() {
                    context.spincount++;
                    context.downOnce();
                }, context.settings.stepinterval);
            }, this.settings.stepintervaldelay);
        },

        startUpSpin: function () {
            var context=this;
            this.stopSpin();

            this.spincount = 0;
            this.spinning = 'up';

            this.element.trigger('spinner.on.startspin');
            this.element.trigger('spinner.on.startupspin');

            this.upDelayTimeout = setTimeout(function() {
                context.upSpinTimer = setInterval(function() {
                    context.spincount++;
                    context.upOnce();
                }, context.settings.stepinterval);
            }, this.settings.stepintervaldelay);
        },

        stopSpin: function () {
            clearTimeout(this.downDelayTimeout);
            clearTimeout(this.upDelayTimeout);
            clearInterval(this.downSpinTimer);
            clearInterval(this.upSpinTimer);

            switch (this.spinning) {
                case 'up':
                    this.element.trigger('spinner.on.stopupspin');
                    this.element.trigger('spinner.on.stopspin');
                    break;
                case 'down':
                    this.element.trigger('spinner.on.stopdownspin');
                    this.element.trigger('spinner.on.stopspin');
                    break;
            }

            this.spincount = 0;
            this.spinning = false;
        }
    });
});

/* spinner javascript jQuery */

/*
 *  Bootstrap TouchSpin - v3.0.1
 *  A mobile and touch friendly input spinner component for Bootstrap 3.
 *  http://www.virtuosoft.eu/code/bootstrap-spinner/
 *
 *  Made by István Ujj-Mészáros
 *  Under Apache License v2.0 License
 */
(function($) {
    // 严格模式
    'use strict';

    // 控件类名
    var pluginName = "spinner";

        // 胶水代码
    $.fn[pluginName] = function(options) {

        this.each(function () {
            var jqElement = $(this);
            if (jqElement.data(pluginName)) {
                jqElement.data(pluginName).remove();
            }
            jqElement.data(pluginName, new T.UI.Controls.Spinner(this, options));
        });

        return this;

    };

})(jQuery);
