/* template javascript jQuery */

(function($) {
    // 严格模式
    'use strict';

    // 控件类名
    var pluginName = 'template';
    var PluginClass=T.UI.Components.Template;

    var pluginRef = 't-plugin-ref';
    // 胶水代码
    $.fn[pluginName] = function(options) {
        var result;
        this.each(function () {
            if(options === 'destroy'){
                jqElement.data(pluginRef).destroy();
                jqElement.data(pluginRef).remove();
                return;
            }

            var jqElement=$(this);
            var plugin = jqElement.data(pluginRef);
            if(plugin === undefined)
            {
                plugin=new PluginClass(this, $.extend(true, {}, options));
                jqElement.data(pluginRef, plugin);

                return;
            }

            if(typeof options === 'string'){
                if(!plugin[options]){
                    throw '方法 ' + option + ' 不存在';
                }

                var args = arguments;
                result = plugin[option].apply(data, Array.prototype.slice.call(args, 1));
            }
            // else{
            //     result= plugin.updateOptions(options);
            // }
        });

        return this;
    };
})(jQuery);