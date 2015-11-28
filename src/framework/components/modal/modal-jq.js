/* modal javascript jQuery */

(function($) {
    // 严格模式
    'use strict';

    // 控件类名
    var pluginName = 'modal';
    var PluginClass=T.UI.Components.Modal;

    var pluginRef = 't-plugin-ref';
    // 胶水代码
    $.fn[pluginName] = function(options) {
        if(typeof options === 'string'){
            // 2. 调用API
            var plugin = this.data(pluginRef);

            if(!plugin || !plugin[options]){
                throw '方法 ' + options + ' 不存在';
            }

            var result = plugin[options].apply(plugin, Array.prototype.slice.call(arguments, 1));

            if(options === 'destroy'){
                jqElement.removeData(pluginRef);
            }

            return result;
        }

        this.each(function () {
            var jqElement=$(this);
            var plugin = jqElement.data(pluginRef);
            if(plugin === undefined){
                // 1. 创建新对象
                plugin=new PluginClass(this, $.extend(true, {}, options));
                jqElement.data(pluginRef, plugin);
            }
            else{
                // 3. 更新选项
                plugin.updateOptions || plugin.updateOptions(options);
            }
        });

        return this;
    };
})(jQuery);