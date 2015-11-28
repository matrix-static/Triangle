/* AngularJS 胶水代码 */

T.UI.ngControls = angular.module('T.UI.ngControls', []);
T.UI.ngComponents = angular.module('T.UI.ngComponents', []);
T.UI.ngLayouts = angular.module('T.UI.ngLayouts', []);
T.UI.ngModules = angular.module('T.UI.ngModules', []);



// (function($, ng) {
//   'use strict';

//   var $val = $.fn.val; // save original jQuery function

//   // override jQuery function
//   $.fn.val = function (value) {
//     // if getter, just return original
//     if (!arguments.length) {
//       return $val.call(this);
//     }

//     // get result of original function
//     var result = $val.call(this, value);

//     // trigger angular input (this[0] is the DOM object)
//     ng.element(this[0]).triggerHandler('input');

//     // return the original result
//     return result; 
//   }
// })(window.jQuery, window.angular);