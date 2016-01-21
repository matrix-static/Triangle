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
    $.extend($.expr[":"], {
        // http://jqueryvalidation.org/blank-selector/
        blank: function(a) {
            return !$.trim("" + $(a).val());
        },
        // http://jqueryvalidation.org/filled-selector/
        filled: function(a) {
            return !!$.trim("" + $(a).val());
        },
        // http://jqueryvalidation.org/unchecked-selector/
        unchecked: function(a) {
            return !$(a).prop("checked");
        }
    });


    // ajax mode: abort
    // usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
    // if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()

    // var pendingRequests = {},
    //     ajax;
    // // Use a prefilter if available (1.5+)
    // if ($.ajaxPrefilter) {
    //     $.ajaxPrefilter(function(settings, _, xhr) {
    //         var port = settings.port;
    //         if (settings.mode === "abort") {
    //             if (pendingRequests[port]) {
    //                 pendingRequests[port].abort();
    //             }
    //             pendingRequests[port] = xhr;
    //         }
    //     });
    // } else {
    //     // Proxy ajax
    //     ajax = $.ajax;
    //     $.ajax = function(settings) {
    //         var mode = ("mode" in settings ? settings : $.ajaxSettings).mode,
    //             port = ("port" in settings ? settings : $.ajaxSettings).port;
    //         if (mode === "abort") {
    //             if (pendingRequests[port]) {
    //                 pendingRequests[port].abort();
    //             }
    //             pendingRequests[port] = ajax.apply(this, arguments);
    //             return pendingRequests[port];
    //         }
    //         return ajax.apply(this, arguments);
    //     };
    // }

})(jQuery);


Jx().package("T.UI.Components", function(J){
    // 严格模式
    'use strict';
    

    var _crrentPluginId = 0;
    // var emptyFun= function(){};
    var defaults = {
        // 选项
        // fooOption: true,
        messages: {},
        // groups: {},
        rules: {},

        focusCleanup: false,
        focusInvalid: true,
        onsubmit: true,
        ignore: ':hidden',  // 忽略掉的 form 元素

        // errorContainer: $([]),
        // errorLabelContainer: $([]),
        errorContainer: '',
        // errorLabelContainer: '<ul></ul>',
        // errorLabelWrapper: '<li></li>',
        // errorPlacement

        errorElement: 'label',
        errorClass: 'error',
        validClass: 'valid',
        // success: '',
        // 覆写 类方法
        // parseData: undefined,
        submitHandler: function(){},
        invalidHandler: function(){}
        // 事件
        // onFooSelected: undefined,
        // onFooChange: function(e, data){}
    };

    // // http://jqueryvalidation.org/jQuery.validator.setDefaults/
    // setDefaults: function(settings) {
    //     $.extend($.validator.defaults, settings);
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
        required: function(value, element, param) {
            var mismatch;
            var tp= typeof param; 
            switch(tp){
                case 'boolean':{
                    mismatch= param;
                    break;
                }
                case 'string':{
                    // required: "#other:checked"
                    mismatch= !!$(param, this.element).length;
                    break;
                }
                case 'function':{
                    // required: function(element) {
                    //     return $("#age").val() < 13;
                    // }
                    mismatch= param(element);
                    break;
                    
                }
                default:{
                    mismatch= true;
                }
            }
            // check if dependency is met
            if (!mismatch) {
                return "dependency-mismatch";
            }


            if (element.nodeName.toLowerCase() === 'select') {
                // could be an array for select-multiple or a string, both are fine this way
                var val = $(element).val();
                return val && val.length > 0;
            }
            if (this.checkable(element)) {
                return this.getLength(value, element) > 0;
            }
            return value.length > 0;
        },

        // http://jqueryvalidation.org/email-method/
        email: function(value, element) {
            // From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
            // Retrieved 2014-01-14
            // If you have a problem with this implementation, report a bug against the above spec
            // Or use custom methods to implement your own email validation
            return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
        },

        // http://jqueryvalidation.org/url-method/
        url: function(value, element) {
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
            return this.optional(element) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);     // jshint ignore:line
        },

        // http://jqueryvalidation.org/date-method/
        date: function(value, element) {
            return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
        },

        // http://jqueryvalidation.org/dateISO-method/
        dateISO: function(value, element) {
            return this.optional(element) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
        },

        // http://jqueryvalidation.org/number-method/
        number: function(value, element) {
            return this.optional(element) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
        },

        // http://jqueryvalidation.org/digits-method/
        digits: function(value, element) {
            return this.optional(element) || /^\d+$/.test(value);
        },

        // http://jqueryvalidation.org/minlength-method/
        minlength: function(value, element, param) {
            var length = $.isArray(value) ? value.length : this.getLength(value, element);
            return this.optional(element) || length >= param;
        },

        // http://jqueryvalidation.org/maxlength-method/
        maxlength: function(value, element, param) {
            var length = $.isArray(value) ? value.length : this.getLength(value, element);
            return this.optional(element) || length <= param;
        },

        // http://jqueryvalidation.org/rangelength-method/
        rangelength: function(value, element, param) {
            var length = $.isArray(value) ? value.length : this.getLength(value, element);
            return this.optional(element) || (length >= param[0] && length <= param[1]);
        },

        // http://jqueryvalidation.org/min-method/
        min: function(value, element, param) {
            return this.optional(element) || value >= param;
        },

        // http://jqueryvalidation.org/max-method/
        max: function(value, element, param) {
            return this.optional(element) || value <= param;
        },

        // http://jqueryvalidation.org/range-method/
        range: function(value, element, param) {
            return this.optional(element) || (value >= param[0] && value <= param[1]);
        },

        // http://jqueryvalidation.org/equalTo-method/
        equalTo: function(value, element, param) {
            // bind to the blur event of the target in order to revalidate whenever the target field is updated
            // TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
            var target = $(param);
            // if (this.settings.onfocusout) {
            //     target.off(".validate-equalTo").on("blur.validate-equalTo", function() {
            //         $(element).valid();
            //         // valid = this.validate().checkForm();
            //         validator.checkElement(this);
            //     });
            // }
            return value === target.val();
        },

        // // http://jqueryvalidation.org/remote-method/
        // remote: function(value, element, param) {
        //     if (this.optional(element)) {
        //         return "dependency-mismatch";
        //     }

        //     var previous = this.previousValue(element),
        //         context, data;

        //     if (!this.settings.messages[element.name]) {
        //         this.settings.messages[element.name] = {};
        //     }
        //     previous.originalMessage = this.settings.messages[element.name].remote;
        //     this.settings.messages[element.name].remote = previous.message;

        //     param = typeof param === "string" && { url: param } || param;

        //     if (previous.old === value) {
        //         return previous.valid;
        //     }

        //     previous.old = value;
        //     context = this;
        //     this.startRequest(element);
        //     data = {};
        //     data[element.name] = value;
        //     $.ajax($.extend(true, {
        //         mode: "abort",
        //         port: "validate" + element.name,
        //         dataType: "json",
        //         data: data,
        //         context: context.element,
        //         success: function(response) {
        //             var valid = response === true || response === "true",
        //                 errors, message, submitted;

        //             context.settings.messages[element.name].remote = previous.originalMessage;
        //             if (valid) {
        //                 submitted = context.formSubmitted;
        //                 context.reset();
        //                 context.toHide = this.errorsFor(element);
        //                 context.formSubmitted = submitted;
        //                 context.successList.push(element);
        //                 delete context.invalid[element.name];
        //                 context.showErrors();
        //             } else {
        //                 errors = {};
        //                 message = response || context.defaultMessage(element, "remote");
        //                 errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
        //                 context.invalid[element.name] = true;
        //                 context.showErrors(errors);
        //             }
        //             previous.valid = valid;
        //             context.stopRequest(element, valid);
        //         }
        //     }, param));
        //     return "pending";
        // }
    };

    function objectLength(obj) {
        /* jshint unused: false */
        var count = 0;
        for (var i in obj) { count++; }
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

            this.settings = $.extend(true, {}, defaults, options);

            // // 防止多次初始化
            // if (this.isInitialized()) { 
            //     return this.getRef(); 
            // }
            // this.initialize(element);

            // this.initSettings(options);
            // this.value= this.element.val();

            
            this.submitted = {};
            // this.valueCache = {};
            // this.pendingRequest = 0;
            // this.pending = {};
            this.invalid = {};  // errorMap
            this.reset();
            // this.groups = {};

            // var groups = this.groups;
            // var rules;
            // $.each(this.settings.groups, function(key, value) {
            //     if (typeof value === "string") {
            //         value = value.split(/\s/);
            //     }
            //     $.each(value, function(index, name) {
            //         groups[name] = key;
            //     });
            // });
            // for(var p in this.settings.groups){
            //     var value= this.settings.groups[p];
            //     if(typeof value === 'string'){
            //         value= value.split(/\s/);
            //     }
            //     for(var i=0; i<value.length; i++){
            //         this.groups[value[i]]= p;
            //     }
            // }

            this.buildHtml();
            this.initElements();

            this.bindEvents();
            // this.bindEventsInterface();
        },

        // 模板模式 方法
        buildHtml: function(){
            if(this.settings.errorContainer){
                this.errorContainer= $(this.settings.errorContainer);
                // this.errorLabelContainer= $(this.settings.errorLabelContainer);
                // this.errorContainer.append(this.errorLabelContainer);
                this.errorContainer.append('<ul></ul>');
                // this.errorContext= this.errorLabelContainer;
                this.errorContext= this.errorContainer;
            }
            else{
                this.errorContext= this.element;
            }

            // this.errorLabelContainer = $(this.settings.errorLabelContainer);
            // this.errorContext = this.errorLabelContainer.length && this.errorLabelContainer || this.element;
            // this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
        },
        initElements: function(){
            var context= this;

            var container= this.element;
            this.elements= {
                // original: this.element,
                submitButton: $('input:submit:not("save"), button:submit:not("save")', container),
                saveButton: $('input.save:submit, button.save:submit', container),
                currentElements: function(){
                    // 有可能中途disabled，插入元素等。
                    var rulesCache = {};
                    var currentElements= container
                        .find("input, select, textarea")
                        .not(":submit, :reset, :image, :disabled")
                        .not(context.settings.ignore)
                        .filter(function() {
                            // add by matrix
                            var data= context.settings.rules[this.name];

                            // select only the first element for each name, and only those with rules specified
                            // if (this.name in rulesCache || !validator.objectLength($(this).rules())) {
                            if (this.name in rulesCache || !objectLength(data)) {
                                return false;
                            }

                            rulesCache[this.name] = true;
                            return true;
                        });

                    return currentElements;
                },
                findByName: function(name) {
                    return container.find('[name="' + name + '"]');
                }
                // view: $('input[type=text]', this.container)
                // getTab: function(levelIndex){
                //     var tabSelector='.t-level-tab-'+levelIndex;
                //     return $(tabSelector, context.container);
                // }
            };
        },
        bindEvents: function(){
            var context= this;
            var element= this.element;

            // validate the form on submit
            element.on("submit", function(event) {
                function handle() {
                    var hidden, result;
                    if (!context.settings.submitHandler) {
                        return true;
                    }

                    if (context.submitButton) {
                        // insert a hidden input as a replacement for the missing submit button
                        hidden = $("<input type='hidden'/>")
                            .attr("name", context.submitButton.name)
                            .val($(context.submitButton).val())
                            .appendTo(context.element);
                    }
                    result = context.settings.submitHandler.call(context, context.element, event);
                    if (context.submitButton) {
                        // and clean up afterwards; thanks to no-block-scope, hidden can be referenced
                        hidden.remove();
                    }
                    if (result !== undefined) {
                        return result;
                    }
                    return false;
                }

                // prevent submit for invalid forms or custom submit handlers
                if (context.cancelSubmit) {
                    context.cancelSubmit = false;
                    return handle();
                }
                if (context.checkForm()) {
                    // if (context.pendingRequest) {
                    //     context.formSubmitted = true;
                    //     return false;
                    // }
                    return handle();
                } else {
                    if (context.settings.focusInvalid) {
                        try {
                            var lastActive = context.lastActive && $.grep(context.errorList, function(n) {return n.element.name === lastActive.name;}).length === 1;
                            $(lastActive || context.errorList.length && context.errorList[0].element || [])
                                .filter(":visible")
                                .focus()
                                // manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
                                .trigger("focusin");
                        } catch (e) {
                            // ignore IE throwing errors when focusing hidden elements
                        }
                    }
                    return false;
                }
            });

            // add by matrix
            var context= this;
            function delegate(event) {
                var eventType = "on" + event.type.replace(/^validate/, "");
                if (context[eventType] && !$(this).is(context.settings.ignore)) {      // jshint ignore:line
                    context[eventType].call(context, this, event);               // jshint ignore:line
                }
            }

            this.element
                .on("focusin.validate focusout.validate keyup.validate",
                    ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " +
                    "[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " +
                    "[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " +
                    "[type='radio'], [type='checkbox']", delegate)
                // Support: Chrome, oldIE
                // "select" is provided as event.target when clicking a option
                .on("click.validate", "select, option, [type='radio'], [type='checkbox']", delegate);

            if (this.settings.invalidHandler) {
                // this.element.on("invalid-form.validate", this.settings.invalidHandler);
                this.element.on("invalid-form.validate", $.proxy(this.settings.invalidHandler, this));
            }

            // element.on("click.validate", ":submit", function(event) {
            this.elements.submitButton.on("click", function(event) {
                if (context.settings.submitHandler) {
                    context.submitButton = event.target;
                }

                // allow suppressing validation by adding a cancel class to the submit button
                if (context.element.hasClass("cancel")) {
                    context.cancelSubmit = true;
                }

                // allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
                if (context.element.attr("formnovalidate") !== undefined) {
                    context.cancelSubmit = true;
                }
            });

            // element.on('click', $.proxy(this.onFooClick, this));
        },
        // bindEventsInterface: function(){
        //     var context= this;
        //     var element= this.element;

        //     if(this.settings.onFooSelected){
        //         element.on('click.t.template', $.proxy(this.settings.onFooSelected, this));
        //     }
        // },
        onfocusin: function(element) {
            this.lastActive = element;

            // Hide error label and remove error class on focus if enabled
            if (this.settings.focusCleanup) {
                this.unhighlight(element, this.settings.errorClass, this.settings.validClass);
                var errors= this.errorsFor(element);
                // errors.not(this.containers).text("");
                // this.addWrapper(errors).hide();
                errors.text("");
                errors.hide();
                // this.containers.hide();
            }
        },
        onfocusout: function(element) {
            if(this.checkable(element)){
                return;
            }

            if (element.name in this.submitted || !this.optional(element)) {
                this.checkElement(element);
            }
        },
        onkeyup: function(element, event) {
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

            if (event.which === 9 && this.getValue(element) === "" || $.inArray(event.keyCode, excludedKeys) !== -1) {
                return;
            } else if (element.name in this.submitted || element === this.lastElement) {
                this.checkElement(element);
            }
        },
        onclick: function(element) {
            // click on selects, radiobuttons and checkboxes
            if (element.name in this.submitted) {
                this.checkElement(element);

            // or option elements, check parent select in that case
            } else if (element.parentNode.name in this.submitted) {
                this.checkElement(element.parentNode);
            }
        },

        // 事件处理
        // onFooClick: function(e, data){
        //     ;
        // },

        // http://jqueryvalidation.org/Validator.form/
        checkForm: function() {

            this.reset();
            this.toHide = this.errors();//.add(this.containers);

            var elements= this.currentElements = this.elements.currentElements();   // 所有需要验证的元素
            for (var i = 0; i<elements.length; i++) {
                this.check(elements[i]);
            }
            // return this.errorList.length === 0;

            $.extend(this.submitted, this.errorMap);
            this.invalid = $.extend({}, this.errorMap);
            if (this.errorList.length > 0) {
                this.element.triggerHandler("invalid-form", [this]);
            }
            this.showErrors();
            return this.errorList.length === 0;
        },


        // http://jqueryvalidation.org/Validator.element/
        checkElement: function(element) {
            var cleanElement = $(element)[0],
                checkElement = this.validationTargetFor(cleanElement),
                result = true;

            this.lastElement = checkElement;

            if (checkElement === undefined) {
                delete this.invalid[cleanElement.name];
            } else {
                this.reset();
                this.toHide = this.errorsFor(checkElement);
                this.currentElements = $(checkElement);

                result = this.check(checkElement) !== false;
                if (result) {
                    delete this.invalid[checkElement.name];
                } else {
                    this.invalid[checkElement.name] = true;
                }
            }
            if (!objectLength(this.invalid)) {
                // Hide error containers on last error
                this.toHide = this.toHide;//.add(this.containers);
            }
            this.showErrors();
            return result;
        },

        // http://jqueryvalidation.org/Validator.showErrors/
        showErrors: function(errors) {
            if (errors) {
                // add items to error list and map
                $.extend(this.errorMap, errors);
                this.errorList = [];
                for (var name in errors) {
                    var error= {
                        message: errors[name],
                        element: this.elements.findByName(name)[0]
                    };
                    this.errorList.push(error);
                }
                // remove items from success list
                // this.successList = $.grep(this.successList, function(element) {
                //     return !(element.name in errors);
                // });
                var newSuccessList=[];
                for(var i=0; i<this.successList.length; i++){
                    var element= this.successList[i];
                    if(element.name in errors){
                        continue;
                    }
                    newSuccessList.push(element);
                }
                this.successList= newSuccessList;
            }
            this.defaultShowErrors();
        },

        // http://jqueryvalidation.org/Validator.resetForm/
        resetForm: function() {
            if ($.fn.resetForm) {
                this.element.resetForm();
            }
            this.submitted = {};
            this.lastElement = null;
            this.reset();
            this.toHide = this.errors();//.add(this.containers);
            // this.toHide.not(this.containers).text("");
            // this.addWrapper(this.toHide).hide();
            this.toHide.text("");
            this.toHide.hide();
            var elements = this.elements.currentElements();//.removeData("previousValue");

            for (var i = 0; elements[i]; i++) {
                this.unhighlight(elements[i], this.settings.errorClass, "");
            }
        },

        errors: function() {
            var errorClass = this.settings.errorClass.split(' ').join('.');
            return $(this.settings.errorElement + "." + errorClass, this.errorContext);
        },

        reset: function() {
            this.successList = [];  // 成功列表
            this.errorList = [];    // 错误列表
            this.errorMap = {};     // 错误映射
            this.toShow = $([]);  // 需要隐藏的元素
            this.toHide = $([]);  // 需要显示的元素
            this.currentElements = $([]); // 当前所有需要验证的元素
        },

        check: function(element) {
            element = this.validationTargetFor($(element)[0]); 

            // add by matrix
            var data= this.settings.rules[element.name];

            // var rules = $(element).rules(),
            var rules = data;
            var rulesCount= objectLength(rules);
            var dependencyMismatch = false;
            var val = this.getValue(element);

            for (var method in rules) {
                var rule = { method: method, parameters: rules[method] };
                // result = $.validator.methods[method].call(this, val, element, rule.parameters);
                var result = methods[method].call(this, val, element, rule.parameters);

                // this.optional(element)
                // var val = this.getValue(element);
                // return !methods.required.call(this, val, element) && "dependency-mismatch";


                // if a method indicates that the field is optional and therefore valid,
                // don't mark it as valid when there are no other rules
                if (result === "dependency-mismatch" && rulesCount === 1) {
                    dependencyMismatch = true;
                    continue;
                }
                dependencyMismatch = false;

                // if (result === "pending") {
                //     this.toHide = this.toHide.not(this.errorsFor(element));
                //     return;
                // }

                if (!result) {
                    var message = this.defaultMessage(element, rule.method);
                    var theregex = /\$?\{(\d+)\}/g;
                    if (typeof message === "function") {
                        message = message.call(this, rule.parameters, element);
                    } else if (theregex.test(message)) {
                        // message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
                        message = String.format(message.replace(theregex, "{$1}"), rule.parameters);
                    }
                    this.errorList.push({
                        message: message,
                        element: element,
                        method: rule.method
                    });

                    this.errorMap[element.name] = message;
                    this.submitted[element.name] = message;

                    return false;
                }
            }
            if (dependencyMismatch) {
                return;
            }
            if (objectLength(rules)) {
                this.successList.push(element);
            }
            return true;
        },

        defaultMessage: function(element, method) {
            var msg;

            // 自定义消息
            // msg= this.customMessage(element.name, method);
            var m = this.settings.messages[name];
            msg= m && (m.constructor === String ? m : m[method]);            
            if(msg !== undefined){ return msg; }

            // 默认消息
            msg= messages[method];
            if(msg !== undefined){ return msg; }

            // 未定义消息
            msg= "<strong>Warning: No message defined for " + element.name + "</strong>";
            return msg;
        },


        // addWrapper: function(toToggle) {
        //     // if (this.settings.errorLabelWrapper) {
        //     //     toToggle = toToggle.add(toToggle.parent(this.settings.errorLabelWrapper));
        //     // }
        //     return toToggle;
        // },

        defaultShowErrors: function() {
            for (var i = 0; this.errorList[i]; i++) {
                var error = this.errorList[i];


                this.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);


                this.showLabel(error.element, error.message);
            }
            if (this.errorList.length) {
                this.toShow = this.toShow;//.add(this.containers);
            }
            if (this.settings.success) {
                for (var i = 0; this.successList[i]; i++) {
                    this.showLabel(this.successList[i]);
                }
            }
            var invalidElements= $(this.errorList).map(function() {return this.element;});

            var elements = this.currentElements.not(invalidElements);
            for (var i = 0; i<elements.length; i++) {
                this.unhighlight(elements[i], this.settings.errorClass, this.settings.validClass);
            }
            this.toHide = this.toHide.not(this.toShow);
            // this.toHide.not(this.containers).text("");
            // this.addWrapper(this.toHide).hide();
            // this.addWrapper(this.toShow).show();
            this.toHide.text("");
            this.toHide.hide();
            this.toShow.show();
        },

        // 高亮错误元素
        highlight: function(element, errorClass, validClass) {
            if (element.type === "radio") {
                this.elements.findByName(element.name).addClass(errorClass).removeClass(validClass);
            } else {
                $(element).addClass(errorClass).removeClass(validClass);
            }
        },
        // 取消高亮错误元素
        unhighlight: function(element, errorClass, validClass) {
            if (element.type === "radio") {
                this.elements.findByName(element.name).removeClass(errorClass).addClass(validClass);
            } else {
                $(element).removeClass(errorClass).addClass(validClass);
            }
        },

        showLabel: function(element, message) {
            var place, group, errorID,
                error = this.errorsFor(element),
                // elementID = this.idOrName(element);
                elementID = element.id;
            if (error.length) {
                // refresh error/success class
                error.removeClass(this.settings.validClass).addClass(this.settings.errorClass);
                // replace message on existing label
                error.html(message);
            } else {
                // create error element
                error = $("<" + this.settings.errorElement + ">")
                    .attr("id", elementID + "-error")
                    .addClass(this.settings.errorClass)
                    .html(message || "");

                // Maintain reference to the element to be placed into the DOM
                place = error;
                if (this.settings.errorLabelWrapper) {
                    // make sure the element is visible, even in IE
                    // actually showing the wrapped element is handled elsewhere
                    // place = error.hide().show().wrap("<" + this.settings.errorLabelWrapper + "/>").parent();
                    place = error.hide().show().wrap(this.settings.errorLabelWrapper).parent();
                }
                // if (this.errorLabelContainer) {   // this.errorLabelContainer.length
                //     this.errorLabelContainer.append(place);
                // } else if (this.settings.errorPlacement) {
                //     this.settings.errorPlacement(place, $(element));
                if (this.errorContainer) {   // this.errorLabelContainer.length
                    this.errorContainer.find('ul').append(place);
                } else if (this.settings.errorPlacement) {
                    this.settings.errorPlacement(place, $(element));
                } else {
                    place.insertAfter(element);
                }

                // Link error back to the element
                if (error.is("label")) {
                    // If the error is a label, then associate using 'for'
                    error.attr("for", elementID);
                } 
            }
            if (!message && this.settings.success) {
                error.text("");
                if (typeof this.settings.success === "string") {
                    error.addClass(this.settings.success);
                } else {
                    this.settings.success(error, element);
                }
            }
            this.toShow = this.toShow.add(error);
        },

        errorsFor: function(element) {
            // var name = this.idOrName(element);
            var name = element.name;
            var selector = "label[for='" + name + "'], label[for='" + name + "'] *";
            return this.errors().filter(selector);
        },

        // idOrName: function(element) {
        //     // return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
        //     return this.checkable(element) ? element.name : element.id || element.name;
        // },

        // 验证元素是否是当前form内的元素
        validationTargetFor: function(element) {
            // If radio/checkbox, validate first element in group instead
            if (this.checkable(element)) {
                element = this.elements.findByName(element.name);
            }
            return $(element).not(this.settings.ignore)[0];
        },

        checkable: function(element) {
            return (/radio|checkbox/i).test(element.type);
        },

        getValue: function (element) {
            var type = element.type;
            var jqElement = $(element);
            if (type === "radio" || type === "checkbox") {
                return this.elements.findByName(element.name).filter(":checked").val();
            } else if (type === "number" && typeof element.validity !== "undefined") {
                return element.validity.badInput ? false : jqElement.val();
            }

            var val = jqElement.val();
            if (typeof val === "string") {
                return val.replace(/\r/g, "");
            }
            return val;
        },

        getLength: function(value, element) {
            switch (element.nodeName.toLowerCase()) {
            case "select":
                return $("option:selected", element).length;
            case "input":
                if (this.checkable(element)) {
                    return this.elements.findByName(element.name).filter(":checked").length;
                }
            }
            return value.length;
        },

        // 非必填？
        optional: function(element) {
            var val = this.getValue(element);
            return !methods.required.call(this, val, element) && "dependency-mismatch";
        },

        // startRequest: function(element) {
        //     if (!this.pending[element.name]) {
        //         this.pendingRequest++;
        //         this.pending[element.name] = true;
        //     }
        // },

        // stopRequest: function(element, valid) {
        //     this.pendingRequest--;
        //     // sometimes synchronization fails, make sure pendingRequest is never < 0
        //     if (this.pendingRequest < 0) {
        //         this.pendingRequest = 0;
        //     }
        //     delete this.pending[element.name];
        //     if (valid && this.pendingRequest === 0 && this.formSubmitted && this.checkForm()) {
        //         $(this.element).submit();
        //         this.formSubmitted = false;
        //     } else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
        //         this.element.triggerHandler("invalid-form", [this]);
        //         this.formSubmitted = false;
        //     }
        // },

        // previousValue: function(element) {
        //     return $.data(element, "previousValue") || $.data(element, "previousValue", {
        //         old: null,
        //         valid: true,
        //         message: this.defaultMessage(element, "remote")
        //     });
        // },

        // API
        refresh: function(){},
        enable: function(){},
        disable: function(){},
        // cleans up all forms and elements, removes validator-specific events
        destroy: function() {
            this.resetForm();

            $(this.element)
                .off(".validate")
                .removeData("validator");
        }
    });
});