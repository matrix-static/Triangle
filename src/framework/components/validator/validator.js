/*!
 * jQuery Validation Plugin v1.14.0
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2015 Jörn Zaefferer
 * Released under the MIT license
 */
(function($) {

    // Custom selectors
    $.extend( $.expr[ ":" ], {
        // http://jqueryvalidation.org/blank-selector/
        blank: function( a ) {
            return !$.trim( "" + $( a ).val() );
        },
        // http://jqueryvalidation.org/filled-selector/
        filled: function( a ) {
            return !!$.trim( "" + $( a ).val() );
        },
        // http://jqueryvalidation.org/unchecked-selector/
        unchecked: function( a ) {
            return !$( a ).prop( "checked" );
        }
    });


    // ajax mode: abort
    // usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
    // if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()

    var pendingRequests = {},
        ajax;
    // Use a prefilter if available (1.5+)
    if ( $.ajaxPrefilter ) {
        $.ajaxPrefilter(function( settings, _, xhr ) {
            var port = settings.port;
            if ( settings.mode === "abort" ) {
                if ( pendingRequests[port] ) {
                    pendingRequests[port].abort();
                }
                pendingRequests[port] = xhr;
            }
        });
    } else {
        // Proxy ajax
        ajax = $.ajax;
        $.ajax = function( settings ) {
            var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
                port = ( "port" in settings ? settings : $.ajaxSettings ).port;
            if ( mode === "abort" ) {
                if ( pendingRequests[port] ) {
                    pendingRequests[port].abort();
                }
                pendingRequests[port] = ajax.apply(this, arguments);
                return pendingRequests[port];
            }
            return ajax.apply(this, arguments);
        };
    }

})(jQuery);


Jx().package("T.UI.Components", function(J){
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
        messages: {},
        groups: {},
        rules: {},
        errorClass: "error",
        validClass: "valid",
        errorElement: "label",
        focusCleanup: false,
        focusInvalid: true,
        errorContainer: $( [] ),
        errorLabelContainer: $( [] ),
        onsubmit: true,
        ignore: ":hidden"
    };

    // // http://jqueryvalidation.org/jQuery.validator.setDefaults/
    // setDefaults: function( settings ) {
    //     $.extend( $.validator.defaults, settings );
    // },

    var messages = {
        required: "这是必填字段",
        remote: "请修正此字段",
        email: "请输入有效的电子邮件地址",
        url: "请输入有效的网址",
        date: "请输入有效的日期",
        dateISO: "请输入有效的日期 (YYYY-MM-DD)",
        number: "请输入有效的数字",
        digits: "只能输入数字",
        creditcard: "请输入有效的信用卡号码",
        equalTo: "两次输入不相同",
        extension: "请输入有效的后缀",
        maxlength: "最多可以输入 {0} 个字符",
        minlength: "最少要输入 {0} 个字符",
        rangelength: "请输入长度在 {0} 到 {1} 之间的字符串",
        range: "请输入范围在 {0} 到 {1} 之间的数值",
        max: "请输入不大于 {0} 的数值",
        min: "请输入不小于 {0} 的数值"
    };

    var methods = {

        // http://jqueryvalidation.org/required-method/
        required: function( value, element, param ) {
            var mismatch;
            var tp= typeof param; 
            switch(tp){
                case 'boolean':{
                    mismatch= param;
                    break;
                }
                case 'string':{
                    // required: "#other:checked"
                    mismatch= !!$( param, this.element ).length;
                    break;
                }
                case 'function':{
                    // required: function(element) {
                    //     return $("#age").val() < 13;
                    // }
                    mismatch= param( element );
                    break;
                }
                default:{
                    mismatch= true;
                }
            }
            // check if dependency is met
            if ( !mismatch ) {
                return "dependency-mismatch";
            }


            if ( element.nodeName.toLowerCase() === "select" ) {
                // could be an array for select-multiple or a string, both are fine this way
                var val = $( element ).val();
                return val && val.length > 0;
            }
            if ( this.checkable( element ) ) {
                return this.getLength( value, element ) > 0;
            }
            return value.length > 0;
        },

        // http://jqueryvalidation.org/email-method/
        email: function( value, element ) {
            // From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
            // Retrieved 2014-01-14
            // If you have a problem with this implementation, report a bug against the above spec
            // Or use custom methods to implement your own email validation
            return this.optional( element ) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
        },

        // http://jqueryvalidation.org/url-method/
        url: function( value, element ) {
            // var sRegExp= ''+
            //     '^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)'+
            //     '(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}'+
            //     '(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*'+
            //     '[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$';

            // var regExp= new RegExp(sRegExp);

            // Copyright (c) 2010-2013 Diego Perini, MIT licensed
            // https://gist.github.com/dperini/729294
            // see also https://mathiasbynens.be/demo/url-regex
            // modified to allow protocol-relative URLs
            return this.optional( element ) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );     // jshint ignore:line
        },

        // http://jqueryvalidation.org/date-method/
        date: function( value, element ) {
            return this.optional( element ) || !/Invalid|NaN/.test( new Date( value ).toString() );
        },

        // http://jqueryvalidation.org/dateISO-method/
        dateISO: function( value, element ) {
            return this.optional( element ) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test( value );
        },

        // http://jqueryvalidation.org/number-method/
        number: function( value, element ) {
            return this.optional( element ) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( value );
        },

        // http://jqueryvalidation.org/digits-method/
        digits: function( value, element ) {
            return this.optional( element ) || /^\d+$/.test( value );
        },

        // http://jqueryvalidation.org/minlength-method/
        minlength: function( value, element, param ) {
            var length = $.isArray( value ) ? value.length : this.getLength( value, element );
            return this.optional( element ) || length >= param;
        },

        // http://jqueryvalidation.org/maxlength-method/
        maxlength: function( value, element, param ) {
            var length = $.isArray( value ) ? value.length : this.getLength( value, element );
            return this.optional( element ) || length <= param;
        },

        // http://jqueryvalidation.org/rangelength-method/
        rangelength: function( value, element, param ) {
            var length = $.isArray( value ) ? value.length : this.getLength( value, element );
            return this.optional( element ) || ( length >= param[ 0 ] && length <= param[ 1 ] );
        },

        // http://jqueryvalidation.org/min-method/
        min: function( value, element, param ) {
            return this.optional( element ) || value >= param;
        },

        // http://jqueryvalidation.org/max-method/
        max: function( value, element, param ) {
            return this.optional( element ) || value <= param;
        },

        // http://jqueryvalidation.org/range-method/
        range: function( value, element, param ) {
            return this.optional( element ) || ( value >= param[ 0 ] && value <= param[ 1 ] );
        },

        // http://jqueryvalidation.org/equalTo-method/
        equalTo: function( value, element, param ) {
            // bind to the blur event of the target in order to revalidate whenever the target field is updated
            // TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
            var target = $( param );
            // if ( this.settings.onfocusout ) {
            //     target.off( ".validate-equalTo" ).on( "blur.validate-equalTo", function() {
            //         $( element ).valid();
            //         // valid = this.validate().form();
            //         validator.checkElement( this );
            //     });
            // }
            return value === target.val();
        },

        // http://jqueryvalidation.org/remote-method/
        remote: function( value, element, param ) {
            if ( this.optional( element ) ) {
                return "dependency-mismatch";
            }

            var previous = this.previousValue( element ),
                context, data;

            if (!this.settings.messages[ element.name ] ) {
                this.settings.messages[ element.name ] = {};
            }
            previous.originalMessage = this.settings.messages[ element.name ].remote;
            this.settings.messages[ element.name ].remote = previous.message;

            param = typeof param === "string" && { url: param } || param;

            if ( previous.old === value ) {
                return previous.valid;
            }

            previous.old = value;
            context = this;
            this.startRequest( element );
            data = {};
            data[ element.name ] = value;
            $.ajax( $.extend( true, {
                mode: "abort",
                port: "validate" + element.name,
                dataType: "json",
                data: data,
                context: context.currentForm,
                success: function( response ) {
                    var valid = response === true || response === "true",
                        errors, message, submitted;

                    context.settings.messages[ element.name ].remote = previous.originalMessage;
                    if ( valid ) {
                        submitted = context.formSubmitted;
                        context.prepareElement( element );
                        context.formSubmitted = submitted;
                        context.successList.push( element );
                        delete context.invalid[ element.name ];
                        context.showErrors();
                    } else {
                        errors = {};
                        message = response || context.defaultMessage( element, "remote" );
                        errors[ element.name ] = previous.message = $.isFunction( message ) ? message( value ) : message;
                        context.invalid[ element.name ] = true;
                        context.showErrors( errors );
                    }
                    previous.valid = valid;
                    context.stopRequest( element, valid );
                }
            }, param ) );
            return "pending";
        }
    };

    function objectLength( obj ) {
        /* jshint unused: false */
        var count = 0;
        for (var i in obj ) { count++; }
        return count;
    }

    this.Validator = new J.Class({
        defaults: defaults,
        // attributeMap: attributeMap,

        autoCreateRanges: false,

        settings: {},

        // 构造函数
        init: function(element, options){
            this.element=$(element);

            // this.settings = $.extend( true, {}, $.validator.defaults, options );
            // this.currentForm = form;
            this.settings = $.extend( true, {}, defaults, options );
            this.currentForm = element;

            // // 防止多次初始化
            // if (this.isInitialized()) { 
            //     return this.getRef(); 
            // }
            // this.initialize(element);

            // this.initSettings(options);
            // this.value= this.element.val();

            this.labelContainer = $( this.settings.errorLabelContainer );
            this.errorContext = this.labelContainer.length && this.labelContainer || this.element;
            this.containers = $( this.settings.errorContainer ).add( this.settings.errorLabelContainer );
            this.submitted = {};
            this.valueCache = {};
            this.pendingRequest = 0;
            this.pending = {};
            this.invalid = {};
            this.reset();

            var groups = ( this.groups = {} );
            var rules;
            $.each( this.settings.groups, function( key, value ) {
                if ( typeof value === "string" ) {
                    value = value.split( /\s/ );
                }
                $.each( value, function( index, name ) {
                    groups[ name ] = key;
                });
            });

            // this.buildHtml();
            this.initElements();

            this.bindEvents();
            // this.bindEventsInterface();
        },

        // 模板模式 方法
        buildHtml: function(){},
        initElements: function(){
            var context= this;

            this.elements= {
                original: this.element,
                currentElements: function(){
                // 有可能中途disabled，插入元素等。
                    var rulesCache = {};
                    var currentElements= context.element
                        .find( "input, select, textarea" )
                        .not( ":submit, :reset, :image, :disabled" )
                        .not( context.settings.ignore )
                        .filter( function() {
                            // add by matrix
                            var data= context.settings.rules[ this.name ];

                            // select only the first element for each name, and only those with rules specified
                            // if ( this.name in rulesCache || !validator.objectLength( $( this ).rules() ) ) {
                            if ( this.name in rulesCache || !objectLength( data ) ) {
                                return false;
                            }

                            rulesCache[ this.name ] = true;
                            return true;
                        });

                    return currentElements;
                }
                // view: $('input[type=text]', this.container)
                // getTab: function(levelIndex){
                //     var tabSelector='.t-level-tab-'+levelIndex;
                //     return $(tabSelector, context.container);
                // }
            };

            // findByName
        },
        bindEvents: function(){
            var context= this;
            var element= this.element;

            element.on( "click.validate", ":submit", function( event ) {
                if ( context.settings.submitHandler ) {
                    context.submitButton = event.target;
                }

                // allow suppressing validation by adding a cancel class to the submit button
                if ( context.element.hasClass( "cancel" ) ) {
                    context.cancelSubmit = true;
                }

                // allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
                if ( context.element.attr( "formnovalidate" ) !== undefined ) {
                    context.cancelSubmit = true;
                }
            });

            // validate the form on submit
            element.on( "submit.validate", function( event ) {
                function handle() {
                    var hidden, result;
                    if ( context.settings.submitHandler ) {
                        if ( context.submitButton ) {
                            // insert a hidden input as a replacement for the missing submit button
                            hidden = $( "<input type='hidden'/>" )
                                .attr( "name", context.submitButton.name )
                                .val( $( context.submitButton ).val() )
                                .appendTo( context.currentForm );
                        }
                        result = context.settings.submitHandler.call( context, context.element, event );
                        if ( context.submitButton ) {
                            // and clean up afterwards; thanks to no-block-scope, hidden can be referenced
                            hidden.remove();
                        }
                        if ( result !== undefined ) {
                            return result;
                        }
                        return false;
                    }
                    return true;
                }

                // prevent submit for invalid forms or custom submit handlers
                if ( context.cancelSubmit ) {
                    context.cancelSubmit = false;
                    return handle();
                }
                if ( context.form() ) {
                    if ( context.pendingRequest ) {
                        context.formSubmitted = true;
                        return false;
                    }
                    return handle();
                } else {
                    context.focusInvalid();
                    return false;
                }
            });

            // add by matrix
            var context= this;
            function delegate( event ) {
                var eventType = "on" + event.type.replace( /^validate/, "" );
                if ( context[ eventType ] && !$( this ).is( context.settings.ignore ) ) {      // jshint ignore:line
                    context[ eventType ].call( context, this, event );               // jshint ignore:line
                }
            }

            this.element
                .on( "focusin.validate focusout.validate keyup.validate",
                    ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " +
                    "[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " +
                    "[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " +
                    "[type='radio'], [type='checkbox']", delegate)
                // Support: Chrome, oldIE
                // "select" is provided as event.target when clicking a option
                .on("click.validate", "select, option, [type='radio'], [type='checkbox']", delegate);

            if ( this.settings.invalidHandler ) {
                // this.element.on( "invalid-form.validate", this.settings.invalidHandler );
                this.element.on( "invalid-form.validate", $.proxy(this.settings.invalidHandler, this) );
            }

            // element.on('click', $.proxy(this.onFooClick, this));
        },
        // bindEventsInterface: function(){
        //     var context= this;
        //     var element= this.element;

        //     if(this.settings.onFooSelected){
        //         element.on('click.t.template', $.proxy(this.settings.onFooSelected, this));
        //     }
        // },
        onfocusin: function( element ) {
            this.lastActive = element;

            // Hide error label and remove error class on focus if enabled
            if ( this.settings.focusCleanup ) {
                this.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
                this.hideThese( this.errorsFor( element ) );
            }
        },
        onfocusout: function( element ) {
            if ( !this.checkable( element ) && ( element.name in this.submitted || !this.optional( element ) ) ) {
                this.checkElement( element );
            }
        },
        onkeyup: function( element, event ) {
            // Avoid revalidate the field when pressing one of the following keys
            // Shift       => 16
            // Ctrl        => 17
            // Alt         => 18
            // Caps lock   => 20
            // End         => 35
            // Home        => 36
            // Left arrow  => 37
            // Up arrow    => 38
            // Right arrow => 39
            // Down arrow  => 40
            // Insert      => 45
            // Num lock    => 144
            // AltGr key   => 225
            var excludedKeys = [
                16, 17, 18, 20, 35, 36, 37,
                38, 39, 40, 45, 144, 225
            ];

            if ( event.which === 9 && this.getValue( element ) === "" || $.inArray( event.keyCode, excludedKeys ) !== -1 ) {
                return;
            } else if ( element.name in this.submitted || element === this.lastElement ) {
                this.checkElement( element );
            }
        },
        onclick: function( element ) {
            // click on selects, radiobuttons and checkboxes
            if ( element.name in this.submitted ) {
                this.checkElement( element );

            // or option elements, check parent select in that case
            } else if ( element.parentNode.name in this.submitted ) {
                this.checkElement( element.parentNode );
            }
        },

        // 事件处理
        // onFooClick: function(e, data){
        //     ;
        // },

        // http://jqueryvalidation.org/Validator.form/
        form: function() {
            this.checkForm();
            $.extend( this.submitted, this.errorMap );
            this.invalid = $.extend({}, this.errorMap );
            if ( !this.valid() ) {
                this.element.triggerHandler( "invalid-form", [ this ]);
            }
            this.showErrors();
            return this.valid();
        },

        checkForm: function() {
            this.prepareForm();
            var elements= this.currentElements = this.elements.currentElements();
            for ( var i = 0; elements[ i ]; i++ ) {
                this.check( elements[ i ] );
            }
            return this.valid();
        },

        // http://jqueryvalidation.org/Validator.element/
        checkElement: function( element ) {
            var cleanElement = this.clean( element ),
                checkElement = this.validationTargetFor( cleanElement ),
                result = true;

            this.lastElement = checkElement;

            if ( checkElement === undefined ) {
                delete this.invalid[ cleanElement.name ];
            } else {
                this.prepareElement( checkElement );
                this.currentElements = $( checkElement );

                result = this.check( checkElement ) !== false;
                if ( result ) {
                    delete this.invalid[ checkElement.name ];
                } else {
                    this.invalid[ checkElement.name ] = true;
                }
            }
            if ( !this.numberOfInvalids() ) {
                // Hide error containers on last error
                this.toHide = this.toHide.add( this.containers );
            }
            this.showErrors();
            return result;
        },

        // http://jqueryvalidation.org/Validator.showErrors/
        showErrors: function( errors ) {
            if ( errors ) {
                // add items to error list and map
                $.extend( this.errorMap, errors );
                this.errorList = [];
                for ( var name in errors ) {
                    this.errorList.push({
                        message: errors[ name ],
                        element: this.findByName( name )[ 0 ]
                    });
                }
                // remove items from success list
                this.successList = $.grep( this.successList, function( element ) {
                    return !( element.name in errors );
                });
            }
            this.defaultShowErrors();
        },

        // http://jqueryvalidation.org/Validator.resetForm/
        resetForm: function() {
            if ( $.fn.resetForm ) {
                $( this.currentForm ).resetForm();
            }
            this.submitted = {};
            this.lastElement = null;
            this.prepareForm();
            this.hideErrors();
            var i, elements = this.elements.currentElements()
                .removeData( "previousValue" );

            for ( i = 0; elements[ i ]; i++ ) {
                this.unhighlight.call( this, elements[ i ], this.settings.errorClass, "" );
            }
        },

        numberOfInvalids: function() {
            return objectLength( this.invalid );
        },

        hideErrors: function() {
            this.hideThese( this.toHide );
        },

        hideThese: function( errors ) {
            errors.not( this.containers ).text( "" );
            this.addWrapper( errors ).hide();
        },

        valid: function() {
            return this.errorList.length === 0;
        },

        focusInvalid: function() {
            if ( this.settings.focusInvalid ) {
                try {
                    $( this.findLastActive() || this.errorList.length && this.errorList[ 0 ].element || [])
                    .filter( ":visible" )
                    .focus()
                    // manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
                    .trigger( "focusin" );
                } catch ( e ) {
                    // ignore IE throwing errors when focusing hidden elements
                }
            }
        },

        findLastActive: function() {
            var lastActive = this.lastActive;
            return lastActive && $.grep( this.errorList, function( n ) {
                return n.element.name === lastActive.name;
            }).length === 1 && lastActive;
        },

        clean: function( selector ) {
            return $( selector )[ 0 ];
        },

        errors: function() {
            var errorClass = this.settings.errorClass.split( " " ).join( "." );
            return $( this.settings.errorElement + "." + errorClass, this.errorContext );
        },

        reset: function() {
            this.successList = [];
            this.errorList = [];
            this.errorMap = {};
            this.toShow = $( [] );
            this.toHide = $( [] );
            this.currentElements = $( [] );
        },

        prepareForm: function() {
            this.reset();
            this.toHide = this.errors().add( this.containers );
        },

        prepareElement: function( element ) {
            this.reset();
            this.toHide = this.errorsFor( element );
        },

        

        check: function( element ) {
            element = this.validationTargetFor( this.clean( element ) );

            // add by matrix
            var data= this.settings.rules[ element.name ];

            // var rules = $( element ).rules(),
            var rules = data;
            var rulesCount= objectLength(rules);
            var dependencyMismatch = false;
            var val = this.getValue( element );

            for (var method in rules ) {
                var rule = { method: method, parameters: rules[ method ] };
                // result = $.validator.methods[ method ].call( this, val, element, rule.parameters );
                var result = methods[ method ].call( this, val, element, rule.parameters );

                // this.optional( element )
                // var val = this.getValue( element );
                // return !methods.required.call( this, val, element ) && "dependency-mismatch";


                // if a method indicates that the field is optional and therefore valid,
                // don't mark it as valid when there are no other rules
                if ( result === "dependency-mismatch" && rulesCount === 1 ) {
                    dependencyMismatch = true;
                    continue;
                }
                dependencyMismatch = false;

                if ( result === "pending" ) {
                    this.toHide = this.toHide.not( this.errorsFor( element ) );
                    return;
                }

                if ( !result ) {
                    this.formatAndAdd( element, rule );
                    return false;
                }
            }
            if ( dependencyMismatch ) {
                return;
            }
            if ( objectLength( rules ) ) {
                this.successList.push( element );
            }
            return true;
        },

        defaultMessage: function( element, method ) {
            var msg;

            // 自定义消息
            // msg= this.customMessage( element.name, method );
            var m = this.settings.messages[ name ];
            msg= m && ( m.constructor === String ? m : m[ method ]);            
            if(msg !== undefined){ return msg; }

            // 默认消息
            msg= messages[ method ];
            if(msg !== undefined){ return msg; }

            // 未定义消息
            msg= "<strong>Warning: No message defined for " + element.name + "</strong>";
            return msg;
        },

        formatAndAdd: function( element, rule ) {
            var message = this.defaultMessage( element, rule.method ),
                theregex = /\$?\{(\d+)\}/g;
            if ( typeof message === "function" ) {
                message = message.call( this, rule.parameters, element );
            } else if ( theregex.test( message ) ) {
                // message = $.validator.format( message.replace( theregex, "{$1}" ), rule.parameters );
                message = String.format( message.replace( theregex, "{$1}" ), rule.parameters );
            }
            this.errorList.push({
                message: message,
                element: element,
                method: rule.method
            });

            this.errorMap[ element.name ] = message;
            this.submitted[ element.name ] = message;
        },

        addWrapper: function( toToggle ) {
            if ( this.settings.wrapper ) {
                toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
            }
            return toToggle;
        },

        defaultShowErrors: function() {
            var i, elements, error;
            for ( i = 0; this.errorList[ i ]; i++ ) {
                error = this.errorList[ i ];
                this.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
                this.showLabel( error.element, error.message );
            }
            if ( this.errorList.length ) {
                this.toShow = this.toShow.add( this.containers );
            }
            if ( this.settings.success ) {
                for ( i = 0; this.successList[ i ]; i++ ) {
                    this.showLabel( this.successList[ i ] );
                }
            }
            for ( i = 0, elements = this.validElements(); elements[ i ]; i++ ) {
                this.unhighlight.call( this, elements[ i ], this.settings.errorClass, this.settings.validClass );
            }
            this.toHide = this.toHide.not( this.toShow );
            this.hideErrors();
            this.addWrapper( this.toShow ).show();
        },
        highlight: function( element, errorClass, validClass ) {
            if ( element.type === "radio" ) {
                this.findByName( element.name ).addClass( errorClass ).removeClass( validClass );
            } else {
                $( element ).addClass( errorClass ).removeClass( validClass );
            }
        },
        unhighlight: function( element, errorClass, validClass ) {
            if ( element.type === "radio" ) {
                this.findByName( element.name ).removeClass( errorClass ).addClass( validClass );
            } else {
                $( element ).removeClass( errorClass ).addClass( validClass );
            }
        },
        validElements: function() {
            return this.currentElements.not( this.invalidElements() );
        },

        invalidElements: function() {
            return $( this.errorList ).map(function() {
                return this.element;
            });
        },

        showLabel: function( element, message ) {
            var place, group, errorID,
                error = this.errorsFor( element ),
                elementID = this.idOrName( element ),
                describedBy = $( element ).attr( "aria-describedby" );
            if ( error.length ) {
                // refresh error/success class
                error.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );
                // replace message on existing label
                error.html( message );
            } else {
                // create error element
                error = $( "<" + this.settings.errorElement + ">" )
                    .attr( "id", elementID + "-error" )
                    .addClass( this.settings.errorClass )
                    .html( message || "" );

                // Maintain reference to the element to be placed into the DOM
                place = error;
                if ( this.settings.wrapper ) {
                    // make sure the element is visible, even in IE
                    // actually showing the wrapped element is handled elsewhere
                    place = error.hide().show().wrap( "<" + this.settings.wrapper + "/>" ).parent();
                }
                if ( this.labelContainer.length ) {
                    this.labelContainer.append( place );
                } else if ( this.settings.errorPlacement ) {
                    this.settings.errorPlacement( place, $( element ) );
                } else {
                    place.insertAfter( element );
                }

                // Link error back to the element
                if ( error.is( "label" ) ) {
                    // If the error is a label, then associate using 'for'
                    error.attr( "for", elementID );
                } else if ( error.parents( "label[for='" + elementID + "']" ).length === 0 ) {
                    // If the element is not a child of an associated label, then it's necessary
                    // to explicitly apply aria-describedby

                    errorID = error.attr( "id" ).replace( /(:|\.|\[|\]|\$)/g, "\\$1");
                    // Respect existing non-error aria-describedby
                    if ( !describedBy ) {
                        describedBy = errorID;
                    } else if ( !describedBy.match( new RegExp( "\\b" + errorID + "\\b" ) ) ) {
                        // Add to end of list if not already present
                        describedBy += " " + errorID;
                    }
                    $( element ).attr( "aria-describedby", describedBy );

                    // If this element is grouped, then assign to all elements in the same group
                    group = this.groups[ element.name ];
                    if ( group ) {
                        $.each( this.groups, function( name, testgroup ) {
                            if ( testgroup === group ) {
                                $( "[name='" + name + "']", this.currentForm )
                                    .attr( "aria-describedby", error.attr( "id" ) );
                            }
                        });
                    }
                }
            }
            if ( !message && this.settings.success ) {
                error.text( "" );
                if ( typeof this.settings.success === "string" ) {
                    error.addClass( this.settings.success );
                } else {
                    this.settings.success( error, element );
                }
            }
            this.toShow = this.toShow.add( error );
        },

        errorsFor: function( element ) {
            var name = this.idOrName( element ),
                describer = $( element ).attr( "aria-describedby" ),
                selector = "label[for='" + name + "'], label[for='" + name + "'] *";

            // aria-describedby should directly reference the error element
            if ( describer ) {
                selector = selector + ", #" + describer.replace( /\s+/g, ", #" );
            }
            return this
                .errors()
                .filter( selector );
        },

        idOrName: function( element ) {
            return this.groups[ element.name ] || ( this.checkable( element ) ? element.name : element.id || element.name );
        },

        validationTargetFor: function( element ) {

            // If radio/checkbox, validate first element in group instead
            if ( this.checkable( element ) ) {
                element = this.findByName( element.name );
            }

            // Always apply ignore filter
            return $( element ).not( this.settings.ignore )[ 0 ];
        },

        checkable: function( element ) {
            return ( /radio|checkbox/i ).test( element.type );
        },

        findByName: function( name ) {
            return this.element.find( "[name='" + name + "']" );
        },

        getValue: function ( element ) {
            var type = element.type;
            var jqElement = $(element);
            if ( type === "radio" || type === "checkbox" ) {
                return this.findByName( element.name ).filter(":checked").val();
            } else if ( type === "number" && typeof element.validity !== "undefined" ) {
                return element.validity.badInput ? false : jqElement.val();
            }

            var val = jqElement.val();
            if ( typeof val === "string" ) {
                return val.replace(/\r/g, "" );
            }
            return val;
        },

        getLength: function( value, element ) {
            switch ( element.nodeName.toLowerCase() ) {
            case "select":
                return $( "option:selected", element ).length;
            case "input":
                if ( this.checkable( element ) ) {
                    return this.findByName( element.name ).filter( ":checked" ).length;
                }
            }
            return value.length;
        },

        // 非必填？
        optional: function( element ) {
            var val = this.getValue( element );
            return !methods.required.call( this, val, element ) && "dependency-mismatch";
        },

        startRequest: function( element ) {
            if ( !this.pending[ element.name ] ) {
                this.pendingRequest++;
                this.pending[ element.name ] = true;
            }
        },

        stopRequest: function( element, valid ) {
            this.pendingRequest--;
            // sometimes synchronization fails, make sure pendingRequest is never < 0
            if ( this.pendingRequest < 0 ) {
                this.pendingRequest = 0;
            }
            delete this.pending[ element.name ];
            if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
                $( this.currentForm ).submit();
                this.formSubmitted = false;
            } else if (!valid && this.pendingRequest === 0 && this.formSubmitted ) {
                this.element.triggerHandler( "invalid-form", [ this ]);
                this.formSubmitted = false;
            }
        },

        previousValue: function( element ) {
            return $.data( element, "previousValue" ) || $.data( element, "previousValue", {
                old: null,
                valid: true,
                message: this.defaultMessage( element, "remote" )
            });
        },

        // API
        reflash: function(){},
        enable: function(){},
        disable: function(){},
        // cleans up all forms and elements, removes validator-specific events
        destroy: function() {
            this.resetForm();

            $( this.currentForm )
                .off( ".validate" )
                .removeData( "validator" );
        }
    });
});