/**    
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * http://code.google.com/p/j-et/
 *
 * @version    1.0
 * @author    Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * 
 */

/**    
 * @description
 * Package: Jx
 *
 * Need package:
 * no.
 * 
 */

/**
 * 1.[JET core]: JET 微内核
 */


 /*
    引用 腾讯JX库，并进行适当裁剪。
 */
;(function(tn){
    var version = "1.0.0",
        mark = "JxMark",
        topNamespace = tn//,
        // undefined,
        
        // 将顶级命名空间中可能存在的 Jx 对象引入
        Jx = topNamespace.Jx,
        PACKAGES = {};

    // 判断Jx名字空间是否已经存在
    if(typeof Jx === "undefined" || (Jx.mark && Jx.mark === mark)){
        
        // 如果已经有Jx对象则记录已有的信息
        if(Jx){
            PACKAGES = Jx.PACKAGES;
        }
        
        /**
         * 【Jx 对象原型】
         * Jx
         * @class 
         * @constructor Jx
         * @global
         * 
         * @since version 1.0
         * @description Jx 对象原型的描述
         * 
         * @param {Number} ver 要使用的 Jx 的版本号，当前是1.0
         * @param {Boolean} isCreateNew 是否创建一个新的 Jx 实例，默认为 false 不创建新的 Jx 实例，只返回同一版本在全局中的唯一一个实例，注意：除非特殊需要，否则一般不要创建新的 Jx 实例
         * @return {Object} 返回对应版本的 Jx 对象
         * 
         * @example
         * //代码组织方式一(传统)：
         * var J = new Jx();
         * J.out(J.version);    //输出当前Jx的版本
         * 
         * @example
         * //代码组织方式二(推荐)：
         * Jx().package(function(J){
         *     J.out(J.version);    //输出当前Jx的版本
         * };
         * //注：此种方式可以利用匿名函数来防止变量污染全局命名空间，尤其适合大型WebApp的构建！
         * 
         * @example
         * //范例：
         * Jx().package("tencent.alloy", function(J){
         *     var $ = J.dom.id,
         *     $D = J.dom,
         *     $E = J.event,
         *     $H = J.http;
         *     this.name = "腾讯Q+ Web";
         *     J.out(this.name);
         * };
         * 
         */
        Jx = function(isCreateNew){
            var J = this;

            var instanceOf = function(o, type) {
                return (o && o.hasOwnProperty && (o instanceof type));
            };

            if(isCreateNew){
                // 如果是第一次执行则初始化对象
                if ( !( instanceOf(J, Jx) ) ) {
                    J = new Jx();
                } else {
                    J._init();
                }
            }else{
                J = Jx.Root;
            }
            return J;
        };
        
        Jx.prototype = {

            version: version,
            
            _init: function(){
                this.constructor = Jx;
                //return true;
            },

            namespace: function(name) {
                // Handle "", null, undefined, false
                if ( !name ) {
                    return topNamespace;
                }

                name = String(name);

                var i,
                    ni,
                    nis = name.split("."),
                    ns = topNamespace;

                for(i = 0; i < nis.length; i=i+1){
                    ni = nis[i];
                    ns[ni] = ns[ni] || {};
                    ns = ns[nis[i]];
                }

                return ns;
            },

            package: function(){
                var name = arguments[0],
                    func = arguments[arguments.length-1],
                    ns = topNamespace,
                    returnValue;
                    if(typeof func === "function"){
                        // handle name as ""
                        if(typeof name === "string"){
                            ns = this.namespace(name);
                            // if( Jx.PACKAGES[name] ){}   //throw new Error("Package name [" + name + "] is exist!");
                            if( !Jx.PACKAGES[name] ){
                                Jx.PACKAGES[name] = {
                                    isLoaded: true,
                                    returnValue: returnValue    // undefined as default
                                };
                            }
                            ns.packageName = name;
                        }else if(typeof name === "object"){
                            ns = name;
                        }
                        
                        returnValue = func.call(ns, this);
                        typeof name === "string" && (Jx.PACKAGES[name].returnValue = returnValue);
                    }else{
                        throw new Error("Function required");
                    }

            },
            
            checkPackage: function(name){
                return Jx.PACKAGES[name];
            },
                        
            startTime: +new Date(),
                        
            /**
             * Jx 对象转化为字符串的方法
             * 
             * @ignore
             * @return {String} 返回 Jx 对象串行化后的信息
             */
            toString: function(){
                return "JET version " + this.version + " !";
            }
        };
        
        /**
         * 记录加载的包的对象
         * 
         * @ignore
         * @type Object
         */
        Jx.PACKAGES = PACKAGES;

        /**
         * 创建一个当前版本 Jx 的实例
         * 
         * @ignore
         * @type Object
         */
        Jx.Root = new Jx(true);

        /**
         * Jx 对象验证标记
         * 
         * @ignore
         * @description 用于验证已存在的Jx对象是否是本框架某子版本的Jx对象
         * @type String
         */
        Jx.mark = mark;
        
        // 让顶级命名空间的 Jx 对象引用新的 Jx 对象
        topNamespace.Jx = Jx;
    }else{
        throw new Error("\"Jx\" name is defined in other javascript code !!!");
    }
})(this);


/**
 * 2.[Javascript core]: 常用工具函数扩展
 */
Jx().package(function(J){
    var isUndefined,
        isNull,
        isNumber,
        isString,
        isBoolean,
        isObject,
        isArray,
        isArguments,
        isFunction,
        $typeof,
        
        emptyFunc,

        random,

        extend,
        Class;

    /**
     * 判断变量的值是否是 undefined
     * Determines whether or not the provided object is undefined
     * 
     * @method isUndefined
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的值是 undefined 时返回 true
     */
    isUndefined = function(o) {
        return typeof(o) === "undefined";
    };
        
    /**
     * 判断变量的值是否是 null
     * Determines whether or not the provided object is null
     * 
     * @method isNull
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的值是 null 时返回 true
     */
    isNull = function(o) {
        return o === null;
    };
    
    /**
     * 判断变量的类型是否是 Number
     * Determines whether or not the provided object is a number
     * 
     * @memberOf Jx.prototype
     * @name isNumber
     * @function
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 number 时返回 true
     */
    isNumber = function(o) {
        return (o === 0 || o) && o.constructor === Number;
    };
    
    /**
     * 判断变量的类型是否是 Boolean
     * Determines whether or not the provided object is a boolean
     * 
     * 
     * @method isBoolean
     * @memberOf Jx.prototype
     * 
     * @static
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 boolean 时返回 true
     */
    isBoolean = function(o) {
        return (o === false || o) && (o.constructor === Boolean);
    };
    
    /**
     * 判断变量的类型是否是 String
     * Determines whether or not the provided object is a string
     * 
     * 
     * @method isString
     * @memberOf Jx.prototype
     * 
     * @static
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 string 时返回 true
     */
    isString = function(o) {
        return (o === "" || o) && (o.constructor === String);
    };
    
    /**
     * 判断变量的类型是否是 Object
     * Determines whether or not the provided object is a object
     * 
     * 
     * @method isObject
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 object 时返回 true
     */
    isObject = function(o) {
        return o && (o.constructor === Object || Object.prototype.toString.call(o) === "[object Object]");
    };
    
    /**
     * 判断变量的类型是否是 Array
     * Determines whether or not the provided object is a array
     * 
     * 
     * @method isArray
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 array 时返回 true
     */
    isArray = function(o) {
        return o && (o.constructor === Array || Object.prototype.toString.call(o) === "[object Array]");
    };
    
    /**
     * 判断变量的类型是否是 Arguments
     * Determines whether or not the provided object is a arguments
     * 
     * 
     * @method isArguments
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 arguments 时返回 true
     */
    isArguments = function(o) {
        return o && o.callee && isNumber(o.length) ? true : false;
    };
    
    /**
     * 判断变量的类型是否是 Function
     * Determines whether or not the provided object is a function
     * 
     * 
     * @method isFunction
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {Boolean} 当 o 的类型是 function 时返回 true
     */
    isFunction = function(o) {
        return o && (o.constructor === Function);
    };
    
    /**
     * 判断变量类型的方法
     * Determines the type of object
     * 
     * 
     * @method $typeof
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} o 传入被检测变量的名称
     * @return {String} 返回变量的类型，如果不识别则返回 other
     */
    $typeof = function(o) {
        if(isUndefined(o)){
            return "undefined";
        }else if(isNull(o)){
            return "null";
        }else if(isNumber(o)){
            return "number";
        }else if(isBoolean(o)){
            return "boolean";
        }else if(isString(o)){
            return "string";
        }else if(isObject(o)){
            return "object";
        }else if(isArray(o)){
            return "array";
        }else if(isArguments(o)){
            return "arguments";
        }else if(isFunction(o)){
            return "function";
        }else{
            return "other";
        }
        
    };
    
    /**
     * 生成随机数的方法
     * 
     * @method random
     * @memberOf Jx.prototype
     * 
     * @param {Number} min 生成随机数的最小值
     * @param {Number} max 生成随机数的最大值
     * @return {Number} 返回生成的随机数
     */
    random = function(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    /**
     * 对一个对象或数组进行扩展
     * 
     * @method extend
     * @memberOf Jx.prototype
     * 
     * @param {Mixed} beExtendObj 被扩展的对象或数组
     * @param {Mixed} extendObj1, extendObj2, .... 用来参照扩展的对象或数组
     * @return {Mixed} 返回被扩展后的对象或数组
     * 
     * @example
     * J().package(function(J){
     *     // 用 objB 和objC 扩展 objA 对象；
     *     J.extend(objA, objB, objC);
     * };
     * 
     */
    extend = function(beExtendObj, extendObj1, extendObj2){
        var a = arguments,
            i,
            p,
            beExtendObj,
            extendObj;
            
        if(a.length === 1){
            beExtendObj = this;
            i=0;
        }else{
            beExtendObj = a[0] || {};
            i=1;
        }
        
        for(; i<arguments.length; i++){
            extendObj = arguments[i];
            for(p in extendObj){
                var src = beExtendObj[p],
                    obj = extendObj[p];
                if ( src === obj ){
                    continue;
                }
                
                if ( obj && isObject(obj) && !isArray(obj) && !obj.nodeType && !isFunction(obj)){
                    src = beExtendObj[p] || {};//2010-12-28
                    beExtendObj[p] = extend( src, 
                        // Never move original objects, clone them
                        obj || ( obj.length != null ? [ ] : { } ));

                // Don't bring in undefined values
                }else if ( obj !== undefined ){
                    beExtendObj[p] = obj;
                }
            }
        }

        return beExtendObj;
    };

    emptyFunc = function(){};
    
    /**
     * 创建Class类的类
     * Class
     * @class 
     * @memberOf Jx
     * @param {Object} option = {extend: superClass} 在option对象的extend属性中指定要继承的对象，可以不写
     * @param {Object} object 扩展的对象
     * @return {Object} 返回生成的日期时间字符串
     * 
     * @example
     * J().package(function(J){
     *     var Person = new J.Class({
     *      init : function(name){
     *          this.name = name;
     *          alert("init");
     *      },
     *      showName : function(){
     *          alert(this.name);
     *  
     *      }
     *  
     *  });
     *  
     *  // 继承Person
     *     var Person2 = new J.Class({extend : Person}, {
     *      init : function(name){
     *          this.name = name;
     *          alert("init");
     *      },
     *      showName : function(){
     *          alert(this.name);
     *  
     *      }
     *  
     *  });
     *     
     * };
     * 
     */
    Class = function(){
        var length = arguments.length;
        var option = arguments[length-1];
        
        option.init = option.init || function(){};
        
        // 如果参数中有要继承的父类
        if(length === 2){
            /**
             * @ignore
             */
            var superClass = arguments[0].extend;
            
            /**
             * @ignore
             */
            var tempClass = function() {};
            tempClass.prototype = superClass.prototype;
            
            /**
             * @ignore
             */
            var subClass = function() {
                this.init.apply(this, arguments);
            }
            
            // 加一个对父类原型引用的静态属性
            subClass.superClass = superClass.prototype;
            //subClass.superClass = superClass;
            /**
             * @ignore
             */
            subClass.callSuper = function(context,func){
                var slice = Array.prototype.slice;
                var a = slice.call(arguments, 2);
                var func = subClass.superClass[func];
                //var func = subClass.superClass.prototype[func];
                if(func){
                    func.apply(context, a.concat(slice.call(arguments)));
                }
            };
            
            // 指定原型
            subClass.prototype = new tempClass();
            
            // 重新指定构造函数
            subClass.prototype.constructor = subClass;
            
            J.extend(subClass.prototype, option);
            
            /**
             * @ignore
             */
            subClass.prototype.init = function(){
                // 调用父类的构造函数
                // subClass.superClass.init.apply(this, arguments);
                // 调用此类自身的构造函数
                option.init.apply(this, arguments);
            };
            
            return subClass;
            
        // 如果参数中没有父类，则单纯构建一个类
        }else if(length === 1){
            /**
             * @ignore
             */
            var newClass = function() {
                // 加了return，否则init返回的对象不生效
                return this.init.apply(this, arguments);
            }
            newClass.prototype = option;
            return newClass;
        }
        
        
    }; 
    
    J.isUndefined = isUndefined;
    J.isNull = isNull;
    J.isNumber = isNumber;
    J.isString = isString;
    J.isBoolean = isBoolean;
    J.isObject = isObject;
    J.isArray = isArray;
    J.isArguments = isArguments;
    J.isFunction = isFunction;
    J.$typeof = $typeof;

    J.emptyFunc=emptyFunc;

    J.random = random;

    J.extend = extend;
    J.Class = Class;
});

Jx().package("T.Collections", function(J){
    this.StackedMap = new J.Class({
        // 构造函数
        init: function(){
            this._innerStack= [];
        },
        add: function(key, value) {
            this._innerStack.push({
                key: key,
                value: value
            });
        },
        get: function(key) {
            for (var i = 0; i < this._innerStack.length; i++) {
                if (key === this._innerStack[i].key) {
                    return this._innerStack[i];
                }
            }
        },
        keys: function() {
            var keys = [];
            for (var i = 0; i < this._innerStack.length; i++) {
                keys.push(this._innerStack[i].key);
            }
            return keys;
        },
        top: function() {
            return this._innerStack[this._innerStack.length - 1];
        },
        remove: function(key) {
            var idx = -1;
            for (var i = 0; i < this._innerStack.length; i++) {
                if (key === this._innerStack[i].key) {
                    idx = i;
                    break;
                }
            }
            return this._innerStack.splice(idx, 1)[0];
        },
        removeTop: function() {
            return this._innerStack.splice(this._innerStack.length - 1, 1)[0];
        },
        length: function() {
            return this._innerStack.length;
        }
    });

    this.MultiMap = new J.Class({
        // 构造函数
        init: function(){
            this._innerMap= {};
        },

        entries: function() {
            // TODO: Object.keys在ie8下的浏览器兼容性问题
            return Object.keys(this._innerMap).map(function(key) {
                return {
                    key: key,
                    value: this._innerMap[key]
                };
            });
        },
        get: function(key) {
            return this._innerMap[key];
        },
        hasKey: function(key) {
            return !!this._innerMap[key];
        },
        keys: function() {
            return Object.keys(this._innerMap);
        },
        put: function(key, value) {
            if (!this._innerMap[key]) {
                this._innerMap[key] = [];
            }

            this._innerMap[key].push(value);
        },
        remove: function(key, value) {
            var values = this._innerMap[key];

            if (!values) {
                return;
            }

            var idx = values.indexOf(value);

            if (idx !== -1) {
                values.splice(idx, 1);
            }

            if (!values.length) {
                delete this._innerMap[key];
            }
        }
    });
});


// var stack = [];
// return {
//     add: function(key, value) {
//         stack.push({
//             key: key,
//             value: value
//         });
//     },
//     get: function(key) {
//         for (var i = 0; i < stack.length; i++) {
//             if (key === stack[i].key) {
//                 return stack[i];
//             }
//         }
//     },
//     keys: function() {
//         var keys = [];
//         for (var i = 0; i < stack.length; i++) {
//             keys.push(stack[i].key);
//         }
//         return keys;
//     },
//     top: function() {
//         return stack[stack.length - 1];
//     },
//     remove: function(key) {
//         var idx = -1;
//         for (var i = 0; i < stack.length; i++) {
//             if (key === stack[i].key) {
//                 idx = i;
//                 break;
//             }
//         }
//         return stack.splice(idx, 1)[0];
//     },
//     removeTop: function() {
//         return stack.splice(stack.length - 1, 1)[0];
//     },
//     length: function() {
//         return stack.length;
//     }
// };

// var map = {};
// return {
//     entries: function() {
//         return Object.keys(map).map(function(key) {
//             return {
//                 key: key,
//                 value: map[key]
//             };
//         });
//     },
//     get: function(key) {
//         return map[key];
//     },
//     hasKey: function(key) {
//         return !!map[key];
//     },
//     keys: function() {
//         return Object.keys(map);
//     },
//     put: function(key, value) {
//         if (!map[key]) {
//             map[key] = [];
//         }
//         map[key].push(value);
//     },
//     remove: function(key, value) {
//         var values = map[key];
//         if (!values) {
//             return;
//         }
//         var idx = values.indexOf(value);
//         if (idx !== -1) {
//             values.splice(idx, 1);
//         }
//         if (!values.length) {
//             delete map[key];
//         }
//     }
// };
//! moment.js
//! version : 2.10.6
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function () { 

    // 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = getParsingFlags(from);
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && typeof module !== 'undefined' &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (typeof values === 'undefined') {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, values) {
        if (values !== null) {
            values.abbr = name;
            locales[name] = locales[name] || new Locale();
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function get_set__set (mom, unit, value) {
        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

    var regexes = {};

    function isFunction (sth) {
        // https://github.com/moment/moment/issues/2325
        return typeof sth === 'function' &&
            Object.prototype.toString.call(sth) === '[object Function]';
    }


    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  matchWord);
    addRegexToken('MMMM', matchWord);

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m) {
        return this._months[m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m) {
        return this._monthsShort[m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (firstTime) {
                warn(msg + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
        ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
        ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d{2}/],
        ['YYYY-DDD', /\d{4}-\d{3}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
        ['HH:mm', /(T| )\d\d:\d\d/],
        ['HH', /(T| )\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = from_string__isoRegex.exec(string);

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    config._f = isoDates[i][0];
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    // match[6] should be 'T' or space
                    config._f += (match[6] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (string.match(matchOffset)) {
                config._f += 'Z';
            }
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var week1Jan = 6 + firstDayOfWeek - firstDayOfWeekOfYear, janX = createUTCDate(year, 0, 1 + week1Jan), d = janX.getUTCDay(), dayOfYear;
        if (d < firstDayOfWeek) {
            d += 7;
        }

        weekday = weekday != null ? 1 * weekday : firstDayOfWeek;

        dayOfYear = 1 + week1Jan + 7 * (week - 1) - d + weekday;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
        }
        return [now.getFullYear(), now.getMonth(), now.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             return other < this ? this : other;
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            return other > this ? this : other;
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchOffset);
    addRegexToken('ZZ', matchOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(string) {
        var matches = ((string || '').match(matchOffset) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(input);
            }
            if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (typeof this._isDSTShifted !== 'undefined') {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return !this._isUTC;
    }

    function isUtcOffset () {
        return this._isUTC;
    }

    function isUtc () {
        return this._isUTC && this._offset === 0;
    }

    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = create__isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                d : parseIso(match[4], sign),
                h : parseIso(match[5], sign),
                m : parseIso(match[6], sign),
                s : parseIso(match[7], sign),
                w : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(formats && formats[format] || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this > +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return inputMs < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this < +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return +this.clone().endOf(units) < inputMs;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var inputMs;
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this === +input;
        } else {
            inputMs = +local__createLocal(input);
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function diff (input, units, asFloat) {
        var that = cloneWithOffset(input, this),
            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
            delta, output;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if ('function' === typeof Date.prototype.toISOString) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    // MOMENTS

    function getSetWeekYear (input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getSetISOWeekYear (input) {
        var year = weekOfYear(this, 1, 4).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    addFormatToken('Q', 0, 0, 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m) {
        return this._weekdays[m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName) {
        var i, mom, regex;

        this._weekdaysParse = this._weekdaysParse || [];

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            if (!this._weekdaysParse[i]) {
                mom = local__createLocal([2000, 1]).day(i);
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, function () {
        return this.hours() % 12 || 12;
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add          = add_subtract__add;
    momentPrototype__proto.calendar     = moment_calendar__calendar;
    momentPrototype__proto.clone        = clone;
    momentPrototype__proto.diff         = diff;
    momentPrototype__proto.endOf        = endOf;
    momentPrototype__proto.format       = format;
    momentPrototype__proto.from         = from;
    momentPrototype__proto.fromNow      = fromNow;
    momentPrototype__proto.to           = to;
    momentPrototype__proto.toNow        = toNow;
    momentPrototype__proto.get          = getSet;
    momentPrototype__proto.invalidAt    = invalidAt;
    momentPrototype__proto.isAfter      = isAfter;
    momentPrototype__proto.isBefore     = isBefore;
    momentPrototype__proto.isBetween    = isBetween;
    momentPrototype__proto.isSame       = isSame;
    momentPrototype__proto.isValid      = moment_valid__isValid;
    momentPrototype__proto.lang         = lang;
    momentPrototype__proto.locale       = locale;
    momentPrototype__proto.localeData   = localeData;
    momentPrototype__proto.max          = prototypeMax;
    momentPrototype__proto.min          = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set          = getSet;
    momentPrototype__proto.startOf      = startOf;
    momentPrototype__proto.subtract     = add_subtract__subtract;
    momentPrototype__proto.toArray      = toArray;
    momentPrototype__proto.toObject     = toObject;
    momentPrototype__proto.toDate       = toDate;
    momentPrototype__proto.toISOString  = moment_format__toISOString;
    momentPrototype__proto.toJSON       = moment_format__toISOString;
    momentPrototype__proto.toString     = toString;
    momentPrototype__proto.unix         = unix;
    momentPrototype__proto.valueOf      = to_type__valueOf;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return typeof output === 'function' ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (typeof output === 'function') ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (typeof prop === 'function') {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months       =        localeMonths;
    prototype__proto._months      = defaultLocaleMonths;
    prototype__proto.monthsShort  =        localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse  =        localeMonthsParse;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes === 1          && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   === 1          && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    === 1          && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  === 1          && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   === 1          && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.10.6';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

    var _moment = utils_hooks__hooks;

    // return _moment;
    window.moment=_moment;

})();

(function(moment){
    var zh_cn = moment.defineLocale('zh-cn', {
        months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
        monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
        weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
        weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),
        weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
        longDateFormat : {
            LT : 'Ah点mm分',
            LTS : 'Ah点m分s秒',
            L : 'YYYY-MM-DD',
            LL : 'YYYY年MMMD日',
            LLL : 'YYYY年MMMD日Ah点mm分',
            LLLL : 'YYYY年MMMD日ddddAh点mm分',
            l : 'YYYY-MM-DD',
            ll : 'YYYY年MMMD日',
            lll : 'YYYY年MMMD日Ah点mm分',
            llll : 'YYYY年MMMD日ddddAh点mm分'
        },
        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
        meridiemHour: function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === '凌晨' || meridiem === '早上' ||
                    meridiem === '上午') {
                return hour;
            } else if (meridiem === '下午' || meridiem === '晚上') {
                return hour + 12;
            } else {
                // '中午'
                return hour >= 11 ? hour : hour + 12;
            }
        },
        meridiem : function (hour, minute, isLower) {
            var hm = hour * 100 + minute;
            if (hm < 600) {
                return '凌晨';
            } else if (hm < 900) {
                return '早上';
            } else if (hm < 1130) {
                return '上午';
            } else if (hm < 1230) {
                return '中午';
            } else if (hm < 1800) {
                return '下午';
            } else {
                return '晚上';
            }
        },
        calendar : {
            sameDay : function () {
                return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
            },
            nextDay : function () {
                return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
            },
            lastDay : function () {
                return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
            },
            nextWeek : function () {
                var startOfWeek, prefix;
                startOfWeek = moment().startOf('week');
                prefix = this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '[下]' : '[本]';
                return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
            },
            lastWeek : function () {
                var startOfWeek, prefix;
                startOfWeek = moment().startOf('week');
                prefix = this.unix() < startOfWeek.unix()  ? '[上]' : '[本]';
                return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
            },
            sameElse : 'LL'
        },
        ordinalParse: /\d{1,2}(日|月|周)/,
        ordinal : function (number, period) {
            switch (period) {
            case 'd':
            case 'D':
            case 'DDD':
                return number + '日';
            case 'M':
                return number + '月';
            case 'w':
            case 'W':
                return number + '周';
            default:
                return number;
            }
        },
        relativeTime : {
            future : '%s内',
            past : '%s前',
            s : '几秒',
            m : '1 分钟',
            mm : '%d 分钟',
            h : '1 小时',
            hh : '%d 小时',
            d : '1 天',
            dd : '%d 天',
            M : '1 个月',
            MM : '%d 个月',
            y : '1 年',
            yy : '%d 年'
        },
        week : {
            // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    // return zh_cn;
})(moment);

(function(moment){
    moment.locale('zh_cn');
})(moment);
/* ========================================================================
 * Bootstrap: transition.js v3.3.5
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition){
        return;
    }

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

Jx().package("T.Utilities", function(J){
    // 严格模式
    'use strict';
    
    String.format = function() {
        if( arguments.length === 0 )
            return null;

        var str = arguments[0]; 
        for(var i=1;i<arguments.length;i++) {
            var re = new RegExp('\\{' + (i-1) + '\\}','gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    };
});

Jx().package("T.UI", function(J){
	// 严格模式
	'use strict';

    // 全局变量、函数、对象
    var _currentPluginId = 0;

    // 获取属性值
    function parseAttributes(element, attributeMap) {
        var data = {};

        for(var p in attributeMap){
            var value = attributeMap[p]
            var attrName = 't-' + value + '';
            // if (element.is('[data-' + attrName + ']')){
            //     data[p] = element.data(attrName);
            // }
            var value = element.data(attrName);
            data[p] = value || undefined;
        }

        return data;
    }

	this.BaseControl = new J.Class({

        /*
		defaults: {},
		attributeMap: {},
        templates:{},
        
        element: {},
        container: {},
        elements: {},
        */

        // 构造函数
        init: function(){},
        // 初始化设置
		initSettings: function(element, options){
            /*
                (BaseControl)t-plugin-id 和 ($.toc)t-plugin-ref 属于控件的内部属性
                保存在 element.data 中，不能在 defalut 中暴露给外界
                也不在 parseAttributes 中解析，同理不加 data-s 前缀
            */
            // 区分一个页面中存在多个控件实例
            _currentPluginId += 1;
            // element.data('t-plugin-id', _currentPluginId);
            this.pluginId = _currentPluginId;

            var attributes = parseAttributes(element, this.attributeMap);
			this.settings = $.extend(true, {}, this.defaults, attributes, options);
		},
        
        // 初始化字符串值，对象/数组值，状态值等
        initStates: function(){},
        
        bindEvents: function(){},
        unbindEvents: function(){},

        enable: function(){},
        disable: function(){},

        destroy: function () {            
            // this.container.remove();
            // this.container = null;
            // Switch off events
            this.unbindEvents();

            // this.elements.original.data('t-plugin-id').remove();
        }//,

        /*
        buildHtml: function () {
            ;
        },
        initElements: function () {
            this.elements = {
                input: $('.tui-controlname-elementname', this.container)
            }
        },
        bindEvents: function () {
            var context=this;

            var element=this.element;
            var elements=this.elements;

            element.on('eventname', function(e) {
                actionOne();
            });

            elements.up.on('eventname', function(ev) {
                ;
            });
        },
        bindEventsInterface: function () {
            var context=this;
            var element=this.element;

            element.on('address.foo', function() {
                context.foo();
                foo();
            });
        },
        unbindEvents: function () {
            this.element.off();
        },
        refresh: function(){
            ;
        },
        actionOne: function(){
            this.element.trigger('controlname.on.eventname');
        }
        */

	});
});



// Jx().package("T.UI", function(J){    
//     var emptyFun= function(){};
//     // 静态对象不要在运行时修改.
//     var defaults = {
//         // 选项
//         // fooOption: true,
//         content: '',        // html dom      (content和remote二选一, content 优先)
//         remote: '',         // html dom url  (content和remote二选一, content 优先)
//         // 覆写 类方法
//         // parseData: undefined,
//         // 事件
//         // onFooClick: emptyFun,
//         // onFooChange: function(e, data){}
//     };

//     // 静态对象不要在运行时修改.
//     var attributeMap = {
//         // fooOption: 'foo-option'
//     };

//     // 静态对象不要在运行时修改.
//     var htmlTemplates= {
//         container: '<div Class="t-uibase-container"></div>',
//         content: '<div Class="t-uibase-content"></div>'
//     };

//     var BaseControl= new J.Class({
//         defaults: defaults,             // 默认 options
//         attributeMap: attributeMap,     // html标签属性指令 "data-t-* 属性" 和 "init options" 映射

//         settings: {},       // a options config to a settings
//         data: {},           // 数据
//         value: {},          // 值
//         template: {},       // html模板
//         elements: {},       // dom对象引用
//         observers: {},      // 事件响应

//         init: function(options){
//             // this.initSettings(jqElement, options);
//             this.updateOptions(options);
            
//             var context= this;
//             // $.when(this.getData())
//             //  .done(function(){
//             //     context.render();
//             //  });
//             var d1= $.Deferred();
//             var d2= $.Deferred();
//             $.when(this.getTemplate(d1), this.getData(d2))
//              .done(function(){
//                 context.render();
//              });
//         },

//         // 从服务器上获取html模板
//         getTemplate: function(deferred){
//             if (this.settings.template) {
//                 this.template= this.updateTemplate(template);;
//                 delete this.settings.template;

//                 deferred.resolve();
//                 return deferred.promise();
//             }

//             var context = this;
//             var errorMessage= '控件id：' + context.element.attr('id')+'，ajax获取数据失败!';
//             $.ajax({
//                 dataType: 'json',
//                 url: context.settings.remote,
//                 data: {},
//                 success: function(template){
//                     context.updateTemplate(template);

//                     deferred.resolve();
//                 },
//                 error: function(xmlHttpRequest, status, error){
//                     alert(errorMessage);

//                     deferred.resolve();
//                 }
//             });

//             return deferred.promise();
//         },
//         parseTemplate: function(template){
//             return template;
//         },

//         getData: function(deferred){
//             if (this.settings.data) {
//                 var data = this.settings.data;
//                 this.updateData(data);
//                 delete this.settings.data;

//                 deferred.resolve();
//                 return deferred.promise();
//             }

//             var context = this;
//             $.ajax({
//                 dataType: 'json',
//                 url: context.settings.dataUrl,
//                 data: {},
//                 success: function(data){
//                     var innerData= context.parseData(data);
//                     context.data= innerData;    //$.extend(true, [], innerData);
//                     deferred.resolve();
//                 },
//                 error: function(xmlHttpRequest, status, error){
//                     alert('控件id：' + context.element.attr('id')+'，ajax获取数据失败!');

//                     deferred.resolve();
//                 }
//             });

//             return deferred.promise();
//         },
//         parseData: function(data){
//             // var innerData= $.extend(true, {}, data);
//             // var innerData= $.extend(true, [], data);
//             // return innerData;
//             return data;
//         },

//         getValue: function(){},
//         setValue: function(value){},

//         // 渲染
//         render: function(){
//             // -----------------------------------------------
//             // html
//             // -----------------------------------------------
//             this.buildHtml();
//             this.transferAttributes();
//             this.initElements();
//             this.refresh();
//             // -----------------------------------------------
//             // states
//             // -----------------------------------------------
//             this.initStates();
//             // -----------------------------------------------
//             // events
//             // -----------------------------------------------
//             this.buildObservers();
//             this.bindEvents();
//             this.bindEventsInterface();
//         },

//         // 从htmlTemplates中获取html模板
//         buildHtml: function(){},
        
//         initElements: function(){
//             // var context= this;
//             // this.elements={
//             //     // 获取构建时创建的静态dom对象(buildHtml)
//             //     view: $('input[type=text]', this.container),
//             //     // 获取运行时动态创建的dom对象(getTemplate / getData refresh / render)
//             //     getTab: function(levelIndex){
//             //         var tabSelector='.t-level-tab-'+levelIndex;
//             //         return $(tabSelector, context.container);
//             //     }
//             // };
//         },
//         transferAttributes: function(){},

//         // 初始化内部状态
//         initStates: function(){},

//         // 刷新
//         refresh: function(){},

//         buildObservers: function(){
//             var observers= {
//                 // global
//                 windowResize: function(e){},
//                 documentReady: function(e){},
//                 scrollbar: function(e){},
//                 // mouse
//                 fooClick: function(e){},
//                 fooSelected: function(e){},
//                 // keys
//                 esc: function(e){},
//                 enter: function(e){},
//                 up: function(e){},
//                 // customs
//             };

//             this.observers= observers;
//         },
//         bindEvents: function(){},
//         bindEventsInterface: function(){
//             // this.elements.original.on('click.t.uibase', $.proxy(this.settings.onFooClick, this));
//             // this.elements.original.on('change.t.uibase', $.proxy(this.settings.onFooChange, this));
//         },
//         unbindEvents: function(){
//             // this.elements.original.off('click.t.uibase');
//             // this.elements.original.off('change.t.uibase');
//         },

//         updateOptions: function(options){
//             this.settings= this.parseOptions(options);
//         },
//         overrides: function(){
//             // if(typeof this.settings.parseTemplate !== 'undefined'){
//             //     this.parseTemplate= this.settings.parseTemplate;
//             //     delete this.settings.parseTemplate;
//             // }
//             // if(typeof this.settings.parseData !== 'undefined'){
//             //     this.parseData= this.settings.parseData;
//             //     delete this.settings.parseData;
//             // }
//         },
//         updateData: function(data){
//             this.data= this.parseData(data);
//         },
//         updateTemplate: function(template){
//             this.template= this.parseTemplate(template);
//         },

//         enable: function(){},
//         disable: function(){},

//         show: function(){},
//         hide:  function(){},

//         destroy: function(){
//             // this.container.remove();
//             // this.container = null;
//             // Switch off events
//             this.unbindEvents();

//             // this.elements.original.data('t-plugin-id').remove();
//         }
//     });

//     // var BaseTemplate= new J.Class({
//     //     defaults: {
//     //         parseTemplate: undefined
//     //     },
//     //     // init: function(){},
//     //     parseOptions: function(options){
//     //         this.settings= $.extend(true, {}, this.defaults,  options);
//     //     },
//     //     overrides: function(){
//     //         if(typeof this.settings.parseTemplate !== 'undefined'){
//     //             this.parseTemplate= this.settings.parseTemplate;
//     //             delete this.settings.parseTemplate;
//     //         }
//     //     },
//     //     parseTemplate: function(template){
//     //         return template;
//     //     },
//     //     // destroy: function(){}

//     //     // api (interface)
//     //     getTemplate: function(){
//     //         return this.template;
//     //     }
//     // });

//     // var StaticTemplate= new J.Class({extend : BaseTemplate}, {
//     //     defaults: {
//     //         content: '',
//     //     },
//     //     init: function(){
//     //         this.parseOptions(options);
//     //         this.overrides();
//     //     },
//     //     destroy: function(){},
//     // });

//     // var DynamicTemplate= new J.Class({extend : BaseTemplate}, {
//     //     defaults: {
//     //         remote: ''
//     //     },
//     //     init: function(options){
//     //         this.parseOptions(options);
//     //         this.overrides();
//     //     },
//     //     // 从服务器上获取html模板
//     //     load: function(deferred){
//     //         var context = this;
//     //         var errorMessage= '控件id：' + context.element.attr('id')+'，ajax获取数据失败!';
//     //         $.ajax({
//     //             dataType: 'json',
//     //             url: context.settings.remote,
//     //             data: {},
//     //             success: function(template){
//     //                 context.updateTemplate(template);

//     //                 deferred.resolve();
//     //             },
//     //             error: function(xmlHttpRequest, status, error){
//     //                 alert(errorMessage);

//     //                 deferred.resolve();
//     //             }
//     //         });

//     //         return deferred.promise();
//     //     },
//     //     destroy: function(){}
//     // });


//     // var StaticTemplateControl= new J.Class({});
//     // var StaticDataControl= new J.Class({});    
//     // var DynamicTemplateControl= new J.Class({});
//     // var DynamicDataControl= new J.Class({});
// });
/* ========================================================================
 * Bootstrap: affix.js v3.3.5
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.5'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // // AFFIX NO CONFLICT
  // // =================

  // $.fn.affix.noConflict = function () {
  //   $.fn.affix = old
  //   return this
  // }


  // // AFFIX DATA-API
  // // ==============

  // $(window).on('load', function () {
  //   $('[data-spy="affix"]').each(function () {
  //     var $spy = $(this)
  //     var data = $spy.data()

  //     data.offset = data.offset || {}

  //     if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
  //     if (data.offsetTop    != null) data.offset.top    = data.offsetTop

  //     Plugin.call($spy, data)
  //   })
  // })

}(jQuery);

Jx().package("T.UI.Controls", function(J){
    // 严格模式
    'use strict';

    var _crrentPluginId = 0;
    var defaults = {
        // 选项
        // fooOption: true,
        format: ''
        // 覆写 类方法
        // parseData: undefined,
        // 事件
        // onFooSelected: undefined,
        // onFooChange: function(e, data){}
    };
    var attributeMap = {
        // fooOption: 'foo-option'
        format: 'format'
    };

    var __daysIn = [ 31,28,31,30,31,30,31,31,30,31,30,31 ];     // 每个月有多少天
    var __initialized = false;                                  // 是否已经初始化
    var __pickers = [];                                         // 设置了多少个控件
    // 取绝对值，转换成字符串 在前面填充 0 到长度 len
    function pad( value, length )
    {
        var s = String(Math.abs(value));
        while ( s.length < length ){
            s = '0'+s;
        }            
        if ( value < 0 ){
            s = '-'+s;
        }
        return s;
    }

    var Converter = new J.Class({
        // defaults: defaults,
        // attributeMap: attributeMap,
        init: function(options){          

            // Converter 私有变量
            this._flen = 0;
            this._longDay = 9;
            this._longMon = 9;
            this._shortDay = 6;
            this._shortMon = 3;
            this._offAl = Number.MIN_VALUE; // format time zone offset alleged
            this._offCap = Number.MIN_VALUE; // parsed time zone offset captured
            this._offF = Number.MIN_VALUE; // format time zone offset imposed
            this._offFSI = (-1); // format time zone label subindex
            this._offP = Number.MIN_VALUE; // parsed time zone offset assumed
            this._offPSI = (-1);        // parsed time zone label subindex captured
            this._captureOffset = false;


            // public members

            this.fmt = '%Y-%m-%d %T';
            // this.dAbbr = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            this.dAbbr = ['日','一','二','三','四','五','六'];
            this.dNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            // this.eAbbr = ['BCE','CE'];
            // this.mAbbr = [ 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec' ];
            this.eAbbr = ['公元前','公元'];
            this.mAbbr = [ '一','二','三','四','五','六','七','八','九','十','十一','十二' ];
            this.mNames = [ 'January','February','March','April','May','June','July','August','September','October','November','December' ];
            this.baseYear = null;

            // -- 原构造函数开始 --

            var i, len;

            options = $.extend(true, {} , options || {});

            // 年 最小值
            if ( options.baseYear ){
                this.baseYear = Number(options.baseYear);
            }
            // 格式
            if ( options.format ){
                this.fmt = options.format;
            }

            this._flen = this.fmt.length;

            // 星期 的名称缩写 sum, mon
            if ( options.dayAbbreviations ){
                this.dAbbr = $.makeArray( options.dayAbbreviations );
            }

            // 星期 的名称全名
            if ( options.dayNames )
            {
                this.dNames = $.makeArray( options.dayNames );
                this._longDay = 1;
                this._shortDay = 1000;
                for ( i = 0 ; i < 7 ; i++ )
                {
                len = this.dNames[i].length;
                    if ( len > this._longDay ){
                        this._longDay = len;
                    }
                    if ( len < this._shortDay ){
                        this._shortDay = len;
                    }
                }
            }

            // 公元前 / 公元 
            if ( options.eraAbbreviations )
                this.eAbbr = $.makeArray(options.eraAbbreviations);
            // 月份 的名称缩写
            if ( options.monthAbbreviations )
                this.mAbbr = $.makeArray(options.monthAbbreviations);
            // 月份 的名称全称
            if ( options.monthNames )
            {
                this.mNames = $.makeArray( options.monthNames );
                this._longMon = 1;
                this._shortMon = 1000;
                for ( i = 0 ; i < 12 ; i++ )
                {
                    len = this.mNames[i].length;
                    if ( len > this._longMon )
                        this._longMon = len;
                    if ( len < this._shortMon )
                        this._shortMon = len;
                }
            }
            // UTC 时区偏移 (单位：分钟)
            if ( typeof options.utcFormatOffsetImposed != "undefined" )
                this._offF = options.utcFormatOffsetImposed;

            if ( typeof options.utcParseOffsetAssumed != "undefined" )
                this._offP = options.utcParseOffsetAssumed;

            if ( options.utcParseOffsetCapture )
                this._captureOffset = true;
        },
        // 指定位置字符是否是数字
        dAt: function( str, pos )
        {
            return (
                        (str.charCodeAt(pos)>='0'.charCodeAt(0)) 
                        && (str.charCodeAt(pos)<='9'.charCodeAt(0))
                    );
        },
        // 将 Date 对象，格式化为一个字符串
        format: function( date )
        {
            var d = new Date(date.getTime());
            if ( ( this._offAl == Number.MIN_VALUE ) && ( this._offF != Number.MIN_VALUE ) )
                d.setTime( ( d.getTime() + (d.getTimezoneOffset()*60000) ) + (this._offF*60000) );

            var t;
            var str = '';
            for ( var f = 0 ; f < this._flen ; f++ )
            {
              if ( this.fmt.charAt(f) != '%' )
                str += this.fmt.charAt(f);
              else
              {
                var ch = this.fmt.charAt(f+1)
                switch ( ch )
                {
                  case 'a': // Abbreviated weekday name (Sun..Sat)
                    str += this.dAbbr[ d.getDay() ];
                    break;
                  case 'B': // BCE string (eAbbr[0], usually BCE or BC, only if appropriate) (NON-MYSQL)
                    if ( d.getFullYear() < 0 )
                      str += this.eAbbr[0];
                    break;
                  case 'b': // Abbreviated month name (Jan..Dec)
                    str += this.mAbbr[ d.getMonth() ];
                    break;
                  case 'C': // CE string (eAbbr[1], usually CE or AD, only if appropriate) (NON-MYSQL)
                    if ( d.getFullYear() > 0 )
                      str += this.eAbbr[1];
                    break;
                  case 'c': // Month, numeric (0..12)
                    str += d.getMonth()+1;
                    break;
                  case 'd': // Day of the month, numeric (00..31)
                    t = d.getDate();
                    if ( t < 10 ) str += '0';
                    str += String(t);
                    break;
                  case 'D': // Day of the month with English suffix (0th, 1st,...)
                    t = String(d.getDate());
                    str += t;
                    if ( ( t.length == 2 ) && ( t.charAt(0) == '1' ) )
                      str += 'th';
                    else
                    {
                      switch ( t.charAt( t.length-1 ) )
                      {
                        case '1': str += 'st'; break;
                        case '2': str += 'nd'; break;
                        case '3': str += 'rd'; break;
                        default: str += 'th'; break;
                      }
                    }
                    break;
                  case 'E': // era string (from eAbbr[], BCE, CE, BC or AD) (NON-MYSQL)
                    str += this.eAbbr[ (d.getFullYear()<0) ? 0 : 1 ];
                    break;
                  case 'e': // Day of the month, numeric (0..31)
                    str += d.getDate();
                    break;
                  case 'H': // Hour (00..23)
                    t = d.getHours();
                    if ( t < 10 ) str += '0';
                    str += String(t);
                    break;
                  case 'h': // Hour (01..12)
                  case 'I': // Hour (01..12)
                    t = d.getHours() % 12;
                    if ( t === 0 )
                      str += '12';
                    else
                    {
                      if ( t < 10 ) str += '0';
                      str += String(t);
                    }
                    break;
                  case 'i': // Minutes, numeric (00..59)
                    t = d.getMinutes();
                    if ( t < 10 ) str += '0';
                    str += String(t);
                    break;
                  case 'k': // Hour (0..23)
                    str += d.getHours();
                    break;
                  case 'l': // Hour (1..12)
                    t = d.getHours() % 12;
                    if ( t === 0 )
                      str += '12';
                    else
                      str += String(t);
                    break;
                  case 'M': // Month name (January..December)
                    str += this.mNames[ d.getMonth() ];
                    break;
                  case 'm': // Month, numeric (00..12)
                    t = d.getMonth() + 1;
                    if ( t < 10 ) str += '0';
                    str += String(t);
                    break;
                  case 'p': // AM or PM
                    str += ( ( d.getHours() < 12 ) ? 'AM' : 'PM' );
                    break;
                  case 'r': // Time, 12-hour (hh:mm:ss followed by AM or PM)
                    t = d.getHours() % 12;
                    if ( t === 0 )
                      str += '12:';
                    else
                    {
                      if ( t < 10 ) str += '0';
                      str += String(t) + ':';
                    }
                    t = d.getMinutes();
                    if ( t < 10 ) str += '0';
                    str += String(t) + ':';
                    t = d.getSeconds();
                    if ( t < 10 ) str += '0';
                    str += String(t);
                    str += ( ( d.getHours() < 12 ) ? 'AM' : 'PM' );
                    break;
                  case 'S': // Seconds (00..59)
                  case 's': // Seconds (00..59)
                    t = d.getSeconds();
                    if ( t < 10 ) str += '0';
                    str += String(t);
                    break;
                  case 'T': // Time, 24-hour (hh:mm:ss)
                    t = d.getHours();
                    if ( t < 10 ) str += '0';
                    str += String(t) + ':';
                    t = d.getMinutes();
                    if ( t < 10 ) str += '0';
                    str += String(t) + ':';
                    t = d.getSeconds();
                    if ( t < 10 ) str += '0';
                    str += String(t);
                    break;
                  case 'W': // Weekday name (Sunday..Saturday)
                    str += this.dNames[ d.getDay() ];
                    break;
                  case 'w': // Day of the week (0=Sunday..6=Saturday)
                    str += d.getDay();
                    break;
                  case 'Y': // Year, numeric, four digits (negative if before 0001)
                    str += pad(d.getFullYear(),4);
                    break;
                  case 'y': // Year, numeric (two digits, negative if before 0001)
                    t = d.getFullYear() % 100;
                    str += pad(t,2);
                    break;
                  case 'Z': // Year, numeric, four digits, unsigned (NON-MYSQL)
                    str += pad(Math.abs(d.getFullYear()),4);
                    break;
                  case 'z': // Year, numeric, variable length, unsigned (NON-MYSQL)
                    str += Math.abs(d.getFullYear());
                    break;
                  case '%': // A literal '%' character
                    str += '%';
                    break;
                  case '#': // signed timezone offset in minutes
                  {
                    t = ( this._offAl != Number.MIN_VALUE ) ? this._offAl :
                        ( this._offF == Number.MIN_VALUE ) ? (0-d.getTimezoneOffset()) : this._offF;
                    if ( t >= 0 )
                        str += '+';
                    str += t;
                    break;
                  }
                  case '@': // timezone offset label
                  {
                    t = ( this._offAl != Number.MIN_VALUE ) ? this._offAl :
                        ( this._offF == Number.MIN_VALUE ) ? (0-d.getTimezoneOffset()) : this._offF;
                    if ( AnyTime.utcLabel && AnyTime.utcLabel[t] )
                    {
                      if ( ( this._offFSI > 0 ) && ( this._offFSI < AnyTime.utcLabel[t].length ) )
                        str += AnyTime.utcLabel[t][this._offFSI];
                      else
                        str += AnyTime.utcLabel[t][0];
                      break;
                    }
                    str += 'UTC';
                    ch = ':'; // drop through for offset formatting
                    break;
                  }
                  case '+': // signed, 4-digit timezone offset in hours and minutes
                  case '-': // signed, 3-or-4-digit timezone offset in hours and minutes
                  case ':': // signed 4-digit timezone offset with colon delimiter
                  case ';': // signed 3-or-4-digit timezone offset with colon delimiter
                    t = ( this._offAl != Number.MIN_VALUE ) ? this._offAl :
                            ( this._offF == Number.MIN_VALUE ) ? (0-d.getTimezoneOffset()) : this._offF;
                    if ( t < 0 )
                      str += '-';
                    else
                      str += '+';
                    t = Math.abs(t);
                    str += ((ch=='+')||(ch==':')) ? pad(Math.floor(t/60),2) : Math.floor(t/60);
                    if ( (ch==':') || (ch==';') )
                      str += ':';
                    str += pad(t%60,2);
                    break;
                  case 'f': // Microseconds (000000..999999)
                  case 'j': // Day of year (001..366)
                  case 'U': // Week (00..53), where Sunday is the first day of the week
                  case 'u': // Week (00..53), where Monday is the first day of the week
                  case 'V': // Week (01..53), where Sunday is the first day of the week; used with %X
                  case 'v': // Week (01..53), where Monday is the first day of the week; used with %x
                  case 'X': // Year for the week where Sunday is the first day of the week, numeric, four digits; used with %V
                  case 'x': // Year for the week, where Monday is the first day of the week, numeric, four digits; used with %v
                    throw '%'+ch+' not implemented by AnyTime.Converter';
                  default: // for any character not listed above
                    str += this.fmt.substr(f,2);
                } // switch ( this.fmt.charAt(f+1) )
                f++;
              } // else
            } // for ( var f = 0 ; f < this._flen ; f++ )
            return str;
        },
        getUtcParseOffsetCaptured: function()
        {
            return this._offCap;
        },
        getUtcParseOffsetSubIndex: function()
        {
            return this._offPSI;
        },
        // 将字符串转换为一个 Date 对象
        parse: function( str )
        {
            this._offCap = this._offP;
            this._offPSI = (-1);
            var era = 1;
            var time = new Date(4,0,1,0,0,0,0);//4=leap year bug
            var slen = str.length;
            var s = 0;
            var tzSign = 1, tzOff = this._offP;
            var i, matched, sub, sublen, temp;
            for ( var f = 0 ; f < this._flen ; f++ )
            {
              if ( this.fmt.charAt(f) == '%' )
              {
                var ch = this.fmt.charAt(f+1);
                switch ( ch )
                {
                  case 'a': // Abbreviated weekday name (Sun..Sat)
                    matched = false;
                    for ( sublen = 0 ; s + sublen < slen ; sublen++ )
                    {
                      sub = str.substr(s,sublen);
                      for ( i = 0 ; i < 12 ; i++ )
                        if ( this.dAbbr[i] == sub )
                        {
                          matched = true;
                          s += sublen;
                          break;
                        }
                      if ( matched )
                        break;
                    } // for ( sublen ... )
                    if ( ! matched )
                      throw 'unknown weekday: '+str.substr(s);
                    break;
                  case 'B': // BCE string (eAbbr[0]), only if needed. (NON-MYSQL)
                    sublen = this.eAbbr[0].length;
                    if ( ( s + sublen <= slen ) && ( str.substr(s,sublen) == this.eAbbr[0] ) )
                    {
                      era = (-1);
                      s += sublen;
                    }
                    break;
                  case 'b': // Abbreviated month name (Jan..Dec)
                    matched = false;
                    for ( sublen = 0 ; s + sublen < slen ; sublen++ )
                    {
                      sub = str.substr(s,sublen);
                      for ( i = 0 ; i < 12 ; i++ )
                        if ( this.mAbbr[i] == sub )
                        {
                          time.setMonth( i );
                          matched = true;
                          s += sublen;
                          break;
                        }
                      if ( matched )
                        break;
                    } // for ( sublen ... )
                    if ( ! matched )
                      throw 'unknown month: '+str.substr(s);
                    break;
                  case 'C': // CE string (eAbbr[1]), only if needed. (NON-MYSQL)
                    sublen = this.eAbbr[1].length;
                    if ( ( s + sublen <= slen ) && ( str.substr(s,sublen) == this.eAbbr[1] ) )
                      s += sublen; // note: CE is the default era
                    break;
                  case 'c': // Month, numeric (0..12)
                    if ( ( s+1 < slen ) && this.dAt(str,s+1) )
                    {
                      time.setMonth( (Number(str.substr(s,2))-1)%12 );
                      s += 2;
                    }
                    else
                    {
                      time.setMonth( (Number(str.substr(s,1))-1)%12 );
                      s++;
                    }
                    break;
                  case 'D': // Day of the month with English suffix (0th,1st,...)
                    if ( ( s+1 < slen ) && this.dAt(str,s+1) )
                    {
                      time.setDate( Number(str.substr(s,2)) );
                      s += 4;
                    }
                    else
                    {
                      time.setDate( Number(str.substr(s,1)) );
                      s += 3;
                    }
                    break;
                  case 'd': // Day of the month, numeric (00..31)
                    time.setDate( Number(str.substr(s,2)) );
                    s += 2;
                    break;
                  case 'E': // era string (from eAbbr[]) (NON-MYSQL)
                    sublen = this.eAbbr[0].length;
                    if ( ( s + sublen <= slen ) && ( str.substr(s,sublen) == this.eAbbr[0] ) )
                    {
                      era = (-1);
                      s += sublen;
                    }
                    else if ( ( s + ( sublen = this.eAbbr[1].length ) <= slen ) && ( str.substr(s,sublen) == this.eAbbr[1] ) )
                      s += sublen; // note: CE is the default era
                    else
                      throw 'unknown era: '+str.substr(s);
                    break;
                  case 'e': // Day of the month, numeric (0..31)
                    if ( ( s+1 < slen ) && this.dAt(str,s+1) )
                    {
                      time.setDate( Number(str.substr(s,2)) );
                      s += 2;
                    }
                    else
                    {
                      time.setDate( Number(str.substr(s,1)) );
                      s++;
                    }
                    break;
                  case 'f': // Microseconds (000000..999999)
                    s += 6; // SKIPPED!
                    break;
                  case 'H': // Hour (00..23)
                    time.setHours( Number(str.substr(s,2)) );
                    s += 2;
                    break;
                  case 'h': // Hour (01..12)
                  case 'I': // Hour (01..12)
                    time.setHours( Number(str.substr(s,2)) );
                    s += 2;
                    break;
                  case 'i': // Minutes, numeric (00..59)
                    time.setMinutes( Number(str.substr(s,2)) );
                    s += 2;
                    break;
                  case 'k': // Hour (0..23)
                    if ( ( s+1 < slen ) && this.dAt(str,s+1) )
                    {
                      time.setHours( Number(str.substr(s,2)) );
                      s += 2;
                    }
                    else
                    {
                      time.setHours( Number(str.substr(s,1)) );
                      s++;
                    }
                    break;
                  case 'l': // Hour (1..12)
                    if ( ( s+1 < slen ) && this.dAt(str,s+1) )
                    {
                      time.setHours( Number(str.substr(s,2)) );
                      s += 2;
                    }
                    else
                    {
                      time.setHours( Number(str.substr(s,1)) );
                      s++;
                    }
                    break;
                  case 'M': // Month name (January..December)
                    matched = false;
                    for (sublen=this._shortMon ; s + sublen <= slen ; sublen++ )
                    {
                      if ( sublen > this._longMon )
                        break;
                      sub = str.substr(s,sublen);
                      for ( i = 0 ; i < 12 ; i++ )
                      {
                        if ( this.mNames[i] == sub )
                        {
                          time.setMonth( i );
                          matched = true;
                          s += sublen;
                          break;
                        }
                      }
                      if ( matched )
                        break;
                    }
                    break;
                  case 'm': // Month, numeric (00..12)
                    time.setMonth( (Number(str.substr(s,2))-1)%12 );
                    s += 2;
                    break;
                  case 'p': // AM or PM
                  if ( time.getHours() == 12 )
                  {
                      if ( str.charAt(s) == 'A' )
                        time.setHours(0);
                  }
                  else if ( str.charAt(s) == 'P' )
                      time.setHours( time.getHours() + 12 );
                    s += 2;
                    break;
                  case 'r': // Time, 12-hour (hh:mm:ss followed by AM or PM)
                    time.setHours(Number(str.substr(s,2)));
                    time.setMinutes(Number(str.substr(s+3,2)));
                    time.setSeconds(Number(str.substr(s+6,2)));
                  if ( time.getHours() == 12 )
                  {
                      if ( str.charAt(s+8) == 'A' )
                        time.setHours(0);
                  }
                  else if ( str.charAt(s+8) == 'P' )
                      time.setHours( time.getHours() + 12 );
                    s += 10;
                    break;
                  case 'S': // Seconds (00..59)
                  case 's': // Seconds (00..59)
                    time.setSeconds(Number(str.substr(s,2)));
                    s += 2;
                    break;
                  case 'T': // Time, 24-hour (hh:mm:ss)
                    time.setHours(Number(str.substr(s,2)));
                    time.setMinutes(Number(str.substr(s+3,2)));
                    time.setSeconds(Number(str.substr(s+6,2)));
                    s += 8;
                    break;
                  case 'W': // Weekday name (Sunday..Saturday)
                    matched = false;
                    for (sublen=this._shortDay ; s + sublen <= slen ; sublen++ )
                    {
                      if ( sublen > this._longDay )
                        break;
                      sub = str.substr(s,sublen);
                      for ( i = 0 ; i < 7 ; i++ )
                      {
                        if ( this.dNames[i] == sub )
                        {
                          matched = true;
                          s += sublen;
                          break;
                        }
                      }
                      if ( matched )
                        break;
                    }
                    break;
                case 'w': // Day of the week (0=Sunday..6=Saturday) (ignored)
                  s += 1;
                  break;
                  case 'Y': // Year, numeric, four digits, negative if before 0001
                    i = 4;
                    if ( str.substr(s,1) == '-' )
                      i++;
                    time.setFullYear(Number(str.substr(s,i)));
                    s += i;
                    break;
                  case 'y': // Year, numeric (two digits), negative before baseYear
                    i = 2;
                    if ( str.substr(s,1) == '-' )
                      i++;
                    temp = Number(str.substr(s,i));
                    if ( typeof(this.baseYear) == 'number' )
                        temp += this.baseYear;
                    else if ( temp < 70 )
                        temp += 2000;
                    else
                        temp += 1900;
                    time.setFullYear(temp);
                    s += i;
                    break;
                  case 'Z': // Year, numeric, four digits, unsigned (NON-MYSQL)
                    time.setFullYear(Number(str.substr(s,4)));
                    s += 4;
                    break;
                  case 'z': // Year, numeric, variable length, unsigned (NON-MYSQL)
                    i = 0;
                    while ( ( s < slen ) && this.dAt(str,s) )
                      i = ( i * 10 ) + Number(str.charAt(s++));
                    time.setFullYear(i);
                    break;
                  case '#': // signed timezone offset in minutes.
                    if ( str.charAt(s++) == '-' )
                        tzSign = (-1);
                    for ( tzOff = 0 ; ( s < slen ) && (String(i=Number(str.charAt(s)))==str.charAt(s)) ; s++ )
                        tzOff = ( tzOff * 10 ) + i;
                    tzOff *= tzSign;
                    break;
                  case '@': // timezone label
                  {  this._offPSI = (-1);
                    if ( AnyTime.utcLabel )
                    {
                        matched = false;
                        for ( tzOff in AnyTime.utcLabel )
                      if ( ! Array.prototype[tzOff] ) // prototype.js compatibility issue
                          {
                              for ( i = 0 ; i < AnyTime.utcLabel[tzOff].length ; i++ )
                            {
                                sub = AnyTime.utcLabel[tzOff][i];
                                sublen = sub.length;
                                if ( ( s+sublen <= slen ) && ( str.substr(s,sublen) == sub ) )
                                {
                            s+=sublen;
                                    matched = true;
                                    break;
                                }
                            }
                              if ( matched )
                                  break;
                          }
                        if ( matched )
                        {
                            this._offPSI = i;
                            tzOff = Number(tzOff);
                            break; // case
                        }
                    }
                    if ( ( s+9 < slen ) || ( str.substr(s,3) != "UTC" ) )
                        throw 'unknown time zone: '+str.substr(s);
                    s += 3;
                    ch = ':'; // drop through for offset parsing
                    break;
                  }
                  case '-': // signed, 3-or-4-digit timezone offset in hours and minutes
                  case '+': // signed, 4-digit timezone offset in hours and minutes
                  case ':': // signed 4-digit timezone offset with colon delimiter
                  case ';': // signed 3-or-4-digit timezone offset with colon delimiter
                    if ( str.charAt(s++) == '-' )
                        tzSign = (-1);
                    tzOff = Number(str.charAt(s));
                    if ( (ch=='+')||(ch==':')||((s+3<slen)&&(String(Number(str.charAt(s+3)))!==str.charAt(s+3))) )
                        tzOff = (tzOff*10) + Number(str.charAt(++s));
                    tzOff *= 60;
                    if ( (ch==':') || (ch==';') )
                        s++; // skip ":" (assumed)
                    tzOff = ( tzOff + Number(str.substr(++s,2)) ) * tzSign;
                    s += 2;
                    break;
                  case 'j': // Day of year (001..366)
                  case 'U': // Week (00..53), where Sunday is the first day of the week
                  case 'u': // Week (00..53), where Monday is the first day of the week
                  case 'V': // Week (01..53), where Sunday is the first day of the week; used with %X
                  case 'v': // Week (01..53), where Monday is the first day of the week; used with %x
                  case 'X': // Year for the week where Sunday is the first day of the week, numeric, four digits; used with %V
                  case 'x': // Year for the week, where Monday is the first day of the week, numeric, four digits; used with %v
                    throw '%'+this.fmt.charAt(f+1)+' not implemented by AnyTime.Converter';
                  case '%': // A literal '%' character
                  // default: // for any character not listed above
                    // throw '%'+this.fmt.charAt(f+1)+' reserved for future use';
                    // break;
                }
                f++;
              } // if ( this.fmt.charAt(f) == '%' )
              else if ( this.fmt.charAt(f) != str.charAt(s) )
                throw str + ' is not in "' + this.fmt + '" format';
              else
                s++;
            } // for ( var f ... )
            if ( era < 0 )
              time.setFullYear( 0 - time.getFullYear() );
            if ( tzOff != Number.MIN_VALUE )
            {
               if ( this._captureOffset )
                 this._offCap = tzOff;
               else
                 time.setTime( ( time.getTime() - (tzOff*60000) ) - (time.getTimezoneOffset()*60000) );
            }

            return time;
        },
        setUtcFormatOffsetAlleged: function( offset )
        {
            var prev = this._offAl;
            this._offAl = offset;
            return prev;
        },
        setUtcFormatOffsetSubIndex: function( subIndex )
        {
            var prev = this._offFSI;
            this._offFSI = subIndex;
            return prev;
        },
        destroy: function(){}
    });

    this.Anytime = new J.Class({extend: T.UI.BaseControl},{
        defaults: defaults,
        attributeMap: attributeMap,
        init: function(element, options){
            this.element= $(element);

            var context= this;

            $(document).ready(function(){
                context.onReady();
                __initialized = true;
            });

            this.id = 'AnyTime--'+element.id.replace(/[^-_.A-Za-z0-9]/g,'--AnyTime--');

            // var options = jQuery.extend(true,{},options||{});
            // this.initSettings(options);
            var jqElement=$(element);
            this.initSettings(jqElement, options);


            this.settings.utcParseOffsetCapture = true;

            // 时间-字符串 转换器
            // this.conv = new AnyTime.Converter(this.settings);
            this.conv = new Converter(this.settings);

            if ( this.settings.placement )
            {
                if ( this.settings.placement == 'inline' )
                    this.pop = false;
                else if ( this.settings.placement != 'popup' )
                    throw 'unknown placement: ' + this.settings.placement;
            }

            if ( this.settings.earliest )
                this.earliest = this.makeDate( this.settings.earliest );

            if ( this.settings.firstDOW )
            {
                if ( ( this.settings.firstDOW < 0 ) || ( this.settings.firstDOW > 6 ) )
                    throw 'illegal firstDOW: ' + this.settings.firstDOW;
                this.fDOW = this.settings.firstDOW;
            }

            if ( this.settings.latest )
                this.latest = this.makeDate( this.settings.latest );

            this.lX = this.settings.labelDismiss || 'X';
            // this.lY = this.settings.labelYear || 'Year';
            // this.lO = this.settings.labelTimeZone || 'Time Zone';
            this.lY = this.settings.labelYear || '年';
            this.lO = this.settings.labelTimeZone || '时区';

            //  Infer what we can about what to display from the format.

            var i;
            var t;
            var lab;
            var shownFields = 0;
            var format = this.conv.fmt;

            if ( typeof this.settings.askEra != 'undefined' )
                this.askEra = this.settings.askEra;
            else
                this.askEra = (format.indexOf('%B')>=0) || (format.indexOf('%C')>=0) || (format.indexOf('%E')>=0);
            var askYear = (format.indexOf('%Y')>=0) || (format.indexOf('%y')>=0) || (format.indexOf('%Z')>=0) || (format.indexOf('%z')>=0);
            var askMonth = (format.indexOf('%b')>=0) || (format.indexOf('%c')>=0) || (format.indexOf('%M')>=0) || (format.indexOf('%m')>=0);
            var askDoM = (format.indexOf('%D')>=0) || (format.indexOf('%d')>=0) || (format.indexOf('%e')>=0);
            var askDate = askYear || askMonth || askDoM;
            this.twelveHr = (format.indexOf('%h')>=0) || (format.indexOf('%I')>=0) || (format.indexOf('%l')>=0) || (format.indexOf('%r')>=0);
            var askHour = this.twelveHr || (format.indexOf('%H')>=0) || (format.indexOf('%k')>=0) || (format.indexOf('%T')>=0);
            var askMinute = (format.indexOf('%i')>=0) || (format.indexOf('%r')>=0) || (format.indexOf('%T')>=0);
            var askSec = ( (format.indexOf('%r')>=0) || (format.indexOf('%S')>=0) || (format.indexOf('%s')>=0) || (format.indexOf('%T')>=0) );
            if ( askSec && ( typeof this.settings.askSecond != 'undefined' ) )
                askSec = this.settings.askSecond;
            var askOff = ( (format.indexOf('%#')>=0) || (format.indexOf('%+')>=0) || (format.indexOf('%-')>=0) || (format.indexOf('%:')>=0) || (format.indexOf('%;')>=0) || (format.indexOf('%<')>=0) || (format.indexOf('%>')>=0) || (format.indexOf('%@')>=0) );
            var askTime = askHour || askMinute || askSec || askOff;

            if ( askOff )
                // this.oConv = new AnyTime.Converter( { format: this.settings.formatUtcOffset ||
                this.oConv = new Converter( { format: this.settings.formatUtcOffset ||
                    format.match(/\S*%[-+:;<>#@]\S*/g).join(' ') } );

            //  Create the picker HTML and add it to the page.
            //  Popup pickers will be moved to the end of the body
            //  once the entire page has loaded.

            this.inp = $(document.getElementById(element.id)); // avoids ID-vs-pseudo-selector probs like id="foo:bar"
            this.ro = this.inp.prop('readonly');
            // removed by matrix 2015-11-26
            this.inp.prop('readonly',true);
            this.div = $( '<div class="AnyTime-win AnyTime-pkr ui-widget ui-widget-content ui-corner-all" id="' + this.id + '" aria-live="off"></div>' );
            this.inp.after(this.div);
            this.hTitle = $( '<h5 class="AnyTime-hdr ui-widget-header ui-corner-top"/>' );
            this.div.append( this.hTitle );
            this.dB = $( '<div class="AnyTime-body"></div>' );
            this.div.append( this.dB );

            if ( this.settings.hideInput )
                this.inp.css({border:0,height:'1px',margin:0,padding:0,width:'1px'});

            //  Add dismiss box to title (if popup)

            t = null;
            var xDiv = null;
            if ( this.pop )
            {
                xDiv = $( '<div class="AnyTime-x-btn ui-state-default">'+this.lX+'</div>' );
                this.hTitle.append( xDiv );
                xDiv.click(function(e){context.dismiss(e);});
            }

            //  date (calendar) portion

            lab = '';
            if ( askDate )
            {
                this.dD = $( '<div class="AnyTime-date"></div>' );
                this.dB.append( this.dD );

                if ( askYear )
                {
                    this.yLab = $('<h6 class="AnyTime-lbl AnyTime-lbl-yr">' + this.lY + '</h6>');
                    this.dD.append( this.yLab );

                    this.dY = $( '<ul class="AnyTime-yrs ui-helper-reset" />' );
                    this.dD.append( this.dY );

                    this.yPast = this.btn(this.dY,'&lt;',this.newYear,['yrs-past'],'- '+this.lY);
                    this.yPrior = this.btn(this.dY,'1',this.newYear,['yr-prior'],'-1 '+this.lY);
                    this.yCur = this.btn(this.dY,'2',this.newYear,['yr-cur'],this.lY);
                    this.yCur.removeClass('ui-state-default');
                    this.yCur.addClass('AnyTime-cur-btn ui-state-default ui-state-highlight');

                    this.yNext = this.btn(this.dY,'3',this.newYear,['yr-next'],'+1 '+this.lY);
                    this.yAhead = this.btn(this.dY,'&gt;',this.newYear,['yrs-ahead'],'+ '+this.lY);

                    shownFields++;
                } // if ( askYear )

                if ( askMonth )
                {
                    // lab = this.settings.labelMonth || 'Month';
                    lab = this.settings.labelMonth || '月';
                    this.hMo = $( '<h6 class="AnyTime-lbl AnyTime-lbl-month">' + lab + '</h6>' );
                    this.dD.append( this.hMo );
                    this.dMo = $('<ul class="AnyTime-mons" />');
                    this.dD.append(this.dMo);
                    for ( i = 0 ; i < 12 ; i++ )
                    {
                        var mBtn = this.btn( this.dMo, this.conv.mAbbr[i],
                            function( event )
                            {
                                var elem = $(event.target);
                                if ( elem.hasClass("AnyTime-out-btn") )
                                    return;
                                var mo = event.target.AnyTime_month;
                                var t = new Date(this.time.getTime());
                                if ( t.getDate() > __daysIn[mo] )
                                    t.setDate(__daysIn[mo])
                                t.setMonth(mo);
                                this.set(t);
                                this.upd(elem);
                            },
                            ['mon','mon'+String(i+1)], lab+' '+this.conv.mNames[i] );
                        mBtn[0].AnyTime_month = i;
                    }
                    shownFields++;
                }

                if ( askDoM )
                {
                    //lab = this.settings.labelDayOfMonth || 'Day of Month';
                    lab = this.settings.labelDayOfMonth || '日';
                    this.hDoM = $('<h6 class="AnyTime-lbl AnyTime-lbl-dom">' + lab + '</h6>' );
                    this.dD.append( this.hDoM );
                    this.dDoM =  $( '<table border="0" cellpadding="0" cellspacing="0" class="AnyTime-dom-table"/>' );
                    this.dD.append( this.dDoM );
                    t = $( '<thead class="AnyTime-dom-head"/>' );
                    this.dDoM.append(t);
                    var tr = $( '<tr class="AnyTime-dow"/>' );
                    t.append(tr);
                    for ( i = 0 ; i < 7 ; i++ )
                      tr.append( '<th class="AnyTime-dow AnyTime-dow'+String(i+1)+'">'+this.conv.dAbbr[(this.fDOW+i)%7]+'</th>' );

                    var tbody = $( '<tbody class="AnyTime-dom-body" />' );
                    this.dDoM.append(tbody);
                    for ( var r = 0 ; r < 6 ; r++ )
                    {
                      tr = $( '<tr class="AnyTime-wk AnyTime-wk'+String(r+1)+'"/>' );
                      tbody.append(tr);
                      for ( i = 0 ; i < 7 ; i++ )
                          this.btn( tr, 'x',
                            function( event )
                            {
                                var elem = $(event.target);
                                if ( elem.hasClass("AnyTime-out-btn") )
                                    return;
                                var dom = Number(elem.html());
                                if ( dom )
                                {
                                    var t = new Date(this.time.getTime());
                                    t.setDate(dom);
                                    this.set(t);
                                    this.upd(elem);
                                }
                            },
                            ['dom'], lab );
                    }
                    shownFields++;

                } // if ( askDoM )

            } // if ( askDate )

            //  time portion

            if ( askTime )
            {
                var tensDiv, onesDiv;

                this.dT = $('<div class="AnyTime-time"></div>');
                this.dB.append(this.dT);

                if ( askHour )
                {
                this.dH = $('<div class="AnyTime-hrs"></div>');
                this.dT.append(this.dH);

                // lab = this.settings.labelHour || 'Hour';
                lab = this.settings.labelHour || '时';
                this.dH.append( $('<h6 class="AnyTime-lbl AnyTime-lbl-hr">'+lab+'</h6>') );
                var amDiv = $('<ul class="AnyTime-hrs-am"/>');
                this.dH.append( amDiv );
                var pmDiv = $('<ul class="AnyTime-hrs-pm"/>');
                this.dH.append( pmDiv );

                for ( i = 0 ; i < 12 ; i++ )
                {
                    if ( this.twelveHr )
                    {
                    if ( i === 0 )
                        t = '12am';
                        else
                        t = String(i)+'am';
                    }
                    else
                        t = pad(i,2);

                    this.btn( amDiv, t, this.newHour,['hr','hr'+String(i)],lab+' '+t);

                    if ( this.twelveHr )
                    {
                        if ( i === 0 )
                            t = '12pm';
                        else
                            t = String(i)+'pm';
                    }
                    else
                        t = i+12;

                    this.btn( pmDiv, t, this.newHour,['hr','hr'+String(i+12)],lab+' '+t);
                }

                shownFields++;

              } // if ( askHour )

              if ( askMinute )
              {
                this.dM = $('<div class="AnyTime-mins"></div>');
                this.dT.append(this.dM);

                // lab = this.settings.labelMinute || 'Minute';
                lab = this.settings.labelMinute || '分';
                this.dM.append( $('<h6 class="AnyTime-lbl AnyTime-lbl-min">'+lab+'</h6>') );
                tensDiv = $('<ul class="AnyTime-mins-tens"/>');
                this.dM.append(tensDiv);

                for ( i = 0 ; i < 6 ; i++ )
                  this.btn( tensDiv, i, function( event ){
                              var elem = $(event.target);
                              if ( elem.hasClass("AnyTime-out-btn") )
                                    return;
                              var t = new Date(this.time.getTime());
                              t.setMinutes( (Number(elem.text())*10) + (this.time.getMinutes()%10) );
                              this.set(t);
                              this.upd(elem);
                          },
                          ['min-ten','min'+i+'0'], lab+' '+i+'0' );
                for ( ; i < 12 ; i++ )
                      this.btn( tensDiv, '&#160;', $.noop, ['min-ten','min'+i+'0'], lab+' '+i+'0' ).addClass('AnyTime-min-ten-btn-empty ui-state-default ui-state-disabled');

                onesDiv = $('<ul class="AnyTime-mins-ones"/>');
                this.dM.append(onesDiv);
                for ( i = 0 ; i < 10 ; i++ )
                  this.btn( onesDiv, i,
                      function( event )
                      {
                          var elem = $(event.target);
                          if ( elem.hasClass("AnyTime-out-btn") )
                                return;
                          var t = new Date(this.time.getTime());
                          t.setMinutes( (Math.floor(this.time.getMinutes()/10)*10)+Number(elem.text()) );
                          this.set(t);
                          this.upd(elem);
                      },
                      ['min-one','min'+i], lab+' '+i );
                for ( ; i < 12 ; i++ )
                    this.btn( onesDiv, '&#160;', $.noop, ['min-one','min'+i+'0'], lab+' '+i ).addClass('AnyTime-min-one-btn-empty ui-state-default ui-state-disabled');

                shownFields++;

              } // if ( askMinute )

              if ( askSec )
              {
                this.dS = $('<div class="AnyTime-secs"></div>');
                this.dT.append(this.dS);
                // lab = this.settings.labelSecond || 'Second';
                lab = this.settings.labelSecond || '秒';
                this.dS.append( $('<h6 class="AnyTime-lbl AnyTime-lbl-sec">'+lab+'</h6>') );
                tensDiv = $('<ul class="AnyTime-secs-tens"/>');
                this.dS.append(tensDiv);

                for ( i = 0 ; i < 6 ; i++ )
                  this.btn( tensDiv, i,function( event ){
                          var elem = $(event.target);
                          if ( elem.hasClass("AnyTime-out-btn") )
                                return;
                          var t = new Date(this.time.getTime());
                          t.setSeconds( (Number(elem.text())*10) + (this.time.getSeconds()%10) );
                          this.set(t);
                          this.upd(elem);
                      },
                      ['sec-ten','sec'+i+'0'], lab+' '+i+'0' );
                for ( ; i < 12 ; i++ )
                      this.btn( tensDiv, '&#160;', $.noop, ['sec-ten','sec'+i+'0'], lab+' '+i+'0' ).addClass('AnyTime-sec-ten-btn-empty ui-state-default ui-state-disabled');

                onesDiv = $('<ul class="AnyTime-secs-ones"/>');
                this.dS.append(onesDiv);
                for ( i = 0 ; i < 10 ; i++ )
                  this.btn( onesDiv, i,function( event ){
                          var elem = $(event.target);
                          if ( elem.hasClass("AnyTime-out-btn") )
                                return;
                          var t = new Date(this.time.getTime());
                          t.setSeconds( (Math.floor(this.time.getSeconds()/10)*10) + Number(elem.text()) );
                          this.set(t);
                          this.upd(elem);
                      },
                      ['sec-one','sec'+i], lab+' '+i );
                for ( ; i < 12 ; i++ )
                      this.btn( onesDiv, '&#160;', $.noop, ['sec-one','sec'+i+'0'], lab+' '+i ).addClass('AnyTime-sec-one-btn-empty ui-state-default ui-state-disabled');

                shownFields++;

              } // if ( askSec )

              if ( askOff )
              {
                this.dO = $('<div class="AnyTime-offs" ></div>');
                this.dT.append('<br />');
                this.dT.append(this.dO);

                this.oList = $('<ul class="AnyTime-off-list ui-helper-reset" />');
                this.dO.append(this.oList);

                this.oCur = this.btn(this.oList,'',this.newOffset,['off','off-cur'],lab);
                this.oCur.removeClass('ui-state-default');
                this.oCur.addClass('AnyTime-cur-btn ui-state-default ui-state-highlight');

                this.oSel = this.btn(this.oList,'&#177;',this.newOffset,['off','off-select'],'+/- '+this.lO);

                this.oMinW = this.dO.outerWidth(true);
                this.oLab = $('<h6 class="AnyTime-lbl AnyTime-lbl-off">' + this.lO + '</h6>');
                this.dO.prepend( this.oLab );

                shownFields++;
              }

            } // if ( askTime )

            //  Set the title.  If a title option has been specified, use it.
            //  Otherwise, determine a worthy title based on which (and how many)
            //  format fields have been specified.

            if ( this.settings.labelTitle )
                this.hTitle.append( this.settings.labelTitle );
            else if ( shownFields > 1 )
                // this.hTitle.append( 'Select a '+(askDate?(askTime?'Date and Time':'Date'):'Time') );
                this.hTitle.append( '选择 '+(askDate?(askTime?'日期时间':'日期'):'时间') );
            else
                // this.hTitle.append( 'Select' );
                this.hTitle.append( '选择' );


            //  Initialize the picker's date/time value.

            try
            {
                this.time = this.conv.parse(this.inp.val());
                this.offMin = this.conv.getUtcParseOffsetCaptured();
                this.offSI = this.conv.getUtcParseOffsetSubIndex();
                if ( 'init' in this.settings ) // override
                this.time = this.makeDate( this.settings.init);
            }
            catch ( e )
            {
                this.time = new Date();
            }
            // this.lastAjax = this.time;


            //  If this is a popup picker, hide it until needed.

            if ( this.pop )
            {
                this.div.hide();
                this.div.css('position','absolute');
            }

            //  Setup event listeners for the input and resize listeners for
            //  the picker.  Add the picker to the instances list (which is used
            //  to hide pickers if the user clicks off of them).

            this.inp.blur( this.hBlur =function(e){
                context.inpBlur(e);
            } );

            this.inp.click( this.hClick =function(e){
                context.showPkr(e);
            } );

            this.inp.focus( this.hFocus =function(e){
                if ( context.lostFocus )
                    context.showPkr(e);
                context.lostFocus = false;
            } );

            this.inp.keydown( this.hKeydown =function(e){
                context.key(e);
            } );

            this.inp.keypress( this.hKeypress =function(e){
                // if ( $.browser.opera && context.denyTab )
                //     e.preventDefault();
            });

            this.div.click(function(e){
                context.lostFocus = false;
                context.inp.focus();
            });

            $(window).resize( this.hResize = function(e){
                context.pos(e);
            } );

            if ( __initialized )
                this.onReady();
        },

        //  private members

        twelveHr: false,
        denyTab: true,      // set to true to stop Opera from tabbing away
        askEra: false,      // prompt the user for the era in yDiv?
        cloak: null,        // cloak div
        conv: null,         // AnyTime.Converter
        div: null,          // picker div
        dB: null,           // body div
        dD: null,           // date div
        dY: null,           // years div
        dMo: null,          // months div
        dDoM: null,         // date-of-month table
        hDoM: null,         // date-of-month heading
        hMo: null,          // month heading
        hTitle: null,       // title heading
        hY: null,           // year heading
        dT: null,           // time div
        dH: null,           // hours div
        dM: null,           // minutes div
        dS: null,           // seconds div
        dO: null,           // offset (time zone) div
        earliest: null,     // earliest selectable date/time
        fBtn: null,         // button with current focus
        fDOW: 0,            // index to use as first day-of-week 星期的第一天
        hBlur: null,        // input handler
        hClick: null,       // input handler
        hFocus: null,       // input handler
        hKeydown: null,     // input handler
        hKeypress: null,    // input handler
        hResize: null,      // event handler
        id: null,           // picker ID
        inp: null,          // input text field
        latest: null,       // latest selectable date/time
        // lastAjax: null,     // last value submitted using AJAX
        lostFocus: false,   // when focus is lost, must redraw
        lX: 'X',            // 关闭按钮 label for dismiss button
        // lY: 'Year',         // 年 label for year
        // lO: 'Time Zone',    // 时区 label for UTC offset (time zone)
        lY: '年',           // 年 label for year
        lO: '时区',         // 时区 label for UTC offset (time zone)
        oBody: null,        // UTC offset selector popup
        oConv: null,        // AnyTime.Converter for offset display
        oCur: null,         // current-UTC-offset button
        oDiv: null,         // UTC offset selector popup
        oLab: null,         // UTC offset label
        oList: null,       // UTC offset container
        oSel: null,         // select (plus/minus) UTC-offset button
        offMin: Number.MIN_VALUE, // current UTC offset in minutes
        offSI: -1,          // current UTC label sub-index (if any)
        offStr: "",         // current UTC offset (time zone) string
        pop: true,          // picker is a popup?
        ro: false,          // was input readonly before picker initialized?
        time: null,         // current date/time
        // url: null,          // URL to submit value using AJAX
        yAhead: null,       // years-ahead button
        y0XXX: null,        // millenium-digit-zero button (for focus)
        yCur: null,         // current-year button
        yDiv: null,         // year selector popup
        yLab: null,         // year label
        yNext: null,        // next-year button
        yPast: null,        // years-past button
        yPrior: null,       // prior-year button

        //---------------------------------------------------------------------
        //  .askOffset() is called by this.newOffset() when the UTC offset or
        //  +- selection button is clicked.
        //---------------------------------------------------------------------

        askOffset: function( event )
        {
            var context= this;

            if ( ! this.oDiv )
            {
              this.makeCloak();

              this.oDiv = $('<div class="AnyTime-win AnyTime-off-selector ui-widget ui-widget-content ui-corner-all"></div>');
              this.div.append(this.oDiv);

              // the order here (HDR,BODY,XDIV,TITLE) is important for width calcluation:
              var title = $('<h5 class="AnyTime-hdr AnyTime-hdr-off-selector ui-widget-header ui-corner-top" />');
              this.oDiv.append( title );
              this.oBody = $('<div class="AnyTime-body AnyTime-body-off-selector"></div>');
              this.oDiv.append( this.oBody );

              var xDiv = $('<div class="AnyTime-x-btn ui-state-default">'+this.lX+'</div>');
              title.append(xDiv);
              xDiv.click(function(e){context.dismissODiv(e);});
              title.append( this.lO );

              var cont = $('<ul class="AnyTime-off-off" />' );
              var last = null;
              this.oBody.append(cont);
              var useSubIndex = (this.oConv.fmt.indexOf('%@')>=0);
              if ( AnyTime.utcLabel )
                  for ( var o = -720 ; o <= 840 ; o++ )
                      if ( AnyTime.utcLabel[o] )
                      {
                        this.oConv.setUtcFormatOffsetAlleged(o);
                        for ( var i = 0; i < AnyTime.utcLabel[o].length; i++ )
                        {
                          this.oConv.setUtcFormatOffsetSubIndex(i);
                          last = this.btn( cont, this.oConv.format(this.time), this.newOPos, ['off-off'], o );
                          last[0].AnyTime_offMin = o;
                          last[0].AnyTime_offSI = i;
                          if ( ! useSubIndex )
                              break; // for
                        }
                      }

            if ( last )
                last.addClass('AnyTime-off-off-last-btn');

            if ( this.oDiv.outerHeight(true) > this.div.height() )
            {
                var oldW = this.oBody.width();
                this.oBody.css('height','0');
                this.oBody.css({
                    height: String(this.div.height()-(this.oDiv.outerHeight(true)+this.oBody.outerHeight(false)))+'px',
                    width: String(oldW+20)+'px' 
                }); // wider for scroll bar
            }
            if ( this.oDiv.outerWidth(true) > this.div.width() )
            {
                this.oBody.css('width','0');
                this.oBody.css('width', String(this.div.width() - (this.oDiv.outerWidth(true)+this.oBody.outerWidth(false)))+'px');
            }

            } // if ( ! this.oDiv )
            else
            {
                this.cloak.show();
                this.oDiv.show();
            }
            this.pos(event);
            this.updODiv(null);

            var f = this.oDiv.find('.AnyTime-off-off-btn.AnyTime-cur-btn:first');
            if ( ! f.length )
                f = this.oDiv.find('.AnyTime-off-off-btn:first');
            this.setFocus( f );

        }, // .askOffset()

        //---------------------------------------------------------------------
        //  .askYear() is called by this.newYear() when the yPast or yAhead
        //  button is clicked.
        //---------------------------------------------------------------------

        askYear: function( event )
        {
            var context= this;

            if ( ! this.yDiv )
            {
              this.makeCloak();

              this.yDiv = $('<div class="AnyTime-win AnyTime-yr-selector ui-widget ui-widget-content ui-corner-all"></div>');
              this.div.append(this.yDiv);

              var title = $('<h5 class="AnyTime-hdr AnyTime-hdr-yr-selector ui-widget-header ui-corner-top" />');
              this.yDiv.append( title );

              var xDiv = $('<div class="AnyTime-x-btn ui-state-default">'+this.lX+'</div>');
              title.append(xDiv);
              xDiv.click(function(e){context.dismissYDiv(e);});

              title.append( this.lY );

              var yBody = $('<div class="AnyTime-body AnyTime-body-yr-selector" ></div>');
              this.yDiv.append( yBody );

              var cont = $('<ul class="AnyTime-yr-mil" />' );
              yBody.append(cont);
              this.y0XXX = this.btn( cont, 0, this.newYPos,['mil','mil0'],this.lY+' '+0+'000');
              for ( var i = 1; i < 10 ; i++ )
                this.btn( cont, i, this.newYPos,['mil','mil'+i],this.lY+' '+i+'000');

              cont = $('<ul class="AnyTime-yr-cent" />' );
              yBody.append(cont);
              for ( i = 0 ; i < 10 ; i++ )
                this.btn( cont, i, this.newYPos,['cent','cent'+i],this.lY+' '+i+'00');

              cont = $('<ul class="AnyTime-yr-dec" />');
              yBody.append(cont);
              for ( i = 0 ; i < 10 ; i++ )
                this.btn( cont, i, this.newYPos,['dec','dec'+i],this.lY+' '+i+'0');

              cont = $('<ul class="AnyTime-yr-yr" />');
              yBody.append(cont);
              for ( i = 0 ; i < 10 ; i++ )
                this.btn( cont, i, this.newYPos,['yr','yr'+i],this.lY+' '+i );

              if ( this.askEra )
              {
                cont = $('<ul class="AnyTime-yr-era" />' );
                yBody.append(cont);

                this.btn( cont, this.conv.eAbbr[0],
                        function( event )
                        {
                            var t = new Date(this.time.getTime());
                            var year = t.getFullYear();
                            if ( year > 0 )
                                t.setFullYear(0-year);
                            this.set(t);
                            this.updYDiv($(event.target));
                        },
                        ['era','bce'], this.conv.eAbbr[0] );

                this.btn( cont, this.conv.eAbbr[1],
                        function( event )
                        {
                            var t = new Date(this.time.getTime());
                            var year = t.getFullYear();
                            if ( year < 0 )
                                t.setFullYear(0-year);
                            this.set(t);
                            this.updYDiv($(event.target));
                        },
                        ['era','ce'], this.conv.eAbbr[1] );

              } // if ( this.askEra )
            } // if ( ! this.yDiv )
            else
            {
              this.cloak.show();
              this.yDiv.show();
            }
            this.pos(event);
            this.updYDiv(null);
            this.setFocus( this.yDiv.find('.AnyTime-yr-btn.AnyTime-cur-btn:first') );

        }, // .askYear()

        //---------------------------------------------------------------------
        //  .inpBlur() is called when a picker's input loses focus to dismiss
        //  the popup.  A 1/3 second delay is necessary to restore focus if
        //  the div is clicked (shorter delays don't always work!)  To prevent
        //  problems cause by scrollbar focus (except in FF), focus is
        //  force-restored if the offset div is visible.
        //---------------------------------------------------------------------

        inpBlur: function(event)
        {
            var context= this;
            
            if ( this.oDiv && this.oDiv.is(":visible") )
            {
                this.inp.focus();
                return;
            }
            this.lostFocus = true;
            setTimeout(
                function()
                {
                    if ( context.lostFocus )
                    {
                        context.div.find('.AnyTime-focus-btn').removeClass('AnyTime-focus-btn ui-state-focus');
                        if ( context.pop )
                            context.dismiss(event);
                    }
                }, 334 );
        },

        //---------------------------------------------------------------------
        //  .btn() is called by AnyTime.picker() to create a <div> element
        //  containing an <a> element.  The elements are given appropriate
        //  classes based on the specified "classes" (an array of strings).
        //  The specified "text" and "title" are used for the <a> element.
        //  The "handler" is bound to click events for the <div>, which will
        //  catch bubbling clicks from the <a> as well.  The button is
        //  appended to the specified parent (jQuery), and the <div> jQuery
        //  is returned.
        //---------------------------------------------------------------------

        btn: function( parent, text, handler, classes, title )
        {
            var context= this;
            var tagName = ( (parent[0].nodeName.toLowerCase()=='ul')?'li':'td');
            var div$ = '<' + tagName +
                            ' class="AnyTime-btn';
            for ( var i = 0 ; i < classes.length ; i++ )
                div$ += ' AnyTime-' + classes[i] + '-btn';
            var div = $( div$ + ' ui-state-default">' + text + '</' + tagName + '>' );
            parent.append(div);
            div.AnyTime_title = title;

            div.click(
                function(e)
                {
                  // bind the handler to the picker so "this" is correct
                  context.tempFunc = handler;
                  context.tempFunc(e);
                });
            div.dblclick(
                function(e)
                {
                    var elem = $(this);
                    if ( elem.is('.AnyTime-off-off-btn') )
                        context.dismissODiv(e);
                    else if ( 
                        elem.is('.AnyTime-mil-btn') || 
                        elem.is('.AnyTime-cent-btn') || 
                        elem.is('.AnyTime-dec-btn') || 
                        elem.is('.AnyTime-yr-btn') || 
                        elem.is('.AnyTime-era-btn') 
                    )
                        context.dismissYDiv(e);
                    else if ( context.pop )
                        context.dismiss(e);
                });
            return div;

        }, // .btn()

        //---------------------------------------------------------------------
        //  .destroy() destroys the DOM events and elements associated with
        //  the picker so it can be deleted.
        //---------------------------------------------------------------------

        destroy: function(event)
        {
            this.inp
                .prop('readonly',this.ro)
                .off('blur',this.hBlur)
                .off('click',this.hClick)
                .off('focus',this.hFocus)
                .off('keydown',this.hKeydown)
                .off('keypress',this.hKeypress);
            $(window).off('resize',this.hResize);
            this.div.remove();
        },

        //---------------------------------------------------------------------
        //  .dismiss() dismisses a popup picker.
        //---------------------------------------------------------------------

        dismiss: function(event)
        {
            // this.ajax();
            if ( this.yDiv )
                this.dismissYDiv();
            if ( this.oDiv )
                this.dismissODiv();
            this.div.hide();
            this.lostFocus = true;
        },

        dismissODiv: function(event)
        {
            this.oDiv.hide();
            this.cloak.hide();
            this.setFocus(this.oCur);
        },

        dismissYDiv: function(event)
        {
            this.yDiv.hide();
            this.cloak.hide();
            this.setFocus(this.yCur);
        },

        setFocus: function(btn)
        {
            if ( ! btn.hasClass('AnyTime-focus-btn') )
            {
                this.div.find('.AnyTime-focus-btn').removeClass('AnyTime-focus-btn ui-state-focus');
                this.fBtn = btn;
                btn.removeClass('ui-state-default ui-state-highlight');
                btn.addClass('AnyTime-focus-btn ui-state-default ui-state-highlight ui-state-focus');
            }
            if ( btn.hasClass('AnyTime-off-off-btn') )
            {
                var oBT = this.oBody.offset().top;
                var btnT = btn.offset().top;
                var btnH = btn.outerHeight(true);
                if ( btnT - btnH < oBT ) // move a page up
                    this.oBody.scrollTop( btnT + this.oBody.scrollTop() - ( this.oBody.innerHeight() + oBT ) + ( btnH * 2 ) );
                else if ( btnT + btnH > oBT + this.oBody.innerHeight() ) // move a page down
                    this.oBody.scrollTop( ( btnT + this.oBody.scrollTop() ) - ( oBT + btnH ) );
            }
        },

        key: function(event)
        {
            var mo;
            var t = null;
            var context = this;
            var elem = this.div.find('.AnyTime-focus-btn');
            var key = event.keyCode || event.which;
            this.denyTab = true;

            // if ( key == 16 ) // Shift
            // {
            // }
            // else 
            if ( ( key == 10 ) || ( key == 13 ) || ( key == 27 ) ) // Enter & Esc
            {
                if ( this.oDiv && this.oDiv.is(':visible') )
                    this.dismissODiv(event);
                else if ( this.yDiv && this.yDiv.is(':visible') )
                    this.dismissYDiv(event);
                else if ( this.pop )
                    this.dismiss(event);
            }
            else if ( ( key == 33 ) || ( ( key == 9 ) && event.shiftKey ) ) // PageUp & Shift+Tab
            {
                if ( this.fBtn.hasClass('AnyTime-off-off-btn') )
                {
                    if ( key == 9 )
                        this.dismissODiv(event);
                }
                else if ( this.fBtn.hasClass('AnyTime-mil-btn') )
                {
                    if ( key == 9 )
                        this.dismissYDiv(event);
                }
                else if ( this.fBtn.hasClass('AnyTime-cent-btn') )
                    this.yDiv.find('.AnyTime-mil-btn.AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.hasClass('AnyTime-dec-btn') )
                    this.yDiv.find('.AnyTime-cent-btn.AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.hasClass('AnyTime-yr-btn') )
                    this.yDiv.find('.AnyTime-dec-btn.AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.hasClass('AnyTime-era-btn') )
                    this.yDiv.find('.AnyTime-yr-btn.AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.parents('.AnyTime-yrs').length )
                {
                    if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-mon-btn') )
                {
                    if ( this.dY )
                        this.yCur.triggerHandler('click');
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-dom-btn') )
                {
                    if ( ( key == 9 ) && event.shiftKey ) // Shift+Tab
                    {
                        this.denyTab = false;
                        return;
                    }
                    else // PageUp
                    {
                        t = new Date(this.time.getTime());
                        if ( event.shiftKey )
                            t.setFullYear(t.getFullYear()-1);
                        else
                        {
                            mo = t.getMonth()-1;
                            if ( t.getDate() > __daysIn[mo] )
                                t.setDate(__daysIn[mo])
                            t.setMonth(mo);
                        }
                        this.keyDateChange(t);
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-hr-btn') )
                {
                    t = this.dDoM || this.dMo;
                    if ( t )
                        t.AnyTime_clickCurrent();
                    else if ( this.dY )
                        this.yCur.triggerHandler('click');
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-min-ten-btn') )
                {
                    t = this.dH || this.dDoM || this.dMo;
                    if ( t )
                        t.AnyTime_clickCurrent();
                    else if ( this.dY )
                        this.yCur.triggerHandler('click');
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-min-one-btn') )
                    this.dM.AnyTime_clickCurrent();
                else if ( this.fBtn.hasClass('AnyTime-sec-ten-btn') )
                {
                    if ( this.dM )
                        t = this.dM.find('.AnyTime-mins-ones');
                    else
                        t = this.dH || this.dDoM || this.dMo;
                    if ( t )
                        t.AnyTime_clickCurrent();
                    else if ( this.dY )
                        this.yCur.triggerHandler('click');
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-sec-one-btn') )
                    this.dS.AnyTime_clickCurrent();
                else if ( this.fBtn.hasClass('AnyTime-off-btn') )
                {
                    if ( this.dS )
                        t = this.dS.find('.AnyTime-secs-ones');
                    else if ( this.dM )
                        t = this.dM.find('.AnyTime-mins-ones');
                    else
                        t = this.dH || this.dDoM || this.dMo;
                    if ( t )
                        t.AnyTime_clickCurrent();
                    else if ( this.dY )
                        this.yCur.triggerHandler('click');
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
            }
            else if ( ( key == 34 ) || ( key == 9 ) ) // PageDown or Tab
            {
                if ( this.fBtn.hasClass('AnyTime-mil-btn') )
                    this.yDiv.find('.AnyTime-cent-btn.AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.hasClass('AnyTime-cent-btn') )
                    this.yDiv.find('.AnyTime-dec-btn.AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.hasClass('AnyTime-dec-btn') )
                    this.yDiv.find('.AnyTime-yr-btn.AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.hasClass('AnyTime-yr-btn') )
                {
                    t = this.yDiv.find('.AnyTime-era-btn.AnyTime-cur-btn');
                    if ( t.length )
                        t.triggerHandler('click');
                    else if ( key == 9 )
                        this.dismissYDiv(event);
                }
                else if ( this.fBtn.hasClass('AnyTime-era-btn') )
                {
                    if ( key == 9 )
                        this.dismissYDiv(event);
                }
                else if ( this.fBtn.hasClass('AnyTime-off-off-btn') )
                {
                    if ( key == 9 )
                        this.dismissODiv(event);
                }
                else if ( this.fBtn.parents('.AnyTime-yrs').length )
                {
                    t = this.dDoM || this.dMo || this.dH || this.dM || this.dS || this.dO;
                    if ( t )
                        t.AnyTime_clickCurrent();
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-mon-btn') )
                {
                    t = this.dDoM || this.dH || this.dM || this.dS || this.dO;
                    if ( t )
                        t.AnyTime_clickCurrent();
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-dom-btn') )
                {
                    if ( key == 9 ) // Tab
                    {
                        t = this.dH || this.dM || this.dS || this.dO;
                        if ( t )
                            t.AnyTime_clickCurrent();
                        else
                        {
                            this.denyTab = false;
                            return;
                        }
                    }
                    else // PageDown
                    {
                        t = new Date(this.time.getTime());
                        if ( event.shiftKey )
                            t.setFullYear(t.getFullYear()+1);
                        else
                        {
                            mo = t.getMonth()+1;
                            if ( t.getDate() > __daysIn[mo] )
                                t.setDate(__daysIn[mo])
                            t.setMonth(mo);
                        }
                        this.keyDateChange(t);
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-hr-btn') )
                {
                    t = this.dM || this.dS || this.dO;
                    if ( t )
                        t.AnyTime_clickCurrent();
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-min-ten-btn') )
                    this.dM.find('.AnyTime-mins-ones .AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.hasClass('AnyTime-min-one-btn') )
                {
                    t = this.dS || this.dO;
                    if ( t )
                        t.AnyTime_clickCurrent();
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-sec-ten-btn') )
                    this.dS.find('.AnyTime-secs-ones .AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.hasClass('AnyTime-sec-one-btn') )
                {
                    if ( this.dO )
                        this.dO.AnyTime_clickCurrent();
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-off-btn') )
                {
                    if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
            }
            else if ( key == 35 ) // END
            {
                if ( this.fBtn.hasClass('AnyTime-mil-btn') || this.fBtn.hasClass('AnyTime-cent-btn') ||
                    this.fBtn.hasClass('AnyTime-dec-btn') || this.fBtn.hasClass('AnyTime-yr-btn') ||
                    this.fBtn.hasClass('AnyTime-era-btn') )
                {
                    t = this.yDiv.find('.AnyTime-ce-btn');
                    if ( ! t.length )
                        t = this.yDiv.find('.AnyTime-yr9-btn');
                    t.triggerHandler('click');
                }
                else if ( this.fBtn.hasClass('AnyTime-dom-btn') )
                {
                    t = new Date(this.time.getTime());
                    t.setDate(1);
                    t.setMonth(t.getMonth()+1);
                    t.setDate(t.getDate()-1);
                    if ( event.ctrlKey )
                        t.setMonth(11);
                    this.keyDateChange(t);
                }
                else if ( this.dS )
                    this.dS.find('.AnyTime-sec9-btn').triggerHandler('click');
                else if ( this.dM )
                    this.dM.find('.AnyTime-min9-btn').triggerHandler('click');
                else if ( this.dH )
                    this.dH.find('.AnyTime-hr23-btn').triggerHandler('click');
                else if ( this.dDoM )
                    this.dDoM.find('.AnyTime-dom-btn-filled:last').triggerHandler('click');
                else if ( this.dMo )
                    this.dMo.find('.AnyTime-mon12-btn').triggerHandler('click');
                else if ( this.dY )
                    this.yAhead.triggerHandler('click');
            }
            else if ( key == 36 ) // HOME
            {
                if ( this.fBtn.hasClass('AnyTime-mil-btn') || this.fBtn.hasClass('AnyTime-cent-btn') ||
                    this.fBtn.hasClass('AnyTime-dec-btn') || this.fBtn.hasClass('AnyTime-yr-btn') ||
                    this.fBtn.hasClass('AnyTime-era-btn') )
                {
                    this.yDiv.find('.AnyTime-mil0-btn').triggerHandler('click');
                }
                else if ( this.fBtn.hasClass('AnyTime-dom-btn') )
                {
                    t = new Date(this.time.getTime());
                    t.setDate(1);
                    if ( event.ctrlKey )
                        t.setMonth(0);
                    this.keyDateChange(t);
                }
                else if ( this.dY )
                    this.yCur.triggerHandler('click');
                else if ( this.dMo )
                    this.dMo.find('.AnyTime-mon1-btn').triggerHandler('click');
                else if ( this.dDoM )
                    this.dDoM.find('.AnyTime-dom-btn-filled:first').triggerHandler('click');
                else if ( this.dH )
                    this.dH.find('.AnyTime-hr0-btn').triggerHandler('click');
                else if ( this.dM )
                    this.dM.find('.AnyTime-min00-btn').triggerHandler('click');
                else if ( this.dS )
                    this.dS.find('.AnyTime-sec00-btn').triggerHandler('click');
            }
            else if ( key == 37 ) // left arrow
            {
                if ( this.fBtn.hasClass('AnyTime-dom-btn') )
                {
                    t = new Date(this.time.getTime());
                    t.setDate(t.getDate()-1);
                    this.keyDateChange(t);
                }
                else
                    this.keyBack();
            }
            else if ( key == 38 ) // up arrow
            {
                if ( this.fBtn.hasClass('AnyTime-dom-btn') )
                {
                    t = new Date(this.time.getTime());
                    t.setDate(t.getDate()-7);
                    this.keyDateChange(t);
                }
                else
                    this.keyBack();
            }
            else if ( key == 39 ) // right arrow
            {
                if ( this.fBtn.hasClass('AnyTime-dom-btn') )
                {
                    t = new Date(this.time.getTime());
                    t.setDate(t.getDate()+1);
                    this.keyDateChange(t);
                }
                else
                    this.keyAhead();
            }
            else if ( key == 40 ) // down arrow
            {
                if ( this.fBtn.hasClass('AnyTime-dom-btn') )
            {
                  t = new Date(this.time.getTime());
            t.setDate(t.getDate()+7);
                    this.keyDateChange(t);
            }
                else
                    this.keyAhead();
            }
            else if ( ( ( key == 86 ) || ( key == 118 ) ) && event.ctrlKey )
            {
                this.updVal('');
                setTimeout( function() { context.showPkr(null); }, 100 );
                return;
            }
            else
                this.showPkr(null);

            event.preventDefault();
        }, // .key()

        //---------------------------------------------------------------------
        //  .keyAhead() is called by #key when a user presses the right or
        //  down arrow.  It moves to the next appropriate button.
        //---------------------------------------------------------------------

        keyAhead: function()
        {
            if ( this.fBtn.hasClass('AnyTime-mil9-btn') )
                this.yDiv.find('.AnyTime-cent0-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-cent9-btn') )
                this.yDiv.find('.AnyTime-dec0-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-dec9-btn') )
                this.yDiv.find('.AnyTime-yr0-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-yr9-btn') )
                this.yDiv.find('.AnyTime-bce-btn').triggerHandler('click');
            // else if ( this.fBtn.hasClass('AnyTime-sec9-btn') )
            //     {}
            else if ( this.fBtn.hasClass('AnyTime-sec50-btn') ){
                this.dS.find('.AnyTime-sec0-btn').triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-min9-btn') )
            {
                if ( this.dS )
                    this.dS.find('.AnyTime-sec00-btn').triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-min50-btn') ){
                this.dM.find('.AnyTime-min0-btn').triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-hr23-btn') )
            {
                if ( this.dM )
                    this.dM.find('.AnyTime-min00-btn').triggerHandler('click');
                else if ( this.dS )
                    this.dS.find('.AnyTime-sec00-btn').triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-hr11-btn') ){
                this.dH.find('.AnyTime-hr12-btn').triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-mon12-btn') )
            {
                if ( this.dDoM )
                    this.dDoM.AnyTime_clickCurrent();
                else if ( this.dH )
                    this.dH.find('.AnyTime-hr0-btn').triggerHandler('click');
                else if ( this.dM )
                    this.dM.find('.AnyTime-min00-btn').triggerHandler('click');
                else if ( this.dS )
                    this.dS.find('.AnyTime-sec00-btn').triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-yrs-ahead-btn') )
            {
                if ( this.dMo )
                    this.dMo.find('.AnyTime-mon1-btn').triggerHandler('click');
                else if ( this.dH )
                    this.dH.find('.AnyTime-hr0-btn').triggerHandler('click');
                else if ( this.dM )
                    this.dM.find('.AnyTime-min00-btn').triggerHandler('click');
                else if ( this.dS )
                    this.dS.find('.AnyTime-sec00-btn').triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-yr-cur-btn') ){
                this.yNext.triggerHandler('click');
            }
            else {
                 this.fBtn.next().triggerHandler('click');
            }
        }, // .keyAhead()


        //---------------------------------------------------------------------
        //  .keyBack() is called by #key when a user presses the left or
        //  up arrow. It moves to the previous appropriate button.
        //---------------------------------------------------------------------

        keyBack: function()
        {
            if ( this.fBtn.hasClass('AnyTime-cent0-btn') )
                this.yDiv.find('.AnyTime-mil9-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-dec0-btn') )
                this.yDiv.find('.AnyTime-cent9-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-yr0-btn') )
                this.yDiv.find('.AnyTime-dec9-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-bce-btn') )
                    this.yDiv.find('.AnyTime-yr9-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-yr-cur-btn') )
                this.yPrior.triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-mon1-btn') )
            {
                if ( this.dY )
                    this.yCur.triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-hr0-btn') )
            {
                if ( this.dDoM )
                    this.dDoM.AnyTime_clickCurrent();
                else if ( this.dMo )
                    this.dMo.find('.AnyTime-mon12-btn').triggerHandler('click');
                else if ( this.dY )
                    this.yNext.triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-hr12-btn') )
                 this.dH.find('.AnyTime-hr11-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-min00-btn') )
            {
                if ( this.dH )
                    this.dH.find('.AnyTime-hr23-btn').triggerHandler('click');
                else if ( this.dDoM )
                    this.dDoM.AnyTime_clickCurrent();
                else if ( this.dMo )
                    this.dMo.find('.AnyTime-mon12-btn').triggerHandler('click');
                else if ( this.dY )
                    this.yNext.triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-min0-btn') )
                 this.dM.find('.AnyTime-min50-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-sec00-btn') )
            {
                if ( this.dM )
                    this.dM.find('.AnyTime-min9-btn').triggerHandler('click');
                else if ( this.dH )
                    this.dH.find('.AnyTime-hr23-btn').triggerHandler('click');
                else if ( this.dDoM )
                    this.dDoM.AnyTime_clickCurrent();
                else if ( this.dMo )
                    this.dMo.find('.AnyTime-mon12-btn').triggerHandler('click');
                else if ( this.dY )
                    this.yNext.triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-sec0-btn') )
                 this.dS.find('.AnyTime-sec50-btn').triggerHandler('click');
            else
                 this.fBtn.prev().triggerHandler('click');
        }, // .keyBack()

        //---------------------------------------------------------------------
        //  .keyDateChange() is called by #key when an direction key
        //  (arrows/page/etc) is pressed while the Day-of-Month calendar has
        //  focus. The current day is adjusted accordingly.
        //---------------------------------------------------------------------

        keyDateChange: function( newDate )
        {
            if ( this.fBtn.hasClass('AnyTime-dom-btn') )
            {
                this.set(newDate);
                this.upd(null);
                this.setFocus( this.dDoM.find('.AnyTime-cur-btn') );
            }
        },

        //---------------------------------------------------------------------
        //  .makeCloak() is called by .askOffset() and .askYear() to create
        //  a cloak div.
        //---------------------------------------------------------------------

        makeCloak: function()
        {
            var context= this;
            if ( ! this.cloak )
            {
              this.cloak = $('<div class="AnyTime-cloak"></div>');
              this.div.append( this.cloak );
              this.cloak.click(
                function(e)
                {
                    if ( context.oDiv && context.oDiv.is(":visible") )
                        context.dismissODiv(e);
                    else
                        context.dismissYDiv(e);
                });
            }
            else
                this.cloak.show();
        },

        //---------------------------------------------------------------------
        //  makeDate() returns a Date object for the parameter as follows.
        //  Strings are parsed using the converter and numbers are assumed
        //  to be milliseconds.
        //---------------------------------------------------------------------

        makeDate: function(time)
        {
          if ( typeof time == 'number' )
            time = new Date(time);
          else if ( typeof time == 'string' )
            time = this.conv.parse( time );
          if ( 'getTime' in time )
            return time;
          throw 'cannot make a Date from ' + time;
        },

        //---------------------------------------------------------------------
        //  .newHour() is called when a user clicks an hour value.
        //  It changes the date and updates the text field.
        //---------------------------------------------------------------------

        newHour: function( event )
        {
            var h;
            var t;
            var elem = $(event.target);
            if ( elem.hasClass("AnyTime-out-btn") )
                return;
            if ( ! this.twelveHr )
              h = Number(elem.text());
            else
            {
              var str = elem.text();
              t = str.indexOf('a');
              if ( t < 0 )
              {
                t = Number(str.substr(0,str.indexOf('p')));
                h = ( (t==12) ? 12 : (t+12) );
              }
              else
              {
                t = Number(str.substr(0,t));
                h = ( (t==12) ? 0 : t );
              }
            }
            t = new Date(this.time.getTime());
            t.setHours(h);
            this.set(t);
            this.upd(elem);

        }, // .newHour()

        //---------------------------------------------------------------------
        //  .newOffset() is called when a user clicks the UTC offset (timezone)
        //  (or +/- button) to shift the year.  It changes the date and updates
        //  the text field.
        //---------------------------------------------------------------------

        newOffset: function( event )
        {
            if ( event.target == this.oSel[0] )
                this.askOffset(event);
            else
            {
              this.upd(this.oCur);
            }
        },

        //---------------------------------------------------------------------
        //  .newOPos() is called internally whenever a user clicks an offset
        //  selection value.  It changes the date and updates the text field.
        //---------------------------------------------------------------------

        newOPos: function( event )
        {
            var elem = $(event.target);
            this.offMin = elem[0].AnyTime_offMin;
            this.offSI = elem[0].AnyTime_offSI;
            var t = new Date(this.time.getTime());
            this.set(t);
            this.updODiv(elem);

        }, // .newOPos()

        //---------------------------------------------------------------------
        //  .newYear() is called when a user clicks a year (or one of the
        //  "arrows") to shift the year.  It changes the date and updates the
        //  text field.
        //---------------------------------------------------------------------

        newYear: function( event )
        {
            var elem = $(event.target);
            if ( elem.hasClass("AnyTime-out-btn") )
                return;
            var txt = elem.text();
            if ( ( txt == '<' ) || ( txt == '&lt;' ) )
              this.askYear(event);
            else if ( ( txt == '>' ) || ( txt == '&gt;' ) )
              this.askYear(event);
            else
            {
              var t = new Date(this.time.getTime());
              t.setFullYear(Number(txt));
              this.set(t);
              this.upd(this.yCur);
            }
        },

        //---------------------------------------------------------------------
        //  .newYPos() is called internally whenever a user clicks a year
        //  selection value.  It changes the date and updates the text field.
        //---------------------------------------------------------------------

        newYPos: function( event )
        {
            var elem = $(event.target);
            if ( elem.hasClass("AnyTime-out-btn") )
                return;

            var era = 1;
            var year = this.time.getFullYear();
            if ( year < 0 )
            {
              era = (-1);
              year = 0 - year;
            }
            year = pad( year, 4 );
            if ( elem.hasClass('AnyTime-mil-btn') )
              year = elem.html() + year.substring(1,4);
            else if ( elem.hasClass('AnyTime-cent-btn') )
              year = year.substring(0,1) + elem.html() + year.substring(2,4);
            else if ( elem.hasClass('AnyTime-dec-btn') )
              year = year.substring(0,2) + elem.html() + year.substring(3,4);
            else
              year = year.substring(0,3) + elem.html();
            if ( year == '0000' )
              year = 1;
            var t = new Date(this.time.getTime());
            t.setFullYear( era * year );
            this.set(t);
            this.updYDiv(elem);

        }, // .newYPos()

        //---------------------------------------------------------------------
        //  .onReady() initializes the picker after the page has loaded.
        //---------------------------------------------------------------------

        onReady: function()
        {
            this.lostFocus = true;
            if ( ! this.pop )
                this.upd(null);
            else
            {
                if ( this.div.parent() != document.body )
                    this.div.appendTo( document.body );
            }
        },

        //---------------------------------------------------------------------
        //  .pos() positions the picker, such as when it is displayed or
        //  when the window is resized.
        //---------------------------------------------------------------------

        pos: function(event) // note: event is ignored but this is a handler
        {
            if ( this.pop )
            {
              var off = this.inp.offset();
              var bodyWidth = $(document.body).outerWidth(true);
              var pickerWidth = this.div.outerWidth(true);
              var left = off.left;
              if ( left + pickerWidth > bodyWidth - 20 )
                left = bodyWidth - ( pickerWidth + 20 );
              var top = off.top - this.div.outerHeight(true);
              if ( top < 0 )
                top = off.top + this.inp.outerHeight(true);
              this.div.css( { top: String(top)+'px', left: String(left<0?0:left)+'px' } );
            }

            var wOff = this.div.offset();

            if ( this.oDiv && this.oDiv.is(":visible") )
            {
              var oOff = this.oLab.offset();
              if ( this.div.css('position') == 'absolute' )
              {
                  oOff.top -= wOff.top;
                  oOff.left = oOff.left - wOff.left;
                  wOff = { top: 0, left: 0 };
              }
              var oW = this.oDiv.outerWidth(true);
              var wW = this.div.outerWidth(true);
              if ( oOff.left + oW > wOff.left + wW )
              {
                  oOff.left = (wOff.left+wW)-oW;
                  if ( oOff.left < 2 )
                      oOff.left = 2;
              }

              var oH = this.oDiv.outerHeight(true);
              var wH = this.div.outerHeight(true);
              oOff.top += this.oLab.outerHeight(true);
              if ( oOff.top + oH > wOff.top + wH )
                  oOff.top = oOff.top - oH;
              if ( oOff.top < wOff.top )
                  oOff.top = wOff.top;

              this.oDiv.css( { top: oOff.top+'px', left: oOff.left+'px' } ) ;
            }

            else if ( this.yDiv && this.yDiv.is(":visible") )
            {
              var yOff = this.yLab.offset();
              if ( this.div.css('position') == 'absolute' )
              {
                  yOff.top -= wOff.top;
                  yOff.left = yOff.left - wOff.left;
                  wOff = { top: 0, left: 0 };
              }
              yOff.left += ( (this.yLab.outerWidth(true)-this.yDiv.outerWidth(true)) / 2 );
              this.yDiv.css( { top: yOff.top+'px', left: yOff.left+'px' } ) ;
            }

            if ( this.cloak )
              this.cloak.css( {
                top: wOff.top+'px',
                left: wOff.left+'px',
                height: String(this.div.outerHeight(true)-2)+'px',
                width: String(this.div.outerWidth(true)-2)+'px'
                } );

        }, // .pos()

        //---------------------------------------------------------------------
        //  .set() changes the current time.  It returns true if the new
        //  time is within the allowed range (if any).
        //---------------------------------------------------------------------

        set: function(newTime)
        {
            var t = newTime.getTime();
            if ( this.earliest && ( t < this.earliest.getTime() ) )
              this.time = new Date(this.earliest.getTime());
            else if ( this.latest && ( t > this.latest.getTime() ) )
              this.time = new Date(this.latest.getTime());
            else
              this.time = newTime;
        },

        //---------------------------------------------------------------------
        //  .setCurrent() changes the current time.
        //---------------------------------------------------------------------

        setCurrent: function(newTime)
        {
            this.set(this.makeDate(newTime));
            this.upd(null);
        },

        //---------------------------------------------------------------------
        //  .setEarliest() changes the earliest time.
        //---------------------------------------------------------------------

        setEarliest: function(newTime)
        {
            this.earliest = this.makeDate( newTime );
            this.set(this.time);
            this.upd(null);
        },

        //---------------------------------------------------------------------
        //  .setLatest() changes the latest time.
        //---------------------------------------------------------------------

        setLatest: function(newTime)
        {
            this.latest = this.makeDate( newTime );
            this.set(this.time);
            this.upd(null);
        },

        //---------------------------------------------------------------------
        //  .showPkr() displays the picker and sets the focus psuedo-
        //  element. The current value in the input field is used to initialize
        //  the picker.
        //---------------------------------------------------------------------

        showPkr: function(event)
        {
            try
            {
                this.time = this.conv.parse(this.inp.val());
                this.offMin = this.conv.getUtcParseOffsetCaptured();
                this.offSI = this.conv.getUtcParseOffsetSubIndex();
            }
            catch ( e )
            {
                this.time = new Date();
            }
            this.set(this.time);
            this.upd(null);

            var fBtn = null;
            var cb = '.AnyTime-cur-btn:first';
            if ( this.dDoM )
                fBtn = this.dDoM.find(cb);
            else if ( this.yCur )
                fBtn = this.yCur;
            else if ( this.dMo )
                fBtn = this.dMo.find(cb);
            else if ( this.dH )
                fBtn = this.dH.find(cb);
            else if ( this.dM )
                fBtn = this.dM.find(cb);
            else if ( this.dS )
                fBtn = this.dS.find(cb);

            this.setFocus(fBtn);
            this.pos(event);

        }, // .showPkr()

        //---------------------------------------------------------------------
        //  .upd() updates the picker's appearance.  It is called after
        //  most events to make the picker reflect the currently-selected
        //  values. fBtn is the psuedo-button to be given focus.
        //---------------------------------------------------------------------

        upd: function(fBtn)
        {
            var context= this;

            var cmpLo = new Date(this.time.getTime());
            cmpLo.setMonth(0,1);
            cmpLo.setHours(0,0,0,0);
            var cmpHi = new Date(this.time.getTime());
            cmpHi.setMonth(11,31);
            cmpHi.setHours(23,59,59,999);
            var earliestTime = this.earliest && this.earliest.getTime();
            var latestTime = this.latest && this.latest.getTime();

            //  Update year.

            var current = this.time.getFullYear();
            if ( this.earliest && this.yPast )
            {
                cmpHi.setFullYear(current-2);
                if ( cmpHi.getTime() < this.earliestTime )
                    this.yPast.addClass('AnyTime-out-btn ui-state-disabled');
                else
                    this.yPast.removeClass('AnyTime-out-btn ui-state-disabled');
            }
            if ( this.yPrior )
            {
                this.yPrior.text(pad((current==1)?(-1):(current-1),4));
                if ( this.earliest )
                {
                    cmpHi.setFullYear(current-1);
                    if ( cmpHi.getTime() < this.earliestTime )
                        this.yPrior.addClass('AnyTime-out-btn ui-state-disabled');
                    else
                        this.yPrior.removeClass('AnyTime-out-btn ui-state-disabled');
                }
            }
            if ( this.yCur )
                this.yCur.text(pad(current,4));
            if ( this.yNext )
            {
                this.yNext.text(pad((current==-1)?1:(current+1),4));
                if ( this.latest )
                {
                    cmpLo.setFullYear(current+1);
                    if ( cmpLo.getTime() > this.latestTime )
                        this.yNext.addClass('AnyTime-out-btn ui-state-disabled');
                    else
                        this.yNext.removeClass('AnyTime-out-btn ui-state-disabled');
                }
            }
            if ( this.latest && this.yAhead )
            {
                  cmpLo.setFullYear(current+2);
                  if ( cmpLo.getTime() > this.latestTime )
                      this.yAhead.addClass('AnyTime-out-btn ui-state-disabled');
                  else
                      this.yAhead.removeClass('AnyTime-out-btn ui-state-disabled');
            }

            //  Update month.

            cmpLo.setFullYear( this.time.getFullYear() );
            cmpHi.setFullYear( this.time.getFullYear() );
            var i = 0;
            current = this.time.getMonth();
            $('#'+this.id+' .AnyTime-mon-btn').each(function(){
                cmpLo.setMonth(i);
                cmpHi.setDate(1);
                cmpHi.setMonth(i+1);
                cmpHi.setDate(0);
                // $(this).AnyTime_current( 
                //         i == current,
                //         ((!context.earliest)||(cmpHi.getTime()>=earliestTime)) &&
                //         ((!context.latest)||(cmpLo.getTime()<=latestTime)) );
                $(this).AnyTime_current( 
                        i == current,
                        ((!context.earliest)||(cmpHi.getTime()>=earliestTime)) &&
                        ((!context.latest)||(cmpLo.getTime()<=latestTime)) );
                i++;
            } );

            //  Update days.

            cmpLo.setFullYear( this.time.getFullYear() );
            cmpHi.setFullYear( this.time.getFullYear() );
            cmpLo.setMonth( this.time.getMonth() );
            cmpHi.setMonth( this.time.getMonth(), 1 );
            current = this.time.getDate();
            var currentMonth = this.time.getMonth();
            var lastLoDate = -1;
            var dow1 = cmpLo.getDay();
            if ( this.fDOW > dow1 )
                dow1 += 7;
            var wom = 0, dow=0;
            $('#'+this.id+' .AnyTime-wk').each(function(){
                dow = context.fDOW;
                $(this).children().each(function(){
                    if ( dow - context.fDOW < 7 )
                    {
                        var td = $(this);
                        if ( ((wom===0)&&(dow<dow1)) || (cmpLo.getMonth()!=currentMonth) )
                        {
                            td.html('&#160;');
                            td.removeClass('AnyTime-dom-btn-filled AnyTime-cur-btn ui-state-default ui-state-highlight');
                            td.addClass('AnyTime-dom-btn-empty');
                            if ( wom ) // not first week
                            {
                                if ( ( cmpLo.getDate() === 1 ) && ( dow !== 0 ) )
                                    td.addClass('AnyTime-dom-btn-empty-after-filled');
                                else
                                    td.removeClass('AnyTime-dom-btn-empty-after-filled');
                                if ( cmpLo.getDate() <= 7 )
                                    td.addClass('AnyTime-dom-btn-empty-below-filled');
                                else
                                    td.removeClass('AnyTime-dom-btn-empty-below-filled');
                                cmpLo.setDate(cmpLo.getDate()+1);
                                cmpHi.setDate(cmpHi.getDate()+1);
                            }
                            else // first week
                            {
                                td.addClass('AnyTime-dom-btn-empty-above-filled');
                                if ( dow == dow1 - 1 )
                                    td.addClass('AnyTime-dom-btn-empty-before-filled');
                                else
                                    td.removeClass('AnyTime-dom-btn-empty-before-filled');
                            }
                            td.addClass('ui-state-default ui-state-disabled');
                        }
                        else
                        {
                            // Brazil daylight savings time sometimes results in
                            // midnight being the same day twice. This skips the
                            //  second one.
                            if ( ( i = cmpLo.getDate() ) == lastLoDate )
                                cmpLo.setDate( ++i );
                            lastLoDate = i;

                            td.text(i);
                            td.removeClass('AnyTime-dom-btn-empty AnyTime-dom-btn-empty-above-filled AnyTime-dom-btn-empty-before-filled '+
                                            'AnyTime-dom-btn-empty-after-filled AnyTime-dom-btn-empty-below-filled ' +
                                            'ui-state-default ui-state-disabled');
                            td.addClass('AnyTime-dom-btn-filled ui-state-default');
                            td.AnyTime_current( i == current,
                                ((!context.earliest)||(cmpHi.getTime()>=earliestTime)) &&
                                ((!context.latest)||(cmpLo.getTime()<=latestTime)) );
                            cmpLo.setDate(i+1);
                            cmpHi.setDate(i+1);
                        }
                    }
                    dow++;
                } );
                wom++;
            } );

            //  Update hour.

            cmpLo.setFullYear( this.time.getFullYear() );
            cmpHi.setFullYear( this.time.getFullYear() );
            cmpLo.setMonth( this.time.getMonth(), this.time.getDate() );
            cmpHi.setMonth( this.time.getMonth(), this.time.getDate() );
            var not12 = ! this.twelveHr;
            var hr = this.time.getHours();
            $('#'+this.id+' .AnyTime-hr-btn').each(function(){
                var html = this.innerHTML;
                var i;
                if ( not12 )
                    i = Number(html);
                else
                {
                    i = Number(html.substring(0,html.length-2) );
                    if ( html.charAt(html.length-2) == 'a' )
                    {
                      if ( i == 12 )
                          i = 0;
                    }
                    else if ( i < 12 )
                        i += 12;
                }
                cmpLo.setHours(i);
                cmpHi.setHours(i);
                $(this).AnyTime_current( hr == i,
                    ((!context.earliest)||(cmpHi.getTime()>=earliestTime)) &&
                        ((!context.latest)||(cmpLo.getTime()<=latestTime)) );
               if ( i < 23 )
                  cmpLo.setHours( cmpLo.getHours()+1 );
            } );

            //  Update minute.

            cmpLo.setHours( this.time.getHours() );
            cmpHi.setHours( this.time.getHours(), 9 );
            var units = this.time.getMinutes();
            var tens = String(Math.floor(units/10));
            var ones = String(units % 10);
            $('#'+this.id+' .AnyTime-min-ten-btn:not(.AnyTime-min-ten-btn-empty)').each(function(){
                $(this).AnyTime_current( this.innerHTML == tens,
                        ((!context.earliest)||(cmpHi.getTime()>=earliestTime)) &&
                        ((!context.latest)||(cmpLo.getTime()<=latestTime)) );
                if ( cmpLo.getMinutes() < 50 )
                {
                    cmpLo.setMinutes( cmpLo.getMinutes()+10 );
                    cmpHi.setMinutes( cmpHi.getMinutes()+10 );
                }
            } );
            cmpLo.setMinutes( Math.floor(this.time.getMinutes()/10)*10 );
            cmpHi.setMinutes( Math.floor(this.time.getMinutes()/10)*10 );
            $('#'+this.id+' .AnyTime-min-one-btn:not(.AnyTime-min-one-btn-empty)').each(function(){
                $(this).AnyTime_current( this.innerHTML == ones,
                        ((!context.earliest)||(cmpHi.getTime()>=earliestTime)) &&
                        ((!context.latest)||(cmpLo.getTime()<=latestTime)) );
                cmpLo.setMinutes( cmpLo.getMinutes()+1 );
                cmpHi.setMinutes( cmpHi.getMinutes()+1 );
            } );

            //  Update second.

            cmpLo.setMinutes( this.time.getMinutes() );
            cmpHi.setMinutes( this.time.getMinutes(), 9 );
            units = this.time.getSeconds();
            tens = String(Math.floor(units/10));
            ones = String(units % 10);
            $('#'+this.id+' .AnyTime-sec-ten-btn:not(.AnyTime-sec-ten-btn-empty)').each(function(){
                $(this).AnyTime_current( 
                    this.innerHTML == tens,
                    ((!context.earliest)||(cmpHi.getTime()>=earliestTime)) &&
                    ((!context.latest)||(cmpLo.getTime()<=latestTime)) 
                );
                if ( cmpLo.getSeconds() < 50 ){
                    cmpLo.setSeconds( cmpLo.getSeconds()+10 );
                    cmpHi.setSeconds( cmpHi.getSeconds()+10 );
                }
            } );
            cmpLo.setSeconds( Math.floor(this.time.getSeconds()/10)*10 );
            cmpHi.setSeconds( Math.floor(this.time.getSeconds()/10)*10 );
            $('#'+this.id+' .AnyTime-sec-one-btn:not(.AnyTime-sec-one-btn-empty)').each(function(){
                $(this).AnyTime_current( this.innerHTML == ones,
                    ((!context.earliest)||(cmpHi.getTime()>=earliestTime)) &&
                    ((!context.latest)||(cmpLo.getTime()<=latestTime)) );
                cmpLo.setSeconds( cmpLo.getSeconds()+1 );
                cmpHi.setSeconds( cmpHi.getSeconds()+1 );
            } );

            //  Update offset (time zone).

            if ( this.oConv )
            {
                this.oConv.setUtcFormatOffsetAlleged(this.offMin);
                this.oConv.setUtcFormatOffsetSubIndex(this.offSI);
                var tzs = this.oConv.format(this.time);
                this.oCur.html( tzs );
            }

            //  Set the focus element, then size the picker according to its
            //  components, show the changes, and invoke Ajax if desired.

            if ( fBtn )
                this.setFocus(fBtn);

            this.conv.setUtcFormatOffsetAlleged(this.offMin);
            this.conv.setUtcFormatOffsetSubIndex(this.offSI);
            this.updVal(this.conv.format(this.time));
            this.div.show();

            if ( this.dO ) // fit offset button
            {
                this.oCur.css('width','0');
                var curW = this.dT.width()-this.oMinW;
                if ( curW < 40 )
                    curW = 40;
                this.oCur.css('width',String(curW)+'px');
            }

            // if ( ! this.pop )
            //     this.ajax();

        }, // .upd()

        //---------------------------------------------------------------------
        //  .updODiv() updates the UTC offset selector's appearance.  It is
        //  called after most events to make the picker reflect the currently-
        //  selected values. fBtn is the psuedo-button to be given focus.
        //---------------------------------------------------------------------

        updODiv: function(fBtn)
        {
            var context= this;

            var cur, matched = false, def = null;
            this.oDiv.find('.AnyTime-off-off-btn').each(function(){
                if ( this.AnyTime_offMin == context.offMin )
                {
                    if ( this.AnyTime_offSI == context.offSI )
                        $(this).AnyTime_current(matched=true,true);
                    else
                    {
                        $(this).AnyTime_current(false,true);
                        if ( def == null )
                        def = $(this);
                    }
                }
                else
                    $(this).AnyTime_current(false,true);
            } );
            if ( ( ! matched ) && ( def != null ) )
                def.AnyTime_current(true,true);

            //  Show change

            this.conv.setUtcFormatOffsetAlleged(this.offMin);
            this.conv.setUtcFormatOffsetSubIndex(this.offSI);
            this.updVal(this.conv.format(this.time));
            this.upd(fBtn);

        }, // .updODiv()

        //---------------------------------------------------------------------
        //  .updYDiv() updates the year selector's appearance.  It is
        //  called after most events to make the picker reflect the currently-
        //  selected values. fBtn is the psuedo-button to be given focus.
        //---------------------------------------------------------------------

        updYDiv: function(fBtn)
        {
            var context= this;

            var i, legal;
            var era = 1;
            var yearValue = this.time.getFullYear();
            if ( yearValue < 0 )
            {
                era = (-1);
                yearValue = 0 - yearValue;
            }
            yearValue = pad( yearValue, 4 );
            var eY = this.earliest && this.earliest.getFullYear();
            var lY = this.latest && this.latest.getFullYear();

            i = 0;
            this.yDiv.find('.AnyTime-mil-btn').each(function(){
                legal = ( ((!context.earliest)||(era*(i+(era<0?0:999))>=eY)) && ((!context.latest)||(era*(i+(era>0?0:999))<=lY)) );
                $(this).AnyTime_current( this.innerHTML == yearValue.substring(0,1), legal );
                i += 1000;
            } );

            i = (Math.floor(yearValue/1000)*1000);
            this.yDiv.find('.AnyTime-cent-btn').each(function(){
                legal = ( ((!context.earliest)||(era*(i+(era<0?0:99))>=eY)) && ((!context.latest)||(era*(i+(era>0?0:99))<=lY)) );
                $(this).AnyTime_current( this.innerHTML == yearValue.substring(1,2), legal );
                i += 100;
            } );

            i = (Math.floor(yearValue/100)*100);
            this.yDiv.find('.AnyTime-dec-btn').each(function(){
                legal = ( ((!context.earliest)||(era*(i+(era<0?0:9))>=eY)) && ((!context.latest)||(era*(i+(era>0?0:9))<=lY)) );
                $(this).AnyTime_current( this.innerHTML == yearValue.substring(2,3), legal );
                i += 10;
            } );

            i = (Math.floor(yearValue/10)*10);
            this.yDiv.find('.AnyTime-yr-btn').each(function(){
                legal = ( ((!context.earliest)||(era*i>=eY)) && ((!context.latest)||(era*i<=lY)) );
                $(this).AnyTime_current( this.innerHTML == yearValue.substring(3), legal );
                i += 1;
            } );

            this.yDiv.find('.AnyTime-bce-btn').each(function(){
                $(this).AnyTime_current( era < 0, (!context.earliest) || ( context.earliest.getFullYear() < 0 ) );
            } );
            this.yDiv.find('.AnyTime-ce-btn').each(function(){
                $(this).AnyTime_current( era > 0, (!context.latest) || ( context.latest.getFullYear() > 0 ) );
            } );

            //  Show change

            this.conv.setUtcFormatOffsetAlleged(this.offMin);
            this.conv.setUtcFormatOffsetSubIndex(this.offSI);
            this.updVal(this.conv.format(this.time));
            this.upd(fBtn);

        }, // .updYDiv()

        //---------------------------------------------------------------------
        //  .updVal() updates the input value, but only if it's different
        //  than the previous value. It also triggers a change() event if
        //  the value is updated.
        //---------------------------------------------------------------------

        updVal: function(val)
        {
            if ( this.inp.val() != val ) {
                this.inp.val(val);
                this.inp.change();
            }
        }
    });

    // TODO: need to remove
    $.fn.AnyTime_current = function(isCurrent,isLegal)
    {
        if ( isCurrent )
        {
          this.removeClass('AnyTime-out-btn ui-state-default ui-state-disabled ui-state-highlight');
          this.addClass('AnyTime-cur-btn ui-state-default ui-state-highlight');
        }
        else
        {
          this.removeClass('AnyTime-cur-btn ui-state-highlight');
          if ( ! isLegal ){
            this.addClass('AnyTime-out-btn ui-state-disabled');
          }
          else{
            this.removeClass('AnyTime-out-btn ui-state-disabled');
          }
        }
    };
});
/* ========================================================================
 * Bootstrap: carousel.js v3.3.5
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // CAROUSEL CLASS DEFINITION
    // =========================

    var Carousel = function (element, options) {
        this.$element    = $(element)
        this.$indicators = this.$element.find('.carousel-indicators')
        //this.options     = options
        this.options     = $.extend({}, Carousel.DEFAULTS, typeof options == 'object' && options);
        this.paused      = null
        this.sliding     = null
        this.interval    = null
        this.$active     = null
        this.$items      = null

        this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

        this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
            .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
            .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))

        if(options.interval)
        {
                data.pause().cycle();
        }

        var context = this;

        this.$element.find('a[data-t-slide]').on('click', function(e){
                var action=$(this).attr('data-t-slide');
                context[action]();

                e.preventDefault();
        });

        this.$element.find('li[data-t-slide-to]').on('click', function(e){
                var slideIndex = $(this).attr('data-t-slide-to');
                if(slideIndex){
                        options.interval = false;
                        context.to(slideIndex);
                }
        });
    }

    Carousel.VERSION  = '3.3.5'

    Carousel.TRANSITION_DURATION = 600

    Carousel.DEFAULTS = {
        interval: 5000,
        pause: 'hover',
        wrap: true,
        keyboard: true
    }

    Carousel.prototype.keydown = function (e) {
        if (/input|textarea/i.test(e.target.tagName)) return
        switch (e.which) {
            case 37: this.prev(); break
            case 39: this.next(); break
            default: return
        }

        e.preventDefault()
    }

    Carousel.prototype.cycle = function (e) {
        e || (this.paused = false)

        this.interval && clearInterval(this.interval)

        this.options.interval
            && !this.paused
            && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

        return this
    }

    Carousel.prototype.getItemIndex = function (item) {
        this.$items = item.parent().children('.item')
        return this.$items.index(item || this.$active)
    }

    Carousel.prototype.getItemForDirection = function (direction, active) {
        var activeIndex = this.getItemIndex(active)
        var willWrap = (direction == 'prev' && activeIndex === 0)
                                || (direction == 'next' && activeIndex == (this.$items.length - 1))
        if (willWrap && !this.options.wrap) return active
        var delta = direction == 'prev' ? -1 : 1
        var itemIndex = (activeIndex + delta) % this.$items.length
        return this.$items.eq(itemIndex)
    }

    Carousel.prototype.to = function (pos) {
        var that        = this
        var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

        if (pos > (this.$items.length - 1) || pos < 0) return

        if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
        if (activeIndex == pos) return this.pause().cycle()

        return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
    }

    Carousel.prototype.pause = function (e) {
        e || (this.paused = true)

        if (this.$element.find('.next, .prev').length && $.support.transition) {
            this.$element.trigger($.support.transition.end)
            this.cycle(true)
        }

        this.interval = clearInterval(this.interval)

        return this
    }

    Carousel.prototype.next = function () {
        if (this.sliding) return
        return this.slide('next')
    }

    Carousel.prototype.prev = function () {
        if (this.sliding) return
        return this.slide('prev')
    }

    Carousel.prototype.slide = function (type, next) {
        var $active   = this.$element.find('.item.active')
        var $next     = next || this.getItemForDirection(type, $active)
        var isCycling = this.interval
        var direction = type == 'next' ? 'left' : 'right'
        var that      = this

        if ($next.hasClass('active')) return (this.sliding = false)

        var relatedTarget = $next[0]
        var slideEvent = $.Event('slide.bs.carousel', {
            relatedTarget: relatedTarget,
            direction: direction
        })
        this.$element.trigger(slideEvent)
        if (slideEvent.isDefaultPrevented()) return

        this.sliding = true

        isCycling && this.pause()

        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active')
            var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
            $nextIndicator && $nextIndicator.addClass('active')
        }

        var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
        if ($.support.transition && this.$element.hasClass('slide')) {
            $next.addClass(type)
            $next[0].offsetWidth // force reflow
            $active.addClass(direction)
            $next.addClass(direction)
            $active
                .one('bsTransitionEnd', function () {
                    $next.removeClass([type, direction].join(' ')).addClass('active')
                    $active.removeClass(['active', direction].join(' '))
                    that.sliding = false
                    setTimeout(function () {
                        that.$element.trigger(slidEvent)
                    }, 0)
                })
                .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
        } else {
            $active.removeClass('active')
            $next.addClass('active')
            this.sliding = false
            this.$element.trigger(slidEvent)
        }

        isCycling && this.cycle()

        return this
    }


    // 胶水代码
    var pluginName = 'carousel';
    $.fn[pluginName] = function(options) {

        this.each(function () {
            var jqElement = $(this);
            if (jqElement.data(pluginName)) {
                jqElement.data(pluginName).destroy();
            }
            jqElement.data(pluginName, new Carousel(this, $.extend(true, {}, options)));
        });

        return this;
    };

}(jQuery);

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

            // this.initSettings(options);
            var jqElement=$(element);
            this.initSettings(jqElement, options);
            
            // this.value= this.element.val();
            // this.matcher = this.settings.matcher || this.matcher;
            // this.sorter = this.settings.sorter || this.sorter;
            // this.highlighter = this.settings.highlighter || this.highlighter;
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
            this.elements.input.val(val).trigger('change');
            // this.elements.target.val(this.map[val]).trigger('change');
            this.element.val(this.map[val]).trigger('change');
            this.container.addClass('combobox-selected');
            this.selected = true;
            return this.hide();
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
                '    <div class="input-group">'+
                '       <input type="text" autocomplete="off" />'+
                '       <span class="input-group-addon dropdown-toggle" data-dropdown="dropdown">'+
                '           <span class="caret" /> '+
                '           <span class="glyphicon glyphicon-remove" />'+
                '       </span> '+
                '    </div> '+
                '</div>';
            this.container= $(template);
            this.element.before(this.container);

            // menu: '<ul class="typeahead typeahead-long dropdown-menu"></ul>',
            // item: '<li><a href="#"></a></li>'
            

            // var combobox = $(this.template());            
            // return combobox;
        },
        initElements: function(){
            // var context= this;

            var menuTemplate= '<ul class="typeahead typeahead-long dropdown-menu"></ul>';
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
                .on('mousedown', false)
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
            var text= this.elements.original.find('option:selected').text();
            this.elements.input.val(text);//.trigger('change');
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
/* ========================================================================
 * Bootstrap: dropdown.js v3.3.5
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  // var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.5'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    // $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      // if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
      //   // if mobile we use a backdrop because click events don't delegate
      //   $(document.createElement('div'))
      //     .addClass('dropdown-backdrop')
      //     .insertAfter($(this))
      //     .on('click', clearMenus)
      // }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }

    // 胶水代码
    var pluginName = 'dropdown';
    $.fn[pluginName] = function(options) {

        this.each(function () {
            var jqElement = $(this);
            if (jqElement.data(pluginName)) {
                jqElement.data(pluginName).destroy();
            }
            jqElement.data(pluginName, new Dropdown(this, $.extend(true, {}, options)));
        });

        return this;
    };


  // // DROPDOWN PLUGIN DEFINITION
  // // ==========================

  // function Plugin(option) {
  //   return this.each(function () {
  //     var $this = $(this)
  //     var data  = $this.data('bs.dropdown')

  //     if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
  //     if (typeof option == 'string') data[option].call($this)
  //   })
  // }

  // var old = $.fn.dropdown

  // $.fn.dropdown             = Plugin
  // $.fn.dropdown.Constructor = Dropdown


  // // DROPDOWN NO CONFLICT
  // // ====================

  // $.fn.dropdown.noConflict = function () {
  //   $.fn.dropdown = old
  //   return this
  // }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

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
        timeZone: 'Etc/UTC',
        // format: false,
        format: 'YYYY-MM-DD HH:mm:ss',
        dayViewHeaderFormat: 'MMMM YYYY',
        // extraFormats: false,
        stepping: 1,
        minDate: false,
        maxDate: false,
        useCurrent: true,
        // collapse: true,
        // locale: moment.locale(),
        defaultDate: false,
        disabledDates: false,
        enabledDates: false,
        icons: {
            time: 'glyphicon glyphicon-time',
            date: 'glyphicon glyphicon-calendar',
            up: 'glyphicon glyphicon-chevron-up',
            down: 'glyphicon glyphicon-chevron-down',
            previous: 'glyphicon glyphicon-chevron-left',
            next: 'glyphicon glyphicon-chevron-right',
            today: 'glyphicon glyphicon-screenshot',
            clear: 'glyphicon glyphicon-trash',
            close: 'glyphicon glyphicon-remove'
        },
        tooltips: {
            today: '现在',
            clear: '清除',
            close: '关闭',
            selectMonth: '选择月份',
            prevMonth: '上一月',
            nextMonth: '下一月',
            selectYear: '选择年份',
            prevYear: '上一年',
            nextYear: '下一年',
            selectDecade: '选择年代',
            prevDecade: '上一年代',
            nextDecade: '下一年代',
            prevCentury: '上一世纪',
            nextCentury: '下一世纪',
            pickHour: '选择小时',
            incrementHour: '增加小时',
            decrementHour: '减少小时',
            pickMinute: '选择分钟',
            incrementMinute: '增加分钟',
            decrementMinute: '减少分钟',
            pickSecond: '选择秒',
            incrementSecond: '增加秒',
            decrementSecond: '减少秒',
            togglePeriod: 'AM/PM',
            selectTime: '选择时间'
        },
        // useStrict: false,
        // sideBySide: false,
        daysOfWeekDisabled: false,
        calendarWeeks: false,
        viewMode: 'days',
        // toolbarPlacement: 'default',
        showTodayButton: true,
        showClear: true,
        showClose: true,
        // widgetPositioning: {
        //     horizontal: 'auto',
        //     vertical: 'auto'
        // },
        // widgetParent: null,
        ignoreReadonly: false,
        keepOpen: false,
        focusOnShow: true,
        inline: false,
        keepInvalid: false,
        datepickerInput: '.datepickerinput',
        // debug: false,
        allowInputToggle: false,
        disabledTimeIntervals: false,
        disabledHours: false,
        enabledHours: false,
        // viewValue: false
    };
    var attributeMap = {
        // fooOption: 'foo-option'
        format: 'format'
    };

    // 常量
    var viewModes = ['days', 'months', 'years', 'decades'],
        keyMap = {
            'up': 38,
            38: 'up',
            'down': 40,
            40: 'down',
            'left': 37,
            37: 'left',
            'right': 39,
            39: 'right',
            'tab': 9,
            9: 'tab',
            'escape': 27,
            27: 'escape',
            'enter': 13,
            13: 'enter',
            'pageUp': 33,
            33: 'pageUp',
            'pageDown': 34,
            34: 'pageDown',
            'shift': 16,
            16: 'shift',
            'control': 17,
            17: 'control',
            'space': 32,
            32: 'space',
            't': 84,
            84: 't',
            'delete': 46,
            46: 'delete'
        },
        keyState = {};

    // moment.js 接口
    function getMoment (format, d) {
        // var tzEnabled = false,
        //     returnMoment,
        //     currentZoneOffset,
        //     incomingZoneOffset,
        //     timeZoneIndicator,
        //     dateWithTimeZoneInfo;

        // if (moment.tz !== undefined && this.settings.timeZone !== undefined && this.settings.timeZone !== null && this.settings.timeZone !== '') {
        //     tzEnabled = true;
        // }
        // if (d === undefined || d === null) {
        //     if (tzEnabled) {
        //         returnMoment = moment().tz(this.settings.timeZone).startOf('d');
        //     } else {
        //         returnMoment = moment().startOf('d');
        //     }
        // } else {
        //     if (tzEnabled) {
        //         currentZoneOffset = moment().tz(this.settings.timeZone).utcOffset();
        //         incomingZoneOffset = moment(d, parseFormats, this.settings.useStrict).utcOffset();
        //         if (incomingZoneOffset !== currentZoneOffset) {
        //             timeZoneIndicator = moment().tz(this.settings.timeZone).format('Z');
        //             dateWithTimeZoneInfo = moment(d, parseFormats, this.settings.useStrict).format('YYYY-MM-DD[T]HH:mm:ss') + timeZoneIndicator;
        //             returnMoment = moment(dateWithTimeZoneInfo, parseFormats, this.settings.useStrict).tz(this.settings.timeZone);
        //         } else {
        //             returnMoment = moment(d, parseFormats, this.settings.useStrict).tz(this.settings.timeZone);
        //         }
        //     } else {
        //         returnMoment = moment(d, parseFormats, this.settings.useStrict);
        //     }
        // }
        var returnMoment;
        if (d === undefined || d === null) {
            returnMoment= moment().startOf('d');
        }
        else{
            // returnMoment = moment(d, format, this.settings.useStrict);
            // Moment's parser is very forgiving, and this can lead to undesired behavior. 
            // As of version 2.3.0, you may specify a boolean for the last argument to make Moment use strict parsing. 
            // Strict parsing requires that the format and input match exactly.
            returnMoment = moment(d, format, false);
        }
        return returnMoment;
    }
    // 格式，细粒度
    function isEnabled(format, granularity) {
        switch (granularity) {
            case 'y':
                return format.indexOf('Y') !== -1;
            case 'M':
                return format.indexOf('M') !== -1;
            case 'd':
                return format.toLowerCase().indexOf('d') !== -1;
            case 'h':
            case 'H':
                return format.toLowerCase().indexOf('h') !== -1;
            case 'm':
                return format.indexOf('m') !== -1;
            case 's':
                return format.indexOf('s') !== -1;
            default:
                return false;
        }
    }
    function hasTime(format) {
        return (isEnabled(format, 'h') || isEnabled(format, 'm') || isEnabled(format, 's'));
    }
    function hasDate(format) {
        return (isEnabled(format, 'y') || isEnabled(format, 'M') || isEnabled(format, 'd'));
    }
    function isValid(settings, targetMoment, granularity) {
        if (!targetMoment.isValid()) {
            return false;
        }
        if (settings.disabledDates && granularity === 'd' && settings.disabledDates[targetMoment.format('YYYY-MM-DD')] === true) {
            return false;
        }
        if (settings.enabledDates && granularity === 'd' && (settings.enabledDates[targetMoment.format('YYYY-MM-DD')] !== true)) {
            return false;
        }
        if (settings.minDate && targetMoment.isBefore(settings.minDate, granularity)) {
            return false;
        }
        if (settings.maxDate && targetMoment.isAfter(settings.maxDate, granularity)) {
            return false;
        }
        if (settings.daysOfWeekDisabled && granularity === 'd' && settings.daysOfWeekDisabled.indexOf(targetMoment.day()) !== -1) {
            return false;
        }
        if (settings.disabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && settings.disabledHours[targetMoment.format('H')] === true) {
            return false;
        }
        if (settings.enabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && (settings.enabledHours[targetMoment.format('H')] !== true)) {
            return false;
        }
        if (settings.disabledTimeIntervals && (granularity === 'h' || granularity === 'm' || granularity === 's')) {
            var found = false;
            $.each(settings.disabledTimeIntervals, function () {
                if (targetMoment.isBetween(this[0], this[1])) {
                    found = true;
                    return false;
                }
            });
            if (found) {
                return false;
            }
        }
        return true;
    }

    // notifyEvent: function (e) {
    //     if (e.type === 'dp.change' && ((e.date && e.date.isSame(e.oldDate)) || (!e.date && !e.oldDate))) {
    //         return;
    //     }
    //     element.trigger(e);
    // },

    var Widget=new J.Class({
        defaults: defaults,
        attributeMap: attributeMap,

        settings: {},
        value: null,
        // data: {},
        // templates: {},

        use24Hours: false,
        minViewModeNumber: 0,   // 最小视图模式，选到这个模式以后关闭弹出窗口。
        currentViewMode: 0,

        // 构造函数
        init: function(elements, options){
            this.inputElements = elements;


            // 直接使用容器类实例的设置
            this.settings=options;

            // // TODO:临时措施
            // this.use24Hours= false;
            // this.currentViewMode= 0;
            this.initFormatting();


            // this.initSettings(options);
            // // this.value= this.element.val();
            var now= getMoment(this.settings.format);
            this.value= now;
            this.viewValue=this.value;

            this.buildHtml();
            this.initElements();
            this.buildObservers();
            this.bindEvents();
            // this.bindEventsInterface();

            this.refresh();
        },
        initFormatting: function () {
            // Time    LT  8:30 PM
            // Time with seconds   LTS 8:30:25 PM
            // Month numeral, day of month, year   L   09/04/1986
            // l   9/4/1986
            // Month name, day of month, year  LL  September 4 1986
            // ll  Sep 4 1986
            // Month name, day of month, year, time    LLL September 4 1986 8:30 PM
            // lll Sep 4 1986 8:30 PM
            // Month name, day of month, day of week, year, time   LLLL    Thursday, September 4 1986 8:30 PM
            // llll    Thu, Sep 4 1986 8:30 PM
            // var format= this.settings.format || 'L LT';
            // var context= this;
            // this.actualFormat = format.replace(/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function (formatInput) {
            //     var value= context.getValue();
            //     var newinput = value.localeData().longDateFormat(formatInput) || formatInput;
            //     return newinput.replace(/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function (formatInput2) { //temp fix for #740
            //         return value.localeData().longDateFormat(formatInput2) || formatInput2;
            //     });
            // });

            // parseFormats = this.settings.extraFormats ? this.settings.extraFormats.slice() : [];
            // parseFormats = [];
            // if (parseFormats.indexOf(format) < 0 && parseFormats.indexOf(this.actualFormat) < 0) {
            //     parseFormats.push(this.actualFormat);
            // }

            // this.use24Hours = (this.actualFormat.toLowerCase().indexOf('a') < 1 && this.actualFormat.replace(/\[.*?\]/g, '').indexOf('h') < 1);
            this.use24Hours = (this.settings.format.toLowerCase().indexOf('a') < 1 && this.settings.format.replace(/\[.*?\]/g, '').indexOf('h') < 1);

            if (isEnabled(this.settings.format, 'y')) {
                this.minViewModeNumber = 2;
            }
            if (isEnabled(this.settings.format, 'M')) {
                this.minViewModeNumber = 1;
            }
            if (isEnabled(this.settings.format, 'd')) {
                this.minViewModeNumber = 0;
            }

            this.currentViewMode = Math.max(this.minViewModeNumber, this.currentViewMode);
        },
        buildHtml: function(){
            // 星期表头
            var currentDate= this.viewValue.clone().startOf('w').startOf('d');
            var htmlDow= this.settings.calendarWeeks === true ? '<th class="cw">#</th>' : '';
            while (currentDate.isBefore(this.viewValue.clone().endOf('w'))) {
                htmlDow += '<th class="dow">'+currentDate.format('dd')+'</th>';
                currentDate.add(1, 'd');
            }
            htmlDow= '<tr>'+htmlDow+'</tr>';

            // 月份
            var monthsShort = this.viewValue.clone().startOf('y').startOf('d');
            var htmlMonths= '';
            while (monthsShort.isSame(this.viewValue, 'y')) {
                htmlMonths += '<span class="month" data-action="selectMonth">'+monthsShort.format('MMM')+'</span>';
                monthsShort.add(1, 'M');
            }

            // 日期视图
            var dateView = ''+
                '<div class="datepicker'+((hasDate(this.settings.format) && hasTime(this.settings.format)) ? ' col-md-6' : '')+'">'+
                '   <div class="datepicker-days">'+
                '       <table class="table-condensed">'+
                '           <thead>'+
                '               <tr>'+
                '                   <th class="prev" data-action="previous"><span class="'+this.settings.icons.previous+'" title="'+this.settings.tooltips.prevMonth+'"></span></th>'+
                '                   <th class="picker-switch" data-action="pickerSwitch" colspan="'+(this.settings.calendarWeeks ? '6' : '5')+'" title="'+this.settings.tooltips.selectMonth+'"></th>'+
                '                   <th class="next" data-action="next"><span class="'+this.settings.icons.next+'" title="'+this.settings.tooltips.nextMonth+'"></span></th>'+
                '               </tr>'+
                htmlDow+
                '           </thead>'+
                '           <tbody>'+
                '           </tbody>'+
                '       <table/>'+
                '   </div>'+
                '   <div class="datepicker-months">'+
                '       <table class="table-condensed">'+
                '           <thead>'+
                '               <tr>'+
                '                   <th class="prev" data-action="previous"><span class="'+this.settings.icons.previous+'" title="'+this.settings.tooltips.prevYear+'"></span></th>'+
                '                   <th class="picker-switch" data-action="pickerSwitch" colspan="'+(this.settings.calendarWeeks ? '6' : '5')+'" title="'+this.settings.tooltips.selectYear+'"></th>'+
                '                   <th class="next" data-action="next"><span class="'+this.settings.icons.next+'" title="'+this.settings.tooltips.nextYear+'"></span></th>'+
                '               </tr>'+
                '           </thead>'+
                '           <tbody>'+
                '               <tr><td colspan="'+(this.settings.calendarWeeks ? '8' : '7')+'">'+htmlMonths+'</td></tr>'+
                '           </tbody>'+
                '       <table/>'+
                '   </div>'+
                '   <div class="datepicker-years">'+
                '       <table class="table-condensed">'+
                '           <thead>'+
                '               <tr>'+
                '                   <th class="prev" data-action="previous"><span class="'+this.settings.icons.previous+'" title="'+this.settings.tooltips.prevDecade+'"></span></th>'+
                '                   <th class="picker-switch" data-action="pickerSwitch" colspan="'+(this.settings.calendarWeeks ? '6' : '5')+'" title="'+this.settings.tooltips.selectDecade+'"></th>'+
                '                   <th class="next" data-action="next"><span class="'+this.settings.icons.next+'" title="'+this.settings.tooltips.nextDecade+'"></span></th>'+
                '               </tr>'+
                '           </thead>'+
                '           <tbody>'+
                '               <tr><td colspan="'+(this.settings.calendarWeeks ? '8' : '7')+'"></td></tr>'+
                '           </tbody>'+
                '       <table/>'+
                '   </div>'+
                '   <div class="datepicker-decades">'+
                '       <table class="table-condensed">'+
                '           <thead>'+
                '               <tr>'+
                '                   <th class="prev" data-action="previous"><span class="'+this.settings.icons.previous+'" title="'+this.settings.tooltips.prevCentury+'"></span></th>'+
                '                   <th class="picker-switch" data-action="pickerSwitch" colspan="'+(this.settings.calendarWeeks ? '6' : '5')+'"></th>'+
                '                   <th class="next" data-action="next"><span class="'+this.settings.icons.next+'" title="'+this.settings.tooltips.nextCentury+'"></span></th>'+
                '               </tr>'+
                '           </thead>'+
                '           <tbody>'+
                '               <tr><td colspan="'+(this.settings.calendarWeeks ? '8' : '7')+'"></td></tr>'+
                '           </tbody>'+
                '       <table/>'+
                '   </div>'+
                '</div>';

            // 小时选择按钮
            var htmlHours= '';
            if(isEnabled(this.settings.format, 'h')){
                var currentHour = this.viewValue.clone().startOf('d');
                if (this.viewValue.hour() > 11 && !this.use24Hours) {
                    currentHour.hour(12);
                }
                while (currentHour.isSame(this.viewValue, 'd') && (this.use24Hours || (this.viewValue.hour() < 12 && currentHour.hour() < 12) || this.viewValue.hour() > 11)) {
                    if (currentHour.hour() % 4 === 0) {
                        htmlHours += '<tr>';
                    }
                    htmlHours += ''+
                        '<td data-action="selectHour" class="hour' + (!isValid(this.settings,currentHour, 'h') ? ' disabled' : '') + '">' + 
                        currentHour.format(this.use24Hours ? 'HH' : 'hh') + 
                        '</td>';
                    if (currentHour.hour() % 4 === 3) {
                        htmlHours += '</tr>';
                    }

                    currentHour.add(1, 'h');
                }
            }

            // 分钟选择按钮
            var htmlMinutes= '';
            if(isEnabled(this.settings.format, 'm')){
                var currentMinute = this.viewValue.clone().startOf('h');
                var step = this.settings.stepping === 1 ? 5 : this.settings.stepping;
                while (this.viewValue.isSame(currentMinute, 'h')) {
                    if (currentMinute.minute() % (step * 4) === 0) {
                        htmlMinutes += '<tr>';
                    }
                    htmlMinutes +=''+
                        '<td data-action="selectMinute" class="minute' + (!isValid(this.settings,currentMinute, 'm') ? ' disabled' : '') + '">' + 
                        currentMinute.format('mm') + 
                        '</td>';
                    if (currentMinute.minute() % (step * 4) === step * 3) {
                        htmlMinutes += '</tr>';
                    }

                    currentMinute.add(step, 'm');
                }
            }

            // 秒选择按钮
            var htmlSeconds= '';
            if(isEnabled(this.settings.format, 's')){
                var currentSecond = this.viewValue.clone().startOf('m');
                while (this.viewValue.isSame(currentSecond, 'm')) {
                    if (currentSecond.second() % 20 === 0) {
                        htmlSeconds += '<tr>';
                    }
                    htmlSeconds += ''+
                        '<td data-action="selectSecond" class="second' + (!isValid(this.settings,currentSecond, 's') ? ' disabled' : '') + '">' + 
                        currentSecond.format('ss') + 
                        '</td>';
                    if (currentSecond.second() % 20 === 15) {
                        htmlSeconds += '</tr>';
                    }

                    currentSecond.add(5, 's');
                }
            }

            // 时间视图
            var timeView = ''+
                '<div class="timepicker'+((hasDate(this.settings.format) && hasTime(this.settings.format)) ? ' col-md-6' : '')+'">'+
                '   <div class="timepicker-picker">'+
                '       <table class="table-condensed">'+
                '           <tr>'+
                (isEnabled(this.settings.format, 'h') ? 
                '               <td>'+
                '                   <a href="#" class="btn" data-action="incrementHours" tabindex="-1" title="'+this.settings.tooltips.incrementHour+'">'+
                '                       <span class="'+this.settings.icons.up+'"></span>'+
                '                   </a>'+
                '               </td>' : '')+
                (isEnabled(this.settings.format, 'm') ? 
                ((isEnabled(this.settings.format, 'h') ?
                '               <td class="separator"></td>' : '')+
                '               <td>'+
                '                   <a href="#" class="btn" data-action="incrementMinutes" tabindex="-1" title="'+this.settings.tooltips.incrementMinute+'">'+
                '                       <span class="'+this.settings.icons.up+'"></span>'+
                '                   </a>'+
                '               </td>') : '')+
                (isEnabled(this.settings.format, 's') ? 
                ((isEnabled(this.settings.format, 'm') ?
                '               <td class="separator"></td>' : '')+
                '               <td>'+
                '                   <a href="#" class="btn" data-action="incrementSeconds" tabindex="-1" title="'+this.settings.tooltips.incrementSecond+'">'+
                '                       <span class="'+this.settings.icons.up+'"></span>'+
                '                   </a>'+
                '               </td>') : '')+
                (this.use24Hours ? 
                '               <td class="separator"></td>' : '')+
                '           </tr>'+
                '           <tr>'+ 
                (isEnabled(this.settings.format, 'h') ?
                '               <td>'+
                '                   <span class="timepicker-hour" data-action="showHours" data-time-component="hours" title="'+this.settings.tooltips.pickHour+'"></span>'+
                '               </td>' : '')+
                (isEnabled(this.settings.format, 'm') ?
                ((isEnabled(this.settings.format, 'h') ?
                '               <td class="separator">:</td>' : '')+
                '               <td>'+
                '                   <span class="timepicker-minute" data-action="showMinutes" data-time-component="minutes" title="'+this.settings.tooltips.pickMinute+'"></span>'+
                '               </td>') : '')+
                (isEnabled(this.settings.format, 's') ?
                ((isEnabled(this.settings.format, 'm') ?
                '               <td class="separator">:</td>' : '')+
                '               <td>'+
                '                   <span class="timepicker-second" data-action="showSeconds" data-time-component="seconds" title="'+this.settings.tooltips.pickSecond+'"></span>'+
                '               </td>') : '')+
                                (this.use24Hours ? 
                '               <td class="separator">'+
                '                   <button class="btn btn-primary" data-action="togglePeriod" tabindex="-1" title="'+this.settings.tooltips.togglePeriod+'"></button>'+
                '               </td>' : '')+
                '           </tr>'+
                '           <tr>'+
                '               <td>'+
                '                   <a href="#" class="btn" data-action="decrementHours" tabindex="-1" title="'+this.settings.tooltips.decrementHour+'">'+
                '                       <span class="'+this.settings.icons.down+'"></span>'+
                '                   </a>'+
                '               </td>'+
                (isEnabled(this.settings.format, 'm') ? 
                ((isEnabled(this.settings.format, 'h') ?
                '               <td class="separator"></td>' : '')+
                '               <td>'+
                '                   <a href="#" class="btn" data-action="decrementMinutes" tabindex="-1" title="'+this.settings.tooltips.decrementMinute+'">'+
                '                       <span class="'+this.settings.icons.down+'"></span>'+
                '                   </a>'+
                '               </td>') : '')+
                (isEnabled(this.settings.format, 's') ? 
                ((isEnabled(this.settings.format, 'm') ?
                '               <td class="separator"></td>' : '')+
                '               <td>'+
                '                   <a href="#" class="btn" data-action="decrementSeconds" tabindex="-1" title="'+this.settings.tooltips.decrementSecond+'">'+
                '                       <span class="'+this.settings.icons.down+'"></span>'+
                '                   </a>'+
                '               </td>') : '')+
                (this.use24Hours ? 
                '               <td class="separator"></td>' : '')+
                '           </tr>'+
                '       </table>'+
                '   </div>'+
                (isEnabled(this.settings.format, 'h') ? 
                '   <div class="timepicker-hours">'+
                '       <table class="table-condensed">'+htmlHours+'</table>'+
                '   </div>' : '')+
                (isEnabled(this.settings.format, 'm') ? 
                '   <div class="timepicker-minutes">'+
                '       <table class="table-condensed">'+htmlMinutes+'</table>'+
                '   </div>' : '')+
                (isEnabled(this.settings.format, 's') ? 
                '   <div class="timepicker-seconds">'+
                '       <table class="table-condensed">'+htmlSeconds+'</table>'+
                '   </div>' : '')+
                '</div>';

            var toolbar2 = ''+
                '<table class="table-condensed">'+
                '   <tbody>'+
                '       <tr>'+
                (this.settings.showTodayButton ?
                '           <td><a data-action="today" title="'+this.settings.tooltips.today+'"><span class="'+this.settings.icons.today+'"></span></a></td>' : '')+
                // ((!this.settings.sideBySide && hasDate(this.settings.format) && hasTime(this.settings.format))?
                // '           <td><a data-action="togglePicker" title="'+this.settings.tooltips.selectTime+'"><span class="'+this.settings.icons.time+'"></span></a></td>' : '')+
                (this.settings.showClear ?
                '           <td><a data-action="clear" title="'+this.settings.tooltips.clear+'"><span class="'+this.settings.icons.clear+'"></span></a></td>' : '')+
                (this.settings.showClose ?
                '           <td><a data-action="close" title="'+this.settings.tooltips.close+'"><span class="'+this.settings.icons.close+'"></span></a></td>' : '')+
                '       </tr>'+
                '   </tbody>'+
                '</table>';
            
            // var toolbar = '<li class="'+'picker-switch' + (this.settings.collapse ? ' accordion-toggle' : '')+'">'+toolbar2+'<li>';
            var toolbar = '<li class="picker-switch">'+toolbar2+'<li>';

            var templateCssClass= 't-dtpicker-widget';
            if (!this.settings.inline) {
                templateCssClass += ' dropdown-menu';
            }
            if (this.use24Hours) {
                templateCssClass += ' usetwentyfour';
            }
            if (isEnabled(this.settings.format, 's') && !this.use24Hours) {
                templateCssClass += ' wider';
            }

            var htmlTemplate = '';
            if (hasDate(this.settings.format) && hasTime(this.settings.format)) {
                htmlTemplate = ''+
                    '<div class="'+templateCssClass+' timepicker-sbs">'+
                    '   <div class="row">'+
                    dateView+
                    timeView+
                    toolbar+
                    '   </div>'+
                    '</div>';
            }
            else{
                htmlTemplate = ''+
                    '<div class="'+templateCssClass+'">'+
                    '   <ul class="list-unstyled">'+
                    (hasDate(this.settings.format) ? 
                    '       <li>'+dateView+'</li>' : '')+   // '+(this.settings.collapse && hasTime(this.settings.format) ? ' class="collapse in"' : '')+'
                    (hasTime(this.settings.format) ? 
                    '       <li>'+dateView+'</li>' : '')+   // '+(this.settings.collapse && hasTime(this.settings.format) ? ' class="collapse in"' : '')+'
                    '       <li>'+toolbar+'</li>'+
                    '   </ul>'+
                    '</div>';
            }

            this.container= $(htmlTemplate);
            this.inputElements.view.after(this.container);
            // this.inputElements.widgetContainer.append(this.container);
        },
        initElements: function(){
            // var context= this;
            this.elements={
                // original: this.element//,
                decades: $('.datepicker-decades', this.container),
                years: $('.datepicker-years', this.container),
                months: $('.datepicker-months', this.container),
                days: $('.datepicker-days', this.container),
                hour: $('.timepicker-hour', this.container),
                hours: $('.timepicker-hours', this.container),
                minute: $('.timepicker-minute', this.container),
                minutes: $('.timepicker-minutes', this.container),
                second: $('.timepicker-second', this.container),
                seconds: $('.timepicker-seconds', this.container)//,
                // view: $('input[type=text]', this.container)
                // getTab: function(levelIndex){
                //     var tabSelector='.t-level-tab-'+levelIndex;
                //     return $(tabSelector, context.container);
                // }
            };

            if(this.settings.inline){
                this.show();
            }

            this.elements.hours.hide();
            this.elements.minutes.hide();
            this.elements.seconds.hide();
        },
        buildObservers: function(){
            var context= this;
            var datePickerModes= [
                {
                    navFnc: 'M',
                    navStep: 1
                },
                {
                    navFnc: 'y',
                    navStep: 1
                },
                {
                    navFnc: 'y',
                    navStep: 10
                },
                {
                    navFnc: 'y',
                    navStep: 100
                }
            ];
            this.observers= {
                next: function () {
                    var navStep = datePickerModes[this.currentViewMode].navStep;
                    var navFnc = datePickerModes[this.currentViewMode].navFnc;
                    this.viewValue.add(navStep, navFnc);
                    // TODO: with ViewMode
                    this.refreshDate(); 
                    // viewUpdate(navFnc);
                },
                previous: function () {
                    var navFnc = datePickerModes[this.currentViewMode].navFnc;
                    var navStep = datePickerModes[this.currentViewMode].navStep;
                    this.viewValue.subtract(navStep, navFnc);
                    // TODO: with ViewMode
                    this.refreshDate();
                    // viewUpdate(navFnc);
                },
                pickerSwitch: function () {
                    this.showMode(1);
                },
                selectMonth: function (e) {
                    var month = $(e.target).closest('tbody').find('span').index($(e.target));
                    this.viewValue.month(month);
                    if (this.currentViewMode === this.minViewModeNumber) {
                        this.setValue(this.value.clone().year(this.viewValue.year()).month(this.viewValue.month()));
                        if (!this.settings.inline) {
                            this.hide();
                        }
                    } else {
                        this.showMode(-1);
                        // fillDate();
                        this.refreshDays();
                    }
                    // viewUpdate('M');
                },
                selectYear: function (e) {
                    var year = parseInt($(e.target).text(), 10) || 0;
                    this.viewValue.year(year);
                    if (this.currentViewMode === this.minViewModeNumber) {
                        this.setValue(this.value.clone().year(this.viewValue.year()));
                        if (!this.settings.inline) {
                            this.hide();
                        }
                    } else {
                        this.showMode(-1);
                        this.refreshMonths();
                    }
                    // viewUpdate('YYYY');
                },
                selectDecade: function (e) {
                    var year = parseInt($(e.target).data('selection'), 10) || 0;
                    this.viewValue.year(year);
                    if (this.currentViewMode === this.minViewModeNumber) {
                        this.setValue(this.value.clone().year(this.viewValue.year()));
                        if (!this.settings.inline) {
                            this.hide();
                        }
                    } else {
                        this.showMode(-1);
                        this.refreshYears();
                    }
                    // viewUpdate('YYYY');
                },
                selectDay: function (e) {
                    var day = this.viewValue.clone();
                    if ($(e.target).is('.old')) {
                        day.subtract(1, 'M');
                    }
                    if ($(e.target).is('.new')) {
                        day.add(1, 'M');
                    }
                    this.setValue(day.date(parseInt($(e.target).text(), 10)));
                    if (!hasTime(this.settings.format) && !this.settings.keepOpen && !this.settings.inline) {
                        this.hide();
                    }
                },
                incrementHours: function () {
                    var newDate = this.value.clone().add(1, 'h');
                    if (isValid(this.settings,newDate, 'h')) {
                        this.setValue(newDate);
                    }
                },
                incrementMinutes: function () {
                    var newDate = this.value.clone().add(this.settings.stepping, 'm');
                    if (isValid(this.settings,newDate, 'm')) {
                        this.setValue(newDate);
                    }
                },
                incrementSeconds: function () {
                    var newDate = this.value.clone().add(1, 's');
                    if (isValid(this.settings,newDate, 's')) {
                        this.setValue(newDate);
                    }
                },
                decrementHours: function () {
                    var newDate = this.value.clone().subtract(1, 'h');
                    if (isValid(this.settings,newDate, 'h')) {
                        this.setValue(newDate);
                    }
                },
                decrementMinutes: function () {
                    var newDate = this.value.clone().subtract(this.settings.stepping, 'm');
                    if (isValid(this.settings,newDate, 'm')) {
                        this.setValue(newDate);
                    }
                },
                decrementSeconds: function () {
                    var newDate = this.value.clone().subtract(1, 's');
                    if (isValid(this.settings,newDate, 's')) {
                        this.setValue(newDate);
                    }
                },
                togglePeriod: function () {
                    this.setValue(this.value.clone().add((this.value.hours() >= 12) ? -12 : 12, 'h'));
                },
                // togglePicker: function (e) {
                //     var $this = $(e.target),
                //         $parent = $this.closest('ul'),
                //         expanded = $parent.find('.in'),
                //         closed = $parent.find('.collapse:not(.in)'),
                //         collapseData;

                //     if (expanded && expanded.length) {
                //         collapseData = expanded.data('collapse');
                //         if (collapseData && collapseData.transitioning) {
                //             return;
                //         }
                //         if (expanded.collapse) { // if collapse plugin is available through bootstrap.js then use it
                //             expanded.collapse('hide');
                //             closed.collapse('show');
                //         } else { // otherwise just toggle in class on the two views
                //             expanded.removeClass('in');
                //             closed.addClass('in');
                //         }
                //         if ($this.is('span')) {
                //             $this.toggleClass(this.settings.icons.time + ' ' + this.settings.icons.date);
                //         } else {
                //             $this.find('span').toggleClass(this.settings.icons.time + ' ' + this.settings.icons.date);
                //         }

                //         // NOTE: uncomment if toggled state will be restored in show()
                //         //if (component) {
                //         //    component.find('span').toggleClass(this.settings.icons.time + ' ' + this.settings.icons.date);
                //         //}
                //     }
                // },
                showPicker: function () {
                    context.container.find('.timepicker > div:not(.timepicker-picker)').hide();
                    context.container.find('.timepicker .timepicker-picker').show();
                },
                showHours: function () {
                    context.container.find('.timepicker .timepicker-picker').hide();
                    context.container.find('.timepicker .timepicker-hours').show();
                },
                showMinutes: function () {
                    context.container.find('.timepicker .timepicker-picker').hide();
                    context.container.find('.timepicker .timepicker-minutes').show();
                },
                showSeconds: function () {
                    context.container.find('.timepicker .timepicker-picker').hide();
                    context.container.find('.timepicker .timepicker-seconds').show();
                },
                selectHour: function (e) {
                    var hour = parseInt($(e.target).text(), 10);

                    if (!this.use24Hours) {
                        if (this.value.hours() >= 12) {
                            if (hour !== 12) {
                                hour += 12;
                            }
                        } else {
                            if (hour === 12) {
                                hour = 0;
                            }
                        }
                    }
                    this.setValue(this.value.clone().hours(hour));
                    this.observers.showPicker.call(this);
                },
                selectMinute: function (e) {
                    this.setValue(this.value.clone().minutes(parseInt($(e.target).text(), 10)));
                    this.observers.showPicker();
                },
                selectSecond: function (e) {
                    this.setValue(this.value.clone().seconds(parseInt($(e.target).text(), 10)));
                    this.observers.showPicker();
                },
                clear: function(){
                    this.clear();
                },
                today: function () {
                    var todaysDate = getMoment();
                    if (isValid(this.settings,todaysDate, 'd')) {
                        this.setValue(todaysDate);
                    }
                },
                close: function(){
                    this.hide();
                }
            };

            this.keyBinds= {
                up: function (widget) {
                    if (!widget) {
                        return;
                    }
                    var d = this.date() || getMoment(this.settings.format);
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().subtract(7, 'd'));
                    } else {
                        this.date(d.clone().add(this.stepping(), 'm'));
                    }
                },
                down: function (widget) {
                    if (!widget) {
                        this.show();
                        return;
                    }
                    var d = this.date() || getMoment(this.settings.format);
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().add(7, 'd'));
                    } else {
                        this.date(d.clone().subtract(this.stepping(), 'm'));
                    }
                },
                'control up': function (widget) {
                    if (!widget) {
                        return;
                    }
                    var d = this.date() || getMoment(this.settings.format);
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().subtract(1, 'y'));
                    } else {
                        this.date(d.clone().add(1, 'h'));
                    }
                },
                'control down': function (widget) {
                    if (!widget) {
                        return;
                    }
                    var d = this.date() || getMoment(this.settings.format);
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().add(1, 'y'));
                    } else {
                        this.date(d.clone().subtract(1, 'h'));
                    }
                },
                left: function (widget) {
                    if (!widget) {
                        return;
                    }
                    var d = this.date() || getMoment(this.settings.format);
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().subtract(1, 'd'));
                    }
                },
                right: function (widget) {
                    if (!widget) {
                        return;
                    }
                    var d = this.date() || getMoment(this.settings.format);
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().add(1, 'd'));
                    }
                },
                pageUp: function (widget) {
                    if (!widget) {
                        return;
                    }
                    var d = this.date() || getMoment(this.settings.format);
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().subtract(1, 'M'));
                    }
                },
                pageDown: function (widget) {
                    if (!widget) {
                        return;
                    }
                    var d = this.date() || getMoment(this.settings.format);
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().add(1, 'M'));
                    }
                },
                enter: function () {
                    this.hide();
                },
                escape: function () {
                    this.hide();
                },
                //tab: function (widget) { //this break the flow of the form. disabling for now
                //    var toggle = widget.find('.picker-switch a[data-action="togglePicker"]');
                //    if(toggle.length > 0) toggle.click();
                //},
                'control space': function (widget) {
                    if (widget.find('.timepicker').is(':visible')) {
                        widget.find('.btn[data-action="togglePeriod"]').click();
                    }
                },
                t: function () {
                    this.date(getMoment(this.settings.format));
                },
                'delete': function () {
                    this.clear();
                }
            };
        },
        bindEvents: function(){
            var context= this;
            var element= this.element;

            this.inputElements.button.on('click', $.proxy(this.show, this));
            this.container.on('click', '[data-action]', $.proxy(this.doAction, this)); // this handles clicks on the widget
            this.container.on('mousedown', false);

            $(window).on('resize', $.proxy(this.place, this));

            // element.on('click', $.proxy(this.onFooClick, this));
        },
        // bindEventsInterface: function(){
        //     var context= this;
        //     var element= this.element;

        //     if(this.settings.onFooSelected){
        //         element.on('click.t.template', $.proxy(this.settings.onFooSelected, this));
        //     }
        // },
        render: function(){},

        // 事件处理
        // onFooClick: function(e, data){
        //     ;
        // },
        place: function () {
            // var position = (component || element).position(),
            // offset = (component || element).offset(),
            var position = this.inputElements.view.position();
            var offset = this.inputElements.view.offset();
                // vertical = this.settings.widgetPositioning.vertical,
                // horizontal = this.settings.widgetPositioning.horizontal,
            var vertical;
            var horizontal;
            var parent;

            // if (this.settings.widgetParent) {
            //     parent = this.settings.widgetParent.append(widget);
            // } else if (element.is('input')) {
            //     parent = this.inputElements.view.after(this.container).parent();
            // } else if (this.settings.inline) {
            //     parent = this.inputElements.view.append(widget);
            //     return;
            // } else {
            //     parent = this.inputElements.view;
            //     this.inputElements.view.children().first().after(widget);
            // }
            parent = this.inputElements.view.parent();

            // Top and bottom logic
            // if (vertical === 'auto') {
                if (offset.top + this.container.height() * 1.5 >= $(window).height() + $(window).scrollTop() &&
                    this.container.height() + this.inputElements.view.outerHeight() < offset.top) {
                    vertical = 'top';
                } else {
                    vertical = 'bottom';
                }
            // }

            // // Left and right logic
            // if (horizontal === 'auto') {
                if (parent.width() < offset.left + this.container.outerWidth() / 2 &&
                    offset.left + this.container.outerWidth() > $(window).width()) {
                    horizontal = 'right';
                } else {
                    horizontal = 'left';
                }
            // }

            if (vertical === 'top') {
                this.container.addClass('top').removeClass('bottom');
            } else {
                this.container.addClass('bottom').removeClass('top');
            }

            if (horizontal === 'right') {
                this.container.addClass('pull-right');
            } else {
                this.container.removeClass('pull-right');
            }

            // find the first parent element that has a relative css positioning
            if (parent.css('position') !== 'relative') {
                parent = parent.parents().filter(function () {
                    return $(this).css('position') === 'relative';
                }).first();
            }

            // if (parent.length === 0) {
            //     throw new Error('datetimepicker component should be placed within a relative positioned container');
            // }

            this.container.css({
                top: vertical === 'top' ? 'auto' : position.top + this.inputElements.view.outerHeight(),
                bottom: vertical === 'top' ? position.top + this.inputElements.view.outerHeight() : 'auto',
                left: horizontal === 'left' ? (parent === this.inputElements.view ? 0 : position.left) : 'auto',
                right: horizontal === 'left' ? 'auto' : parent.outerWidth() - this.inputElements.view.outerWidth() - (parent === this.inputElements.view ? 0 : position.left)
            });
        },
        
        // viewUpdate: function (e) {
        //     if (e === 'y') {
        //         e = 'YYYY';
        //     }
        //     // notifyEvent({
        //     //     type: 'dp.update',
        //     //     change: e,
        //     //     viewValue: this.viewValue.clone()
        //     // });
        // },
        // dir 方向 加一或减一
        showMode: function (dir) {
            if (dir) {
                this.currentViewMode = Math.max(this.minViewModeNumber, Math.min(3, this.currentViewMode + dir));
            }
            // this.container.find('.datepicker > div').hide().filter('.datepicker-' + datePickerModes[this.currentViewMode].clsName).show();
            this.container.find('.datepicker > div').hide().filter('.datepicker-' + viewModes[this.currentViewMode]).show();
        },

        fillDate: function () {
            
        },
        fillTime: function () {
            
        },
        // update: function () {
        //     if (!widget) {
        //         return;
        //     }
        //     fillDate();
        //     fillTime();
        // },
        // setValue: function (targetMoment) {
        //     var oldDate = unset ? null : this.value;

        //     // case of calling setValue(null or false)
        //     if (!targetMoment) {
        //         unset = true;
        //         input.val('');
        //         element.data('date', '');
        //         notifyEvent({
        //             type: 'dp.change',
        //             date: false,
        //             oldDate: oldDate
        //         });
        //         update();
        //         return;
        //     }

        //     targetMoment = targetMoment.clone().locale(this.settings.locale);

        //     if (this.settings.stepping !== 1) {
        //         targetMoment.minutes((Math.round(targetMoment.minutes() / this.settings.stepping) * this.settings.stepping) % 60).seconds(0);
        //     }

        //     if (isValid(this.settings,targetMoment)) {
        //         this.value = targetMoment;
        //         this.viewValue = this.value.clone();
        //         input.val(this.value.format(this.actualFormat));
        //         element.data('date', this.value.format(this.actualFormat));
        //         unset = false;
        //         update();
        //         notifyEvent({
        //             type: 'dp.change',
        //             date: this.value.clone(),
        //             oldDate: oldDate
        //         });
        //     } else {
        //         if (!this.settings.keepInvalid) {
        //             input.val(unset ? '' : this.value.format(this.actualFormat));
        //         }
        //         notifyEvent({
        //             type: 'dp.error',
        //             date: targetMoment
        //         });
        //     }
        // },
        hide: function () {
            ///<summary>Hides the widget. Possibly will emit dp.hide</summary>
            // var transitioning = false;
            // if (!widget) {
            //     return picker;
            // }
            // Ignore event if in the middle of a picker transition
            // this.container.find('.collapse').each(function () {
            //     var collapseData = $(this).data('collapse');
            //     if (collapseData && collapseData.transitioning) {
            //         transitioning = true;
            //         return false;
            //     }
            //     return true;
            // });
            // if (transitioning) {
            //     return;// picker;
            // }
            // if (component && component.hasClass('btn')) {
            //     component.toggleClass('active');
            this.inputElements.button.toggleClass('active');
            // }
            
            this.container.hide();

            $(window).off('resize', this.place);
            this.container.off('click', '[data-action]');
            this.container.off('mousedown', false);

            // this.container.remove();
            // widget = false;

            // notifyEvent({
            //     type: 'dp.hide',
            //     date: this.value.clone()
            // });

            this.inputElements.view.blur();

            // return picker;
        },
        clear: function () {
            this.setValue(null);
            this.viewValue= getMoment(this.settings.format);
        },

        /********************************************************************************
         *
         * Widget UI interaction functions
         *
         ********************************************************************************/        

        doAction: function (e) {
            var jqTarget= $(e.currentTarget);
            if (jqTarget.is('.disabled')) {
                return false;
            }
            var action= jqTarget.data('action');
            this.observers[action].apply(this, arguments);
            return false;
        },

        show: function () {
            if(this.inputElements.original.prop('disabled')){
                return;
            }
            // ///<summary>Shows the widget. Possibly will emit dp.show and dp.change</summary>
            // var currentMoment,
            //     useCurrentGranularity = {
            //         'year': function (m) {
            //             return m.month(0).date(1).hours(0).seconds(0).minutes(0);
            //         },
            //         'month': function (m) {
            //             return m.date(1).hours(0).seconds(0).minutes(0);
            //         },
            //         'day': function (m) {
            //             return m.hours(0).seconds(0).minutes(0);
            //         },
            //         'hour': function (m) {
            //             return m.seconds(0).minutes(0);
            //         },
            //         'minute': function (m) {
            //             return m.seconds(0);
            //         }
            //     };

            // if (input.prop('disabled') || (!this.settings.ignoreReadonly && input.prop('readonly')) || widget) {
            //     return picker;
            // }
            // if (input.val() !== undefined && input.val().trim().length !== 0) {
            //     setValue(this.parseInputDate(input.val().trim()));
            // // } else if (this.settings.useCurrent && unset && ((input.is('input') && input.val().trim().length === 0) || this.settings.inline)) {
            // } else if (this.settings.useCurrent && ((input.is('input') && input.val().trim().length === 0) || this.settings.inline)) {
            //     currentMoment = getMoment();
            //     if (typeof this.settings.useCurrent === 'string') {
            //         currentMoment = useCurrentGranularity[this.settings.useCurrent](currentMoment);
            //     }
            //     setValue(currentMoment);
            // }

            // widget = getTemplate();

            // fillDow();
            // fillMonths();

            // widget.find('.timepicker-hours').hide();
            // widget.find('.timepicker-minutes').hide();
            // widget.find('.timepicker-seconds').hide();

            // update();
            

            
            // if (component && component.hasClass('btn')) {
            //     component.toggleClass('active');
            // }
            // widget.show();
            this.showMode();
            this.place();
            this.container.show();

            // if (this.settings.focusOnShow && !input.is(':focus')) {
            //     input.focus();
            // }

            // notifyEvent({
            //     type: 'dp.show'
            // });
            // return picker;
        },

        toggle: function () {
            /// <summary>Shows or hides the widget</summary>
            return (widget ? hide() : show());
        },
        keydown: function (e) {
            var handler = null,
                index,
                index2,
                pressedKeys = [],
                pressedModifiers = {},
                currentKey = e.which,
                keyBindKeys,
                allModifiersPressed,
                pressed = 'p';

            keyState[currentKey] = pressed;

            for (index in keyState) {
                if (keyState.hasOwnProperty(index) && keyState[index] === pressed) {
                    pressedKeys.push(index);
                    if (parseInt(index, 10) !== currentKey) {
                        pressedModifiers[index] = true;
                    }
                }
            }

            for (index in this.settings.keyBinds) {
                if (this.settings.keyBinds.hasOwnProperty(index) && typeof (this.settings.keyBinds[index]) === 'function') {
                    keyBindKeys = index.split(' ');
                    if (keyBindKeys.length === pressedKeys.length && keyMap[currentKey] === keyBindKeys[keyBindKeys.length - 1]) {
                        allModifiersPressed = true;
                        for (index2 = keyBindKeys.length - 2; index2 >= 0; index2--) {
                            if (!(keyMap[keyBindKeys[index2]] in pressedModifiers)) {
                                allModifiersPressed = false;
                                break;
                            }
                        }
                        if (allModifiersPressed) {
                            handler = this.settings.keyBinds[index];
                            break;
                        }
                    }
                }
            }

            if (handler) {
                handler.call(picker, widget);
                e.stopPropagation();
                e.preventDefault();
            }
        },
        keyup: function (e) {
            keyState[e.which] = 'r';
            e.stopPropagation();
            e.preventDefault();
        },
        change: function (e) {
            var val = $(e.target).val().trim(),
                parsedDate = val ? this.parseInputDate(val) : null;
            setValue(parsedDate);
            e.stopImmediatePropagation();
            return false;
        },
        indexGivenDates: function (givenDatesArray) {
            // Store given enabledDates and disabledDates as keys.
            // This way we can check their existence in O(1) time instead of looping through whole array.
            // (for example: options.enabledDates['2014-02-27'] === true)
            var givenDatesIndexed = {};
            $.each(givenDatesArray, function () {
                var dDate = this.parseInputDate(this);
                if (dDate.isValid()) {
                    givenDatesIndexed[dDate.format('YYYY-MM-DD')] = true;
                }
            });
            return (Object.keys(givenDatesIndexed).length) ? givenDatesIndexed : false;
        },
        indexGivenHours: function (givenHoursArray) {
            // Store given enabledHours and disabledHours as keys.
            // This way we can check their existence in O(1) time instead of looping through whole array.
            // (for example: options.enabledHours['2014-02-27'] === true)
            var givenHoursIndexed = {};
            $.each(givenHoursArray, function () {
                givenHoursIndexed[this] = true;
            });
            return (Object.keys(givenHoursIndexed).length) ? givenHoursIndexed : false;
        },

        // API
        refresh: function(){
            this.refreshDate();
            this.refreshTime();
        },
        refreshDate: function(){
            if (!hasDate(this.settings.format)) {
                return;
            }

            this.refreshDecades();
            this.refreshYears();
            this.refreshMonths();
            this.refreshDays();
        },
        refreshDecades: function(){
            var decadesViewHeader = this.elements.decades.find('th');
            var startDecade = moment({y: this.viewValue.year() - (this.viewValue.year() % 100) - 1});
            var startedAt = startDecade.clone();
            var endDecade = startDecade.clone().add(100, 'y');

            this.elements.decades.find('.disabled').removeClass('disabled');

            if (startDecade.isSame(moment({y: 1900})) || (this.settings.minDate && this.settings.minDate.isAfter(startDecade, 'y'))) {
                decadesViewHeader.eq(0).addClass('disabled');
            }
            decadesViewHeader.eq(1).text(startDecade.year() + '-' + endDecade.year());
            if (startDecade.isSame(moment({y: 2000})) || (this.settings.maxDate && this.settings.maxDate.isBefore(endDecade, 'y'))) {
                decadesViewHeader.eq(2).addClass('disabled');
            }

            var htmlTemplate = '';
            while (!startDecade.isAfter(endDecade, 'y')) {
                htmlTemplate += ''+
                    '<span '+
                    '   data-action="selectDecade" '+
                    '   class="decade' + (startDecade.isSame(this.value, 'y') ? ' active' : '') + (!isValid(this.settings,startDecade, 'y') ? ' disabled' : '') + '" '+
                    '   data-selection="' + (startDecade.year() + 6) + '">' + 
                    (startDecade.year() + 1) + ' - ' + (startDecade.year() + 12) + 
                    '</span>';
                startDecade.add(12, 'y');
            }
            htmlTemplate += '<span></span><span></span><span></span>'; //push the dangling block over, at least this way it's even

            this.elements.decades.find('td').html(htmlTemplate);
            decadesViewHeader.eq(1).text((startedAt.year() + 1) + '-' + (startDecade.year()));
        },
        refreshYears: function(){
            var yearsViewHeader = this.elements.years.find('th');
            var startYear = this.viewValue.clone().subtract(5, 'y');
            var endYear = this.viewValue.clone().add(6, 'y');            

            this.elements.years.find('.disabled').removeClass('disabled');

            if (this.settings.minDate && this.settings.minDate.isAfter(startYear, 'y')) {
                yearsViewHeader.eq(0).addClass('disabled');
            }
            yearsViewHeader.eq(1).text(startYear.year() + '-' + endYear.year());
            if (this.settings.maxDate && this.settings.maxDate.isBefore(endYear, 'y')) {
                yearsViewHeader.eq(2).addClass('disabled');
            }

            var htmlTemplate = '';
            while (!startYear.isAfter(endYear, 'y')) {
                htmlTemplate += ''+
                    '<span '+
                    '   data-action="selectYear" '+
                    '   class="year' + (startYear.isSame(this.value, 'y') ? ' active' : '') + (!isValid(this.settings,startYear, 'y') ? ' disabled' : '') + '">' + 
                    startYear.year() + 
                    '</span>';
                startYear.add(1, 'y');
            }

            this.elements.years.find('td').html(htmlTemplate);
        },
        refreshMonths: function(){
            var monthsViewHeader = this.elements.months.find('th');
            var months = this.elements.months.find('tbody').find('span');

            this.elements.months.find('.disabled').removeClass('disabled');

            if (!isValid(this.settings,this.viewValue.clone().subtract(1, 'y'), 'y')) {
                monthsViewHeader.eq(0).addClass('disabled');
            }
            monthsViewHeader.eq(1).text(this.viewValue.year());
            if (!isValid(this.settings,this.viewValue.clone().add(1, 'y'), 'y')) {
                monthsViewHeader.eq(2).addClass('disabled');
            }

            // 当前月
            months.removeClass('active');
            if (this.value.isSame(this.viewValue, 'y')) {
                months.eq(this.value.month()).addClass('active');
            }
            var context= this;
            months.each(function (index) {
                if (!isValid(context.settings,context.viewValue.clone().month(index), 'M')) {
                    $(this).addClass('disabled');
                }
            });
        },
        refreshDays: function(){
            var daysViewHeader = this.elements.days.find('th');
            this.elements.days.find('.disabled').removeClass('disabled');
            if (!isValid(this.settings,this.viewValue.clone().subtract(1, 'M'), 'M')) {
                daysViewHeader.eq(0).addClass('disabled');
            }
            daysViewHeader.eq(1).text(this.viewValue.format(this.settings.dayViewHeaderFormat));
            if (!isValid(this.settings,this.viewValue.clone().add(1, 'M'), 'M')) {
                daysViewHeader.eq(2).addClass('disabled');
            }

            // 本月第一个星期的第一天
            var currentDate = this.viewValue.clone().startOf('M').startOf('w').startOf('d');
            var htmlTemplate= '';
            for (var i = 0; i < 42; i++) { //always display 42 days (should show 6 weeks)

                var clsName = '';
                if (currentDate.isBefore(this.viewValue, 'M')) {
                    clsName += ' old';
                }
                if (currentDate.isAfter(this.viewValue, 'M')) {
                    clsName += ' new';
                }
                if (currentDate.isSame(this.value, 'd')) {
                    clsName += ' active';
                }
                if (!isValid(this.settings,currentDate, 'd')) {
                    clsName += ' disabled';
                }
                if (currentDate.isSame(getMoment(), 'd')) {
                    clsName += ' today';
                }
                if (currentDate.day() === 0 || currentDate.day() === 6) {
                    clsName += ' weekend';
                }

                htmlTemplate += ''+
                    (currentDate.weekday() === 0 ? 
                    '<tr>' : '')+
                    (this.settings.calendarWeeks ?
                    '   <td class="cw">'+currentDate.week()+'</td>' : '')+
                    '   <td '+
                    '       data-action="selectDay" '+
                    '       data-day="' + currentDate.format('L') + '" '+
                    '       class="day' + clsName + '">' + 
                    currentDate.date() + 
                    '   </td>'+
                    (currentDate.weekday() === 6 ? 
                    '</tr>' : '');

                currentDate.add(1, 'd');
            }

            this.elements.days.find('tbody').empty().append(htmlTemplate);
        },
        refreshTime: function(){
            if (!hasTime(this.settings.format)) {
                return;
            }

            if (!this.use24Hours) {
                var toggle = this.container.find('.timepicker [data-action=togglePeriod]');
                var newDate = this.value.clone().add((this.value.hours() >= 12) ? -12 : 12, 'h');

                toggle.text(this.value.format('A'));

                if (isValid(this.settings,newDate, 'h')) {
                    toggle.removeClass('disabled');
                } else {
                    toggle.addClass('disabled');
                }
            }

            this.refreshHours();
            this.refreshMinutes();
            this.refreshSeconds();
        },
        refreshHours: function(){
            var currentHour = this.viewValue.clone().startOf('d');
            this.elements.hour.text(currentHour.format(this.use24Hours ? 'HH' : 'hh'));
        },
        refreshMinutes: function(){
            var currentMinute = this.viewValue.clone().startOf('h');
            this.elements.minute.text(currentMinute.format('mm'));
        },
        refreshSeconds: function(){
            var currentSecond = this.viewValue.clone().startOf('m');
            this.elements.second.text(currentSecond.format('ss'));
        },
        setValue: function(value){
            // var oValue= this.parseInputDate(value);
            if(!value || !isValid(this.settings,value)){
                this.inputElements.original.val('');
                this.inputElements.view.val('');
                this.value=null;
            }
            else{
                this.inputElements.original.val(value.format(this.settings.format));
                this.inputElements.view.val(value.format(this.settings.format));
                this.value=value;
            }
        },
        enable: function(){},
        disable: function(){},
        destroy: function(){}
    });

    this.DTPicker = new J.Class({extend: T.UI.BaseControl},{
        defaults: defaults,
        attributeMap: attributeMap,

        settings: {},
        templates: {},

        elements: {},

        // minViewModeNumber: 0,   // 最小视图模式，选到这个模式以后关闭弹出窗口。
        // currentViewMode: 0,
        // use24Hours: true,
        // viewValue: false,

        // widget: false,
        

        // picker: {},
        // date,
        // input,
        // component: false,
        // actualFormat,
        // parseFormats,        
        // datePickerModes: [
        //     {
        //         clsName: 'days',
        //         navFnc: 'M',
        //         navStep: 1
        //     },
        //     {
        //         clsName: 'months',
        //         navFnc: 'y',
        //         navStep: 1
        //     },
        //     {
        //         clsName: 'years',
        //         navFnc: 'y',
        //         navStep: 10
        //     },
        //     {
        //         clsName: 'decades',
        //         navFnc: 'y',
        //         navStep: 100
        //     }
        // ],
        // verticalModes: ['top', 'bottom', 'auto'],
        // horizontalModes: ['left', 'right', 'auto'],
        // toolbarPlacements: ['default', 'top', 'bottom'],
        

        // 构造函数
        init: function(element, options){
            var jqElement=$(element);
            // this.elements.original= $(element);

            // // 防止多次初始化
            // if (this.isInitialized()) { 
            //     return this.getRef(); 
            // }
            // this.initialize(element);

            // $.extend(true, options, dataToOptions());
            // picker.options(options);
            this.initSettings(jqElement, options);
            this.initStates(jqElement);

            this.buildHtml(jqElement);
            this.initElements();
            this.buildObservers();
            this.bindEvents();
            // this.bindEventsInterface();

            // if (!this.settings.inline && !input.is('input')) {
            //     throw new Error('Could not initialize DateTimePicker without an input element');
            // }

            if (this.settings.inline) {
                this.show();
            }
        },
        initStates: function(element){
            // this.value= this.element.val();
            // Set defaults for date here now instead of in var declaration
            
            // this.initFormatting();
            // if (input.is('input') && input.val().trim().length !== 0) {
            //     this.setValue(this.parseInputDate(input.val().trim()));
            // }
            // else if (this.settings.defaultDate && input.attr('placeholder') === undefined) {
            //     this.setValue(this.settings.defaultDate);
            // }
            // this.setValue(this.parseInputDate(this.element.val().trim()));

            // this.setValue(this.parseInputDate(element.val().trim()));

            var value= this.parseInputDate(element.val().trim());
            if(!value || !isValid(this.settings,value)){
                element.val('');
            }
            else{
                element.val(value.format(this.settings.format));
            }
        },
        
        buildHtml: function(element){
            var htmlTemplate = ''+ 
                '<div class="t-dtpicker-container input-group">' + 
                '    <input type="text" class="form-control">' +    //  data-toggle="dropdown"
                '    <div class="input-group-btn">' + 
                '        <button type="button" class="btn btn-default">' +     //  data-toggle="modal" data-target="#myModal">
                '            <span class="glyphicon glyphicon-calendar"></span>' + 
                '        </button>' + 
                '    </div>' + 
                // '    <div class="t-dtpicker-widget-container">'+    //  dropdown-menu
                // '    </div>'+
                '</div>';
                

            var container = $(htmlTemplate);

            this.elements={
                original: element,
                container: container,
                view: $('input[type=text]', container),
                button: $('button', container)//,
                // widgetContainer: $('.t-dtpicker-widget-container', container)//,                
                // getTab: function(levelIndex){
                //     var tabSelector='.t-level-tab-'+levelIndex;
                //     return $(tabSelector, context.container);
                // }
            };

            
            // this.element.after(this.container);
        },
        initElements: function(){
            // var context= this;

            // // initializing element and component attributes
            // if (this.element.is('input')) {
            //     input = element;
            // } else {
            //     input = element.find(this.settings.datepickerInput);
            //     if (input.size() === 0) {
            //         input = element.find('input');
            //     } else if (!input.is('input')) {
            //         throw new Error('CSS class "' + this.settings.datepickerInput + '" cannot be applied to non input element');
            //     }
            // }

            // if (element.hasClass('input-group')) {
            //     // in case there is more then one 'input-group-addon' Issue #48
            //     if (element.find('.datepickerbutton').size() === 0) {
            //         component = element.find('.input-group-addon');
            //     } else {
            //         component = element.find('.datepickerbutton');
            //     }
            // }

            // var elements={
            //     // original: this.element,
            //     view: $('input[type=text]', this.container),
            //     button: $('button', this.container),
            //     widgetContainer: $('.t-dtpicker-widget-container', this.container)//,                
            //     // getTab: function(levelIndex){
            //     //     var tabSelector='.t-level-tab-'+levelIndex;
            //     //     return $(tabSelector, context.container);
            //     // }
            // };
            // this.elements= $.extend(true, {}, this.elements, elements);

            this.elements.original.before(this.elements.container);
            this.elements.original.hide();
            this.elements.view.val(this.elements.original.val());

            if (this.elements.original.prop('disabled')) {
                this.disable();
            }

            this.widget= new Widget(this.elements, this.settings);
        },
        transferAttributes: function(){
            //this.settings.placeholder = this.$source.attr('data-placeholder') || this.settings.placeholder
            //this.$element.attr('placeholder', this.settings.placeholder)
            // this.elements.target.attr('name', this.elements.original.attr('name'))
            // this.elements.target.val(this.elements.original.val())
            // this.elements.original.removeAttr('name')  // Remove from source otherwise form will pass parameter twice.
            this.elements.view.attr('required', this.elements.original.attr('required'))
            this.elements.view.attr('rel', this.elements.original.attr('rel'))
            this.elements.view.attr('title', this.elements.original.attr('title'))
            this.elements.view.attr('class', this.elements.original.attr('class'))
            this.elements.view.attr('tabindex', this.elements.original.attr('tabindex'))
            this.elements.original.removeAttr('tabindex')
            if (this.elements.original.attr('disabled')!==undefined){
               this.disable();
            }
        },
        buildObservers: function(){},
        bindEvents: function(){
            var context= this;
            var element= this.elements.original;

            this.elements.view.on({
                'change': $.proxy(this.change, this),
                // 'blur': this.settings.debug ? '' : hide,
                'blur': $.proxy(this.hide, this),
                'keydown': $.proxy(this.keydown, this),
                'keyup': $.proxy(this.keyup, this),
                // 'focus': this.settings.allowInputToggle ? show : ''
                'focus': $.proxy(this.widget.show, this.widget),
                'click': $.proxy(this.widget.show, this.widget)
            });

            // if (this.elements.original.is('input')) {
            //     input.on({
            //         'focus': show
            //     });
            // } else if (component) {
            //     component.on('click', toggle);
            //     component.on('mousedown', false);
            // }

            // element.on('click', $.proxy(this.onFooClick, this));
        },
        // bindEventsInterface: function(){
        //     var context= this;
        //     var element= this.elements.original;

        //     if(this.settings.onFooSelected){
        //         element.on('click.t.template', $.proxy(this.settings.onFooSelected, this));
        //     }
        // },
        render: function(){},

        // 事件处理
        // onFooClick: function(e, data){
        //     ;
        // },
        
        
        parseInputDate: function (inputDate) {
            if (this.settings.parseInputDate === undefined) {
                if (moment.isMoment(inputDate) || inputDate instanceof Date) {
                    inputDate = moment(inputDate);
                } else {
                    inputDate = getMoment(this.settings.format, inputDate);
                }
            } else {
                inputDate = this.settings.parseInputDate(inputDate);
            }
            // inputDate.locale(this.settings.locale);
            return inputDate;
        },
        
        // API
        getValue: function(){
            var sValue= this.elements.original.val();
            var oValue= this.parseInputDate(sValue);
            return oValue;
        },
        setValue: function(value){
            // var oValue= this.parseInputDate(value);
            if(!value || !isValid(this.settings,value)){
                this.elements.original.val('');
            }
            else{
                this.elements.original.val(value.format(this.settings.format));
            }
        },
        refresh: function(){},
        enable: function(){
            this.elements.original.prop('disabled', false);
            this.elements.button.removeClass('disabled');
        },
        disable: function(){
            this.hide();
            this.elements.original.prop('disabled', true);
            this.elements.button.addClass('disabled');
        },
        destroy: function(){
            this.hide();
            this.elements.original.off({
                'change': change,
                'blur': blur,
                'keydown': keydown,
                'keyup': keyup,
                'focus': this.settings.allowInputToggle ? hide : ''
            });

            // if (this.elements.original.is('input')) {
            //     input.off({
            //         'focus': show
            //     });
            // } else if (component) {
            //     component.off('click', toggle);
            //     component.off('mousedown', false);
            // }
            // this.elements.original.removeData('DateTimePicker');
            // this.elements.original.removeData('date');
        }
    });
});



Jx().package("T.UI.Controls", function(J){

    // 严格模式
    'use strict';

    // 全局变量、函数、对象
    var defaults = {
        levelNames: '一级名称,二级名称,三级名称',
        dataUrl: ''
    };
    var attributeMap = {
        levelNames: 'level-names',
        dataUrl: 'data-url'
    };

    var LevelMenu=new J.Class({
        data:{},
        init:function(elements, options, data){
            this.inputElements = elements;

            // 初始化选项
            //this.initSettings(options);
            // 直接使用地址类实例的设置
            this.settings=options;
            this.levels=this.settings.levelNames.split(',');

            // 初始化数据
            //this.getData();
            this.data=data;

            // 保存当前行政级别
            this.activeLevelIndex=0;

            // 构建html DOM
            this.buildHtml();
            this.initElements();
            
            //this.transferAttributes();

            // 绑定事件
            this.bindEvents();
            // 绑定事件接口
            this.bindEventsInterface();

            // 根据值，状态，设置等刷新视图
            this.refresh();
        },
        /*getData:function(){
            //this.data.areaTree=areaTree;
        },*/
        buildHtml:function(){
            var htmlTabs='';
            var htmlContents='';
            for(var i=0; i<this.levels.length; i++){
                var levelName=this.levels[i];
                htmlTabs += '<li data-t-level="'+ i +'" class="t-level-tab-' + i + '"><a href="#">' + levelName + '<span class="caret"></span></a></li>';
                htmlContents += '<div class="t-level-' + i + ' t-level-content"></div>';
            }

            var htmlTemplate = ''+
                '<div class="t-level-menu dropdown-menu">'+
                '    <div class="t-level-path">'+
                '        <ul class="t-level-tabs">'+
                htmlTabs +
                '        </ul>'+
                '    </div>'+
                htmlContents +
                '    <span class="t-level-close glyphicon glyphicon-remove"></span>'+
                '</div>';

            this.container=$(htmlTemplate);
            this.container.insertAfter(this.inputElements.view);
        },
        buildContainer:function(){
            
        },
        initElements:function(){
            var context=this;

            this.elements={
                tabs: $('.t-level-tabs li', this.container),
                contents: $('.t-level-content', this.container),
                close: $('.t-level-close', this.container),
                getTab: function(levelIndex){
                    var tabSelector = '.t-level-tab-' + levelIndex;
                    return $(tabSelector, context.container);
                },
                getContent: function(levelIndex){
                    var contentSelector = '.t-level-' + levelIndex;
                    return $(contentSelector,context.container);
                },
                getNodes: function(levelIndex){
                    var nodesSelector='.t-level-'+ levelIndex +' li';
                    return $(nodesSelector,context.container);
                }
            };
        },
        grep: function(nodes, nodeId){
            for(var i=0; i<nodes.length; i++){
                if(nodeId === nodes[i].id){
                    var node= nodes[i];
                    return node;
                }
            }
        },
        _buildNodes:function(nodes, levelIndex){
            var htmlTemplate='<ul class="t-level-nodes">';
            for(var i=0; i<nodes.length; i++){
                var node= nodes[i];
                htmlTemplate += '<li data-t-id="'+node.id+'">'+node.name+'</li>'; 
            }
            htmlTemplate+='</ul>';

            this.elements.getContent(levelIndex).empty().append(htmlTemplate);
        },        
        bindEvents:function(){
            var context=this;

            var elements=this.elements;

            this.inputElements.view
                .on('click',       $.proxy(this.show, this))
                .on('blur',       $.proxy(this.blur, this));

            this.container
                .on('mouseenter', $.proxy(this.mouseenter, this))
                .on('mouseleave', $.proxy(this.mouseleave, this));

            elements.tabs
                .on('click',function(e){
                    // $.peoxy 不能取 $(this).data('t-foo'); 
                    // 只有elements.foo是单个控件的情况下，能在这里被引用时才能使用。
                    var levelIndex = $(this).data('t-level');
                    context.activeLevelIndex = parseInt(levelIndex);
                    context._activeTab();

                    e.preventDefault();
                });

            elements.close.on('click', function(e){
                context.hide();
            });

            var treePath = this.getPath();
            for(var i=0; i <= treePath.length; i++){
                this._bindEventsNodes(i);
            }
        },
        bindEventsInterface:function () {},
        _bindEventsNodes:function(levelIndex){
            var context=this;

            var jqNodes=this.elements.getNodes(levelIndex);
            jqNodes.on('click',function(e){
                var id = $(this).data('t-id');

                // 更新值
                context.change(id, context.activeLevelIndex);
                context.refresh();
                

                var treePath = context.getPath();
                if(treePath.length < context.levels.length){
                    // 清空下一级后的 tab
                    for(var i=treePath.length; i < context.levels.length; i++){
                        context._setTab(i, context.levels[i]);
                    }
                    // 清空下两级后的 content
                    for(var i=treePath.length+1; i < context.levels.length; i++){
                        context.elements.getContent(i).empty();
                    }
                }
                else{
                    // 选完最后一级，隐藏菜单
                    context.hide();
                }
            })
        },
        refresh:function(){
            var treePath = this.getPath();

            this._refreshInputView(treePath);
            this._refreshTabs(treePath);
            this._refreshTabContents(treePath);
            
            this.activeLevelIndex= this.getLastestTabIndex(treePath);
            this._activeTab();
        },
        _refreshTabs: function(treePath){
            var nodes= this.data;
            var node;
            for(var i=0; i<treePath.length; i++){
                var nodeId= treePath[i];
                node= this.grep(nodes, nodeId);
                nodes= node.childs;

                this._setTab(i, node.name);
            }
        },
        _setTab:function(index, text){
            var jqActiveTab= this.elements.getTab(index);
            jqActiveTab.html('<a href="#">'+ text +'<span class="caret"></span>');
        },
        _activeTab:function(){
            this.elements.tabs.removeClass('active');
            this.elements.getTab(this.activeLevelIndex).addClass('active');
            
            this.elements.contents.hide();            
            this.elements.getContent(this.activeLevelIndex).show();
        },
        _refreshTabContents: function(treePath){
            var nodes= this.data;
            var node;
            var lastestTabIndex= this.getLastestTabIndex(treePath);
            for(var i=0; i<lastestTabIndex+1; i++){
                this._buildNodes(nodes, i);
                this._bindEventsNodes(i);

                var nodeId= treePath[i];
                if(!nodeId){
                    break;
                }
                node= this.grep(nodes, nodeId);
                nodes= node.childs;
            }
        },
        _refreshInputView: function(treePath){
            var nodeNames= [];
            var nodes= this.data;
            var node;
            for(var i=0; i<treePath.length; i++){
                var nodeId= treePath[i];
                node= this.grep(nodes, nodeId);
                nodes= node.childs;

                nodeNames.push(node.name);
            }
            var nodeNamePath= nodeNames.join(' / ');
            this.inputElements.view.val(nodeNamePath);
        },
        getPath:function(){
            var initValue = this.inputElements.original.val();
            var treePath = initValue === '' ? [] : initValue.split(',');
            return treePath;
        },
        getLastestTabIndex: function(treePath){
            var lastestTabIndex= treePath.length === this.levels.length ? treePath.length-1 : treePath.length;
            return lastestTabIndex;
        },
        change:function(id, levelIndex){
            var treePath = this.getPath();

            // 选了低级别再选高级别，树路径回滚
            while(treePath.length > levelIndex){
                treePath.pop();
            }
            // 选中当前ID
            treePath.push(id);

            this.inputElements.original.val(treePath.join(','));
            // 触发 AngularJS 双向绑定
            this.inputElements.original.trigger('change');
        },        
        blur: function (e) {
            var context = this;
            if (!this.mousedover) {
                setTimeout(function () { 
                    context.hide(); 
                }, 200);
            }
        },
        mouseenter: function (e) {
            this.mousedover = true;
        },
        mouseleave: function (e) {
            var context = this;
            if (!this.mousedover) {
                setTimeout(function () { 
                    context.hide(); 
                }, 200);
            }

            this.mousedover = false;
        },
        show: function () {
            var pos = $.extend({}, this.inputElements.view.position(), {
                height: this.inputElements.view[0].offsetHeight
            });

            this.container
                .css({
                    top: pos.top + pos.height, 
                    left: pos.left
                })
                .show();
        },
        hide: function(){
            this.container.hide();
            //alert(this.inputElements.original.val());
        }        
    });

    this.Level = new J.Class({extend : T.UI.BaseControl}, {
        defaults : defaults,
        attributeMap : attributeMap,

        // 构造函数
        init:function(element, options){
            this.element = $(element);

            //this.settings,

            this.container,
            this.elements,

            this.value = this.element.val();

            // 初始化选项
            // this.initSettings(options);
            var jqElement=$(element);
            this.initSettings(jqElement, options);

            // // 初始化数据
            // this.getData();

            var context= this;
            // var d = $.Deferred();
            this.d = $.Deferred();
            $.when(this.getData(this.d))
             .done(function(){
                context.render();
             });

            // 构建html DOM
            this.buildHtml();
            // 初始化 html DOM 元素
            this.initElements();
            this.transferAttributes();

            // 创建 树型 菜单对象
            //this.menu=new LevelMenu(this.elements, this.settings);

            // 绑定事件
            this.bindEvents();
            // 绑定事件接口
            this.bindEventsInterface();
        },
        buildHtml:function () {
            var htmlTemplate = ''+ 
                '<div class="t-level-container">'+
                //'    <input type="hidden" />'+
                '    <input type="text" autocomplete="off" />'+
                '</div>';

            this.container = $(htmlTemplate);
            this.element.before(this.container);
        },
        getData:function(d){
            /*
            // 省/市/区县 树
            var areaTree={
                name:'行政区划树',
                childs:{}
            };
            */
            // var context = this;
            // $.ajax({
            //     dataType: 'json',
            //     url: this.settings.dataUrl,
            //     data: {},
            //     success: function(data){
            //         context.createMenu(data);
            //     }
            // });

            if (this.settings.data) {
                this.data = $.extend(true, [], this.settings.data);
                delete this.settings.data;

                d.resolve();

                return d.promise();
            }

            var context = this;
            $.ajax({
                dataType: 'json',
                url: this.settings.dataUrl,
                data: {},
                success: function(data){
                    context.data=data;// $.extend(true, [], data);

                    d.resolve();
                },
                error: function(xmlHttpRequest, status, error){
                    alert('控件id：' + context.element.attr('id')+'，ajax获取数据失败!');

                    d.resolve();
                }
            });

            return d.promise();
        },
        // createMenu:function(data){
        //     this.menu=new LevelMenu(this.elements, this.settings, data);
        // },
        render: function(){
            this.menu=new LevelMenu(this.elements, this.settings, this.data);
        },
        initElements:function () {
            this.elements = {
                original: this.element,
                view: $('input[type=text]', this.container)
            };

            this.elements.original.hide();
            this.elements.view.attr("readonly","readonly");
        },
        bindEvents:function () {
            var context=this;

            var element=this.element;
            var elements=this.elements;

            // element.on('keydown', function(e) {
            //     ;
            // });

            // elements.view
            //     .on('focus',    $.proxy(this._showMenu, this))      // $proxy 用 当前 this 替代 控件 this
            //     .on('blur',     $.proxy(this._hideMenu, this));
        },        
        bindEventsInterface:function () {
            var context=this;
            var element=this.element;

            // element.on('level.foo', function() {
            //     context.foo();
            //     foo();
            // });
        },
        transferAttributes: function(){
            //this.options.placeholder = this.$source.attr('data-placeholder') || this.options.placeholder
            //this.$element.attr('placeholder', this.options.placeholder)
            // this.elements.target.prop('name', this.element.prop('name'))
            // this.elements.target.val(this.element.val())
            // this.element.removeAttr('name')  // Remove from source otherwise form will pass parameter twice.
            this.elements.view.attr('required', this.element.attr('required'))
            this.elements.view.attr('rel', this.element.attr('rel'))
            this.elements.view.attr('title', this.element.attr('title'))
            this.elements.view.attr('class', this.element.attr('class'))
            this.elements.view.attr('tabindex', this.element.attr('tabindex'))
            this.element.removeAttr('tabindex')
            if (this.element.attr('disabled')!==undefined){
               this.disable();
            }
        },
        // setValue: function(value){
        //     this.element.val(value); // ng-model修改时，值已改变，不需要再设置
        //     this.menu.reflesh();
        // },
        refresh: function(){
            // this.menu.reflesh();
            var context= this;
            $.when(this.d.promise())
             .done(function(){
                context.menu.refresh();
             });
        },
        enable: function(){
            this.element.prop('disabled', false);
            this.elements.view.prop('disabled', false);
            this.disabled=false;
        },
        disable: function(){
            this.element.prop('disabled', true);
            this.elements.view.prop('disabled', true);
            this.disabled=true;
        }
    });
});
Jx().package("T.UI.Controls", function(J){

    // 严格模式
    'use strict';


    // 全局变量、函数、对象
    var _currentPluginId = 0;

    var defaults = {
        liked: false,
        dataUrl: ''
    };
    var attributeMap = {
        liked: 'liked',
        dataUrl: 'data-url'
    };

    this.LikeIt = new J.Class({extend : T.UI.BaseControl}, {
        defaults : defaults,
        attributeMap : attributeMap,
        // 构造函数
        init:function(element, options){
            this.element = $(element);

            //this.settings,
            // this.container,
            // this.elements,

            //this.value = this.element.val();
            this.value = parseInt(this.element.text());

            // 初始化选项
            // this.initSettings(options);
            var jqElement=$(element);
            this.initSettings(jqElement, options);

            // // 初始化数据
            // this.getData();

            // // 构建html DOM
            // this.buildHtml();
            // // 初始化 html DOM 元素
            // this.initElements();
            // this.transferAttributes();

            // 创建 树型 菜单对象
            //this.menu=new LevelMenu(this.elements, this.settings);

            // 绑定事件
            this.bindEvents();
            // 绑定事件接口
            // this.bindEventsInterface();

            this.refresh();
        },
        bindEvents: function(){
            this.element.on('click', $.proxy(this.toggle, this));
        },
        getValue: function(){
            return this.value;
        },
        toggle: function(){
            this.value = this.settings.liked ? this.value-1 : this.value+1;
            this.settings.liked = !this.settings.liked;
            this.postback();
        },
        postback: function(){
            if(!this.settings.dataUrl){
                return;
            }
            var context=this;
            $.ajax({
                dataType: 'json',
                url: this.settings.dataUrl,
                data: {},
                success: function(data){
                    context.refresh();
                },
                error: function(xmlHttpRequest, status, error){
                    alert('控件id: ' + context.element.attr('id') + ' , ajax发送数据失败！');
                }
            });
        },
        refresh: function(){
            this.element.text(this.value);
            if(this.settings.liked){
                this.element.addClass("liked");
            }
            else{
                this.element.removeClass("liked");
            }
        }
    });

});
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

    
    var animations = {}; /* Animation rules keyed by their name */
    var useCssAnimations; /* Whether to use CSS animations or setTimeout */
    var sheet; /* A stylesheet to hold the @keyframe or VML rules. */

    // 创建一个html dom element
    function createEl (tag, prop) {
        var el = document.createElement(tag || 'div'), n;

        for (n in prop){
            el[n] = prop[n];
        }

        return el;
    }

    // 插入一个子元素
    function ins (parent /* child1, child2, ...*/) {
        for (var i = 1, n = arguments.length; i < n; i++) {
            parent.appendChild(arguments[i])
        }

        return parent
    }

    function vendor (el, prop) {
        var prefixes = ['webkit', 'Moz', 'ms', 'O']; /* Vendor prefixes */

        var s = el.style, pp, i;

        prop = prop.charAt(0).toUpperCase() + prop.slice(1)
        if (s[prop] !== undefined) return prop
        for (i = 0; i < prefixes.length; i++) {
            pp = prefixes[i]+prop
            if (s[pp] !== undefined) return pp
        }
    }

    // 设置元素的CSS
    function css (el, prop) {
        for (var n in prop) {
            el.style[vendor(el, n) || n] = prop[n]
        }

        return el
    }

    // 类似于$.extend
    function merge (obj) {
        for (var i = 1; i < arguments.length; i++) {
            var def = arguments[i]
            for (var n in def) {
                if (obj[n] === undefined) obj[n] = def[n]
            }
        }
        return obj
    }

    /**
     * Returns the line color from the given string or array.
     */
    function getColor (color, idx) {
        return typeof color == 'string' ? color : color[idx % color.length]
    }

    var Spinner = new J.Class({
        defaults: {
            lines: 12,             // The number of lines to draw
            length: 7,             // The length of each line
            width: 5,              // The line thickness
            radius: 10,            // The radius of the inner circle
            scale: 1.0,            // Scales overall size of the spinner
            corners: 1,            // Roundness (0..1)
            color: '#000',         // #rgb or #rrggbb
            opacity: 1/4,          // Opacity of the lines
            rotate: 0,             // Rotation offset
            direction: 1,          // 1: clockwise, -1: counterclockwise
            speed: 1,              // Rounds per second
            trail: 100,            // Afterglow percentage
            fps: 20,               // Frames per second when using setTimeout()
            zIndex: 2e9,           // Use a high z-index by default
            className: 'spinner',  // CSS class to assign to the element
            top: '50%',            // center vertically
            left: '50%',           // center horizontally
            shadow: false,         // Whether to render a shadow
            hwaccel: false,        // Whether to use hardware acceleration (might be buggy)
            position: 'absolute'   // Element positioning
        },
        attributeMap: attributeMap,

        init: function(options){
            this.opts = merge(options || {}, this.defaults)
        },
        /**
         * Adds the spinner to the given target element. If this instance is already
         * spinning, it is automatically removed from its previous target b calling
         * stop() internally.
         */
        spin: function (target) {
            this.stop()

            var self = this
                , o = self.opts
                , el = self.el = createEl(null, {className: o.className})

            css(el, {
                position: o.position
            , width: 0
            , zIndex: o.zIndex
            , left: o.left
            , top: o.top
            })

            if (target) {
                target.insertBefore(el, target.firstChild || null)
            }

            el.setAttribute('role', 'progressbar')
            self.lines(el, self.opts)

            if (!useCssAnimations) {
                // No CSS animation support, use setTimeout() instead
                var i = 0
                    , start = (o.lines - 1) * (1 - o.direction) / 2
                    , alpha
                    , fps = o.fps
                    , f = fps / o.speed
                    , ostep = (1 - o.opacity) / (f * o.trail / 100)
                    , astep = f / o.lines

                ;(function anim () {
                    i++
                    for (var j = 0; j < o.lines; j++) {
                        alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

                        self.opacity(el, j * o.direction + start, alpha, o)
                    }
                    self.timeout = self.el && setTimeout(anim, ~~(1000 / fps))
                })()
            }
            return self
        },

        /**
         * Stops and removes the Spinner.
         */
        stop: function () {
            var el = this.el
            if (el) {
                clearTimeout(this.timeout)
                if (el.parentNode) el.parentNode.removeChild(el)
                this.el = undefined
            }
            return this
        },
        addAnimation: function (alpha, trail, i, lines) {
            var name = ['opacity', trail, ~~(alpha * 100), i, lines].join('-');
            var start = 0.01 + i/lines * 100;
            var z = Math.max(1 - (1-alpha) / trail * (100-start), alpha);
            var prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase();
            var pre = prefix && '-' + prefix + '-' || '';

            if (!animations[name]) {
                sheet.insertRule(
                    '@' + pre + 'keyframes ' + name + '{' +
                    '0%{opacity:' + z + '}' +
                    start + '%{opacity:' + alpha + '}' +
                    (start+0.01) + '%{opacity:1}' +
                    (start+trail) % 100 + '%{opacity:' + alpha + '}' +
                    '100%{opacity:' + z + '}' +
                    '}', sheet.cssRules.length);

                animations[name] = 1
            }

            return name
        },
        /**
         * Internal method that draws the individual lines. Will be overwritten
         * in VML fallback mode below.
         */
        lines: function (el, o) {
            var i = 0
                , start = (o.lines - 1) * (1 - o.direction) / 2
                , seg

            function fill (color, shadow) {
                return css(createEl(), {
                    position: 'absolute'
                , width: o.scale * (o.length + o.width) + 'px'
                , height: o.scale * o.width + 'px'
                , background: color
                , boxShadow: shadow
                , transformOrigin: 'left'
                , transform: 'rotate(' + ~~(360/o.lines*i + o.rotate) + 'deg) translate(' + o.scale*o.radius + 'px' + ',0)'
                , borderRadius: (o.corners * o.scale * o.width >> 1) + 'px'
                })
            }

            for (; i < o.lines; i++) {
                seg = css(createEl(), {
                    position: 'absolute'
                , top: 1 + ~(o.scale * o.width / 2) + 'px'
                , transform: o.hwaccel ? 'translate3d(0,0,0)' : ''
                , opacity: o.opacity
                , animation: useCssAnimations && this.addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1 / o.speed + 's linear infinite'
                })

                if (o.shadow) ins(seg, css(fill('#000', '0 0 4px #000'), {top: '2px'}))
                ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
            }
            return el
        },

        /**
         * Internal method that adjusts the opacity of a single line.
         * Will be overwritten in VML fallback mode below.
         */
        opacity: function (el, i, val) {
            if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
        },
        destroy: function(){}
    });

    function initVML () {

        /* Utility function to create a VML tag */
        function vml (tag, attr) {
            return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
        }

        // No CSS transforms but VML support, add a CSS rule for VML elements:
        sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')

        Spinner.prototype.lines = function (el, o) {
            var r = o.scale * (o.length + o.width)
                , s = o.scale * 2 * r

            function grp () {
                return css(
                    vml('group', {
                        coordsize: s + ' ' + s
                    , coordorigin: -r + ' ' + -r
                    })
                , { width: s, height: s }
                )
            }

            var margin = -(o.width + o.length) * o.scale * 2 + 'px'
                , g = css(grp(), {position: 'absolute', top: margin, left: margin})
                , i

            function seg (i, dx, filter) {
                ins(
                    g
                , ins(
                        css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx})
                    , ins(
                            css(
                                vml('roundrect', {arcsize: o.corners})
                            , { width: r
                                , height: o.scale * o.width
                                , left: o.scale * o.radius
                                , top: -o.scale * o.width >> 1
                                , filter: filter
                                }
                            )
                        , vml('fill', {color: getColor(o.color, i), opacity: o.opacity})
                        , vml('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
                        )
                    )
                )
            }

            if (o.shadow)
                for (i = 1; i <= o.lines; i++) {
                    seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')
                }

            for (i = 1; i <= o.lines; i++) seg(i)
            return ins(el, g)
        }

        Spinner.prototype.opacity = function (el, i, val, o) {
            var c = el.firstChild
            o = o.shadow && o.lines || 0
            if (c && i + o < c.childNodes.length) {
                c = c.childNodes[i + o]; c = c && c.firstChild; c = c && c.firstChild
                if (c) c.opacity = val
            }
        }
    }

    if (typeof document !== 'undefined') {
        sheet = (function () {
            var el = createEl('style', {type : 'text/css'})
            ins(document.getElementsByTagName('head')[0], el)
            return el.sheet || el.styleSheet
        }())

        var probe = css(createEl('group'), {behavior: 'url(#default#VML)'})

        if (!vendor(probe, 'transform') && probe.adj) initVML()
        else useCssAnimations = vendor(probe, 'animation')
    }
    
    







    // =========================================================================

    // Create the defaults once
    var pluginName = "loadmask",
        defaults = {
            position: "right",        // right | inside | overlay
            text: "",                 // Text to display next to the loader
            className: "icon-refresh",    // loader CSS class
            // tpl: '<span class="isloading-wrapper %wrapper%">%text%<i class="%class% icon-spin"></i></span>',    // loader base Tag
            // new Spinner(options.spinner).spin().el
            tpl: '<span class="isloading-wrapper %wrapper%">%text%</span>' + (new Spinner()).spin().el.outerHTML,    // loader base Tag
            disableSource: true,      // true | false
            disableOthers: []
        };



    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        
        // Merge user options with default ones
        this.options = $.extend( {}, defaults, options );

        this._defaults     = defaults;
        this._loader       = null;                // Contain the loading tag element

        this.init();
    }

    // Contructor function for the plugin (only once on page load)
    function contruct() {

        if ( !$[pluginName] ) {
            $.isLoading = function( opts ) {
                $( "body" ).isLoading( opts );
            };
        }
    }
    
    Plugin.prototype = {
        
        init: function() {
            
            if( $( this.element ).is( "body") ) {
                this.options.position = "overlay";
            }
            this.show();
        },

        show: function() {

            var self = this,
                tpl = self.options.tpl.replace( '%wrapper%', ' isloading-show ' + ' isloading-' + self.options.position );
            tpl = tpl.replace( '%class%', self.options['className'] );
            tpl = tpl.replace( '%text%', ( self.options.text !== "" ) ? self.options.text + ' ' : '' );
            self._loader = $( tpl );
            
            // Disable the element
            if( $( self.element ).is( "input, textarea" ) && true === self.options.disableSource ) {

                $( self.element ).attr( "disabled", "disabled" );

            }
            else if( true === self.options.disableSource ) {

                $( self.element ).addClass( "disabled" );

            }

            // Set position
            switch( self.options.position ) {

                case "inside":
                    $( self.element ).html( self._loader );
                    break;

                case "overlay":
                    var $wrapperTpl = null;

                    if( $( self.element ).is( "body") ) {
                        $wrapperTpl = $('<div class="isloading-overlay" style="position:fixed; left:0; top:0; z-index: 10000; background: rgba(0,0,0,0.5); width: 100%; height: ' + $(window).height() + 'px;" />');
                        $( "body" ).prepend( $wrapperTpl );

                        $( window ).on('resize', function() {
                            $wrapperTpl.height( $(window).height() + 'px' );
                            self._loader.css({top: ($(window).height()/2 - self._loader.outerHeight()/2) + 'px' });
                        });
                    } else {
                        var cssPosition = $( self.element ).css('position'),
                            pos = {},
                            height = $( self.element ).outerHeight() + 'px',
                            width = '100%'; // $( self.element ).outerWidth() + 'px;

                        if( 'relative' === cssPosition || 'absolute' === cssPosition ) {
                            pos = { 'top': 0,  'left': 0 };
                        } else {
                            pos = $( self.element ).position();
                        }
                        $wrapperTpl = $('<div class="isloading-overlay" style="position:absolute; top: ' + pos.top + 'px; left: ' + pos.left + 'px; z-index: 10000; background: rgba(0,0,0,0.5); width: ' + width + '; height: ' + height + ';" />');
                        $( self.element ).prepend( $wrapperTpl );

                        $( window ).on('resize', function() {
                            $wrapperTpl.height( $( self.element ).outerHeight() + 'px' );
                            self._loader.css({top: ($wrapperTpl.outerHeight()/2 - self._loader.outerHeight()/2) + 'px' });
                        });
                    }

                    $wrapperTpl.html( self._loader );
                    self._loader.css({top: ($wrapperTpl.outerHeight()/2 - self._loader.outerHeight()/2) + 'px' });
                    break;

                default:
                    $( self.element ).after( self._loader );
                    break;
            }

            self.disableOthers();
        },

        hide: function() {

            if( "overlay" === this.options.position ) {

                $( this.element ).find( ".isloading-overlay" ).first().remove();

            } else {

                $( this._loader ).remove();
                $( this.element ).text( $( this.element ).attr( "data-isloading-label" ) );

            }

            $( this.element ).removeAttr("disabled").removeClass("disabled");

            this.enableOthers();
        },

        disableOthers: function() {
            $.each(this.options.disableOthers, function( i, e ) {
                var elt = $( e );
                if( elt.is( "button, input, textarea" ) ) {
                    elt.attr( "disabled", "disabled" );
                }
                else {
                    elt.addClass( "disabled" );
                }
            });
        },

        enableOthers: function() {
            $.each(this.options.disableOthers, function( i, e ) {
                var elt = $( e );
                if( elt.is( "button, input, textarea" ) ) {
                    elt.removeAttr( "disabled" );
                }
                else {
                    elt.removeClass( "disabled" );
                }
            });
        }
    };
    
    // Constructor
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if ( options && "hide" !== options || !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            } else {
                var elt = $.data( this, "plugin_" + pluginName );

                if( "hide" === options )    { elt.hide(); }
                else                        { elt.show(); }
            }
        });
    };
    
    contruct();
});

/**
 * Bootstrap Multiselect (https://github.com/davidstutz/bootstrap-multiselect)
 * 
 * Apache License, Version 2.0:
 * Copyright (c) 2012 - 2015 David Stutz
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a
 * copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 * 
 * BSD 3-Clause License:
 * Copyright (c) 2012 - 2015 David Stutz
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    - Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 *    - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 *    - Neither the name of David Stutz nor the names of its contributors may be
 *      used to endorse or promote products derived from this software without
 *      specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
Jx().package("T.UI.Controls", function(J){
    // 严格模式
    'use strict';

    var defaults = {
        // 参数
        buttonWidth: 'auto',
        dropRight: false,
        selectedClass: 'active',
        // Maximum height of the dropdown menu.
        // If maximum height is exceeded a scrollbar will be displayed.
        maxHeight: false,
        includeSelectAllOption: false,
        selectAllText: ' Select all',
        selectAllValue: 'multiselect-all',
        selectAllNumber: true,
        enableFiltering: false,
        enableCaseInsensitiveFiltering: false,
        enableClickableOptGroups: false,
        filterPlaceholder: 'Search',
        filterBehavior: 'text',
        includeFilterClearBtn: true,
        preventInputChangeEvent: false,
        placeholder: 'None selected',
        nSelectedText: 'selected',
        allSelectedText: 'All selected',
        numberDisplayed: 3,
        disableIfEmpty: false,
        delimiterText: ', ',

        // 覆写API
        buttonText: function(options, select) {
            if (options.length === 0) {
                return this.placeholder;
            }
            else if (this.allSelectedText 
                        && options.length === $('option', $(select)).length 
                        && $('option', $(select)).length !== 1 
                        && this.multiple) {

                if (this.selectAllNumber) {
                    return this.allSelectedText + ' (' + options.length + ')';
                }
                else {
                    return this.allSelectedText;
                }
            }
            else if (options.length > this.numberDisplayed) {
                return options.length + ' ' + this.nSelectedText;
            }
            else {
                var selected = '';
                var delimiter = this.delimiterText;
                
                options.each(function() {
                    var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();
                    selected += label + delimiter;
                });
                
                return selected.substr(0, selected.length - 2);
            }
        },
        buttonTitle: function(options, select) {
            if (options.length === 0) {
                return this.placeholder;
            }
            else {
                var selected = '';
                var delimiter = this.delimiterText;
                
                options.each(function () {
                    var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();
                    selected += label + delimiter;
                });
                return selected.substr(0, selected.length - 2);
            }
        },        

        // 事件
        onChange : undefined,
        onDropdownShow: undefined,
        onDropdownHide: undefined,
        onDropdownShown: undefined,
        onDropdownHidden: undefined,
        onSelectAll: undefined
    };
    var attributeMap = {
        placeholder: 'placeholder',
        includeSelectAllOption: 'include-select-all-option',
        enableClickableOptGroups: 'enable-clickable-optgroups',
        enableFiltering: 'enable-filtering'
    };

    this.Multiselect = new J.Class({extend : T.UI.BaseControl}, {
        defaults: defaults,
        attributeMap: attributeMap,
        templates: {
            // view: '<button type="button" class="multiselect dropdown-toggle btn btn-default" data-toggle="dropdown"><span class="multiselect-selected-text"></span> <b class="caret"></b></button>',
            // menu: '<ul class="multiselect-container dropdown-menu"></ul>',
            filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
            filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="glyphicon glyphicon-remove-circle"></i></button></span>',
            // li: '<li><a tabindex="0"><label></label></a></li>',
            divider: '<li class="multiselect-item divider"></li>'//,
            // liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>',
            // container: '<div class="btn-group" />'
        },

        init: function(element, options){
            this.element = $(element);

            //this.container;
            //this.elements;

            // this.value = this.element.val();

            // 初始化选项
            // this.initSettings(options);
            var jqElement=$(element);
            this.initSettings(jqElement, options);
            // // Placeholder via data attributes
            // if (this.element.attr("data-placeholder")) {
            //     this.settings.placeholder = this.element.data("placeholder");
            // }
            this.settings.multiple = this.element.attr('multiple') === "multiple";

            // Initialization.
            this.query = '';
            this.searchTimeout = null;
            this.lastToggledInput = null

            this.buildHtml();
            this.initElements();
            this.transferAttributes();
            this.bindEvents();
            this.bindEventsInterface();

            this.buildFilter();

            this.updateButtonText();
            this.updateSelectAll();

            if (this.settings.disableIfEmpty && $('option', this.element).length <= 0) {
                this.disable();
            }
            
            


            
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
        transferAttributes: function(){
            if(this.settings.inheritClass){
                this.elements.view.attr('class', this.element.attr('class'));
            }
            this.elements.view.attr('tabindex', this.element.attr('tabindex'))
            this.elements.orginal.removeAttr('tabindex')

            // 设置是否disabled
            if (this.element.attr('disabled')!==undefined){
               this.disable();
            }
        },
        buildHtml: function(){
            // build container

            if (typeof this.settings.selectAllValue === 'number') {
                this.settings.selectAllValue = this.settings.selectAllValue.toString();
            }
            
            var menuTemplate='<ul class="multiselect-container dropdown-menu">';

            if (this.settings.includeSelectAllOption 
                    && this.settings.multiple) {
                
                menuTemplate += ''+
                    '<li class="multiselect-item multiselect-all">'+
                    '    <a tabindex="0" class="multiselect-all">'+
                    '       <label class="checkbox"><input type="checkbox" value="'+ this.settings.selectAllValue +'">'+ this.settings.selectAllText +'</label>'+
                    '    </a>'+
                    '</li>';

                menuTemplate += this.templates.divider;
            }

            var arrOptions=this.element.children();
            for(var i=0; i<arrOptions.length; i++){
                var element=arrOptions[i];
                var jqOption=$(element);
                var tag=jqOption.prop('tagName').toLowerCase();

                if (tag === 'optgroup') {
                    menuTemplate += this.createOptgroup(element);
                    continue;
                }
                
                if (tag === 'option') {
                    if (jqOption.data('role') === 'divider') {
                        this.createDivider();
                        menuTemplate += this.templates.divider;
                    }
                    else {
                        menuTemplate += this.createOptionValue(element);
                    }
                }
            }
            menuTemplate+='</ul>';

            var htmlTemplate = ''+ 
                '<div class="t-multiselect-container btn-group">'+ 
                '    <button type="button" class="multiselect dropdown-toggle btn btn-default" data-toggle="dropdown">'+ 
                '       <span class="multiselect-selected-text"></span><b class="caret"></b>'+ 
                '    </button>'+
                menuTemplate +
                '</div>';

            this.container = $(htmlTemplate);

            this.element.before(this.container);
        },
        initElements: function(){
            this.elements = {
                orginal: this.element,
                view: $('button', this.container),
                menu: $('ul', this.container),
                groups: $('li.multiselect-group', this.container),
                inputs: $('li input', this.container),
                links: $('li a', this.container),
                getItemSelectAll:function(){
                    return $('li.multiselect-all', this.container);
                }
            };

            // this.element.hide().after(this.container);
            this.element.hide();

            // button

            if (this.settings.buttonWidth && this.settings.buttonWidth !== 'auto') {
                this.elements.view.css({
                    'width' : this.settings.buttonWidth,
                    'overflow' : 'hidden',
                    'text-overflow' : 'ellipsis'
                });
                this.container.css({
                    'width': this.settings.buttonWidth
                });
            }

            this.elements.view.dropdown();

            // menu

            if (this.settings.dropRight) {
                this.elements.menu.addClass('pull-right');
            }

            if (this.settings.maxHeight) {
                // TODO: Add a class for this option to move the css declarations.
                this.elements.menu.css({
                    'max-height': this.settings.maxHeight + 'px',
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden'
                });
            }
        },
        // 取消事件监听
        unbindEvents: function () {
            this.container.off('show.bs.dropdown');
            this.container.off('hide.bs.dropdown');
            this.container.off('shown.bs.dropdown');
            this.container.off('hidden.bs.dropdown');
        },
        // 监听事件
        bindEvents: function () {
            this.unbindEvents();

            if(this.settings.enableClickableOptGroups && this.settings.multiple) {
                this.elements.groups.on('click', $.proxy(this.onGroupClick, this));
            }

            this.elements.links.on('touchstart click', $.proxy(this.onLinkClick, this));
            this.elements.links.on('mousedown', this.onLinkMousedown);

            // Bind the change event on the dropdown elements.
            this.elements.inputs.on('change', $.proxy(this.onCheck, this));

            // Keyboard support.
            this.container.off('keydown.multiselect');
            this.container.on('keydown.multiselect', $.proxy(this.onKeydown, this));
        },
        bindEventsInterface: function(){
            if (typeof (this.settings.onChange) === 'function') {
                this.container.on('onchange.bs.dropdown', this.settings.onChange);
            }
            if (typeof (this.settings.onDropdownShow) === 'function') {
                this.container.on('show.bs.dropdown', this.settings.onDropdownShow);
            }
            if (typeof (this.settings.onDropdownHide) === 'function') {
                this.container.on('hide.bs.dropdown', this.settings.onDropdownHide);
            }
            if (typeof (this.settings.onDropdownShown) === 'function') {
                this.container.on('shown.bs.dropdown', this.settings.onDropdownShown);
            }
            if (typeof (this.settings.onDropdownHidden) === 'function') {
                this.container.on('hidden.bs.dropdown', this.settings.onDropdownHidden);
            }
            if (typeof (this.settings.onSelectAll) === 'function') {
                this.container.on('selectall.bs.dropdown', this.settings.onSelectAll);
            }
        },

        onGroupClick: function(event) {
            event.stopPropagation();

            var group = $(event.target).parent();

            // Search all option in optgroup
            var $settings = group.nextUntil('li.multiselect-group');
            var $visibleOptions = $settings.filter(":visible:not(.disabled)");

            // check or uncheck items
            var allChecked = true;
            var optionInputs = $visibleOptions.find('input');
            optionInputs.each(function() {
                allChecked = allChecked && $(this).prop('checked');
            });

            optionInputs.prop('checked', !allChecked).trigger('change');
        },
        onCheck: function(event) {
            event.stopPropagation();

            var $target = $(event.target);

            var checked = $target.prop('checked') || false;
            var isSelectAllOption = $target.val() === this.settings.selectAllValue;

            // Apply or unapply the configured selected class.
            if (this.settings.selectedClass) {
                if (checked) {
                    $target.closest('li').addClass(this.settings.selectedClass);
                }
                else {
                    $target.closest('li').removeClass(this.settings.selectedClass);
                }
            }

            // Get the corresponding option.
            var value = $target.val();
            var $option = this.getOptionByValue(value);

            var $optionsNotThis = $('option', this.element).not($option);
            var $checkboxesNotThis = $('input', this.container).not($target);

            if (isSelectAllOption) {
                if (checked) {
                    this.selectAll();
                }
                else {
                    this.deselectAll();
                }
            }
            else {
                if (checked) {
                    $option.prop('selected', true);

                    if (this.settings.multiple) {
                        // Simply select additional option.
                        $option.prop('selected', true);
                    }
                    else {
                        // Unselect all other options and corresponding checkboxes.
                        if (this.settings.selectedClass) {
                            $($checkboxesNotThis).closest('li').removeClass(this.settings.selectedClass);
                        }

                        $($checkboxesNotThis).prop('checked', false);
                        $optionsNotThis.prop('selected', false);

                        // It's a single selection, so close.
                        this.elements.view.click();
                    }

                    if (this.settings.selectedClass === "active") {
                        $optionsNotThis.closest("a").css("outline", "");
                    }
                }
                else {
                    // Unselect option.
                    $option.prop('selected', false);
                }
            }

            this.element.change();

            this.updateButtonText();
            this.updateSelectAll();

            // this.settings.onChange($option, checked);
            this.container.trigger('onchange', {option: $option, checked: checked});

            if(this.settings.preventInputChangeEvent) {
                return false;
            }
        },
        onLinkClick: function(event) {
            event.stopPropagation();

            var $target = $(event.target);
            
            if (event.shiftKey && this.settings.multiple) {
                if($target.is("label")){ // Handles checkbox selection manually (see https://github.com/davidstutz/bootstrap-multiselect/issues/431)
                    event.preventDefault();
                    $target = $target.find("input");
                    $target.prop("checked", !$target.prop("checked"));
                }
                var checked = $target.prop('checked') || false;

                if (this.lastToggledInput !== null && this.lastToggledInput !== $target) { // Make sure we actually have a range
                    var from = $target.closest("li").index();
                    var to = this.lastToggledInput.closest("li").index();
                    
                    if (from > to) { // Swap the indices
                        var tmp = to;
                        to = from;
                        from = tmp;
                    }
                    
                    // Make sure we grab all elements since slice excludes the last index
                    ++to;
                    
                    // Change the checkboxes and underlying options
                    var range = this.elements.menu.find("li").slice(from, to).find("input");
                    
                    range.prop('checked', checked);
                    
                    if (this.settings.selectedClass) {
                        range.closest('li')
                            .toggleClass(this.settings.selectedClass, checked);
                    }
                    
                    for (var i = 0, j = range.length; i < j; i++) {
                        var $checkbox = $(range[i]);

                        var $option = this.getOptionByValue($checkbox.val());

                        $option.prop('selected', checked);
                    }                   
                }
                
                // Trigger the select "change" event
                $target.trigger("change");
            }
            
            // Remembers last clicked option
            if($target.is("input") && !$target.closest("li").is(".multiselect-item")){
                this.lastToggledInput = $target;
            }

            $target.blur();
        },
        onLinkMousedown: function(e) {
            if (e.shiftKey) {
                // Prevent selecting text by Shift+click
                return false;
            }
        },
        onKeydown:function(event) {
            if ($('input[type="text"]', this.container).is(':focus')) {
                return;
            }

            if (event.keyCode === 9 && this.container.hasClass('open')) {
                this.elements.view.click();
            }
            else {
                var $items = $(this.container).find("li:not(.divider):not(.disabled) a").filter(":visible");

                if (!$items.length) {
                    return;
                }

                var index = $items.index($items.filter(':focus'));

                // Navigation up.
                if (event.keyCode === 38 && index > 0) {
                    index--;
                }
                // Navigate down.
                else if (event.keyCode === 40 && index < $items.length - 1) {
                    index++;
                }
                else if (!~index) {
                    index = 0;
                }

                var $current = $items.eq(index);
                $current.focus();

                if (event.keyCode === 32 || event.keyCode === 13) {
                    var $checkbox = $current.find('input');

                    $checkbox.prop("checked", !$checkbox.prop("checked"));
                    $checkbox.change();
                }

                event.stopPropagation();
                event.preventDefault();
            }
        },

        createOptionValue: function(element) {

            var $element = $(element);
            if ($element.is(':selected')) {
                $element.prop('selected', true);
            }

            // Support the label attribute on options.
            //var label = this.settings.optionLabel(element);
            var label = $element.attr('label') || $element.text();
            var labelTitle = $element.attr('title') || '';
            var value = $element.val();
            var inputType = this.settings.multiple ? "checkbox" : "radio";
            var selected = $element.prop('selected') || false;
            var isDisabled = $element.is(':disabled');

            var htmlItemClass='';
            var htmlLinkClass='';
            if (selected && this.settings.selectedClass) {
                htmlItemClass=+this.settings.selectedClass;
            }
            if(isDisabled){
                htmlItemClass += ' disabled';
            }
            if (value === this.settings.selectAllValue) {
                htmlItemClass += ' multiselect-item multiselect-all';
                htmlLinkClass = ' class="'+multiselect-all + '"';
            }

            
            // '<li class="active"><a tabindex="0"><label class="checkbox"><input type="checkbox" value="1-2"> Option 1.2</label></a></li>'
            var htmlItem = ''+
                '<li class="'+htmlItemClass+'" '+(isDisabled ? 'tabindex="-1"' : '')+'>'+
                '   <a tabindex="0"'+(isDisabled ? ' tabindex="-1"' : '')+htmlLinkClass+'>'+
                '       <label class="'+inputType+'" title="'+labelTitle+'">'+
                '       <input '+
                '           type="'+inputType+'" '+
                // (this.settings.checkboxName ? 'name="'+this.settings.checkboxName+'"' : '')+
                '           value="'+value+'" '+
                (selected ? 'checked="checked"' : '')+
                (isDisabled ? 'disabled="disabled"' : '')+
                '" />'+
                label+
                '       </label>'+
                '   </a>'+
                '</li>';            

            return htmlItem;
        },

        createOptgroup: function(group) {
            var groupName = $(group).prop('label');

            var htmlClass='';
            if(this.settings.enableClickableOptGroups){
                htmlClass += ' multiselect-group-clickable'
            }
            if ($(group).is(':disabled')) {
                htmlClass += ' disabled';
            }

            //'<li class="multiselect-item multiselect-group multiselect-group-clickable"><label>Group 2</label></li>'
            var htmlTemplate=''+
                '<li class="multiselect-item multiselect-group'+htmlClass+'"><label>'+groupName+'</label></li>';

            var arrOptions=$('option', group);
            for(var i=0; i<arrOptions.length; i++){
                var element=arrOptions[i];
                htmlTemplate += this.createOptionValue(element);
            }

            return htmlTemplate;
        },

        buildFilter: function() {

            // Build filter if filtering OR case insensitive filtering is enabled and the number of settings exceeds (or equals) enableFilterLength.
            if (!(this.settings.enableFiltering || this.settings.enableCaseInsensitiveFiltering)) {
                return;
            }

            var enableFilterLength = Math.max(this.settings.enableFiltering, this.settings.enableCaseInsensitiveFiltering);

            if (this.element.find('option').length < enableFilterLength) {
                return;
            }

            this.$filter = $(this.templates.filter);
            $('input', this.$filter).attr('placeholder', this.settings.filterPlaceholder);
            
            // Adds optional filter clear button
            if(this.settings.includeFilterClearBtn){
                var clearBtn = $(this.templates.filterClearBtn);
                clearBtn.on('click', $.proxy(function(event){
                    clearTimeout(this.searchTimeout);
                    this.$filter.find('.multiselect-search').val('');
                    $('li', this.elements.menu).show().removeClass("filter-hidden");
                    this.updateSelectAll();
                }, this));
                this.$filter.find('.input-group').append(clearBtn);
            }
            
            this.elements.menu.prepend(this.$filter);

            this.$filter
                .val(this.query)
                .on('click', function(event) {
                    event.stopPropagation();
                })
                .on('input keydown', $.proxy(function(event) {
                // Cancel enter key default behaviour
                if (event.which === 13) {
                  event.preventDefault();
                }
                
                // This is useful to catch "keydown" events after the browser has updated the control.
                clearTimeout(this.searchTimeout);

                this.searchTimeout = this.asyncFunction($.proxy(function() {

                    if (this.query !== event.target.value) {
                        this.query = event.target.value;

                        var currentGroup, currentGroupVisible;
                        $.each($('li', this.elements.menu), $.proxy(function(index, element) {
                            var value = $('input', element).length > 0 ? $('input', element).val() : "";
                            var text = $('label', element).text();

                            var filterCandidate = '';
                            if ((this.settings.filterBehavior === 'text')) {
                                filterCandidate = text;
                            }
                            else if ((this.settings.filterBehavior === 'value')) {
                                filterCandidate = value;
                            }
                            else if (this.settings.filterBehavior === 'both') {
                                filterCandidate = text + '\n' + value;
                            }

                            if (value !== this.settings.selectAllValue && text) {
                                // By default lets assume that element is not
                                // interesting for this search.
                                var showElement = false;

                                if (this.settings.enableCaseInsensitiveFiltering && filterCandidate.toLowerCase().indexOf(this.query.toLowerCase()) > -1) {
                                    showElement = true;
                                }
                                else if (filterCandidate.indexOf(this.query) > -1) {
                                    showElement = true;
                                }

                                // Toggle current element (group or group item) according to showElement boolean.
                                $(element).toggle(showElement).toggleClass('filter-hidden', !showElement);
                                
                                // Differentiate groups and group items.
                                if ($(element).hasClass('multiselect-group')) {
                                    // Remember group status.
                                    currentGroup = element;
                                    currentGroupVisible = showElement;
                                }
                                else {
                                    // Show group name when at least one of its items is visible.
                                    if (showElement) {
                                        $(currentGroup).show().removeClass('filter-hidden');
                                    }
                                    
                                    // Show all group items when group name satisfies filter.
                                    if (!showElement && currentGroupVisible) {
                                        $(element).show().removeClass('filter-hidden');
                                    }
                                }
                            }
                        }, this));
                    }

                    this.updateSelectAll();
                }, this), 300, this);
            }, this));
        },

        destroy: function() {
            this.container.remove();
            this.element.show();
            this.element.data('multiselect', null);
        },

        refresh: function() {
            $('option', this.element).each($.proxy(function(index, element) {
                var $input = $('li input', this.elements.menu).filter(function() {
                    return $(this).val() === $(element).val();
                });

                if ($(element).is(':selected')) {
                    $input.prop('checked', true);

                    if (this.settings.selectedClass) {
                        $input.closest('li')
                            .addClass(this.settings.selectedClass);
                    }
                }
                else {
                    $input.prop('checked', false);

                    if (this.settings.selectedClass) {
                        $input.closest('li')
                            .removeClass(this.settings.selectedClass);
                    }
                }

                if ($(element).is(":disabled")) {
                    $input.attr('disabled', 'disabled')
                        .prop('disabled', true)
                        .closest('li')
                        .addClass('disabled');
                }
                else {
                    $input.prop('disabled', false)
                        .closest('li')
                        .removeClass('disabled');
                }
            }, this));

            this.updateButtonText();
            this.updateSelectAll();
        },
        select: function(selectValues, triggerOnChange) {
            if(!$.isArray(selectValues)) {
                selectValues = [selectValues];
            }

            for (var i = 0; i < selectValues.length; i++) {
                var value = selectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if($option === undefined || $checkbox === undefined) {
                    continue;
                }
                
                if (!this.settings.multiple) {
                    this.deselectAll(false);
                }
                
                if (this.settings.selectedClass) {
                    $checkbox.closest('li')
                        .addClass(this.settings.selectedClass);
                }

                $checkbox.prop('checked', true);
                $option.prop('selected', true);
                
                if (triggerOnChange) {
                    // this.settings.onChange($option, true);
                    this.container.trigger('onchange', {option: $option, checked: true});
                }
            }

            this.updateButtonText();
            this.updateSelectAll();
        },
        clearSelection: function () {
            this.deselectAll(false);
            this.updateButtonText();
            this.updateSelectAll();
        },
        deselect: function(deselectValues, triggerOnChange) {
            if(!$.isArray(deselectValues)) {
                deselectValues = [deselectValues];
            }

            for (var i = 0; i < deselectValues.length; i++) {
                var value = deselectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if($option === undefined || $checkbox === undefined) {
                    continue;
                }

                if (this.settings.selectedClass) {
                    $checkbox.closest('li')
                        .removeClass(this.settings.selectedClass);
                }

                $checkbox.prop('checked', false);
                $option.prop('selected', false);
                
                if (triggerOnChange) {
                    // this.settings.onChange($option, false);
                    this.container.trigger('onchange', {option: $option, checked: false});
                }
            }

            this.updateButtonText();
            this.updateSelectAll();
        },
        selectAll: function (justVisible, triggerOnSelectAll) {
            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            var allCheckboxes = $("li input[type='checkbox']:enabled", this.elements.menu);
            var visibleCheckboxes = allCheckboxes.filter(":visible");
            var allCheckboxesCount = allCheckboxes.length;
            var visibleCheckboxesCount = visibleCheckboxes.length;
            
            if(justVisible) {
                visibleCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.elements.menu).filter(":visible").addClass(this.settings.selectedClass);
            }
            else {
                allCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.elements.menu).addClass(this.settings.selectedClass);
            }
                
            if (allCheckboxesCount === visibleCheckboxesCount || justVisible === false) {
                $("option:enabled", this.element).prop('selected', true);
            }
            else {
                var values = visibleCheckboxes.map(function() {
                    return $(this).val();
                }).get();
                
                $("option:enabled", this.element).filter(function(index) {
                    return $.inArray($(this).val(), values) !== -1;
                }).prop('selected', true);
            }
            
            if (triggerOnSelectAll) {
                // this.settings.onSelectAll();
                this.container.trigger('selectall');
            }
        },
        deselectAll: function (justVisible) {
            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            
            if(justVisible) {              
                var visibleCheckboxes = $("li input[type='checkbox']:not(:disabled)", this.elements.menu).filter(":visible");
                visibleCheckboxes.prop('checked', false);
                
                var values = visibleCheckboxes.map(function() {
                    return $(this).val();
                }).get();
                
                $("option:enabled", this.element).filter(function(index) {
                    return $.inArray($(this).val(), values) !== -1;
                }).prop('selected', false);
                
                if (this.settings.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.elements.menu).filter(":visible").removeClass(this.settings.selectedClass);
                }
            }
            else {
                $("li input[type='checkbox']:enabled", this.elements.menu).prop('checked', false);
                $("option:enabled", this.element).prop('selected', false);
                
                if (this.settings.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.elements.menu).removeClass(this.settings.selectedClass);
                }
            }
        },

        rebuild: function() {
            this.elements.menu.html('');

            // Important to distinguish between radios and checkboxes.
            this.settings.multiple = this.element.attr('multiple') === "multiple";

            this.buildHtml();
            // this.buildSelectAll();
            // this.buildDropdownOptions();
            // this.buildFilter();

            // this.updateButtonText();
            // this.updateSelectAll();
            
            if (this.settings.disableIfEmpty && $('option', this.element).length <= 0) {
                this.disable();
            }
            else {
                this.enable();
            }
            
            if (this.settings.dropRight) {
                this.elements.menu.addClass('pull-right');
            }
        },

        /**
         * The provided data will be used to build the dropdown.
         */
        dataprovider: function(dataprovider) {
            
            var groupCounter = 0;
            var element = this.element.empty();
            
            $.each(dataprovider, function (index, option) {
                var $tag;
                
                if ($.isArray(option.children)) { // create optiongroup tag
                    groupCounter++;
                    
                    $tag = $('<optgroup/>').attr({
                        label: option.label || 'Group ' + groupCounter,
                        disabled: !!option.disabled
                    });
                    
                    for(var i=0; i<option.children.length; i++){
                        subOption=option.children[i];
                        $tag.append($('<option/>').attr({
                            value: subOption.value,
                            label: subOption.label || subOption.value,
                            title: subOption.title,
                            selected: !!subOption.selected,
                            disabled: !!subOption.disabled
                        }));
                    }
                }
                else {
                    $tag = $('<option/>').attr({
                        value: option.value,
                        label: option.label || option.value,
                        title: option.title,
                        selected: !!option.selected,
                        disabled: !!option.disabled
                    });
                }
                
                element.append($tag);
            });
            
            this.rebuild();
        },
        enable: function() {
            this.element.prop('disabled', false);
            this.elements.view.prop('disabled', false)
                .removeClass('disabled');
        },
        disable: function() {
            this.element.prop('disabled', true);
            this.elements.view.prop('disabled', true)
                .addClass('disabled');
        },
        hasSelectAll: function() {
            // return $('li.multiselect-all', this.elements.menu).length > 0;
            return this.elements.getItemSelectAll();
        },
        updateSelectAll: function() {
            if (!this.hasSelectAll()) {
                return;
            }

            var allBoxes = $("li:not(.multiselect-item):not(.filter-hidden) input:enabled", this.elements.menu);
            var allBoxesLength = allBoxes.length;
            var checkedBoxesLength = allBoxes.filter(":checked").length;
            var selectAllLi  = $("li.multiselect-all", this.elements.menu);
            var selectAllInput = selectAllLi.find("input");
            
            if (checkedBoxesLength > 0 && checkedBoxesLength === allBoxesLength) {
                selectAllInput.prop("checked", true);
                selectAllLi.addClass(this.settings.selectedClass);
                // this.settings.onSelectAll();
                this.container.trigger('selectall');
            }
            else {
                selectAllInput.prop("checked", false);
                selectAllLi.removeClass(this.settings.selectedClass);
            }
        },
        updateButtonText: function() {
            var settings = this.getSelected();
            
            // // First update the displayed button text.
            // if (this.settings.enableHTML) {
            //     $('.multiselect .multiselect-selected-text', this.container).html(this.settings.buttonText(settings, this.element));
            // }
            // else {
            //     $('.multiselect .multiselect-selected-text', this.container).text(this.settings.buttonText(settings, this.element));
            // }
            $('.multiselect .multiselect-selected-text', this.container).text(this.settings.buttonText(settings, this.element));
            
            // Now update the title attribute of the button.
            $('.multiselect', this.container).attr('title', this.settings.buttonTitle(settings, this.element));
        },
        getSelected: function() {
            return $('option', this.element).filter(":selected");
        },
        getOptionByValue: function (value) {

            var options = $('option', this.element);
            var valueToCompare = value.toString();

            for (var i = 0; i < options.length; i = i + 1) {
                var option = options[i];
                if (option.value === valueToCompare) {
                    return $(option);
                }
            }
        },
        getInputByValue: function (value) {

            var checkboxes = $('li input', this.elements.menu);
            var valueToCompare = value.toString();

            for (var i = 0; i < checkboxes.length; i = i + 1) {
                var checkbox = checkboxes[i];
                if (checkbox.value === valueToCompare) {
                    return $(checkbox);
                }
            }
        },

        asyncFunction: function(callback, timeout, self) {
            var args = Array.prototype.slice.call(arguments, 3);
            return setTimeout(function() {
                callback.apply(self || window, args);
            }, timeout);
        },

        setAllSelectedText: function(allSelectedText) {
            this.settings.allSelectedText = allSelectedText;
            this.updateButtonText();
        }
    });
});
/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.5
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.5'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // // SCROLLSPY NO CONFLICT
  // // =====================

  // $.fn.scrollspy.noConflict = function () {
  //   $.fn.scrollspy = old
  //   return this
  // }


  // // SCROLLSPY DATA-API
  // // ==================

  // $(window).on('load.bs.scrollspy.data-api', function () {
  //   $('[data-spy="scroll"]').each(function () {
  //     var $spy = $(this)
  //     Plugin.call($spy, $spy.data())
  //   })
  // })

}(jQuery);

Jx().package("T.UI.Controls", function(J){

    // 严格模式
    'use strict';

    // 全局变量、函数、对象

    function _scopedEventName(name, id) {
        return name + '.spinner' + id;
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
            this.element = $(element);

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

            // 初始化选项
            // this.initSettings(options);
            var jqElement=$(element);
            this.initSettings(jqElement, options);
            
            // 设置初始值
            if (this.settings.initval !== '' && this.element.val() === '') {
                this.element.val(this.settings.initval);
            }
            // 校验值是否合法
            this._checkValue();
            // 构建html DOM
            this.buildHtml();
            // 初始化 html DOM 元素
            this.initElements();
            // 隐藏空的前后缀
            this._hideEmptyPrefixPostfix();
            // 绑定事件
            this.bindEvents();
            // 绑定事件接口
            this.bindEventsInterface();
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
                html = ''+
                    '<div class="input-group bootstrap-spinner"><span class="input-group-addon bootstrap-spinner-prefix">' + 
                    this.settings.prefix + '</span><span class="input-group-addon bootstrap-spinner-postfix">' + 
                    this.settings.postfix + '</span><span class="input-group-btn-vertical"><button class="' + 
                    this.settings.buttondown_class + ' bootstrap-spinner-up" type="button"><i class="' + 
                    this.settings.verticalupclass + '"></i></button><button class="' + this.settings.buttonup_class + 
                    ' bootstrap-spinner-down" type="button"><i class="' + 
                    this.settings.verticaldownclass + '"></i></button></span></div>';
            }
            else {
                html = ''+
                    '<div class="input-group bootstrap-spinner"><span class="input-group-btn"><button class="' + 
                    this.settings.buttondown_class + 
                    ' bootstrap-spinner-down" type="button">-</button></span><span class="input-group-addon bootstrap-spinner-prefix">' + 
                    this.settings.prefix + '</span><span class="input-group-addon bootstrap-spinner-postfix">' + 
                    this.settings.postfix + '</span><span class="input-group-btn"><button class="' + 
                    this.settings.buttonup_class + ' bootstrap-spinner-up" type="button">+</button></span></div>';
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

        initElements:function () {
            this.elements = {
                down: $('.bootstrap-spinner-down', this.container),
                up: $('.bootstrap-spinner-up', this.container),
                input: $('input', this.container),
                prefix: $('.bootstrap-spinner-prefix', this.container).addClass(this.settings.prefix_extraclass),
                postfix: $('.bootstrap-spinner-postfix', this.container).addClass(this.settings.postfix_extraclass)
            };

            this.elements.input.css('display', 'block');
        },

        _hideEmptyPrefixPostfix:function () {
            if (this.settings.prefix === '') {
                this.elements.prefix.hide();
            }

            if (this.settings.postfix === '') {
                this.elements.postfix.hide();
            }
        },

        bindEvents:function () {
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

            $(document).on(_scopeEventNames(['mouseup', 'touchend', 'touchcancel'], this.element.data('plugin-id')).join(' '), function(ev) {
                if (!context.spinning) {
                    return;
                }

                ev.preventDefault();
                context.stopSpin();
            });

            $(document).on(_scopeEventNames(['mousemove', 'touchmove', 'scroll', 'scrollstart'], this.element.data('plugin-id')).join(' '), function(ev) {
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

        bindEventsInterface:function () {
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
        unbindEvents: function(){
            $(document).off(_scopeEventNames([
            'mouseup',
            'touchend',
            'touchcancel',
            'mousemove',
            'touchmove',
            'scroll',
            'scrollstart'], this.element.data('pluginId')).join(' '));
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
        }//,
        // setValue: function(value){
        //     this.element.val(value);
        //     this.elements.input.val(value);
        //     this._checkValue();
        // }
    });
});
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

            // this.initSettings(options);
            var jqElement=$(element);
            this.initSettings(jqElement, options);
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
/* ========================================================================
 * Bootstrap: tooltip.js v3.3.5
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.5'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // // TOOLTIP NO CONFLICT
  // // ===================

  // $.fn.tooltip.noConflict = function () {
  //   $.fn.tooltip = old
  //   return this
  // }

}(jQuery);

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
/*! DataTables 1.10.10
 * ©2008-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.10.10
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2008-2015 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */




(function( $, window, document, undefined ) {
    "use strict";

    var DataTable;

    var _ext; // DataTable.ext
    var _Api; // DataTable.Api
    var _api_register; // DataTable.Api.register
    var _api_registerPlural; // DataTable.Api.registerPlural
    
    var _re_dic = {};
    var _re_new_lines = /[\r\n]/g;
    var _re_html = /<.*?>/g;
    var _re_date_start = /^[\w\+\-]/;
    var _re_date_end = /[\w\+\-]$/;
    
    // Escape regular expression special characters
    var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );

    var _re_formatted_numeric = /[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfk]/gi;
    
    
    var _empty = function ( d ) {
        return !d || d === true || d === '-' ? true : false;
    };
    
    
    var _intVal = function ( s ) {
        var integer = parseInt( s, 10 );
        return !isNaN(integer) && isFinite(s) ? integer : null;
    };
    
    // Convert from a formatted number with characters other than `.` as the
    // decimal place, to a Javascript number
    var _numToDecimal = function ( num, decimalPoint ) {
        // Cache created regular expressions for speed as this function is called often
        if ( ! _re_dic[ decimalPoint ] ) {
            _re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
        }
        return typeof num === 'string' && decimalPoint !== '.' ?
            num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
            num;
    };
    
    
    var _isNumber = function ( d, decimalPoint, formatted ) {
        var strType = typeof d === 'string';
    
        // If empty return immediately so there must be a number if it is a
        // formatted string (this stops the string "k", or "kr", etc being detected
        // as a formatted number for currency
        if ( _empty( d ) ) {
            return true;
        }
    
        if ( decimalPoint && strType ) {
            d = _numToDecimal( d, decimalPoint );
        }
    
        if ( formatted && strType ) {
            d = d.replace( _re_formatted_numeric, '' );
        }
    
        return !isNaN( parseFloat(d) ) && isFinite( d );
    };
    
    
    // A string without HTML in it can be considered to be HTML still
    var _isHtml = function ( d ) {
        return _empty( d ) || typeof d === 'string';
    };
    
    
    var _htmlNumeric = function ( d, decimalPoint, formatted ) {
        if ( _empty( d ) ) {
            return true;
        }
    
        var html = _isHtml( d );
        return ! html ?
            null :
            _isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
                true :
                null;
    };
    
    
    var _pluck = function ( a, prop, prop2 ) {
        var out = [];
        var i=0, ien=a.length;
    
        // Could have the test in the loop for slightly smaller code, but speed
        // is essential here
        if ( prop2 !== undefined ) {
            for ( ; i<ien ; i++ ) {
                if ( a[i] && a[i][ prop ] ) {
                    out.push( a[i][ prop ][ prop2 ] );
                }
            }
        }
        else {
            for ( ; i<ien ; i++ ) {
                if ( a[i] ) {
                    out.push( a[i][ prop ] );
                }
            }
        }
    
        return out;
    };
        
    // Basically the same as _pluck, but rather than looping over `a` we use `order`
    // as the indexes to pick from `a`
    var _pluck_order = function ( a, order, prop, prop2 )
    {
        var out = [];
        var i=0, ien=order.length;
    
        // Could have the test in the loop for slightly smaller code, but speed
        // is essential here
        if ( prop2 !== undefined ) {
            for ( ; i<ien ; i++ ) {
                if ( a[ order[i] ][ prop ] ) {
                    out.push( a[ order[i] ][ prop ][ prop2 ] );
                }
            }
        }
        else {
            for ( ; i<ien ; i++ ) {
                out.push( a[ order[i] ][ prop ] );
            }
        }
    
        return out;
    };    
    
    var _range = function ( len, start )
    {
        var out = [];
        var end;
    
        if ( start === undefined ) {
            start = 0;
            end = len;
        }
        else {
            end = start;
            start = len;
        }
    
        for ( var i=start ; i<end ; i++ ) {
            out.push( i );
        }
    
        return out;
    };    
    
    var _removeEmpty = function ( a )
    {
        var out = [];
    
        for ( var i=0, ien=a.length ; i<ien ; i++ ) {
            if ( a[i] ) { // careful - will remove all falsy values!
                out.push( a[i] );
            }
        }
    
        return out;
    };    
    
    var _stripHtml = function ( d ) {
        return d.replace( _re_html, '' );
    };
    
    var _unique = function ( src )
    {
        // A faster unique method is to use object keys to identify used values,
        // but this doesn't work with arrays or objects, which we must also
        // consider. See jsperf.com/compare-array-unique-versions/4 for more
        // information.
        var
            out = [],
            val,
            i, ien=src.length,
            j, k=0;
    
        again: for ( i=0 ; i<ien ; i++ ) {
            val = src[i];
    
            for ( j=0 ; j<k ; j++ ) {
                if ( out[j] === val ) {
                    continue again;
                }
            }
    
            out.push( val );
            k++;
        }
    
        return out;
    };
    
    function _fnHungarianMap ( o )
    {
        var
            hungarian = 'a aa ai ao as b fn i m o s ',
            match,
            newKey,
            map = {};
    
        $.each( o, function (key, val) {
            match = key.match(/^([^A-Z]+?)([A-Z])/);
    
            if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
            {
                newKey = key.replace( match[0], match[2].toLowerCase() );
                map[ newKey ] = key;
    
                if ( match[1] === 'o' )
                {
                    _fnHungarianMap( o[key] );
                }
            }
        } );
    
        o._hungarianMap = map;
    }
    
    function _fnCamelToHungarian ( src, user, force )
    {
        if ( ! src._hungarianMap ) {
            _fnHungarianMap( src );
        }
    
        var hungarianKey;
    
        $.each( user, function (key, val) {
            hungarianKey = src._hungarianMap[ key ];
    
            if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
            {
                // For objects, we need to buzz down into the object to copy parameters
                if ( hungarianKey.charAt(0) === 'o' )
                {
                    // Copy the camelCase options over to the hungarian
                    if ( ! user[ hungarianKey ] ) {
                        user[ hungarianKey ] = {};
                    }
                    $.extend( true, user[hungarianKey], user[key] );
    
                    _fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
                }
                else {
                    user[hungarianKey] = user[ key ];
                }
            }
        } );
    }
    
    function _fnLanguageCompat( lang )
    {
        var defaults = DataTable.defaults.oLanguage;
        var zeroRecords = lang.sZeroRecords;
    
        
        if ( ! lang.sEmptyTable && zeroRecords &&
            defaults.sEmptyTable === "No data available in table" )
        {
            _fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
        }
    
        
        if ( ! lang.sLoadingRecords && zeroRecords &&
            defaults.sLoadingRecords === "Loading..." )
        {
            _fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
        }
    
        // Old parameter name of the thousands separator mapped onto the new
        if ( lang.sInfoThousands ) {
            lang.sThousands = lang.sInfoThousands;
        }
    
        var decimal = lang.sDecimal;
        if ( decimal ) {
            _addNumericSort( decimal );
        }
    }
    
    var _fnCompatMap = function ( o, knew, old ) {
        if ( o[ knew ] !== undefined ) {
            o[ old ] = o[ knew ];
        }
    };
    
    function _fnCompatOpts ( init )
    {
        _fnCompatMap( init, 'ordering',      'bSort' );
        _fnCompatMap( init, 'orderMulti',    'bSortMulti' );
        _fnCompatMap( init, 'orderClasses',  'bSortClasses' );
        _fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
        _fnCompatMap( init, 'order',         'aaSorting' );
        _fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
        _fnCompatMap( init, 'paging',        'bPaginate' );
        _fnCompatMap( init, 'pagingType',    'sPaginationType' );
        _fnCompatMap( init, 'pageLength',    'iDisplayLength' );
        _fnCompatMap( init, 'searching',     'bFilter' );
    
        // Boolean initialisation of x-scrolling
        if ( typeof init.sScrollX === 'boolean' ) {
            init.sScrollX = init.sScrollX ? '100%' : '';
        }
        if ( typeof init.scrollX === 'boolean' ) {
            init.scrollX = init.scrollX ? '100%' : '';
        }
    
        // Column search objects are in an array, so it needs to be converted
        // element by element
        var searchCols = init.aoSearchCols;
    
        if ( searchCols ) {
            for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
                if ( searchCols[i] ) {
                    _fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
                }
            }
        }
    }
    
    function _fnCompatCols ( init )
    {
        _fnCompatMap( init, 'orderable',     'bSortable' );
        _fnCompatMap( init, 'orderData',     'aDataSort' );
        _fnCompatMap( init, 'orderSequence', 'asSorting' );
        _fnCompatMap( init, 'orderDataType', 'sortDataType' );
    
        // orderData can be given as an integer
        var dataSort = init.aDataSort;
        if ( dataSort && ! $.isArray( dataSort ) ) {
            init.aDataSort = [ dataSort ];
        }
    }
    

    function _fnBrowserDetect( settings )
    {
        // We don't need to do this every time DataTables is constructed, the values
        // calculated are specific to the browser and OS configuration which we
        // don't expect to change between initialisations
        if ( ! DataTable.__browser ) {
            var browser = {};
            DataTable.__browser = browser;
    
            // Scrolling feature / quirks detection
            var n = $('<div/>')
                .css( {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: 1,
                    width: 1,
                    overflow: 'hidden'
                } )
                .append(
                    $('<div/>')
                        .css( {
                            position: 'absolute',
                            top: 1,
                            left: 1,
                            width: 100,
                            overflow: 'scroll'
                        } )
                        .append(
                            $('<div/>')
                                .css( {
                                    width: '100%',
                                    height: 10
                                } )
                        )
                )
                .appendTo( 'body' );
    
            var outer = n.children();
            var inner = outer.children();
    
            // Numbers below, in order, are:
            // inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
            //
            // IE6 XP:                           100 100 100  83
            // IE7 Vista:                        100 100 100  83
            // IE 8+ Windows:                     83  83 100  83
            // Evergreen Windows:                 83  83 100  83
            // Evergreen Mac with scrollbars:     85  85 100  85
            // Evergreen Mac without scrollbars: 100 100 100 100
    
            // Get scrollbar width
            browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
    
            // IE6/7 will oversize a width 100% element inside a scrolling element, to
            // include the width of the scrollbar, while other browsers ensure the inner
            // element is contained without forcing scrolling
            browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
    
            // In rtl text layout, some browsers (most, but not all) will place the
            // scrollbar on the left, rather than the right.
            browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
    
            // IE8- don't provide height and width for getBoundingClientRect
            browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
    
            n.remove();
        }
    
        $.extend( settings.oBrowser, DataTable.__browser );
        settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
    }
    
    function _fnReduce ( that, fn, init, start, end, inc )
    {
        var
            i = start,
            value,
            isSet = false;
    
        if ( init !== undefined ) {
            value = init;
            isSet = true;
        }
    
        while ( i !== end ) {
            if ( ! that.hasOwnProperty(i) ) {
                continue;
            }
    
            value = isSet ?
                fn( value, that[i], i, that ) :
                that[i];
    
            isSet = true;
            i += inc;
        }
    
        return value;
    }

    function _fnAddColumn( oSettings, nTh )
    {
        // Add column to aoColumns array
        var oDefaults = DataTable.defaults.column;
        var iCol = oSettings.aoColumns.length;
        var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
            "nTh": nTh ? nTh : document.createElement('th'),
            "sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
            "aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
            "mData": oDefaults.mData ? oDefaults.mData : iCol,
            idx: iCol
        } );
        oSettings.aoColumns.push( oCol );
    
        // Add search object for column specific search. Note that the `searchCols[ iCol ]`
        // passed into extend can be undefined. This allows the user to give a default
        // with only some of the parameters defined, and also not give a default
        var searchCols = oSettings.aoPreSearchCols;
        searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
    
        // Use the default column options function to initialise classes etc
        _fnColumnOptions( oSettings, iCol, $(nTh).data() );
    }
    

    function _fnColumnOptions( oSettings, iCol, oOptions )
    {
        var oCol = oSettings.aoColumns[ iCol ];
        var oClasses = oSettings.oClasses;
        var th = $(oCol.nTh);
    
        // Try to get width information from the DOM. We can't get it from CSS
        // as we'd need to parse the CSS stylesheet. `width` option can override
        if ( ! oCol.sWidthOrig ) {
            // Width attribute
            oCol.sWidthOrig = th.attr('width') || null;
    
            // Style attribute
            var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
            if ( t ) {
                oCol.sWidthOrig = t[1];
            }
        }
    
        
        if ( oOptions !== undefined && oOptions !== null )
        {
            // Backwards compatibility
            _fnCompatCols( oOptions );
    
            // Map camel case parameters to their Hungarian counterparts
            _fnCamelToHungarian( DataTable.defaults.column, oOptions );
    
            
            if ( oOptions.mDataProp !== undefined && !oOptions.mData )
            {
                oOptions.mData = oOptions.mDataProp;
            }
    
            if ( oOptions.sType )
            {
                oCol._sManualType = oOptions.sType;
            }
    
            // `class` is a reserved word in Javascript, so we need to provide
            // the ability to use a valid name for the camel case input
            if ( oOptions.className && ! oOptions.sClass )
            {
                oOptions.sClass = oOptions.className;
            }
    
            $.extend( oCol, oOptions );
            _fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
    
            
            if ( oOptions.iDataSort !== undefined )
            {
                oCol.aDataSort = [ oOptions.iDataSort ];
            }
            _fnMap( oCol, oOptions, "aDataSort" );
        }
    
        
        var mDataSrc = oCol.mData;
        var mData = _fnGetObjectDataFn( mDataSrc );
        var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
    
        var attrTest = function( src ) {
            return typeof src === 'string' && src.indexOf('@') !== -1;
        };
        oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
            attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
        );
    
        oCol.fnGetData = function (rowData, type, meta) {
            var innerData = mData( rowData, type, undefined, meta );
    
            return mRender && type ?
                mRender( innerData, type, rowData, meta ) :
                innerData;
        };
        oCol.fnSetData = function ( rowData, val, meta ) {
            return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
        };
    
        // Indicate if DataTables should read DOM data as an object or array
        // Used in _fnGetRowElements
        if ( typeof mDataSrc !== 'number' ) {
            oSettings._rowReadObject = true;
        }
    
        
        if ( !oSettings.oFeatures.bSort )
        {
            oCol.bSortable = false;
            th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
        }
    
        
        var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
        var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
        if ( !oCol.bSortable || (!bAsc && !bDesc) )
        {
            oCol.sSortingClass = oClasses.sSortableNone;
            oCol.sSortingClassJUI = "";
        }
        else if ( bAsc && !bDesc )
        {
            oCol.sSortingClass = oClasses.sSortableAsc;
            oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
        }
        else if ( !bAsc && bDesc )
        {
            oCol.sSortingClass = oClasses.sSortableDesc;
            oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
        }
        else
        {
            oCol.sSortingClass = oClasses.sSortable;
            oCol.sSortingClassJUI = oClasses.sSortJUI;
        }
    }
    

    function _fnAdjustColumnSizing ( settings )
    {
        
        if ( settings.oFeatures.bAutoWidth !== false )
        {
            var columns = settings.aoColumns;
    
            _fnCalculateColumnWidths( settings );
            for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
            {
                columns[i].nTh.style.width = columns[i].sWidth;
            }
        }
    
        var scroll = settings.oScroll;
        if ( scroll.sY !== '' || scroll.sX !== '')
        {
            _fnScrollDraw( settings );
        }
    
        _fnCallbackFire( settings, null, 'column-sizing', [settings] );
    }
    
    function _fnVisibleToColumnIndex( oSettings, iMatch )
    {
        var aiVis = _fnGetColumns( oSettings, 'bVisible' );
    
        return typeof aiVis[iMatch] === 'number' ?
            aiVis[iMatch] :
            null;
    }

    function _fnColumnIndexToVisible( oSettings, iMatch )
    {
        var aiVis = _fnGetColumns( oSettings, 'bVisible' );
        var iPos = $.inArray( iMatch, aiVis );
    
        return iPos !== -1 ? iPos : null;
    }
    
    function _fnVisbleColumns( oSettings )
    {
        return _fnGetColumns( oSettings, 'bVisible' ).length;
    }
    
    function _fnGetColumns( oSettings, sParam )
    {
        var a = [];
    
        $.map( oSettings.aoColumns, function(val, i) {
            if ( val[sParam] ) {
                a.push( i );
            }
        } );
    
        return a;
    }

    function _fnColumnTypes ( settings )
    {
        var columns = settings.aoColumns;
        var data = settings.aoData;
        var types = DataTable.ext.type.detect;
        var i, ien, j, jen, k, ken;
        var col, cell, detectedType, cache;
    
        // For each column, spin over the 
        for ( i=0, ien=columns.length ; i<ien ; i++ ) {
            col = columns[i];
            cache = [];
    
            if ( ! col.sType && col._sManualType ) {
                col.sType = col._sManualType;
            }
            else if ( ! col.sType ) {
                for ( j=0, jen=types.length ; j<jen ; j++ ) {
                    for ( k=0, ken=data.length ; k<ken ; k++ ) {
                        // Use a cache array so we only need to get the type data
                        // from the formatter once (when using multiple detectors)
                        if ( cache[k] === undefined ) {
                            cache[k] = _fnGetCellData( settings, k, i, 'type' );
                        }
    
                        detectedType = types[j]( cache[k], settings );
    
                        // If null, then this type can't apply to this column, so
                        // rather than testing all cells, break out. There is an
                        // exception for the last type which is `html`. We need to
                        // scan all rows since it is possible to mix string and HTML
                        // types
                        if ( ! detectedType && j !== types.length-1 ) {
                            break;
                        }
    
                        // Only a single match is needed for html type since it is
                        // bottom of the pile and very similar to string
                        if ( detectedType === 'html' ) {
                            break;
                        }
                    }
    
                    // Type is valid for all data points in the column - use this
                    // type
                    if ( detectedType ) {
                        col.sType = detectedType;
                        break;
                    }
                }
    
                // Fall back - if no type was detected, always use string
                if ( ! col.sType ) {
                    col.sType = 'string';
                }
            }
        }
    }

    function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
    {
        var i, iLen, j, jLen, k, kLen, def;
        var columns = oSettings.aoColumns;
    
        // Column definitions with aTargets
        if ( aoColDefs )
        {
            
            for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
            {
                def = aoColDefs[i];
    
                
                var aTargets = def.targets !== undefined ?
                    def.targets :
                    def.aTargets;
    
                if ( ! $.isArray( aTargets ) )
                {
                    aTargets = [ aTargets ];
                }
    
                for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
                {
                    if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
                    {
                        
                        while( columns.length <= aTargets[j] )
                        {
                            _fnAddColumn( oSettings );
                        }
    
                        
                        fn( aTargets[j], def );
                    }
                    else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
                    {
                        
                        fn( columns.length+aTargets[j], def );
                    }
                    else if ( typeof aTargets[j] === 'string' )
                    {
                        
                        for ( k=0, kLen=columns.length ; k<kLen ; k++ )
                        {
                            if ( aTargets[j] == "_all" ||
                                 $(columns[k].nTh).hasClass( aTargets[j] ) )
                            {
                                fn( k, def );
                            }
                        }
                    }
                }
            }
        }
    
        // Statically defined columns array
        if ( aoCols )
        {
            for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
            {
                fn( i, aoCols[i] );
            }
        }
    }

    function _fnAddData ( oSettings, aDataIn, nTr, anTds )
    {
        
        var iRow = oSettings.aoData.length;
        var oData = $.extend( true, {}, DataTable.models.oRow, {
            src: nTr ? 'dom' : 'data',
            idx: iRow
        } );
    
        oData._aData = aDataIn;
        oSettings.aoData.push( oData );
    
        
        var nTd, sThisType;
        var columns = oSettings.aoColumns;
    
        // Invalidate the column types as the new data needs to be revalidated
        for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
        {
            columns[i].sType = null;
        }
    
        
        oSettings.aiDisplayMaster.push( iRow );
    
        var id = oSettings.rowIdFn( aDataIn );
        if ( id !== undefined ) {
            oSettings.aIds[ id ] = oData;
        }
    
        
        if ( nTr || ! oSettings.oFeatures.bDeferRender )
        {
            _fnCreateTr( oSettings, iRow, nTr, anTds );
        }
    
        return iRow;
    }
    
    function _fnAddTr( settings, trs )
    {
        var row;
    
        // Allow an individual node to be passed in
        if ( ! (trs instanceof $) ) {
            trs = $(trs);
        }
    
        return trs.map( function (i, el) {
            row = _fnGetRowElements( settings, el );
            return _fnAddData( settings, row.data, el, row.cells );
        } );
    }

    function _fnNodeToDataIndex( oSettings, n )
    {
        return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
    }

    function _fnNodeToColumnIndex( oSettings, iRow, n )
    {
        return $.inArray( n, oSettings.aoData[ iRow ].anCells );
    }
    
    function _fnGetCellData( settings, rowIdx, colIdx, type )
    {
        var draw           = settings.iDraw;
        var col            = settings.aoColumns[colIdx];
        var rowData        = settings.aoData[rowIdx]._aData;
        var defaultContent = col.sDefaultContent;
        var cellData       = col.fnGetData( rowData, type, {
            settings: settings,
            row:      rowIdx,
            col:      colIdx
        } );
    
        if ( cellData === undefined ) {
            if ( settings.iDrawError != draw && defaultContent === null ) {
                _fnLog( settings, 0, "Requested unknown parameter "+
                    (typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
                    " for row "+rowIdx+", column "+colIdx, 4 );
                settings.iDrawError = draw;
            }
            return defaultContent;
        }
    
        
        if ( (cellData === rowData || cellData === null) && defaultContent !== null ) {
            cellData = defaultContent;
        }
        else if ( typeof cellData === 'function' ) {
            // If the data source is a function, then we run it and use the return,
            // executing in the scope of the data object (for instances)
            return cellData.call( rowData );
        }
    
        if ( cellData === null && type == 'display' ) {
            return '';
        }
        return cellData;
    }

    function _fnSetCellData( settings, rowIdx, colIdx, val )
    {
        var col     = settings.aoColumns[colIdx];
        var rowData = settings.aoData[rowIdx]._aData;
    
        col.fnSetData( rowData, val, {
            settings: settings,
            row:      rowIdx,
            col:      colIdx
        }  );
    }
    
    
    // Private variable that is used to match action syntax in the data property object
    var __reArray = /\[.*?\]$/;
    var __reFn = /\(\)$/;

    function _fnSplitObjNotation( str )
    {
        return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
            return s.replace(/\\./g, '.');
        } );
    }

    function _fnGetObjectDataFn( mSource )
    {
        if ( $.isPlainObject( mSource ) )
        {
            
            var o = {};
            $.each( mSource, function (key, val) {
                if ( val ) {
                    o[key] = _fnGetObjectDataFn( val );
                }
            } );
    
            return function (data, type, row, meta) {
                var t = o[type] || o._;
                return t !== undefined ?
                    t(data, type, row, meta) :
                    data;
            };
        }
        else if ( mSource === null )
        {
            
            return function (data) { // type, row and meta also passed, but not used
                return data;
            };
        }
        else if ( typeof mSource === 'function' )
        {
            return function (data, type, row, meta) {
                return mSource( data, type, row, meta );
            };
        }
        else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
                  mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
        {
            
            var fetchData = function (data, type, src) {
                var arrayNotation, funcNotation, out, innerSrc;
    
                if ( src !== "" )
                {
                    var a = _fnSplitObjNotation( src );
    
                    for ( var i=0, iLen=a.length ; i<iLen ; i++ )
                    {
                        // Check if we are dealing with special notation
                        arrayNotation = a[i].match(__reArray);
                        funcNotation = a[i].match(__reFn);
    
                        if ( arrayNotation )
                        {
                            // Array notation
                            a[i] = a[i].replace(__reArray, '');
    
                            // Condition allows simply [] to be passed in
                            if ( a[i] !== "" ) {
                                data = data[ a[i] ];
                            }
                            out = [];
    
                            // Get the remainder of the nested object to get
                            a.splice( 0, i+1 );
                            innerSrc = a.join('.');
    
                            // Traverse each entry in the array getting the properties requested
                            if ( $.isArray( data ) ) {
                                for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
                                    out.push( fetchData( data[j], type, innerSrc ) );
                                }
                            }
    
                            // If a string is given in between the array notation indicators, that
                            // is used to join the strings together, otherwise an array is returned
                            var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
                            data = (join==="") ? out : out.join(join);
    
                            // The inner call to fetchData has already traversed through the remainder
                            // of the source requested, so we exit from the loop
                            break;
                        }
                        else if ( funcNotation )
                        {
                            // Function call
                            a[i] = a[i].replace(__reFn, '');
                            data = data[ a[i] ]();
                            continue;
                        }
    
                        if ( data === null || data[ a[i] ] === undefined )
                        {
                            return undefined;
                        }
                        data = data[ a[i] ];
                    }
                }
    
                return data;
            };
    
            return function (data, type) { // row and meta also passed, but not used
                return fetchData( data, type, mSource );
            };
        }
        else
        {
            
            return function (data, type) { // row and meta also passed, but not used
                return data[mSource];
            };
        }
    }

    function _fnSetObjectDataFn( mSource )
    {
        if ( $.isPlainObject( mSource ) )
        {
            /* Unlike get, only the underscore (global) option is used for for
             * setting data since we don't know the type here. This is why an object
             * option is not documented for `mData` (which is read/write), but it is
             * for `mRender` which is read only.
             */
            return _fnSetObjectDataFn( mSource._ );
        }
        else if ( mSource === null )
        {
            
            return function () {};
        }
        else if ( typeof mSource === 'function' )
        {
            return function (data, val, meta) {
                mSource( data, 'set', val, meta );
            };
        }
        else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
                  mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
        {
            
            var setData = function (data, val, src) {
                var a = _fnSplitObjNotation( src ), b;
                var aLast = a[a.length-1];
                var arrayNotation, funcNotation, o, innerSrc;
    
                for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
                {
                    // Check if we are dealing with an array notation request
                    arrayNotation = a[i].match(__reArray);
                    funcNotation = a[i].match(__reFn);
    
                    if ( arrayNotation )
                    {
                        a[i] = a[i].replace(__reArray, '');
                        data[ a[i] ] = [];
    
                        // Get the remainder of the nested object to set so we can recurse
                        b = a.slice();
                        b.splice( 0, i+1 );
                        innerSrc = b.join('.');
    
                        // Traverse each entry in the array setting the properties requested
                        if ( $.isArray( val ) )
                        {
                            for ( var j=0, jLen=val.length ; j<jLen ; j++ )
                            {
                                o = {};
                                setData( o, val[j], innerSrc );
                                data[ a[i] ].push( o );
                            }
                        }
                        else
                        {
                            // We've been asked to save data to an array, but it
                            // isn't array data to be saved. Best that can be done
                            // is to just save the value.
                            data[ a[i] ] = val;
                        }
    
                        // The inner call to setData has already traversed through the remainder
                        // of the source and has set the data, thus we can exit here
                        return;
                    }
                    else if ( funcNotation )
                    {
                        // Function call
                        a[i] = a[i].replace(__reFn, '');
                        data = data[ a[i] ]( val );
                    }
    
                    // If the nested object doesn't currently exist - since we are
                    // trying to set the value - create it
                    if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
                    {
                        data[ a[i] ] = {};
                    }
                    data = data[ a[i] ];
                }
    
                // Last item in the input - i.e, the actual set
                if ( aLast.match(__reFn ) )
                {
                    // Function call
                    data = data[ aLast.replace(__reFn, '') ]( val );
                }
                else
                {
                    // If array notation is used, we just want to strip it and use the property name
                    // and assign the value. If it isn't used, then we get the result we want anyway
                    data[ aLast.replace(__reArray, '') ] = val;
                }
            };
    
            return function (data, val) { // meta is also passed in, but not used
                return setData( data, val, mSource );
            };
        }
        else
        {
            
            return function (data, val) { // meta is also passed in, but not used
                data[mSource] = val;
            };
        }
    }
    
    function _fnGetDataMaster ( settings )
    {
        return _pluck( settings.aoData, '_aData' );
    }

    function _fnClearTable( settings )
    {
        settings.aoData.length = 0;
        settings.aiDisplayMaster.length = 0;
        settings.aiDisplay.length = 0;
        settings.aIds = {};
    }

    function _fnDeleteIndex( a, iTarget, splice )
    {
        var iTargetIndex = -1;
    
        for ( var i=0, iLen=a.length ; i<iLen ; i++ )
        {
            if ( a[i] == iTarget )
            {
                iTargetIndex = i;
            }
            else if ( a[i] > iTarget )
            {
                a[i]--;
            }
        }
    
        if ( iTargetIndex != -1 && splice === undefined )
        {
            a.splice( iTargetIndex, 1 );
        }
    }
    
    function _fnInvalidate( settings, rowIdx, src, colIdx )
    {
        var row = settings.aoData[ rowIdx ];
        var i, ien;
        var cellWrite = function ( cell, col ) {
            // This is very frustrating, but in IE if you just write directly
            // to innerHTML, and elements that are overwritten are GC'ed,
            // even if there is a reference to them elsewhere
            while ( cell.childNodes.length ) {
                cell.removeChild( cell.firstChild );
            }
    
            cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
        };
    
        // Are we reading last data from DOM or the data object?
        if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
            // Read the data from the DOM
            row._aData = _fnGetRowElements(
                    settings, row, colIdx, colIdx === undefined ? undefined : row._aData
                )
                .data;
        }
        else {
            // Reading from data object, update the DOM
            var cells = row.anCells;
    
            if ( cells ) {
                if ( colIdx !== undefined ) {
                    cellWrite( cells[colIdx], colIdx );
                }
                else {
                    for ( i=0, ien=cells.length ; i<ien ; i++ ) {
                        cellWrite( cells[i], i );
                    }
                }
            }
        }
    
        // For both row and cell invalidation, the cached data for sorting and
        // filtering is nulled out
        row._aSortData = null;
        row._aFilterData = null;
    
        // Invalidate the type for a specific column (if given) or all columns since
        // the data might have changed
        var cols = settings.aoColumns;
        if ( colIdx !== undefined ) {
            cols[ colIdx ].sType = null;
        }
        else {
            for ( i=0, ien=cols.length ; i<ien ; i++ ) {
                cols[i].sType = null;
            }
    
            // Update DataTables special `DT_*` attributes for the row
            _fnRowAttributes( settings, row );
        }
    }

    function _fnGetRowElements( settings, row, colIdx, d )
    {
        var
            tds = [],
            td = row.firstChild,
            name, col, o, i=0, contents,
            columns = settings.aoColumns,
            objectRead = settings._rowReadObject;
    
        // Allow the data object to be passed in, or construct
        d = d !== undefined ?
            d :
            objectRead ?
                {} :
                [];
    
        var attr = function ( str, td  ) {
            if ( typeof str === 'string' ) {
                var idx = str.indexOf('@');
    
                if ( idx !== -1 ) {
                    var attr = str.substring( idx+1 );
                    var setter = _fnSetObjectDataFn( str );
                    setter( d, td.getAttribute( attr ) );
                }
            }
        };
    
        // Read data from a cell and store into the data object
        var cellProcess = function ( cell ) {
            if ( colIdx === undefined || colIdx === i ) {
                col = columns[i];
                contents = $.trim(cell.innerHTML);
    
                if ( col && col._bAttrSrc ) {
                    var setter = _fnSetObjectDataFn( col.mData._ );
                    setter( d, contents );
    
                    attr( col.mData.sort, cell );
                    attr( col.mData.type, cell );
                    attr( col.mData.filter, cell );
                }
                else {
                    // Depending on the `data` option for the columns the data can
                    // be read to either an object or an array.
                    if ( objectRead ) {
                        if ( ! col._setter ) {
                            // Cache the setter function
                            col._setter = _fnSetObjectDataFn( col.mData );
                        }
                        col._setter( d, contents );
                    }
                    else {
                        d[i] = contents;
                    }
                }
            }
    
            i++;
        };
    
        if ( td ) {
            // `tr` element was passed in
            while ( td ) {
                name = td.nodeName.toUpperCase();
    
                if ( name == "TD" || name == "TH" ) {
                    cellProcess( td );
                    tds.push( td );
                }
    
                td = td.nextSibling;
            }
        }
        else {
            // Existing row object passed in
            tds = row.anCells;
    
            for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
                cellProcess( tds[j] );
            }
        }
    
        // Read the ID from the DOM if present
        var rowNode = row.firstChild ? row : row.nTr;
    
        if ( rowNode ) {
            var id = rowNode.getAttribute( 'id' );
    
            if ( id ) {
                _fnSetObjectDataFn( settings.rowId )( d, id );
            }
        }
    
        return {
            data: d,
            cells: tds
        };
    }

    function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
    {
        var
            row = oSettings.aoData[iRow],
            rowData = row._aData,
            cells = [],
            nTr, nTd, oCol,
            i, iLen;
    
        if ( row.nTr === null )
        {
            nTr = nTrIn || document.createElement('tr');
    
            row.nTr = nTr;
            row.anCells = cells;
    
            
            nTr._DT_RowIndex = iRow;
    
            
            _fnRowAttributes( oSettings, row );
    
            
            for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
            {
                oCol = oSettings.aoColumns[i];
    
                nTd = nTrIn ? anTds[i] : document.createElement( oCol.sCellType );
                nTd._DT_CellIndex = {
                    row: iRow,
                    column: i
                };
                
                cells.push( nTd );
    
                // Need to create the HTML if new, or if a rendering function is defined
                if ( !nTrIn || oCol.mRender || oCol.mData !== i )
                {
                    nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
                }
    
                
                if ( oCol.sClass )
                {
                    nTd.className += ' '+oCol.sClass;
                }
    
                // Visibility - add or remove as required
                if ( oCol.bVisible && ! nTrIn )
                {
                    nTr.appendChild( nTd );
                }
                else if ( ! oCol.bVisible && nTrIn )
                {
                    nTd.parentNode.removeChild( nTd );
                }
    
                if ( oCol.fnCreatedCell )
                {
                    oCol.fnCreatedCell.call( oSettings.oInstance,
                        nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
                    );
                }
            }
    
            _fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow] );
        }
    
        // Remove once webkit bug 131819 and Chromium bug 365619 have been resolved
        // and deployed
        row.nTr.setAttribute( 'role', 'row' );
    }
    
    function _fnRowAttributes( settings, row )
    {
        var tr = row.nTr;
        var data = row._aData;
    
        if ( tr ) {
            var id = settings.rowIdFn( data );
    
            if ( id ) {
                tr.id = id;
            }
    
            if ( data.DT_RowClass ) {
                // Remove any classes added by DT_RowClass before
                var a = data.DT_RowClass.split(' ');
                row.__rowc = row.__rowc ?
                    _unique( row.__rowc.concat( a ) ) :
                    a;
    
                $(tr)
                    .removeClass( row.__rowc.join(' ') )
                    .addClass( data.DT_RowClass );
            }
    
            if ( data.DT_RowAttr ) {
                $(tr).attr( data.DT_RowAttr );
            }
    
            if ( data.DT_RowData ) {
                $(tr).data( data.DT_RowData );
            }
        }
    }

    function _fnBuildHead( oSettings )
    {
        var i, ien, cell, row, column;
        var thead = oSettings.nTHead;
        var tfoot = oSettings.nTFoot;
        var createHeader = $('th, td', thead).length === 0;
        var classes = oSettings.oClasses;
        var columns = oSettings.aoColumns;
    
        if ( createHeader ) {
            row = $('<tr/>').appendTo( thead );
        }
    
        for ( i=0, ien=columns.length ; i<ien ; i++ ) {
            column = columns[i];
            cell = $( column.nTh ).addClass( column.sClass );
    
            if ( createHeader ) {
                cell.appendTo( row );
            }
    
            // 1.11 move into sorting
            if ( oSettings.oFeatures.bSort ) {
                cell.addClass( column.sSortingClass );
    
                if ( column.bSortable !== false ) {
                    cell
                        .attr( 'tabindex', oSettings.iTabIndex )
                        .attr( 'aria-controls', oSettings.sTableId );
    
                    _fnSortAttachListener( oSettings, column.nTh, i );
                }
            }
    
            if ( column.sTitle != cell[0].innerHTML ) {
                cell.html( column.sTitle );
            }
    
            _fnRenderer( oSettings, 'header' )(
                oSettings, cell, column, classes
            );
        }
    
        if ( createHeader ) {
            _fnDetectHeader( oSettings.aoHeader, thead );
        }
        
        
        $(thead).find('>tr').attr('role', 'row');
    
        
        $(thead).find('>tr>th, >tr>td').addClass( classes.sHeaderTH );
        $(tfoot).find('>tr>th, >tr>td').addClass( classes.sFooterTH );
    
        // Cache the footer cells. Note that we only take the cells from the first
        // row in the footer. If there is more than one row the user wants to
        // interact with, they need to use the table().foot() method. Note also this
        // allows cells to be used for multiple columns using colspan
        if ( tfoot !== null ) {
            var cells = oSettings.aoFooter[0];
    
            for ( i=0, ien=cells.length ; i<ien ; i++ ) {
                column = columns[i];
                column.nTf = cells[i].cell;
    
                if ( column.sClass ) {
                    $(column.nTf).addClass( column.sClass );
                }
            }
        }
    }

    function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
    {
        var i, iLen, j, jLen, k, kLen, n, nLocalTr;
        var aoLocal = [];
        var aApplied = [];
        var iColumns = oSettings.aoColumns.length;
        var iRowspan, iColspan;
    
        if ( ! aoSource )
        {
            return;
        }
    
        if (  bIncludeHidden === undefined )
        {
            bIncludeHidden = false;
        }
    
        
        for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
        {
            aoLocal[i] = aoSource[i].slice();
            aoLocal[i].nTr = aoSource[i].nTr;
    
            
            for ( j=iColumns-1 ; j>=0 ; j-- )
            {
                if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
                {
                    aoLocal[i].splice( j, 1 );
                }
            }
    
            
            aApplied.push( [] );
        }
    
        for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
        {
            nLocalTr = aoLocal[i].nTr;
    
            
            if ( nLocalTr )
            {
                while( (n = nLocalTr.firstChild) )
                {
                    nLocalTr.removeChild( n );
                }
            }
    
            for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
            {
                iRowspan = 1;
                iColspan = 1;
    
                /* Check to see if there is already a cell (row/colspan) covering our target
                 * insert point. If there is, then there is nothing to do.
                 */
                if ( aApplied[i][j] === undefined )
                {
                    nLocalTr.appendChild( aoLocal[i][j].cell );
                    aApplied[i][j] = 1;
    
                    
                    while ( aoLocal[i+iRowspan] !== undefined &&
                            aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
                    {
                        aApplied[i+iRowspan][j] = 1;
                        iRowspan++;
                    }
    
                    
                    while ( aoLocal[i][j+iColspan] !== undefined &&
                            aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
                    {
                        
                        for ( k=0 ; k<iRowspan ; k++ )
                        {
                            aApplied[i+k][j+iColspan] = 1;
                        }
                        iColspan++;
                    }
    
                    
                    $(aoLocal[i][j].cell)
                        .attr('rowspan', iRowspan)
                        .attr('colspan', iColspan);
                }
            }
        }
    }
    
    function _fnDraw( oSettings )
    {
        
        var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
        if ( $.inArray( false, aPreDraw ) !== -1 )
        {
            _fnProcessingDisplay( oSettings, false );
            return;
        }
    
        var i, iLen, n;
        var anRows = [];
        var iRowCount = 0;
        var asStripeClasses = oSettings.asStripeClasses;
        var iStripes = asStripeClasses.length;
        var iOpenRows = oSettings.aoOpenRows.length;
        var oLang = oSettings.oLanguage;
        var iInitDisplayStart = oSettings.iInitDisplayStart;
        var bServerSide = _fnDataSource( oSettings ) == 'ssp';
        var aiDisplay = oSettings.aiDisplay;
    
        oSettings.bDrawing = true;
    
        
        if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
        {
            oSettings._iDisplayStart = bServerSide ?
                iInitDisplayStart :
                iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
                    0 :
                    iInitDisplayStart;
    
            oSettings.iInitDisplayStart = -1;
        }
    
        var iDisplayStart = oSettings._iDisplayStart;
        var iDisplayEnd = oSettings.fnDisplayEnd();
    
        
        if ( oSettings.bDeferLoading )
        {
            oSettings.bDeferLoading = false;
            oSettings.iDraw++;
            _fnProcessingDisplay( oSettings, false );
        }
        else if ( !bServerSide )
        {
            oSettings.iDraw++;
        }
        else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
        {
            return;
        }
    
        if ( aiDisplay.length !== 0 )
        {
            var iStart = bServerSide ? 0 : iDisplayStart;
            var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
    
            for ( var j=iStart ; j<iEnd ; j++ )
            {
                var iDataIndex = aiDisplay[j];
                var aoData = oSettings.aoData[ iDataIndex ];
                if ( aoData.nTr === null )
                {
                    _fnCreateTr( oSettings, iDataIndex );
                }
    
                var nRow = aoData.nTr;
    
                
                if ( iStripes !== 0 )
                {
                    var sStripe = asStripeClasses[ iRowCount % iStripes ];
                    if ( aoData._sRowStripe != sStripe )
                    {
                        $(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
                        aoData._sRowStripe = sStripe;
                    }
                }
    
                // Row callback functions - might want to manipulate the row
                // iRowCount and j are not currently documented. Are they at all
                // useful?
                _fnCallbackFire( oSettings, 'aoRowCallback', null,
                    [nRow, aoData._aData, iRowCount, j] );
    
                anRows.push( nRow );
                iRowCount++;
            }
        }
        else
        {
            
            var sZero = oLang.sZeroRecords;
            if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
            {
                sZero = oLang.sLoadingRecords;
            }
            else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
            {
                sZero = oLang.sEmptyTable;
            }
    
            anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
                .append( $('<td />', {
                    'valign':  'top',
                    'colSpan': _fnVisbleColumns( oSettings ),
                    'class':   oSettings.oClasses.sRowEmpty
                } ).html( sZero ) )[0];
        }
    
        
        _fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
            _fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
    
        _fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
            _fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
    
        var body = $(oSettings.nTBody);
    
        body.children().detach();
        body.append( $(anRows) );
    
        
        _fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
    
        
        oSettings.bSorted = false;
        oSettings.bFiltered = false;
        oSettings.bDrawing = false;
    }

    function _fnReDraw( settings, holdPosition )
    {
        var
            features = settings.oFeatures,
            sort     = features.bSort,
            filter   = features.bFilter;
    
        if ( sort ) {
            _fnSort( settings );
        }
    
        if ( filter ) {
            _fnFilterComplete( settings, settings.oPreviousSearch );
        }
        else {
            // No filtering, so we want to just use the display master
            settings.aiDisplay = settings.aiDisplayMaster.slice();
        }
    
        if ( holdPosition !== true ) {
            settings._iDisplayStart = 0;
        }
    
        // Let any modules know about the draw hold position state (used by
        // scrolling internally)
        settings._drawHold = holdPosition;
    
        _fnDraw( settings );
    
        settings._drawHold = false;
    }

    function _fnAddOptionsHtml ( oSettings )
    {
        var classes = oSettings.oClasses;
        var table = $(oSettings.nTable);
        var holding = $('<div/>').insertBefore( table ); // Holding element for speed
        var features = oSettings.oFeatures;
    
        // All DataTables are wrapped in a div
        var insert = $('<div/>', {
            id:      oSettings.sTableId+'_wrapper',
            'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
        } );
    
        oSettings.nHolding = holding[0];
        oSettings.nTableWrapper = insert[0];
        oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
    
        
        var aDom = oSettings.sDom.split('');
        var featureNode, cOption, nNewNode, cNext, sAttr, j;
        for ( var i=0 ; i<aDom.length ; i++ )
        {
            featureNode = null;
            cOption = aDom[i];
    
            if ( cOption == '<' )
            {
                
                nNewNode = $('<div/>')[0];
    
                
                cNext = aDom[i+1];
                if ( cNext == "'" || cNext == '"' )
                {
                    sAttr = "";
                    j = 2;
                    while ( aDom[i+j] != cNext )
                    {
                        sAttr += aDom[i+j];
                        j++;
                    }
    
                    
                    if ( sAttr == "H" )
                    {
                        sAttr = classes.sJUIHeader;
                    }
                    else if ( sAttr == "F" )
                    {
                        sAttr = classes.sJUIFooter;
                    }
    
                    
                    if ( sAttr.indexOf('.') != -1 )
                    {
                        var aSplit = sAttr.split('.');
                        nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
                        nNewNode.className = aSplit[1];
                    }
                    else if ( sAttr.charAt(0) == "#" )
                    {
                        nNewNode.id = sAttr.substr(1, sAttr.length-1);
                    }
                    else
                    {
                        nNewNode.className = sAttr;
                    }
    
                    i += j; 
                }
    
                insert.append( nNewNode );
                insert = $(nNewNode);
            }
            else if ( cOption == '>' )
            {
                
                insert = insert.parent();
            }
            // @todo Move options into their own plugins?
            else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
            {
                
                featureNode = _fnFeatureHtmlLength( oSettings );
            }
            else if ( cOption == 'f' && features.bFilter )
            {
                
                featureNode = _fnFeatureHtmlFilter( oSettings );
            }
            else if ( cOption == 'r' && features.bProcessing )
            {
                
                featureNode = _fnFeatureHtmlProcessing( oSettings );
            }
            else if ( cOption == 't' )
            {
                
                featureNode = _fnFeatureHtmlTable( oSettings );
            }
            else if ( cOption ==  'i' && features.bInfo )
            {
                
                featureNode = _fnFeatureHtmlInfo( oSettings );
            }
            else if ( cOption == 'p' && features.bPaginate )
            {
                
                featureNode = _fnFeatureHtmlPaginate( oSettings );
            }
            else if ( DataTable.ext.feature.length !== 0 )
            {
                
                var aoFeatures = DataTable.ext.feature;
                for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
                {
                    if ( cOption == aoFeatures[k].cFeature )
                    {
                        featureNode = aoFeatures[k].fnInit( oSettings );
                        break;
                    }
                }
            }
    
            
            if ( featureNode )
            {
                var aanFeatures = oSettings.aanFeatures;
    
                if ( ! aanFeatures[cOption] )
                {
                    aanFeatures[cOption] = [];
                }
    
                aanFeatures[cOption].push( featureNode );
                insert.append( featureNode );
            }
        }
    
        
        holding.replaceWith( insert );
        oSettings.nHolding = null;
    }

    function _fnDetectHeader ( aLayout, nThead )
    {
        var nTrs = $(nThead).children('tr');
        var nTr, nCell;
        var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
        var bUnique;
        var fnShiftCol = function ( a, i, j ) {
            var k = a[i];
                    while ( k[j] ) {
                j++;
            }
            return j;
        };
    
        aLayout.splice( 0, aLayout.length );
    
        
        for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
        {
            aLayout.push( [] );
        }
    
        
        for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
        {
            nTr = nTrs[i];
            iColumn = 0;
    
            
            nCell = nTr.firstChild;
            while ( nCell ) {
                if ( nCell.nodeName.toUpperCase() == "TD" ||
                     nCell.nodeName.toUpperCase() == "TH" )
                {
                    
                    iColspan = nCell.getAttribute('colspan') * 1;
                    iRowspan = nCell.getAttribute('rowspan') * 1;
                    iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
                    iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
    
                    
                    iColShifted = fnShiftCol( aLayout, i, iColumn );
    
                    
                    bUnique = iColspan === 1 ? true : false;
    
                    
                    for ( l=0 ; l<iColspan ; l++ )
                    {
                        for ( k=0 ; k<iRowspan ; k++ )
                        {
                            aLayout[i+k][iColShifted+l] = {
                                "cell": nCell,
                                "unique": bUnique
                            };
                            aLayout[i+k].nTr = nTr;
                        }
                    }
                }
                nCell = nCell.nextSibling;
            }
        }
    }
    
    function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
    {
        var aReturn = [];
        if ( !aLayout )
        {
            aLayout = oSettings.aoHeader;
            if ( nHeader )
            {
                aLayout = [];
                _fnDetectHeader( aLayout, nHeader );
            }
        }
    
        for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
        {
            for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
            {
                if ( aLayout[i][j].unique &&
                     (!aReturn[j] || !oSettings.bSortCellsTop) )
                {
                    aReturn[j] = aLayout[i][j].cell;
                }
            }
        }
    
        return aReturn;
    }

    function _fnBuildAjax( oSettings, data, fn )
    {
        // Compatibility with 1.9-, allow fnServerData and event to manipulate
        _fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
    
        // Convert to object based for 1.10+ if using the old array scheme which can
        // come from server-side processing or serverParams
        if ( data && $.isArray(data) ) {
            var tmp = {};
            var rbracket = /(.*?)\[\]$/;
    
            $.each( data, function (key, val) {
                var match = val.name.match(rbracket);
    
                if ( match ) {
                    // Support for arrays
                    var name = match[0];
    
                    if ( ! tmp[ name ] ) {
                        tmp[ name ] = [];
                    }
                    tmp[ name ].push( val.value );
                }
                else {
                    tmp[val.name] = val.value;
                }
            } );
            data = tmp;
        }
    
        var ajaxData;
        var ajax = oSettings.ajax;
        var instance = oSettings.oInstance;
        var callback = function ( json ) {
            _fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
            fn( json );
        };
    
        if ( $.isPlainObject( ajax ) && ajax.data )
        {
            ajaxData = ajax.data;
    
            var newData = $.isFunction( ajaxData ) ?
                ajaxData( data, oSettings ) :  // fn can manipulate data or return
                ajaxData;                      // an object object or array to merge
    
            // If the function returned something, use that alone
            data = $.isFunction( ajaxData ) && newData ?
                newData :
                $.extend( true, data, newData );
    
            // Remove the data property as we've resolved it already and don't want
            // jQuery to do it again (it is restored at the end of the function)
            delete ajax.data;
        }
    
        var baseAjax = {
            "data": data,
            "success": function (json) {
                var error = json.error || json.sError;
                if ( error ) {
                    _fnLog( oSettings, 0, error );
                }
    
                oSettings.json = json;
                callback( json );
            },
            "dataType": "json",
            "cache": false,
            "type": oSettings.sServerMethod,
            "error": function (xhr, error, thrown) {
                var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
    
                if ( $.inArray( true, ret ) === -1 ) {
                    if ( error == "parsererror" ) {
                        _fnLog( oSettings, 0, 'Invalid JSON response', 1 );
                    }
                    else if ( xhr.readyState === 4 ) {
                        _fnLog( oSettings, 0, 'Ajax error', 7 );
                    }
                }
    
                _fnProcessingDisplay( oSettings, false );
            }
        };
    
        // Store the data submitted for the API
        oSettings.oAjaxData = data;
    
        // Allow plug-ins and external processes to modify the data
        _fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
    
        if ( oSettings.fnServerData )
        {
            // DataTables 1.9- compatibility
            oSettings.fnServerData.call( instance,
                oSettings.sAjaxSource,
                $.map( data, function (val, key) { // Need to convert back to 1.9 trad format
                    return { name: key, value: val };
                } ),
                callback,
                oSettings
            );
        }
        else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
        {
            // DataTables 1.9- compatibility
            oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
                url: ajax || oSettings.sAjaxSource
            } ) );
        }
        else if ( $.isFunction( ajax ) )
        {
            // Is a function - let the caller define what needs to be done
            oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
        }
        else
        {
            // Object to extend the base settings
            oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
    
            // Restore for next time around
            ajax.data = ajaxData;
        }
    }

    function _fnAjaxUpdate( settings )
    {
        if ( settings.bAjaxDataGet ) {
            settings.iDraw++;
            _fnProcessingDisplay( settings, true );
    
            _fnBuildAjax(
                settings,
                _fnAjaxParameters( settings ),
                function(json) {
                    _fnAjaxUpdateDraw( settings, json );
                }
            );
    
            return false;
        }
        return true;
    }
    
    function _fnAjaxParameters( settings )
    {
        var
            columns = settings.aoColumns,
            columnCount = columns.length,
            features = settings.oFeatures,
            preSearch = settings.oPreviousSearch,
            preColSearch = settings.aoPreSearchCols,
            i, data = [], dataProp, column, columnSearch,
            sort = _fnSortFlatten( settings ),
            displayStart = settings._iDisplayStart,
            displayLength = features.bPaginate !== false ?
                settings._iDisplayLength :
                -1;
    
        var param = function ( name, value ) {
            data.push( { 'name': name, 'value': value } );
        };
    
        // DataTables 1.9- compatible method
        param( 'sEcho',          settings.iDraw );
        param( 'iColumns',       columnCount );
        param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
        param( 'iDisplayStart',  displayStart );
        param( 'iDisplayLength', displayLength );
    
        // DataTables 1.10+ method
        var d = {
            draw:    settings.iDraw,
            columns: [],
            order:   [],
            start:   displayStart,
            length:  displayLength,
            search:  {
                value: preSearch.sSearch,
                regex: preSearch.bRegex
            }
        };
    
        for ( i=0 ; i<columnCount ; i++ ) {
            column = columns[i];
            columnSearch = preColSearch[i];
            dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
    
            d.columns.push( {
                data:       dataProp,
                name:       column.sName,
                searchable: column.bSearchable,
                orderable:  column.bSortable,
                search:     {
                    value: columnSearch.sSearch,
                    regex: columnSearch.bRegex
                }
            } );
    
            param( "mDataProp_"+i, dataProp );
    
            if ( features.bFilter ) {
                param( 'sSearch_'+i,     columnSearch.sSearch );
                param( 'bRegex_'+i,      columnSearch.bRegex );
                param( 'bSearchable_'+i, column.bSearchable );
            }
    
            if ( features.bSort ) {
                param( 'bSortable_'+i, column.bSortable );
            }
        }
    
        if ( features.bFilter ) {
            param( 'sSearch', preSearch.sSearch );
            param( 'bRegex', preSearch.bRegex );
        }
    
        if ( features.bSort ) {
            $.each( sort, function ( i, val ) {
                d.order.push( { column: val.col, dir: val.dir } );
    
                param( 'iSortCol_'+i, val.col );
                param( 'sSortDir_'+i, val.dir );
            } );
    
            param( 'iSortingCols', sort.length );
        }
    
        // If the legacy.ajax parameter is null, then we automatically decide which
        // form to use, based on sAjaxSource
        var legacy = DataTable.ext.legacy.ajax;
        if ( legacy === null ) {
            return settings.sAjaxSource ? data : d;
        }
    
        // Otherwise, if legacy has been specified then we use that to decide on the
        // form
        return legacy ? data : d;
    }

    function _fnAjaxUpdateDraw ( settings, json )
    {
        // v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
        // Support both
        var compat = function ( old, modern ) {
            return json[old] !== undefined ? json[old] : json[modern];
        };
    
        var data = _fnAjaxDataSrc( settings, json );
        var draw            = compat( 'sEcho',                'draw' );
        var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
        var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
    
        if ( draw ) {
            // Protect against out of sequence returns
            if ( draw*1 < settings.iDraw ) {
                return;
            }
            settings.iDraw = draw * 1;
        }
    
        _fnClearTable( settings );
        settings._iRecordsTotal   = parseInt(recordsTotal, 10);
        settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
    
        for ( var i=0, ien=data.length ; i<ien ; i++ ) {
            _fnAddData( settings, data[i] );
        }
        settings.aiDisplay = settings.aiDisplayMaster.slice();
    
        settings.bAjaxDataGet = false;
        _fnDraw( settings );
    
        if ( ! settings._bInitComplete ) {
            _fnInitComplete( settings, json );
        }
    
        settings.bAjaxDataGet = true;
        _fnProcessingDisplay( settings, false );
    }

    function _fnAjaxDataSrc ( oSettings, json )
    {
        var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
            oSettings.ajax.dataSrc :
            oSettings.sAjaxDataProp; // Compatibility with 1.9-.
    
        // Compatibility with 1.9-. In order to read from aaData, check if the
        // default has been changed, if not, check for aaData
        if ( dataSrc === 'data' ) {
            return json.aaData || json[dataSrc];
        }
    
        return dataSrc !== "" ?
            _fnGetObjectDataFn( dataSrc )( json ) :
            json;
    }

    function _fnFeatureHtmlFilter ( settings )
    {
        var classes = settings.oClasses;
        var tableId = settings.sTableId;
        var language = settings.oLanguage;
        var previousSearch = settings.oPreviousSearch;
        var features = settings.aanFeatures;
        var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
    
        var str = language.sSearch;
        str = str.match(/_INPUT_/) ?
            str.replace('_INPUT_', input) :
            str+input;
    
        var filter = $('<div/>', {
                'id': ! features.f ? tableId+'_filter' : null,
                'class': classes.sFilter
            } )
            .append( $('<label/>' ).append( str ) );
    
        var searchFn = function() {
            
            var n = features.f;
            var val = !this.value ? "" : this.value; // mental IE8 fix :-(
    
            
            if ( val != previousSearch.sSearch ) {
                _fnFilterComplete( settings, {
                    "sSearch": val,
                    "bRegex": previousSearch.bRegex,
                    "bSmart": previousSearch.bSmart ,
                    "bCaseInsensitive": previousSearch.bCaseInsensitive
                } );
    
                // Need to redraw, without resorting
                settings._iDisplayStart = 0;
                _fnDraw( settings );
            }
        };
    
        var searchDelay = settings.searchDelay !== null ?
            settings.searchDelay :
            _fnDataSource( settings ) === 'ssp' ?
                400 :
                0;
    
        var jqFilter = $('input', filter)
            .val( previousSearch.sSearch )
            .attr( 'placeholder', language.sSearchPlaceholder )
            .bind(
                'keyup.DT search.DT input.DT paste.DT cut.DT',
                searchDelay ?
                    _fnThrottle( searchFn, searchDelay ) :
                    searchFn
            )
            .bind( 'keypress.DT', function(e) {
                
                if ( e.keyCode == 13 ) {
                    return false;
                }
            } )
            .attr('aria-controls', tableId);
    
        // Update the input elements whenever the table is filtered
        $(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
            if ( settings === s ) {
                // IE9 throws an 'unknown error' if document.activeElement is used
                // inside an iframe or frame...
                try {
                    if ( jqFilter[0] !== document.activeElement ) {
                        jqFilter.val( previousSearch.sSearch );
                    }
                }
                catch ( e ) {}
            }
        } );
    
        return filter[0];
    }

    function _fnFilterComplete ( oSettings, oInput, iForce )
    {
        var oPrevSearch = oSettings.oPreviousSearch;
        var aoPrevSearch = oSettings.aoPreSearchCols;
        var fnSaveFilter = function ( oFilter ) {
            
            oPrevSearch.sSearch = oFilter.sSearch;
            oPrevSearch.bRegex = oFilter.bRegex;
            oPrevSearch.bSmart = oFilter.bSmart;
            oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
        };
        var fnRegex = function ( o ) {
            // Backwards compatibility with the bEscapeRegex option
            return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
        };
    
        // Resolve any column types that are unknown due to addition or invalidation
        // @todo As per sort - can this be moved into an event handler?
        _fnColumnTypes( oSettings );
    
        
        if ( _fnDataSource( oSettings ) != 'ssp' )
        {
            
            _fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
            fnSaveFilter( oInput );
    
            
            for ( var i=0 ; i<aoPrevSearch.length ; i++ )
            {
                _fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
                    aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
            }
    
            
            _fnFilterCustom( oSettings );
        }
        else
        {
            fnSaveFilter( oInput );
        }
    
        
        oSettings.bFiltered = true;
        _fnCallbackFire( oSettings, null, 'search', [oSettings] );
    }

    function _fnFilterCustom( settings )
    {
        var filters = DataTable.ext.search;
        var displayRows = settings.aiDisplay;
        var row, rowIdx;
    
        for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
            var rows = [];
    
            // Loop over each row and see if it should be included
            for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
                rowIdx = displayRows[ j ];
                row = settings.aoData[ rowIdx ];
    
                if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
                    rows.push( rowIdx );
                }
            }
    
            // So the array reference doesn't break set the results into the
            // existing array
            displayRows.length = 0;
            $.merge( displayRows, rows );
        }
    }

    function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
    {
        if ( searchStr === '' ) {
            return;
        }
    
        var data;
        var display = settings.aiDisplay;
        var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
    
        for ( var i=display.length-1 ; i>=0 ; i-- ) {
            data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
    
            if ( ! rpSearch.test( data ) ) {
                display.splice( i, 1 );
            }
        }
    }
    
    function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
    {
        var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
        var prevSearch = settings.oPreviousSearch.sSearch;
        var displayMaster = settings.aiDisplayMaster;
        var display, invalidated, i;
    
        // Need to take account of custom filtering functions - always filter
        if ( DataTable.ext.search.length !== 0 ) {
            force = true;
        }
    
        // Check if any of the rows were invalidated
        invalidated = _fnFilterData( settings );
    
        // If the input is blank - we just want the full data set
        if ( input.length <= 0 ) {
            settings.aiDisplay = displayMaster.slice();
        }
        else {
            // New search - start from the master array
            if ( invalidated ||
                 force ||
                 prevSearch.length > input.length ||
                 input.indexOf(prevSearch) !== 0 ||
                 settings.bSorted // On resort, the display master needs to be
                                  // re-filtered since indexes will have changed
            ) {
                settings.aiDisplay = displayMaster.slice();
            }
    
            // Search the display array
            display = settings.aiDisplay;
    
            for ( i=display.length-1 ; i>=0 ; i-- ) {
                if ( ! rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
                    display.splice( i, 1 );
                }
            }
        }
    }

    function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
    {
        search = regex ?
            search :
            _fnEscapeRegex( search );
        
        if ( smart ) {
            
            var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
                if ( word.charAt(0) === '"' ) {
                    var m = word.match( /^"(.*)"$/ );
                    word = m ? m[1] : word;
                }
    
                return word.replace('"', '');
            } );
    
            search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
        }
    
        return new RegExp( search, caseInsensitive ? 'i' : '' );
    }

    function _fnEscapeRegex ( sVal )
    {
        return sVal.replace( _re_escape_regex, '\\$1' );
    }
    
    
    
    var __filter_div = $('<div>')[0];
    var __filter_div_textContent = __filter_div.textContent !== undefined;
    
    // Update the filtering data for each row if needed (by invalidation or first run)
    function _fnFilterData ( settings )
    {
        var columns = settings.aoColumns;
        var column;
        var i, j, ien, jen, filterData, cellData, row;
        var fomatters = DataTable.ext.type.search;
        var wasInvalidated = false;
    
        for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
            row = settings.aoData[i];
    
            if ( ! row._aFilterData ) {
                filterData = [];
    
                for ( j=0, jen=columns.length ; j<jen ; j++ ) {
                    column = columns[j];
    
                    if ( column.bSearchable ) {
                        cellData = _fnGetCellData( settings, i, j, 'filter' );
    
                        if ( fomatters[ column.sType ] ) {
                            cellData = fomatters[ column.sType ]( cellData );
                        }
    
                        // Search in DataTables 1.10 is string based. In 1.11 this
                        // should be altered to also allow strict type checking.
                        if ( cellData === null ) {
                            cellData = '';
                        }
    
                        if ( typeof cellData !== 'string' && cellData.toString ) {
                            cellData = cellData.toString();
                        }
                    }
                    else {
                        cellData = '';
                    }
    
                    // If it looks like there is an HTML entity in the string,
                    // attempt to decode it so sorting works as expected. Note that
                    // we could use a single line of jQuery to do this, but the DOM
                    // method used here is much faster http://jsperf.com/html-decode
                    if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
                        __filter_div.innerHTML = cellData;
                        cellData = __filter_div_textContent ?
                            __filter_div.textContent :
                            __filter_div.innerText;
                    }
    
                    if ( cellData.replace ) {
                        cellData = cellData.replace(/[\r\n]/g, '');
                    }
    
                    filterData.push( cellData );
                }
    
                row._aFilterData = filterData;
                row._sFilterRow = filterData.join('  ');
                wasInvalidated = true;
            }
        }
    
        return wasInvalidated;
    }

    function _fnSearchToCamel ( obj )
    {
        return {
            search:          obj.sSearch,
            smart:           obj.bSmart,
            regex:           obj.bRegex,
            caseInsensitive: obj.bCaseInsensitive
        };
    }

    function _fnSearchToHung ( obj )
    {
        return {
            sSearch:          obj.search,
            bSmart:           obj.smart,
            bRegex:           obj.regex,
            bCaseInsensitive: obj.caseInsensitive
        };
    }

    function _fnFeatureHtmlInfo ( settings )
    {
        var
            tid = settings.sTableId,
            nodes = settings.aanFeatures.i,
            n = $('<div/>', {
                'class': settings.oClasses.sInfo,
                'id': ! nodes ? tid+'_info' : null
            } );
    
        if ( ! nodes ) {
            // Update display on each draw
            settings.aoDrawCallback.push( {
                "fn": _fnUpdateInfo,
                "sName": "information"
            } );
    
            n
                .attr( 'role', 'status' )
                .attr( 'aria-live', 'polite' );
    
            // Table is described by our info div
            $(settings.nTable).attr( 'aria-describedby', tid+'_info' );
        }
    
        return n[0];
    }

    function _fnUpdateInfo ( settings )
    {
        
        var nodes = settings.aanFeatures.i;
        if ( nodes.length === 0 ) {
            return;
        }
    
        var
            lang  = settings.oLanguage,
            start = settings._iDisplayStart+1,
            end   = settings.fnDisplayEnd(),
            max   = settings.fnRecordsTotal(),
            total = settings.fnRecordsDisplay(),
            out   = total ?
                lang.sInfo :
                lang.sInfoEmpty;
    
        if ( total !== max ) {
            
            out += ' ' + lang.sInfoFiltered;
        }
    
        // Convert the macros
        out += lang.sInfoPostFix;
        out = _fnInfoMacros( settings, out );
    
        var callback = lang.fnInfoCallback;
        if ( callback !== null ) {
            out = callback.call( settings.oInstance,
                settings, start, end, max, total, out
            );
        }
    
        $(nodes).html( out );
    }

    function _fnInfoMacros ( settings, str )
    {
        // When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
        // internally
        var
            formatter  = settings.fnFormatNumber,
            start      = settings._iDisplayStart+1,
            len        = settings._iDisplayLength,
            vis        = settings.fnRecordsDisplay(),
            all        = len === -1;
    
        return str.
            replace(/_START_/g, formatter.call( settings, start ) ).
            replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
            replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
            replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
            replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
            replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
    }
    
    function _fnInitialise ( settings )
    {
        var i, iLen, iAjaxStart=settings.iInitDisplayStart;
        var columns = settings.aoColumns, column;
        var features = settings.oFeatures;
        var deferLoading = settings.bDeferLoading; // value modified by the draw
    
        
        if ( ! settings.bInitialised ) {
            setTimeout( function(){ _fnInitialise( settings ); }, 200 );
            return;
        }
    
        
        _fnAddOptionsHtml( settings );
    
        
        _fnBuildHead( settings );
        _fnDrawHead( settings, settings.aoHeader );
        _fnDrawHead( settings, settings.aoFooter );
    
        
        _fnProcessingDisplay( settings, true );
    
        
        if ( features.bAutoWidth ) {
            _fnCalculateColumnWidths( settings );
        }
    
        for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
            column = columns[i];
    
            if ( column.sWidth ) {
                column.nTh.style.width = _fnStringToCss( column.sWidth );
            }
        }
    
        _fnCallbackFire( settings, null, 'preInit', [settings] );
    
        // If there is default sorting required - let's do it. The sort function
        // will do the drawing for us. Otherwise we draw the table regardless of the
        // Ajax source - this allows the table to look initialised for Ajax sourcing
        // data (show 'loading' message possibly)
        _fnReDraw( settings );
    
        // Server-side processing init complete is done by _fnAjaxUpdateDraw
        var dataSrc = _fnDataSource( settings );
        if ( dataSrc != 'ssp' || deferLoading ) {
            // if there is an ajax source load the data
            if ( dataSrc == 'ajax' ) {
                _fnBuildAjax( settings, [], function(json) {
                    var aData = _fnAjaxDataSrc( settings, json );
    
                    // Got the data - add it to the table
                    for ( i=0 ; i<aData.length ; i++ ) {
                        _fnAddData( settings, aData[i] );
                    }
    
                    // Reset the init display for cookie saving. We've already done
                    // a filter, and therefore cleared it before. So we need to make
                    // it appear 'fresh'
                    settings.iInitDisplayStart = iAjaxStart;
    
                    _fnReDraw( settings );
    
                    _fnProcessingDisplay( settings, false );
                    _fnInitComplete( settings, json );
                }, settings );
            }
            else {
                _fnProcessingDisplay( settings, false );
                _fnInitComplete( settings );
            }
        }
    }

    function _fnInitComplete ( settings, json )
    {
        settings._bInitComplete = true;
    
        // When data was added after the initialisation (data or Ajax) we need to
        // calculate the column sizing
        if ( json || settings.oInit.aaData ) {
            _fnAdjustColumnSizing( settings );
        }
    
        _fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
        _fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
    }

    function _fnLengthChange ( settings, val )
    {
        var len = parseInt( val, 10 );
        settings._iDisplayLength = len;
    
        _fnLengthOverflow( settings );
    
        // Fire length change event
        _fnCallbackFire( settings, null, 'length', [settings, len] );
    }

    function _fnFeatureHtmlLength ( settings )
    {
        var
            classes  = settings.oClasses,
            tableId  = settings.sTableId,
            menu     = settings.aLengthMenu,
            d2       = $.isArray( menu[0] ),
            lengths  = d2 ? menu[0] : menu,
            language = d2 ? menu[1] : menu;
    
        var select = $('<select/>', {
            'name':          tableId+'_length',
            'aria-controls': tableId,
            'class':         classes.sLengthSelect
        } );
    
        for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
            select[0][ i ] = new Option( language[i], lengths[i] );
        }
    
        var div = $('<div><label/></div>').addClass( classes.sLength );
        if ( ! settings.aanFeatures.l ) {
            div[0].id = tableId+'_length';
        }
    
        div.children().append(
            settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
        );
    
        // Can't use `select` variable as user might provide their own and the
        // reference is broken by the use of outerHTML
        $('select', div)
            .val( settings._iDisplayLength )
            .bind( 'change.DT', function(e) {
                _fnLengthChange( settings, $(this).val() );
                _fnDraw( settings );
            } );
    
        // Update node value whenever anything changes the table's length
        $(settings.nTable).bind( 'length.dt.DT', function (e, s, len) {
            if ( settings === s ) {
                $('select', div).val( len );
            }
        } );
    
        return div[0];
    }

    function _fnFeatureHtmlPaginate ( settings )
    {
        var
            type   = settings.sPaginationType,
            plugin = DataTable.ext.pager[ type ],
            modern = typeof plugin === 'function',
            redraw = function( settings ) {
                _fnDraw( settings );
            },
            node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
            features = settings.aanFeatures;
    
        if ( ! modern ) {
            plugin.fnInit( settings, node, redraw );
        }
    
        
        if ( ! features.p )
        {
            node.id = settings.sTableId+'_paginate';
    
            settings.aoDrawCallback.push( {
                "fn": function( settings ) {
                    if ( modern ) {
                        var
                            start      = settings._iDisplayStart,
                            len        = settings._iDisplayLength,
                            visRecords = settings.fnRecordsDisplay(),
                            all        = len === -1,
                            page = all ? 0 : Math.ceil( start / len ),
                            pages = all ? 1 : Math.ceil( visRecords / len ),
                            buttons = plugin(page, pages),
                            i, ien;
    
                        for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
                            _fnRenderer( settings, 'pageButton' )(
                                settings, features.p[i], i, buttons, page, pages
                            );
                        }
                    }
                    else {
                        plugin.fnUpdate( settings, redraw );
                    }
                },
                "sName": "pagination"
            } );
        }
    
        return node;
    }

    function _fnPageChange ( settings, action, redraw )
    {
        var
            start     = settings._iDisplayStart,
            len       = settings._iDisplayLength,
            records   = settings.fnRecordsDisplay();
    
        if ( records === 0 || len === -1 )
        {
            start = 0;
        }
        else if ( typeof action === "number" )
        {
            start = action * len;
    
            if ( start > records )
            {
                start = 0;
            }
        }
        else if ( action == "first" )
        {
            start = 0;
        }
        else if ( action == "previous" )
        {
            start = len >= 0 ?
                start - len :
                0;
    
            if ( start < 0 )
            {
              start = 0;
            }
        }
        else if ( action == "next" )
        {
            if ( start + len < records )
            {
                start += len;
            }
        }
        else if ( action == "last" )
        {
            start = Math.floor( (records-1) / len) * len;
        }
        else
        {
            _fnLog( settings, 0, "Unknown paging action: "+action, 5 );
        }
    
        var changed = settings._iDisplayStart !== start;
        settings._iDisplayStart = start;
    
        if ( changed ) {
            _fnCallbackFire( settings, null, 'page', [settings] );
    
            if ( redraw ) {
                _fnDraw( settings );
            }
        }
    
        return changed;
    }

    function _fnFeatureHtmlProcessing ( settings )
    {
        return $('<div/>', {
                'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
                'class': settings.oClasses.sProcessing
            } )
            .html( settings.oLanguage.sProcessing )
            .insertBefore( settings.nTable )[0];
    }

    function _fnProcessingDisplay ( settings, show )
    {
        if ( settings.oFeatures.bProcessing ) {
            $(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
        }
    
        _fnCallbackFire( settings, null, 'processing', [settings, show] );
    }

    function _fnFeatureHtmlTable ( settings )
    {
        var table = $(settings.nTable);
    
        // Add the ARIA grid role to the table
        table.attr( 'role', 'grid' );
    
        // Scrolling from here on in
        var scroll = settings.oScroll;
    
        if ( scroll.sX === '' && scroll.sY === '' ) {
            return settings.nTable;
        }
    
        var scrollX = scroll.sX;
        var scrollY = scroll.sY;
        var classes = settings.oClasses;
        var caption = table.children('caption');
        var captionSide = caption.length ? caption[0]._captionSide : null;
        var headerClone = $( table[0].cloneNode(false) );
        var footerClone = $( table[0].cloneNode(false) );
        var footer = table.children('tfoot');
        var _div = '<div/>';
        var size = function ( s ) {
            return !s ? null : _fnStringToCss( s );
        };
    
        if ( ! footer.length ) {
            footer = null;
        }
    
        
        var scroller = $( _div, { 'class': classes.sScrollWrapper } )
            .append(
                $(_div, { 'class': classes.sScrollHead } )
                    .css( {
                        overflow: 'hidden',
                        position: 'relative',
                        border: 0,
                        width: scrollX ? size(scrollX) : '100%'
                    } )
                    .append(
                        $(_div, { 'class': classes.sScrollHeadInner } )
                            .css( {
                                'box-sizing': 'content-box',
                                width: scroll.sXInner || '100%'
                            } )
                            .append(
                                headerClone
                                    .removeAttr('id')
                                    .css( 'margin-left', 0 )
                                    .append( captionSide === 'top' ? caption : null )
                                    .append(
                                        table.children('thead')
                                    )
                            )
                    )
            )
            .append(
                $(_div, { 'class': classes.sScrollBody } )
                    .css( {
                        position: 'relative',
                        overflow: 'auto',
                        width: size( scrollX )
                    } )
                    .append( table )
            );
    
        if ( footer ) {
            scroller.append(
                $(_div, { 'class': classes.sScrollFoot } )
                    .css( {
                        overflow: 'hidden',
                        border: 0,
                        width: scrollX ? size(scrollX) : '100%'
                    } )
                    .append(
                        $(_div, { 'class': classes.sScrollFootInner } )
                            .append(
                                footerClone
                                    .removeAttr('id')
                                    .css( 'margin-left', 0 )
                                    .append( captionSide === 'bottom' ? caption : null )
                                    .append(
                                        table.children('tfoot')
                                    )
                            )
                    )
            );
        }
    
        var children = scroller.children();
        var scrollHead = children[0];
        var scrollBody = children[1];
        var scrollFoot = footer ? children[2] : null;
    
        // When the body is scrolled, then we also want to scroll the headers
        if ( scrollX ) {
            $(scrollBody).on( 'scroll.DT', function (e) {
                var scrollLeft = this.scrollLeft;
    
                scrollHead.scrollLeft = scrollLeft;
    
                if ( footer ) {
                    scrollFoot.scrollLeft = scrollLeft;
                }
            } );
        }
    
        $(scrollBody).css(
            scrollY && scroll.bCollapse ? 'max-height' : 'height', 
            scrollY
        );
    
        settings.nScrollHead = scrollHead;
        settings.nScrollBody = scrollBody;
        settings.nScrollFoot = scrollFoot;
    
        // On redraw - align columns
        settings.aoDrawCallback.push( {
            "fn": _fnScrollDraw,
            "sName": "scrolling"
        } );
    
        return scroller[0];
    }
    
    function _fnScrollDraw ( settings )
    {
        // Given that this is such a monster function, a lot of variables are use
        // to try and keep the minimised size as small as possible
        var
            scroll         = settings.oScroll,
            scrollX        = scroll.sX,
            scrollXInner   = scroll.sXInner,
            scrollY        = scroll.sY,
            barWidth       = scroll.iBarWidth,
            divHeader      = $(settings.nScrollHead),
            divHeaderStyle = divHeader[0].style,
            divHeaderInner = divHeader.children('div'),
            divHeaderInnerStyle = divHeaderInner[0].style,
            divHeaderTable = divHeaderInner.children('table'),
            divBodyEl      = settings.nScrollBody,
            divBody        = $(divBodyEl),
            divBodyStyle   = divBodyEl.style,
            divFooter      = $(settings.nScrollFoot),
            divFooterInner = divFooter.children('div'),
            divFooterTable = divFooterInner.children('table'),
            header         = $(settings.nTHead),
            table          = $(settings.nTable),
            tableEl        = table[0],
            tableStyle     = tableEl.style,
            footer         = settings.nTFoot ? $(settings.nTFoot) : null,
            browser        = settings.oBrowser,
            ie67           = browser.bScrollOversize,
            headerTrgEls, footerTrgEls,
            headerSrcEls, footerSrcEls,
            headerCopy, footerCopy,
            headerWidths=[], footerWidths=[],
            headerContent=[],
            idx, correction, sanityWidth,
            zeroOut = function(nSizer) {
                var style = nSizer.style;
                style.paddingTop = "0";
                style.paddingBottom = "0";
                style.borderTopWidth = "0";
                style.borderBottomWidth = "0";
                style.height = 0;
            };
    
        // If the scrollbar visibility has changed from the last draw, we need to
        // adjust the column sizes as the table width will have changed to account
        // for the scrollbar
        var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
        
        if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
            settings.scrollBarVis = scrollBarVis;
            _fnAdjustColumnSizing( settings );
            return; // adjust column sizing will call this function again
        }
        else {
            settings.scrollBarVis = scrollBarVis;
        }
    
        
    
        // Remove the old minimised thead and tfoot elements in the inner table
        table.children('thead, tfoot').remove();
    
        // Clone the current header and footer elements and then place it into the inner table
        headerCopy = header.clone().prependTo( table );
        headerTrgEls = header.find('tr'); // original header is in its own table
        headerSrcEls = headerCopy.find('tr');
        headerCopy.find('th, td').removeAttr('tabindex');
    
        if ( footer ) {
            footerCopy = footer.clone().prependTo( table );
            footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
            footerSrcEls = footerCopy.find('tr');
        }
    
    
        
    
        // Remove old sizing and apply the calculated column widths
        // Get the unique column headers in the newly created (cloned) header. We want to apply the
        // calculated sizes to this header
        if ( ! scrollX )
        {
            divBodyStyle.width = '100%';
            divHeader[0].style.width = '100%';
        }
    
        $.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
            idx = _fnVisibleToColumnIndex( settings, i );
            el.style.width = settings.aoColumns[idx].sWidth;
        } );
    
        if ( footer ) {
            _fnApplyToChildren( function(n) {
                n.style.width = "";
            }, footerSrcEls );
        }
    
        // Size the table as a whole
        sanityWidth = table.outerWidth();
        if ( scrollX === "" ) {
            // No x scrolling
            tableStyle.width = "100%";
    
            // IE7 will make the width of the table when 100% include the scrollbar
            // - which is shouldn't. When there is a scrollbar we need to take this
            // into account.
            if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
                divBody.css('overflow-y') == "scroll")
            ) {
                tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
            }
    
            // Recalculate the sanity width
            sanityWidth = table.outerWidth();
        }
        else if ( scrollXInner !== "" ) {
            // legacy x scroll inner has been given - use it
            tableStyle.width = _fnStringToCss(scrollXInner);
    
            // Recalculate the sanity width
            sanityWidth = table.outerWidth();
        }
    
        // Hidden header should have zero height, so remove padding and borders. Then
        // set the width based on the real headers
    
        // Apply all styles in one pass
        _fnApplyToChildren( zeroOut, headerSrcEls );
    
        // Read all widths in next pass
        _fnApplyToChildren( function(nSizer) {
            headerContent.push( nSizer.innerHTML );
            headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
        }, headerSrcEls );
    
        // Apply all widths in final pass
        _fnApplyToChildren( function(nToSize, i) {
            nToSize.style.width = headerWidths[i];
        }, headerTrgEls );
    
        $(headerSrcEls).height(0);
    
        
        if ( footer )
        {
            _fnApplyToChildren( zeroOut, footerSrcEls );
    
            _fnApplyToChildren( function(nSizer) {
                footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
            }, footerSrcEls );
    
            _fnApplyToChildren( function(nToSize, i) {
                nToSize.style.width = footerWidths[i];
            }, footerTrgEls );
    
            $(footerSrcEls).height(0);
        }
    
    
        
    
        // "Hide" the header and footer that we used for the sizing. We need to keep
        // the content of the cell so that the width applied to the header and body
        // both match, but we want to hide it completely. We want to also fix their
        // width to what they currently are
        _fnApplyToChildren( function(nSizer, i) {
            nSizer.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+headerContent[i]+'</div>';
            nSizer.style.width = headerWidths[i];
        }, headerSrcEls );
    
        if ( footer )
        {
            _fnApplyToChildren( function(nSizer, i) {
                nSizer.innerHTML = "";
                nSizer.style.width = footerWidths[i];
            }, footerSrcEls );
        }
    
        // Sanity check that the table is of a sensible width. If not then we are going to get
        // misalignment - try to prevent this by not allowing the table to shrink below its min width
        if ( table.outerWidth() < sanityWidth )
        {
            // The min width depends upon if we have a vertical scrollbar visible or not */
            correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
                divBody.css('overflow-y') == "scroll")) ?
                    sanityWidth+barWidth :
                    sanityWidth;
    
            // IE6/7 are a law unto themselves...
            if ( ie67 && (divBodyEl.scrollHeight >
                divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
            ) {
                tableStyle.width = _fnStringToCss( correction-barWidth );
            }
    
            // And give the user a warning that we've stopped the table getting too small
            if ( scrollX === "" || scrollXInner !== "" ) {
                _fnLog( settings, 1, 'Possible column misalignment', 6 );
            }
        }
        else
        {
            correction = '100%';
        }
    
        // Apply to the container elements
        divBodyStyle.width = _fnStringToCss( correction );
        divHeaderStyle.width = _fnStringToCss( correction );
    
        if ( footer ) {
            settings.nScrollFoot.style.width = _fnStringToCss( correction );
        }
    
    
        
        if ( ! scrollY ) {
            
            if ( ie67 ) {
                divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
            }
        }
    
        
        var iOuterWidth = table.outerWidth();
        divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
        divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
    
        // Figure out if there are scrollbar present - if so then we need a the header and footer to
        // provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
        var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
        var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
        divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
    
        if ( footer ) {
            divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
            divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
            divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
        }
    
        
        divBody.scroll();
    
        // If sorting or filtering has occurred, jump the scrolling back to the top
        // only if we aren't holding the position
        if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
            divBodyEl.scrollTop = 0;
        }
    }

    function _fnApplyToChildren( fn, an1, an2 )
    {
        var index=0, i=0, iLen=an1.length;
        var nNode1, nNode2;
    
        while ( i < iLen ) {
            nNode1 = an1[i].firstChild;
            nNode2 = an2 ? an2[i].firstChild : null;
    
            while ( nNode1 ) {
                if ( nNode1.nodeType === 1 ) {
                    if ( an2 ) {
                        fn( nNode1, nNode2, index );
                    }
                    else {
                        fn( nNode1, index );
                    }
    
                    index++;
                }
    
                nNode1 = nNode1.nextSibling;
                nNode2 = an2 ? nNode2.nextSibling : null;
            }
    
            i++;
        }
    }

    var __re_html_remove = /<.*?>/g;
    
    function _fnCalculateColumnWidths ( oSettings )
    {
        var
            table = oSettings.nTable,
            columns = oSettings.aoColumns,
            scroll = oSettings.oScroll,
            scrollY = scroll.sY,
            scrollX = scroll.sX,
            scrollXInner = scroll.sXInner,
            columnCount = columns.length,
            visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
            headerCells = $('th', oSettings.nTHead),
            tableWidthAttr = table.getAttribute('width'), // from DOM element
            tableContainer = table.parentNode,
            userInputs = false,
            i, column, columnIdx, width, outerWidth,
            browser = oSettings.oBrowser,
            ie67 = browser.bScrollOversize;
    
        var styleWidth = table.style.width;
        if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
            tableWidthAttr = styleWidth;
        }
    
        
        for ( i=0 ; i<visibleColumns.length ; i++ ) {
            column = columns[ visibleColumns[i] ];
    
            if ( column.sWidth !== null ) {
                column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
    
                userInputs = true;
            }
        }
    
        
        if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
             columnCount == _fnVisbleColumns( oSettings ) &&
             columnCount == headerCells.length
        ) {
            for ( i=0 ; i<columnCount ; i++ ) {
                var colIdx = _fnVisibleToColumnIndex( oSettings, i );
    
                if ( colIdx !== null ) {
                    columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
                }
            }
        }
        else
        {
            // Otherwise construct a single row, worst case, table with the widest
            // node in the data, assign any user defined widths, then insert it into
            // the DOM and allow the browser to do all the hard work of calculating
            // table widths
            var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
                .css( 'visibility', 'hidden' )
                .removeAttr( 'id' );
    
            // Clean up the table body
            tmpTable.find('tbody tr').remove();
            var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
    
            // Clone the table header and footer - we can't use the header / footer
            // from the cloned table, since if scrolling is active, the table's
            // real header and footer are contained in different table tags
            tmpTable.find('thead, tfoot').remove();
            tmpTable
                .append( $(oSettings.nTHead).clone() )
                .append( $(oSettings.nTFoot).clone() );
    
            // Remove any assigned widths from the footer (from scrolling)
            tmpTable.find('tfoot th, tfoot td').css('width', '');
    
            // Apply custom sizing to the cloned header
            headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
    
            for ( i=0 ; i<visibleColumns.length ; i++ ) {
                column = columns[ visibleColumns[i] ];
    
                headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
                    _fnStringToCss( column.sWidthOrig ) :
                    '';
    
                // For scrollX we need to force the column width otherwise the
                // browser will collapse it. If this width is smaller than the
                // width the column requires, then it will have no effect
                if ( column.sWidthOrig && scrollX ) {
                    $( headerCells[i] ).append( $('<div/>').css( {
                        width: column.sWidthOrig,
                        margin: 0,
                        padding: 0,
                        border: 0,
                        height: 1
                    } ) );
                }
            }
    
            // Find the widest cell for each column and put it into the table
            if ( oSettings.aoData.length ) {
                for ( i=0 ; i<visibleColumns.length ; i++ ) {
                    columnIdx = visibleColumns[i];
                    column = columns[ columnIdx ];
    
                    $( _fnGetWidestNode( oSettings, columnIdx ) )
                        .clone( false )
                        .append( column.sContentPadding )
                        .appendTo( tr );
                }
            }
    
            // Table has been built, attach to the document so we can work with it.
            // A holding element is used, positioned at the top of the container
            // with minimal height, so it has no effect on if the container scrolls
            // or not. Otherwise it might trigger scrolling when it actually isn't
            // needed
            var holder = $('<div/>').css( scrollX || scrollY ?
                    {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: 1,
                        right: 0,
                        overflow: 'hidden'
                    } :
                    {}
                )
                .append( tmpTable )
                .appendTo( tableContainer );
    
            // When scrolling (X or Y) we want to set the width of the table as 
            // appropriate. However, when not scrolling leave the table width as it
            // is. This results in slightly different, but I think correct behaviour
            if ( scrollX && scrollXInner ) {
                tmpTable.width( scrollXInner );
            }
            else if ( scrollX ) {
                tmpTable.css( 'width', 'auto' );
                tmpTable.removeAttr('width');
    
                // If there is no width attribute or style, then allow the table to
                // collapse
                if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
                    tmpTable.width( tableContainer.clientWidth );
                }
            }
            else if ( scrollY ) {
                tmpTable.width( tableContainer.clientWidth );
            }
            else if ( tableWidthAttr ) {
                tmpTable.width( tableWidthAttr );
            }
    
            // Get the width of each column in the constructed table - we need to
            // know the inner width (so it can be assigned to the other table's
            // cells) and the outer width so we can calculate the full width of the
            // table. This is safe since DataTables requires a unique cell for each
            // column, but if ever a header can span multiple columns, this will
            // need to be modified.
            var total = 0;
            for ( i=0 ; i<visibleColumns.length ; i++ ) {
                var cell = $(headerCells[i]);
                var border = cell.outerWidth() - cell.width();
    
                // Use getBounding... where possible (not IE8-) because it can give
                // sub-pixel accuracy, which we then want to round up!
                var bounding = browser.bBounding ?
                    Math.ceil( headerCells[i].getBoundingClientRect().width ) :
                    cell.outerWidth();
    
                // Total is tracked to remove any sub-pixel errors as the outerWidth
                // of the table might not equal the total given here (IE!).
                total += bounding;
    
                // Width for each column to use
                columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
            }
    
            table.style.width = _fnStringToCss( total );
    
            // Finished with the table - ditch it
            holder.remove();
        }
    
        // If there is a width attr, we want to attach an event listener which
        // allows the table sizing to automatically adjust when the window is
        // resized. Use the width attr rather than CSS, since we can't know if the
        // CSS is a relative value or absolute - DOM read is always px.
        if ( tableWidthAttr ) {
            table.style.width = _fnStringToCss( tableWidthAttr );
        }
    
        if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
            var bindResize = function () {
                $(window).bind('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
                    _fnAdjustColumnSizing( oSettings );
                } ) );
            };
    
            // IE6/7 will crash if we bind a resize event handler on page load.
            // To be removed in 1.11 which drops IE6/7 support
            if ( ie67 ) {
                setTimeout( bindResize, 1000 );
            }
            else {
                bindResize();
            }
    
            oSettings._reszEvt = true;
        }
    }

    function _fnThrottle( fn, freq ) {
        var
            frequency = freq !== undefined ? freq : 200,
            last,
            timer;
    
        return function () {
            var
                that = this,
                now  = +new Date(),
                args = arguments;
    
            if ( last && now < last + frequency ) {
                clearTimeout( timer );
    
                timer = setTimeout( function () {
                    last = undefined;
                    fn.apply( that, args );
                }, frequency );
            }
            else {
                last = now;
                fn.apply( that, args );
            }
        };
    }

    function _fnConvertToWidth ( width, parent )
    {
        if ( ! width ) {
            return 0;
        }
    
        var n = $('<div/>')
            .css( 'width', _fnStringToCss( width ) )
            .appendTo( parent || document.body );
    
        var val = n[0].offsetWidth;
        n.remove();
    
        return val;
    }

    function _fnGetWidestNode( settings, colIdx )
    {
        var idx = _fnGetMaxLenString( settings, colIdx );
        if ( idx < 0 ) {
            return null;
        }
    
        var data = settings.aoData[ idx ];
        return ! data.nTr ? // Might not have been created when deferred rendering
            $('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
            data.anCells[ colIdx ];
    }

    function _fnGetMaxLenString( settings, colIdx )
    {
        var s, max=-1, maxIdx = -1;
    
        for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
            s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
            s = s.replace( __re_html_remove, '' );
            s = s.replace( /&nbsp;/g, ' ' );
    
            if ( s.length > max ) {
                max = s.length;
                maxIdx = i;
            }
        }
    
        return maxIdx;
    }

    function _fnStringToCss( s )
    {
        if ( s === null ) {
            return '0px';
        }
    
        if ( typeof s == 'number' ) {
            return s < 0 ?
                '0px' :
                s+'px';
        }
    
        // Check it has a unit character already
        return s.match(/\d$/) ?
            s+'px' :
            s;
    }

    function _fnSortFlatten ( settings )
    {
        var
            i, iLen, k, kLen,
            aSort = [],
            aiOrig = [],
            aoColumns = settings.aoColumns,
            aDataSort, iCol, sType, srcCol,
            fixed = settings.aaSortingFixed,
            fixedObj = $.isPlainObject( fixed ),
            nestedSort = [],
            add = function ( a ) {
                if ( a.length && ! $.isArray( a[0] ) ) {
                    // 1D array
                    nestedSort.push( a );
                }
                else {
                    // 2D array
                    $.merge( nestedSort, a );
                }
            };
    
        // Build the sort array, with pre-fix and post-fix options if they have been
        // specified
        if ( $.isArray( fixed ) ) {
            add( fixed );
        }
    
        if ( fixedObj && fixed.pre ) {
            add( fixed.pre );
        }
    
        add( settings.aaSorting );
    
        if (fixedObj && fixed.post ) {
            add( fixed.post );
        }
    
        for ( i=0 ; i<nestedSort.length ; i++ )
        {
            srcCol = nestedSort[i][0];
            aDataSort = aoColumns[ srcCol ].aDataSort;
    
            for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
            {
                iCol = aDataSort[k];
                sType = aoColumns[ iCol ].sType || 'string';
    
                if ( nestedSort[i]._idx === undefined ) {
                    nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
                }
    
                aSort.push( {
                    src:       srcCol,
                    col:       iCol,
                    dir:       nestedSort[i][1],
                    index:     nestedSort[i]._idx,
                    type:      sType,
                    formatter: DataTable.ext.type.order[ sType+"-pre" ]
                } );
            }
        }
    
        return aSort;
    }

    function _fnSort ( oSettings )
    {
        var
            i, ien, iLen, j, jLen, k, kLen,
            sDataType, nTh,
            aiOrig = [],
            oExtSort = DataTable.ext.type.order,
            aoData = oSettings.aoData,
            aoColumns = oSettings.aoColumns,
            aDataSort, data, iCol, sType, oSort,
            formatters = 0,
            sortCol,
            displayMaster = oSettings.aiDisplayMaster,
            aSort;
    
        // Resolve any column types that are unknown due to addition or invalidation
        // @todo Can this be moved into a 'data-ready' handler which is called when
        //   data is going to be used in the table?
        _fnColumnTypes( oSettings );
    
        aSort = _fnSortFlatten( oSettings );
    
        for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
            sortCol = aSort[i];
    
            // Track if we can use the fast sort algorithm
            if ( sortCol.formatter ) {
                formatters++;
            }
    
            // Load the data needed for the sort, for each cell
            _fnSortData( oSettings, sortCol.col );
        }
    
        
        if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
        {
            // Create a value - key array of the current row positions such that we can use their
            // current position during the sort, if values match, in order to perform stable sorting
            for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
                aiOrig[ displayMaster[i] ] = i;
            }
    
            
            if ( formatters === aSort.length ) {
                // All sort types have formatting functions
                displayMaster.sort( function ( a, b ) {
                    var
                        x, y, k, test, sort,
                        len=aSort.length,
                        dataA = aoData[a]._aSortData,
                        dataB = aoData[b]._aSortData;
    
                    for ( k=0 ; k<len ; k++ ) {
                        sort = aSort[k];
    
                        x = dataA[ sort.col ];
                        y = dataB[ sort.col ];
    
                        test = x<y ? -1 : x>y ? 1 : 0;
                        if ( test !== 0 ) {
                            return sort.dir === 'asc' ? test : -test;
                        }
                    }
    
                    x = aiOrig[a];
                    y = aiOrig[b];
                    return x<y ? -1 : x>y ? 1 : 0;
                } );
            }
            else {
                // Depreciated - remove in 1.11 (providing a plug-in option)
                // Not all sort types have formatting methods, so we have to call their sorting
                // methods.
                displayMaster.sort( function ( a, b ) {
                    var
                        x, y, k, l, test, sort, fn,
                        len=aSort.length,
                        dataA = aoData[a]._aSortData,
                        dataB = aoData[b]._aSortData;
    
                    for ( k=0 ; k<len ; k++ ) {
                        sort = aSort[k];
    
                        x = dataA[ sort.col ];
                        y = dataB[ sort.col ];
    
                        fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
                        test = fn( x, y );
                        if ( test !== 0 ) {
                            return test;
                        }
                    }
    
                    x = aiOrig[a];
                    y = aiOrig[b];
                    return x<y ? -1 : x>y ? 1 : 0;
                } );
            }
        }
    
        
        oSettings.bSorted = true;
    }

    function _fnSortAria ( settings )
    {
        var label;
        var nextSort;
        var columns = settings.aoColumns;
        var aSort = _fnSortFlatten( settings );
        var oAria = settings.oLanguage.oAria;
    
        // ARIA attributes - need to loop all columns, to update all (removing old
        // attributes as needed)
        for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
        {
            var col = columns[i];
            var asSorting = col.asSorting;
            var sTitle = col.sTitle.replace( /<.*?>/g, "" );
            var th = col.nTh;
    
            // IE7 is throwing an error when setting these properties with jQuery's
            // attr() and removeAttr() methods...
            th.removeAttribute('aria-sort');
    
            
            if ( col.bSortable ) {
                if ( aSort.length > 0 && aSort[0].col == i ) {
                    th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
                    nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
                }
                else {
                    nextSort = asSorting[0];
                }
    
                label = sTitle + ( nextSort === "asc" ?
                    oAria.sSortAscending :
                    oAria.sSortDescending
                );
            }
            else {
                label = sTitle;
            }
    
            th.setAttribute('aria-label', label);
        }
    }
    
    function _fnSortListener ( settings, colIdx, append, callback )
    {
        var col = settings.aoColumns[ colIdx ];
        var sorting = settings.aaSorting;
        var asSorting = col.asSorting;
        var nextSortIdx;
        var next = function ( a, overflow ) {
            var idx = a._idx;
            if ( idx === undefined ) {
                idx = $.inArray( a[1], asSorting );
            }
    
            return idx+1 < asSorting.length ?
                idx+1 :
                overflow ?
                    null :
                    0;
        };
    
        // Convert to 2D array if needed
        if ( typeof sorting[0] === 'number' ) {
            sorting = settings.aaSorting = [ sorting ];
        }
    
        // If appending the sort then we are multi-column sorting
        if ( append && settings.oFeatures.bSortMulti ) {
            // Are we already doing some kind of sort on this column?
            var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
    
            if ( sortIdx !== -1 ) {
                // Yes, modify the sort
                nextSortIdx = next( sorting[sortIdx], true );
    
                if ( nextSortIdx === null && sorting.length === 1 ) {
                    nextSortIdx = 0; // can't remove sorting completely
                }
    
                if ( nextSortIdx === null ) {
                    sorting.splice( sortIdx, 1 );
                }
                else {
                    sorting[sortIdx][1] = asSorting[ nextSortIdx ];
                    sorting[sortIdx]._idx = nextSortIdx;
                }
            }
            else {
                // No sort on this column yet
                sorting.push( [ colIdx, asSorting[0], 0 ] );
                sorting[sorting.length-1]._idx = 0;
            }
        }
        else if ( sorting.length && sorting[0][0] == colIdx ) {
            // Single column - already sorting on this column, modify the sort
            nextSortIdx = next( sorting[0] );
    
            sorting.length = 1;
            sorting[0][1] = asSorting[ nextSortIdx ];
            sorting[0]._idx = nextSortIdx;
        }
        else {
            // Single column - sort only on this column
            sorting.length = 0;
            sorting.push( [ colIdx, asSorting[0] ] );
            sorting[0]._idx = 0;
        }
    
        // Run the sort by calling a full redraw
        _fnReDraw( settings );
    
        // callback used for async user interaction
        if ( typeof callback == 'function' ) {
            callback( settings );
        }
    }

    function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
    {
        var col = settings.aoColumns[ colIdx ];
    
        _fnBindAction( attachTo, {}, function (e) {
            
            if ( col.bSortable === false ) {
                return;
            }
    
            // If processing is enabled use a timeout to allow the processing
            // display to be shown - otherwise to it synchronously
            if ( settings.oFeatures.bProcessing ) {
                _fnProcessingDisplay( settings, true );
    
                setTimeout( function() {
                    _fnSortListener( settings, colIdx, e.shiftKey, callback );
    
                    // In server-side processing, the draw callback will remove the
                    // processing display
                    if ( _fnDataSource( settings ) !== 'ssp' ) {
                        _fnProcessingDisplay( settings, false );
                    }
                }, 0 );
            }
            else {
                _fnSortListener( settings, colIdx, e.shiftKey, callback );
            }
        } );
    }

    function _fnSortingClasses( settings )
    {
        var oldSort = settings.aLastSort;
        var sortClass = settings.oClasses.sSortColumn;
        var sort = _fnSortFlatten( settings );
        var features = settings.oFeatures;
        var i, ien, colIdx;
    
        if ( features.bSort && features.bSortClasses ) {
            // Remove old sorting classes
            for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
                colIdx = oldSort[i].src;
    
                // Remove column sorting
                $( _pluck( settings.aoData, 'anCells', colIdx ) )
                    .removeClass( sortClass + (i<2 ? i+1 : 3) );
            }
    
            // Add new column sorting
            for ( i=0, ien=sort.length ; i<ien ; i++ ) {
                colIdx = sort[i].src;
    
                $( _pluck( settings.aoData, 'anCells', colIdx ) )
                    .addClass( sortClass + (i<2 ? i+1 : 3) );
            }
        }
    
        settings.aLastSort = sort;
    }

    function _fnSortData( settings, idx )
    {
        // Custom sorting function - provided by the sort data type
        var column = settings.aoColumns[ idx ];
        var customSort = DataTable.ext.order[ column.sSortDataType ];
        var customData;
    
        if ( customSort ) {
            customData = customSort.call( settings.oInstance, settings, idx,
                _fnColumnIndexToVisible( settings, idx )
            );
        }
    
        // Use / populate cache
        var row, cellData;
        var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
    
        for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
            row = settings.aoData[i];
    
            if ( ! row._aSortData ) {
                row._aSortData = [];
            }
    
            if ( ! row._aSortData[idx] || customSort ) {
                cellData = customSort ?
                    customData[i] : // If there was a custom sort function, use data from there
                    _fnGetCellData( settings, i, idx, 'sort' );
    
                row._aSortData[ idx ] = formatter ?
                    formatter( cellData ) :
                    cellData;
            }
        }
    }

    function _fnSaveState ( settings )
    {
        if ( !settings.oFeatures.bStateSave || settings.bDestroying )
        {
            return;
        }
    
        
        var state = {
            time:    +new Date(),
            start:   settings._iDisplayStart,
            length:  settings._iDisplayLength,
            order:   $.extend( true, [], settings.aaSorting ),
            search:  _fnSearchToCamel( settings.oPreviousSearch ),
            columns: $.map( settings.aoColumns, function ( col, i ) {
                return {
                    visible: col.bVisible,
                    search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
                };
            } )
        };
    
        _fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
    
        settings.oSavedState = state;
        settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
    }

    function _fnLoadState ( settings, oInit )
    {
        var i, ien;
        var columns = settings.aoColumns;
    
        if ( ! settings.oFeatures.bStateSave ) {
            return;
        }
    
        var state = settings.fnStateLoadCallback.call( settings.oInstance, settings );
        if ( ! state || ! state.time ) {
            return;
        }
    
        
        var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, state] );
        if ( $.inArray( false, abStateLoad ) !== -1 ) {
            return;
        }
    
        
        var duration = settings.iStateDuration;
        if ( duration > 0 && state.time < +new Date() - (duration*1000) ) {
            return;
        }
    
        // Number of columns have changed - all bets are off, no restore of settings
        if ( columns.length !== state.columns.length ) {
            return;
        }
    
        // Store the saved state so it might be accessed at any time
        settings.oLoadedState = $.extend( true, {}, state );
    
        // Restore key features - todo - for 1.11 this needs to be done by
        // subscribed events
        if ( state.start !== undefined ) {
            settings._iDisplayStart    = state.start;
            settings.iInitDisplayStart = state.start;
        }
        if ( state.length !== undefined ) {
            settings._iDisplayLength   = state.length;
        }
    
        // Order
        if ( state.order !== undefined ) {
            settings.aaSorting = [];
            $.each( state.order, function ( i, col ) {
                settings.aaSorting.push( col[0] >= columns.length ?
                    [ 0, col[1] ] :
                    col
                );
            } );
        }
    
        // Search
        if ( state.search !== undefined ) {
            $.extend( settings.oPreviousSearch, _fnSearchToHung( state.search ) );
        }
    
        // Columns
        for ( i=0, ien=state.columns.length ; i<ien ; i++ ) {
            var col = state.columns[i];
    
            // Visibility
            if ( col.visible !== undefined ) {
                columns[i].bVisible = col.visible;
            }
    
            // Search
            if ( col.search !== undefined ) {
                $.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
            }
        }
    
        _fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, state] );
    }

    function _fnSettingsFromNode ( table )
    {
        var settings = DataTable.settings;
        var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
    
        return idx !== -1 ?
            settings[ idx ] :
            null;
    }
    
    function _fnLog( settings, level, msg, tn )
    {
        msg = 'DataTables warning: '+
            (settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
    
        if ( tn ) {
            msg += '. For more information about this error, please see '+
            'http://datatables.net/tn/'+tn;
        }
    
        if ( ! level  ) {
            // Backwards compatibility pre 1.10
            var ext = DataTable.ext;
            var type = ext.sErrMode || ext.errMode;
    
            if ( settings ) {
                _fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
            }
    
            if ( type == 'alert' ) {
                alert( msg );
            }
            else if ( type == 'throw' ) {
                throw new Error(msg);
            }
            else if ( typeof type == 'function' ) {
                type( settings, tn, msg );
            }
        }
        else if ( window.console && console.log ) {
            console.log( msg );
        }
    }
    
    function _fnMap( ret, src, name, mappedName )
    {
        if ( $.isArray( name ) ) {
            $.each( name, function (i, val) {
                if ( $.isArray( val ) ) {
                    _fnMap( ret, src, val[0], val[1] );
                }
                else {
                    _fnMap( ret, src, val );
                }
            } );
    
            return;
        }
    
        if ( mappedName === undefined ) {
            mappedName = name;
        }
    
        if ( src[name] !== undefined ) {
            ret[mappedName] = src[name];
        }
    }

    function _fnExtend( out, extender, breakRefs )
    {
        var val;
    
        for ( var prop in extender ) {
            if ( extender.hasOwnProperty(prop) ) {
                val = extender[prop];
    
                if ( $.isPlainObject( val ) ) {
                    if ( ! $.isPlainObject( out[prop] ) ) {
                        out[prop] = {};
                    }
                    $.extend( true, out[prop], val );
                }
                else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && $.isArray(val) ) {
                    out[prop] = val.slice();
                }
                else {
                    out[prop] = val;
                }
            }
        }
    
        return out;
    }
    
    function _fnBindAction( n, oData, fn )
    {
        $(n)
            .bind( 'click.DT', oData, function (e) {
                    n.blur(); // Remove focus outline for mouse users
                    fn(e);
                } )
            .bind( 'keypress.DT', oData, function (e){
                    if ( e.which === 13 ) {
                        e.preventDefault();
                        fn(e);
                    }
                } )
            .bind( 'selectstart.DT', function () {
                    
                    return false;
                } );
    }

    function _fnCallbackReg( oSettings, sStore, fn, sName )
    {
        if ( fn )
        {
            oSettings[sStore].push( {
                "fn": fn,
                "sName": sName
            } );
        }
    }

    function _fnCallbackFire( settings, callbackArr, eventName, args )
    {
        var ret = [];
    
        if ( callbackArr ) {
            ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
                return val.fn.apply( settings.oInstance, args );
            } );
        }
    
        if ( eventName !== null ) {
            var e = $.Event( eventName+'.dt' );
    
            $(settings.nTable).trigger( e, args );
    
            ret.push( e.result );
        }
    
        return ret;
    }

    function _fnLengthOverflow ( settings )
    {
        var
            start = settings._iDisplayStart,
            end = settings.fnDisplayEnd(),
            len = settings._iDisplayLength;
    
        
        if ( start >= end )
        {
            start = end - len;
        }
    
        // Keep the start record on the current page
        start -= (start % len);
    
        if ( len === -1 || start < 0 )
        {
            start = 0;
        }
    
        settings._iDisplayStart = start;
    }

    function _fnRenderer( settings, type )
    {
        var renderer = settings.renderer;
        var host = DataTable.ext.renderer[type];
    
        if ( $.isPlainObject( renderer ) && renderer[type] ) {
            // Specific renderer for this type. If available use it, otherwise use
            // the default.
            return host[renderer[type]] || host._;
        }
        else if ( typeof renderer === 'string' ) {
            // Common renderer - if there is one available for this type use it,
            // otherwise use the default
            return host[renderer] || host._;
        }
    
        // Use the default
        return host._;
    }

    function _fnDataSource ( settings )
    {
        if ( settings.oFeatures.bServerSide ) {
            return 'ssp';
        }
        else if ( settings.ajax || settings.sAjaxSource ) {
            return 'ajax';
        }
        return 'dom';
    }

    DataTable = function( options )
    {
        this.$ = function ( sSelector, oOpts )
        {
            return this.api(true).$( sSelector, oOpts );
        };
        
        this._ = function ( sSelector, oOpts )
        {
            return this.api(true).rows( sSelector, oOpts ).data();
        };
        
        this.api = function ( traditional )
        {
            return traditional ?
                new _Api(
                    _fnSettingsFromNode( this[ _ext.iApiIndex ] )
                ) :
                new _Api( this );
        };

        this.fnAddData = function( data, redraw )
        {
            var api = this.api( true );
        
            
            var rows = $.isArray(data) && ( $.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
                api.rows.add( data ) :
                api.row.add( data );
        
            if ( redraw === undefined || redraw ) {
                api.draw();
            }
        
            return rows.flatten().toArray();
        };

        this.fnAdjustColumnSizing = function ( bRedraw )
        {
            var api = this.api( true ).columns.adjust();
            var settings = api.settings()[0];
            var scroll = settings.oScroll;
        
            if ( bRedraw === undefined || bRedraw ) {
                api.draw( false );
            }
            else if ( scroll.sX !== "" || scroll.sY !== "" ) {
                
                _fnScrollDraw( settings );
            }
        };

        this.fnClearTable = function( bRedraw )
        {
            var api = this.api( true ).clear();
        
            if ( bRedraw === undefined || bRedraw ) {
                api.draw();
            }
        };
        
        this.fnClose = function( nTr )
        {
            this.api( true ).row( nTr ).child.hide();
        };

        this.fnDeleteRow = function( target, callback, redraw )
        {
            var api = this.api( true );
            var rows = api.rows( target );
            var settings = rows.settings()[0];
            var data = settings.aoData[ rows[0][0] ];
        
            rows.remove();
        
            if ( callback ) {
                callback.call( this, settings, data );
            }
        
            if ( redraw === undefined || redraw ) {
                api.draw();
            }
        
            return data;
        };

        this.fnDestroy = function ( remove )
        {
            this.api( true ).destroy( remove );
        };

        this.fnDraw = function( complete )
        {
            // Note that this isn't an exact match to the old call to _fnDraw - it takes
            // into account the new data, but can hold position.
            this.api( true ).draw( complete );
        };

        this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
        {
            var api = this.api( true );
        
            if ( iColumn === null || iColumn === undefined ) {
                api.search( sInput, bRegex, bSmart, bCaseInsensitive );
            }
            else {
                api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
            }
        
            api.draw();
        };

        this.fnGetData = function( src, col )
        {
            var api = this.api( true );
        
            if ( src !== undefined ) {
                var type = src.nodeName ? src.nodeName.toLowerCase() : '';
        
                return col !== undefined || type == 'td' || type == 'th' ?
                    api.cell( src, col ).data() :
                    api.row( src ).data() || null;
            }
        
            return api.data().toArray();
        };

        this.fnGetNodes = function( iRow )
        {
            var api = this.api( true );
        
            return iRow !== undefined ?
                api.row( iRow ).node() :
                api.rows().nodes().flatten().toArray();
        };

        this.fnGetPosition = function( node )
        {
            var api = this.api( true );
            var nodeName = node.nodeName.toUpperCase();
        
            if ( nodeName == 'TR' ) {
                return api.row( node ).index();
            }
            else if ( nodeName == 'TD' || nodeName == 'TH' ) {
                var cell = api.cell( node ).index();
        
                return [
                    cell.row,
                    cell.columnVisible,
                    cell.column
                ];
            }
            return null;
        };

        this.fnIsOpen = function( nTr )
        {
            return this.api( true ).row( nTr ).child.isShown();
        };

        this.fnOpen = function( nTr, mHtml, sClass )
        {
            return this.api( true )
                .row( nTr )
                .child( mHtml, sClass )
                .show()
                .child()[0];
        };

        this.fnPageChange = function ( mAction, bRedraw )
        {
            var api = this.api( true ).page( mAction );
        
            if ( bRedraw === undefined || bRedraw ) {
                api.draw(false);
            }
        };

        this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
        {
            var api = this.api( true ).column( iCol ).visible( bShow );
        
            if ( bRedraw === undefined || bRedraw ) {
                api.columns.adjust().draw();
            }
        };

        this.fnSettings = function()
        {
            return _fnSettingsFromNode( this[_ext.iApiIndex] );
        };

        this.fnSort = function( aaSort )
        {
            this.api( true ).order( aaSort ).draw();
        };

        this.fnSortListener = function( nNode, iColumn, fnCallback )
        {
            this.api( true ).order.listener( nNode, iColumn, fnCallback );
        };
        
        this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
        {
            var api = this.api( true );
        
            if ( iColumn === undefined || iColumn === null ) {
                api.row( mRow ).data( mData );
            }
            else {
                api.cell( mRow, iColumn ).data( mData );
            }
        
            if ( bAction === undefined || bAction ) {
                api.columns.adjust();
            }
        
            if ( bRedraw === undefined || bRedraw ) {
                api.draw();
            }
            return 0;
        };
        
        this.fnVersionCheck = _ext.fnVersionCheck;
        

        var _that = this;
        var emptyInit = options === undefined;
        var len = this.length;

        if ( emptyInit ) {
            options = {};
        }

        this.oApi = this.internal = _ext.internal;

        // Extend with old style plug-in API methods
        for ( var fn in DataTable.ext.internal ) {
            if ( fn ) {
                this[fn] = _fnExternApiFunc(fn);
            }
        }

        this.each(function() {
            // For each initialisation we want to give it a clean initialisation
            // object that can be bashed around
            var o = {};
            var oInit = len > 1 ? // optimisation for single table case
                _fnExtend( o, options, true ) :
                options;

            
            var i=0, iLen, j, jLen, k, kLen;
            var sId = this.getAttribute( 'id' );
            var bInitHandedOff = false;
            var defaults = DataTable.defaults;
            var $this = $(this);
            
            
            
            if ( this.nodeName.toLowerCase() != 'table' )
            {
                _fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
                return;
            }
            
            
            _fnCompatOpts( defaults );
            _fnCompatCols( defaults.column );
            
            
            _fnCamelToHungarian( defaults, defaults, true );
            _fnCamelToHungarian( defaults.column, defaults.column, true );
            
            
            _fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ) );
            
            
            
            
            var allSettings = DataTable.settings;
            for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
            {
                var s = allSettings[i];
            
                
                if ( s.nTable == this || s.nTHead.parentNode == this || (s.nTFoot && s.nTFoot.parentNode == this) )
                {
                    var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
                    var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
            
                    if ( emptyInit || bRetrieve )
                    {
                        return s.oInstance;
                    }
                    else if ( bDestroy )
                    {
                        s.oInstance.fnDestroy();
                        break;
                    }
                    else
                    {
                        _fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
                        return;
                    }
                }
            
                
                if ( s.sTableId == this.id )
                {
                    allSettings.splice( i, 1 );
                    break;
                }
            }
            
            
            if ( sId === null || sId === "" )
            {
                sId = "DataTables_Table_"+(DataTable.ext._unique++);
                this.id = sId;
            }
            
            
            var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
                "sDestroyWidth": $this[0].style.width,
                "sInstance":     sId,
                "sTableId":      sId
            } );
            oSettings.nTable = this;
            oSettings.oApi   = _that.internal;
            oSettings.oInit  = oInit;
            
            allSettings.push( oSettings );
            
            // Need to add the instance after the instance after the settings object has been added
            // to the settings array, so we can self reference the table instance if more than one
            oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
            
            // Backwards compatibility, before we apply all the defaults
            _fnCompatOpts( oInit );
            
            if ( oInit.oLanguage )
            {
                _fnLanguageCompat( oInit.oLanguage );
            }
            
            // If the length menu is given, but the init display length is not, use the length menu
            if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
            {
                oInit.iDisplayLength = $.isArray( oInit.aLengthMenu[0] ) ?
                    oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
            }
            
            // Apply the defaults and init options to make a single init object will all
            // options defined from defaults and instance options.
            oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
            
            
            // Map the initialisation options onto the settings object
            _fnMap( oSettings.oFeatures, oInit, [
                "bPaginate",
                "bLengthChange",
                "bFilter",
                "bSort",
                "bSortMulti",
                "bInfo",
                "bProcessing",
                "bAutoWidth",
                "bSortClasses",
                "bServerSide",
                "bDeferRender"
            ] );
            _fnMap( oSettings, oInit, [
                "asStripeClasses",
                "ajax",
                "fnServerData",
                "fnFormatNumber",
                "sServerMethod",
                "aaSorting",
                "aaSortingFixed",
                "aLengthMenu",
                "sPaginationType",
                "sAjaxSource",
                "sAjaxDataProp",
                "iStateDuration",
                "sDom",
                "bSortCellsTop",
                "iTabIndex",
                "fnStateLoadCallback",
                "fnStateSaveCallback",
                "renderer",
                "searchDelay",
                "rowId",
                [ "iCookieDuration", "iStateDuration" ], // backwards compat
                [ "oSearch", "oPreviousSearch" ],
                [ "aoSearchCols", "aoPreSearchCols" ],
                [ "iDisplayLength", "_iDisplayLength" ],
                [ "bJQueryUI", "bJUI" ]
            ] );
            _fnMap( oSettings.oScroll, oInit, [
                [ "sScrollX", "sX" ],
                [ "sScrollXInner", "sXInner" ],
                [ "sScrollY", "sY" ],
                [ "bScrollCollapse", "bCollapse" ]
            ] );
            _fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
            
            
            _fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
            _fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
            _fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
            _fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
            _fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
            _fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
            _fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
            _fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
            _fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
            _fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
            _fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
            
            oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
            
            
            _fnBrowserDetect( oSettings );
            
            var oClasses = oSettings.oClasses;
            
            // @todo Remove in 1.11
            if ( oInit.bJQueryUI )
            {
                
                $.extend( oClasses, DataTable.ext.oJUIClasses, oInit.oClasses );
            
                if ( oInit.sDom === defaults.sDom && defaults.sDom === "lfrtip" )
                {
                    
                    oSettings.sDom = '<"H"lfr>t<"F"ip>';
                }
            
                if ( ! oSettings.renderer ) {
                    oSettings.renderer = 'jqueryui';
                }
                else if ( $.isPlainObject( oSettings.renderer ) && ! oSettings.renderer.header ) {
                    oSettings.renderer.header = 'jqueryui';
                }
            }
            else
            {
                $.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
            }
            $this.addClass( oClasses.sTable );
            
            
            if ( oSettings.iInitDisplayStart === undefined )
            {
                
                oSettings.iInitDisplayStart = oInit.iDisplayStart;
                oSettings._iDisplayStart = oInit.iDisplayStart;
            }
            
            if ( oInit.iDeferLoading !== null )
            {
                oSettings.bDeferLoading = true;
                var tmp = $.isArray( oInit.iDeferLoading );
                oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
                oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
            }
            
            
            var oLanguage = oSettings.oLanguage;
            $.extend( true, oLanguage, oInit.oLanguage );
            
            if ( oLanguage.sUrl !== "" )
            {
                
                $.ajax( {
                    dataType: 'json',
                    url: oLanguage.sUrl,
                    success: function ( json ) {
                        _fnLanguageCompat( json );
                        _fnCamelToHungarian( defaults.oLanguage, json );
                        $.extend( true, oLanguage, json );
                        _fnInitialise( oSettings );
                    },
                    error: function () {
                        // Error occurred loading language file, continue on as best we can
                        _fnInitialise( oSettings );
                    }
                } );
                bInitHandedOff = true;
            }
            
            
            if ( oInit.asStripeClasses === null )
            {
                oSettings.asStripeClasses =[
                    oClasses.sStripeOdd,
                    oClasses.sStripeEven
                ];
            }
            
            
            var stripeClasses = oSettings.asStripeClasses;
            var rowOne = $this.children('tbody').find('tr').eq(0);
            if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
                return rowOne.hasClass(el);
            } ) ) !== -1 ) {
                $('tbody tr', this).removeClass( stripeClasses.join(' ') );
                oSettings.asDestroyStripes = stripeClasses.slice();
            }
            
            
            var anThs = [];
            var aoColumnsInit;
            var nThead = this.getElementsByTagName('thead');
            if ( nThead.length !== 0 )
            {
                _fnDetectHeader( oSettings.aoHeader, nThead[0] );
                anThs = _fnGetUniqueThs( oSettings );
            }
            
            
            if ( oInit.aoColumns === null )
            {
                aoColumnsInit = [];
                for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
                {
                    aoColumnsInit.push( null );
                }
            }
            else
            {
                aoColumnsInit = oInit.aoColumns;
            }
            
            
            for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
            {
                _fnAddColumn( oSettings, anThs ? anThs[i] : null );
            }
            
            
            _fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
                _fnColumnOptions( oSettings, iCol, oDef );
            } );
            
            
            if ( rowOne.length ) {
                var a = function ( cell, name ) {
                    return cell.getAttribute( 'data-'+name ) !== null ? name : null;
                };
            
                $( rowOne[0] ).children('th, td').each( function (i, cell) {
                    var col = oSettings.aoColumns[i];
            
                    if ( col.mData === i ) {
                        var sort = a( cell, 'sort' ) || a( cell, 'order' );
                        var filter = a( cell, 'filter' ) || a( cell, 'search' );
            
                        if ( sort !== null || filter !== null ) {
                            col.mData = {
                                _:      i+'.display',
                                sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
                                type:   sort !== null   ? i+'.@data-'+sort   : undefined,
                                filter: filter !== null ? i+'.@data-'+filter : undefined
                            };
            
                            _fnColumnOptions( oSettings, i );
                        }
                    }
                } );
            }
            
            var features = oSettings.oFeatures;
            
            
            if ( oInit.bStateSave )
            {
                features.bStateSave = true;
                _fnLoadState( oSettings, oInit );
                _fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
            }
            
            
            
            
            // If aaSorting is not defined, then we use the first indicator in asSorting
            // in case that has been altered, so the default sort reflects that option
            if ( oInit.aaSorting === undefined )
            {
                var sorting = oSettings.aaSorting;
                for ( i=0, iLen=sorting.length ; i<iLen ; i++ )
                {
                    sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
                }
            }
            
            
            _fnSortingClasses( oSettings );
            
            if ( features.bSort )
            {
                _fnCallbackReg( oSettings, 'aoDrawCallback', function () {
                    if ( oSettings.bSorted ) {
                        var aSort = _fnSortFlatten( oSettings );
                        var sortedColumns = {};
            
                        $.each( aSort, function (i, val) {
                            sortedColumns[ val.src ] = val.dir;
                        } );
            
                        _fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
                        _fnSortAria( oSettings );
                    }
                } );
            }
            
            _fnCallbackReg( oSettings, 'aoDrawCallback', function () {
                if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
                    _fnSortingClasses( oSettings );
                }
            }, 'sc' );
            
            
            
            
            // Work around for Webkit bug 83867 - store the caption-side before removing from doc
            var captions = $this.children('caption').each( function () {
                this._captionSide = $this.css('caption-side');
            } );
            
            var thead = $this.children('thead');
            if ( thead.length === 0 )
            {
                thead = $('<thead/>').appendTo(this);
            }
            oSettings.nTHead = thead[0];
            
            var tbody = $this.children('tbody');
            if ( tbody.length === 0 )
            {
                tbody = $('<tbody/>').appendTo(this);
            }
            oSettings.nTBody = tbody[0];
            
            var tfoot = $this.children('tfoot');
            if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") )
            {
                // If we are a scrolling table, and no footer has been given, then we need to create
                // a tfoot element for the caption element to be appended to
                tfoot = $('<tfoot/>').appendTo(this);
            }
            
            if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
                $this.addClass( oClasses.sNoFooter );
            }
            else if ( tfoot.length > 0 ) {
                oSettings.nTFoot = tfoot[0];
                _fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
            }
            
            
            if ( oInit.aaData )
            {
                for ( i=0 ; i<oInit.aaData.length ; i++ )
                {
                    _fnAddData( oSettings, oInit.aaData[ i ] );
                }
            }
            else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' )
            {
                
                _fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
            }
            
            
            oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
            
            
            oSettings.bInitialised = true;
            
            
            if ( bInitHandedOff === false )
            {
                _fnInitialise( oSettings );
            }
        } );
        _that = null;
        return this;
    };

    var __apiStruct = [];
    
    var __arrayProto = Array.prototype;
    
    var _toSettings = function ( mixed )
    {
        var idx, jq;
        var settings = DataTable.settings;
        var tables = $.map( settings, function (el, i) {
            return el.nTable;
        } );
    
        if ( ! mixed ) {
            return [];
        }
        else if ( mixed.nTable && mixed.oApi ) {
            // DataTables settings object
            return [ mixed ];
        }
        else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
            // Table node
            idx = $.inArray( mixed, tables );
            return idx !== -1 ? [ settings[idx] ] : null;
        }
        else if ( mixed && typeof mixed.settings === 'function' ) {
            return mixed.settings().toArray();
        }
        else if ( typeof mixed === 'string' ) {
            // jQuery selector
            jq = $(mixed);
        }
        else if ( mixed instanceof $ ) {
            // jQuery object (also DataTables instance)
            jq = mixed;
        }
    
        if ( jq ) {
            return jq.map( function(i) {
                idx = $.inArray( this, tables );
                return idx !== -1 ? settings[idx] : null;
            } ).toArray();
        }
    };

    _Api = function ( context, data )
    {
        if ( ! (this instanceof _Api) ) {
            return new _Api( context, data );
        }
    
        var settings = [];
        var ctxSettings = function ( o ) {
            var a = _toSettings( o );
            if ( a ) {
                settings = settings.concat( a );
            }
        };
    
        if ( $.isArray( context ) ) {
            for ( var i=0, ien=context.length ; i<ien ; i++ ) {
                ctxSettings( context[i] );
            }
        }
        else {
            ctxSettings( context );
        }
    
        // Remove duplicates
        this.context = _unique( settings );
    
        // Initial data
        if ( data ) {
            $.merge( this, data );
        }
    
        // selector
        this.selector = {
            rows: null,
            cols: null,
            opts: null
        };
    
        _Api.extend( this, this, __apiStruct );
    };
    
    DataTable.Api = _Api;

    $.extend( _Api.prototype, {
        any: function ()
        {
            return this.count() !== 0;
        },
    
    
        concat:  __arrayProto.concat,
    
    
        context: [], // array of table settings objects
    
    
        count: function ()
        {
            return this.flatten().length;
        },
    
    
        each: function ( fn )
        {
            for ( var i=0, ien=this.length ; i<ien; i++ ) {
                fn.call( this, this[i], i, this );
            }
    
            return this;
        },
    
    
        eq: function ( idx )
        {
            var ctx = this.context;
    
            return ctx.length > idx ?
                new _Api( ctx[idx], this[idx] ) :
                null;
        },
    
    
        filter: function ( fn )
        {
            var a = [];
    
            if ( __arrayProto.filter ) {
                a = __arrayProto.filter.call( this, fn, this );
            }
            else {
                // Compatibility for browsers without EMCA-252-5 (JS 1.6)
                for ( var i=0, ien=this.length ; i<ien ; i++ ) {
                    if ( fn.call( this, this[i], i, this ) ) {
                        a.push( this[i] );
                    }
                }
            }
    
            return new _Api( this.context, a );
        },
    
    
        flatten: function ()
        {
            var a = [];
            return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
        },
    
    
        join:    __arrayProto.join,
    
    
        indexOf: __arrayProto.indexOf || function (obj, start)
        {
            for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
                if ( this[i] === obj ) {
                    return i;
                }
            }
            return -1;
        },
    
        iterator: function ( flatten, type, fn, alwaysNew ) {
            var
                a = [], ret,
                i, ien, j, jen,
                context = this.context,
                rows, items, item,
                selector = this.selector;
    
            // Argument shifting
            if ( typeof flatten === 'string' ) {
                alwaysNew = fn;
                fn = type;
                type = flatten;
                flatten = false;
            }
    
            for ( i=0, ien=context.length ; i<ien ; i++ ) {
                var apiInst = new _Api( context[i] );
    
                if ( type === 'table' ) {
                    ret = fn.call( apiInst, context[i], i );
    
                    if ( ret !== undefined ) {
                        a.push( ret );
                    }
                }
                else if ( type === 'columns' || type === 'rows' ) {
                    // this has same length as context - one entry for each table
                    ret = fn.call( apiInst, context[i], this[i], i );
    
                    if ( ret !== undefined ) {
                        a.push( ret );
                    }
                }
                else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
                    // columns and rows share the same structure.
                    // 'this' is an array of column indexes for each context
                    items = this[i];
    
                    if ( type === 'column-rows' ) {
                        rows = _selector_row_indexes( context[i], selector.opts );
                    }
    
                    for ( j=0, jen=items.length ; j<jen ; j++ ) {
                        item = items[j];
    
                        if ( type === 'cell' ) {
                            ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
                        }
                        else {
                            ret = fn.call( apiInst, context[i], item, i, j, rows );
                        }
    
                        if ( ret !== undefined ) {
                            a.push( ret );
                        }
                    }
                }
            }
    
            if ( a.length || alwaysNew ) {
                var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
                var apiSelector = api.selector;
                apiSelector.rows = selector.rows;
                apiSelector.cols = selector.cols;
                apiSelector.opts = selector.opts;
                return api;
            }
            return this;
        },
    
    
        lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
        {
            // Bit cheeky...
            return this.indexOf.apply( this.toArray.reverse(), arguments );
        },
    
    
        length:  0,
    
    
        map: function ( fn )
        {
            var a = [];
    
            if ( __arrayProto.map ) {
                a = __arrayProto.map.call( this, fn, this );
            }
            else {
                // Compatibility for browsers without EMCA-252-5 (JS 1.6)
                for ( var i=0, ien=this.length ; i<ien ; i++ ) {
                    a.push( fn.call( this, this[i], i ) );
                }
            }
    
            return new _Api( this.context, a );
        },
    
    
        pluck: function ( prop )
        {
            return this.map( function ( el ) {
                return el[ prop ];
            } );
        },
    
        pop:     __arrayProto.pop,
    
    
        push:    __arrayProto.push,
    
    
        // Does not return an API instance
        reduce: __arrayProto.reduce || function ( fn, init )
        {
            return _fnReduce( this, fn, init, 0, this.length, 1 );
        },
    
    
        reduceRight: __arrayProto.reduceRight || function ( fn, init )
        {
            return _fnReduce( this, fn, init, this.length-1, -1, -1 );
        },
    
    
        reverse: __arrayProto.reverse,
    
    
        // Object with rows, columns and opts
        selector: null,
    
    
        shift:   __arrayProto.shift,
    
    
        sort:    __arrayProto.sort, // ? name - order?
    
    
        splice:  __arrayProto.splice,
    
    
        toArray: function ()
        {
            return __arrayProto.slice.call( this );
        },
    
    
        to$: function ()
        {
            return $( this );
        },
    
    
        toJQuery: function ()
        {
            return $( this );
        },
    
    
        unique: function ()
        {
            return new _Api( this.context, _unique(this) );
        },
    
    
        unshift: __arrayProto.unshift
    } );
    
    
    _Api.extend = function ( scope, obj, ext )
    {
        // Only extend API instances and static properties of the API
        if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
            return;
        }
    
        var
            i, ien,
            j, jen,
            struct, inner,
            methodScoping = function ( scope, fn, struc ) {
                return function () {
                    var ret = fn.apply( scope, arguments );
    
                    // Method extension
                    _Api.extend( ret, ret, struc.methodExt );
                    return ret;
                };
            };
    
        for ( i=0, ien=ext.length ; i<ien ; i++ ) {
            struct = ext[i];
    
            // Value
            obj[ struct.name ] = typeof struct.val === 'function' ?
                methodScoping( scope, struct.val, struct ) :
                $.isPlainObject( struct.val ) ?
                    {} :
                    struct.val;
    
            obj[ struct.name ].__dt_wrapper = true;
    
            // Property extension
            _Api.extend( scope, obj[ struct.name ], struct.propExt );
        }
    };

    _Api.register = _api_register = function ( name, val )
    {
        if ( $.isArray( name ) ) {
            for ( var j=0, jen=name.length ; j<jen ; j++ ) {
                _Api.register( name[j], val );
            }
            return;
        }
    
        var
            i, ien,
            heir = name.split('.'),
            struct = __apiStruct,
            key, method;
    
        var find = function ( src, name ) {
            for ( var i=0, ien=src.length ; i<ien ; i++ ) {
                if ( src[i].name === name ) {
                    return src[i];
                }
            }
            return null;
        };
    
        for ( i=0, ien=heir.length ; i<ien ; i++ ) {
            method = heir[i].indexOf('()') !== -1;
            key = method ?
                heir[i].replace('()', '') :
                heir[i];
    
            var src = find( struct, key );
            if ( ! src ) {
                src = {
                    name:      key,
                    val:       {},
                    methodExt: [],
                    propExt:   []
                };
                struct.push( src );
            }
    
            if ( i === ien-1 ) {
                src.val = val;
            }
            else {
                struct = method ?
                    src.methodExt :
                    src.propExt;
            }
        }
    };

    _Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
        _Api.register( pluralName, val );
    
        _Api.register( singularName, function () {
            var ret = val.apply( this, arguments );
    
            if ( ret === this ) {
                // Returned item is the API instance that was passed in, return it
                return this;
            }
            else if ( ret instanceof _Api ) {
                // New API instance returned, want the value from the first item
                // in the returned array for the singular result.
                return ret.length ?
                    $.isArray( ret[0] ) ?
                        new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
                        ret[0] :
                    undefined;
            }
    
            // Non-API return - just fire it back
            return ret;
        } );
    };

    var __table_selector = function ( selector, a )
    {
        // Integer is used to pick out a table by index
        if ( typeof selector === 'number' ) {
            return [ a[ selector ] ];
        }
    
        // Perform a jQuery selector on the table nodes
        var nodes = $.map( a, function (el, i) {
            return el.nTable;
        } );
    
        return $(nodes)
            .filter( selector )
            .map( function (i) {
                // Need to translate back from the table node to the settings
                var idx = $.inArray( this, nodes );
                return a[ idx ];
            } )
            .toArray();
    };

    _api_register( 'tables()', function ( selector ) {
        // A new instance is created if there was a selector specified
        return selector ?
            new _Api( __table_selector( selector, this.context ) ) :
            this;
    } );
    
    
    _api_register( 'table()', function ( selector ) {
        var tables = this.tables( selector );
        var ctx = tables.context;
    
        // Truncate to the first matched table
        return ctx.length ?
            new _Api( ctx[0] ) :
            tables;
    } );
    
    
    _api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
        return this.iterator( 'table', function ( ctx ) {
            return ctx.nTable;
        }, 1 );
    } );
    
    
    _api_registerPlural( 'tables().body()', 'table().body()' , function () {
        return this.iterator( 'table', function ( ctx ) {
            return ctx.nTBody;
        }, 1 );
    } );
    
    
    _api_registerPlural( 'tables().header()', 'table().header()' , function () {
        return this.iterator( 'table', function ( ctx ) {
            return ctx.nTHead;
        }, 1 );
    } );
    
    
    _api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
        return this.iterator( 'table', function ( ctx ) {
            return ctx.nTFoot;
        }, 1 );
    } );
    
    
    _api_registerPlural( 'tables().containers()', 'table().container()' , function () {
        return this.iterator( 'table', function ( ctx ) {
            return ctx.nTableWrapper;
        }, 1 );
    } );

    _api_register( 'draw()', function ( paging ) {
        return this.iterator( 'table', function ( settings ) {
            if ( paging === 'page' ) {
                _fnDraw( settings );
            }
            else {
                if ( typeof paging === 'string' ) {
                    paging = paging === 'full-hold' ?
                        false :
                        true;
                }
    
                _fnReDraw( settings, paging===false );
            }
        } );
    } );
    
    _api_register( 'page()', function ( action ) {
        if ( action === undefined ) {
            return this.page.info().page; // not an expensive call
        }
    
        // else, have an action to take on all tables
        return this.iterator( 'table', function ( settings ) {
            _fnPageChange( settings, action );
        } );
    } );

    _api_register( 'page.info()', function ( action ) {
        if ( this.context.length === 0 ) {
            return undefined;
        }
    
        var
            settings   = this.context[0],
            start      = settings._iDisplayStart,
            len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
            visRecords = settings.fnRecordsDisplay(),
            all        = len === -1;
    
        return {
            "page":           all ? 0 : Math.floor( start / len ),
            "pages":          all ? 1 : Math.ceil( visRecords / len ),
            "start":          start,
            "end":            settings.fnDisplayEnd(),
            "length":         len,
            "recordsTotal":   settings.fnRecordsTotal(),
            "recordsDisplay": visRecords,
            "serverSide":     _fnDataSource( settings ) === 'ssp'
        };
    } );

    _api_register( 'page.len()', function ( len ) {
        // Note that we can't call this function 'length()' because `length`
        // is a Javascript property of functions which defines how many arguments
        // the function expects.
        if ( len === undefined ) {
            return this.context.length !== 0 ?
                this.context[0]._iDisplayLength :
                undefined;
        }
    
        // else, set the page length
        return this.iterator( 'table', function ( settings ) {
            _fnLengthChange( settings, len );
        } );
    } );

    var __reload = function ( settings, holdPosition, callback ) {
        // Use the draw event to trigger a callback
        if ( callback ) {
            var api = new _Api( settings );
    
            api.one( 'draw', function () {
                callback( api.ajax.json() );
            } );
        }
    
        if ( _fnDataSource( settings ) == 'ssp' ) {
            _fnReDraw( settings, holdPosition );
        }
        else {
            _fnProcessingDisplay( settings, true );
    
            // Cancel an existing request
            var xhr = settings.jqXHR;
            if ( xhr && xhr.readyState !== 4 ) {
                xhr.abort();
            }
    
            // Trigger xhr
            _fnBuildAjax( settings, [], function( json ) {
                _fnClearTable( settings );
    
                var data = _fnAjaxDataSrc( settings, json );
                for ( var i=0, ien=data.length ; i<ien ; i++ ) {
                    _fnAddData( settings, data[i] );
                }
    
                _fnReDraw( settings, holdPosition );
                _fnProcessingDisplay( settings, false );
            } );
        }
    };

    _api_register( 'ajax.json()', function () {
        var ctx = this.context;
    
        if ( ctx.length > 0 ) {
            return ctx[0].json;
        }
    
        // else return undefined;
    } );

    _api_register( 'ajax.params()', function () {
        var ctx = this.context;
    
        if ( ctx.length > 0 ) {
            return ctx[0].oAjaxData;
        }
    
        // else return undefined;
    } );

    _api_register( 'ajax.reload()', function ( callback, resetPaging ) {
        return this.iterator( 'table', function (settings) {
            __reload( settings, resetPaging===false, callback );
        } );
    } );

    _api_register( 'ajax.url()', function ( url ) {
        var ctx = this.context;
    
        if ( url === undefined ) {
            // get
            if ( ctx.length === 0 ) {
                return undefined;
            }
            ctx = ctx[0];
    
            return ctx.ajax ?
                $.isPlainObject( ctx.ajax ) ?
                    ctx.ajax.url :
                    ctx.ajax :
                ctx.sAjaxSource;
        }
    
        // set
        return this.iterator( 'table', function ( settings ) {
            if ( $.isPlainObject( settings.ajax ) ) {
                settings.ajax.url = url;
            }
            else {
                settings.ajax = url;
            }
            // No need to consider sAjaxSource here since DataTables gives priority
            // to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
            // value of `sAjaxSource` redundant.
        } );
    } );

    _api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
        // Same as a reload, but makes sense to present it for easy access after a
        // url change
        return this.iterator( 'table', function ( ctx ) {
            __reload( ctx, resetPaging===false, callback );
        } );
    } );

    var _selector_run = function ( type, selector, selectFn, settings, opts )
    {
        var
            out = [], res,
            a, i, ien, j, jen,
            selectorType = typeof selector;
    
        // Can't just check for isArray here, as an API or jQuery instance might be
        // given with their array like look
        if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
            selector = [ selector ];
        }
    
        for ( i=0, ien=selector.length ; i<ien ; i++ ) {
            a = selector[i] && selector[i].split ?
                selector[i].split(',') :
                [ selector[i] ];
    
            for ( j=0, jen=a.length ; j<jen ; j++ ) {
                res = selectFn( typeof a[j] === 'string' ? $.trim(a[j]) : a[j] );
    
                if ( res && res.length ) {
                    out = out.concat( res );
                }
            }
        }
    
        // selector extensions
        var ext = _ext.selector[ type ];
        if ( ext.length ) {
            for ( i=0, ien=ext.length ; i<ien ; i++ ) {
                out = ext[i]( settings, opts, out );
            }
        }
    
        return _unique( out );
    };

    var _selector_opts = function ( opts )
    {
        if ( ! opts ) {
            opts = {};
        }
    
        // Backwards compatibility for 1.9- which used the terminology filter rather
        // than search
        if ( opts.filter && opts.search === undefined ) {
            opts.search = opts.filter;
        }
    
        return $.extend( {
            search: 'none',
            order: 'current',
            page: 'all'
        }, opts );
    };

    var _selector_first = function ( inst )
    {
        // Reduce the API instance to the first item found
        for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
            if ( inst[i].length > 0 ) {
                // Assign the first element to the first item in the instance
                // and truncate the instance and context
                inst[0] = inst[i];
                inst[0].length = 1;
                inst.length = 1;
                inst.context = [ inst.context[i] ];
    
                return inst;
            }
        }
    
        // Not found - return an empty instance
        inst.length = 0;
        return inst;
    };

    var _selector_row_indexes = function ( settings, opts )
    {
        var
            i, ien, tmp, a=[],
            displayFiltered = settings.aiDisplay,
            displayMaster = settings.aiDisplayMaster;
    
        var
            search = opts.search,  // none, applied, removed
            order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
            page   = opts.page;    // all, current
    
        if ( _fnDataSource( settings ) == 'ssp' ) {
            // In server-side processing mode, most options are irrelevant since
            // rows not shown don't exist and the index order is the applied order
            // Removed is a special case - for consistency just return an empty
            // array
            return search === 'removed' ?
                [] :
                _range( 0, displayMaster.length );
        }
        else if ( page == 'current' ) {
            // Current page implies that order=current and fitler=applied, since it is
            // fairly senseless otherwise, regardless of what order and search actually
            // are
            for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
                a.push( displayFiltered[i] );
            }
        }
        else if ( order == 'current' || order == 'applied' ) {
            a = search == 'none' ?
                displayMaster.slice() :                      // no search
                search == 'applied' ?
                    displayFiltered.slice() :                // applied search
                    $.map( displayMaster, function (el, i) { // removed search
                        return $.inArray( el, displayFiltered ) === -1 ? el : null;
                    } );
        }
        else if ( order == 'index' || order == 'original' ) {
            for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
                if ( search == 'none' ) {
                    a.push( i );
                }
                else { // applied | removed
                    tmp = $.inArray( i, displayFiltered );
    
                    if ((tmp === -1 && search == 'removed') ||
                        (tmp >= 0   && search == 'applied') )
                    {
                        a.push( i );
                    }
                }
            }
        }
    
        return a;
    };

    var __row_selector = function ( settings, selector, opts )
    {
        var run = function ( sel ) {
            var selInt = _intVal( sel );
            var i, ien;
    
            // Short cut - selector is a number and no options provided (default is
            // all records, so no need to check if the index is in there, since it
            // must be - dev error if the index doesn't exist).
            if ( selInt !== null && ! opts ) {
                return [ selInt ];
            }
    
            var rows = _selector_row_indexes( settings, opts );
    
            if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
                // Selector - integer
                return [ selInt ];
            }
            else if ( ! sel ) {
                // Selector - none
                return rows;
            }
    
            // Selector - function
            if ( typeof sel === 'function' ) {
                return $.map( rows, function (idx) {
                    var row = settings.aoData[ idx ];
                    return sel( idx, row._aData, row.nTr ) ? idx : null;
                } );
            }
    
            // Get nodes in the order from the `rows` array with null values removed
            var nodes = _removeEmpty(
                _pluck_order( settings.aoData, rows, 'nTr' )
            );
    
            // Selector - node
            if ( sel.nodeName ) {
                if ( $.inArray( sel, nodes ) !== -1 ) {
                    return [ sel._DT_RowIndex ]; // sel is a TR node that is in the table
                                                 // and DataTables adds a prop for fast lookup
                }
            }
    
            // ID selector. Want to always be able to select rows by id, regardless
            // of if the tr element has been created or not, so can't rely upon
            // jQuery here - hence a custom implementation. This does not match
            // Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
            // but to select it using a CSS selector engine (like Sizzle or
            // querySelect) it would need to need to be escaped for some characters.
            // DataTables simplifies this for row selectors since you can select
            // only a row. A # indicates an id any anything that follows is the id -
            // unescaped.
            if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
                // get row index from id
                var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
                if ( rowObj !== undefined ) {
                    return [ rowObj.idx ];
                }
    
                // need to fall through to jQuery in case there is DOM id that
                // matches
            }
    
            // Selector - jQuery selector string, array of nodes or jQuery object/
            // As jQuery's .filter() allows jQuery objects to be passed in filter,
            // it also allows arrays, so this will cope with all three options
            return $(nodes)
                .filter( sel )
                .map( function () {
                    return this._DT_RowIndex;
                } )
                .toArray();
        };
    
        return _selector_run( 'row', selector, run, settings, opts );
    };

    _api_register( 'rows()', function ( selector, opts ) {
        // argument shifting
        if ( selector === undefined ) {
            selector = '';
        }
        else if ( $.isPlainObject( selector ) ) {
            opts = selector;
            selector = '';
        }
    
        opts = _selector_opts( opts );
    
        var inst = this.iterator( 'table', function ( settings ) {
            return __row_selector( settings, selector, opts );
        }, 1 );
    
        // Want argument shifting here and in __row_selector?
        inst.selector.rows = selector;
        inst.selector.opts = opts;
    
        return inst;
    } );
    
    _api_register( 'rows().nodes()', function () {
        return this.iterator( 'row', function ( settings, row ) {
            return settings.aoData[ row ].nTr || undefined;
        }, 1 );
    } );
    
    _api_register( 'rows().data()', function () {
        return this.iterator( true, 'rows', function ( settings, rows ) {
            return _pluck_order( settings.aoData, rows, '_aData' );
        }, 1 );
    } );
    
    _api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
        return this.iterator( 'row', function ( settings, row ) {
            var r = settings.aoData[ row ];
            return type === 'search' ? r._aFilterData : r._aSortData;
        }, 1 );
    } );
    
    _api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
        return this.iterator( 'row', function ( settings, row ) {
            _fnInvalidate( settings, row, src );
        } );
    } );
    
    _api_registerPlural( 'rows().indexes()', 'row().index()', function () {
        return this.iterator( 'row', function ( settings, row ) {
            return row;
        }, 1 );
    } );
    
    _api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
        var a = [];
        var context = this.context;
    
        // `iterator` will drop undefined values, but in this case we want them
        for ( var i=0, ien=context.length ; i<ien ; i++ ) {
            for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
                var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
                a.push( (hash === true ? '#' : '' )+ id );
            }
        }
    
        return new _Api( context, a );
    } );
    
    _api_registerPlural( 'rows().remove()', 'row().remove()', function () {
        var that = this;
    
        this.iterator( 'row', function ( settings, row, thatIdx ) {
            var data = settings.aoData;
            var rowData = data[ row ];
            var i, ien, j, jen;
            var loopRow, loopCells;
    
            data.splice( row, 1 );
    
            // Update the cached indexes
            for ( i=0, ien=data.length ; i<ien ; i++ ) {
                loopRow = data[i];
                loopCells = loopRow.anCells;
    
                // Rows
                if ( loopRow.nTr !== null ) {
                    loopRow.nTr._DT_RowIndex = i;
                }
    
                // Cells
                if ( loopCells !== null ) {
                    for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
                        loopCells[j]._DT_CellIndex.row = i;
                    }
                }
            }
    
            // Delete from the display arrays
            _fnDeleteIndex( settings.aiDisplayMaster, row );
            _fnDeleteIndex( settings.aiDisplay, row );
            _fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
    
            // Check for an 'overflow' they case for displaying the table
            _fnLengthOverflow( settings );
    
            // Remove the row's ID reference if there is one
            var id = settings.rowIdFn( rowData._aData );
            if ( id !== undefined ) {
                delete settings.aIds[ id ];
            }
        } );
    
        this.iterator( 'table', function ( settings ) {
            for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
                settings.aoData[i].idx = i;
            }
        } );
    
        return this;
    } );
    
    
    _api_register( 'rows.add()', function ( rows ) {
        var newRows = this.iterator( 'table', function ( settings ) {
                var row, i, ien;
                var out = [];
    
                for ( i=0, ien=rows.length ; i<ien ; i++ ) {
                    row = rows[i];
    
                    if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
                        out.push( _fnAddTr( settings, row )[0] );
                    }
                    else {
                        out.push( _fnAddData( settings, row ) );
                    }
                }
    
                return out;
            }, 1 );
    
        // Return an Api.rows() extended instance, so rows().nodes() etc can be used
        var modRows = this.rows( -1 );
        modRows.pop();
        $.merge( modRows, newRows );
    
        return modRows;
    } );

    _api_register( 'row()', function ( selector, opts ) {
        return _selector_first( this.rows( selector, opts ) );
    } );

    _api_register( 'row().data()', function ( data ) {
        var ctx = this.context;
    
        if ( data === undefined ) {
            // Get
            return ctx.length && this.length ?
                ctx[0].aoData[ this[0] ]._aData :
                undefined;
        }
    
        // Set
        ctx[0].aoData[ this[0] ]._aData = data;
    
        // Automatically invalidate
        _fnInvalidate( ctx[0], this[0], 'data' );
    
        return this;
    } );

    _api_register( 'row().node()', function () {
        var ctx = this.context;
    
        return ctx.length && this.length ?
            ctx[0].aoData[ this[0] ].nTr || null :
            null;
    } );

    _api_register( 'row.add()', function ( row ) {
        // Allow a jQuery object to be passed in - only a single row is added from
        // it though - the first element in the set
        if ( row instanceof $ && row.length ) {
            row = row[0];
        }
    
        var rows = this.iterator( 'table', function ( settings ) {
            if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
                return _fnAddTr( settings, row )[0];
            }
            return _fnAddData( settings, row );
        } );
    
        // Return an Api.rows() extended instance, with the newly added row selected
        return this.row( rows[0] );
    } );

    var __details_add = function ( ctx, row, data, klass )
    {
        // Convert to array of TR elements
        var rows = [];
        var addRow = function ( r, k ) {
            // Recursion to allow for arrays of jQuery objects
            if ( $.isArray( r ) || r instanceof $ ) {
                for ( var i=0, ien=r.length ; i<ien ; i++ ) {
                    addRow( r[i], k );
                }
                return;
            }
    
            // If we get a TR element, then just add it directly - up to the dev
            // to add the correct number of columns etc
            if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
                rows.push( r );
            }
            else {
                // Otherwise create a row with a wrapper
                var created = $('<tr><td/></tr>').addClass( k );
                $('td', created)
                    .addClass(k)
                    .html(r)[0].colSpan = _fnVisbleColumns( ctx );
    
                rows.push( created[0] );
            }
        };
    
        addRow( data, klass );
    
        if ( row._details ) {
            row._details.remove();
        }
    
        row._details = $(rows);
    
        // If the children were already shown, that state should be retained
        if ( row._detailsShow ) {
            row._details.insertAfter( row.nTr );
        }
    };
    
    var __details_remove = function ( api, idx )
    {
        var ctx = api.context;
    
        if ( ctx.length ) {
            var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
    
            if ( row && row._details ) {
                row._details.remove();
    
                row._detailsShow = undefined;
                row._details = undefined;
            }
        }
    };

    var __details_display = function ( api, show ) {
        var ctx = api.context;
    
        if ( ctx.length && api.length ) {
            var row = ctx[0].aoData[ api[0] ];
    
            if ( row._details ) {
                row._detailsShow = show;
    
                if ( show ) {
                    row._details.insertAfter( row.nTr );
                }
                else {
                    row._details.detach();
                }
    
                __details_events( ctx[0] );
            }
        }
    };

    var __details_events = function ( settings )
    {
        var api = new _Api( settings );
        var namespace = '.dt.DT_details';
        var drawEvent = 'draw'+namespace;
        var colvisEvent = 'column-visibility'+namespace;
        var destroyEvent = 'destroy'+namespace;
        var data = settings.aoData;
    
        api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
    
        if ( _pluck( data, '_details' ).length > 0 ) {
            // On each draw, insert the required elements into the document
            api.on( drawEvent, function ( e, ctx ) {
                if ( settings !== ctx ) {
                    return;
                }
    
                api.rows( {page:'current'} ).eq(0).each( function (idx) {
                    // Internal data grab
                    var row = data[ idx ];
    
                    if ( row._detailsShow ) {
                        row._details.insertAfter( row.nTr );
                    }
                } );
            } );
    
            // Column visibility change - update the colspan
            api.on( colvisEvent, function ( e, ctx, idx, vis ) {
                if ( settings !== ctx ) {
                    return;
                }
    
                // Update the colspan for the details rows (note, only if it already has
                // a colspan)
                var row, visible = _fnVisbleColumns( ctx );
    
                for ( var i=0, ien=data.length ; i<ien ; i++ ) {
                    row = data[i];
    
                    if ( row._details ) {
                        row._details.children('td[colspan]').attr('colspan', visible );
                    }
                }
            } );
    
            // Table destroyed - nuke any child rows
            api.on( destroyEvent, function ( e, ctx ) {
                if ( settings !== ctx ) {
                    return;
                }
    
                for ( var i=0, ien=data.length ; i<ien ; i++ ) {
                    if ( data[i]._details ) {
                        __details_remove( api, i );
                    }
                }
            } );
        }
    };
    
    // Strings for the method names to help minification
    var _emp = '';
    var _child_obj = _emp+'row().child';
    var _child_mth = _child_obj+'()';
    
    // data can be:
    //  tr
    //  string
    //  jQuery or array of any of the above
    _api_register( _child_mth, function ( data, klass ) {
        var ctx = this.context;
    
        if ( data === undefined ) {
            // get
            return ctx.length && this.length ?
                ctx[0].aoData[ this[0] ]._details :
                undefined;
        }
        else if ( data === true ) {
            // show
            this.child.show();
        }
        else if ( data === false ) {
            // remove
            __details_remove( this );
        }
        else if ( ctx.length && this.length ) {
            // set
            __details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
        }
    
        return this;
    } );
    
    
    _api_register( [
        _child_obj+'.show()',
        _child_mth+'.show()' // only when `child()` was called with parameters (without
    ], function ( show ) {   // it returns an object and this method is not executed)
        __details_display( this, true );
        return this;
    } );
    
    
    _api_register( [
        _child_obj+'.hide()',
        _child_mth+'.hide()' // only when `child()` was called with parameters (without
    ], function () {         // it returns an object and this method is not executed)
        __details_display( this, false );
        return this;
    } );
    
    
    _api_register( [
        _child_obj+'.remove()',
        _child_mth+'.remove()' // only when `child()` was called with parameters (without
    ], function () {           // it returns an object and this method is not executed)
        __details_remove( this );
        return this;
    } );

    _api_register( _child_obj+'.isShown()', function () {
        var ctx = this.context;
    
        if ( ctx.length && this.length ) {
            // _detailsShown as false or undefined will fall through to return false
            return ctx[0].aoData[ this[0] ]._detailsShow || false;
        }
        return false;
    } );

    var __re_column_selector = /^(.+):(name|visIdx|visible)$/;

    var __columnData = function ( settings, column, r1, r2, rows ) {
        var a = [];
        for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
            a.push( _fnGetCellData( settings, rows[row], column ) );
        }
        return a;
    };
    
    
    var __column_selector = function ( settings, selector, opts )
    {
        var
            columns = settings.aoColumns,
            names = _pluck( columns, 'sName' ),
            nodes = _pluck( columns, 'nTh' );
    
        var run = function ( s ) {
            var selInt = _intVal( s );
    
            // Selector - all
            if ( s === '' ) {
                return _range( columns.length );
            }
            
            // Selector - index
            if ( selInt !== null ) {
                return [ selInt >= 0 ?
                    selInt : // Count from left
                    columns.length + selInt // Count from right (+ because its a negative value)
                ];
            }
            
            // Selector = function
            if ( typeof s === 'function' ) {
                var rows = _selector_row_indexes( settings, opts );
    
                return $.map( columns, function (col, idx) {
                    return s(
                            idx,
                            __columnData( settings, idx, 0, 0, rows ),
                            nodes[ idx ]
                        ) ? idx : null;
                } );
            }
    
            // jQuery or string selector
            var match = typeof s === 'string' ?
                s.match( __re_column_selector ) :
                '';
    
            if ( match ) {
                switch( match[2] ) {
                    case 'visIdx':
                    case 'visible':
                        var idx = parseInt( match[1], 10 );
                        // Visible index given, convert to column index
                        if ( idx < 0 ) {
                            // Counting from the right
                            var visColumns = $.map( columns, function (col,i) {
                                return col.bVisible ? i : null;
                            } );
                            return [ visColumns[ visColumns.length + idx ] ];
                        }
                        // Counting from the left
                        return [ _fnVisibleToColumnIndex( settings, idx ) ];
    
                    case 'name':
                        // match by name. `names` is column index complete and in order
                        return $.map( names, function (name, i) {
                            return name === match[1] ? i : null;
                        } );
                }
            }
            else {
                // jQuery selector on the TH elements for the columns
                return $( nodes )
                    .filter( s )
                    .map( function () {
                        return $.inArray( this, nodes ); // `nodes` is column index complete and in order
                    } )
                    .toArray();
            }
        };
    
        return _selector_run( 'column', selector, run, settings, opts );
    };
    
    
    var __setColumnVis = function ( settings, column, vis, recalc ) {
        var
            cols = settings.aoColumns,
            col  = cols[ column ],
            data = settings.aoData,
            row, cells, i, ien, tr;
    
        // Get
        if ( vis === undefined ) {
            return col.bVisible;
        }
    
        // Set
        // No change
        if ( col.bVisible === vis ) {
            return;
        }
    
        if ( vis ) {
            // Insert column
            // Need to decide if we should use appendChild or insertBefore
            var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
    
            for ( i=0, ien=data.length ; i<ien ; i++ ) {
                tr = data[i].nTr;
                cells = data[i].anCells;
    
                if ( tr ) {
                    // insertBefore can act like appendChild if 2nd arg is null
                    tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
                }
            }
        }
        else {
            // Remove column
            $( _pluck( settings.aoData, 'anCells', column ) ).detach();
        }
    
        // Common actions
        col.bVisible = vis;
        _fnDrawHead( settings, settings.aoHeader );
        _fnDrawHead( settings, settings.aoFooter );
    
        if ( recalc === undefined || recalc ) {
            // Automatically adjust column sizing
            _fnAdjustColumnSizing( settings );
    
            // Realign columns for scrolling
            if ( settings.oScroll.sX || settings.oScroll.sY ) {
                _fnScrollDraw( settings );
            }
        }
    
        _fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, recalc] );
    
        _fnSaveState( settings );
    };
    
    
    _api_register( 'columns()', function ( selector, opts ) {
        // argument shifting
        if ( selector === undefined ) {
            selector = '';
        }
        else if ( $.isPlainObject( selector ) ) {
            opts = selector;
            selector = '';
        }
    
        opts = _selector_opts( opts );
    
        var inst = this.iterator( 'table', function ( settings ) {
            return __column_selector( settings, selector, opts );
        }, 1 );
    
        // Want argument shifting here and in _row_selector?
        inst.selector.cols = selector;
        inst.selector.opts = opts;
    
        return inst;
    } );
    
    _api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
        return this.iterator( 'column', function ( settings, column ) {
            return settings.aoColumns[column].nTh;
        }, 1 );
    } );
    
    _api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
        return this.iterator( 'column', function ( settings, column ) {
            return settings.aoColumns[column].nTf;
        }, 1 );
    } );
    
    _api_registerPlural( 'columns().data()', 'column().data()', function () {
        return this.iterator( 'column-rows', __columnData, 1 );
    } );
    
    _api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
        return this.iterator( 'column', function ( settings, column ) {
            return settings.aoColumns[column].mData;
        }, 1 );
    } );
    
    _api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
        return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
            return _pluck_order( settings.aoData, rows,
                type === 'search' ? '_aFilterData' : '_aSortData', column
            );
        }, 1 );
    } );
    
    _api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
        return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
            return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
        }, 1 );
    } );
    
    _api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
        return this.iterator( 'column', function ( settings, column ) {
            if ( vis === undefined ) {
                return settings.aoColumns[ column ].bVisible;
            } // else
            __setColumnVis( settings, column, vis, calc );
        } );
    } );
    
    _api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
        return this.iterator( 'column', function ( settings, column ) {
            return type === 'visible' ?
                _fnColumnIndexToVisible( settings, column ) :
                column;
        }, 1 );
    } );
    
    _api_register( 'columns.adjust()', function () {
        return this.iterator( 'table', function ( settings ) {
            _fnAdjustColumnSizing( settings );
        }, 1 );
    } );
    
    _api_register( 'column.index()', function ( type, idx ) {
        if ( this.context.length !== 0 ) {
            var ctx = this.context[0];
    
            if ( type === 'fromVisible' || type === 'toData' ) {
                return _fnVisibleToColumnIndex( ctx, idx );
            }
            else if ( type === 'fromData' || type === 'toVisible' ) {
                return _fnColumnIndexToVisible( ctx, idx );
            }
        }
    } );
    
    _api_register( 'column()', function ( selector, opts ) {
        return _selector_first( this.columns( selector, opts ) );
    } );

    var __cell_selector = function ( settings, selector, opts )
    {
        var data = settings.aoData;
        var rows = _selector_row_indexes( settings, opts );
        var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
        var allCells = $( [].concat.apply([], cells) );
        var row;
        var columns = settings.aoColumns.length;
        var a, i, ien, j, o, host;
    
        var run = function ( s ) {
            var fnSelector = typeof s === 'function';
    
            if ( s === null || s === undefined || fnSelector ) {
                // All cells and function selectors
                a = [];
    
                for ( i=0, ien=rows.length ; i<ien ; i++ ) {
                    row = rows[i];
    
                    for ( j=0 ; j<columns ; j++ ) {
                        o = {
                            row: row,
                            column: j
                        };
    
                        if ( fnSelector ) {
                            // Selector - function
                            host = data[ row ];
    
                            if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
                                a.push( o );
                            }
                        }
                        else {
                            // Selector - all
                            a.push( o );
                        }
                    }
                }
    
                return a;
            }
            
            // Selector - index
            if ( $.isPlainObject( s ) ) {
                return [s];
            }
    
            // Selector - jQuery filtered cells
            return allCells
                .filter( s )
                .map( function (i, el) {
                    return { // use a new object, in case someone changes the values
                        row:    el._DT_CellIndex.row,
                        column: el._DT_CellIndex.column
                    };
                } )
                .toArray();
        };
    
        return _selector_run( 'cell', selector, run, settings, opts );
    };
    
    _api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
        // Argument shifting
        if ( $.isPlainObject( rowSelector ) ) {
            // Indexes
            if ( rowSelector.row === undefined ) {
                // Selector options in first parameter
                opts = rowSelector;
                rowSelector = null;
            }
            else {
                // Cell index objects in first parameter
                opts = columnSelector;
                columnSelector = null;
            }
        }
        if ( $.isPlainObject( columnSelector ) ) {
            opts = columnSelector;
            columnSelector = null;
        }
    
        // Cell selector
        if ( columnSelector === null || columnSelector === undefined ) {
            return this.iterator( 'table', function ( settings ) {
                return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
            } );
        }
    
        // Row + column selector
        var columns = this.columns( columnSelector, opts );
        var rows = this.rows( rowSelector, opts );
        var a, i, ien, j, jen;
    
        var cells = this.iterator( 'table', function ( settings, idx ) {
            a = [];
    
            for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
                for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
                    a.push( {
                        row:    rows[idx][i],
                        column: columns[idx][j]
                    } );
                }
            }
    
            return a;
        }, 1 );
    
        $.extend( cells.selector, {
            cols: columnSelector,
            rows: rowSelector,
            opts: opts
        } );
    
        return cells;
    } );
    
    
    _api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
        return this.iterator( 'cell', function ( settings, row, column ) {
            var cells = settings.aoData[ row ].anCells;
            return cells ?
                cells[ column ] :
                undefined;
        }, 1 );
    } );
    
    
    _api_register( 'cells().data()', function () {
        return this.iterator( 'cell', function ( settings, row, column ) {
            return _fnGetCellData( settings, row, column );
        }, 1 );
    } );
    
    
    _api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
        type = type === 'search' ? '_aFilterData' : '_aSortData';
    
        return this.iterator( 'cell', function ( settings, row, column ) {
            return settings.aoData[ row ][ type ][ column ];
        }, 1 );
    } );
    
    
    _api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
        return this.iterator( 'cell', function ( settings, row, column ) {
            return _fnGetCellData( settings, row, column, type );
        }, 1 );
    } );
    
    
    _api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
        return this.iterator( 'cell', function ( settings, row, column ) {
            return {
                row: row,
                column: column,
                columnVisible: _fnColumnIndexToVisible( settings, column )
            };
        }, 1 );
    } );
    
    
    _api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
        return this.iterator( 'cell', function ( settings, row, column ) {
            _fnInvalidate( settings, row, src, column );
        } );
    } );
    
    
    
    _api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
        return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
    } );
    
    
    _api_register( 'cell().data()', function ( data ) {
        var ctx = this.context;
        var cell = this[0];
    
        if ( data === undefined ) {
            // Get
            return ctx.length && cell.length ?
                _fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
                undefined;
        }
    
        // Set
        _fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
        _fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
    
        return this;
    } );
    
    _api_register( 'order()', function ( order, dir ) {
        var ctx = this.context;
    
        if ( order === undefined ) {
            // get
            return ctx.length !== 0 ?
                ctx[0].aaSorting :
                undefined;
        }
    
        // set
        if ( typeof order === 'number' ) {
            // Simple column / direction passed in
            order = [ [ order, dir ] ];
        }
        else if ( ! $.isArray( order[0] ) ) {
            // Arguments passed in (list of 1D arrays)
            order = Array.prototype.slice.call( arguments );
        }
        // otherwise a 2D array was passed in
    
        return this.iterator( 'table', function ( settings ) {
            settings.aaSorting = order.slice();
        } );
    } );
    
    _api_register( 'order.listener()', function ( node, column, callback ) {
        return this.iterator( 'table', function ( settings ) {
            _fnSortAttachListener( settings, node, column, callback );
        } );
    } );

    _api_register( 'order.fixed()', function ( set ) {
        if ( ! set ) {
            var ctx = this.context;
            var fixed = ctx.length ?
                ctx[0].aaSortingFixed :
                undefined;
    
            return $.isArray( fixed ) ?
                { pre: fixed } :
                fixed;
        }
    
        return this.iterator( 'table', function ( settings ) {
            settings.aaSortingFixed = $.extend( true, {}, set );
        } );
    } );
    
    _api_register( [
        'columns().order()',
        'column().order()'
    ], function ( dir ) {
        var that = this;
    
        return this.iterator( 'table', function ( settings, i ) {
            var sort = [];
    
            $.each( that[i], function (j, col) {
                sort.push( [ col, dir ] );
            } );
    
            settings.aaSorting = sort;
        } );
    } );
    
    _api_register( 'search()', function ( input, regex, smart, caseInsen ) {
        var ctx = this.context;
    
        if ( input === undefined ) {
            // get
            return ctx.length !== 0 ?
                ctx[0].oPreviousSearch.sSearch :
                undefined;
        }
    
        // set
        return this.iterator( 'table', function ( settings ) {
            if ( ! settings.oFeatures.bFilter ) {
                return;
            }
    
            _fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
                "sSearch": input+"",
                "bRegex":  regex === null ? false : regex,
                "bSmart":  smart === null ? true  : smart,
                "bCaseInsensitive": caseInsen === null ? true : caseInsen
            } ), 1 );
        } );
    } );
    
    
    _api_registerPlural(
        'columns().search()',
        'column().search()',
        function ( input, regex, smart, caseInsen ) {
            return this.iterator( 'column', function ( settings, column ) {
                var preSearch = settings.aoPreSearchCols;
    
                if ( input === undefined ) {
                    // get
                    return preSearch[ column ].sSearch;
                }
    
                // set
                if ( ! settings.oFeatures.bFilter ) {
                    return;
                }
    
                $.extend( preSearch[ column ], {
                    "sSearch": input+"",
                    "bRegex":  regex === null ? false : regex,
                    "bSmart":  smart === null ? true  : smart,
                    "bCaseInsensitive": caseInsen === null ? true : caseInsen
                } );
    
                _fnFilterComplete( settings, settings.oPreviousSearch, 1 );
            } );
        }
    );
    
    
    
    _api_register( 'state()', function () {
        return this.context.length ?
            this.context[0].oSavedState :
            null;
    } );
    
    
    _api_register( 'state.clear()', function () {
        return this.iterator( 'table', function ( settings ) {
            // Save an empty object
            settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
        } );
    } );
    
    
    _api_register( 'state.loaded()', function () {
        return this.context.length ?
            this.context[0].oLoadedState :
            null;
    } );
    
    
    _api_register( 'state.save()', function () {
        return this.iterator( 'table', function ( settings ) {
            _fnSaveState( settings );
        } );
    } );

    DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
    {
        var aThis = DataTable.version.split('.');
        var aThat = version.split('.');
        var iThis, iThat;
    
        for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
            iThis = parseInt( aThis[i], 10 ) || 0;
            iThat = parseInt( aThat[i], 10 ) || 0;
    
            // Parts are the same, keep comparing
            if (iThis === iThat) {
                continue;
            }
    
            // Parts are different, return immediately
            return iThis > iThat;
        }
    
        return true;
    };

    DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
    {
        var t = $(table).get(0);
        var is = false;
    
        $.each( DataTable.settings, function (i, o) {
            var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
            var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
    
            if ( o.nTable === t || head === t || foot === t ) {
                is = true;
            }
        } );
    
        return is;
    };

    DataTable.tables = DataTable.fnTables = function ( visible )
    {
        var api = false;
    
        if ( $.isPlainObject( visible ) ) {
            api = visible.api;
            visible = visible.visible;
        }
    
        var a = $.map( DataTable.settings, function (o) {
            if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
                return o.nTable;
            }
        } );
    
        return api ?
            new _Api( a ) :
            a;
    };

    DataTable.util = {
        throttle: _fnThrottle,
        escapeRegex: _fnEscapeRegex
    };

    DataTable.camelToHungarian = _fnCamelToHungarian;

    _api_register( '$()', function ( selector, opts ) {
        var
            rows   = this.rows( opts ).nodes(), // Get all rows
            jqRows = $(rows);
    
        return $( [].concat(
            jqRows.filter( selector ).toArray(),
            jqRows.find( selector ).toArray()
        ) );
    } );
    
    
    // jQuery functions to operate on the tables
    $.each( [ 'on', 'one', 'off' ], function (i, key) {
        _api_register( key+'()', function (  ) {
            var args = Array.prototype.slice.call(arguments);
    
            // Add the `dt` namespace automatically if it isn't already present
            if ( ! args[0].match(/\.dt\b/) ) {
                args[0] += '.dt';
            }
    
            var inst = $( this.tables().nodes() );
            inst[key].apply( inst, args );
            return this;
        } );
    } );
    
    
    _api_register( 'clear()', function () {
        return this.iterator( 'table', function ( settings ) {
            _fnClearTable( settings );
        } );
    } );
    
    
    _api_register( 'settings()', function () {
        return new _Api( this.context, this.context );
    } );
    
    
    _api_register( 'init()', function () {
        var ctx = this.context;
        return ctx.length ? ctx[0].oInit : null;
    } );
    
    
    _api_register( 'data()', function () {
        return this.iterator( 'table', function ( settings ) {
            return _pluck( settings.aoData, '_aData' );
        } ).flatten();
    } );
    
    
    _api_register( 'destroy()', function ( remove ) {
        remove = remove || false;
    
        return this.iterator( 'table', function ( settings ) {
            var orig      = settings.nTableWrapper.parentNode;
            var classes   = settings.oClasses;
            var table     = settings.nTable;
            var tbody     = settings.nTBody;
            var thead     = settings.nTHead;
            var tfoot     = settings.nTFoot;
            var jqTable   = $(table);
            var jqTbody   = $(tbody);
            var jqWrapper = $(settings.nTableWrapper);
            var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
            var i, ien;
    
            // Flag to note that the table is currently being destroyed - no action
            // should be taken
            settings.bDestroying = true;
    
            // Fire off the destroy callbacks for plug-ins etc
            _fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
    
            // If not being removed from the document, make all columns visible
            if ( ! remove ) {
                new _Api( settings ).columns().visible( true );
            }
    
            // Blitz all `DT` namespaced events (these are internal events, the
            // lowercase, `dt` events are user subscribed and they are responsible
            // for removing them
            jqWrapper.unbind('.DT').find(':not(tbody *)').unbind('.DT');
            $(window).unbind('.DT-'+settings.sInstance);
    
            // When scrolling we had to break the table up - restore it
            if ( table != thead.parentNode ) {
                jqTable.children('thead').detach();
                jqTable.append( thead );
            }
    
            if ( tfoot && table != tfoot.parentNode ) {
                jqTable.children('tfoot').detach();
                jqTable.append( tfoot );
            }
    
            settings.aaSorting = [];
            settings.aaSortingFixed = [];
            _fnSortingClasses( settings );
    
            $( rows ).removeClass( settings.asStripeClasses.join(' ') );
    
            $('th, td', thead).removeClass( classes.sSortable+' '+
                classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
            );
    
            if ( settings.bJUI ) {
                $('th span.'+classes.sSortIcon+ ', td span.'+classes.sSortIcon, thead).detach();
                $('th, td', thead).each( function () {
                    var wrapper = $('div.'+classes.sSortJUIWrapper, this);
                    $(this).append( wrapper.contents() );
                    wrapper.detach();
                } );
            }
    
            // Add the TR elements back into the table in their original order
            jqTbody.children().detach();
            jqTbody.append( rows );
    
            // Remove the DataTables generated nodes, events and classes
            var removedMethod = remove ? 'remove' : 'detach';
            jqTable[ removedMethod ]();
            jqWrapper[ removedMethod ]();
    
            // If we need to reattach the table to the document
            if ( ! remove && orig ) {
                // insertBefore acts like appendChild if !arg[1]
                orig.insertBefore( table, settings.nTableReinsertBefore );
    
                // Restore the width of the original table - was read from the style property,
                // so we can restore directly to that
                jqTable
                    .css( 'width', settings.sDestroyWidth )
                    .removeClass( classes.sTable );
    
                // If the were originally stripe classes - then we add them back here.
                // Note this is not fool proof (for example if not all rows had stripe
                // classes - but it's a good effort without getting carried away
                ien = settings.asDestroyStripes.length;
    
                if ( ien ) {
                    jqTbody.children().each( function (i) {
                        $(this).addClass( settings.asDestroyStripes[i % ien] );
                    } );
                }
            }
    
            
            var idx = $.inArray( settings, DataTable.settings );
            if ( idx !== -1 ) {
                DataTable.settings.splice( idx, 1 );
            }
        } );
    } );
    
    
    // Add the `every()` method for rows, columns and cells in a compact form
    $.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
        _api_register( type+'s().every()', function ( fn ) {
            var opts = this.selector.opts;
            var api = this;
    
            return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
                // Rows and columns:
                //  arg1 - index
                //  arg2 - table counter
                //  arg3 - loop counter
                //  arg4 - undefined
                // Cells:
                //  arg1 - row index
                //  arg2 - column index
                //  arg3 - table counter
                //  arg4 - loop counter
                fn.call(
                    api[ type ](
                        arg1,
                        type==='cell' ? arg2 : opts,
                        type==='cell' ? opts : undefined
                    ),
                    arg1, arg2, arg3, arg4
                );
            } );
        } );
    } );
    
    
    // i18n method for extensions to be able to use the language object from the
    // DataTable
    _api_register( 'i18n()', function ( token, def, plural ) {
        var ctx = this.context[0];
        var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
    
        if ( resolved === undefined ) {
            resolved = def;
        }
    
        if ( plural !== undefined && $.isPlainObject( resolved ) ) {
            resolved = resolved[ plural ] !== undefined ?
                resolved[ plural ] :
                resolved._;
        }
    
        return resolved.replace( '%d', plural ); // nb: plural might be undefined,
    } );

    /**
     * Version string for plug-ins to check compatibility. Allowed format is
     * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
     * only for non-release builds. See http://semver.org/ for more information.
     *  @member
     *  @type string
     *  @default Version number
     */
    DataTable.version = "1.10.10";

    
    DataTable.settings = [];

    
    DataTable.models = {};
    
    
    
    
    DataTable.models.oSearch = {
        
        "bCaseInsensitive": true,
    
        /**
         * Applied search term
         *  @type string
         *  @default <i>Empty string</i>
         */
        "sSearch": "",
    
        
        "bRegex": false,
    
        
        "bSmart": true
    };

    DataTable.models.oRow = {
        
        "nTr": null,
    
        
        "anCells": null,
    
        
        "_aData": [],
    
        
        "_aSortData": null,
    
        
        "_aFilterData": null,
    
        
        "_sFilterRow": null,
    
        /**
         * Cache of the class name that DataTables has applied to the row, so we
         * can quickly look at this variable rather than needing to do a DOM check
         * on className for the nTr property.
         *  @type string
         *  @default <i>Empty string</i>
         *  @private
         */
        "_sRowStripe": "",
    
        
        "src": null,
    
        
        "idx": -1
    };
    
    DataTable.models.oColumn = {
        
        "idx": null,
    
        /**
         * A list of the columns that sorting should occur on when this column
         * is sorted. That this property is an array allows multi-column sorting
         * to be defined for a column (for example first name / last name columns
         * would benefit from this). The values are integers pointing to the
         * columns to be sorted on (typically it will be a single integer pointing
         * at itself, but that doesn't need to be the case).
         *  @type array
         */
        "aDataSort": null,
    
        
        "asSorting": null,
    
        
        "bSearchable": null,
    
        
        "bSortable": null,
    
        
        "bVisible": null,
    
        
        "_sManualType": null,
    
        
        "_bAttrSrc": false,
    
        
        "fnCreatedCell": null,
    
        /**
         * Function to get data from a cell in a column. You should <b>never</b>
         * access data directly through _aData internally in DataTables - always use
         * the method attached to this property. It allows mData to function as
         * required. This function is automatically assigned by the column
         * initialisation method
         *  @type function
         *  @param {array|object} oData The data array/object for the array
         *    (i.e. aoData[]._aData)
         *  @param {string} sSpecific The specific data type you want to get -
         *    'display', 'type' 'filter' 'sort'
         *  @returns {*} The data for the cell from the given row's data
         *  @default null
         */
        "fnGetData": null,
    
        /**
         * Function to set data for a cell in the column. You should <b>never</b>
         * set the data directly to _aData internally in DataTables - always use
         * this method. It allows mData to function as required. This function
         * is automatically assigned by the column initialisation method
         *  @type function
         *  @param {array|object} oData The data array/object for the array
         *    (i.e. aoData[]._aData)
         *  @param {*} sValue Value to set
         *  @default null
         */
        "fnSetData": null,
    
        /**
         * Property to read the value for the cells in the column from the data
         * source array / object. If null, then the default content is used, if a
         * function is given then the return from the function is used.
         *  @type function|int|string|null
         *  @default null
         */
        "mData": null,
    
        
        "mRender": null,
    
        /**
         * Unique header TH/TD element for this column - this is what the sorting
         * listener is attached to (if sorting is enabled.)
         *  @type node
         *  @default null
         */
        "nTh": null,
    
        /**
         * Unique footer TH/TD element for this column (if there is one). Not used
         * in DataTables as such, but can be used for plug-ins to reference the
         * footer for each column.
         *  @type node
         *  @default null
         */
        "nTf": null,
    
        
        "sClass": null,
    
        
        "sContentPadding": null,
    
        
        "sDefaultContent": null,
    
        
        "sName": null,
    
        
        "sSortDataType": 'std',
    
        
        "sSortingClass": null,
    
        
        "sSortingClassJUI": null,
    
        
        "sTitle": null,
    
        
        "sType": null,
    
        
        "sWidth": null,
    
        
        "sWidthOrig": null
    };

    DataTable.defaults = {
        "aaData": null,
        "aaSorting": [[0,'asc']],
        "aaSortingFixed": [],
        "ajax": null,
        "aLengthMenu": [ 10, 25, 50, 100 ],
        "aoColumns": null,
        "aoColumnDefs": null,
        "aoSearchCols": [],
        "asStripeClasses": null,
        "bAutoWidth": true,
        "bDeferRender": false,
        "bDestroy": false,
        "bFilter": true,
        "bInfo": true,
        "bJQueryUI": false,
        "bLengthChange": true,
        "bPaginate": true,
        "bProcessing": false,
        "bRetrieve": false,
        "bScrollCollapse": false,
        "bServerSide": false,
        "bSort": true,
        "bSortMulti": true,
        "bSortCellsTop": false,
        "bSortClasses": true,
        "bStateSave": false,
        "fnCreatedRow": null,
        "fnDrawCallback": null,
        "fnFooterCallback": null,
        "fnFormatNumber": function ( toFormat ) {
            return toFormat.toString().replace(
                /\B(?=(\d{3})+(?!\d))/g,
                this.oLanguage.sThousands
            );
        },
        "fnHeaderCallback": null,
        "fnInfoCallback": null,    
        "fnInitComplete": null,
        "fnPreDrawCallback": null,
        "fnRowCallback": null,
        "fnServerData": null,
        "fnServerParams": null,
        "fnStateLoadCallback": function ( settings ) {
            try {
                return JSON.parse(
                    (settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
                        'DataTables_'+settings.sInstance+'_'+location.pathname
                    )
                );
            } catch (e) {}
        },
        "fnStateLoadParams": null,
        "fnStateLoaded": null,
        "fnStateSaveCallback": function ( settings, data ) {
            try {
                (settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
                    'DataTables_'+settings.sInstance+'_'+location.pathname,
                    JSON.stringify( data )
                );
            } catch (e) {}
        },
        "fnStateSaveParams": null,
        "iStateDuration": 7200,
        "iDeferLoading": null,
        "iDisplayLength": 10,
        "iDisplayStart": 0,
        "iTabIndex": 0,
        "oClasses": {},
        "oLanguage": {
            "oAria": {
                "sSortAscending": ": activate to sort column ascending",
                "sSortDescending": ": activate to sort column descending"
            },
            "oPaginate": {
                "sFirst": "First",
                "sLast": "Last",
                "sNext": "Next",
                "sPrevious": "Previous"
            },
            "sEmptyTable": "No data available in table",
            "sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
            "sInfoEmpty": "Showing 0 to 0 of 0 entries",
            "sInfoFiltered": "(filtered from _MAX_ total entries)",
            "sInfoPostFix": "",
            "sDecimal": "",
            "sThousands": ",",
            "sLengthMenu": "Show _MENU_ entries",
            "sLoadingRecords": "Loading...",
            "sProcessing": "Processing...",
            "sSearch": "Search:",
            "sSearchPlaceholder": "",
            "sUrl": "",
            "sZeroRecords": "No matching records found"
        },
        "oSearch": $.extend( {}, DataTable.models.oSearch ),
        "sAjaxDataProp": "data",
        "sAjaxSource": null,
        "sDom": "lfrtip",
        "searchDelay": null,
        "sPaginationType": "simple_numbers",
        "sScrollX": "",
        "sScrollXInner": "",
        "sScrollY": "",
        "sServerMethod": "GET",
        "renderer": null,
        "rowId": "DT_RowId"
    };
    
    _fnHungarianMap( DataTable.defaults );

    DataTable.defaults.column = {
        "aDataSort": null,
        "iDataSort": -1,
        "asSorting": [ 'asc', 'desc' ],
        "bSearchable": true,
        "bSortable": true,
        "bVisible": true,
        "fnCreatedCell": null,
        "mData": null,
        "mRender": null,
        "sCellType": "td",
        "sClass": "",
        "sContentPadding": "",
        "sDefaultContent": null,
        "sName": "",
        "sSortDataType": "std",
        "sTitle": null,
        "sType": null,
        "sWidth": null
    };
    
    _fnHungarianMap( DataTable.defaults.column );

    DataTable.models.oSettings = {
        "oFeatures": {
            "bAutoWidth": null,
            "bDeferRender": null,
            "bFilter": null,
            "bInfo": null,
            "bLengthChange": null,
            "bPaginate": null,
            "bProcessing": null,
            "bServerSide": null,
            "bSort": null,
            "bSortMulti": null,    
            "bSortClasses": null,
            "bStateSave": null
        },

        "oScroll": {
            "bCollapse": null,
            "iBarWidth": 0,    
            "sX": null,    
            "sXInner": null,
            "sY": null
        },
    
        "oLanguage": {
            "fnInfoCallback": null
        },

        "oBrowser": {
            "bScrollOversize": false,
            "bScrollbarLeft": false,
            "bBounding": false,
            "barWidth": 0
        },    
    
        "ajax": null,    
        "aanFeatures": [],    
        "aoData": [],
        "aiDisplay": [],
        "aiDisplayMaster": [],
        "aIds": {},
        "aoColumns": [],
        "aoHeader": [],
        "aoFooter": [],
        "oPreviousSearch": {},
        "aoPreSearchCols": [],
        "aaSorting": null,
        "aaSortingFixed": [],
        "asStripeClasses": null,
        "asDestroyStripes": [],
        "sDestroyWidth": 0,
        "aoRowCallback": [],
        "aoHeaderCallback": [], 
        "aoFooterCallback": [],
        "aoDrawCallback": [], 
        "aoRowCreatedCallback": [],
        "aoPreDrawCallback": [],
        "aoInitComplete": [],    
        "aoStateSaveParams": [],
        "aoStateLoadParams": [],
        "aoStateLoaded": [],
        "sTableId": "",
        "nTable": null,
        "nTHead": null,
    
        
        "nTFoot": null,
    
        
        "nTBody": null,
    
        
        "nTableWrapper": null,
    
        
        "bDeferLoading": false,
    
        
        "bInitialised": false,
    
        
        "aoOpenRows": [],
    
        
        "sDom": null,
    
        
        "searchDelay": null,
    
        
        "sPaginationType": "two_button",
    
        
        "iStateDuration": 0,
    
        /**
         * Array of callback functions for state saving. Each array element is an
         * object with the following parameters:
         *   <ul>
         *     <li>function:fn - function to call. Takes two parameters, oSettings
         *       and the JSON string to save that has been thus far created. Returns
         *       a JSON string to be inserted into a json object
         *       (i.e. '"param": [ 0, 1, 2]')</li>
         *     <li>string:sName - name of callback</li>
         *   </ul>
         *  @type array
         *  @default []
         */
        "aoStateSave": [],
    
        /**
         * Array of callback functions for state loading. Each array element is an
         * object with the following parameters:
         *   <ul>
         *     <li>function:fn - function to call. Takes two parameters, oSettings
         *       and the object stored. May return false to cancel state loading</li>
         *     <li>string:sName - name of callback</li>
         *   </ul>
         *  @type array
         *  @default []
         */
        "aoStateLoad": [],
    
        
        "oSavedState": null,
    
        
        "oLoadedState": null,
    
        
        "sAjaxSource": null,
    
        
        "sAjaxDataProp": null,
    
        
        "bAjaxDataGet": true,
    
        
        "jqXHR": null,
    
        
        "json": undefined,
    
        
        "oAjaxData": undefined,
    
        
        "fnServerData": null,
    
        
        "aoServerParams": [],
    
        
        "sServerMethod": null,
    
        
        "fnFormatNumber": null,
    
        
        "aLengthMenu": null,
    
        
        "iDraw": 0,
    
        
        "bDrawing": false,
    
        
        "iDrawError": -1,
    
        
        "_iDisplayLength": 10,
    
        
        "_iDisplayStart": 0,
    
        
        "_iRecordsTotal": 0,
    
        
        "_iRecordsDisplay": 0,
    
        
        "bJUI": null,
    
        
        "oClasses": {},
    
        
        "bFiltered": false,
    
        
        "bSorted": false,
    
        /**
         * Indicate that if multiple rows are in the header and there is more than
         * one unique cell per column, if the top one (true) or bottom one (false)
         * should be used for sorting / title by DataTables.
         * Note that this parameter will be set by the initialisation routine. To
         * set a default use {@link DataTable.defaults}.
         *  @type boolean
         */
        "bSortCellsTop": null,
    
        
        "oInit": null,
    
        
        "aoDestroyCallback": [],
    
    
        
        "fnRecordsTotal": function ()
        {
            return _fnDataSource( this ) == 'ssp' ?
                this._iRecordsTotal * 1 :
                this.aiDisplayMaster.length;
        },
    
        
        "fnRecordsDisplay": function ()
        {
            return _fnDataSource( this ) == 'ssp' ?
                this._iRecordsDisplay * 1 :
                this.aiDisplay.length;
        },
    
        
        "fnDisplayEnd": function ()
        {
            var
                len      = this._iDisplayLength,
                start    = this._iDisplayStart,
                calc     = start + len,
                records  = this.aiDisplay.length,
                features = this.oFeatures,
                paginate = features.bPaginate;
    
            if ( features.bServerSide ) {
                return paginate === false || len === -1 ?
                    start + records :
                    Math.min( start+len, this._iRecordsDisplay );
            }
            else {
                return ! paginate || calc>records || len===-1 ?
                    records :
                    calc;
            }
        },
    
        
        "oInstance": null,
    
        
        "sInstance": null,
    
        
        "iTabIndex": 0,
    
        
        "nScrollHead": null,
    
        
        "nScrollFoot": null,
    
        
        "aLastSort": [],
    
        
        "oPlugins": {},
    
        
        "rowIdFn": null,
    
        
        "rowId": null
    };


    DataTable.ext = _ext = {
        buttons: {}, 
        classes: {},
        builder: "-source-",
        errMode: "alert",
        feature: [],
        search: [],
        selector: {
            cell: [],
            column: [],
            row: []
        },
        internal: {},
        legacy: {
            ajax: null
        },
        pager: {},
        renderer: {
            pageButton: {},
            header: {}
        },
        order: {},
        type: {
            detect: [],
            search: {},
            order: {}
        },    
        
        _unique: 0,

        fnVersionCheck: DataTable.fnVersionCheck,
        iApiIndex: 0,
        oJUIClasses: {},
        sVersion: DataTable.version
    };
    
    $.extend( _ext, {
        afnFiltering: _ext.search,
        aTypes:       _ext.type.detect,
        ofnSearch:    _ext.type.search,
        oSort:        _ext.type.order,
        afnSortData:  _ext.order,
        aoFeatures:   _ext.feature,
        oApi:         _ext.internal,
        oStdClasses:  _ext.classes,
        oPagination:  _ext.pager
    } );
    
    
    $.extend( DataTable.ext.classes, {
        "sTable": "dataTable",
        "sNoFooter": "no-footer",    
        
        "sPageButton": "paginate_button",
        "sPageButtonActive": "current",
        "sPageButtonDisabled": "disabled",    
        
        "sStripeOdd": "odd",
        "sStripeEven": "even",    
        
        "sRowEmpty": "dataTables_empty",    
        
        "sWrapper": "dataTables_wrapper",
        "sFilter": "dataTables_filter",
        "sInfo": "dataTables_info",
        "sPaging": "dataTables_paginate paging_", 
        "sLength": "dataTables_length",
        "sProcessing": "dataTables_processing",    
        
        "sSortAsc": "sorting_asc",
        "sSortDesc": "sorting_desc",
        "sSortable": "sorting", 
        "sSortableAsc": "sorting_asc_disabled",
        "sSortableDesc": "sorting_desc_disabled",
        "sSortableNone": "sorting_disabled",
        "sSortColumn": "sorting_",     
        
        "sFilterInput": "",    
        
        "sLengthSelect": "",    
        
        "sScrollWrapper": "dataTables_scroll",
        "sScrollHead": "dataTables_scrollHead",
        "sScrollHeadInner": "dataTables_scrollHeadInner",
        "sScrollBody": "dataTables_scrollBody",
        "sScrollFoot": "dataTables_scrollFoot",
        "sScrollFootInner": "dataTables_scrollFootInner",    
        
        "sHeaderTH": "",
        "sFooterTH": "",
    
        // Deprecated
        "sSortJUIAsc": "",
        "sSortJUIDesc": "",
        "sSortJUI": "",
        "sSortJUIAscAllowed": "",
        "sSortJUIDescAllowed": "",
        "sSortJUIWrapper": "",
        "sSortIcon": "",
        "sJUIHeader": "",
        "sJUIFooter": ""
    } );
    
    
    (function() {
    
    // Reused strings for better compression. Closure compiler appears to have a
    // weird edge case where it is trying to expand strings rather than use the
    // variable version. This results in about 200 bytes being added, for very
    // little preference benefit since it this run on script load only.
    var _empty = '';
    _empty = '';
    
    var _stateDefault = _empty + 'ui-state-default';
    var _sortIcon     = _empty + 'css_right ui-icon ui-icon-';
    var _headerFooter = _empty + 'fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix';
    
    $.extend( DataTable.ext.oJUIClasses, DataTable.ext.classes, {
        "sPageButton":         "fg-button ui-button "+_stateDefault,
        "sPageButtonActive":   "ui-state-disabled",
        "sPageButtonDisabled": "ui-state-disabled",    
        
        "sPaging": "dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi "+
            "ui-buttonset-multi paging_",     
        
        "sSortAsc":            _stateDefault+" sorting_asc",
        "sSortDesc":           _stateDefault+" sorting_desc",
        "sSortable":           _stateDefault+" sorting",
        "sSortableAsc":        _stateDefault+" sorting_asc_disabled",
        "sSortableDesc":       _stateDefault+" sorting_desc_disabled",
        "sSortableNone":       _stateDefault+" sorting_disabled",
        "sSortJUIAsc":         _sortIcon+"triangle-1-n",
        "sSortJUIDesc":        _sortIcon+"triangle-1-s",
        "sSortJUI":            _sortIcon+"carat-2-n-s",
        "sSortJUIAscAllowed":  _sortIcon+"carat-1-n",
        "sSortJUIDescAllowed": _sortIcon+"carat-1-s",
        "sSortJUIWrapper":     "DataTables_sort_wrapper",
        "sSortIcon":           "DataTables_sort_icon",    
        
        "sScrollHead": "dataTables_scrollHead "+_stateDefault,
        "sScrollFoot": "dataTables_scrollFoot "+_stateDefault,    
        
        "sHeaderTH":  _stateDefault,
        "sFooterTH":  _stateDefault,
        "sJUIHeader": _headerFooter+" ui-corner-tl ui-corner-tr",
        "sJUIFooter": _headerFooter+" ui-corner-bl ui-corner-br"
    } );
    
    }());
    
    
    
    var extPagination = DataTable.ext.pager;
    
    function _numbers ( page, pages ) {
        var
            numbers = [],
            buttons = extPagination.numbers_length,
            half = Math.floor( buttons / 2 ),
            i = 1;
    
        if ( pages <= buttons ) {
            numbers = _range( 0, pages );
        }
        else if ( page <= half ) {
            numbers = _range( 0, buttons-2 );
            numbers.push( 'ellipsis' );
            numbers.push( pages-1 );
        }
        else if ( page >= pages - 1 - half ) {
            numbers = _range( pages-(buttons-2), pages );
            numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
            numbers.splice( 0, 0, 0 );
        }
        else {
            numbers = _range( page-half+2, page+half-1 );
            numbers.push( 'ellipsis' );
            numbers.push( pages-1 );
            numbers.splice( 0, 0, 'ellipsis' );
            numbers.splice( 0, 0, 0 );
        }
    
        numbers.DT_el = 'span';
        return numbers;
    }
    
    
    $.extend( extPagination, {
        simple: function ( page, pages ) {
            return [ 'previous', 'next' ];
        },
    
        full: function ( page, pages ) {
            return [  'first', 'previous', 'next', 'last' ];
        },
    
        numbers: function ( page, pages ) {
            return [ _numbers(page, pages) ];
        },
    
        simple_numbers: function ( page, pages ) {
            return [ 'previous', _numbers(page, pages), 'next' ];
        },
    
        full_numbers: function ( page, pages ) {
            return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
        },
    
        // For testing and plug-ins to use
        _numbers: _numbers,
    
        // Number of number buttons (including ellipsis) to show. _Must be odd!_
        numbers_length: 7
    } );
    
    
    $.extend( true, DataTable.ext.renderer, {
        pageButton: {
            _: function ( settings, host, idx, buttons, page, pages ) {
                var classes = settings.oClasses;
                var lang = settings.oLanguage.oPaginate;
                var aria = settings.oLanguage.oAria.paginate || {};
                var btnDisplay, btnClass, counter=0;
    
                var attach = function( container, buttons ) {
                    var i, ien, node, button;
                    var clickHandler = function ( e ) {
                        _fnPageChange( settings, e.data.action, true );
                    };
    
                    for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
                        button = buttons[i];
    
                        if ( $.isArray( button ) ) {
                            var inner = $( '<'+(button.DT_el || 'div')+'/>' )
                                .appendTo( container );
                            attach( inner, button );
                        }
                        else {
                            btnDisplay = null;
                            btnClass = '';
    
                            switch ( button ) {
                                case 'ellipsis':
                                    container.append('<span class="ellipsis">&#x2026;</span>');
                                    break;
    
                                case 'first':
                                    btnDisplay = lang.sFirst;
                                    btnClass = button + (page > 0 ?
                                        '' : ' '+classes.sPageButtonDisabled);
                                    break;
    
                                case 'previous':
                                    btnDisplay = lang.sPrevious;
                                    btnClass = button + (page > 0 ?
                                        '' : ' '+classes.sPageButtonDisabled);
                                    break;
    
                                case 'next':
                                    btnDisplay = lang.sNext;
                                    btnClass = button + (page < pages-1 ?
                                        '' : ' '+classes.sPageButtonDisabled);
                                    break;
    
                                case 'last':
                                    btnDisplay = lang.sLast;
                                    btnClass = button + (page < pages-1 ?
                                        '' : ' '+classes.sPageButtonDisabled);
                                    break;
    
                                default:
                                    btnDisplay = button + 1;
                                    btnClass = page === button ?
                                        classes.sPageButtonActive : '';
                                    break;
                            }
    
                            if ( btnDisplay !== null ) {
                                node = $('<a>', {
                                        'class': classes.sPageButton+' '+btnClass,
                                        'aria-controls': settings.sTableId,
                                        'aria-label': aria[ button ],
                                        'data-dt-idx': counter,
                                        'tabindex': settings.iTabIndex,
                                        'id': idx === 0 && typeof button === 'string' ?
                                            settings.sTableId +'_'+ button :
                                            null
                                    } )
                                    .html( btnDisplay )
                                    .appendTo( container );
    
                                _fnBindAction(
                                    node, {action: button}, clickHandler
                                );
    
                                counter++;
                            }
                        }
                    }
                };
    
                // IE9 throws an 'unknown error' if document.activeElement is used
                // inside an iframe or frame. Try / catch the error. Not good for
                // accessibility, but neither are frames.
                var activeEl;
    
                try {
                    // Because this approach is destroying and recreating the paging
                    // elements, focus is lost on the select button which is bad for
                    // accessibility. So we want to restore focus once the draw has
                    // completed
                    activeEl = $(host).find(document.activeElement).data('dt-idx');
                }
                catch (e) {}
    
                attach( $(host).empty(), buttons );
    
                if ( activeEl ) {
                    $(host).find( '[data-dt-idx='+activeEl+']' ).focus();
                }
            }
        }
    } );
    
    $.extend( DataTable.ext.type.detect, [
        // Plain numbers - first since V8 detects some plain numbers as dates
        // e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
        function ( d, settings )
        {
            var decimal = settings.oLanguage.sDecimal;
            return _isNumber( d, decimal ) ? 'num'+decimal : null;
        },
    
        // Dates (only those recognised by the browser's Date.parse)
        function ( d, settings )
        {
            // V8 will remove any unknown characters at the start and end of the
            // expression, leading to false matches such as `$245.12` or `10%` being
            // a valid date. See forum thread 18941 for detail.
            if ( d && !(d instanceof Date) && ( ! _re_date_start.test(d) || ! _re_date_end.test(d) ) ) {
                return null;
            }
            var parsed = Date.parse(d);
            return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
        },
    
        // Formatted numbers
        function ( d, settings )
        {
            var decimal = settings.oLanguage.sDecimal;
            return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
        },
    
        // HTML numeric
        function ( d, settings )
        {
            var decimal = settings.oLanguage.sDecimal;
            return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
        },
    
        // HTML numeric, formatted
        function ( d, settings )
        {
            var decimal = settings.oLanguage.sDecimal;
            return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
        },
    
        // HTML (this is strict checking - there must be html)
        function ( d, settings )
        {
            return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
                'html' : null;
        }
    ] );

    $.extend( DataTable.ext.type.search, {
        html: function ( data ) {
            return _empty(data) ?
                data :
                typeof data === 'string' ?
                    data
                        .replace( _re_new_lines, " " )
                        .replace( _re_html, "" ) :
                    '';
        },
    
        string: function ( data ) {
            return _empty(data) ?
                data :
                typeof data === 'string' ?
                    data.replace( _re_new_lines, " " ) :
                    data;
        }
    } );

    var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
        if ( d !== 0 && (!d || d === '-') ) {
            return -Infinity;
        }
    
        // If a decimal place other than `.` is used, it needs to be given to the
        // function so we can detect it and replace with a `.` which is the only
        // decimal place Javascript recognises - it is not locale aware.
        if ( decimalPlace ) {
            d = _numToDecimal( d, decimalPlace );
        }
    
        if ( d.replace ) {
            if ( re1 ) {
                d = d.replace( re1, '' );
            }
    
            if ( re2 ) {
                d = d.replace( re2, '' );
            }
        }
    
        return d * 1;
    };

    function _addNumericSort ( decimalPlace ) {
        $.each(
            {
                // Plain numbers
                "num": function ( d ) {
                    return __numericReplace( d, decimalPlace );
                },
    
                // Formatted numbers
                "num-fmt": function ( d ) {
                    return __numericReplace( d, decimalPlace, _re_formatted_numeric );
                },
    
                // HTML numeric
                "html-num": function ( d ) {
                    return __numericReplace( d, decimalPlace, _re_html );
                },
    
                // HTML numeric, formatted
                "html-num-fmt": function ( d ) {
                    return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
                }
            },
            function ( key, fn ) {
                // Add the ordering method
                _ext.type.order[ key+decimalPlace+'-pre' ] = fn;
    
                // For HTML types add a search formatter that will strip the HTML
                if ( key.match(/^html\-/) ) {
                    _ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
                }
            }
        );
    }

    $.extend( _ext.type.order, {
        // Dates
        "date-pre": function ( d ) {
            return Date.parse( d ) || 0;
        },
    
        // html
        "html-pre": function ( a ) {
            return _empty(a) ?
                '' :
                a.replace ?
                    a.replace( /<.*?>/g, "" ).toLowerCase() :
                    a+'';
        },
    
        // string
        "string-pre": function ( a ) {
            // This is a little complex, but faster than always calling toString,
            // http://jsperf.com/tostring-v-check
            return _empty(a) ?
                '' :
                typeof a === 'string' ?
                    a.toLowerCase() :
                    ! a.toString ?
                        '' :
                        a.toString();
        },
    
        // string-asc and -desc are retained only for compatibility with the old
        // sort methods
        "string-asc": function ( x, y ) {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        },
    
        "string-desc": function ( x, y ) {
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        }
    } );

    _addNumericSort( '' );
    
    
    $.extend( true, DataTable.ext.renderer, {
        header: {
            _: function ( settings, cell, column, classes ) {
                // No additional mark-up required
                // Attach a sort listener to update on sort - note that using the
                // `DT` namespace will allow the event to be removed automatically
                // on destroy, while the `dt` namespaced event is the one we are
                // listening for
                $(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
                    if ( settings !== ctx ) { // need to check this this is the host
                        return;               // table, not a nested one
                    }
    
                    var colIdx = column.idx;
    
                    cell
                        .removeClass(
                            column.sSortingClass +' '+
                            classes.sSortAsc +' '+
                            classes.sSortDesc
                        )
                        .addClass( columns[ colIdx ] == 'asc' ?
                            classes.sSortAsc : columns[ colIdx ] == 'desc' ?
                                classes.sSortDesc :
                                column.sSortingClass
                        );
                } );
            },
    
            jqueryui: function ( settings, cell, column, classes ) {
                $('<div/>')
                    .addClass( classes.sSortJUIWrapper )
                    .append( cell.contents() )
                    .append( $('<span/>')
                        .addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
                    )
                    .appendTo( cell );
    
                // Attach a sort listener to update on sort
                $(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
                    if ( settings !== ctx ) {
                        return;
                    }
    
                    var colIdx = column.idx;
    
                    cell
                        .removeClass( classes.sSortAsc +" "+classes.sSortDesc )
                        .addClass( columns[ colIdx ] == 'asc' ?
                            classes.sSortAsc : columns[ colIdx ] == 'desc' ?
                                classes.sSortDesc :
                                column.sSortingClass
                        );
    
                    cell
                        .find( 'span.'+classes.sSortIcon )
                        .removeClass(
                            classes.sSortJUIAsc +" "+
                            classes.sSortJUIDesc +" "+
                            classes.sSortJUI +" "+
                            classes.sSortJUIAscAllowed +" "+
                            classes.sSortJUIDescAllowed
                        )
                        .addClass( columns[ colIdx ] == 'asc' ?
                            classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
                                classes.sSortJUIDesc :
                                column.sSortingClassJUI
                        );
                } );
            }
        }
    } );

    DataTable.render = {
        number: function ( thousands, decimal, precision, prefix, postfix ) {
            return {
                display: function ( d ) {
                    if ( typeof d !== 'number' && typeof d !== 'string' ) {
                        return d;
                    }
    
                    var negative = d < 0 ? '-' : '';
                    var flo = parseFloat( d );
    
                    // If NaN then there isn't much formatting that we can do - just
                    // return immediately
                    if ( isNaN( flo ) ) {
                        return d;
                    }
    
                    d = Math.abs( flo );
    
                    var intPart = parseInt( d, 10 );
                    var floatPart = precision ?
                        decimal+(d - intPart).toFixed( precision ).substring( 2 ):
                        '';
    
                    return negative + (prefix||'') +
                        intPart.toString().replace(
                            /\B(?=(\d{3})+(?!\d))/g, thousands
                        ) +
                        floatPart +
                        (postfix||'');
                }
            };
        },
    
        text: function () {
            return {
                display: function ( d ) {
                    return typeof d === 'string' ?
                        d.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') :
                        d;
                }
            };
        }
    };

    function _fnExternApiFunc (fn)
    {
        return function() {
            var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
                Array.prototype.slice.call(arguments)
            );
            return DataTable.ext.internal[fn].apply( this, args );
        };
    }
    
    
    
    $.extend( DataTable.ext.internal, {
        _fnExternApiFunc: _fnExternApiFunc,
        _fnBuildAjax: _fnBuildAjax,
        _fnAjaxUpdate: _fnAjaxUpdate,
        _fnAjaxParameters: _fnAjaxParameters,
        _fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
        _fnAjaxDataSrc: _fnAjaxDataSrc,
        _fnAddColumn: _fnAddColumn,
        _fnColumnOptions: _fnColumnOptions,
        _fnAdjustColumnSizing: _fnAdjustColumnSizing,
        _fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
        _fnColumnIndexToVisible: _fnColumnIndexToVisible,
        _fnVisbleColumns: _fnVisbleColumns,
        _fnGetColumns: _fnGetColumns,
        _fnColumnTypes: _fnColumnTypes,
        _fnApplyColumnDefs: _fnApplyColumnDefs,
        _fnHungarianMap: _fnHungarianMap,
        _fnCamelToHungarian: _fnCamelToHungarian,
        _fnLanguageCompat: _fnLanguageCompat,
        _fnBrowserDetect: _fnBrowserDetect,
        _fnAddData: _fnAddData,
        _fnAddTr: _fnAddTr,
        _fnNodeToDataIndex: _fnNodeToDataIndex,
        _fnNodeToColumnIndex: _fnNodeToColumnIndex,
        _fnGetCellData: _fnGetCellData,
        _fnSetCellData: _fnSetCellData,
        _fnSplitObjNotation: _fnSplitObjNotation,
        _fnGetObjectDataFn: _fnGetObjectDataFn,
        _fnSetObjectDataFn: _fnSetObjectDataFn,
        _fnGetDataMaster: _fnGetDataMaster,
        _fnClearTable: _fnClearTable,
        _fnDeleteIndex: _fnDeleteIndex,
        _fnInvalidate: _fnInvalidate,
        _fnGetRowElements: _fnGetRowElements,
        _fnCreateTr: _fnCreateTr,
        _fnBuildHead: _fnBuildHead,
        _fnDrawHead: _fnDrawHead,
        _fnDraw: _fnDraw,
        _fnReDraw: _fnReDraw,
        _fnAddOptionsHtml: _fnAddOptionsHtml,
        _fnDetectHeader: _fnDetectHeader,
        _fnGetUniqueThs: _fnGetUniqueThs,
        _fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
        _fnFilterComplete: _fnFilterComplete,
        _fnFilterCustom: _fnFilterCustom,
        _fnFilterColumn: _fnFilterColumn,
        _fnFilter: _fnFilter,
        _fnFilterCreateSearch: _fnFilterCreateSearch,
        _fnEscapeRegex: _fnEscapeRegex,
        _fnFilterData: _fnFilterData,
        _fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
        _fnUpdateInfo: _fnUpdateInfo,
        _fnInfoMacros: _fnInfoMacros,
        _fnInitialise: _fnInitialise,
        _fnInitComplete: _fnInitComplete,
        _fnLengthChange: _fnLengthChange,
        _fnFeatureHtmlLength: _fnFeatureHtmlLength,
        _fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
        _fnPageChange: _fnPageChange,
        _fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
        _fnProcessingDisplay: _fnProcessingDisplay,
        _fnFeatureHtmlTable: _fnFeatureHtmlTable,
        _fnScrollDraw: _fnScrollDraw,
        _fnApplyToChildren: _fnApplyToChildren,
        _fnCalculateColumnWidths: _fnCalculateColumnWidths,
        _fnThrottle: _fnThrottle,
        _fnConvertToWidth: _fnConvertToWidth,
        _fnGetWidestNode: _fnGetWidestNode,
        _fnGetMaxLenString: _fnGetMaxLenString,
        _fnStringToCss: _fnStringToCss,
        _fnSortFlatten: _fnSortFlatten,
        _fnSort: _fnSort,
        _fnSortAria: _fnSortAria,
        _fnSortListener: _fnSortListener,
        _fnSortAttachListener: _fnSortAttachListener,
        _fnSortingClasses: _fnSortingClasses,
        _fnSortData: _fnSortData,
        _fnSaveState: _fnSaveState,
        _fnLoadState: _fnLoadState,
        _fnSettingsFromNode: _fnSettingsFromNode,
        _fnLog: _fnLog,
        _fnMap: _fnMap,
        _fnBindAction: _fnBindAction,
        _fnCallbackReg: _fnCallbackReg,
        _fnCallbackFire: _fnCallbackFire,
        _fnLengthOverflow: _fnLengthOverflow,
        _fnRenderer: _fnRenderer,
        _fnDataSource: _fnDataSource,
        _fnRowAttributes: _fnRowAttributes,
        _fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
                                        // in 1.10, so this dead-end function is
                                        // added to prevent errors
    } );

    // jQuery access
    $.fn.dataTable = DataTable;

    // Provide access to the host jQuery object (circular reference)
    DataTable.$ = $;

    // Legacy aliases
    $.fn.dataTableSettings = DataTable.settings;
    $.fn.dataTableExt = DataTable.ext;

    // With a capital `D` we return a DataTables API instance rather than a
    // jQuery object
    $.fn.DataTable = function ( opts ) {
        return $(this).dataTable( opts ).api();
    };

    // All properties that are available to $.fn.dataTable should also be
    // available on $.fn.DataTable
    $.each( DataTable, function ( prop, val ) {
        $.fn.DataTable[ prop ] = val;
    } );

    return $.fn.dataTable;
})(jQuery, window, document);


/*! DataTables Bootstrap 3 integration
 * ©2011-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 3. This requires Bootstrap 3 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;



$.extend( true, DataTable.defaults, {
    dom:
        "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-5'i><'col-sm-7'p>>",
    renderer: 'bootstrap'
} );



$.extend( DataTable.ext.classes, {
    sWrapper:      "dataTables_wrapper form-inline dt-bootstrap",
    sFilterInput:  "form-control input-sm",
    sLengthSelect: "form-control input-sm",
    sProcessing:   "dataTables_processing panel panel-default"
} );



DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
    var api     = new DataTable.Api( settings );
    var classes = settings.oClasses;
    var lang    = settings.oLanguage.oPaginate;
    var aria = settings.oLanguage.oAria.paginate || {};
    var btnDisplay, btnClass, counter=0;

    var attach = function( container, buttons ) {
        var i, ien, node, button;
        var clickHandler = function ( e ) {
            e.preventDefault();
            if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
                api.page( e.data.action ).draw( 'page' );
            }
        };

        for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
            button = buttons[i];

            if ( $.isArray( button ) ) {
                attach( container, button );
            }
            else {
                btnDisplay = '';
                btnClass = '';

                switch ( button ) {
                    case 'ellipsis':
                        btnDisplay = '&#x2026;';
                        btnClass = 'disabled';
                        break;

                    case 'first':
                        btnDisplay = lang.sFirst;
                        btnClass = button + (page > 0 ?
                            '' : ' disabled');
                        break;

                    case 'previous':
                        btnDisplay = lang.sPrevious;
                        btnClass = button + (page > 0 ?
                            '' : ' disabled');
                        break;

                    case 'next':
                        btnDisplay = lang.sNext;
                        btnClass = button + (page < pages-1 ?
                            '' : ' disabled');
                        break;

                    case 'last':
                        btnDisplay = lang.sLast;
                        btnClass = button + (page < pages-1 ?
                            '' : ' disabled');
                        break;

                    default:
                        btnDisplay = button + 1;
                        btnClass = page === button ?
                            'active' : '';
                        break;
                }

                if ( btnDisplay ) {
                    node = $('<li>', {
                            'class': classes.sPageButton+' '+btnClass,
                            'id': idx === 0 && typeof button === 'string' ?
                                settings.sTableId +'_'+ button :
                                null
                        } )
                        .append( $('<a>', {
                                'href': '#',
                                'aria-controls': settings.sTableId,
                                'aria-label': aria[ button ],
                                'data-dt-idx': counter,
                                'tabindex': settings.iTabIndex
                            } )
                            .html( btnDisplay )
                        )
                        .appendTo( container );

                    settings.oApi._fnBindAction(
                        node, {action: button}, clickHandler
                    );

                    counter++;
                }
            }
        }
    };

    // IE9 throws an 'unknown error' if document.activeElement is used
    // inside an iframe or frame. 
    var activeEl;

    try {
        // Because this approach is destroying and recreating the paging
        // elements, focus is lost on the select button which is bad for
        // accessibility. So we want to restore focus once the draw has
        // completed
        activeEl = $(host).find(document.activeElement).data('dt-idx');
    }
    catch (e) {}

    attach(
        $(host).empty().html('<ul class="pagination"/>').children('ul'),
        buttons
    );

    if ( activeEl ) {
        $(host).find( '[data-dt-idx='+activeEl+']' ).focus();
    }
};



if ( DataTable.TableTools ) {
    // Set the classes that TableTools uses to something suitable for Bootstrap
    $.extend( true, DataTable.TableTools.classes, {
        "container": "DTTT btn-group",
        "buttons": {
            "normal": "btn btn-default",
            "disabled": "disabled"
        },
        "collection": {
            "container": "DTTT_dropdown dropdown-menu",
            "buttons": {
                "normal": "",
                "disabled": "disabled"
            }
        },
        "print": {
            "info": "DTTT_print_info"
        },
        "select": {
            "row": "active"
        }
    } );

    // Have the collection use a bootstrap compatible drop down
    $.extend( true, DataTable.TableTools.DEFAULTS.oTags, {
        "collection": {
            "container": "ul",
            "button": "li",
            "liner": "a"
        }
    } );
}


return DataTable;
})(jQuery, window, document);
/* login javascript jQuery */

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
Jx().package("T.UI.Components", function(J){

    // 严格模式
    'use strict';

    // 全局变量、函数、对象
    var _currentPluginId = 0;
    
    var defaults = {
        //orgselectNames: '一级名称,二级名称,三级名称',
        dataUrl: ''
    };
    var attributeMap = {
        //orgselectNames: 'orgslt-names',
        dataUrl: 'data-url'
        // dataUrlUsers: 'data-url-users',
        // dataUrlOrgs: 'data-url-orgs'
    };


    var OrgselectModal=new J.Class({
        data: {},
        states: {},
        init:function(elements, options){
            this.inputElements = elements;

            // 初始化选项
            //this.initSettings(options);
            // 直接使用地址类实例的设置
            this.settings=options;
            
            // 这里保存数组
            // this.value=value;
            // this.value=value ? value.split(',') : [];

            // // 状态
            // this.states={};

            // 初始化数据
            // this.data=data;
            // this.getData();
            var context= this;
            this.d= $.Deferred();
            $.when(this.getData(this.d))
             .done(function(){
                context.render();
             });

            // var d1= $.Deferred();
            // var d2= $.Deferred();
            // $.when(this.getDataUser(d1), this.getDataOrgs(d2))
            //  .done(function(){
            //     context.render();
            //  });

            // 构建html DOM
            this.buildHtml();
            this.initElements();
            
            //this.transferAttributes();

            // 绑定事件
            this.bindEvents();
            // 绑定事件接口
            this.bindEventsInterface();

            // 根据值，状态，设置等刷新视图
            this.refresh();
        },
        getData:function(d){
            if(this.settings.data){
                this.data=$.extend(true, [], this.settings.data);
                delete this.settings.data;

                d.resolve();

                return d.promise();
            }
            var context= this;
            $.ajax({
                dataType: 'json',
                url: context.settings.dataUrl,
                data: {},
                success: function(data){
                    context.data= context.parseData(data);
                    d.resolve();
                },
                error: function(xmlHttpRequest, status, error){
                    alert('控件id：' + context.element.attr('id')+'，ajax获取数据失败!');
                    d.resolve();
                }
            });

            return d.promise();
        },
        parseData: function(data){
            var innerData=[];
            for(var i=0; i<data.length; i++){
                var d=data[i];
                // var orgPath=d.OrgPath.split().join(',');
                var item={
                    id: d.id,
                    name: d.name,
                    text: d.name,
                    nodes: []
                };

                innerData[innerData.length]=item;

                if(d.nodes){
                    // var n2=[];
                    for(var j=0; j<d.nodes.length; j++){
                        var d2=d.nodes[j];
                        // var orgPath=d.OrgPath.split().join(',');
                        var i2={
                            id: d2.id,
                            name: d2.name,
                            text: d2.name,
                            nodes: []
                        };

                        item.nodes[item.nodes.length]=i2;

                        if(d2.nodes){
                            // var n3=[];
                            for(var k=0; k<d2.nodes.length; k++){
                                var d3=d2.nodes[k];
                                // var orgPath=d.OrgPath.split().join(',');
                                var i3={
                                    id: d3.id,
                                    name: d3.name,
                                    text: d3.name,
                                    nodes: []
                                };

                                item.nodes[j].nodes[item.nodes[j].nodes.length]=i3;

                                if(d3.nodes){
                                    // var n4=[];
                                    for(var l=0; l<d3.nodes.length; l++){
                                        var d4=d3.nodes[l];
                                        // var orgPath=d.OrgPath.split().join(',');
                                        var i4={
                                            id: d4.id,
                                            name: d4.name,
                                            text: d4.name
                                        };

                                        //

                                        item.nodes[j].nodes[k].nodes[item.nodes[j].nodes[k].nodes.length]=i4;
                                    }
                                    // item.nodes[j].nodes[k].nodes=n4;
                                }

                                
                            }
                            // item.nodes[j].nodes=n3;
                        }
                    }
                    // item.nodes=n2;
                }

                
            }

            return innerData;
        },
        /*
        getDataUsers: function(d){
            // if(this.setting.data){
            //     this.data=$.extend(true, [], this.settings.data);
            //     delete this.settings.data;

            //     d.resolve();

            //     return d.promise();
            // }
            var context= this;
            $.ajax({
                dataType: 'json',
                url: context.settings.dataUrlUsers,
                data: {},
                success: function(data){
                    context.data.users= context.parseDataUsers(data);
                    d.resolve();
                },
                error: function(xmlHttpRequest, status, error){
                    alert('控件id：' + context.element.attr('id')+'，ajax获取数据失败!');
                    d.resolve();
                }
            });

            return d.promise();
        },
        getDataOrgs: function(){
            var context= this;
            $.ajax({
                dataType: 'json',
                url: context.settings.dataUrlOrgs,
                data: {},
                success: function(data){
                    context.data.users= context.parseDataOrgs(data);
                    d.resolve();
                },
                error: function(xmlHttpRequest, status, error){
                    alert('控件id：' + context.element.attr('id')+'，ajax获取数据失败!');
                    d.resolve();
                }
            });

            return d.promise();
        },
        parseDataUsers: function(data){
            var users=[];
            for(var i=0; i<data.length; i++){
                var d=data[i];
                // var orgPath=d.OrgPath.split().join(',');
                var user={
                    id: d.Id,
                    name: d.Name
                };

                users[users.length]=user;
            }

            return users;
        },
        parseDataOrgs: function(data){},*/
        buildHtml:function(){
            var htmlTitleFilter=''+
                '                       <select class="t-title-filter">'+
                '                           <option value="">请选择职务</option>'+
                '                           <option value="1">职务1</option>'+
                '                           <option value="2">职务2</option>'+
                '                           <option value="3">职务3</option>'+
                '                           <option value="-1">某职务1以上</option>'+
                '                           <option value="-2">某职务2以上</option>'+
                '                           <option value="-3">某职务3以下</option>'+
                '                       </select>';
            var htmlOrgTree=''+
                '            <div class="col-xs-4" style="padding-left:3px;">'+     //  padding-right:3px; border:1px solid #ccc;
                '                <div class="col-header" style="padding:6px;">'+
                '                    <input type="text" class="t-typeahead form-control" />'+
                '                </div>'+
                '                <div class="t-tree-wraper">'+
                '                <div class="t-tree">'+
                '                </div>'+
                '                </div>'+
                '            </div>';
            var rightselectId='t-os-rs_' + this.inputElements.original.data('plugin-id');
            var htmlRighselect=''+
                '            <div class="col-xs-8" style="padding-left:3px; padding-right:3px;">'+
                '                <div id="'+rightselectId+'" class="col-xs-5" style="padding-left:6px; padding-right:6px;">'+
                '                <div class="col-header">'+
                '                    <span>待选( <b class="t-forselect-count">0</b> )</span><br />'+
                htmlTitleFilter+
                '                    <input type="checkbox" class="t-inner" /><label>内部</label>'+
                '                    <input type="checkbox" class="t-outer" /><label>外部</label>'+
                '                </div>'+
                '                    <select '+
                '                        id="'+rightselectId+'"'+
                '                        multiple="multiple" '+
                '                        size="20" '+
                '                        class="form-control" '+
                '                        name="from[]">'+
                // '                        <option value="1">Item 01</option>'+
                // '                        <option value="2">Item 02</option>'+
                // '                        <option value="3">Item 03</option>'+
                '                    </select>'+
                '                </div>'+       
                '                <div class="col-xs-2">'+   //  style="padding-left:3px; padding-right:3px;"
                '                    <br /><br /><br /><br />'+ // <br /><br />
                '                    <button type="button" id="'+rightselectId+'_undo" class="btn btn-primary btn-block">撤销</button>'+
                '                    <button type="button" id="'+rightselectId+'_rightAll" class="btn btn-block btn-sm"><i class="glyphicon glyphicon-forward"></i></button>'+
                '                    <button type="button" id="'+rightselectId+'_rightSelected" class="btn btn-block btn-sm"><i class="glyphicon glyphicon-chevron-right"></i></button>'+
                '                    <button type="button" id="'+rightselectId+'_leftSelected" class="btn btn-block btn-sm"><i class="glyphicon glyphicon-chevron-left"></i></button>'+
                '                    <button type="button" id="'+rightselectId+'_leftAll" class="btn btn-block btn-sm"><i class="glyphicon glyphicon-backward"></i></button>'+
                '                    <button type="button" id="'+rightselectId+'_redo" class="btn btn-primary btn-block">重做</button>'+
                '                </div>'+
                '                <div class="col-xs-5" style="padding-left:6px; padding-right:6px;">'+
                '                    <div class="col-header">'+
                '                    <span>已选( <b class="t-selected-count">0</b> )</span><br />'+
                '                    </div>'+
                '                    <select '+
                '                        id="'+rightselectId+'_rightSelect" '+
                '                        multiple="multiple" '+
                '                        size="20" '+
                '                        class="form-control" '+
                '                        name="to[]">'+
                '                    </select>'+
                '                </div>'+
                '            </div>';
            // var dialogId='t-orgselect-dialog' + this.inputElements.original.data('plugin-id');
            // var htmlTemplate = '' +
            //     '<div id="'+dialogId+'" class="t-orgselect-dialog modal" tabindex="-1" role="dialog">' +     //  fade
            //     '    <div class="modal-dialog" role="document">' + 
            //     '        <div class="modal-content">' + 
            //     '            <div class="modal-header">' + 
            //     '                <button type="button" class="close"><span aria-hidden="true">&times;</span></button>' + 
            //     '                <h4 class="modal-title">选择员工</h4>' + 
            //     '            </div>' + 
            //     '            <div class="modal-body">' + 
            //     '               <div class="row">' + 
            //     htmlOrgTree + 
            //     htmlRighselect + 
            //     '               </div>' + 
            //     '            </div>' + 
            //     '            <div class="modal-footer">' + 
            //     '                <button type="button" class="btn btn-default cancel">取消</button>' + 
            //     '                <button type="button" class="btn btn-primary confirm">确定</button>' + 
            //     '            </div>' + 
            //     '        </div>' + 
            //     '    </div>' + 
            //     '</div>';
            var dialogId='t-orgselect-dialog' + this.inputElements.original.data('plugin-id');
            var htmlTemplate= ''+
                '        <div class="modal-content">' + 
                '            <div class="modal-header">' + 
                '                <button type="button" class="close"><span aria-hidden="true">&times;</span></button>' + 
                '                <h4 class="modal-title">选择员工</h4>' + 
                '            </div>' + 
                '            <div class="modal-body">' + 
                '               <div class="row">' + 
                htmlOrgTree + 
                htmlRighselect + 
                '               </div>' + 
                '            </div>' + 
                '            <div class="modal-footer">' + 
                '                <button type="button" class="btn btn-default cancel">取消</button>' + 
                '                <button type="button" class="btn btn-primary confirm">确定</button>' + 
                '            </div>' +
                '        </div>';

            this.container=$(htmlTemplate);
            // this.container.insertAfter(this.inputElements.view);
        },
        initElements:function(){
            var context=this;


            var dialogId='#t-orgselect-dialog' + this.inputElements.original.data('plugin-id');
            // TODO: 这里被$()执行了两次
            // this.pop= new T.UI.Components.Modal(this.inputElements.button[0], {modalId:dialogId, backdrop:'static'});
            // this.rightselect= new T.UI.Components.RightSelect(this.elements.rightselect[0]);
            var pop= new T.UI.Components.Modal(this.inputElements.button, {
                modalId: dialogId, 
                modalCssClass: 't-orgselect-dialog',
                content: this.container,
                backdrop: 'static'
            });

            this.elements={
                confirm: $('.modal-footer button.confirm', this.container),
                typeahead: $('.col-header t-typeahead', this.container),
                orgTree: $('.modal-body .t-tree', this.container),
                rightselect: $('.modal-body .t-rightselect', this.container),
                forselectCount: $('.col-header t-forselect-count', this.container),
                selectedCount: $('.col-header t-selected-count', this.container),
                titleFilter: $('.col-header t-title-filter', this.container),
                inner: $('.col-header .t-inner', this.container),
                outer: $('.col-header .t-outer', this.container)

                // tabs: $('.t-level-tabs li', this.container),
                // contents: $('.t-level-content', this.container),
                // getTab: function(levelIndex){
                //     var tabSelector = '.t-level-tab-' + levelIndex;
                //     return $(tabSelector, context.container);
                // },
                // getContent: function(levelIndex){
                //     var contentSelector = '.t-level-' + levelIndex;
                //     return $(contentSelector,context.container);
                // },
                // getNodes: function(levelIndex){
                //     var nodesSelector='.t-level-'+ levelIndex +' li';
                //     return $(nodesSelector,context.container);
                // }
            };

            var typeahead= new T.UI.Controls.Typeahead(this.elements.typeahead, {
                matcher: function(item){
                    var matcher= new RegExp(this.query, 'i');
                    var result= matcher.test(item.name);// || matcher.text(item.loginName) || matcher.text(item.spell);
                    return result;
                },
                updater: function(item){
                    var right=context.controls.rightselect.right;
                    if(right.find('option[value="'+item.id+'"]').length===0){
                        right.append('<option value="'+item.id+'">'+item.name+"</option");

                        context._updateSelectedCount();
                    }
                    return item;
                }
            });

            var rightselect= new T.UI.Components.RightSelect(this.elements.rightselect,{
                afterMoveToRight: function(left, right, options){
                    context._updateForselectedCount();
                    context._updateSelectedCount();
                },
                afterMoveToLeft: function(left, right, options){
                    context._updateForselectedCount();
                    context._updateSelectedCount();
                }
            });

            this.controls={
                typeahead: typeahead,
                tree: null,
                pop: pop,
                rightselect: rightselect
            };
        },
        bindEvents: function(){
            var context=this;
            var elements=this.elements;

            this.elements.confirm.on('click', $.proxy(this.onConfirm, this));
            this.elements.titleFilter.on('change', $.proxy(this._renderLeft, this));
            this.elements.inner.on('click', $.proxy(this._renderLeft, this));
            this.elements.outer.on('click', $.proxy(this._renderLeft, this));

            // this.elements.close.on('click', $.proxy(this.hide, this));
            // this.elements.cancel.on('click', $.proxy(this.hide, this));
        },
        bindEventsInterface: function () {},
        onNodeSelected: function(e, data){
            if(!data.nodes){
                return;
            }

            var nodes= $.grep(data.nodes, function(node){
                // var orgId= data.id;
                // var filter= '.'+orgId+'>';
                // return node.path.indexOf(filter)>0;
                return true;
            });

            this.states.leftUsers=nodes;

            this._renderLeft();
        },
        onConfirm: function(){
            var values=[];
            var options=this.controls.rightselect.elements.right.children();
            for(var i=0; i<options.length; i++){
                var jqOption=$(options[i]);
                values.push(jqOption.val());
            }

            this._setValue(values.join(','));

            this.controls.pop.hide();
            this._renderValue();
        },
        render: function(){
            this._renderTypeahead();
            this._renderOrgTree();
            this._renderValue();
        },
        _renderTypeahead: function(){
            this.controls.typeahead.setSource(this.data.users);
        },
        _renderOrgTree: function(){
            var context= this;
            this.controls.tree= new T.UI.Components.Tree(this.elements.orgTree,{
                // showTags: true,  // 不好调整css
                levels: 1,
                enableTitle: true,
                data: context.data,
                onNodeSelected: function(e, data){
                    context.onNodeSelected(e, data);
                }
            });
        },
        _renderLeft: function(){
            var users= this.states.leftUsers;

            var title= this.elements.titleFilter.val();
            var showInner=this.elements.inner.is(':checked');
            var showOuter=this.elements.outer.is(':checked');

            var right= this.controls.rightselect.elements.right;
            var left= this.controls.rightselect.elements.left;
            left.empty();
            for(var i=0; i<users.length; i++){
                var item= users[i];
                if(
                    ((title === '') || (title>0 && item.titleSortNo == title) || (title<=0 && item.titleSortNo <= -title))
                    && ((showInner && item.innerOuter == 'inner')||(showOuter && user.innerOuter == 'outer'))
                    && right.find('option[value="'+item.id+'"]').length===0
                ){
                    left.append('<option value="'+item.id+'">'+item.name+'</option>');
                }
            }

            this._updateForselectedCount();
        },
        _renderValue: function(){
            this.inputElements.dropdown.empty();
            this.controls.rightselect.elements.right.empty();
            this.inputElements.view.val('');
            // this.inputElements.original.val('');

            var values= this._getValues();
            if(values.length === 0){
                this._updateSelectedCount();
                return;
            }

            var items=[];
            for(var i=0; i<values.length; i++){
                for(var j=0; j<this.data.users.length; j++){
                    if(values[i]==this.data.users[j].id){
                        items[items.length]=this.data.users[j]
                        break;
                    }
                }
            }

            var viewValues= '';
            
            for(var i=0; i<items.length; i++){
                var item= items[i];

                this.controls.rightselect.elements.right.append('<option value="'+item.id+'">'+item.name+'</option>');
                this.inputElements.dropdown.append('<li><span>'+item.name+'</span><a href="#" data-t-id="'+item.id+'">&times;</a></li>');
                viewValues+= item.name + ',';
            }
            viewValues=viewValues.substr(0, viewValues.length-1);
            this.inputElements.view.val(viewValues);

            this._updateSelectedCount();
            
            var context= this;
            this.inputElements.dropdown.find('li a').off('click');
            this.inputElements.dropdown.find('li a').on('click', function(e){
                e.preventDefault();
                e.stopPropagation();

                var id=$(this).attr('data-t-id');
                var values= context._getValues();

                var index= values.indexOf(id);
                var newValues= values.slice(0, index).concat(values.slice(index+1, values.length));

                context.setValue(newValues.join(','))

                context._renderValue();
            });

        },
        _updateForselectedCount: function(){
            var left= this.controls.rightselect.elements.left;
            this.elements.forselectCount.text(left.find('option').length);
        },
        _updateSelectedCount: function(){
            var right= this.controls.rightselect.elements.right;
            this.elements.selectedCount.text(right.find('option').length);
        },
        _getValues: function(){
            var sValue= this.inputElements.original.val();
            var values= sValue ? sValue.split(',') : [];
            return values;
        },
        refresh: function(){
            var context= this;
            $.when(this.d.promise())
             .done(function(){
                context._renderValue();
             });
        },
        setValue: function(value){
            this.inputElements.original(value);
            this.inputElements.original.trigger('trigger');
        },
        change: function(id, levelIndex){},
        show: function () {
            this.container.show();
        },
        hide: function(){
            this.container.hide();
            //alert(this.inputElements.original.val());
        }
    });


    this.Orgselect = new J.Class({extend : T.UI.BaseControl}, {
        defaults : defaults,
        attributeMap : attributeMap,
        // data:{},

        // 构造函数
        init:function(element, options){
            this.element = $(element);
            //this.settings,

            this.container,
            this.elements,

            // this.value = this.element.val();

            // 区分一个页面中存在多个控件实例
            _currentPluginId += 1;
            this.element.data('plugin-id', _currentPluginId);

            // 初始化选项
            // this.initSettings(options);
            var jqElement=$(element);
            this.initSettings(jqElement, options);

            // 初始化数据
            this.getData();

            // 构建html DOM
            this.buildHtml();
            // 初始化 html DOM 元素
            this.initElements();
            this.transferAttributes();

            // 创建 树型 菜单对象
            //this.menu=new OrgsltMenu(this.elements, this.settings);

            // 绑定事件
            this.bindEvents();
            // 绑定事件接口
            this.bindEventsInterface();
        },
        buildHtml:function () {
            var htmlTemplate = ''+ 
                '<div class="t-orgselect-container input-group">' + 
                '    <input type="text" class="form-control" data-toggle="dropdown">' + 
                '    <div class="input-group-btn">' + 
                '        <button type="button" class="btn btn-default">' +     //  data-toggle="modal" data-target="#myModal">
                '            <span class="glyphicon glyphicon-user"></span>' + 
                '        </button>' + 
                '    </div>' + 
                '    <ul class="t-orgselect-menu dropdown-menu">'+
                '    </ul>'+
                '</div>';

            this.container = $(htmlTemplate);
            this.element.before(this.container);
        },
        getData:function(){
            var context = this;
            // $.ajax({
            //     dataType: 'json',
            //     url: this.settings.dataUrl,
            //     data: {},
            //     success: function(data){
            //         context.createModal(data);
            //     },
            //     error: function(xmlHttpRequest, status, error){
            //         alert('控件id:' + context.element.attr('id') + ' , ajax 获取数据失败!');
            //     }
            // });
        },
        createModal:function(data){
            // this.modal=new OrgselectModal(this.elements, this.settings, data);
        },
        initElements:function () {
            this.elements = {
                original: this.element,
                view: $('input[type=text]', this.container),
                button: $('button', this.container),
                dropdown: $('.t-orgselect-menu', this.container),
            };

            this.elements.original.hide();
            this.elements.view.prop("readonly","readonly");

            this.modal= new OrgselectModal(this.elements,this.settings);
        },
        bindEvents:function () {
            var context=this;

            var element=this.element;
            var elements=this.elements;

            // element.on('keydown', function(e) {
            //     ;
            // });

            // elements.view
            //     .on('focus',    $.proxy(this._showMenu, this))      // $proxy 用 当前 this 替代 控件 this
            //     .on('blur',     $.proxy(this._hideMenu, this));
        },        
        bindEventsInterface:function () {
            var context=this;
            var element=this.element;

            // element.on('orgslt.foo', function() {
            //     context.foo();
            //     foo();
            // });
        },
        transferAttributes: function(){
            //this.options.placeholder = this.$source.attr('data-placeholder') || this.options.placeholder
            //this.$element.attr('placeholder', this.options.placeholder)
            // this.elements.target.attr('name', this.element.attr('name'))
            // this.elements.target.val(this.element.val())
            // this.element.removeAttr('name')  // Remove from source otherwise form will pass parameter twice.
            this.elements.view.attr('required', this.element.attr('required'))
            this.elements.view.attr('rel', this.element.attr('rel'))
            this.elements.view.attr('title', this.element.attr('title'))
            this.elements.view.attr('class', this.element.attr('class'))
            this.elements.view.attr('tabindex', this.element.attr('tabindex'))
            this.elements.original.removeAttr('tabindex')
            if (this.element.attr('disabled')!==undefined){
               this.disable();
            }
        },
        refresh: function(){
            this.modal.refresh();
        },
        enable: function(){
            this.element.attr('disabled', false);
            this.elements.view.attr('disabled', false);
            this.disabled=false;
        },
        disable: function(){
            this.element.attr('disabled', true);
            this.elements.view.attr('disabled', true);
            this.disabled=true;
        },
        destroy: function(){}
    });

});
/**
 * bootstrap-paginator.js v0.5
 * --
 * Copyright 2013 Yun Lai <lyonlai1984@gmail.com>
 * --
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
 */

 Jx().package('T.UI.Components', function(J){
    // 严格模式
    'use strict';

    var _crrentPluginId = 0;
    var defaults = {
        // 选项
        totalRecords: 0,    // 记录数
        pageSize: 10,       // 每页记录数
        pageIndex: 0,       // 当前页
        pageButtons: 5,     // 分页按钮数 必须为奇数 3, 5, 7 ,9 ....
        // totalPages: 1,
        // containerClass: '',
        // size: 'normal',
        // alignment: 'left',
        // listContainerClass: '',
        // 覆写 类方法
        // parseData: undefined,
    };
    var attributeMap = {
        // fooOption: 'foo-option'
        totalRecords: 'total-records',
        pageSize: 'page-size',
        pageIndex: 'page-index',
        pageButtons: 'page-buttons'
    };

    this.Paginator = new J.Class({extend: T.UI.BaseControl},{
        defaults: defaults,
        attributeMap: attributeMap,

        settings: {},
        value: '',
        data: {},
        templates: {},

        // 构造函数
        init: function(element, options){
            this.element= $(element);

            if (!this.element.is('ul')) {
                throw 'in Bootstrap version 3 the pagination root item must be an ul element.'
            }

            // // 防止多次初始化
            // if (this.isInitialized()) { 
            //     return this.getRef(); 
            // }
            // this.initialize(element);

            // this.options = $.extend({}, (this.options || $.fn.bootstrapPaginator.defaults), options);
            // this.initSettings(options);
            var jqElement=$(element);
            this.initSettings(jqElement, options);


            // var id = this.element.attr('id');
            // this.value= this.element.val();
            // parseInt(this.settings.pageSize, 10)

            // this.settings.pageIndex = 0;
            // this.lastPageIndex = 0;
            this.updateOptions(this.settings);

            // this.buildHtml();
            // this.initElements();

            // var context= this;
            // $.when(this.getData())
            //  .done(function(){
            //     context.render();
            //  });

             // this.bindEvents();
             // this.bindEventsInterface();
        },

        // 模板模式 方法
        getData: function(){
            var d = $.Deferred();

            if (this.settings.data) {
                this.data = $.extend(true, [], this.settings.data);
                delete this.settings.data;

                d.resolve();

                return d.promise();
            }

            var context = this;
            $.ajax({
                dataType: 'json',
                url: this.settings.dataUrl,
                data: {},
                success: function(data){
                    context.data= $.extend(true, [], data);

                    d.resolve();
                },
                error: function(xmlHttpRequest, status, error){
                    alert('控件id：' + context.element.attr('id')+'，ajax获取数据失败!');

                    d.resolve();
                }
            });

            return d.promise();
        },
        parseData: function(data){
            var innerData= $.extend(true, [], data);
            return innerData;
        },
        buildHtml: function(){},
        initElements: function(){
            // var context= this;
            this.elements={
                original: this.element//,
                // view: $('input[type=text]', this.container)
                // getTab: function(levelIndex){
                //     var tabSelector='.t-level-tab-'+levelIndex;
                //     return $(tabSelector, context.container);
                // }
            };
        },
        transferAttributes: function(){},

        // bindEvents: function(){
        //     var context= this;
        //     var element= this.element;
        //     // element.on('click', $.proxy(this.onFooClick, this));
        //     this.element.off('page-clicked');
        //     this.element.off('page-changed');// unload the events for the element
        //     if (typeof (this.settings.onPageClicked) === 'function') {
        //         this.element.bind('page-clicked', this.settings.onPageClicked);
        //     }
        //     if (typeof (this.settings.onPageChanged) === 'function') {
        //         this.element.on('page-changed', this.settings.onPageChanged);
        //     }
        //     // this.element.bind('page-clicked', this.onPageClicked);
        //     this.element.on('page-clicked', $.proxy(this.onPageClicked, this));
        // },
        bindEventsInterface: function(){
            var context= this;
            var element= this.element;
            if(this.settings.onFooSelected){
                element.on('page.on.change', $.proxy(this.settings.onFooSelected, this));
            }
        },

        updateOptions: function (options) {
            this.settings = $.extend(true, {}, this.settings, options);

            // 总页数
            if(this.settings.totalRecords % this.settings.pageSize === 0){
                this.totalPages= this.settings.totalRecords / this.settings.pageSize;
            }
            else{
                this.totalPages= Math.ceil(this.settings.totalRecords / this.settings.pageSize);
            }
            // 最少有一页
            this.totalPages= this.totalPages < 1 ? 1 : this.totalPages;

            // 分页按钮数 必须为奇数 3, 5, 7 ,9 ....
            this.settings.pageButtons= this.settings.pageButtons%2 === 0 ? this.settings.pageButtons+1 : this.settings.pageButtons;     

            this.refresh();
        },
        jumpTo: function (pageIndex) {
            this.settings.pageIndex = pageIndex < 0 ? 0 : pageIndex > this.totalPages-1 ? this.totalPages-1 : pageIndex;
            this.refresh();
        },
        // render: function () {},
        _getPageButtons: function () {

            var totalRecords = this.settings.totalRecords;
            var totalPages= this.totalPages;

            var pageIndexStart= 0;
            var halfItemsCount= Math.floor(this.settings.pageButtons / 2);
            pageIndexStart= this.settings.pageIndex - halfItemsCount;
            // 上限
            pageIndexStart= pageIndexStart < this.totalPages - this.settings.pageButtons ? pageIndexStart : this.totalPages - this.settings.pageButtons;
            // 下限
            pageIndexStart= pageIndexStart < 0 ? 0 : pageIndexStart;
            
            var output = [];
            for (var i = pageIndexStart, counter = 0; counter < this.settings.pageButtons && i < totalPages; i = i + 1, counter = counter + 1) {//fill the pages
                output.push(i);
            }

            // 首页
            if(pageIndexStart>0){
                output.first = 0;
            }

            // 上一段
            if(this.settings.pageIndex-halfItemsCount > 1){
                output.prevSection=  this.settings.pageIndex-halfItemsCount-1;
            }

            // 上一页
            if (this.settings.pageIndex > 0) {
                output.prev= this.settings.pageIndex - 1;
            } else {
                output.prev= 0;
            }

            // 下一页
            if (this.settings.pageIndex < totalPages-1) {
                output.next= this.settings.pageIndex + 1;
            } else {
                output.next= totalPages-1;
            }

            // 下一段
            if(this.settings.pageIndex+halfItemsCount < this.totalPages-2){
                output.nextSection= this.settings.pageIndex+halfItemsCount+1;
            }

            // 尾页
            if(pageIndexStart<totalPages-this.settings.pageButtons){
                output.last= totalPages-1;
            }

            // output.current= this.settings.pageIndex;//mark the current page.
            // output.total= totalPages;
            // output.pageButtons = this.settings.pageButtons;

            return output;
        },

        // 事件
        // onFooSelected: undefined,
        // onFooChange: function(e, data){}
        // onPageClicked: null,
        // onPageChanged: null,
        onPageIndexChange: function(e){
            var pageIndex= parseInt($(e.target).attr('data-pi'), 10);
            if(this.settings.pageIndex == pageIndex){
                return;
            }

            this.element.trigger('paginator.on.pageindexchange', pageIndex);
            this.jumpTo(pageIndex);
        },

        // 事件处理
        // onFooClick: function(e, data){
        //     ;
        // },

        // API
        refresh: function(){
            //fetch the container class and add them to the container
            var pages = this._getPageButtons();
            var listContainer = this.element;

            // add class
            // this.element.prop('class', '');
            this.element.addClass('pagination');     // pagination-lg / pagination / pagination-sm
            // this.element.addClass(containerClass);

            this.element.empty();

            var htmlItems= '';
            var prev= '<li><a data-pi="'+pages.prev+'">&lt;上一页</a><li>';
            htmlItems+= prev;

            if(typeof pages.first !== 'undefined'){
                var first = '<li><a data-pi="0">1</a><li>';
                htmlItems+= first;
            }

            if(typeof pages.prevSection !== 'undefined'){
                var prevSection= '<li><a data-pi="'+pages.prevSection+'">...</a><li>';
                htmlItems+= prevSection;
            }

            for (var i = 0; i < pages.length; i = i + 1) {
                var itemClass = (pages[i] === this.settings.pageIndex) ? ' class="active"' : '';
                var item = '<li'+itemClass+'><a data-pi="'+pages[i]+'">'+(pages[i]+1)+'</a><li>';
                htmlItems+= item;
            }

            if(typeof pages.nextSection !== 'undefined'){
                var nextSection= '<li><a data-pi="'+pages.nextSection+'">...</a><li>';
                htmlItems+= nextSection;
            }

            if(typeof pages.last !== 'undefined'){
                var last = '<li><a data-pi="'+pages.last+'">'+(pages.last+1)+'</a><li>'; 
                htmlItems+= last;
            }

            var next= '<li><a data-pi="'+pages.next+'">下一页&gt;</a><li>';
            htmlItems+= next;
            listContainer.append(htmlItems);

            $('a', listContainer).on('click', $.proxy(this.onPageIndexChange, this));
        },
        enable: function(){},
        disable: function(){},
        destroy: function () {
            this.element.off('page-clicked');
            this.element.off('page-changed');
            // this.element.removeData('bootstrapPaginator');
            this.element.empty();
        }
    });
});



        // tooltipTitles: function (type, pageIndex, current) {
        //     switch (type) {
        //     case 'first':
        //         return '首页';
        //     case 'prev':
        //         return '上一页';
        //     case 'next':
        //         return '下一页';
        //     case 'last':
        //         return '尾页';
        //     case 'pageIndex':
        //         return (pageIndex === current) ? '当前是第 ' + (pageIndex+1) + ' 页': '跳转到第 ' + (pageIndex+1) + '页';
        //     }
        // },
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
        rightAll: 'right-all' //,
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

            // this.settings,
            // this.container,
            // this.elements,

            // this.value = this.element.val();   

            // 初始化选项
            // this.initSettings(options);
            var jqElement=$(element);
            this.initSettings(jqElement, options);
            
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

            // this.refresh();

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
            //     context.refresh();

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
/* accordion menu javascript jQuery */

/*
 * metismenu - v1.1.3
 * Easy menu jQuery plugin for Twitter Bootstrap 3
 * https://github.com/onokumus/metisMenu
 *
 * Made by Osman Nuri Okumus
 * Under MIT License
 */
;(function($, window, document, undefined) {
    // 严格模式
    'use strict';

    // 控件类名
    var pluginName = "sidebar";

    // 默认值
    var defaults = {
        toggle: true,
        doubleTapToGo: false
    };

    // html 属性(angular)值 -- 类属性名 映射
    var attributeMap = {
        toggle: 'toggle',
        doubleTapToGo: 'double-tap-togo'
    };

    // 构造函数
    function Plugin(element, options) {
        this.element = $(element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // 原型
    Plugin.prototype = {
        init: function() {

            var $this = this.element,
                $toggle = this.settings.toggle,
                obj = this;

            if (this.isIE() <= 9) {
                $this.find("li.active").has("ul").children("ul").collapse("show");
                $this.find("li").not(".active").has("ul").children("ul").collapse("hide");
            } else {
                $this.find("li.active").has("ul").children("ul").addClass("collapse in");
                $this.find("li").not(".active").has("ul").children("ul").addClass("collapse");
            }

            //add the "doubleTapToGo" class to active items if needed
            if (obj.settings.doubleTapToGo) {
                $this.find("li.active").has("ul").children("a").addClass("doubleTapToGo");
            }

            $this.find("li").has("ul").children("a").on("click" + "." + pluginName, function(e) {
                e.preventDefault();

                //Do we need to enable the double tap
                if (obj.settings.doubleTapToGo) {

                    //if we hit a second time on the link and the href is valid, navigate to that url
                    if (obj.doubleTapToGo($(this)) && $(this).attr("href") !== "#" && $(this).attr("href") !== "") {
                        e.stopPropagation();
                        document.location = $(this).attr("href");
                        return;
                    }
                }

                $(this).parent("li").toggleClass("active").children("ul").collapse("toggle");

                if ($toggle) {
                    $(this).parent("li").siblings().removeClass("active").children("ul.in").collapse("hide");
                }

            });
        },

        isIE: function() { //https://gist.github.com/padolsey/527683
            var undef,
                v = 3,
                div = document.createElement("div"),
                all = div.getElementsByTagName("i");

            while (
                div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->",
                all[0]
            ) {
                return v > 4 ? v : undef;
            }
        },

        //Enable the link on the second click.
        doubleTapToGo: function(elem) {
            var $this = this.element;

            //if the class "doubleTapToGo" exists, remove it and return
            if (elem.hasClass("doubleTapToGo")) {
                elem.removeClass("doubleTapToGo");
                return true;
            }

            //does not exists, add a new class and return false
            if (elem.parent().children("ul").length) {
                 //first remove all other class
                $this.find(".doubleTapToGo").removeClass("doubleTapToGo");
                //add the class on the current element
                elem.addClass("doubleTapToGo");
                return false;
            }
        },

        remove: function() {
            this.element.off("." + pluginName);
            this.element.removeData(pluginName);
        }

    };

    // 胶水代码
    $.fn[pluginName] = function(options) {

        this.each(function () {
            var jElement = $(this);
            if (jElement.data(pluginName)) {
                jElement.data(pluginName).remove();
            }
            jElement.data(pluginName, new Plugin(this, $.extend(true, {}, options)));
        });

        return this;

    };

})(jQuery, window, document);
/* =========================================================
 * bootstrap-treeview.js v1.2.0
 * =========================================================
 * Copyright 2013 Jonathan Miles
 * Project URL : http://www.jondmiles.com/bootstrap-treeview
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
 * ========================================================= */


 /*
    1. removed css (move to tree.less)
    2. removed buildStyleOverride
 */

Jx().package("T.UI.Components", function(J){
    // 严格模式
    'use strict';

    // 勾选框是否显示
    var enumShowCheckbox= {
        none: 'none',       // 0 所有节点都不显示勾选框(默认)
        all: 'all',         // 1 所有节点都显示勾选框        
        leaf: 'leaf'        // 2 仅叶子节点显示勾选框
    };

    // 勾选框选中状态
    var enumCheckedState= {
        unchecked: 'unchecked', // 0 选中(默认)
        checked: 'checked',     // 1 未选中
        partOf: 'partOf'        // 2 部分子节点选中
    };

    // 节点是否可选
    var enumSelectMode= {
        // none: 'none',       // 0 所有不可选中(默认) TODO:逻辑代码未实现
        all: 'all',         // 1 所有可选中
        leaf: 'leaf'        // 2 仅叶子节点可选中
    };

    var emptyFun= function(){};

    // 全局变量、函数、对象
    var defaults = {
        // id: 'id',               // id数据字段名称
        // children: 'children',   // 子节点数据字段名称
        levels: 2,
        dataUrl: '',

        // expandIcon: 'glyphicon glyphicon-plus',
        // collapseIcon: 'glyphicon glyphicon-minus',
        expandIcon: 'glyphicon glyphicon-chevron-right',
        collapseIcon: 'glyphicon glyphicon-chevron-down',        
        emptyIcon: 'glyphicon',
        nodeIcon: '',
        selectedIcon: '',
        checkedIcon: 'glyphicon glyphicon-check',
        // checkedPartOfIcon: 'glyphicon glyphicon-checked-partof', // 图标用checked，颜色用灰色(黑灰白)
        uncheckedIcon: 'glyphicon glyphicon-unchecked',

        enableLinks: false,
        enableTitle: false,
        showIcon: true,
        // showCheckbox: false,
        showTags: false,
        multiSelect: false,

        // nodeOptions
        silent: false,
        ignoreChildren: false,

        // extend
        showCheckbox: enumShowCheckbox.none,
        checkRecursive: false,
        selectMode: enumSelectMode.none,
        // appendHtml: '',
        // parseAppendHtml: undefined, // for angularjs: function(html){ return $compile(html)($scope); }

        selectedNodeIds: '',
        checkedNodeIds: '',

        // Event handlers
        onNodeChecked: emptyFun,
        onNodeCollapsed: emptyFun,
        onNodeDisabled: emptyFun,
        onNodeEnabled: emptyFun,
        onNodeExpanded: emptyFun,
        onNodeSelected: emptyFun,
        onNodeUnchecked: emptyFun,
        onNodeUnselected: emptyFun,
        onSearchComplete: emptyFun,
        onSearchCleared: emptyFun
    };

    var attributeMap = {
        expandIcon: 'expand-icon',
        collapseIcon: 'collapse-icon',

        enableTitle: 'enable-title',
        showTags: 'show-tags',
        levels: 'levels',        
        multiSelect: 'multi-select',

        dataUrl: 'data-url',

        selectedNodeIds: 'selected-node-ids',
        checkedNodeIds: 'checked-node-ids'
    };

    // var state= jqNode.find('.expand-icon').hasClass(this.settings.expandIcon);
    // fix for multi class in this.settings.expandIcon, like: 'glyphicon glyphicon-chevron-right'
    function hasClasses(jqElement, classes){
        var arrClass= classes.split(' ');
        var has= true;
        for(var i=0; i< arrClass.length; i++){
            if(!jqElement.hasClass(arrClass[i])){
                has= false;
                break;
            }
        }
        return has;
    }

    this.Tree = new J.Class({extend : T.UI.BaseControl}, {
        defaults : defaults,
        attributeMap : attributeMap,


        // 构造函数
        init: function(element, options){
            // -----------------------------------------------
            // options
            // -----------------------------------------------
            // 初始化选项
            // this.initSettings(this.element, options);
            var jqElement=$(element);
            this.initSettings(jqElement, options);
            if (typeof (this.settings.parseData) === 'function') {
                this.parseData = this.settings.parseData;
                delete this.settings.parseData;
            }

            // -----------------------------------------------
            // value
            // -----------------------------------------------
            // this.value = this.element.val();

            // -----------------------------------------------
            // data
            // -----------------------------------------------
            this.data= [];
            this.idIndexMap= {};

            var context= this;
            // 初始化数据
            $.when(this.getData())
             .done(function(){
                context.render(jqElement);
            });
        },

        getData: function(){
            var d = $.Deferred();

            if (this.settings.data) {
                var data = $.extend(true, [], this.settings.data);
                this.data= this.parseData(data);
                delete this.settings.data;

                d.resolve();
                return d.promise();
            }

            var context = this;
            $.ajax({
                dataType: 'json',
                url: context.settings.dataUrl,
                data: {},
                success: function(data){
                    var innerData= context.parseData(data);
                    context.data= innerData;    //$.extend(true, [], innerData);
                    d.resolve();
                },
                error: function(xmlHttpRequest, status, error){
                    alert('控件id：' + context.element.attr('id')+'，ajax获取数据失败!');

                    d.resolve();
                }
            });

            return d.promise();
        },

        parseData: function(data){
            var innerData= [];

            var index= 0;
            var context= this;
            function recurseTree (node, level) {
                if (!node.nodes) return;

                level ++;

                // $.each(node.nodes, function checkStates(index, node) {
                for(var i=0; i<node.nodes.length; i++){
                    var child= node.nodes[i];

                    // nodeId : unique, incremental identifier
                    // child._innerId = this.nodes.length;
                    child.id = child.id || index;
                    child._innerParentId = node.id;
                    child._innerPath = (node._innerPath || 'r') + '|' + child.id;
                    child._innerLevel = level;

                    innerData.push(child);
                    var idProperty= 'id_' + child.id;
                    context.idIndexMap[idProperty] = index;

                    index ++

                    // recurse child nodes and transverse the tree
                    if (child.nodes) {
                        recurseTree(child, level);
                    }
                }
            }

            recurseTree({ nodes: data }, 0);

            return innerData;
        },

        updateData: function(data){
            var innerData= $.extend(true, [], data);
            this.data= this.parseData(data);
        },

        render: function(jqElement){
            // -----------------------------------------------
            // html
            // -----------------------------------------------
            this.buildHtml(jqElement);
            // this.transferAttributes();
            this.initElements(jqElement);
            this.refresh();
            // -----------------------------------------------
            // states
            // -----------------------------------------------
            // this.initStates(jqElement);
            // -----------------------------------------------
            // events
            // -----------------------------------------------
            // this.buildObservers();
            this.bindEvents();
            // this.bindEventsInterface();
        },

        buildHtml: function(element){
            element.addClass('t-tree');
            this.container = $('<ul class="list-group"></ul>'); // list
            element
                .empty()
                .append(this.container);
        },

        initElements: function(element){
            var context= this;

            this.elements={
                original: element,
                getAllNodes: function(){
                    var allNodes= $('li', context.container);
                    return allNodes;
                },
                getNode: function(nodeId){
                    var child= $('li[data-id="'+nodeId+'"]', context.container);
                    return child;
                },
                getChildNodes: function(nodeId){
                    var jqNode= this.getNode(nodeId);
                    var path= jqNode.data('path');
                    var children= $('li[data-path^="'+path+'|"]', context.container);
                    return children;
                },
                getChildNodesChecked: function(nodeId){
                    var jqNode= this.getNode(nodeId);
                    var path= jqNode.data('path');
                    var children= $('li.node-checked[data-path^="'+path+'|"]', context.container);
                    return children;
                },
                getChildNodesCheckedPartOf: function(nodeId){
                    var jqNode= this.getNode(nodeId);
                    var path= jqNode.data('path');
                    var children= $('li.node-checked-partof[data-path^="'+path+'|"]', context.container);
                    return children;
                },
                getLevelNodes: function(level){
                    var child= $('li[data-level="'+level+'"]', context.container);
                    return child;
                },
                getSelectedNodes: function(unselected){
                    var nodeSelector= unselected ? 'li:not(.node-selected)' : 'li.node-selected';
                    var selectedNodes = $(nodeSelector, context.container);
                    return selectedNodes;
                },
                getCheckedNodes: function(unchecked){
                    var nodeSelector= unchecked ? 'li:not(.node-checked)' : 'li.node-checked';
                    var checkedNodes= $(nodeSelector, context.container);
                    return checkedNodes;
                },
                getDisabledNodes: function(disabled){
                    var nodeSelector= disabled ? 'li:not(.node-disabled)' : 'li.node-disabled';
                    var checkedNodes= $(nodeSelector, context.container);
                    return checkedNodes;
                },
                getSearchResultNodes: function(notResult){
                    var nodeSelector= notResult ? 'li:not(.search-result)' : 'li.search-result';
                    var checkedNodes= $(nodeSelector, context.container);
                    return checkedNodes;
                }
            };
        },

        buildTree: function () {    // nodes, level
            // if (!nodes) return;
            // level += 1;

            for(var i=0; i<this.data.length; i++){  // nodes
                var node=this.data[i];

                var item= this.buildItem(node);

                // Add item to the tree
                this.container.append(item);

                // // Recursively add child ndoes
                // if (node.nodes) {   // && !node.state.disabled && node.state.expanded TODO:移除原有expanded机制，改为显示/隐藏模式
                //     this.buildTree(node.nodes, level);
                // }
            }
        },

        buildItem: function(node){
            var hasChildren= node.nodes && node.nodes.length>0;

            // indent
            var indent= '';
            for (var j = 0; j < (node._innerLevel - 1); j++) {
                indent+='<span class="indent"></span>';
            }

            // icon
            // var cssClassIcon= 'icon';
            // if (node.nodes) {
            //     cssClassIcon += node.state.expanded ? ' expand-icon '+this.settings.collapseIcon : ' expand-icon '+this.settings.expandIcon;
            // }
            // else {
            //     cssClassIcon += ' ' + this.settings.emptyIcon;
            // }
            var cssClassIcon= 'icon';
            if (hasChildren) {
                cssClassIcon += node._innerLevel < this.settings.levels ? ' expand-icon '+this.settings.collapseIcon : ' expand-icon '+this.settings.expandIcon;
            }
            else {
                cssClassIcon += ' ' + this.settings.emptyIcon;
            }

            var icon= '<span class="'+cssClassIcon+'"></span>';

            // node icon
            var nodeIcon= '';
            if (this.settings.showIcon) {
                var cssClassNodeIcon= 'icon node-icon ';
                // if (node.state.selected) {
                //     cssClassNodeIcon += (node.selectedIcon || this.settings.selectedIcon || node.icon || this.settings.nodeIcon);
                // }
                // else{
                //     cssClassNodeIcon += (node.icon || this.settings.nodeIcon);
                // }
                cssClassNodeIcon += (node.icon || this.settings.nodeIcon);
                nodeIcon= '<span class="'+cssClassNodeIcon+'"></span>'; // icon
            }

            // Add check / unchecked icon
            var check= '';
            // if (this.settings.showCheckbox) {
            if (this.settings.showCheckbox === enumShowCheckbox.all || (!hasChildren && this.settings.showCheckbox === enumShowCheckbox.leaf)) {
                var cssClassCheck= 'icon check-icon ';
                // if (node.state.checked) {
                //     cssClassCheck += this.settings.checkedIcon; 
                // }
                // else {
                //     cssClassCheck += this.settings.uncheckedIcon;
                // }
                cssClassCheck += this.settings.uncheckedIcon;
                check= '<span class="'+ cssClassCheck +'"></span>';
            }

            // tags as badges
            var badge= '';
            if (this.settings.showTags && node.tags) {
                for(var k=0; k<node.tags.length; k++){
                    var tag=node.tags[k];
                    badge += '<span class="badge">'+tag+'</span>';  // badge
                }
            }

            // append html to li
            // var appendHtml= this.settings.appendHtml;
            // if(appendHtml){
            //     if(this.settings.parseAppendHtml){
            //         appendHtml= this.settings.parseAppendHtml(appendHtml);
            //     }
            //     // else{
            //     //     appendHtml= this.settings.appendHtml
            //     // }
            // }

            // item
            var cssClass= 'list-group-item';
            // cssClass += node.state.checked ? ' node-checked' : '';
            // cssClass += node.state.disabled ? ' node-disabled' : '';
            // cssClass += node.state.selected ? ' node-selected' : '';
            // cssClass += node.searchResult ? ' search-result' : '';
            if(hasChildren){
                // cssClass += 'has-children';
                if(this.settings.selectNode === enumSelectMode.leaf){
                    cssClass += ' node-unselelctable';
                }
            }
            var item= ''+
                '<li '+
                '   class="' + cssClass + '" '+
                (this.settings.levels && node._innerLevel > this.settings.levels ? 
                '   style="display: none;"' : '')+  // 隐藏应该折叠的nodes
                (this.settings.enableTitle ? 
                '   title="'+node.text+'"' : '')+
                '   data-id="'+node.id+'"'+
                '   data-level="'+node._innerLevel+'"'+
                '   data-path="'+node._innerPath+'">'+
                indent +
                icon +
                nodeIcon +
                check +
                (this.settings.enableLinks ? 
                '   <a href="'+node.href+'" style="color:inherit;">'+node.text+'</a>' : node.text) +
                // appendHtml+
                badge +
                '</li>';

            return item;
        },

        refresh: function () {
            this.container.empty();
            this.buildTree();
            this.initStates();
        },

        initStates: function(){
            if(this.settings.selectedNodeIds){
                this.selectedNodeByIds(this.settings.selectedNodeIds);
            }
            if(this.settings.checkedNodeIds){
                this.selectedNodeByIds(this.settings.checkedNodeIds);
            }
        },

        // 点击事件处理器
        clickHandler: function (event) {

            if (!this.settings.enableLinks) {
                event.preventDefault();
            }

            var target = $(event.target);
            var jqNode = target.closest('li.list-group-item');
            if (jqNode.hasClass('node-disabled')) {
                return;
            }
            
            var nodeId = jqNode.data('id');

            var classList = target.attr('class') ? target.attr('class').split(' ') : [];
            if ((classList.indexOf('expand-icon') !== -1)) {
                this.toggleExpandedState(nodeId, this.settings.silent, this.settings.ignoreChildren);
                return;
            }

            if ((classList.indexOf('check-icon') !== -1)) {                
                this.toggleCheckedState(nodeId, this.settings.silent);
                return;
            }

            // if (node.selectable) {
            //     this.toggleSelectedState(nodeId, this.settings.silent);
            // } else {
            //     this.toggleExpandedState(nodeId, this.settings.silent);
            // }
            if(!jqNode.hasClass('node-unselelctable')){
                this.toggleSelectedState(nodeId, this.settings.silent);
            }
        },

        // -------------------------------------------------------------------
        // 展开 / 折叠
        // -------------------------------------------------------------------

        setExpandedState: function (nodeId, state, silent, ignoreChildren) {
            var jqNode= this.elements.getNode(nodeId);
            var jqChildren= this.elements.getChildNodes(nodeId);

            if (jqChildren.length>0 && !ignoreChildren) {
                var context= this;
                jqChildren.each(function(){
                    var nodeId= $(this).data('id');
                    context.setExpandedState(nodeId, state, silent, ignoreChildren);
                });
            }

            if (state) {
                jqNode.find('.expand-icon').removeClass(this.settings.expandIcon).addClass(this.settings.collapseIcon);                
                jqChildren.show();

                if (!silent) {
                    this.elements.original.trigger('nodeExpanded', nodeId);
                }
            } else {
                jqNode.find('.expand-icon').removeClass(this.settings.collapseIcon).addClass(this.settings.expandIcon);
                jqChildren.hide();

                if (!silent) {
                    this.elements.original.trigger('nodeCollapsed', nodeId);
                }
            }
        },

        collapseNode: function (nodeIds, silent, ignoreChildren) {
            for(var i=0; i<nodeIds.length; i++){
                this.setExpandedState(nodeIds[i], false, silent, ignoreChildren);
            }
        },

        expandNode: function (nodeIds, levels, silent, ignoreChildren) {
            for(var i=0; i<nodeIds.length; i++){
                var nodeId= nodeIds[i];

                this.setExpandedState(nodeId, true, silent, ignoreChildren);

                var children= this.elements.getChildNodes(nodeId);
                levels= levels || this.settings.levels;
                if (children.length>0 && levels) {
                    var arrNodeId= [];
                    children.each(function(){
                        arrNodeId.push($(this).data('id'));
                    });
                    this.expandLevels(arrNodeId, levels-1, silent, ignoreChildren);
                }
            }
        },

        toggleExpandedState: function (nodeId, silent, ignoreChildren) {
            var jqNode= this.elements.getNode(nodeId);
            var jqExpand= jqNode.find('.expand-icon');

            var state= hasClasses(jqExpand, this.settings.collapseIcon);

            this.setExpandedState(nodeId, !state, silent, ignoreChildren);
        },

        toggleNodeExpanded: function (nodeIds, silent, ignoreChildren) {
            for(var i=0; i<nodeIds.length; i++){
                this.toggleExpandedState(nodeIds[i], silent, ignoreChildren);
            }
        },

        expandLevels: function (nodeIds, levels, silent, ignoreChildren) {
            for(var i=0; i<nodeIds.length; i++){
                var nodeId= nodeIds[i];
                this.setExpandedState(nodeId, levels > 0, silent, ignoreChildren); //  (level > 0) ? true : false
                var children= this.elements.getChildNodes(nodeId);
                if(children.length>0){
                    var arrNodeId= [];
                    children.each(function(){
                        arrNodeId.push($(this).data('id'));
                    });

                    this.expandLevels(arrNodeId, levels-1, silent, ignoreChildren);
                }
            }
        },

        expandAll: function (levels, silent, ignoreChildren) {
            var levels= levels || this.settings.levels;
            if (levels) {
                var arrNodeId=[];
                for(var i=0; i<this.data.length; i++){
                    arrNodeId.push(this.data[i].id);
                }

                this.expandLevels(arrNodeId, levels, silent, ignoreChildren);   // this.data
            }
            else {
                var nodes= this.elements.getLevelNodes(1);
                var context= this;
                nodes.each(function(){
                    var nodeId= $(this).data('id');
                    context.setExpandedState(nodeId, true, silent, ignoreChildren);
                });
            }
        },

        collapseAll: function (silent, ignoreChildren) {
            var nodes= this.elements.getLevelNodes(1);
            var context= this;
            nodes.each(function(){
                var nodeId= $(this).data('id');
                context.setExpandedState(nodeId, false, silent, ignoreChildren);
            });
        },        

        // -------------------------------------------------------------------
        // 选中
        // -------------------------------------------------------------------

        setSelectedState: function (nodeId, state, silent) {
            var jqNode= this.elements.getNode(nodeId);

            if(jqNode.hasClass('node-unselelctable')){
                return;
            }

            if (state) {
                if (!this.settings.multiSelect) {
                    this.elements.getSelectedNodes(false).removeClass('node-selected');
                }

                jqNode.addClass('node-selected');
                if (!silent) {
                    this.elements.original.trigger('nodeSelected', nodeId);
                }
            }
            else {
                jqNode.removeClass('node-selected');
                if (!silent) {
                    this.elements.original.trigger('nodeUnselected', nodeId);
                }
            }
        },

        selectNode: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.setSelectedState(nodeIds[i], true, silent);
            }
        },

        unselectNode: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.setSelectedState(nodeIds[i], false, silent);
            }
        },

        toggleSelectedState: function (nodeId, silent) {
            var jqNode= this.elements.getNode(nodeId);
            var state= jqNode.hasClass('node-selected');

            this.setSelectedState(nodeId, !state, silent);
        },

        toggleNodeSelected: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.toggleSelectedState(nodeIds[i], silent);
            }
        },

        // -------------------------------------------------------------------
        // checkbox
        // -------------------------------------------------------------------

        setCheckedState: function(nodeId, state, silent){
            this._innerSetChcekedState(nodeId, state, silent);

            // 级联勾选
            if(this.settings.checkRecursive){
                var node= this.getNode(nodeId); // TODO:直接用dom里的数据，不要用this.data和this.getNode()
                this.checkRecursiveParent(node, state, silent);
                this.checkRecursiveChildren(node, state, silent);
            }
        },

        _innerSetChcekedState: function(nodeId, state, silent){
            var jqNode= this.elements.getNode(nodeId);
            var jqCheck= jqNode.find('.check-icon');

            switch(state){
                case enumCheckedState.checked: {
                    jqNode
                        .removeClass('node-checked-partof')
                        .addClass('node-checked');
                    jqCheck
                        .removeClass(this.settings.uncheckedIcon)
                        .removeClass(this.settings.checkedpartOfIcon)
                        .addClass(this.settings.checkedIcon);

                    if (!silent) {
                        // this.elements.original.trigger('nodeChecked', $.extend(true, {}, node));
                        this.elements.original.trigger('nodeChecked', nodeId);
                    }

                    break;
                }
                case enumCheckedState.unchecked: {
                    jqNode
                        .removeClass('node-checked')
                        .removeClass('node-checked-partof');
                    jqCheck
                        .removeClass(this.settings.checkedIcon)
                        .removeClass(this.settings.checkedpartOfIcon)
                        .addClass(this.settings.uncheckedIcon);

                    if (!silent) {
                        this.elements.original.trigger('nodeUnchecked', nodeId);
                    }

                    break;
                }
                case enumCheckedState.partof: {
                    jqNode
                        .removeClass('node-checked')
                        .addClass('node-checked-partof');
                    jqCheck
                        .removeClass(this.settings.checkedIcon)
                        .removeClass(this.settings.uncheckedIcon)
                        .addClass(this.settings.checkedpartOfIcon);

                    if (!silent) {
                        this.elements.original.trigger('nodeUnchecked', nodeId);
                    }

                    break;
                }
            }
        },

        checkRecursiveParent: function(node, state, silent){
            // if(!node._innerParentId){
            // 可能等于0
            if(typeof node._innerParentId === 'undefined'){
                return;
            }

            var parent= this.getNode(node._innerParentId);
            while(parent){
                var parentState;
                switch(state){
                    case enumCheckedState.checked: 
                    case enumCheckedState.unchecked: {
                        // 条件1 state= checked / unchecked
                        // 条件2 Sibling is all checked or has CheckedPartOf
                        // var isSiblingAllSameCheckedState= false;

                        var numberOfSiblingCheckedPartOf= this.elements.getChildNodesCheckedPartOf(parent.id).length;
                        if(numberOfSiblingCheckedPartOf > 0){
                            parentState= enumCheckedState.partOf;
                        }
                        else{
                            var numberOfSiblingChecked= this.elements.getChildNodesChecked(parent.id).length;
                            if(numberOfSiblingChecked === 0){
                                parentState= enumCheckedState.unchecked;
                            }
                            else{
                                // var numberOfSibling= this.elements.getChildNodes(parent.id).length;
                                // if(numberOfSiblingChecked === numberOfSibling){
                                parentState= enumCheckedState.checked;
                                // }
                            }
                        }

                        break;
                    }
                    case enumCheckedState.partOf: {
                        parentState= state;

                        break;
                    }
                }

                this._innerSetChcekedState(parent.id, parentState, silent);

                parent= this.getNode(parent._innerParentId);
            }
        },

        checkRecursiveChildren: function(node, state, silent){
            if(node.nodes && node.nodes.length>0){
                for(var i=0; i<node.nodes.length; i++){
                    var child= node.nodes[i];
                    this._innerSetChcekedState(child.id, state, silent);
                    this.checkRecursiveChildren(child, state, silent);
                }
            }
        },

        checkNode: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.setCheckedState(nodeIds[i], 'checked', silent);
            }
        },

        uncheckNode: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.setCheckedState(nodeIds[i], 'unchecked', silent);
            }
        },

        toggleCheckedState: function (nodeId, silent) {
            var jqNode= this.elements.getNode(nodeId);
            var jqCheck= jqNode.find('.check-icon');

            // 是否未选中
            var state= hasClasses(jqCheck, this.settings.uncheckedIcon);

            // 在选中和部分选中的情况下切换为不选中
            // this.setCheckedState(nodeId, !state, silent);
            this.setCheckedState(nodeId, state ? 'checked' : 'unchecked', silent);
        },

        toggleNodeChecked: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.toggleCheckedState(nodeIds[i], silent);
            }
        },

        checkAll: function (silent) {
            var checkedNodes= this.elements.getCheckedNodes(true);
            var jqCheck= checkedNodes.find('.check-icon');

            checkedNodes.addClass('node-checked');
            jqCheck.removeClass(this.settings.uncheckedIcon).addClass(this.settings.checkedIcon);

            if (!silent) {
                var context= this;
                checkedNodes.each(function(){
                    var nodeId= $(this).data('id');
                    context.elements.original.trigger('nodeChecked', nodeId);
                });
            }
        },

        uncheckAll: function (silent) {
            var uncheckedNodes= this.elements.getCheckedNodes(false);
            var jqCheck= uncheckedNodes.find('.check-icon');

            uncheckedNodes.removeClass('node-checked');            
            jqCheck.removeClass(this.settings.checkedIcon).addClass(this.settings.uncheckedIcon);

            if (!silent) {
                var context= this;
                uncheckedNodes.each(function(){
                    var nodeId= $(this).data('id');
                    context.elements.original.trigger('nodeUnchecked', nodeId);
                });
            }
        },

        // -------------------------------------------------------------------
        // 启用 / 禁用
        // -------------------------------------------------------------------

        setDisabledState: function (nodeId, state, silent, ignoreChildren) {
            var jqNode= this.elements.getNode(nodeId);

            if (state) {
                jqNode.addClass('node-disabled');

                // Disable all other states
                this.setExpandedState(nodeId, false, silent, ignoreChildren);
                this.setSelectedState(nodeId, false, silent);
                this.setCheckedState(nodeId, 'unchecked', silent);

                if (!silent) {
                    this.elements.original.trigger('nodeDisabled', nodeId);
                }
            }
            else {
                jqNode.removeClass('node-disabled');

                if (!silent) {
                    this.elements.original.trigger('nodeEnabled', nodeId);
                }
            }
        },

        enableNode: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.setDisabledState(nodeIds[i], false, silent);
            }
        },

        disableNode: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.setDisabledState(nodeIds[i], true, silent);
            }
        },

        toggleDisabledState: function (nodeId, silent) {
            var jqNode= this.elements.getNode(nodeId);
            var state= jqNode.hasClass('node-disabled');

            this.setDisabledState(nodeId, !state, silent);
        },

        toggleNodeDisabled: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.toggleDisabledState(nodeIds[i], silent);
            }
        },

        disableAll: function (silent, ignoreChildren) {            
            var enabledNodes= this.elements.getDisabledNodes(true);
            enabledNodes.addClass('node-disabled');

            var context= this;
            enabledNodes.each(function(){
                var nodeId= $(this).data('id');

                // Disable all other states
                context.setExpandedState(nodeId, false, silent, ignoreChildren);
                context.setSelectedState(nodeId, false, silent);
                context.setCheckedState(nodeId, 'unchecked', silent);

                if (!silent) {
                    context.elements.original.trigger('nodeDisabled', nodeId);
                }
            });
        },

        enableAll: function (silent, ignoreChildren) {
            var disabledNodes= this.elements.getDisabledNodes(false);
            disabledNodes.removeClass('node-disabled');

            var context= this;
            disabledNodes.each(function(){
                var nodeId= $(this).data('id');

                // // Enable all other states
                // context.setExpandedState(nodeId, true, silent, ignoreChildren);
                // context.setSelectedState(nodeId, true, silent);
                // context.setCheckedState(nodeId, 'checked', silent);

                if (!silent) {
                    context.elements.original.trigger('nodeEnabled', nodeId);
                }
            });            
        },

        getNode: function(nodeId){
            var nodeIndex= this.idIndexMap['id_'+nodeId];
            return this.data[nodeIndex];
        },

        revealNode: function (nodeIds, options) {
            // this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            //     var parentNode = this.getParent(node);
            //     while (parentNode) {
            //         this.setExpandedState(parentNode, true, options);
            //         parentNode = this.getParent(parentNode);
            //     };
            // }, this));

            for(var i=0; i<nodeIds.length; i++){
                var nodeId= nodeIds[i];
                var jqNode= this.elements.getNode(nodeId);
                var path= jqNode.data('path');
                var arrPath= path.split('|');
                for(var j=1; j<arrPath.length-1; j++){
                    this.setExpandedState(arrPath[j], true, options);
                }
            }
        },

        search: function (pattern, options) {
            var searchOptions = {
                ignoreCase: true,
                exactMatch: false,
                revealResults: true
            };

            options = $.extend({}, searchOptions, options);

            this.clearSearch();

            var results = [];
            if (pattern && pattern.length > 0) {

                if (options.exactMatch) {
                    pattern = '^' + pattern + '$';
                }

                var modifier = 'g';
                if (options.ignoreCase) {
                    modifier += 'i';
                }

                results = this.findNodes(pattern, modifier);
            }

            if (options.revealResults) {
                this.revealNode(results);
            }

            this.elements.original.trigger('searchComplete', $.extend(true, {}, results));

            return results;
        },

        clearSearch: function () {
            var searchResults= this.elements.getSearchResultNodes();
            searchResults.removeClass('search-result');
            
            this.elements.original.trigger('searchCleared');    // , $.extend(true, {}, results)
        },

        findNodes: function (pattern, modifier) {   // , attribute
            modifier = modifier || 'g';
            // attribute = attribute || 'text';

            var allNodes= this.elements.getAllNodes();

            var results= [];
            for(var i=0; i<allNodes.length; i++){
                var jqNode= $(allNodes[i]);
                var val = jqNode.text();
                var isMatched= val.match(new RegExp(pattern, modifier));
                if(isMatched){
                    jqNode.addClass('search-result');
                    results.push(jqNode.data('id'));
                }
            }

            return results;
        },

        destroy: function () {
            this.container.empty();
            this.container = null;
            this.unsubscribeEvents();
        },
        // 取消事件监听
        unbindEvents: function () {
            this.elements.original.off('click');
            this.elements.original.off('nodeChecked');
            this.elements.original.off('nodeCollapsed');
            this.elements.original.off('nodeDisabled');
            this.elements.original.off('nodeEnabled');
            this.elements.original.off('nodeExpanded');
            this.elements.original.off('nodeSelected');
            this.elements.original.off('nodeUnchecked');
            this.elements.original.off('nodeUnselected');
            this.elements.original.off('searchComplete');
            this.elements.original.off('searchCleared');
        },
        // 监听事件
        bindEvents: function () {
            this.unbindEvents();

            this.elements.original.on('click', $.proxy(this.clickHandler, this));
            // 节点勾选
            this.elements.original.on('nodeChecked', this.settings.onNodeChecked);
            // 节点收起
            this.elements.original.on('nodeCollapsed', this.settings.onNodeCollapsed);
            // 节点禁用
            this.elements.original.on('nodeDisabled', this.settings.onNodeDisabled);
            // 节点启用
            this.elements.original.on('nodeEnabled', this.settings.onNodeEnabled);
            // 节点展开
            this.elements.original.on('nodeExpanded', this.settings.onNodeExpanded);
            // 节点选中
            this.elements.original.on('nodeSelected', this.settings.onNodeSelected);
            // 节点取消勾选
            this.elements.original.on('nodeUnchecked', this.settings.onNodeUnchecked);
            // 节点取消选中
            this.elements.original.on('nodeUnselected', this.settings.onNodeUnselected);
            // 搜索完成
            this.elements.original.on('searchComplete', this.settings.onSearchComplete);
            // 搜索结果清除
            this.elements.original.on('searchCleared', this.settings.onSearchCleared);
        }
    });
});




        // API
        
        // /**
        //     Returns an array of selected nodes.
        //     @returns {Array} nodes - Selected nodes
        // */
        // getSelected: function () {
        //     return this.findNodes('true', 'g', 'state.selected');
        // },

        // /**
        //     Returns an array of unselected nodes.
        //     @returns {Array} nodes - Unselected nodes
        // */
        // getUnselected: function () {
        //     return this.findNodes('false', 'g', 'state.selected');
        // },

        // /**
        //     Returns an array of expanded nodes.
        //     @returns {Array} nodes - Expanded nodes
        // */
        // getExpanded: function () {
        //     return this.findNodes('true', 'g', 'state.expanded');
        // },

        // /**
        //     Returns an array of collapsed nodes.
        //     @returns {Array} nodes - Collapsed nodes
        // */
        // getCollapsed: function () {
        //     return this.findNodes('false', 'g', 'state.expanded');
        // },

        // /**
        //     Returns an array of checked nodes.
        //     @returns {Array} nodes - Checked nodes
        // */
        // getChecked: function () {
        //     return this.findNodes('true', 'g', 'state.checked');
        // },

        // /**
        //     Returns an array of unchecked nodes.
        //     @returns {Array} nodes - Unchecked nodes
        // */
        // getUnchecked: function () {
        //     return this.findNodes('false', 'g', 'state.checked');
        // },

        // /**
        //     Returns an array of disabled nodes.
        //     @returns {Array} nodes - Disabled nodes
        // */
        // getDisabled: function () {
        //     return this.findNodes('true', 'g', 'state.disabled');
        // },

        // /**
        //     Returns an array of enabled nodes.
        //     @returns {Array} nodes - Enabled nodes
        // */
        // getEnabled: function () {
        //     return this.findNodes('false', 'g', 'state.disabled');
        // },



            // var arrNodesResult= $.grep(allNodes, function (element) {
            //     var jqNode= $(element);
            //     var val = jqNode.text();
            //     var isMatched= val.match(new RegExp(pattern, modifier));
            //     return isMatched;
            // });




        // buildTree: function (nodes, level) {
        //     if (!nodes) return;
        //     level += 1;

        //     for(var i=0; i<nodes.length; i++){
        //         var node=nodes[i];

        //         var item= this.buildItem(node, level);

        //         // Add item to the tree
        //         this.container.append(item);

        //         // Recursively add child ndoes
        //         if (node.nodes) {   // && !node.state.disabled && node.state.expanded TODO:移除原有expanded机制，改为显示/隐藏模式
        //             this.buildTree(node.nodes, level);
        //         }
        //     }
        // },
        
        // buildItem: function(node, level){
        //     // indent
        //     var indent= '';
        //     for (var j = 0; j < (level - 1); j++) {
        //         indent+='<span class="indent"></span>';
        //     }

        //     // icon
        //     // var cssClassIcon= 'icon';
        //     // if (node.nodes) {
        //     //     cssClassIcon += node.state.expanded ? ' expand-icon '+this.settings.collapseIcon : ' expand-icon '+this.settings.expandIcon;
        //     // }
        //     // else {
        //     //     cssClassIcon += ' ' + this.settings.emptyIcon;
        //     // }
        //     var cssClassIcon= 'icon';
        //     if (node.nodes && node.nodes.length > 0) {
        //         cssClassIcon += level < this.settings.levels ? ' expand-icon '+this.settings.collapseIcon : ' expand-icon '+this.settings.expandIcon;
        //     }
        //     else {
        //         cssClassIcon += ' ' + this.settings.emptyIcon;
        //     }

        //     var icon= '<span class="'+cssClassIcon+'"></span>';

        //     // node icon
        //     var nodeIcon= '';
        //     if (this.settings.showIcon) {
        //         var cssClassNodeIcon= 'icon node-icon ';
        //         // if (node.state.selected) {
        //         //     cssClassNodeIcon += (node.selectedIcon || this.settings.selectedIcon || node.icon || this.settings.nodeIcon);
        //         // }
        //         // else{
        //         //     cssClassNodeIcon += (node.icon || this.settings.nodeIcon);
        //         // }
        //         cssClassNodeIcon += (node.icon || this.settings.nodeIcon);
        //         nodeIcon= '<span class="'+cssClassNodeIcon+'"></span>'; // icon
        //     }

        //     // Add check / unchecked icon
        //     var check= '';
        //     if (this.settings.showCheckbox) {
        //         var cssClassCheck= 'icon check-icon ';
        //         // if (node.state.checked) {
        //         //     cssClassCheck += this.settings.checkedIcon; 
        //         // }
        //         // else {
        //         //     cssClassCheck += this.settings.uncheckedIcon;
        //         // }
        //         cssClassCheck += this.settings.uncheckedIcon;
        //         check= '<span class="'+ cssClassCheck +'"></span>';
        //     }

        //     // tags as badges
        //     var badge= '';
        //     if (this.settings.showTags && node.tags) {
        //         for(var k=0; k<node.tags.length; k++){
        //             var tag=node.tags[k];
        //             badge += '<span class="badge">'+tag+'</span>';  // badge
        //         }
        //     }

        //     // item
        //     var cssClass= 'list-group-item';
        //     // cssClass += node.state.checked ? ' node-checked' : '';
        //     // cssClass += node.state.disabled ? ' node-disabled' : '';
        //     // cssClass += node.state.selected ? ' node-selected' : '';
        //     // cssClass += node.searchResult ? ' search-result' : '';
        //     var item= ''+
        //         '<li '+
        //         '   class="' + cssClass + '" '+
        //         (this.settings.levels && level>this.settings.levels ? 
        //         '   style="display: none;"' : '')+  // 隐藏应该折叠的nodes
        //         (this.settings.enableTitle ? 
        //         '   title="'+node.text+'"' : '')+
        //         '   data-id="'+node.id+'"'+
        //         '   data-level="'+level+'"'+
        //         '   data-path="'+node._innerPath+'">'+
        //         indent +
        //         icon +
        //         nodeIcon +
        //         check +
        //         (this.settings.enableLinks ? 
        //         '   <a href="'+node.href+'" style="color:inherit;">'+node.text+'</a>' : node.text) +
        //         badge +
        //         '</li>';

        //     return item;
        // },



        // setCheckedState: function(nodeId, state, silent){
        //     var jqNode= this.elements.getNode(nodeId);
        //     var jqCheck= jqNode.find('.check-icon');

        //     if (state) {   
        //         jqNode.addClass('node-checked');
        //         jqCheck.removeClass(this.settings.uncheckedIcon).addClass(this.settings.checkedIcon);

        //         if (!silent) {
        //             // this.elements.original.trigger('nodeChecked', $.extend(true, {}, node));
        //             this.elements.original.trigger('nodeChecked', nodeId);
        //         }
        //     }
        //     else {
        //         jqNode.removeClass('node-checked');
        //         jqCheck.removeClass(this.settings.checkedIcon).addClass(this.settings.uncheckedIcon);

        //         if (!silent) {
        //             this.elements.original.trigger('nodeUnchecked', nodeId);
        //         }
        //     }
        // }
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

    var pendingRequests = {},
        ajax;
    // Use a prefilter if available (1.5+)
    if ($.ajaxPrefilter) {
        $.ajaxPrefilter(function(settings, _, xhr) {
            var port = settings.port;
            if (settings.mode === "abort") {
                if (pendingRequests[port]) {
                    pendingRequests[port].abort();
                }
                pendingRequests[port] = xhr;
            }
        });
    } else {
        // Proxy ajax
        ajax = $.ajax;
        $.ajax = function(settings) {
            var mode = ("mode" in settings ? settings : $.ajaxSettings).mode,
                port = ("port" in settings ? settings : $.ajaxSettings).port;
            if (mode === "abort") {
                if (pendingRequests[port]) {
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
        // ignore: ':hidden',  // 忽略掉的 form 元素. issue-1: 在modal里拿不到全部元素, issue-2: 在控件traslateAttributes以后element被设置成:hidden

        // errorContainer: $([]),
        // errorLabelContainer: $([]),
        errorContainer: '',
        // errorLabelContainer: '<ul></ul>',
        // errorLabelWrapper: '<li></li>',
        errorPlacement: undefined, // 是一个函数

        errorElement: 'label',
        errorClass: 'error',
        validClass: 'valid',
        success: '',
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
        remote: function(value, element, param) {
            if (this.optional(element)) {
                return "dependency-mismatch";
            }

            var previous = this.previousValue(element),
                context, data;

            if (!this.settings.messages[element.name]) {
                this.settings.messages[element.name] = {};
            }
            previous.originalMessage = this.settings.messages[element.name].remote;
            this.settings.messages[element.name].remote = previous.message;

            param = typeof param === "string" && { url: param } || param;

            if (previous.old === value) {
                return previous.valid;
            }

            previous.old = value;
            context = this;
            this.startRequest(element);
            data = {};
            data[element.name] = value;
            $.ajax($.extend(true, {
                mode: "abort",
                port: "validate" + element.name,
                dataType: "json",
                data: data,
                context: context.element,
                success: function(response) {
                    var valid = response === true || response === "true",
                        errors, message, submitted;

                    context.settings.messages[element.name].remote = previous.originalMessage;
                    if (valid) {
                        submitted = context.formSubmitted;
                        context.reset();
                        // context.toHide = this.elements.errorElement(element);
                        context.formSubmitted = submitted;
                        context.successList.push(element);
                        // delete context.invalid[element.name];
                        context.showErrors();
                    } 
                    else {
                        errors = {};
                        message = response || context.defaultMessage(element, "remote");
                        errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
                        // context.invalid[element.name] = true;

                        // add items to error list and map
                        // $.extend(this.errorMap, errors);
                        context.errorList = [];
                        for (var name in errors) {
                            var error= {
                                message: errors[name],
                                element: context.elements.findByName(name)[0]
                            };
                            context.errorList.push(error);
                        }

                        var newSuccessList=[];
                        for(var i=0; i<context.successList.length; i++){
                            var success= context.successList[i];
                            if(success.name in errors){
                                continue;
                            }
                            newSuccessList.push(success);
                        }
                        context.successList= newSuccessList;

                        context.showErrors(errors);
                    }

                    previous.valid = valid;
                    context.stopRequest(element, valid);
                }
            }, param));
            return "pending";
        }
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

            
            // this.submitted = {};
            // this.valueCache = {};
            // this.pendingRequest = 0;
            this.pending = {};
            // this.invalid = {};  // errorMap
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
            this.container= this.element;

            // 错误消息放在外部容器里
            if(this.settings.errorContainer){
                $(this.settings.errorContainer).append('<ul></ul>');
            }
        },

        initElements: function(){
            var context= this;

            this.elements= {
                // original: this.element,
                submitButton: $('input:submit:not(".save"), button:submit:not(".save")', this.container),
                saveButton: $('input.save:submit, button.save:submit', this.container),
                currentElements: function(){
                    // 有可能中途disabled，插入元素等。
                    var rulesCache = {};
                    var elementsAll= context.container.find("input, select, textarea");
                    var elementsField= elementsAll.not(":submit, :reset, :image, :disabled");
                    var elementsFieldNotIgnore= elementsField.not(context.settings.ignore);
                    var currentElements= elementsFieldNotIgnore.filter(function() {
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
                    return context.container.find('[name="' + name + '"]');
                },
                errorContainer: $(this.settings.errorContainer),
                // 所有的error元素
                errorElements: function() {
                    var errorContext;
                    var errorElement;
                    if(context.settings.errorContainer){
                        errorContext= $(context.settings.errorContainer).find('ul');
                        errorElement= 'li';
                        // var errorContainer= $(context.settings.errorContainer).find('ul');

                        // errorContext= $([]);
                        // errorContext= errorContext.add(context.element);
                        // errorContext= errorContext.add(errorContainer);
                    }
                    else{
                        errorContext= context.element;
                        errorElement= context.settings.errorElement;
                    }

                    var errorClass = context.settings.errorClass.split(' ').join('.');
                    var errorElements= $(errorElement + "." + errorClass, errorContext);
                    return errorElements;
                },
                // 指定元素的error元素
                errorElement: function(element) {
                    var errorElements= context.elements.errorElements();

                    var identity= context.idOrName(element);
                    var selector = "label[for='" + identity + "'], li[data-for='" + identity + "']";                    
                    var errorElement= errorElements.filter(selector);
                    return errorElement;
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

            var context= this;
            function delegate(event) {
                var eventType = "on" + event.type.replace(/^validate/, "");
                // && !$(this).is(context.settings.ignore)
                if (context[eventType]) {      // jshint ignore:line   
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

            this.element.on("invalid-form.validate", $.proxy(this.settings.invalidHandler, this));

            // element.on("click.validate", ":submit", function(event) {
            this.elements.submitButton.on("click", $.proxy(this.onSubmitButtonClick, this));

            // validate the form on submit
            element.on("submit", $.proxy(this.onSubmit,this));

            // element.on('click', $.proxy(this.onFooClick, this));
        },

        onSubmitButtonClick: function(event) {
            if (this.settings.submitHandler) {
                this.submitButton = event.target;
            }

            // allow suppressing validation by adding a cancel class to the submit button
            if (this.element.hasClass("cancel")) {
                this.cancelSubmit = true;
            }

            // allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
            if (this.element.attr("formnovalidate") !== undefined) {
                this.cancelSubmit = true;
            }
        },

        onSubmit: function(event) {
            var context= this;
            function handle() {
                if (!context.settings.submitHandler) {
                    return true;
                }

                var hidden;
                if (context.submitButton) {
                    // insert a hidden input as a replacement for the missing submit button
                    hidden = $("<input type='hidden'/>")
                        .attr("name", context.submitButton.name)
                        .val($(context.submitButton).val())
                        .appendTo(context.element);
                }
                var result = context.settings.submitHandler(context.element, event);
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
            if (this.cancelSubmit) {
                this.cancelSubmit = false;
                return handle();
            }
            if (this.checkForm()) {
                // if (context.pendingRequest) {
                //     context.formSubmitted = true;
                //     return false;
                // }
                return handle();
            } 

            if (this.settings.focusInvalid) {
                try {
                    var lastActiveElement= $.grep(this.errorList, function(n) {
                        return n.element.name === lastActive.name;
                    });
                    var lastActive = this.lastActive && lastActiveElement.length === 1;
                    $(lastActive || this.errorList.length && this.errorList[0].element || [])
                        .filter(":visible")
                        .focus()
                        // manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
                        .trigger("focusin");
                } catch (e) {
                    // ignore IE throwing errors when focusing hidden elements
                }
            }
            return false;
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
                var errorElements= this.elements.errorElement(element);
                errorElements.hide();
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
            // this.toHide = this.elements.errorElements();//.add(this.containers);

            // var elements= this.currentElements = this.elements.currentElements();   // 所有需要验证的元素
            var elements= this.elements.currentElements();   // 所有需要验证的元素
            for (var i = 0; i<elements.length; i++) {
                this.check(elements[i]);
            }
            // return this.errorList.length === 0;

            // $.extend(this.submitted, this.errorMap);
            // this.invalid = $.extend({}, this.errorMap);
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

            // if (checkElement === undefined) {
            //     delete this.invalid[cleanElement.name];
            // } else {
                this.reset();
                // this.toHide = this.elements.errorElement(checkElement);
                // this.currentElements = $(checkElement);

                result = this.check(checkElement) !== false;
            //     if (result) {
            //         delete this.invalid[checkElement.name];
            //     } else {
            //         this.invalid[checkElement.name] = true;
            //     }
            // }
            // if (!objectLength(this.invalid)) {
            //     // Hide error containers on last error
            //     this.toHide = this.toHide.add(this.containers);
            // }
            this.showErrors(checkElement);
            return result;
        },

        check: function(element) {
            element = this.validationTargetFor($(element)[0]); 

            var rules = this.settings.rules[element.name];
            var rulesCount= objectLength(rules);
            var dependencyMismatch = false;
            var val = this.getValue(element);

            for (var method in rules) {
                var rule = { method: method, parameters: rules[method] };
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

                if (result === "pending") {
                    // this.toHide = this.toHide.not(this.elements.errorElement(element));
                    return;
                }

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

                    // this.errorMap[element.name] = message;
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
            var message;

            // 自定义消息
            // message= this.customMessage(element.name, method);
            var customMessage = this.settings.messages[element.name];
            message= customMessage && (customMessage.constructor === String ? customMessage : customMessage[method]);            
            if(message !== undefined){ return message; }

            // 默认消息
            message= messages[method];
            if(message !== undefined){ return message; }

            // 未定义消息
            message= "<strong>Warning: No message defined for " + element.name + "</strong>";
            return message;
        },

        // http://jqueryvalidation.org/Validator.showErrors/
        // showErrors: function(errors) {
        showErrors: function(element) {
            var toShow= $([]);
            for (var i = 0; this.errorList[i]; i++) {
                var error = this.errorList[i];
                this.highlight(error.element, this.settings.errorClass, this.settings.validClass);

                var errorElement= this.showLabel(error.element, error.message);
                toShow= toShow.add(errorElement);
            }
            if (this.settings.success) {
                for (var i = 0; this.successList[i]; i++) {
                    this.showLabel(this.successList[i]);
                }
            }
            var invalidElements= $(this.errorList).map(function() {return this.element;});

            var elements = this.elements.currentElements().not(invalidElements);
            for (var i = 0; i<elements.length; i++) {
                this.unhighlight(elements[i], this.settings.errorClass, this.settings.validClass);
            }
            var toHide= element ? this.elements.errorElement(element).not(toShow) : this.elements.errorElements().not(toShow);
            toHide.hide();
            toShow.show();
        },

        showLabel: function(element, message) {
            var errorElement = this.elements.errorElement(element);

            if (errorElement.length) {
                // refresh error/success class
                errorElement.removeClass(this.settings.validClass).addClass(this.settings.errorClass);
                // replace message on existing label
                errorElement.html(message);
            } else {
                var identity= this.idOrName(element);

                var tag;
                var forId;
                if(this.settings.errorContainer){
                    tag= 'li';
                    forId= 'data-for="'+identity+'"';
                }
                else{
                    tag= 'label';
                    forId= 'for="'+identity+'"';
                }

                // create error element
                var errorElementTemplate = ''+
                    '<' + tag+
                    '   id="' + identity + '-error' + '"'+
                    forId+
                    '   class="' + this.settings.errorClass + '"'+'>'+
                    (message || '')+
                    '</'+tag+'>';

                errorElement= $(errorElementTemplate);

                if (this.settings.errorContainer) {   // this.errorLabelContainer.length
                    this.elements.errorContainer.find('ul').append(errorElement); // this.settings.errorLabelWrapper
                } else if (this.settings.errorPlacement) {
                    this.settings.errorPlacement(errorElement, $(element));
                } else {
                    errorElement.insertAfter(element);
                }
            }

            if (!message && this.settings.success) {
                if (typeof this.settings.success === "string") {
                    errorElement.addClass(this.settings.success);
                } else {
                    this.settings.success(errorElement, $(element));
                }
            }

            // this.toShow = this.toShow.add(error);
            return errorElement;
        },
        
        // http://jqueryvalidation.org/Validator.resetForm/
        resetForm: function() {
            if ($.fn.resetForm) {
                this.element.resetForm();
            }
            
            this.lastElement = null;
            this.reset();
            var errorElements = this.elements.errorElements();//.add(this.containers);
            errorElements.hide();

            var elements = this.elements.currentElements();
            elements.removeData("previousValue");
            for (var i = 0; elements[i]; i++) {
                this.unhighlight(elements[i], this.settings.errorClass, "");
            }
        },

        reset: function() {
            this.successList = [];      // 成功列表
            this.errorList = [];        // 错误列表
            this.submitted = {};        // 校验过的
            // this.errorMap = {};     // 错误映射
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

        idOrName: function(element) {
            // return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
            return this.checkable(element) ? element.name : element.id;
        },

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
                // html5 number标签
                return element.validity.badInput ? false : jqElement.val();
            }

            var value = jqElement.val();
            if (typeof value === "string") {
                return value.replace(/\r/g, "");
            }
            return value;
        },

        // 字符串长度 或 select option/radio/checkbox 被选中的个数
        getLength: function(value, element) {
            var nodeName= element.nodeName.toLowerCase();
            switch (nodeName) {
                case "select":
                    return $("option:selected", element).length;
                case "input":
                    if (this.checkable(element)) {
                        return this.elements.findByName(element.name).filter(":checked").length;
                    }
            }
            return value.length;
        },

        // 非必填
        optional: function(element) {
            var val = this.getValue(element);
            return !methods.required.call(this, val, element) && "dependency-mismatch";
        },

        // for ajax
        startRequest: function(element) {
            if (!this.pending[element.name]) {
                this.pendingRequest++;
                this.pending[element.name] = true;
            }
        },
        // for ajax
        stopRequest: function(element, valid) {
            this.pendingRequest--;
            // sometimes synchronization fails, make sure pendingRequest is never < 0
            if (this.pendingRequest < 0) {
                this.pendingRequest = 0;
            }
            delete this.pending[element.name];
            if (valid && this.pendingRequest === 0 && this.formSubmitted && this.checkForm()) {
                $(this.element).submit();
                this.formSubmitted = false;
            } else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
                this.element.triggerHandler("invalid-form", [this]);
                this.formSubmitted = false;
            }
        },
        // for ajax
        previousValue: function(element) {
            return $.data(element, "previousValue") || $.data(element, "previousValue", {
                old: null,
                valid: true,
                message: this.defaultMessage(element, "remote")
            });
        },

        // API
        refresh: function(){},
        enable: function(){},
        disable: function(){},
        // cleans up all forms and elements, removes validator-specific events
        destroy: function() {
            this.resetForm();

            $(this.element)
                .off(".validate");
                // .removeData("validator");
        }
    });
});