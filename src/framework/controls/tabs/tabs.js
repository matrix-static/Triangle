Jx().package("T.UI.Controls", function(J){
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

    var TRANSITION_DURATION = 150

    this.Tabs = new J.Class({extend: T.UI.BaseControl},{
        defaults: defaults,
        attributeMap: attributeMap,

        settings: {},
        value: '',
        data: {},
        templates: {},

        // 构造函数
        init: function(element, options){
            this.element= $(element);
            this.container= this.element

            // // 防止多次初始化
            // if (this.isInitialized()) { 
            //     return this.getRef(); 
            // }
            // this.initialize(element);

            this.initSettings(options);
            // this.value= this.element.val();

            this.initElements();

             this.bindEvents();
             // this.bindEventsInterface();
        },

        initElements: function(){
            // var context= this;
            this.elements={
                original: this.element,
                tabsContainer: $('ul.nav-tabs', this.container),
                tabs: $('ul.nav-tabs .tab', this.container),
                tabPanes: $('div.tab-pane', this.container)
            };
        },
        show: function (e) {
            e.preventDefault();

            // var $this    = this.element
            var $this= $(e.target);
            // var $ul      = $this.closest('ul:not(.dropdown-menu)')
            var selector = $this.data('s-target')

            if (!selector) {
                selector = $this.attr('href')
                selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
            }

            if ($this.parent('li').hasClass('active')) return

            // var $previous = $ul.find('.active:last a')
            var $previous = this.elements.tabsContainer.find('.active:last a')

            var hideEvent = $.Event('hide.bs.tab', {
                relatedTarget: $this[0]
            })
            var showEvent = $.Event('show.bs.tab', {
                relatedTarget: $previous[0]
            })

            $previous.trigger(hideEvent)
            $this.trigger(showEvent)

            if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

            var $target = $(selector)

            // this.activate($this.closest('li'), $ul)
            this.activate($this.closest('li'), this.elements.tabsContainer)
            this.activate($target, $target.parent(), function () {
                $previous.trigger({
                    type: 'hidden.bs.tab',

                    relatedTarget: $this[0]
                })
                $this.trigger({
                    type: 'shown.bs.tab',
                    relatedTarget: $previous[0]
                })
            })
        },
        activate: function (element, container, callback) {
            var $active    = container.find('> .active');
            var transition = callback
                && $.support.transition
                && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

            function next() {
                $active
                    .removeClass('active')
                    .find('> .dropdown-menu > .active')
                    .removeClass('active')
                    .end()
                    .find('[data-toggle="tab"]')
                    .attr('aria-expanded', false)

                element
                    .addClass('active')
                    .find('[data-toggle="tab"]')
                    .attr('aria-expanded', true)

                if (transition) {
                    element[0].offsetWidth // reflow for transition
                    element.addClass('in')
                } else {
                    element.removeClass('fade')
                }

                if (element.parent('.dropdown-menu').length) {
                    element
                        .closest('li.dropdown')
                        .addClass('active')
                        .end()
                        .find('[data-toggle="tab"]')
                        .attr('aria-expanded', true)
                }

                callback && callback()
            }

            $active.length && transition ?
            $active
                .one('bsTransitionEnd', next)
                .emulateTransitionEnd(TRANSITION_DURATION) : next()

            $active.removeClass('in')
        },
        bindEvents: function(){
            this.elements.tabs.on('click', $.proxy(this.show, this));
        },

        // API
        refresh: function(){},
        enable: function(){},
        disable: function(){},
        destroy: function(){}
    });
});