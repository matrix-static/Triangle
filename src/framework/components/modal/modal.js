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

    // https://github.com/twbs/bootstrap/blob/83bfff7f0765503b990b96c303eef67009e48d77/js/transition.js#L36
    // http://blog.alexmaccaw.com/css-transitions
    var TRANSITION_DURATION = 300;
    var BACKDROP_TRANSITION_DURATION = 150;


    var defaults = {
        // 参数
        modalId: '',        // 窗口div的id，指定id以后不会重新往modalContainer里面加内容
        modalCssClass: '',  // 窗口div的自定义css class
        show: false,        // 创建后直接显示
        bindTarget: true,   // 绑定element元素(button等)的click事件
        remote: '',         // 远程内容
        content: '',        // 本地内容
        backdrop: true,     // 遮罩(true/false/'static')
        keyboard: true,     // 键盘操作支持
        modalContainer: '#t-modal-base',     // 放在html文件</body>前的容器id
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
            // this.element= this.inputElements.pop;

            // 区分一个页面中存在多个控件实例
            _currentPluginId += 1;
            if(this.inputElements.original && this.inputElements.original.length > 0){
                this._currentPluginId= this.inputElements.original.data('plugin-id');
                if(!this._currentPluginId){
                    this._currentPluginId= _currentPluginId;
                    this.inputElements.original.data('plugin-id', _currentPluginId);
                }
            }
            // this.element.data('plugin-id', _currentPluginId);
            

            this.isShown             = false
            this.originalBodyPad     = null
            this.scrollbarWidth      = 0
            this.ignoreBackdropClick = false

            // // 初始化选项
            // this.initSettings(options);
            this.settings             = options
            this.modalContainer= $(this.settings.modalContainer);
            this.settings.modalId= this.settings.modalId || this.settings.modalContainer +'-m'+this._currentPluginId;
            if (typeof (this.settings.parseData) === 'function') {
                this.parseData = this.settings.parseData;
                delete this.settings.parseData;
            }

            // this.buildHtml();
            // // 初始化 html DOM 元素
            // this.initElements();

            // 初始化数据
            this.getData();

            // // 绑定事件
            // this.bindEvents();
            // // 绑定事件接口
            // this.bindEventsInterface();
        },
        getData: function(){
            var context= this;

            if(this.modalContainer.find(this.settings.modalId).length === 0){
                context.inputElements.original.trigger('modal.on.initialized');
            }

            if (this.settings.remote) {                
                $.ajax({
                    url: this.settings.remote,
                    type: 'GET',
                    dataType: "html"//,
                    // data: params
                }).done(function(responseText) {
                    context.render();

                    context.elements.content.empty();
                    // context.inputElements.original.trigger('modal.on.loaded');
                    var innerHtml= context.parseData(responseText);                    
                    // jqModalContent.append($.parseHTML(innerHtml));
                    context.elements.content.append(innerHtml);

                    // 绑定事件
                    context.bindEvents();

                    context.inputElements.original.trigger('modal.on.initialized');
                })
            }
            else{
                context.render();

                if(this.settings.content){
                    this.elements.content.empty();
                    this.elements.content.append(this.settings.content);
                }

                // 绑定事件
                this.bindEvents();

                context.inputElements.original.trigger('modal.on.initialized');
            }
        },
        parseData: function(data){
            return data;
        },
        buildHtml: function(){
            // <button type="button" class="btn btn-default cancel">取消</button>
            // <button type="button" class="btn btn-primary confirm">确定</button>
            // var buttonsHtml= '';
            // for(var buttonName in this.settings.buttons){
            //     var button= this.settings.buttons[buttonName];
            //     buttonsHtml += '<button type="button" class="btn btn-primary '+ button.selector. +'">{text}</button>';
            // }            
        },
        render: function(){
            if(this.modalContainer.find(this.settings.modalId).length === 0){
                var cssClass= this.settings.modalCssClass ? ' '+this.settings.modalCssClass : ''
                var htmlTempate= ''+
                    '<div '+
                    '   class="modal fade'+cssClass+'" '+
                    '   id="'+ this.settings.modalId.substring(1) +'" '+
                    '   tabindex="-1">'+
                    '    <div class="modal-dialog">'+
                    '        <div class="modal-content">'+
                    '        </div>'+
                    '    </div>'+
                    '</div>';
                this.modalContainer.append(htmlTempate);
            }

            this.initElements();
        },
        refresh: function(){},
        initElements: function(){
            var context=this;

            var jqModal= this.modalContainer.find(this.settings.modalId);
            this.elements= {
                body: $(document.body),
                modal: jqModal,
                dialog: jqModal.find('.modal-dialog:first'),    // 嵌套modal必须加:first选择器
                content: jqModal.find('.modal-content:first'),  // 嵌套modal必须加:first选择器
                backdrop: null
            };

            if(this.settings.show){
                this.show(this.inputElements.original);
            }
        },
        bindEvents: function(){
            // this.element.on('click', '.close, .cancel', $.proxy(this.hide, this));
            for(var buttonName in this.settings.buttons){
                var button= this.settings.buttons[buttonName];
                this.elements.modal.off(button.eventName, button.selector); // unbindEvents
                this.elements.modal.on(button.eventName, button.selector, $.proxy(button.handler, this));
            }
        },

        // escape: function () {
        //     if (this.isShown && this.settings.keyboard) {
        //         this.elements.modal.on('keydown.modal.on.dismiss', $.proxy(function (e) {
        //             e.which == 27 && this.hide()
        //         }, this))
        //     } else if (!this.isShown) {
        //         this.elements.modal.off('keydown.modal.on.dismiss')
        //     }
        // },

        // resize: function () {
        //     if (this.isShown) {
        //         $(window).on('resize.modal', $.proxy(this.adjustDialog, this))
        //     } else {
        //         $(window).off('resize.modal')
        //     }
        // },

        // toggle: function (_relatedTarget) {
        //     return this.isShown ? this.hide() : this.show(_relatedTarget);
        // },

        show: function (_relatedTarget) {
            var context= this;

            var e= $.Event('modal.on.show', { relatedTarget: _relatedTarget });
            this.elements.modal.trigger(e);

            // 嵌套madel
            var zIndex = 1040 + (10 * $('.modal:visible').length);
            // $(this).css('z-index', zIndex);
            // this.inputElements.pop.css('z-index', zIndex);
            this.elements.modal.css('z-index', zIndex);
            setTimeout(function() {
                $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
            }, 0);

            if (this.isShown || e.isDefaultPrevented()) return;

            this.isShown = true;

            // checkScrollbar
            var fullWindowWidth = window.innerWidth;
            if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
                var documentElementRect = document.documentElement.getBoundingClientRect();
                fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
            }
            this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
            // measureScrollbar
            var scrollDiv = document.createElement('div');
            scrollDiv.className = 'modal-scrollbar-measure';
            this.elements.body.append(scrollDiv);
            this.scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            this.elements.body[0].removeChild(scrollDiv);
            // setScrollbar
            var bodyPad = parseInt((this.elements.body.css('padding-right') || 0), 10)
            this.originalBodyPad = document.body.style.paddingRight || ''
            if (this.bodyIsOverflowing) this.elements.body.css('padding-right', bodyPad + this.scrollbarWidth)
            this.elements.body.addClass('modal-open')

            // // 绑定esc键事件
            // this.escape();
            // this.resize();
            $(window).on('resize.modal', $.proxy(this.adjustDialog, this))

            // this.elements.modal.on('click.modal.on.dismiss', '[data-dismiss="modal"]', $.proxy(this.hide, this))

            this.elements.dialog.on('mousedown.modal.on.dismiss', function () {
                context.elements.modal.one('mouseup.modal.on.dismiss', function (e) {
                    if ($(e.target).is(context.elements.modal)){
                        context.ignoreBackdropClick = true;
                    }
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
            this.elements.modal.trigger(e);

            if (!this.isShown || e.isDefaultPrevented()) {
                return;
            }

            this.isShown = false;

            // // 绑定esc键事件
            // this.escape();
            // this.resize();
            $(window).off('resize.modal');

            $(document).off('modal.on.focusin');

            this.elements.modal
                .removeClass('in')
                .off('click.modal.on.dismiss')
                .off('mouseup.modal.on.dismiss');

            this.elements.dialog.off('mousedown.modal.on.dismiss');

            $.support.transition && this.elements.modal.hasClass('fade') ?
                this.elements.modal
                    .one('bsTransitionEnd', $.proxy(this.hideModal, this))
                    .emulateTransitionEnd(TRANSITION_DURATION) :
                this.hideModal()
        },

        hideModal: function () {
            var context = this
            this.elements.modal.hide()
            this.backdrop(function () {
                context.elements.body.removeClass('modal-open')
                context.elements.modal.css({
                    paddingLeft: '',
                    paddingRight: ''
                })
                context.elements.body.css('padding-right', context.originalBodyPad)
                context.elements.modal.trigger('modal.on.hidden')
            })
        },

        backdrop: function (callback) {
            var context = this
            var animate = this.elements.modal.hasClass('fade') ? 'fade' : ''

            if (this.isShown && this.settings.backdrop) {
                var doAnimate = $.support.transition && animate

                this.elements.backdrop = $(document.createElement('div'))
                    .addClass('modal-backdrop ' + animate)
                    .appendTo(this.elements.body)

                this.elements.modal.on('click.modal.on.dismiss', $.proxy(function (e) {
                    if (this.ignoreBackdropClick) {
                        this.ignoreBackdropClick = false
                        return
                    }
                    if (e.target !== e.currentTarget) return
                    this.settings.backdrop == 'static'
                        ? this.elements.modal[0].focus()
                        : this.hide()
                }, this))

                // http://stackoverflow.com/questions/9016307/force-reflow-in-css-transitions-in-bootstrap
                if (doAnimate) this.elements.backdrop[0].offsetWidth; // force reflow

                this.elements.backdrop.addClass('in');

                if (!callback){
                    return;
                }

                doAnimate ?
                    this.elements.backdrop
                        .one('bsTransitionEnd', callback)
                        .emulateTransitionEnd(BACKDROP_TRANSITION_DURATION) :
                    callback()

            } else if (!this.isShown && this.elements.backdrop) {
                this.elements.backdrop.removeClass('in')

                var callbackRemove = function () {
                    // removeBackdrop
                    context.elements.backdrop && context.elements.backdrop.remove()
                    context.elements.backdrop = null
                    callback && callback()
                }
                $.support.transition && this.elements.modal.hasClass('fade') ?
                    this.elements.backdrop
                        .one('bsTransitionEnd', callbackRemove)
                        .emulateTransitionEnd(BACKDROP_TRANSITION_DURATION) :
                    callbackRemove()

            } else if (callback) {
                callback()
            }
        },

        backdropCallback: function (e) {
            if (!this.elements.modal.parent().length) {
                this.elements.modal.appendTo(this.elements.body); // don't move modals dom position
            }

            this.elements.modal.show();
            this.elements.modal.scrollTop(0);

            this.adjustDialog();

            var transition = $.support.transition && this.elements.modal.hasClass('fade');
            if (transition) {
                this.elements.modal[0].offsetWidth; // force reflow
            }

            this.elements.modal.addClass('in');

            $(document).off('modal.onfocusin'); // guard against infinite focus loop
            $(document).on('modal.onfocusin', $.proxy(function (e) {
                if (this.elements.modal[0] !== e.target && !this.elements.modal.has(e.target).length) {
                    this.elements.modal.trigger('focus')
                }
            }, this));

            if(transition){
                var context= this;
                this.elements.dialog.one('bsTransitionEnd', function () {
                    context.elements.modal.trigger('focus').trigger(e)
                });
                this.elements.dialog.emulateTransitionEnd(TRANSITION_DURATION)
            }
            else{
                this.elements.modal.trigger('focus').trigger(e);
            }                
        },

        // these following methods are used to handle overflowing modals

        adjustDialog: function () {
            var modalIsOverflowing = this.elements.modal[0].scrollHeight > document.documentElement.clientHeight;

            this.elements.modal.css({
                paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
                paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
            });
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
                original: this.element//,
                // pop: $(this.settings.modalId)
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

            this.elements.original.on('modal.on.initialized', $.proxy(this.settings.onInitialized, this));
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