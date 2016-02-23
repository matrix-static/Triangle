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

    this.Modal = new J.Class({extend : T.UI.BaseControl}, {
        defaults: defaults,
        attributeMap: attributeMap,

        // 构造函数
        init:function(element, options){
            // 初始化选项
            var jqElement=$(element);
            this.initSettings(jqElement, options);
            if(!this.settings.remote){
                var href= jqElement.attr('href');
                this.settings.remote= !/#/.test(href) && href;
            }

            // 区分一个页面中存在多个控件实例
            _currentPluginId += 1;
            if(jqElement && jqElement.length > 0){
                this._currentPluginId= jqElement.data('plugin-id');
                if(!this._currentPluginId){
                    this._currentPluginId= _currentPluginId;
                    jqElement.data('plugin-id', _currentPluginId);
                }
            }

            // TODO: need to remove
            this.element= jqElement;

            this.isShown             = false;
            this.originalBodyPad     = null;
            this.scrollbarWidth      = 0;
            this.ignoreBackdropClick = false;

            this.modalContainer= $(this.settings.modalContainer);
            this.settings.modalId= this.settings.modalId || this.settings.modalContainer +'-m'+this._currentPluginId;

            // parse data
            if (typeof (this.settings.parseData) === 'function') {
                this.parseData = this.settings.parseData;
                delete this.settings.parseData;
            }

            // 初始化数据
            this.getData();
        },
        getData: function(){
            var context= this;

            // if(this.modalContainer.find(this.settings.modalId).length === 0){
            //     context.elements.modal.trigger('modal.on.initialized');
            // }

            if (this.settings.remote) {                
                $.ajax({
                    url: this.settings.remote,
                    type: 'GET',
                    dataType: "html"//,
                    // data: params
                }).done(function(responseText) {
                    var innerHtml= context.parseData(responseText);
                    context.render(innerHtml);
                });
            }
            else{
                this.render(this.settings.content);
            }
        },
        parseData: function(data){
            return data;
        },
        buildHtml: function(){},
        render: function(innerHtml){
            var jqModal= this.modalContainer.find(this.settings.modalId);
            if(jqModal.length === 0)
            {
                // dynamic build modal
                var cssClass= this.settings.modalCssClass ? ' '+this.settings.modalCssClass : ''
                var htmlTempate= ''+
                    '<div '+
                    '   class="modal fade'+cssClass+'" '+
                    '   id="'+ this.settings.modalId.substring(1) +'" '+
                    '   tabindex="-1">'+
                    '    <div class="modal-dialog">'+
                    // '        <div class="modal-content">'+
                    // '        </div>'+
                    '    </div>'+
                    '</div>';
                this.modalContainer.append(htmlTempate);

                jqModal= this.modalContainer.find(this.settings.modalId);
            }
            
            if(innerHtml){
                // var jqContent= jqModal.find('.modal-content:first');
                // jqContent.empty();
                // jqContent.append(innerHtml);
                var jqDialog= jqModal.find('.modal-dialog:first');
                jqDialog.empty();
                jqDialog.append(innerHtml);
            }

            this.initElements();

            // 绑定事件
            this.bindEvents();

            this.elements.modal.trigger('modal.on.initialized');
        },
        refresh: function(){},
        initElements: function(){
            var context=this;


            var jqModal= this.modalContainer.find(this.settings.modalId);
            this.elements= {
                original: this.element,
                body: $(document.body),
                modal: jqModal,
                dialog: jqModal.find('.modal-dialog:first'),    // 嵌套modal必须加:first选择器
                // content: jqModal.find('.modal-content:first'),  // 嵌套modal必须加:first选择器
                backdrop: null
            };

            if(this.settings.show){
                this.show(this.element);
            }
        },
        bindEvents: function(){
            this.unbindEvents();

            if(this.settings.bindTarget){
                var context= this;
                this.elements.original.on('click', function(e){
                    if($(this).is('a')){
                        e.preventDefault();
                    }

                    context.show(context.elements.original);
                });
            }

            this.elements.modal.on('modal.on.initialized', $.proxy(this.settings.onInitialized, this));

            // this.elements.modal.on('click', '.close, .cancel', $.proxy(this.hide, this));
            for(var buttonName in this.settings.buttons){
                var button= this.settings.buttons[buttonName];
                this.elements.modal.off(button.eventName, button.selector); // unbindEvents
                this.elements.modal.on(button.eventName, button.selector, $.proxy(button.handler, this));
            }
        },
        unbindEvents: function(){
            this.elements.modal.off('modal.on.initialized');
            if(this.settings.bindTarget)
            {
                this.elements.modal.off('click');
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
            // this.elements.pop.css('z-index', zIndex);
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
            $(window).off('resize.modal');
            $(document).off('modal.on.focusin');

            this.elements.modal
                .removeClass('in')
                .off('click.modal.on.dismiss')
                .off('mouseup.modal.on.dismiss');

            this.elements.dialog.off('mousedown.modal.on.dismiss');

            if($.support.transition && this.elements.modal.hasClass('fade')){
                this.elements.modal
                    .one('bsTransitionEnd', $.proxy(this.hideModal, this))
                    .emulateTransitionEnd(TRANSITION_DURATION);
            }
            else
            {
                this.hideModal();
            }
        },

        hideModal: function () {
            var context = this
            this.elements.modal.hide()
            this.backdrop(function () {
                context.elements.body.removeClass('modal-open');
                context.elements.modal.css({
                    paddingLeft: '',
                    paddingRight: ''
                });
                context.elements.body.css('padding-right', context.originalBodyPad);
                context.elements.modal.trigger('modal.on.hidden');
            })
        },

        backdrop: function (callback) {
            var context = this
            var animate = this.elements.modal.hasClass('fade') ? 'fade' : ''

            if (this.isShown && this.settings.backdrop) {
                var doAnimate = $.support.transition && animate;

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

                if(doAnimate){
                    this.elements.backdrop
                        .one('bsTransitionEnd', callback)
                        .emulateTransitionEnd(BACKDROP_TRANSITION_DURATION);
                }
                else{
                    callback();
                }
            } 
            else if (!this.isShown && this.elements.backdrop) 
            {
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

            } 
            else if (callback) {
                callback();
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

        adjustDialog: function () {
            var modalIsOverflowing = this.elements.modal[0].scrollHeight > document.documentElement.clientHeight;

            this.elements.modal.css({
                paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
                paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
            });
        }
    });

    var ModalStack= new J.Class({
        init: function(){
            this.openedWindows= new T.Collections.Map();
        },
        open: function(modalInstance, modal) {
            var modalOpener = $document[0].activeElement,
                modalBodyClass = modal.openedClass || OPENED_MODAL_CLASS;

            toggleTopWindowClass(false);

            openedWindows.add(modalInstance, {
                deferred: modal.deferred,
                renderDeferred: modal.renderDeferred,
                closedDeferred: modal.closedDeferred,
                modalScope: modal.scope,
                backdrop: modal.backdrop,
                keyboard: modal.keyboard,
                openedClass: modal.openedClass,
                windowTopClass: modal.windowTopClass,
                animation: modal.animation,
                appendTo: modal.appendTo
            });

            openedClasses.put(modalBodyClass, modalInstance);

            var appendToElement = modal.appendTo,
                    currBackdropIndex = backdropIndex();

            if (!appendToElement.length) {
                throw new Error('appendTo element not found. Make sure that the element passed is in DOM.');
            }

            if (currBackdropIndex >= 0 && !backdropDomEl) {
                backdropScope = $rootScope.$new(true);
                backdropScope.modalOptions = modal;
                backdropScope.index = currBackdropIndex;
                backdropDomEl = angular.element('<div uib-modal-backdrop="modal-backdrop"></div>');
                backdropDomEl.attr('backdrop-class', modal.backdropClass);
                if (modal.animation) {
                    backdropDomEl.attr('modal-animation', 'true');
                }
                $compile(backdropDomEl)(backdropScope);
                $animate.enter(backdropDomEl, appendToElement);
            }

            var angularDomEl = angular.element('<div uib-modal-window="modal-window"></div>');
            angularDomEl.attr({
                'template-url': modal.windowTemplateUrl,
                'window-class': modal.windowClass,
                'window-top-class': modal.windowTopClass,
                'size': modal.size,
                'index': openedWindows.length() - 1,
                'animate': 'animate'
            }).html(modal.content);
            if (modal.animation) {
                angularDomEl.attr('modal-animation', 'true');
            }

            $animate.enter($compile(angularDomEl)(modal.scope), appendToElement)
                .then(function() {
                    $animate.addClass(appendToElement, modalBodyClass);
                });

            openedWindows.top().value.modalDomEl = angularDomEl;
            openedWindows.top().value.modalOpener = modalOpener;

            $modalStack.clearFocusListCache();
        },
        close: function(modalInstance, result) {
            var modalWindow = openedWindows.get(modalInstance);
            if (modalWindow && broadcastClosing(modalWindow, result, true)) {
                modalWindow.value.modalScope.$$uibDestructionScheduled = true;
                modalWindow.value.deferred.resolve(result);
                removeModalWindow(modalInstance, modalWindow.value.modalOpener);
                return true;
            }
            return !modalWindow;
        },
        broadcastClosing: function(modalWindow, resultOrReason, closing) {
            return !modalWindow.value.modalScope.$broadcast('modal.closing', resultOrReason, closing).defaultPrevented;
        },
        dismiss: function(modalInstance, reason) {
            var modalWindow = openedWindows.get(modalInstance);
            if (modalWindow && broadcastClosing(modalWindow, reason, false)) {
                modalWindow.value.modalScope.$$uibDestructionScheduled = true;
                modalWindow.value.deferred.reject(reason);
                removeModalWindow(modalInstance, modalWindow.value.modalOpener);
                return true;
            }
            return !modalWindow;
        },
        dismissAll: function(reason) {
            var topModal = this.getTop();
            while (topModal && this.dismiss(topModal.key, reason)) {
                topModal = this.getTop();
            }
        },
        getTop: function() {
            return openedWindows.top();
        },
        modalRendered: function(modalInstance) {
            var modalWindow = openedWindows.get(modalInstance);
            if (modalWindow) {
                modalWindow.value.renderDeferred.resolve();
            }
        },
        focusFirstFocusableElement: function() {
            if (focusableElementList.length > 0) {
                focusableElementList[0].focus();
                return true;
            }
            return false;
        },
        focusLastFocusableElement: function() {
            if (focusableElementList.length > 0) {
                focusableElementList[focusableElementList.length - 1].focus();
                return true;
            }
            return false;
        },
        isModalFocused: function(evt, modalWindow) {
            if (evt && modalWindow) {
                var modalDomEl = modalWindow.value.modalDomEl;
                if (modalDomEl && modalDomEl.length) {
                    return (evt.target || evt.srcElement) === modalDomEl[0];
                }
            }
            return false;
        },
        isFocusInFirstItem: function(evt) {
            if (focusableElementList.length > 0) {
                return (evt.target || evt.srcElement) === focusableElementList[0];
            }
            return false;
        },
        isFocusInLastItem: function(evt) {
            if (focusableElementList.length > 0) {
                return (evt.target || evt.srcElement) === focusableElementList[focusableElementList.length - 1];
            }
            return false;
        },
        clearFocusListCache: function() {
            focusableElementList = [];
            focusIndex = 0;
        },
        loadFocusElementList: function(modalWindow) {
            if (focusableElementList === undefined || !focusableElementList.length) {
                if (modalWindow) {
                    var modalDomE1 = modalWindow.value.modalDomEl;
                    if (modalDomE1 && modalDomE1.length) {
                        focusableElementList = modalDomE1[0].querySelectorAll(tababbleSelector);
                    }
                }
            }
        },

    });
});