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
            class: "icon-refresh",    // loader CSS class
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
            tpl = tpl.replace( '%class%', self.options['class'] );
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