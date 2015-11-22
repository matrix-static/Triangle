/* spinner javascript jQuery */

(function($) {
    // 严格模式
    'use strict';

    // 控件类名
    var pluginName = 'spinner';
    var PluginClass=T.UI.Controls.Spinner;

    var pluginRef = 't-plugin-ref';
    // 胶水代码
    $.fn[pluginName] = function(options) {

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
            }
        });

        return this;
    };
})(jQuery);
