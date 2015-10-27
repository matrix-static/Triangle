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
 * Package: Tx
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
        mark = "jx_tx_mark_1.0.0",
        topNamespace = tn,
        Tx = topNamespace.Tx,   // 将顶级命名空间中可能存在的 Tx 对象引入        
        PACKAGES = {};

    // 判断Tx名字空间是否已经存在
    if(!(typeof Tx === "undefined" || (Tx.mark && Tx.mark === mark))){
        throw new Error("\"Tx\" name is defined in other javascript code !!!");
    }

    // 如果已经有Tx对象则记录已有的信息
    if(Tx){
        PACKAGES = Tx.PACKAGES;
    }
    
    /**
     * 【Tx 对象原型】
     * Tx
     * @class 
     * @constructor Tx
     * @global
     * 
     * @since version 1.0
     * @description Tx 对象原型的描述
     * 
     * @param {Number} ver 要使用的 Tx 的版本号，当前是1.0
     * @param {Boolean} isCreateNew 是否创建一个新的 Tx 实例，默认为 false 不创建新的 Tx 实例，只返回同一版本在全局中的唯一一个实例，注意：除非特殊需要，否则一般不要创建新的 Tx 实例
     * @return {Object} 返回对应版本的 Tx 对象
     * 
     * @example
     * //代码组织方式一(传统)：
     * var J = new Tx();
     * J.out(J.version);    //输出当前Tx的版本
     * 
     * @example
     * //代码组织方式二(推荐)：
     * Tx().$package(function(J){
     *     J.out(J.version);    //输出当前Tx的版本
     * };
     * //注：此种方式可以利用匿名函数来防止变量污染全局命名空间，尤其适合大型WebApp的构建！
     * 
     * @example
     * //范例：
     * Tx().$package("tencent.alloy", function(J){
     *     var $ = J.dom.id,
     *     $D = J.dom,
     *     $E = J.event,
     *     $H = J.http;
     *     this.name = "腾讯Q+ Web";
     *     J.out(this.name);
     * };
     * 
     */
    Tx = function(ver, isCreateNew){
        var J = this;

        var instanceOf = function(o, type) {
            return (o && o.hasOwnProperty && (o instanceof type));
        };

        if(isCreateNew){
            // 如果是第一次执行则初始化对象
            if ( !( instanceOf(J, Tx) ) ) {
                J = new Tx(ver);
            } else {
                J._init();
            }
        }else{
            J = Tx.Root;
        }
        return J;
    };
    
    Tx.prototype = {
        version: version,

        _init: function(){
            this.constructor = Tx;
        },
    
        /**
         * 创建一个命名空间，创建的命名空间将会在 window 根命名空间下。
         * Create a new namespace, the top namespace is window.
         * 
         * @since version 1.0
         * @description 可以一次性连续创建命名空间
         * 
         * @param {String} name 命名空间名称
         * @returns {Object} 返回对最末命名空间的引用
         * 
         * @example
         * //在全局环境中创建tencent.alloy名字空间, $namespace完成的操作相当于在全局环境中执行如下语句：
         * //var tencent = {};
         * //tencent.alloy = {};
         * 
         * J.$namespace("tencent.alloy");
         * 
         * //注：Tx的$namespace方法与其他JS框架的namespace的方法不同，其他框架如YUI是在其YAHOO对像下创
         * //建命名空间，而Tx的$namespace测试直接在顶级命名空间window的下边直接创建命名空间。
         * 
         */
        $namespace: function(name) {
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

        /**
         * 创建一个 Javascript 代码包
         * 
         * @param {String} name 要创建的包的名字空间
         * @param {Function} func 要创建的包的包体
         * @returns {Mixed} 返回任何自定义的变量
         * 
         * @example
         * //创建一个匿名package包：
         * Tx().$package(function(J){
         *     //这时上下文对象this指向全局window对象
         *     alert("Hello world! This is " + this);
         * };
         * 
         * @example
         * //创建一个名字为tencent.kinvix的package包：
         * Tx().$package("tencent.kinvix", function(J){
         *     //这时上下文对象this指向window对象下的tencent.kinvix对象
         *     alert("Hello world! This is " + this);
         * };
         * 
         * 
         * 
         */
        $package: function(){
            var name = arguments[0],
                func = arguments[arguments.length-1],
                ns = topNamespace,
                returnValue;
                if(typeof func === "function"){
                    // handle name as ""
                    if(typeof name === "string"){
                        ns = this.$namespace(name);
                        if( Tx.PACKAGES[name] ){
                            //throw new Error("Package name [" + name + "] is exist!");
                        }else{
                            Tx.PACKAGES[name] = {
                                isLoaded: true,
                                returnValue: returnValue    // undefined as default
                            };
                        }
                        ns.packageName = name;
                    }else if(typeof name === "object"){
                        ns = name;
                    }
                    
                    returnValue = func.call(ns, this);
                    typeof name === "string" && (Tx.PACKAGES[name].returnValue = returnValue);
                }else{
                    throw new Error("Function required");
                }

        },
        
        /**
         * 检查一个 Javascript 模块包是否已经存在
         * 
         * @param {String} name 包名
         * @return {Object} 如果已加载则返回包对象，否则返回 undefined
         * 
         * @example
         * //创建一个匿名package包：
         * Tx().$package(function(J){
         *     // 输出undefined
         *     J.out(J.checkPackage("tencent.kinvix"));
         * };
         * 
         * 
         * @example
         * //创建一个名字为tencent.kinvix的package包：
         * Tx().$package("tencent.kinvix", function(J){
         *     //这时上下文对象this指向window下的tencent.kinvix对象
         *     alert("Hello world! This is " + this);
         * };
         * 
         * Tx().$package(function(J){
         *     // J.checkPackage("tencent.kinvix")结果返回的将是tencent.kinvix的引用
         *     var kinvix = J.checkPackage("tencent.kinvix");
         *     if(kinvix){
         *         J.out("tencent.kinvix包已加载...");
         *     }
         * };
         * 
         */
        checkPackage: function(name){
            return Tx.PACKAGES[name];
        },

        startTime: +new Date(),

        /**
         * Tx 对象转化为字符串的方法
         * 
         * @ignore
         * @return {String} 返回 Tx 对象串行化后的信息
         */
        toString: function(){
            return "Tx version " + this.version + " !";
        }
    };
    
    /**
     * 记录加载的包的对象
     * 
     * @ignore
     * @type Object
     */
    Tx.PACKAGES = PACKAGES;

    /**
     * 创建一个当前版本 Tx 的实例
     * 
     * @ignore
     * @type Object
     */
    Tx.Root = new Tx(version, true);

    /**
     * Tx 对象验证标记
     * 
     * @ignore
     * @description 用于验证已存在的Tx对象是否是本框架某子版本的Tx对象
     * @type String
     */
    Tx.mark = mark;
    
    // 让顶级命名空间的 Tx 对象引用新的 Tx 对象
    topNamespace.Tx = Tx;
})(this);