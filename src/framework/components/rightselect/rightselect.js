/*
 * @license
 *
 * Multiselect v2.1.4
 * http://crlcu.github.io/multiselect/
 *
 * Copyright (c) 2015 Adrian Crisan
 * Licensed under the MIT license (https://github.com/crlcu/multiselect/blob/master/LICENSE)
 */



 Jx().package("T.UI.Components", function(J){

    // 严格模式
    'use strict';

    var defaults = {
        left: '',
        leftAll: '',
        leftSelected: '',
        right: '',
        rightAll: '',
        rightSelected: '',
        undo: '',
        redo: '',

        submitAllLeft: false,   // 在form postback时，将左边的选项全部(选中)提交
        submitAllRight: false,   // 在form postback时，将右边的选项全部(选中)提交

        // dataUrl: 'data-url'
        // keepRenderingSort: false
        

        /** will be executed once - remove from $left all options that are already in $right
         *
         *  @method startUp
        **/
        startUp: function( $left, $right ) {
            $right.find('option').each(function(index, option) {
                $left.find('option[value="' + option.value + '"]').remove();
            });
        },

        /** will be executed each time before moving option[s] to right
         *  
         *  IMPORTANT : this method must return boolean value
         *      true    : continue to moveToRight method
         *      false   : stop
         * 
         *  @method beforeMoveToRight
         *  @attribute $left jQuery object
         *  @attribute $right jQuery object
         *  @attribute options HTML object (the option[s] which was selected to be moved)
         *  
         *  @default true
         *  @return {boolean}
        **/
        beforeMoveToRight: function($left, $right, options) { return true; },

        /*  will be executed each time after moving option[s] to right
         * 
         *  @method afterMoveToRight
         *  @attribute $left jQuery object
         *  @attribute $right jQuery object
         *  @attribute options HTML object (the option[s] which was selected to be moved)
        **/
        afterMoveToRight: function($left, $right, options){},

        /** will be executed each time before moving option[s] to left
         *  
         *  IMPORTANT : this method must return boolean value
         *      true    : continue to moveToRight method
         *      false   : stop
         * 
         *  @method beforeMoveToLeft
         *  @attribute $left jQuery object
         *  @attribute $right jQuery object
         *  @attribute options HTML object (the option[s] which was selected to be moved)
         *  
         *  @default true
         *  @return {boolean}
        **/
        beforeMoveToLeft: function($left, $right, option){ return true; },

        /*  will be executed each time after moving option[s] to left
         * 
         *  @method afterMoveToLeft
         *  @attribute $left jQuery object
         *  @attribute $right jQuery object
         *  @attribute options HTML object (the option[s] which was selected to be moved)
        **/
        afterMoveToLeft: function($left, $right, option){},

        /** sort options by option text
         * 
         *  @method sort
         *  @attribute a HTML option
         *  @attribute b HTML option
         *
         *  @return 1/-1
        **/
        sort: function(a, b) {
            if (a.innerHTML == 'NA') {
                return 1;   
            } else if (b.innerHTML == 'NA') {
                return -1;   
            }
            
            return (a.innerHTML > b.innerHTML) ? 1 : -1;
        }
    };

    var attributeMap = {
        left: 'left',
        leftAll: 'left-all',
        leftSelected: 'left-selected',
        right: 'right',
        rightSelected: 'right-selected',
        rightAll: 'right-all',
        // dataUrl: 'data-url'
    };

    this.RightSelect = new J.Class({extend : T.UI.BaseControl}, {
        defaults : defaults,
        attributeMap : attributeMap,

        // Vars
        undoStack: [],
        redoStack: [],

        init: function(element, options){
            this.element = $(element);

            // 防止多次初始化
            if (this.isInitialized()) { 
                return this.getRef(); 
            }
            this.initialize(element);

            // this.settings,
            // this.container,
            // this.elements,

            // this.value = this.element.val();   

            // 初始化选项
            this.initSettings(options);
            // 初始化默认相关控件id
            var id = this.element.prop('id');
            this.settings.left= this.settings.left.length ? this.settings.left : '#' + id + '_leftSelect';
            this.settings.leftSelected= this.settings.leftSelected.length ? this.settings.leftSelected : '#' + id + '_leftSelected';
            this.settings.leftAll= this.settings.leftAll.length ? this.settings.leftAll : '#' + id + '_leftAll';
            this.settings.right= this.settings.right.length ? this.settings.right : '#' + id + '_rightSelect';
            this.settings.rightSelected= this.settings.rightSelected.length ? this.settings.rightSelected : '#' + id + '_rightSelected';
            this.settings.rightAll= this.settings.rightAll.length ? this.settings.rightAll : '#' + id + '_rightAll';
            this.settings.undo= this.settings.undo.length ? this.settings.undo : '#' + id + '_undo';
            this.settings.redo= this.settings.redo.length ? this.settings.redo : '#' + id + '_redo';

            // this.undoStack = [];
            // this.redoStack = [];            
            
            // var context= this;

            // 构建html DOM
            this.buildHtml();

            // 初始化 html DOM 元素
            this.initElements();

            // 绑定事件
            this.bindEvents();
            // // 绑定事件接口
            // this.bindEventsInterface();

            // this.initialized();

            // this.reflash();

            if (this.settings.keepRenderingSort) {

                this.settings.sort = function(a, b) {
                    return $(a).data('position') > $(b).data('position') ? 1 : -1;
                };

                this.elements.left.find('option').each(function(index, option) {
                    $(option).data('position', index);
                });

                this.elements.right.find('option').each(function(index, option) {
                    $(option).data('position', index);
                });
            }
            
            // // 初始化数据
            // $.when(this.getData())
            //  .done(function(){
                
            //     context.setInitialStates({ nodes: context.tree }, 0);
            //     context.reflash();

            //     context.bindEvents();
            //     context.initialized();
            // });

            // this.transferAttributes();            
        },
        buildHtml: function(){
            var searchTemplate = '<input type="text" name="q" class="form-control" placeholder="Search..." />';
            // search_right: '<input type="text" name="q" class="form-control" placeholder="Search..." />',

            if (this.settings.search_left) {
                // this.element.before($(searchTemplate));
                $( this.settings.left ).before($(searchTemplate));
            }

            if (this.settings.search_right) {
                $( this.settings.right ).before($(searchTemplate));
            }
        },
        initElements: function(){
            this.elements= {
                original: this.element, // left

                left           : $( this.settings.left ),
                leftSelected    : $( this.settings.leftSelected ),
                rightSelected   : $( this.settings.rightSelected ),
                right           : $( this.settings.right ),
                leftAll         : $( this.settings.leftAll ),
                rightAll        : $( this.settings.rightAll ),

                undo            : $( this.settings.undo ),
                redo            : $( this.settings.redo )
            };

            if (this.settings.search_left) {
                this.elements.search_left = this.elements.left.prev();    // $(this.settings.search_left);
            }

            if (this.settings.search_right) {
                this.elements.search_right = this.elements.right.prev();     // $(this.settings.search_right);
            }

            // 将右边select有的option，在左边移除
            if ( typeof this.settings.startUp == 'function' ) {
                this.settings.startUp( this.elements.left, this.elements.right );
            }
            
            // 排序
            if ( this.settings.keepRenderingSort && typeof this.settings.sort == 'function' ) {
                this.elements.left.find('option')
                    .sort(this.settings.sort)
                    .appendTo(this.elements.left);
                
                this.elements.right
                    .each(function(i, select) {
                        // 右边可能有多个
                        if($(select).find('option').length === 0){
                            return;
                        }
                        $(select).find('option')
                            .sort(this.settings.sort)
                            .appendTo(select);
                    });
            }
        },
        bindEvents: function() {
            var context = this;
            
            this.elements.left.on('dblclick', 'option', function(e) {
                e.preventDefault();
                context.moveToRight(this, e);
            });
            
            this.elements.right.on('dblclick', 'option', function(e) {
                e.preventDefault();
                context.moveToLeft(this, e);
            });

            // append left filter
            if (this.elements.search_left) {
                this.elements.search_left.on('keyup', $.proxy(this._filteOptions, this, this.elements.left));
            }

            // append right filter
            if (this.elements.search_right) {
                this.elements.search_right.on('keyup', $.proxy(this._filteOptions, this, this.elements.right));
            }

            // select all the options from left and right side
            // when submiting the parent form
            this.elements.right.closest('form').on('submit', function(e) {
                this.elements.left.children().prop('selected', this.settings.submitAllLeft);
                context.right.children().prop('selected', this.settings.submitAllRight);
            });
            
            // dblclick support for IE
            if (navigator.userAgent.match(/MSIE/i)  || 
                navigator.userAgent.indexOf('Trident/') > 0 || 
                navigator.userAgent.indexOf('Edge/') > 0) {
                this.elements.left.dblclick(function(e) {
                    context.elements.rightSelected.trigger('click');
                });
                
                this.elements.right.dblclick(function(e) {
                    context.elements.leftSelected.trigger('click');
                });
            }
            
            this.elements.rightSelected.on('click', function(e) {
                e.preventDefault();
                var options = context.elements.left.find('option:selected');
                
                if ( options ) {
                    context.moveToRight(options, e);
                }

                $(this).blur();
            });
            
            this.elements.leftSelected.on('click', function(e) {
                e.preventDefault();
                var options = context.elements.right.find('option:selected');
                
                if ( options ) {
                    context.moveToLeft(options, e);
                }

                $(this).blur();
            });
            
            this.elements.rightAll.on('click', function(e) {
                e.preventDefault();
                var options = context.elements.left.find('option');
                
                if ( options ) {
                    context.moveToRight(options, e);
                }

                $(this).blur();
            });
            
            this.elements.leftAll.on('click', function(e) {
                e.preventDefault();
                
                var options = context.elements.right.find('option');
                
                if ( options ) {
                    context.moveToLeft(options, e);
                }

                $(this).blur();
            });

            this.elements.undo.on('click', function(e) {
                e.preventDefault();

                context.undo(e);
            });

            this.elements.redo.on('click', function(e) {
                e.preventDefault();

                context.redo(e);
            });
        },
        _filteOptions: function(filterSelect, e) {
            var regex = new RegExp($(e.target).val(),"ig");

            // 兼容ie隐藏 select option
            if (navigator.userAgent.match(/MSIE/i)  || 
                        navigator.userAgent.indexOf('Trident/') > 0 || 
                        navigator.userAgent.indexOf('Edge/') > 0) {
                filterSelect.find('option, span').each(function(i, item) {
                    var jqItem = $(item);
                    if (jqItem.text().search(regex) >= 0) {
                        // 显示
                        if(jqItem.is('option')){
                            return;
                        }
                        if (jqItem.data('ref') ){
                            jqItem.replaceWith( jqItem.data('ref') )
                        }                                
                    } else {
                        // 隐藏
                        if(jqItem.is('span')){
                            return;
                        }
                        var text = jqItem.text(), 
                            val = jqItem.val(), 
                            span = $('<span/>').text(text).val(val).hide()
                                
                        var old = jqItem.clone();
                        jqItem.replaceWith( span );
                        span.data('ref', old);
                    }
                });

                return;
            }
            
            filterSelect.find('option').each(function(i, option) {
                if (option.text.search(regex) >= 0) {
                    $(option).show();
                } else {
                    $(option).hide();
                }
            });                    
        },
        moveToRight: function( options, event, silent, skipStack ) {
            if ( typeof this.settings.moveToRight == 'function' ) {
                this.settings.moveToRight( this, options, event, silent, skipStack );
            } else {
                if ( typeof this.settings.beforeMoveToRight == 'function' && !silent ) {
                    if ( !this.settings.beforeMoveToRight( this.elements.left, this.elements.right, options ) ) {
                        return false;
                    }
                }
                
                this.elements.right.append(options);

                if ( !skipStack ) {
                    this.undoStack.push(['right', options ]);
                    this.redoStack = [];
                }
                
                if ( typeof this.settings.sort == 'function' && !silent ) {
                    this.elements.right.find('option').sort(this.settings.sort).appendTo(this.elements.right);
                }
                
                if ( typeof this.settings.afterMoveToRight == 'function' && !silent ){
                    this.settings.afterMoveToRight( this.elements.left, this.elements.right, options );
                }
            }
        },
        
        moveToLeft: function( options, event, silent, skipStack ) {            
            if ( typeof this.settings.moveToLeft == 'function' ) {
                this.settings.moveToLeft( this, options, event, silent, skipStack );
            } else {
                if ( typeof this.settings.beforeMoveToLeft == 'function' && !silent ) {
                    if ( !this.settings.beforeMoveToLeft( this.elements.left, this.elements.right, options ) ) {
                        return false;
                    }
                }
                    
                this.elements.left.append(options);
                
                if ( !skipStack ) {
                    this.undoStack.push(['left', options ]);
                    this.redoStack = [];
                }
                
                if ( typeof this.settings.sort == 'function' && !silent ) {
                    this.elements.left.find('option').sort(this.settings.sort).appendTo(this.elements.left);     
                }
                
                if ( typeof this.settings.afterMoveToLeft == 'function' && !silent ) {
                    this.settings.afterMoveToLeft( this.elements.left, this.elements.right, options );
                }
            }
        },

        undo: function(event) {
            var last = this.undoStack.pop();

            if ( last ) {
                this.redoStack.push(last);

                switch(last[0]) {
                    case 'left':
                        this.moveToRight(last[1], event, false, true);
                        break;
                    case 'right':
                        this.moveToLeft(last[1], event, false, true);
                        break;
                }
            }
        },
        redo: function(event) {
            var last = this.redoStack.pop();

            if ( last ) {
                this.undoStack.push(last);

                switch(last[0]) {
                    case 'left':
                        this.moveToLeft(last[1], event, false, true);
                        break;
                    case 'right':
                        this.moveToRight(last[1], event, false, true);
                        break;
                }
            }
        }
    });
});



(function($) {
    // 严格模式
    'use strict';

    // 控件类名
    var pluginName = 'rightselect';

    // 胶水代码
    var pluginRef = 'plugin-ref'
    $.fn[pluginName] = function(options) {
        this.each(function () {
            var plugin=new T.UI.Components.RightSelect(this, $.extend(true, {}, options));
        });

        return this;
    };

})(jQuery);