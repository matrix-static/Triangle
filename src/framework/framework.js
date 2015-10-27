Tx().$package("tx.ui", function(T){
	// 严格模式
	'use strict';

	this.BaseControl = new T.Class({
		defaults:{},
		attributeMap:{},
		initSettings:function(options){
			this.settings = $.extend({}, this.defaults, this.element_data, this.parseAttributes(), options);
		},
		parseAttributes : function () {
			var context=this;

			var data = {};
			$.each(this.attributeMap, function(key, value) {
				var attrName = 's-' + value + '';
				if (context.element.is('[data-' + attrName + ']')) {
					data[key] = context.element.data(attrName);
				}
			});
			return data;
		}
	});
});