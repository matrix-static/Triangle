
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
