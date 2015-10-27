;(function(tn){
	var version = '1.0';

	var T = tn.T;	// topNamespace

	if(typeof T !== "undefined")
	{
		throw new Error('"Jx" name is defined in other javascript code !!!');
	}

	T = function(ver){
        var t = this;

        // 对象是否是类的实例
        var instanceOf = function(o, type) {
            return (o && o.hasOwnProperty && (o instanceof type));
        };

        // 第一次执行则初始化对象
        if ( !( instanceOf(t, T) ) ) {
            t = new T(ver);
        } else {
            t._init();
        }

        return t;
    };

    T.prototype = {
    	version: version,
    	_init: function(){
            this.constructor = T;
        }
    };

    // 让顶级命名空间的 Jx 对象引用新的 Jx 对象
    tn.T = T;
})(window);

;(function(tn){

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
    var isObject = function(o) {
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
    var isArray = function(o) {
        return o && (o.constructor === Array || Object.prototype.toString.call(o) === "[object Array]");
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
    var isFunction = function(o) {
        return o && (o.constructor === Function);
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
     * Jx().$package(function(J){
     *     // 用 objB 和objC 扩展 objA 对象；
     *     J.extend(objA, objB, objC);
     * };
     * 
     */
    var extend = function(beExtendObj, extendObj1, extendObj2){
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
     * Jx().$package(function(J){
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
	var Class = function(){
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
            
            T.extend(subClass.prototype, option);
            
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

    /* jQuery 胶水代码 */
    T.extend=extend;
    T.Clazz=Class;
})(window);


// namespace
;(function(tn){
	T.UI = T.UI || {};
	T.UI.Controls = T.UI.Controls || {};
})(window);