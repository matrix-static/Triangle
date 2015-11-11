Jx().package("T.UI", function(J){
	// 严格模式
	'use strict';

	this.BaseControl = new J.Class({

        /*
		defaults: {},
		attributeMap: {},
        
        element: {},
        elements: {},
        init: function{},
        */

		initSettings: function(options){
            var attributes = this.parseAttributes();
			this.settings = $.extend({}, this.defaults, attributes, options);
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
        reflash: function(){
            ;
        },
        actionOne: function(){
            this.element.trigger('controlname.on.eventname');
        }
        */

	});
});