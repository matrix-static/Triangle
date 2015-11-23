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
