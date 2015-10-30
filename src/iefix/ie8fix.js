/* =============================================================================
    isArray etc.
    http://stackoverflow.com/questions/26978533/angularjs-1-3-page-wont-load-in-ie8
   ============================================================================= */
/*
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement) {
        if (this.length === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (isNaN(n)) {
                n = 0;
            } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= this.length) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(this.length - Math.abs(n), 0);
        while (k < this.length) {
            if (k in this && this[k] === searchElement) {
                return k;
            }
            ++k;
        }
        return -1;
    };
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun) {    
        if (this === undefined || this === null) {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];
                if (fun.call(thisArg, val, i, t)) {
                    res.push(val);
                }
            }
        }
        return res;
    };
}

if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

if (!Array.prototype.every) {
    Array.prototype.every = function(callbackfn, thisArg) {
        'use strict';
        var T, k;
        if (this == null) {
            throw new TypeError('this is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callbackfn !== 'function') {
            throw new TypeError();
        }
        if (arguments.length > 1) {
            T = thisArg;
        }
        k = 0;
        while (k < len) {

            var kValue;

            if (k in O) {
                kValue = O[k];
                var testResult = callbackfn.call(T, kValue, k, O);
                if (!testResult) {
                    return false;
                }
            }
            k++;
        }
        return true;
    };
}



if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fun) {
        if (this === void 0 || this === null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function")
            throw new TypeError();

        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; ++i) {
            if (i in t)
                fun.call(thisArg, t[i], i, t);
        }
    };
}

if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/gm, '');
    };
}

(function() {
    //$http uses onload instead of onreadystatechange. Need shimming as IE8 doesn't have onload.
    if (new XMLHttpRequest().onload === undefined) {
        var orig = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            var self = this;
            if (!this.onreadystatechange && this.onload) {
                this.onreadystatechange = function() {
                    if (self.readyState === 4) {
                        self.onload();
                    }
                };
            }
            orig.apply(self, arguments);
        };
    }
})();

if (!Date.now) {
    Date.now = function() {
        return new Date().getTime();
    };
}

if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {
            },
            fBound = function() {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

if (!Object.keys) {
    Object.keys = function(object) {
        var keys = [];
        for (var o in object) {
            if (object.hasOwnProperty(o)) {
                keys.push(o);
            }
        }
        return keys;
    };
}*/

if (!Object.create) {
    Object.create = (function() {
        var Object = function() {};
        return function (prototype) {
            if (arguments.length > 1) {
                throw new Error('Second argument not supported');
            }
            if (typeof prototype != 'object') {
                throw new TypeError('Argument must be an object');
            }
            Object.prototype = prototype;
            var result = new Object();
            Object.prototype = null;
            return result;
        };
    })();
}

if (!Object.getPrototypeOf) {
    Object.getPrototypeOf = function(object) {
        return object.__proto__ || object.constructor.prototype;
    };
}
/* =============================================================================
    Array.map
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
   ============================================================================= */
// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
/*if (!Array.prototype.map) {

  Array.prototype.map = function(callback, thisArg) {

    var T, A, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| 
    //    value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal 
    //    method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let A be a new array created as if by the expression new Array(len) 
    //    where Array is the standard built-in constructor with that name and 
    //    len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while (k < len) {

      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal 
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal 
        //    method of O with argument Pk.
        kValue = O[k];

        // ii. Let mappedValue be the result of calling the Call internal 
        //     method of callback with T as the this value and argument 
        //     list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor
        // { Value: mappedValue,
        //   Writable: true,
        //   Enumerable: true,
        //   Configurable: true },
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, k, {
        //   value: mappedValue,
        //   writable: true,
        //   enumerable: true,
        //   configurable: true
        // });

        // For best browser support, use the following:
        A[k] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };
}*/






/* =============================================================================
    requestAnimationFrame
    http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
   ============================================================================= */
/*(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());*/





/* =============================================================================
    querySelector
    http://www.cnblogs.com/jacktang/p/4253249.html
    https://github.com/termi/CSS_selector_engine
    https://github.com/lazd/scopedQuerySelectorShim
   ============================================================================= */
/*if (!document.querySelectorAll) {
    document.querySelectorAll = function (selectors) {
        var style = document.createElement('style'), elements = [], element;
        document.documentElement.firstChild.appendChild(style);
        document._qsa = [];

        style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
        window.scrollBy(0, 0);
        style.parentNode.removeChild(style);

        while (document._qsa.length) {
            element = document._qsa.shift();
            element.style.removeAttribute('x-qsa');
            elements.push(element);
        }
        document._qsa = null;
        return elements;
    };
}

if (!document.querySelector) {
    document.querySelector = function (selectors) {
        var elements = document.querySelectorAll(selectors);
        return (elements.length) ? elements[0] : null;
    };
}

// 用于在IE6和IE7浏览器中，支持Element.querySelectorAll方法
var qsaWorker = (function () {
    var idAllocator = 10000;

    function qsaWorkerShim(element, selector) {
        var needsID = element.id === "";
        if (needsID) {
            ++idAllocator;
            element.id = "__qsa" + idAllocator;
        }
        try {
            return document.querySelectorAll("#" + element.id + " " + selector);
        }
        finally {
            if (needsID) {
                element.id = "";
            }
        }
    }

    function qsaWorkerWrap(element, selector) {
        return element.querySelectorAll(selector);
    }

    // Return the one this browser wants to use
    return document.createElement('div').querySelectorAll ? qsaWorkerWrap : qsaWorkerShim;
})();*/


