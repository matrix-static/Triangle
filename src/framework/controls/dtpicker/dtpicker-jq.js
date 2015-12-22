/* dtpicker javascript jQuery */

(function($) {
    // 严格模式
    'use strict';

    // 控件类名
    var pluginName = 'dtpicker';
    var PluginClass=T.UI.Controls.DTPicker;

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





// (function($) {

//     // 'use strict';
//     var dateTimePicker = function (element, options) {

//         /********************************************************************************
//          *
//          * Public API functions
//          * =====================
//          *
//          * Important: Do not expose direct references to private objects or the options
//          * object to the outer world. Always return a clone when returning values or make
//          * a clone when setting a private variable.
//          *
//          ********************************************************************************/


//         picker.toggle = toggle;

//         picker.show = show;

//         picker.hide = hide;

//         picker.ignoreReadonly = function (ignoreReadonly) {
//             if (arguments.length === 0) {
//                 return options.ignoreReadonly;
//             }
//             if (typeof ignoreReadonly !== 'boolean') {
//                 throw new TypeError('ignoreReadonly () expects a boolean parameter');
//             }
//             options.ignoreReadonly = ignoreReadonly;
//             return picker;
//         };

//         picker.options = function (newOptions) {
//             if (arguments.length === 0) {
//                 return $.extend(true, {}, options);
//             }

//             if (!(newOptions instanceof Object)) {
//                 throw new TypeError('options() options parameter should be an object');
//             }
//             $.extend(true, options, newOptions);
//             $.each(options, function (key, value) {
//                 if (picker[key] !== undefined) {
//                     picker[key](value);
//                 } else {
//                     throw new TypeError('option ' + key + ' is not recognized!');
//                 }
//             });
//             return picker;
//         };

//         picker.date = function (newDate) {
//             ///<signature helpKeyword="$.fn.datetimepicker.date">
//             ///<summary>Returns the component's model current date, a moment object or null if not set.</summary>
//             ///<returns type="Moment">date.clone()</returns>
//             ///</signature>
//             ///<signature>
//             ///<summary>Sets the components model current moment to it. Passing a null value unsets the components model current moment. Parsing of the newDate parameter is made using moment library with the options.format and options.useStrict components configuration.</summary>
//             ///<param name="newDate" locid="$.fn.datetimepicker.date_p:newDate">Takes string, Date, moment, null parameter.</param>
//             ///</signature>
//             if (arguments.length === 0) {
//                 if (unset) {
//                     return null;
//                 }
//                 return date.clone();
//             }

//             if (newDate !== null && typeof newDate !== 'string' && !moment.isMoment(newDate) && !(newDate instanceof Date)) {
//                 throw new TypeError('date() parameter must be one of [null, string, moment or Date]');
//             }

//             setValue(newDate === null ? null : parseInputDate(newDate));
//             return picker;
//         };

//         picker.format = function (newFormat) {
//             ///<summary>test su</summary>
//             ///<param name="newFormat">info about para</param>
//             ///<returns type="string|boolean">returns foo</returns>
//             if (arguments.length === 0) {
//                 return options.format;
//             }

//             if ((typeof newFormat !== 'string') && ((typeof newFormat !== 'boolean') || (newFormat !== false))) {
//                 throw new TypeError('format() expects a sting or boolean:false parameter ' + newFormat);
//             }

//             options.format = newFormat;
//             if (actualFormat) {
//                 initFormatting(); // reinit formatting
//             }
//             return picker;
//         };

//         picker.timeZone = function (newZone) {
//             if (arguments.length === 0) {
//                 return options.timeZone;
//             }

//             options.timeZone = newZone;

//             return picker;
//         };

//         picker.dayViewHeaderFormat = function (newFormat) {
//             if (arguments.length === 0) {
//                 return options.dayViewHeaderFormat;
//             }

//             if (typeof newFormat !== 'string') {
//                 throw new TypeError('dayViewHeaderFormat() expects a string parameter');
//             }

//             options.dayViewHeaderFormat = newFormat;
//             return picker;
//         };

//         picker.extraFormats = function (formats) {
//             if (arguments.length === 0) {
//                 return options.extraFormats;
//             }

//             if (formats !== false && !(formats instanceof Array)) {
//                 throw new TypeError('extraFormats() expects an array or false parameter');
//             }

//             options.extraFormats = formats;
//             if (parseFormats) {
//                 initFormatting(); // reinit formatting
//             }
//             return picker;
//         };

//         picker.disabledDates = function (dates) {
//             ///<signature helpKeyword="$.fn.datetimepicker.disabledDates">
//             ///<summary>Returns an array with the currently set disabled dates on the component.</summary>
//             ///<returns type="array">options.disabledDates</returns>
//             ///</signature>
//             ///<signature>
//             ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of
//             ///options.enabledDates if such exist.</summary>
//             ///<param name="dates" locid="$.fn.datetimepicker.disabledDates_p:dates">Takes an [ string or Date or moment ] of values and allows the user to select only from those days.</param>
//             ///</signature>
//             if (arguments.length === 0) {
//                 return (options.disabledDates ? $.extend({}, options.disabledDates) : options.disabledDates);
//             }

//             if (!dates) {
//                 options.disabledDates = false;
//                 update();
//                 return picker;
//             }
//             if (!(dates instanceof Array)) {
//                 throw new TypeError('disabledDates() expects an array parameter');
//             }
//             options.disabledDates = indexGivenDates(dates);
//             options.enabledDates = false;
//             update();
//             return picker;
//         };

//         picker.enabledDates = function (dates) {
//             ///<signature helpKeyword="$.fn.datetimepicker.enabledDates">
//             ///<summary>Returns an array with the currently set enabled dates on the component.</summary>
//             ///<returns type="array">options.enabledDates</returns>
//             ///</signature>
//             ///<signature>
//             ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of options.disabledDates if such exist.</summary>
//             ///<param name="dates" locid="$.fn.datetimepicker.enabledDates_p:dates">Takes an [ string or Date or moment ] of values and allows the user to select only from those days.</param>
//             ///</signature>
//             if (arguments.length === 0) {
//                 return (options.enabledDates ? $.extend({}, options.enabledDates) : options.enabledDates);
//             }

//             if (!dates) {
//                 options.enabledDates = false;
//                 update();
//                 return picker;
//             }
//             if (!(dates instanceof Array)) {
//                 throw new TypeError('enabledDates() expects an array parameter');
//             }
//             options.enabledDates = indexGivenDates(dates);
//             options.disabledDates = false;
//             update();
//             return picker;
//         };

//         picker.daysOfWeekDisabled = function (daysOfWeekDisabled) {
//             if (arguments.length === 0) {
//                 return options.daysOfWeekDisabled.splice(0);
//             }

//             if ((typeof daysOfWeekDisabled === 'boolean') && !daysOfWeekDisabled) {
//                 options.daysOfWeekDisabled = false;
//                 update();
//                 return picker;
//             }

//             if (!(daysOfWeekDisabled instanceof Array)) {
//                 throw new TypeError('daysOfWeekDisabled() expects an array parameter');
//             }
//             options.daysOfWeekDisabled = daysOfWeekDisabled.reduce(function (previousValue, currentValue) {
//                 currentValue = parseInt(currentValue, 10);
//                 if (currentValue > 6 || currentValue < 0 || isNaN(currentValue)) {
//                     return previousValue;
//                 }
//                 if (previousValue.indexOf(currentValue) === -1) {
//                     previousValue.push(currentValue);
//                 }
//                 return previousValue;
//             }, []).sort();
//             if (options.useCurrent && !options.keepInvalid) {
//                 var tries = 0;
//                 while (!isValid(date, 'd')) {
//                     date.add(1, 'd');
//                     if (tries === 7) {
//                         throw 'Tried 7 times to find a valid date';
//                     }
//                     tries++;
//                 }
//                 setValue(date);
//             }
//             update();
//             return picker;
//         };

//         picker.maxDate = function (maxDate) {
//             if (arguments.length === 0) {
//                 return options.maxDate ? options.maxDate.clone() : options.maxDate;
//             }

//             if ((typeof maxDate === 'boolean') && maxDate === false) {
//                 options.maxDate = false;
//                 update();
//                 return picker;
//             }

//             if (typeof maxDate === 'string') {
//                 if (maxDate === 'now' || maxDate === 'moment') {
//                     maxDate = getMoment();
//                 }
//             }

//             var parsedDate = parseInputDate(maxDate);

//             if (!parsedDate.isValid()) {
//                 throw new TypeError('maxDate() Could not parse date parameter: ' + maxDate);
//             }
//             if (options.minDate && parsedDate.isBefore(options.minDate)) {
//                 throw new TypeError('maxDate() date parameter is before options.minDate: ' + parsedDate.format(actualFormat));
//             }
//             options.maxDate = parsedDate;
//             if (options.useCurrent && !options.keepInvalid && date.isAfter(maxDate)) {
//                 setValue(options.maxDate);
//             }
//             if (viewDate.isAfter(parsedDate)) {
//                 viewDate = parsedDate.clone().subtract(options.stepping, 'm');
//             }
//             update();
//             return picker;
//         };

//         picker.minDate = function (minDate) {
//             if (arguments.length === 0) {
//                 return options.minDate ? options.minDate.clone() : options.minDate;
//             }

//             if ((typeof minDate === 'boolean') && minDate === false) {
//                 options.minDate = false;
//                 update();
//                 return picker;
//             }

//             if (typeof minDate === 'string') {
//                 if (minDate === 'now' || minDate === 'moment') {
//                     minDate = getMoment();
//                 }
//             }

//             var parsedDate = parseInputDate(minDate);

//             if (!parsedDate.isValid()) {
//                 throw new TypeError('minDate() Could not parse date parameter: ' + minDate);
//             }
//             if (options.maxDate && parsedDate.isAfter(options.maxDate)) {
//                 throw new TypeError('minDate() date parameter is after options.maxDate: ' + parsedDate.format(actualFormat));
//             }
//             options.minDate = parsedDate;
//             if (options.useCurrent && !options.keepInvalid && date.isBefore(minDate)) {
//                 setValue(options.minDate);
//             }
//             if (viewDate.isBefore(parsedDate)) {
//                 viewDate = parsedDate.clone().add(options.stepping, 'm');
//             }
//             update();
//             return picker;
//         };

//         picker.defaultDate = function (defaultDate) {
//             ///<signature helpKeyword="$.fn.datetimepicker.defaultDate">
//             ///<summary>Returns a moment with the options.defaultDate option configuration or false if not set</summary>
//             ///<returns type="Moment">date.clone()</returns>
//             ///</signature>
//             ///<signature>
//             ///<summary>Will set the picker's inital date. If a boolean:false value is passed the options.defaultDate parameter is cleared.</summary>
//             ///<param name="defaultDate" locid="$.fn.datetimepicker.defaultDate_p:defaultDate">Takes a string, Date, moment, boolean:false</param>
//             ///</signature>
//             if (arguments.length === 0) {
//                 return options.defaultDate ? options.defaultDate.clone() : options.defaultDate;
//             }
//             if (!defaultDate) {
//                 options.defaultDate = false;
//                 return picker;
//             }

//             if (typeof defaultDate === 'string') {
//                 if (defaultDate === 'now' || defaultDate === 'moment') {
//                     defaultDate = getMoment();
//                 }
//             }

//             var parsedDate = parseInputDate(defaultDate);
//             if (!parsedDate.isValid()) {
//                 throw new TypeError('defaultDate() Could not parse date parameter: ' + defaultDate);
//             }
//             if (!isValid(parsedDate)) {
//                 throw new TypeError('defaultDate() date passed is invalid according to component setup validations');
//             }

//             options.defaultDate = parsedDate;

//             if ((options.defaultDate && options.inline) || input.val().trim() === '') {
//                 setValue(options.defaultDate);
//             }
//             return picker;
//         };

//         picker.locale = function (locale) {
//             if (arguments.length === 0) {
//                 return options.locale;
//             }

//             if (!moment.localeData(locale)) {
//                 throw new TypeError('locale() locale ' + locale + ' is not loaded from moment locales!');
//             }

//             options.locale = locale;
//             date.locale(options.locale);
//             viewDate.locale(options.locale);

//             if (actualFormat) {
//                 initFormatting(); // reinit formatting
//             }
//             if (widget) {
//                 hide();
//                 show();
//             }
//             return picker;
//         };

//         picker.stepping = function (stepping) {
//             if (arguments.length === 0) {
//                 return options.stepping;
//             }

//             stepping = parseInt(stepping, 10);
//             if (isNaN(stepping) || stepping < 1) {
//                 stepping = 1;
//             }
//             options.stepping = stepping;
//             return picker;
//         };

//         picker.useCurrent = function (useCurrent) {
//             var useCurrentOptions = ['year', 'month', 'day', 'hour', 'minute'];
//             if (arguments.length === 0) {
//                 return options.useCurrent;
//             }

//             if ((typeof useCurrent !== 'boolean') && (typeof useCurrent !== 'string')) {
//                 throw new TypeError('useCurrent() expects a boolean or string parameter');
//             }
//             if (typeof useCurrent === 'string' && useCurrentOptions.indexOf(useCurrent.toLowerCase()) === -1) {
//                 throw new TypeError('useCurrent() expects a string parameter of ' + useCurrentOptions.join(', '));
//             }
//             options.useCurrent = useCurrent;
//             return picker;
//         };

//         picker.collapse = function (collapse) {
//             if (arguments.length === 0) {
//                 return options.collapse;
//             }

//             if (typeof collapse !== 'boolean') {
//                 throw new TypeError('collapse() expects a boolean parameter');
//             }
//             if (options.collapse === collapse) {
//                 return picker;
//             }
//             options.collapse = collapse;
//             if (widget) {
//                 hide();
//                 show();
//             }
//             return picker;
//         };

//         picker.icons = function (icons) {
//             if (arguments.length === 0) {
//                 return $.extend({}, options.icons);
//             }

//             if (!(icons instanceof Object)) {
//                 throw new TypeError('icons() expects parameter to be an Object');
//             }
//             $.extend(options.icons, icons);
//             if (widget) {
//                 hide();
//                 show();
//             }
//             return picker;
//         };

//         picker.tooltips = function (tooltips) {
//             if (arguments.length === 0) {
//                 return $.extend({}, options.tooltips);
//             }

//             if (!(tooltips instanceof Object)) {
//                 throw new TypeError('tooltips() expects parameter to be an Object');
//             }
//             $.extend(options.tooltips, tooltips);
//             if (widget) {
//                 hide();
//                 show();
//             }
//             return picker;
//         };

//         picker.useStrict = function (useStrict) {
//             if (arguments.length === 0) {
//                 return options.useStrict;
//             }

//             if (typeof useStrict !== 'boolean') {
//                 throw new TypeError('useStrict() expects a boolean parameter');
//             }
//             options.useStrict = useStrict;
//             return picker;
//         };

//         picker.sideBySide = function (sideBySide) {
//             if (arguments.length === 0) {
//                 return options.sideBySide;
//             }

//             if (typeof sideBySide !== 'boolean') {
//                 throw new TypeError('sideBySide() expects a boolean parameter');
//             }
//             options.sideBySide = sideBySide;
//             if (widget) {
//                 hide();
//                 show();
//             }
//             return picker;
//         };

//         picker.viewMode = function (viewMode) {
//             if (arguments.length === 0) {
//                 return options.viewMode;
//             }

//             if (typeof viewMode !== 'string') {
//                 throw new TypeError('viewMode() expects a string parameter');
//             }

//             if (viewModes.indexOf(viewMode) === -1) {
//                 throw new TypeError('viewMode() parameter must be one of (' + viewModes.join(', ') + ') value');
//             }

//             options.viewMode = viewMode;
//             currentViewMode = Math.max(viewModes.indexOf(viewMode), minViewModeNumber);

//             showMode();
//             return picker;
//         };

//         picker.toolbarPlacement = function (toolbarPlacement) {
//             if (arguments.length === 0) {
//                 return options.toolbarPlacement;
//             }

//             if (typeof toolbarPlacement !== 'string') {
//                 throw new TypeError('toolbarPlacement() expects a string parameter');
//             }
//             if (toolbarPlacements.indexOf(toolbarPlacement) === -1) {
//                 throw new TypeError('toolbarPlacement() parameter must be one of (' + toolbarPlacements.join(', ') + ') value');
//             }
//             options.toolbarPlacement = toolbarPlacement;

//             if (widget) {
//                 hide();
//                 show();
//             }
//             return picker;
//         };

//         picker.widgetPositioning = function (widgetPositioning) {
//             if (arguments.length === 0) {
//                 return $.extend({}, options.widgetPositioning);
//             }

//             if (({}).toString.call(widgetPositioning) !== '[object Object]') {
//                 throw new TypeError('widgetPositioning() expects an object variable');
//             }
//             if (widgetPositioning.horizontal) {
//                 if (typeof widgetPositioning.horizontal !== 'string') {
//                     throw new TypeError('widgetPositioning() horizontal variable must be a string');
//                 }
//                 widgetPositioning.horizontal = widgetPositioning.horizontal.toLowerCase();
//                 if (horizontalModes.indexOf(widgetPositioning.horizontal) === -1) {
//                     throw new TypeError('widgetPositioning() expects horizontal parameter to be one of (' + horizontalModes.join(', ') + ')');
//                 }
//                 options.widgetPositioning.horizontal = widgetPositioning.horizontal;
//             }
//             if (widgetPositioning.vertical) {
//                 if (typeof widgetPositioning.vertical !== 'string') {
//                     throw new TypeError('widgetPositioning() vertical variable must be a string');
//                 }
//                 widgetPositioning.vertical = widgetPositioning.vertical.toLowerCase();
//                 if (verticalModes.indexOf(widgetPositioning.vertical) === -1) {
//                     throw new TypeError('widgetPositioning() expects vertical parameter to be one of (' + verticalModes.join(', ') + ')');
//                 }
//                 options.widgetPositioning.vertical = widgetPositioning.vertical;
//             }
//             update();
//             return picker;
//         };

//         picker.calendarWeeks = function (calendarWeeks) {
//             if (arguments.length === 0) {
//                 return options.calendarWeeks;
//             }

//             if (typeof calendarWeeks !== 'boolean') {
//                 throw new TypeError('calendarWeeks() expects parameter to be a boolean value');
//             }

//             options.calendarWeeks = calendarWeeks;
//             update();
//             return picker;
//         };

//         picker.showTodayButton = function (showTodayButton) {
//             if (arguments.length === 0) {
//                 return options.showTodayButton;
//             }

//             if (typeof showTodayButton !== 'boolean') {
//                 throw new TypeError('showTodayButton() expects a boolean parameter');
//             }

//             options.showTodayButton = showTodayButton;
//             if (widget) {
//                 hide();
//                 show();
//             }
//             return picker;
//         };

//         picker.showClear = function (showClear) {
//             if (arguments.length === 0) {
//                 return options.showClear;
//             }

//             if (typeof showClear !== 'boolean') {
//                 throw new TypeError('showClear() expects a boolean parameter');
//             }

//             options.showClear = showClear;
//             if (widget) {
//                 hide();
//                 show();
//             }
//             return picker;
//         };

//         picker.widgetParent = function (widgetParent) {
//             if (arguments.length === 0) {
//                 return options.widgetParent;
//             }

//             if (typeof widgetParent === 'string') {
//                 widgetParent = $(widgetParent);
//             }

//             if (widgetParent !== null && (typeof widgetParent !== 'string' && !(widgetParent instanceof $))) {
//                 throw new TypeError('widgetParent() expects a string or a jQuery object parameter');
//             }

//             options.widgetParent = widgetParent;
//             if (widget) {
//                 hide();
//                 show();
//             }
//             return picker;
//         };

//         picker.keepOpen = function (keepOpen) {
//             if (arguments.length === 0) {
//                 return options.keepOpen;
//             }

//             if (typeof keepOpen !== 'boolean') {
//                 throw new TypeError('keepOpen() expects a boolean parameter');
//             }

//             options.keepOpen = keepOpen;
//             return picker;
//         };

//         picker.focusOnShow = function (focusOnShow) {
//             if (arguments.length === 0) {
//                 return options.focusOnShow;
//             }

//             if (typeof focusOnShow !== 'boolean') {
//                 throw new TypeError('focusOnShow() expects a boolean parameter');
//             }

//             options.focusOnShow = focusOnShow;
//             return picker;
//         };

//         picker.inline = function (inline) {
//             if (arguments.length === 0) {
//                 return options.inline;
//             }

//             if (typeof inline !== 'boolean') {
//                 throw new TypeError('inline() expects a boolean parameter');
//             }

//             options.inline = inline;
//             return picker;
//         };

//         picker.clear = function () {
//             clear();
//             return picker;
//         };

//         picker.keyBinds = function (keyBinds) {
//             options.keyBinds = keyBinds;
//             return picker;
//         };

//         picker.getMoment = function (d) {
//             return this.getMoment(d);
//         };

//         picker.debug = function (debug) {
//             if (typeof debug !== 'boolean') {
//                 throw new TypeError('debug() expects a boolean parameter');
//             }

//             options.debug = debug;
//             return picker;
//         };

//         picker.allowInputToggle = function (allowInputToggle) {
//             if (arguments.length === 0) {
//                 return options.allowInputToggle;
//             }

//             if (typeof allowInputToggle !== 'boolean') {
//                 throw new TypeError('allowInputToggle() expects a boolean parameter');
//             }

//             options.allowInputToggle = allowInputToggle;
//             return picker;
//         };

//         picker.showClose = function (showClose) {
//             if (arguments.length === 0) {
//                 return options.showClose;
//             }

//             if (typeof showClose !== 'boolean') {
//                 throw new TypeError('showClose() expects a boolean parameter');
//             }

//             options.showClose = showClose;
//             return picker;
//         };

//         picker.keepInvalid = function (keepInvalid) {
//             if (arguments.length === 0) {
//                 return options.keepInvalid;
//             }

//             if (typeof keepInvalid !== 'boolean') {
//                 throw new TypeError('keepInvalid() expects a boolean parameter');
//             }
//             options.keepInvalid = keepInvalid;
//             return picker;
//         };

//         picker.datepickerInput = function (datepickerInput) {
//             if (arguments.length === 0) {
//                 return options.datepickerInput;
//             }

//             if (typeof datepickerInput !== 'string') {
//                 throw new TypeError('datepickerInput() expects a string parameter');
//             }

//             options.datepickerInput = datepickerInput;
//             return picker;
//         };

//         picker.parseInputDate = function (parseInputDate) {
//             if (arguments.length === 0) {
//                 return options.parseInputDate;
//             }

//             if (typeof parseInputDate !== 'function') {
//                 throw new TypeError('parseInputDate() sholud be as function');
//             }

//             options.parseInputDate = parseInputDate;

//             return picker;
//         };

//         picker.disabledTimeIntervals = function (disabledTimeIntervals) {
//             ///<signature helpKeyword="$.fn.datetimepicker.disabledTimeIntervals">
//             ///<summary>Returns an array with the currently set disabled dates on the component.</summary>
//             ///<returns type="array">options.disabledTimeIntervals</returns>
//             ///</signature>
//             ///<signature>
//             ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of
//             ///options.enabledDates if such exist.</summary>
//             ///<param name="dates" locid="$.fn.datetimepicker.disabledTimeIntervals_p:dates">Takes an [ string or Date or moment ] of values and allows the user to select only from those days.</param>
//             ///</signature>
//             if (arguments.length === 0) {
//                 return (options.disabledTimeIntervals ? $.extend({}, options.disabledTimeIntervals) : options.disabledTimeIntervals);
//             }

//             if (!disabledTimeIntervals) {
//                 options.disabledTimeIntervals = false;
//                 update();
//                 return picker;
//             }
//             if (!(disabledTimeIntervals instanceof Array)) {
//                 throw new TypeError('disabledTimeIntervals() expects an array parameter');
//             }
//             options.disabledTimeIntervals = disabledTimeIntervals;
//             update();
//             return picker;
//         };

//         picker.disabledHours = function (hours) {
//             ///<signature helpKeyword="$.fn.datetimepicker.disabledHours">
//             ///<summary>Returns an array with the currently set disabled hours on the component.</summary>
//             ///<returns type="array">options.disabledHours</returns>
//             ///</signature>
//             ///<signature>
//             ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of
//             ///options.enabledHours if such exist.</summary>
//             ///<param name="hours" locid="$.fn.datetimepicker.disabledHours_p:hours">Takes an [ int ] of values and disallows the user to select only from those hours.</param>
//             ///</signature>
//             if (arguments.length === 0) {
//                 return (options.disabledHours ? $.extend({}, options.disabledHours) : options.disabledHours);
//             }

//             if (!hours) {
//                 options.disabledHours = false;
//                 update();
//                 return picker;
//             }
//             if (!(hours instanceof Array)) {
//                 throw new TypeError('disabledHours() expects an array parameter');
//             }
//             options.disabledHours = indexGivenHours(hours);
//             options.enabledHours = false;
//             if (options.useCurrent && !options.keepInvalid) {
//                 var tries = 0;
//                 while (!isValid(date, 'h')) {
//                     date.add(1, 'h');
//                     if (tries === 24) {
//                         throw 'Tried 24 times to find a valid date';
//                     }
//                     tries++;
//                 }
//                 setValue(date);
//             }
//             update();
//             return picker;
//         };

//         picker.enabledHours = function (hours) {
//             ///<signature helpKeyword="$.fn.datetimepicker.enabledHours">
//             ///<summary>Returns an array with the currently set enabled hours on the component.</summary>
//             ///<returns type="array">options.enabledHours</returns>
//             ///</signature>
//             ///<signature>
//             ///<summary>Setting this takes precedence over options.minDate, options.maxDate configuration. Also calling this function removes the configuration of options.disabledHours if such exist.</summary>
//             ///<param name="hours" locid="$.fn.datetimepicker.enabledHours_p:hours">Takes an [ int ] of values and allows the user to select only from those hours.</param>
//             ///</signature>
//             if (arguments.length === 0) {
//                 return (options.enabledHours ? $.extend({}, options.enabledHours) : options.enabledHours);
//             }

//             if (!hours) {
//                 options.enabledHours = false;
//                 update();
//                 return picker;
//             }
//             if (!(hours instanceof Array)) {
//                 throw new TypeError('enabledHours() expects an array parameter');
//             }
//             options.enabledHours = indexGivenHours(hours);
//             options.disabledHours = false;
//             if (options.useCurrent && !options.keepInvalid) {
//                 var tries = 0;
//                 while (!isValid(date, 'h')) {
//                     date.add(1, 'h');
//                     if (tries === 24) {
//                         throw 'Tried 24 times to find a valid date';
//                     }
//                     tries++;
//                 }
//                 setValue(date);
//             }
//             update();
//             return picker;
//         };

//         picker.viewDate = function (newDate) {
//             ///<signature helpKeyword="$.fn.datetimepicker.viewDate">
//             ///<summary>Returns the component's model current viewDate, a moment object or null if not set.</summary>
//             ///<returns type="Moment">viewDate.clone()</returns>
//             ///</signature>
//             ///<signature>
//             ///<summary>Sets the components model current moment to it. Passing a null value unsets the components model current moment. Parsing of the newDate parameter is made using moment library with the options.format and options.useStrict components configuration.</summary>
//             ///<param name="newDate" locid="$.fn.datetimepicker.date_p:newDate">Takes string, viewDate, moment, null parameter.</param>
//             ///</signature>
//             if (arguments.length === 0) {
//                 return viewDate.clone();
//             }

//             if (!newDate) {
//                 viewDate = date.clone();
//                 return picker;
//             }

//             if (typeof newDate !== 'string' && !moment.isMoment(newDate) && !(newDate instanceof Date)) {
//                 throw new TypeError('viewDate() parameter must be one of [string, moment or Date]');
//             }

//             viewDate = parseInputDate(newDate);
//             viewUpdate();
//             return picker;
//         };
//     };


// })(jQuery);