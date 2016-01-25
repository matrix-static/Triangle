/* ========================================================================
 * Bootstrap: modal.js v3.3.5
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


Jx().package("T.UI.Components", function(J){
    // 严格模式
    'use strict';

    // 全局变量、函数、对象
    var _currentPluginId = 0;

    var TRANSITION_DURATION = 300;
    var BACKDROP_TRANSITION_DURATION = 150;


    var defaults = {
        // 参数
        modalId: '',        // 窗口div的id
        show: false,        // 创建后直接显示
        bindTarget: true,   // 绑定element元素(button等)的click事件
        remote: '',         // 远程内容
        backdrop: true,     // 遮罩
        keyboard: true,     // 键盘操作支持
        buttons:{
            close: {
                selector: '.close',
                eventName: 'click',
                handler: function(e){
                    this.hide();
                }
            },
            cancel: {
                selector: '.cancel',
                eventName: 'click',
                handler: function(e){
                    this.hide();
                }
            }//,
            // {
            //     selector: '.submit',
            //     eventName: 'click',
            //     handler: function(e){}
            // }
        },
        // 覆写
        // 事件
        onInitialized: function(){} // 初始化完成事件
    };
    var attributeMap = {
        modalId:'modal-id',
        show: 'show',
        remote: 'remote',
        backdrop: 'backdrop',
        keyboard: 'keyboard'
    };

    var ModalPop = new J.Class({
        // 构造函数
        init:function(elements, options){
            this.inputElements= elements;
            this.element= this.inputElements.pop;

            // 区分一个页面中存在多个控件实例
            _currentPluginId += 1;
            this.element.data('plugin-id', _currentPluginId);

            this.isShown             = false
            this.originalBodyPad     = null
            this.scrollbarWidth      = 0
            this.ignoreBackdropClick = false

            // // 初始化选项
            // this.initSettings(options);
            this.settings             = options
            if (typeof (this.settings.parseData) === 'function') {
                this.parseData = this.settings.parseData;
                delete this.settings.parseData;
            }

            // 初始化数据
            this.getData();

            // 初始化 html DOM 元素
            this.initElements();            

            // 绑定事件
            this.bindEvents();
            // // 绑定事件接口
            // this.bindEventsInterface();
        },
        initElements: function(){
            var context=this;

            this.elements={
                body: $(document.body),
                dialog: context.element.find('.modal-dialog'),
                backdrop: null
            };

            if(this.settings.show){
                this.show(this.inputElements.original);
            }
        },
        getData: function(){
            var context= this;
            if (this.settings.remote) {                
                var jqModalContent= this.element.find('.modal-content:first');  // 嵌套modal必须加:first选择器

                $.ajax({
                    url: this.settings.remote,
                    type: 'GET',
                    dataType: "html"//,
                    // data: params
                }).done(function(responseText) {
                    jqModalContent.empty();
                    // context.inputElements.original.trigger('modal.on.loaded');
                    var innerHtml= context.parseData(responseText);                    
                    // jqModalContent.append($.parseHTML(innerHtml));
                    jqModalContent.append(innerHtml);

                    context.inputElements.original.trigger('modal.on.initialized');
                })
            }
        },
        parseData: function(data){
            return data;
        },
        bindEvents: function(){
            // this.element.on('click', '.close, .cancel', $.proxy(this.hide, this));
            for(var buttonName in this.settings.buttons){
                var button= this.settings.buttons[buttonName];
                this.element.on(button.eventName, button.selector, $.proxy(button.handler, this));
            }
        },

        escape: function () {
            if (this.isShown && this.settings.keyboard) {
                this.element.on('keydown.modal.on.dismiss', $.proxy(function (e) {
                    e.which == 27 && this.hide()
                }, this))
            } else if (!this.isShown) {
                this.element.off('keydown.modal.on.dismiss')
            }
        },

        resize: function () {
            if (this.isShown) {
                $(window).on('resize.modal', $.proxy(this.handleUpdate, this))
            } else {
                $(window).off('resize.modal')
            }
        },
        toggle: function (_relatedTarget) {
            return this.isShown ? this.hide() : this.show(_relatedTarget)
        },
        show: function (_relatedTarget) {
            var context= this;

            var e= $.Event('modal.on.show', { relatedTarget: _relatedTarget });
            this.element.trigger(e);

            // 嵌套madel
            var zIndex = 1040 + (10 * $('.modal:visible').length);
            // $(this).css('z-index', zIndex);
            this.inputElements.pop.css('z-index', zIndex);
            setTimeout(function() {
                $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
            }, 0);

            if (this.isShown || e.isDefaultPrevented()) return

            this.isShown = true

            this.checkScrollbar()
            this.setScrollbar()
            this.elements.body.addClass('modal-open')

            // 绑定esc键事件
            this.escape();
            this.resize();

            // this.element.on('click.modal.on.dismiss', '[data-dismiss="modal"]', $.proxy(this.hide, this))

            this.elements.dialog.on('mousedown.modal.on.dismiss', function () {
                context.element.one('mouseup.modal.on.dismiss', function (e) {
                    if ($(e.target).is(context.element)) context.ignoreBackdropClick = true
                })
            })

            var e = $.Event('modal.on.shown', { relatedTarget: _relatedTarget });
            this.backdrop($.proxy(this.backdropCallback, this, e));
        },

        hide: function (e) {
            if(e){
                e.preventDefault();
            }

            e = $.Event('modal.on.hide');
            this.element.trigger(e);

            if (!this.isShown || e.isDefaultPrevented()) {
                return;
            }

            this.isShown = false;

            // 绑定esc键事件
            this.escape();
            this.resize();

            $(document).off('modal.on.focusin');

            this.element
                .removeClass('in')
                .off('click.modal.on.dismiss')
                .off('mouseup.modal.on.dismiss');

            this.elements.dialog.off('mousedown.modal.on.dismiss');

            $.support.transition && this.element.hasClass('fade') ?
                this.element
                    .one('bsTransitionEnd', $.proxy(this.hideModal, this))
                    .emulateTransitionEnd(TRANSITION_DURATION) :
                this.hideModal()
        },

        hideModal: function () {
            var context = this
            this.element.hide()
            this.backdrop(function () {
                context.elements.body.removeClass('modal-open')
                context.resetAdjustments()
                context.resetScrollbar()
                context.element.trigger('modal.on.hidden')
            })
        },

        removeBackdrop: function () {
            this.elements.backdrop && this.elements.backdrop.remove()
            this.elements.backdrop = null
        },

        backdrop: function (callback) {
            var context = this
            var animate = this.element.hasClass('fade') ? 'fade' : ''

            if (this.isShown && this.settings.backdrop) {
                var doAnimate = $.support.transition && animate

                this.elements.backdrop = $(document.createElement('div'))
                    .addClass('modal-backdrop ' + animate)
                    .appendTo(this.elements.body)

                this.element.on('click.modal.on.dismiss', $.proxy(function (e) {
                    if (this.ignoreBackdropClick) {
                        this.ignoreBackdropClick = false
                        return
                    }
                    if (e.target !== e.currentTarget) return
                    this.settings.backdrop == 'static'
                        ? this.element[0].focus()
                        : this.hide()
                }, this))

                if (doAnimate) this.elements.backdrop[0].offsetWidth // force reflow

                this.elements.backdrop.addClass('in')

                if (!callback) return

                doAnimate ?
                    this.elements.backdrop
                        .one('bsTransitionEnd', callback)
                        .emulateTransitionEnd(BACKDROP_TRANSITION_DURATION) :
                    callback()

            } else if (!this.isShown && this.elements.backdrop) {
                this.elements.backdrop.removeClass('in')

                var callbackRemove = function () {
                    context.removeBackdrop()
                    callback && callback()
                }
                $.support.transition && this.element.hasClass('fade') ?
                    this.elements.backdrop
                        .one('bsTransitionEnd', callbackRemove)
                        .emulateTransitionEnd(BACKDROP_TRANSITION_DURATION) :
                    callbackRemove()

            } else if (callback) {
                callback()
            }
        },

        backdropCallback: function (e) {
            if (!this.element.parent().length) {
                this.element.appendTo(this.elements.body); // don't move modals dom position
            }

            this.element
                .show()
                .scrollTop(0);

            this.adjustDialog();

            var transition = $.support.transition && this.element.hasClass('fade');
            if (transition) {
                this.element[0].offsetWidth; // force reflow
            }

            this.element.addClass('in');

            $(document)
                .off('modal.onfocusin') // guard against infinite focus loop
                .on('modal.onfocusin', $.proxy(function (e) {
                    if (this.element[0] !== e.target && !this.element.has(e.target).length) {
                        this.element.trigger('focus')
                    }
                }, this));

            transition ?
                this.elements.dialog // wait for modal to slide in
                    .one('bsTransitionEnd', function () {
                        this.element.trigger('focus').trigger(e)
                    })
                    .emulateTransitionEnd(TRANSITION_DURATION) :
                this.element.trigger('focus').trigger(e)
        },

        // these following methods are used to handle overflowing modals

        handleUpdate: function () {
            this.adjustDialog()
        },

        adjustDialog: function () {
            var modalIsOverflowing = this.element[0].scrollHeight > document.documentElement.clientHeight;

            this.element.css({
                paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
                paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
            });
        },

        resetAdjustments: function () {
            this.element.css({
                paddingLeft: '',
                paddingRight: ''
            })
        },

        checkScrollbar: function () {
            var fullWindowWidth = window.innerWidth
            if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
                var documentElementRect = document.documentElement.getBoundingClientRect()
                fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
            }
            this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
            this.scrollbarWidth = this.measureScrollbar()
        },

        setScrollbar: function () {
            var bodyPad = parseInt((this.elements.body.css('padding-right') || 0), 10)
            this.originalBodyPad = document.body.style.paddingRight || ''
            if (this.bodyIsOverflowing) this.elements.body.css('padding-right', bodyPad + this.scrollbarWidth)
        },

        resetScrollbar: function () {
            this.elements.body.css('padding-right', this.originalBodyPad)
        },

        measureScrollbar: function () { // thx walsh
            var scrollDiv = document.createElement('div')
            scrollDiv.className = 'modal-scrollbar-measure'
            this.elements.body.append(scrollDiv)
            var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
            this.elements.body[0].removeChild(scrollDiv)
            return scrollbarWidth
        }
    });

    this.Modal = new J.Class({extend : T.UI.BaseControl}, {
        defaults: defaults,
        attributeMap: attributeMap,

        init: function(element, options){
            this.element = $(element);
            
            //this.container;
            //this.elements;

            // this.value = this.element.val();

            // 初始化选项
            // this.initSettings(options);
            var jqElement=$(element);
            this.initSettings(jqElement, options);

            if(!this.settings.remote){
                var href= this.element.attr('href');
                this.settings.remote= !/#/.test(href) && href;
            }

            // // 初始化数据
            // this.getData();

            // 初始化 html DOM 元素
            this.initElements();

            // 创建 树型 菜单对象
            this.pop=new ModalPop(this.elements, this.settings);

            this.bindEvents();
        },
        initElements: function(){
            this.elements={
                original: this.element,
                pop: $(this.settings.modalId)
            }
        },
        bindEvents: function(){
            var context = this;

            this.unbindEvents();

            if(this.settings.bindTarget){
                this.elements.original.on('click', function(e){
                    if($(this).is('a')){
                        e.preventDefault();
                    }

                    context.pop.show(context.elements.original);
                });
            }

            this.elements.original.on('modal.on.initialized', this.settings.onInitialized);
        },
        unbindEvents: function(){
            this.elements.original.off('modal.on.initialized');
            if(this.settings.bindTarget)
            {
                this.elements.original.off('click');
            }
        },
        show: function(){
            this.pop.show();
        },
        hide: function(){
            this.pop.hide();
        }
    });
});