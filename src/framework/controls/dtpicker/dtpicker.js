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
        timeZone: 'Etc/UTC',
        // format: false,
        format: 'YYYY-MM-DD HH:mm:ss',
        dayViewHeaderFormat: 'MMMM YYYY',
        // extraFormats: false,
        stepping: 1,
        minDate: false,
        maxDate: false,
        useCurrent: true,
        // collapse: true,
        // locale: moment.locale(),
        defaultDate: false,
        disabledDates: false,
        enabledDates: false,
        icons: {
            time: 'glyphicon glyphicon-time',
            date: 'glyphicon glyphicon-calendar',
            up: 'glyphicon glyphicon-chevron-up',
            down: 'glyphicon glyphicon-chevron-down',
            previous: 'glyphicon glyphicon-chevron-left',
            next: 'glyphicon glyphicon-chevron-right',
            today: 'glyphicon glyphicon-screenshot',
            clear: 'glyphicon glyphicon-trash',
            close: 'glyphicon glyphicon-remove'
        },
        tooltips: {
            today: '现在',
            clear: '清除',
            close: '关闭',
            selectMonth: '选择月份',
            prevMonth: '上一月',
            nextMonth: '下一月',
            selectYear: '选择年份',
            prevYear: '上一年',
            nextYear: '下一年',
            selectDecade: '选择年代',
            prevDecade: '上一年代',
            nextDecade: '下一年代',
            prevCentury: '上一世纪',
            nextCentury: '下一世纪',
            pickHour: '选择小时',
            incrementHour: '增加小时',
            decrementHour: '减少小时',
            pickMinute: '选择分钟',
            incrementMinute: '增加分钟',
            decrementMinute: '减少分钟',
            pickSecond: '选择秒',
            incrementSecond: '增加秒',
            decrementSecond: '减少秒',
            togglePeriod: 'AM/PM',
            selectTime: '选择时间'
        },
        // useStrict: false,
        // sideBySide: false,
        daysOfWeekDisabled: false,
        calendarWeeks: false,
        viewMode: 'days',
        // toolbarPlacement: 'default',
        showTodayButton: true,
        showClear: true,
        showClose: true,
        // widgetPositioning: {
        //     horizontal: 'auto',
        //     vertical: 'auto'
        // },
        // widgetParent: null,
        ignoreReadonly: false,
        keepOpen: false,
        focusOnShow: true,
        inline: false,
        keepInvalid: false,
        datepickerInput: '.datepickerinput',
        // debug: false,
        allowInputToggle: false,
        disabledTimeIntervals: false,
        disabledHours: false,
        enabledHours: false,
        // viewValue: false
    };
    var attributeMap = {
        // fooOption: 'foo-option'
        format: 'format'
    };

    // 常量
    var viewModes = ['days', 'months', 'years', 'decades'],
        keyMap = {
            'up': 38,
            38: 'up',
            'down': 40,
            40: 'down',
            'left': 37,
            37: 'left',
            'right': 39,
            39: 'right',
            'tab': 9,
            9: 'tab',
            'escape': 27,
            27: 'escape',
            'enter': 13,
            13: 'enter',
            'pageUp': 33,
            33: 'pageUp',
            'pageDown': 34,
            34: 'pageDown',
            'shift': 16,
            16: 'shift',
            'control': 17,
            17: 'control',
            'space': 32,
            32: 'space',
            't': 84,
            84: 't',
            'delete': 46,
            46: 'delete'
        },
        keyState = {};

    // moment.js 接口
    function getMoment (format, d) {
        // var tzEnabled = false,
        //     returnMoment,
        //     currentZoneOffset,
        //     incomingZoneOffset,
        //     timeZoneIndicator,
        //     dateWithTimeZoneInfo;

        // if (moment.tz !== undefined && this.settings.timeZone !== undefined && this.settings.timeZone !== null && this.settings.timeZone !== '') {
        //     tzEnabled = true;
        // }
        // if (d === undefined || d === null) {
        //     if (tzEnabled) {
        //         returnMoment = moment().tz(this.settings.timeZone).startOf('d');
        //     } else {
        //         returnMoment = moment().startOf('d');
        //     }
        // } else {
        //     if (tzEnabled) {
        //         currentZoneOffset = moment().tz(this.settings.timeZone).utcOffset();
        //         incomingZoneOffset = moment(d, parseFormats, this.settings.useStrict).utcOffset();
        //         if (incomingZoneOffset !== currentZoneOffset) {
        //             timeZoneIndicator = moment().tz(this.settings.timeZone).format('Z');
        //             dateWithTimeZoneInfo = moment(d, parseFormats, this.settings.useStrict).format('YYYY-MM-DD[T]HH:mm:ss') + timeZoneIndicator;
        //             returnMoment = moment(dateWithTimeZoneInfo, parseFormats, this.settings.useStrict).tz(this.settings.timeZone);
        //         } else {
        //             returnMoment = moment(d, parseFormats, this.settings.useStrict).tz(this.settings.timeZone);
        //         }
        //     } else {
        //         returnMoment = moment(d, parseFormats, this.settings.useStrict);
        //     }
        // }
        var returnMoment;
        if (d === undefined || d === null) {
            returnMoment= moment().startOf('d');
        }
        else{
            // returnMoment = moment(d, format, this.settings.useStrict);
            // Moment's parser is very forgiving, and this can lead to undesired behavior. 
            // As of version 2.3.0, you may specify a boolean for the last argument to make Moment use strict parsing. 
            // Strict parsing requires that the format and input match exactly.
            returnMoment = moment(d, format, false);
        }
        return returnMoment;
    }
    // 格式，细粒度
    function isEnabled(format, granularity) {
        switch (granularity) {
            case 'y':
                return format.indexOf('Y') !== -1;
            case 'M':
                return format.indexOf('M') !== -1;
            case 'd':
                return format.toLowerCase().indexOf('d') !== -1;
            case 'h':
            case 'H':
                return format.toLowerCase().indexOf('h') !== -1;
            case 'm':
                return format.indexOf('m') !== -1;
            case 's':
                return format.indexOf('s') !== -1;
            default:
                return false;
        }
    }
    function hasTime(format) {
        return (isEnabled(format, 'h') || isEnabled(format, 'm') || isEnabled(format, 's'));
    }
    function hasDate(format) {
        return (isEnabled(format, 'y') || isEnabled(format, 'M') || isEnabled(format, 'd'));
    }
    function isValid(settings, targetMoment, granularity) {
        if (!targetMoment.isValid()) {
            return false;
        }
        if (settings.disabledDates && granularity === 'd' && settings.disabledDates[targetMoment.format('YYYY-MM-DD')] === true) {
            return false;
        }
        if (settings.enabledDates && granularity === 'd' && (settings.enabledDates[targetMoment.format('YYYY-MM-DD')] !== true)) {
            return false;
        }
        if (settings.minDate && targetMoment.isBefore(settings.minDate, granularity)) {
            return false;
        }
        if (settings.maxDate && targetMoment.isAfter(settings.maxDate, granularity)) {
            return false;
        }
        if (settings.daysOfWeekDisabled && granularity === 'd' && settings.daysOfWeekDisabled.indexOf(targetMoment.day()) !== -1) {
            return false;
        }
        if (settings.disabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && settings.disabledHours[targetMoment.format('H')] === true) {
            return false;
        }
        if (settings.enabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && (settings.enabledHours[targetMoment.format('H')] !== true)) {
            return false;
        }
        if (settings.disabledTimeIntervals && (granularity === 'h' || granularity === 'm' || granularity === 's')) {
            var found = false;
            $.each(settings.disabledTimeIntervals, function () {
                if (targetMoment.isBetween(this[0], this[1])) {
                    found = true;
                    return false;
                }
            });
            if (found) {
                return false;
            }
        }
        return true;
    }

    // notifyEvent: function (e) {
    //     if (e.type === 'dp.change' && ((e.date && e.date.isSame(e.oldDate)) || (!e.date && !e.oldDate))) {
    //         return;
    //     }
    //     element.trigger(e);
    // },

    var Widget=new J.Class({
        defaults: defaults,
        attributeMap: attributeMap,

        settings: {},
        value: null,
        // data: {},
        // templates: {},

        use24Hours: false,
        minViewModeNumber: 0,   // 最小视图模式，选到这个模式以后关闭弹出窗口。
        currentViewMode: 0,

        // 构造函数
        init: function(elements, options){
            this.inputElements = elements;


            // 直接使用容器类实例的设置
            this.settings=options;

            // // TODO:临时措施
            // this.use24Hours= false;
            // this.currentViewMode= 0;
            this.initFormatting();


            // this.initSettings(options);
            // // this.value= this.element.val();
            var now= getMoment(this.settings.format);
            this.value= now;
            this.viewValue=this.value;

            this.buildHtml();
            this.initElements();
            this.buildObservers();
            this.bindEvents();
            // this.bindEventsInterface();

            this.refresh();
        },
        initFormatting: function () {
            // Time    LT  8:30 PM
            // Time with seconds   LTS 8:30:25 PM
            // Month numeral, day of month, year   L   09/04/1986
            // l   9/4/1986
            // Month name, day of month, year  LL  September 4 1986
            // ll  Sep 4 1986
            // Month name, day of month, year, time    LLL September 4 1986 8:30 PM
            // lll Sep 4 1986 8:30 PM
            // Month name, day of month, day of week, year, time   LLLL    Thursday, September 4 1986 8:30 PM
            // llll    Thu, Sep 4 1986 8:30 PM
            // var format= this.settings.format || 'L LT';
            // var context= this;
            // this.actualFormat = format.replace(/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function (formatInput) {
            //     var value= context.getValue();
            //     var newinput = value.localeData().longDateFormat(formatInput) || formatInput;
            //     return newinput.replace(/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function (formatInput2) { //temp fix for #740
            //         return value.localeData().longDateFormat(formatInput2) || formatInput2;
            //     });
            // });

            // parseFormats = this.settings.extraFormats ? this.settings.extraFormats.slice() : [];
            // parseFormats = [];
            // if (parseFormats.indexOf(format) < 0 && parseFormats.indexOf(this.actualFormat) < 0) {
            //     parseFormats.push(this.actualFormat);
            // }

            // this.use24Hours = (this.actualFormat.toLowerCase().indexOf('a') < 1 && this.actualFormat.replace(/\[.*?\]/g, '').indexOf('h') < 1);
            this.use24Hours = (this.settings.format.toLowerCase().indexOf('a') < 1 && this.settings.format.replace(/\[.*?\]/g, '').indexOf('h') < 1);

            if (isEnabled(this.settings.format, 'y')) {
                this.minViewModeNumber = 2;
            }
            if (isEnabled(this.settings.format, 'M')) {
                this.minViewModeNumber = 1;
            }
            if (isEnabled(this.settings.format, 'd')) {
                this.minViewModeNumber = 0;
            }

            this.currentViewMode = Math.max(this.minViewModeNumber, this.currentViewMode);
        },
        buildHtml: function(){
            // 星期表头
            var currentDate= this.viewValue.clone().startOf('w').startOf('d');
            var htmlDow= this.settings.calendarWeeks === true ? '<th class="cw">#</th>' : '';
            while (currentDate.isBefore(this.viewValue.clone().endOf('w'))) {
                htmlDow += '<th class="dow">'+currentDate.format('dd')+'</th>';
                currentDate.add(1, 'd');
            }
            htmlDow= '<tr>'+htmlDow+'</tr>';

            // 月份
            var monthsShort = this.viewValue.clone().startOf('y').startOf('d');
            var htmlMonths= '';
            while (monthsShort.isSame(this.viewValue, 'y')) {
                htmlMonths += '<span class="month" data-action="selectMonth">'+monthsShort.format('MMM')+'</span>';
                monthsShort.add(1, 'M');
            }

            // 日期视图
            var dateView = ''+
                '<div class="datepicker'+((hasDate(this.settings.format) && hasTime(this.settings.format)) ? ' col-md-6' : '')+'">'+
                '   <div class="datepicker-days">'+
                '       <table class="table-condensed">'+
                '           <thead>'+
                '               <tr>'+
                '                   <th class="prev" data-action="previous"><span class="'+this.settings.icons.previous+'" title="'+this.settings.tooltips.prevMonth+'"></span></th>'+
                '                   <th class="picker-switch" data-action="pickerSwitch" colspan="'+(this.settings.calendarWeeks ? '6' : '5')+'" title="'+this.settings.tooltips.selectMonth+'"></th>'+
                '                   <th class="next" data-action="next"><span class="'+this.settings.icons.next+'" title="'+this.settings.tooltips.nextMonth+'"></span></th>'+
                '               </tr>'+
                htmlDow+
                '           </thead>'+
                '           <tbody>'+
                '           </tbody>'+
                '       <table/>'+
                '   </div>'+
                '   <div class="datepicker-months">'+
                '       <table class="table-condensed">'+
                '           <thead>'+
                '               <tr>'+
                '                   <th class="prev" data-action="previous"><span class="'+this.settings.icons.previous+'" title="'+this.settings.tooltips.prevYear+'"></span></th>'+
                '                   <th class="picker-switch" data-action="pickerSwitch" colspan="'+(this.settings.calendarWeeks ? '6' : '5')+'" title="'+this.settings.tooltips.selectYear+'"></th>'+
                '                   <th class="next" data-action="next"><span class="'+this.settings.icons.next+'" title="'+this.settings.tooltips.nextYear+'"></span></th>'+
                '               </tr>'+
                '           </thead>'+
                '           <tbody>'+
                '               <tr><td colspan="'+(this.settings.calendarWeeks ? '8' : '7')+'">'+htmlMonths+'</td></tr>'+
                '           </tbody>'+
                '       <table/>'+
                '   </div>'+
                '   <div class="datepicker-years">'+
                '       <table class="table-condensed">'+
                '           <thead>'+
                '               <tr>'+
                '                   <th class="prev" data-action="previous"><span class="'+this.settings.icons.previous+'" title="'+this.settings.tooltips.prevDecade+'"></span></th>'+
                '                   <th class="picker-switch" data-action="pickerSwitch" colspan="'+(this.settings.calendarWeeks ? '6' : '5')+'" title="'+this.settings.tooltips.selectDecade+'"></th>'+
                '                   <th class="next" data-action="next"><span class="'+this.settings.icons.next+'" title="'+this.settings.tooltips.nextDecade+'"></span></th>'+
                '               </tr>'+
                '           </thead>'+
                '           <tbody>'+
                '               <tr><td colspan="'+(this.settings.calendarWeeks ? '8' : '7')+'"></td></tr>'+
                '           </tbody>'+
                '       <table/>'+
                '   </div>'+
                '   <div class="datepicker-decades">'+
                '       <table class="table-condensed">'+
                '           <thead>'+
                '               <tr>'+
                '                   <th class="prev" data-action="previous"><span class="'+this.settings.icons.previous+'" title="'+this.settings.tooltips.prevCentury+'"></span></th>'+
                '                   <th class="picker-switch" data-action="pickerSwitch" colspan="'+(this.settings.calendarWeeks ? '6' : '5')+'"></th>'+
                '                   <th class="next" data-action="next"><span class="'+this.settings.icons.next+'" title="'+this.settings.tooltips.nextCentury+'"></span></th>'+
                '               </tr>'+
                '           </thead>'+
                '           <tbody>'+
                '               <tr><td colspan="'+(this.settings.calendarWeeks ? '8' : '7')+'"></td></tr>'+
                '           </tbody>'+
                '       <table/>'+
                '   </div>'+
                '</div>';

            // 小时选择按钮
            var htmlHours= '';
            if(isEnabled(this.settings.format, 'h')){
                var currentHour = this.viewValue.clone().startOf('d');
                if (this.viewValue.hour() > 11 && !this.use24Hours) {
                    currentHour.hour(12);
                }
                while (currentHour.isSame(this.viewValue, 'd') && (this.use24Hours || (this.viewValue.hour() < 12 && currentHour.hour() < 12) || this.viewValue.hour() > 11)) {
                    if (currentHour.hour() % 4 === 0) {
                        htmlHours += '<tr>';
                    }
                    htmlHours += ''+
                        '<td data-action="selectHour" class="hour' + (!isValid(this.settings,currentHour, 'h') ? ' disabled' : '') + '">' + 
                        currentHour.format(this.use24Hours ? 'HH' : 'hh') + 
                        '</td>';
                    if (currentHour.hour() % 4 === 3) {
                        htmlHours += '</tr>';
                    }

                    currentHour.add(1, 'h');
                }
            }

            // 分钟选择按钮
            var htmlMinutes= '';
            if(isEnabled(this.settings.format, 'm')){
                var currentMinute = this.viewValue.clone().startOf('h');
                var step = this.settings.stepping === 1 ? 5 : this.settings.stepping;
                while (this.viewValue.isSame(currentMinute, 'h')) {
                    if (currentMinute.minute() % (step * 4) === 0) {
                        htmlMinutes += '<tr>';
                    }
                    htmlMinutes +=''+
                        '<td data-action="selectMinute" class="minute' + (!isValid(this.settings,currentMinute, 'm') ? ' disabled' : '') + '">' + 
                        currentMinute.format('mm') + 
                        '</td>';
                    if (currentMinute.minute() % (step * 4) === step * 3) {
                        htmlMinutes += '</tr>';
                    }

                    currentMinute.add(step, 'm');
                }
            }

            // 秒选择按钮
            var htmlSeconds= '';
            if(isEnabled(this.settings.format, 's')){
                var currentSecond = this.viewValue.clone().startOf('m');
                while (this.viewValue.isSame(currentSecond, 'm')) {
                    if (currentSecond.second() % 20 === 0) {
                        htmlSeconds += '<tr>';
                    }
                    htmlSeconds += ''+
                        '<td data-action="selectSecond" class="second' + (!isValid(this.settings,currentSecond, 's') ? ' disabled' : '') + '">' + 
                        currentSecond.format('ss') + 
                        '</td>';
                    if (currentSecond.second() % 20 === 15) {
                        htmlSeconds += '</tr>';
                    }

                    currentSecond.add(5, 's');
                }
            }

            // 时间视图
            var timeView = ''+
                '<div class="timepicker'+((hasDate(this.settings.format) && hasTime(this.settings.format)) ? ' col-md-6' : '')+'">'+
                '   <div class="timepicker-picker">'+
                '       <table class="table-condensed">'+
                '           <tr>'+
                (isEnabled(this.settings.format, 'h') ? 
                '               <td>'+
                '                   <a href="#" class="btn" data-action="incrementHours" tabindex="-1" title="'+this.settings.tooltips.incrementHour+'">'+
                '                       <span class="'+this.settings.icons.up+'"></span>'+
                '                   </a>'+
                '               </td>' : '')+
                (isEnabled(this.settings.format, 'm') ? 
                ((isEnabled(this.settings.format, 'h') ?
                '               <td class="separator"></td>' : '')+
                '               <td>'+
                '                   <a href="#" class="btn" data-action="incrementMinutes" tabindex="-1" title="'+this.settings.tooltips.incrementMinute+'">'+
                '                       <span class="'+this.settings.icons.up+'"></span>'+
                '                   </a>'+
                '               </td>') : '')+
                (isEnabled(this.settings.format, 's') ? 
                ((isEnabled(this.settings.format, 'm') ?
                '               <td class="separator"></td>' : '')+
                '               <td>'+
                '                   <a href="#" class="btn" data-action="incrementSeconds" tabindex="-1" title="'+this.settings.tooltips.incrementSecond+'">'+
                '                       <span class="'+this.settings.icons.up+'"></span>'+
                '                   </a>'+
                '               </td>') : '')+
                (this.use24Hours ? 
                '               <td class="separator"></td>' : '')+
                '           </tr>'+
                '           <tr>'+ 
                (isEnabled(this.settings.format, 'h') ?
                '               <td>'+
                '                   <span class="timepicker-hour" data-action="showHours" data-time-component="hours" title="'+this.settings.tooltips.pickHour+'"></span>'+
                '               </td>' : '')+
                (isEnabled(this.settings.format, 'm') ?
                ((isEnabled(this.settings.format, 'h') ?
                '               <td class="separator">:</td>' : '')+
                '               <td>'+
                '                   <span class="timepicker-minute" data-action="showMinutes" data-time-component="minutes" title="'+this.settings.tooltips.pickMinute+'"></span>'+
                '               </td>') : '')+
                (isEnabled(this.settings.format, 's') ?
                ((isEnabled(this.settings.format, 'm') ?
                '               <td class="separator">:</td>' : '')+
                '               <td>'+
                '                   <span class="timepicker-second" data-action="showSeconds" data-time-component="seconds" title="'+this.settings.tooltips.pickSecond+'"></span>'+
                '               </td>') : '')+
                                (this.use24Hours ? 
                '               <td class="separator">'+
                '                   <button class="btn btn-primary" data-action="togglePeriod" tabindex="-1" title="'+this.settings.tooltips.togglePeriod+'"></button>'+
                '               </td>' : '')+
                '           </tr>'+
                '           <tr>'+
                '               <td>'+
                '                   <a href="#" class="btn" data-action="decrementHours" tabindex="-1" title="'+this.settings.tooltips.decrementHour+'">'+
                '                       <span class="'+this.settings.icons.down+'"></span>'+
                '                   </a>'+
                '               </td>'+
                (isEnabled(this.settings.format, 'm') ? 
                ((isEnabled(this.settings.format, 'h') ?
                '               <td class="separator"></td>' : '')+
                '               <td>'+
                '                   <a href="#" class="btn" data-action="decrementMinutes" tabindex="-1" title="'+this.settings.tooltips.decrementMinute+'">'+
                '                       <span class="'+this.settings.icons.down+'"></span>'+
                '                   </a>'+
                '               </td>') : '')+
                (isEnabled(this.settings.format, 's') ? 
                ((isEnabled(this.settings.format, 'm') ?
                '               <td class="separator"></td>' : '')+
                '               <td>'+
                '                   <a href="#" class="btn" data-action="decrementSeconds" tabindex="-1" title="'+this.settings.tooltips.decrementSecond+'">'+
                '                       <span class="'+this.settings.icons.down+'"></span>'+
                '                   </a>'+
                '               </td>') : '')+
                (this.use24Hours ? 
                '               <td class="separator"></td>' : '')+
                '           </tr>'+
                '       </table>'+
                '   </div>'+
                (isEnabled(this.settings.format, 'h') ? 
                '   <div class="timepicker-hours">'+
                '       <table class="table-condensed">'+htmlHours+'</table>'+
                '   </div>' : '')+
                (isEnabled(this.settings.format, 'm') ? 
                '   <div class="timepicker-minutes">'+
                '       <table class="table-condensed">'+htmlMinutes+'</table>'+
                '   </div>' : '')+
                (isEnabled(this.settings.format, 's') ? 
                '   <div class="timepicker-seconds">'+
                '       <table class="table-condensed">'+htmlSeconds+'</table>'+
                '   </div>' : '')+
                '</div>';

            var toolbar2 = ''+
                '<table class="table-condensed">'+
                '   <tbody>'+
                '       <tr>'+
                (this.settings.showTodayButton ?
                '           <td><a data-action="today" title="'+this.settings.tooltips.today+'"><span class="'+this.settings.icons.today+'"></span></a></td>' : '')+
                // ((!this.settings.sideBySide && hasDate(this.settings.format) && hasTime(this.settings.format))?
                // '           <td><a data-action="togglePicker" title="'+this.settings.tooltips.selectTime+'"><span class="'+this.settings.icons.time+'"></span></a></td>' : '')+
                (this.settings.showClear ?
                '           <td><a data-action="clear" title="'+this.settings.tooltips.clear+'"><span class="'+this.settings.icons.clear+'"></span></a></td>' : '')+
                (this.settings.showClose ?
                '           <td><a data-action="close" title="'+this.settings.tooltips.close+'"><span class="'+this.settings.icons.close+'"></span></a></td>' : '')+
                '       </tr>'+
                '   </tbody>'+
                '</table>';
            
            // var toolbar = '<li class="'+'picker-switch' + (this.settings.collapse ? ' accordion-toggle' : '')+'">'+toolbar2+'<li>';
            var toolbar = '<li class="picker-switch">'+toolbar2+'<li>';

            var templateCssClass= 't-dtpicker-widget';
            if (!this.settings.inline) {
                templateCssClass += ' dropdown-menu';
            }
            if (this.use24Hours) {
                templateCssClass += ' usetwentyfour';
            }
            if (isEnabled(this.settings.format, 's') && !this.use24Hours) {
                templateCssClass += ' wider';
            }

            var htmlTemplate = '';
            if (hasDate(this.settings.format) && hasTime(this.settings.format)) {
                htmlTemplate = ''+
                    '<div class="'+templateCssClass+' timepicker-sbs">'+
                    '   <div class="row">'+
                    dateView+
                    timeView+
                    toolbar+
                    '   </div>'+
                    '</div>';
            }
            else{
                htmlTemplate = ''+
                    '<div class="'+templateCssClass+'">'+
                    '   <ul class="list-unstyled">'+
                    (hasDate(this.settings.format) ? 
                    '       <li>'+dateView+'</li>' : '')+   // '+(this.settings.collapse && hasTime(this.settings.format) ? ' class="collapse in"' : '')+'
                    (hasTime(this.settings.format) ? 
                    '       <li>'+dateView+'</li>' : '')+   // '+(this.settings.collapse && hasTime(this.settings.format) ? ' class="collapse in"' : '')+'
                    '       <li>'+toolbar+'</li>'+
                    '   </ul>'+
                    '</div>';
            }

            this.container= $(htmlTemplate);
            this.inputElements.view.after(this.container);
            // this.inputElements.widgetContainer.append(this.container);
        },
        initElements: function(){
            // var context= this;
            this.elements={
                // original: this.element//,
                decades: $('.datepicker-decades', this.container),
                years: $('.datepicker-years', this.container),
                months: $('.datepicker-months', this.container),
                days: $('.datepicker-days', this.container),
                hour: $('.timepicker-hour', this.container),
                hours: $('.timepicker-hours', this.container),
                minute: $('.timepicker-minute', this.container),
                minutes: $('.timepicker-minutes', this.container),
                second: $('.timepicker-second', this.container),
                seconds: $('.timepicker-seconds', this.container)//,
                // view: $('input[type=text]', this.container)
                // getTab: function(levelIndex){
                //     var tabSelector='.t-level-tab-'+levelIndex;
                //     return $(tabSelector, context.container);
                // }
            };

            if(this.settings.inline){
                this.show();
            }

            this.elements.hours.hide();
            this.elements.minutes.hide();
            this.elements.seconds.hide();
        },
        buildObservers: function(){
            var context= this;
            var datePickerModes= [
                {
                    navFnc: 'M',
                    navStep: 1
                },
                {
                    navFnc: 'y',
                    navStep: 1
                },
                {
                    navFnc: 'y',
                    navStep: 10
                },
                {
                    navFnc: 'y',
                    navStep: 100
                }
            ];
            this.observers= {
                next: function () {
                    var navStep = datePickerModes[this.currentViewMode].navStep;
                    var navFnc = datePickerModes[this.currentViewMode].navFnc;
                    this.viewValue.add(navStep, navFnc);
                    // TODO: with ViewMode
                    this.refreshDate(); 
                    // viewUpdate(navFnc);
                },
                previous: function () {
                    var navFnc = datePickerModes[this.currentViewMode].navFnc;
                    var navStep = datePickerModes[this.currentViewMode].navStep;
                    this.viewValue.subtract(navStep, navFnc);
                    // TODO: with ViewMode
                    this.refreshDate();
                    // viewUpdate(navFnc);
                },
                pickerSwitch: function () {
                    this.showMode(1);
                },
                selectMonth: function (e) {
                    var month = $(e.target).closest('tbody').find('span').index($(e.target));
                    this.viewValue.month(month);
                    if (this.currentViewMode === this.minViewModeNumber) {
                        this.setValue(this.value.clone().year(this.viewValue.year()).month(this.viewValue.month()));
                        if (!this.settings.inline) {
                            this.hide();
                        }
                    } else {
                        this.showMode(-1);
                        // fillDate();
                        this.refreshDays();
                    }
                    // viewUpdate('M');
                },
                selectYear: function (e) {
                    var year = parseInt($(e.target).text(), 10) || 0;
                    this.viewValue.year(year);
                    if (this.currentViewMode === this.minViewModeNumber) {
                        this.setValue(this.value.clone().year(this.viewValue.year()));
                        if (!this.settings.inline) {
                            this.hide();
                        }
                    } else {
                        this.showMode(-1);
                        this.refreshMonths();
                    }
                    // viewUpdate('YYYY');
                },
                selectDecade: function (e) {
                    var year = parseInt($(e.target).data('selection'), 10) || 0;
                    this.viewValue.year(year);
                    if (this.currentViewMode === this.minViewModeNumber) {
                        this.setValue(this.value.clone().year(this.viewValue.year()));
                        if (!this.settings.inline) {
                            this.hide();
                        }
                    } else {
                        this.showMode(-1);
                        this.refreshYears();
                    }
                    // viewUpdate('YYYY');
                },
                selectDay: function (e) {
                    var day = this.viewValue.clone();
                    if ($(e.target).is('.old')) {
                        day.subtract(1, 'M');
                    }
                    if ($(e.target).is('.new')) {
                        day.add(1, 'M');
                    }
                    this.setValue(day.date(parseInt($(e.target).text(), 10)));
                    if (!hasTime(this.settings.format) && !this.settings.keepOpen && !this.settings.inline) {
                        this.hide();
                    }
                },
                incrementHours: function () {
                    var newDate = this.value.clone().add(1, 'h');
                    if (isValid(this.settings,newDate, 'h')) {
                        this.setValue(newDate);
                    }
                },
                incrementMinutes: function () {
                    var newDate = this.value.clone().add(this.settings.stepping, 'm');
                    if (isValid(this.settings,newDate, 'm')) {
                        this.setValue(newDate);
                    }
                },
                incrementSeconds: function () {
                    var newDate = this.value.clone().add(1, 's');
                    if (isValid(this.settings,newDate, 's')) {
                        this.setValue(newDate);
                    }
                },
                decrementHours: function () {
                    var newDate = this.value.clone().subtract(1, 'h');
                    if (isValid(this.settings,newDate, 'h')) {
                        this.setValue(newDate);
                    }
                },
                decrementMinutes: function () {
                    var newDate = this.value.clone().subtract(this.settings.stepping, 'm');
                    if (isValid(this.settings,newDate, 'm')) {
                        this.setValue(newDate);
                    }
                },
                decrementSeconds: function () {
                    var newDate = this.value.clone().subtract(1, 's');
                    if (isValid(this.settings,newDate, 's')) {
                        this.setValue(newDate);
                    }
                },
                togglePeriod: function () {
                    this.setValue(this.value.clone().add((this.value.hours() >= 12) ? -12 : 12, 'h'));
                },
                // togglePicker: function (e) {
                //     var $this = $(e.target),
                //         $parent = $this.closest('ul'),
                //         expanded = $parent.find('.in'),
                //         closed = $parent.find('.collapse:not(.in)'),
                //         collapseData;

                //     if (expanded && expanded.length) {
                //         collapseData = expanded.data('collapse');
                //         if (collapseData && collapseData.transitioning) {
                //             return;
                //         }
                //         if (expanded.collapse) { // if collapse plugin is available through bootstrap.js then use it
                //             expanded.collapse('hide');
                //             closed.collapse('show');
                //         } else { // otherwise just toggle in class on the two views
                //             expanded.removeClass('in');
                //             closed.addClass('in');
                //         }
                //         if ($this.is('span')) {
                //             $this.toggleClass(this.settings.icons.time + ' ' + this.settings.icons.date);
                //         } else {
                //             $this.find('span').toggleClass(this.settings.icons.time + ' ' + this.settings.icons.date);
                //         }

                //         // NOTE: uncomment if toggled state will be restored in show()
                //         //if (component) {
                //         //    component.find('span').toggleClass(this.settings.icons.time + ' ' + this.settings.icons.date);
                //         //}
                //     }
                // },
                showPicker: function () {
                    context.container.find('.timepicker > div:not(.timepicker-picker)').hide();
                    context.container.find('.timepicker .timepicker-picker').show();
                },
                showHours: function () {
                    context.container.find('.timepicker .timepicker-picker').hide();
                    context.container.find('.timepicker .timepicker-hours').show();
                },
                showMinutes: function () {
                    context.container.find('.timepicker .timepicker-picker').hide();
                    context.container.find('.timepicker .timepicker-minutes').show();
                },
                showSeconds: function () {
                    context.container.find('.timepicker .timepicker-picker').hide();
                    context.container.find('.timepicker .timepicker-seconds').show();
                },
                selectHour: function (e) {
                    var hour = parseInt($(e.target).text(), 10);

                    if (!this.use24Hours) {
                        if (this.value.hours() >= 12) {
                            if (hour !== 12) {
                                hour += 12;
                            }
                        } else {
                            if (hour === 12) {
                                hour = 0;
                            }
                        }
                    }
                    this.setValue(this.value.clone().hours(hour));
                    this.observers.showPicker.call(this);
                },
                selectMinute: function (e) {
                    this.setValue(this.value.clone().minutes(parseInt($(e.target).text(), 10)));
                    this.observers.showPicker();
                },
                selectSecond: function (e) {
                    this.setValue(this.value.clone().seconds(parseInt($(e.target).text(), 10)));
                    this.observers.showPicker();
                },
                clear: function(){
                    this.clear();
                },
                today: function () {
                    var todaysDate = getMoment();
                    if (isValid(this.settings,todaysDate, 'd')) {
                        this.setValue(todaysDate);
                    }
                },
                close: function(){
                    this.hide();
                }
            };

            this.keyBinds= {
                up: function (widget) {
                    if (!widget) {
                        return;
                    }
                    var d = this.date() || getMoment(this.settings.format);
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().subtract(7, 'd'));
                    } else {
                        this.date(d.clone().add(this.stepping(), 'm'));
                    }
                },
                down: function (widget) {
                    if (!widget) {
                        this.show();
                        return;
                    }
                    var d = this.date() || getMoment(this.settings.format);
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().add(7, 'd'));
                    } else {
                        this.date(d.clone().subtract(this.stepping(), 'm'));
                    }
                },
                'control up': function (widget) {
                    if (!widget) {
                        return;
                    }
                    var d = this.date() || getMoment(this.settings.format);
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().subtract(1, 'y'));
                    } else {
                        this.date(d.clone().add(1, 'h'));
                    }
                },
                'control down': function (widget) {
                    if (!widget) {
                        return;
                    }
                    var d = this.date() || getMoment(this.settings.format);
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().add(1, 'y'));
                    } else {
                        this.date(d.clone().subtract(1, 'h'));
                    }
                },
                left: function (widget) {
                    if (!widget) {
                        return;
                    }
                    var d = this.date() || getMoment(this.settings.format);
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().subtract(1, 'd'));
                    }
                },
                right: function (widget) {
                    if (!widget) {
                        return;
                    }
                    var d = this.date() || getMoment(this.settings.format);
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().add(1, 'd'));
                    }
                },
                pageUp: function (widget) {
                    if (!widget) {
                        return;
                    }
                    var d = this.date() || getMoment(this.settings.format);
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().subtract(1, 'M'));
                    }
                },
                pageDown: function (widget) {
                    if (!widget) {
                        return;
                    }
                    var d = this.date() || getMoment(this.settings.format);
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().add(1, 'M'));
                    }
                },
                enter: function () {
                    this.hide();
                },
                escape: function () {
                    this.hide();
                },
                //tab: function (widget) { //this break the flow of the form. disabling for now
                //    var toggle = widget.find('.picker-switch a[data-action="togglePicker"]');
                //    if(toggle.length > 0) toggle.click();
                //},
                'control space': function (widget) {
                    if (widget.find('.timepicker').is(':visible')) {
                        widget.find('.btn[data-action="togglePeriod"]').click();
                    }
                },
                t: function () {
                    this.date(getMoment(this.settings.format));
                },
                'delete': function () {
                    this.clear();
                }
            };
        },
        bindEvents: function(){
            var context= this;
            var element= this.element;

            this.inputElements.button.on('click', $.proxy(this.show, this));
            this.container.on('click', '[data-action]', $.proxy(this.doAction, this)); // this handles clicks on the widget
            this.container.on('mousedown', false);

            $(window).on('resize', $.proxy(this.place, this));

            // element.on('click', $.proxy(this.onFooClick, this));
        },
        // bindEventsInterface: function(){
        //     var context= this;
        //     var element= this.element;

        //     if(this.settings.onFooSelected){
        //         element.on('click.t.template', $.proxy(this.settings.onFooSelected, this));
        //     }
        // },
        render: function(){},

        // 事件处理
        // onFooClick: function(e, data){
        //     ;
        // },
        place: function () {
            // var position = (component || element).position(),
            // offset = (component || element).offset(),
            var position = this.inputElements.view.position();
            var offset = this.inputElements.view.offset();
                // vertical = this.settings.widgetPositioning.vertical,
                // horizontal = this.settings.widgetPositioning.horizontal,
            var vertical;
            var horizontal;
            var parent;

            // if (this.settings.widgetParent) {
            //     parent = this.settings.widgetParent.append(widget);
            // } else if (element.is('input')) {
            //     parent = this.inputElements.view.after(this.container).parent();
            // } else if (this.settings.inline) {
            //     parent = this.inputElements.view.append(widget);
            //     return;
            // } else {
            //     parent = this.inputElements.view;
            //     this.inputElements.view.children().first().after(widget);
            // }
            parent = this.inputElements.view.parent();

            // Top and bottom logic
            // if (vertical === 'auto') {
                if (offset.top + this.container.height() * 1.5 >= $(window).height() + $(window).scrollTop() &&
                    this.container.height() + this.inputElements.view.outerHeight() < offset.top) {
                    vertical = 'top';
                } else {
                    vertical = 'bottom';
                }
            // }

            // // Left and right logic
            // if (horizontal === 'auto') {
                if (parent.width() < offset.left + this.container.outerWidth() / 2 &&
                    offset.left + this.container.outerWidth() > $(window).width()) {
                    horizontal = 'right';
                } else {
                    horizontal = 'left';
                }
            // }

            if (vertical === 'top') {
                this.container.addClass('top').removeClass('bottom');
            } else {
                this.container.addClass('bottom').removeClass('top');
            }

            if (horizontal === 'right') {
                this.container.addClass('pull-right');
            } else {
                this.container.removeClass('pull-right');
            }

            // find the first parent element that has a relative css positioning
            if (parent.css('position') !== 'relative') {
                parent = parent.parents().filter(function () {
                    return $(this).css('position') === 'relative';
                }).first();
            }

            // if (parent.length === 0) {
            //     throw new Error('datetimepicker component should be placed within a relative positioned container');
            // }

            this.container.css({
                top: vertical === 'top' ? 'auto' : position.top + this.inputElements.view.outerHeight(),
                bottom: vertical === 'top' ? position.top + this.inputElements.view.outerHeight() : 'auto',
                left: horizontal === 'left' ? (parent === this.inputElements.view ? 0 : position.left) : 'auto',
                right: horizontal === 'left' ? 'auto' : parent.outerWidth() - this.inputElements.view.outerWidth() - (parent === this.inputElements.view ? 0 : position.left)
            });
        },
        
        // viewUpdate: function (e) {
        //     if (e === 'y') {
        //         e = 'YYYY';
        //     }
        //     // notifyEvent({
        //     //     type: 'dp.update',
        //     //     change: e,
        //     //     viewValue: this.viewValue.clone()
        //     // });
        // },
        // dir 方向 加一或减一
        showMode: function (dir) {
            if (dir) {
                this.currentViewMode = Math.max(this.minViewModeNumber, Math.min(3, this.currentViewMode + dir));
            }
            // this.container.find('.datepicker > div').hide().filter('.datepicker-' + datePickerModes[this.currentViewMode].clsName).show();
            this.container.find('.datepicker > div').hide().filter('.datepicker-' + viewModes[this.currentViewMode]).show();
        },

        fillDate: function () {
            
        },
        fillTime: function () {
            
        },
        // update: function () {
        //     if (!widget) {
        //         return;
        //     }
        //     fillDate();
        //     fillTime();
        // },
        // setValue: function (targetMoment) {
        //     var oldDate = unset ? null : this.value;

        //     // case of calling setValue(null or false)
        //     if (!targetMoment) {
        //         unset = true;
        //         input.val('');
        //         element.data('date', '');
        //         notifyEvent({
        //             type: 'dp.change',
        //             date: false,
        //             oldDate: oldDate
        //         });
        //         update();
        //         return;
        //     }

        //     targetMoment = targetMoment.clone().locale(this.settings.locale);

        //     if (this.settings.stepping !== 1) {
        //         targetMoment.minutes((Math.round(targetMoment.minutes() / this.settings.stepping) * this.settings.stepping) % 60).seconds(0);
        //     }

        //     if (isValid(this.settings,targetMoment)) {
        //         this.value = targetMoment;
        //         this.viewValue = this.value.clone();
        //         input.val(this.value.format(this.actualFormat));
        //         element.data('date', this.value.format(this.actualFormat));
        //         unset = false;
        //         update();
        //         notifyEvent({
        //             type: 'dp.change',
        //             date: this.value.clone(),
        //             oldDate: oldDate
        //         });
        //     } else {
        //         if (!this.settings.keepInvalid) {
        //             input.val(unset ? '' : this.value.format(this.actualFormat));
        //         }
        //         notifyEvent({
        //             type: 'dp.error',
        //             date: targetMoment
        //         });
        //     }
        // },
        hide: function () {
            ///<summary>Hides the widget. Possibly will emit dp.hide</summary>
            // var transitioning = false;
            // if (!widget) {
            //     return picker;
            // }
            // Ignore event if in the middle of a picker transition
            // this.container.find('.collapse').each(function () {
            //     var collapseData = $(this).data('collapse');
            //     if (collapseData && collapseData.transitioning) {
            //         transitioning = true;
            //         return false;
            //     }
            //     return true;
            // });
            // if (transitioning) {
            //     return;// picker;
            // }
            // if (component && component.hasClass('btn')) {
            //     component.toggleClass('active');
            this.inputElements.button.toggleClass('active');
            // }
            
            this.container.hide();

            $(window).off('resize', this.place);
            this.container.off('click', '[data-action]');
            this.container.off('mousedown', false);

            // this.container.remove();
            // widget = false;

            // notifyEvent({
            //     type: 'dp.hide',
            //     date: this.value.clone()
            // });

            this.inputElements.view.blur();

            // return picker;
        },
        clear: function () {
            this.setValue(null);
            this.viewValue= getMoment(this.settings.format);
        },

        /********************************************************************************
         *
         * Widget UI interaction functions
         *
         ********************************************************************************/        

        doAction: function (e) {
            var jqTarget= $(e.currentTarget);
            if (jqTarget.is('.disabled')) {
                return false;
            }
            var action= jqTarget.data('action');
            this.observers[action].apply(this, arguments);
            return false;
        },

        show: function () {
            if(this.inputElements.original.prop('disabled')){
                return;
            }
            // ///<summary>Shows the widget. Possibly will emit dp.show and dp.change</summary>
            // var currentMoment,
            //     useCurrentGranularity = {
            //         'year': function (m) {
            //             return m.month(0).date(1).hours(0).seconds(0).minutes(0);
            //         },
            //         'month': function (m) {
            //             return m.date(1).hours(0).seconds(0).minutes(0);
            //         },
            //         'day': function (m) {
            //             return m.hours(0).seconds(0).minutes(0);
            //         },
            //         'hour': function (m) {
            //             return m.seconds(0).minutes(0);
            //         },
            //         'minute': function (m) {
            //             return m.seconds(0);
            //         }
            //     };

            // if (input.prop('disabled') || (!this.settings.ignoreReadonly && input.prop('readonly')) || widget) {
            //     return picker;
            // }
            // if (input.val() !== undefined && input.val().trim().length !== 0) {
            //     setValue(this.parseInputDate(input.val().trim()));
            // // } else if (this.settings.useCurrent && unset && ((input.is('input') && input.val().trim().length === 0) || this.settings.inline)) {
            // } else if (this.settings.useCurrent && ((input.is('input') && input.val().trim().length === 0) || this.settings.inline)) {
            //     currentMoment = getMoment();
            //     if (typeof this.settings.useCurrent === 'string') {
            //         currentMoment = useCurrentGranularity[this.settings.useCurrent](currentMoment);
            //     }
            //     setValue(currentMoment);
            // }

            // widget = getTemplate();

            // fillDow();
            // fillMonths();

            // widget.find('.timepicker-hours').hide();
            // widget.find('.timepicker-minutes').hide();
            // widget.find('.timepicker-seconds').hide();

            // update();
            

            
            // if (component && component.hasClass('btn')) {
            //     component.toggleClass('active');
            // }
            // widget.show();
            this.showMode();
            this.place();
            this.container.show();

            // if (this.settings.focusOnShow && !input.is(':focus')) {
            //     input.focus();
            // }

            // notifyEvent({
            //     type: 'dp.show'
            // });
            // return picker;
        },

        toggle: function () {
            /// <summary>Shows or hides the widget</summary>
            return (widget ? hide() : show());
        },
        keydown: function (e) {
            var handler = null,
                index,
                index2,
                pressedKeys = [],
                pressedModifiers = {},
                currentKey = e.which,
                keyBindKeys,
                allModifiersPressed,
                pressed = 'p';

            keyState[currentKey] = pressed;

            for (index in keyState) {
                if (keyState.hasOwnProperty(index) && keyState[index] === pressed) {
                    pressedKeys.push(index);
                    if (parseInt(index, 10) !== currentKey) {
                        pressedModifiers[index] = true;
                    }
                }
            }

            for (index in this.settings.keyBinds) {
                if (this.settings.keyBinds.hasOwnProperty(index) && typeof (this.settings.keyBinds[index]) === 'function') {
                    keyBindKeys = index.split(' ');
                    if (keyBindKeys.length === pressedKeys.length && keyMap[currentKey] === keyBindKeys[keyBindKeys.length - 1]) {
                        allModifiersPressed = true;
                        for (index2 = keyBindKeys.length - 2; index2 >= 0; index2--) {
                            if (!(keyMap[keyBindKeys[index2]] in pressedModifiers)) {
                                allModifiersPressed = false;
                                break;
                            }
                        }
                        if (allModifiersPressed) {
                            handler = this.settings.keyBinds[index];
                            break;
                        }
                    }
                }
            }

            if (handler) {
                handler.call(picker, widget);
                e.stopPropagation();
                e.preventDefault();
            }
        },
        keyup: function (e) {
            keyState[e.which] = 'r';
            e.stopPropagation();
            e.preventDefault();
        },
        change: function (e) {
            var val = $(e.target).val().trim(),
                parsedDate = val ? this.parseInputDate(val) : null;
            setValue(parsedDate);
            e.stopImmediatePropagation();
            return false;
        },
        indexGivenDates: function (givenDatesArray) {
            // Store given enabledDates and disabledDates as keys.
            // This way we can check their existence in O(1) time instead of looping through whole array.
            // (for example: options.enabledDates['2014-02-27'] === true)
            var givenDatesIndexed = {};
            $.each(givenDatesArray, function () {
                var dDate = this.parseInputDate(this);
                if (dDate.isValid()) {
                    givenDatesIndexed[dDate.format('YYYY-MM-DD')] = true;
                }
            });
            return (Object.keys(givenDatesIndexed).length) ? givenDatesIndexed : false;
        },
        indexGivenHours: function (givenHoursArray) {
            // Store given enabledHours and disabledHours as keys.
            // This way we can check their existence in O(1) time instead of looping through whole array.
            // (for example: options.enabledHours['2014-02-27'] === true)
            var givenHoursIndexed = {};
            $.each(givenHoursArray, function () {
                givenHoursIndexed[this] = true;
            });
            return (Object.keys(givenHoursIndexed).length) ? givenHoursIndexed : false;
        },

        // API
        refresh: function(){
            this.refreshDate();
            this.refreshTime();
        },
        refreshDate: function(){
            if (!hasDate(this.settings.format)) {
                return;
            }

            this.refreshDecades();
            this.refreshYears();
            this.refreshMonths();
            this.refreshDays();
        },
        refreshDecades: function(){
            var decadesViewHeader = this.elements.decades.find('th');
            var startDecade = moment({y: this.viewValue.year() - (this.viewValue.year() % 100) - 1});
            var startedAt = startDecade.clone();
            var endDecade = startDecade.clone().add(100, 'y');

            this.elements.decades.find('.disabled').removeClass('disabled');

            if (startDecade.isSame(moment({y: 1900})) || (this.settings.minDate && this.settings.minDate.isAfter(startDecade, 'y'))) {
                decadesViewHeader.eq(0).addClass('disabled');
            }
            decadesViewHeader.eq(1).text(startDecade.year() + '-' + endDecade.year());
            if (startDecade.isSame(moment({y: 2000})) || (this.settings.maxDate && this.settings.maxDate.isBefore(endDecade, 'y'))) {
                decadesViewHeader.eq(2).addClass('disabled');
            }

            var htmlTemplate = '';
            while (!startDecade.isAfter(endDecade, 'y')) {
                htmlTemplate += ''+
                    '<span '+
                    '   data-action="selectDecade" '+
                    '   class="decade' + (startDecade.isSame(this.value, 'y') ? ' active' : '') + (!isValid(this.settings,startDecade, 'y') ? ' disabled' : '') + '" '+
                    '   data-selection="' + (startDecade.year() + 6) + '">' + 
                    (startDecade.year() + 1) + ' - ' + (startDecade.year() + 12) + 
                    '</span>';
                startDecade.add(12, 'y');
            }
            htmlTemplate += '<span></span><span></span><span></span>'; //push the dangling block over, at least this way it's even

            this.elements.decades.find('td').html(htmlTemplate);
            decadesViewHeader.eq(1).text((startedAt.year() + 1) + '-' + (startDecade.year()));
        },
        refreshYears: function(){
            var yearsViewHeader = this.elements.years.find('th');
            var startYear = this.viewValue.clone().subtract(5, 'y');
            var endYear = this.viewValue.clone().add(6, 'y');            

            this.elements.years.find('.disabled').removeClass('disabled');

            if (this.settings.minDate && this.settings.minDate.isAfter(startYear, 'y')) {
                yearsViewHeader.eq(0).addClass('disabled');
            }
            yearsViewHeader.eq(1).text(startYear.year() + '-' + endYear.year());
            if (this.settings.maxDate && this.settings.maxDate.isBefore(endYear, 'y')) {
                yearsViewHeader.eq(2).addClass('disabled');
            }

            var htmlTemplate = '';
            while (!startYear.isAfter(endYear, 'y')) {
                htmlTemplate += ''+
                    '<span '+
                    '   data-action="selectYear" '+
                    '   class="year' + (startYear.isSame(this.value, 'y') ? ' active' : '') + (!isValid(this.settings,startYear, 'y') ? ' disabled' : '') + '">' + 
                    startYear.year() + 
                    '</span>';
                startYear.add(1, 'y');
            }

            this.elements.years.find('td').html(htmlTemplate);
        },
        refreshMonths: function(){
            var monthsViewHeader = this.elements.months.find('th');
            var months = this.elements.months.find('tbody').find('span');

            this.elements.months.find('.disabled').removeClass('disabled');

            if (!isValid(this.settings,this.viewValue.clone().subtract(1, 'y'), 'y')) {
                monthsViewHeader.eq(0).addClass('disabled');
            }
            monthsViewHeader.eq(1).text(this.viewValue.year());
            if (!isValid(this.settings,this.viewValue.clone().add(1, 'y'), 'y')) {
                monthsViewHeader.eq(2).addClass('disabled');
            }

            // 当前月
            months.removeClass('active');
            if (this.value.isSame(this.viewValue, 'y')) {
                months.eq(this.value.month()).addClass('active');
            }
            var context= this;
            months.each(function (index) {
                if (!isValid(context.settings,context.viewValue.clone().month(index), 'M')) {
                    $(this).addClass('disabled');
                }
            });
        },
        refreshDays: function(){
            var daysViewHeader = this.elements.days.find('th');
            this.elements.days.find('.disabled').removeClass('disabled');
            if (!isValid(this.settings,this.viewValue.clone().subtract(1, 'M'), 'M')) {
                daysViewHeader.eq(0).addClass('disabled');
            }
            daysViewHeader.eq(1).text(this.viewValue.format(this.settings.dayViewHeaderFormat));
            if (!isValid(this.settings,this.viewValue.clone().add(1, 'M'), 'M')) {
                daysViewHeader.eq(2).addClass('disabled');
            }

            // 本月第一个星期的第一天
            var currentDate = this.viewValue.clone().startOf('M').startOf('w').startOf('d');
            var htmlTemplate= '';
            for (var i = 0; i < 42; i++) { //always display 42 days (should show 6 weeks)

                var clsName = '';
                if (currentDate.isBefore(this.viewValue, 'M')) {
                    clsName += ' old';
                }
                if (currentDate.isAfter(this.viewValue, 'M')) {
                    clsName += ' new';
                }
                if (currentDate.isSame(this.value, 'd')) {
                    clsName += ' active';
                }
                if (!isValid(this.settings,currentDate, 'd')) {
                    clsName += ' disabled';
                }
                if (currentDate.isSame(getMoment(), 'd')) {
                    clsName += ' today';
                }
                if (currentDate.day() === 0 || currentDate.day() === 6) {
                    clsName += ' weekend';
                }

                htmlTemplate += ''+
                    (currentDate.weekday() === 0 ? 
                    '<tr>' : '')+
                    (this.settings.calendarWeeks ?
                    '   <td class="cw">'+currentDate.week()+'</td>' : '')+
                    '   <td '+
                    '       data-action="selectDay" '+
                    '       data-day="' + currentDate.format('L') + '" '+
                    '       class="day' + clsName + '">' + 
                    currentDate.date() + 
                    '   </td>'+
                    (currentDate.weekday() === 6 ? 
                    '</tr>' : '');

                currentDate.add(1, 'd');
            }

            this.elements.days.find('tbody').empty().append(htmlTemplate);
        },
        refreshTime: function(){
            if (!hasTime(this.settings.format)) {
                return;
            }

            if (!this.use24Hours) {
                var toggle = this.container.find('.timepicker [data-action=togglePeriod]');
                var newDate = this.value.clone().add((this.value.hours() >= 12) ? -12 : 12, 'h');

                toggle.text(this.value.format('A'));

                if (isValid(this.settings,newDate, 'h')) {
                    toggle.removeClass('disabled');
                } else {
                    toggle.addClass('disabled');
                }
            }

            this.refreshHours();
            this.refreshMinutes();
            this.refreshSeconds();
        },
        refreshHours: function(){
            var currentHour = this.viewValue.clone().startOf('d');
            this.elements.hour.text(currentHour.format(this.use24Hours ? 'HH' : 'hh'));
        },
        refreshMinutes: function(){
            var currentMinute = this.viewValue.clone().startOf('h');
            this.elements.minute.text(currentMinute.format('mm'));
        },
        refreshSeconds: function(){
            var currentSecond = this.viewValue.clone().startOf('m');
            this.elements.second.text(currentSecond.format('ss'));
        },
        setValue: function(value){
            // var oValue= this.parseInputDate(value);
            if(!value || !isValid(this.settings,value)){
                this.inputElements.original.val('');
                this.inputElements.view.val('');
                this.value=null;
            }
            else{
                this.inputElements.original.val(value.format(this.settings.format));
                this.inputElements.view.val(value.format(this.settings.format));
                this.value=value;
            }
        },
        enable: function(){},
        disable: function(){},
        destroy: function(){}
    });

    this.DTPicker = new J.Class({extend: T.UI.BaseControl},{
        defaults: defaults,
        attributeMap: attributeMap,

        settings: {},
        templates: {},

        elements: {},

        // minViewModeNumber: 0,   // 最小视图模式，选到这个模式以后关闭弹出窗口。
        // currentViewMode: 0,
        // use24Hours: true,
        // viewValue: false,

        // widget: false,
        

        // picker: {},
        // date,
        // input,
        // component: false,
        // actualFormat,
        // parseFormats,        
        // datePickerModes: [
        //     {
        //         clsName: 'days',
        //         navFnc: 'M',
        //         navStep: 1
        //     },
        //     {
        //         clsName: 'months',
        //         navFnc: 'y',
        //         navStep: 1
        //     },
        //     {
        //         clsName: 'years',
        //         navFnc: 'y',
        //         navStep: 10
        //     },
        //     {
        //         clsName: 'decades',
        //         navFnc: 'y',
        //         navStep: 100
        //     }
        // ],
        // verticalModes: ['top', 'bottom', 'auto'],
        // horizontalModes: ['left', 'right', 'auto'],
        // toolbarPlacements: ['default', 'top', 'bottom'],
        

        // 构造函数
        init: function(element, options){
            var jqElement=$(element);
            // this.elements.original= $(element);

            // // 防止多次初始化
            // if (this.isInitialized()) { 
            //     return this.getRef(); 
            // }
            // this.initialize(element);

            // $.extend(true, options, dataToOptions());
            // picker.options(options);
            this.initSettings(jqElement, options);
            this.initStates(jqElement);

            this.buildHtml(jqElement);
            this.initElements();
            this.buildObservers();
            this.bindEvents();
            // this.bindEventsInterface();

            // if (!this.settings.inline && !input.is('input')) {
            //     throw new Error('Could not initialize DateTimePicker without an input element');
            // }

            if (this.settings.inline) {
                this.show();
            }
        },
        initStates: function(element){
            // this.value= this.element.val();
            // Set defaults for date here now instead of in var declaration
            
            // this.initFormatting();
            // if (input.is('input') && input.val().trim().length !== 0) {
            //     this.setValue(this.parseInputDate(input.val().trim()));
            // }
            // else if (this.settings.defaultDate && input.attr('placeholder') === undefined) {
            //     this.setValue(this.settings.defaultDate);
            // }
            // this.setValue(this.parseInputDate(this.element.val().trim()));

            // this.setValue(this.parseInputDate(element.val().trim()));

            var value= this.parseInputDate(element.val().trim());
            if(!value || !isValid(this.settings,value)){
                element.val('');
            }
            else{
                element.val(value.format(this.settings.format));
            }
        },
        
        buildHtml: function(element){
            var htmlTemplate = ''+ 
                '<div class="t-dtpicker-container input-group">' + 
                '    <input type="text" class="form-control">' +    //  data-toggle="dropdown"
                '    <div class="input-group-btn">' + 
                '        <button type="button" class="btn btn-default">' +     //  data-toggle="modal" data-target="#myModal">
                '            <span class="glyphicon glyphicon-calendar"></span>' + 
                '        </button>' + 
                '    </div>' + 
                // '    <div class="t-dtpicker-widget-container">'+    //  dropdown-menu
                // '    </div>'+
                '</div>';
                

            var container = $(htmlTemplate);

            this.elements={
                original: element,
                container: container,
                view: $('input[type=text]', container),
                button: $('button', container)//,
                // widgetContainer: $('.t-dtpicker-widget-container', container)//,                
                // getTab: function(levelIndex){
                //     var tabSelector='.t-level-tab-'+levelIndex;
                //     return $(tabSelector, context.container);
                // }
            };

            
            // this.element.after(this.container);
        },
        initElements: function(){
            // var context= this;

            // // initializing element and component attributes
            // if (this.element.is('input')) {
            //     input = element;
            // } else {
            //     input = element.find(this.settings.datepickerInput);
            //     if (input.size() === 0) {
            //         input = element.find('input');
            //     } else if (!input.is('input')) {
            //         throw new Error('CSS class "' + this.settings.datepickerInput + '" cannot be applied to non input element');
            //     }
            // }

            // if (element.hasClass('input-group')) {
            //     // in case there is more then one 'input-group-addon' Issue #48
            //     if (element.find('.datepickerbutton').size() === 0) {
            //         component = element.find('.input-group-addon');
            //     } else {
            //         component = element.find('.datepickerbutton');
            //     }
            // }

            // var elements={
            //     // original: this.element,
            //     view: $('input[type=text]', this.container),
            //     button: $('button', this.container),
            //     widgetContainer: $('.t-dtpicker-widget-container', this.container)//,                
            //     // getTab: function(levelIndex){
            //     //     var tabSelector='.t-level-tab-'+levelIndex;
            //     //     return $(tabSelector, context.container);
            //     // }
            // };
            // this.elements= $.extend(true, {}, this.elements, elements);

            this.elements.original.before(this.elements.container);
            this.elements.original.hide();
            this.elements.view.val(this.elements.original.val());

            if (this.elements.original.prop('disabled')) {
                this.disable();
            }

            this.widget= new Widget(this.elements, this.settings);
        },
        transferAttributes: function(){
            //this.settings.placeholder = this.$source.attr('data-placeholder') || this.settings.placeholder
            //this.$element.attr('placeholder', this.settings.placeholder)
            // this.elements.target.attr('name', this.elements.original.attr('name'))
            // this.elements.target.val(this.elements.original.val())
            // this.elements.original.removeAttr('name')  // Remove from source otherwise form will pass parameter twice.
            this.elements.view.attr('required', this.elements.original.attr('required'))
            this.elements.view.attr('rel', this.elements.original.attr('rel'))
            this.elements.view.attr('title', this.elements.original.attr('title'))
            this.elements.view.attr('class', this.elements.original.attr('class'))
            this.elements.view.attr('tabindex', this.elements.original.attr('tabindex'))
            this.elements.original.removeAttr('tabindex')
            if (this.elements.original.attr('disabled')!==undefined){
               this.disable();
            }
        },
        buildObservers: function(){},
        bindEvents: function(){
            var context= this;
            var element= this.elements.original;

            this.elements.view.on({
                'change': $.proxy(this.change, this),
                // 'blur': this.settings.debug ? '' : hide,
                'blur': $.proxy(this.hide, this),
                'keydown': $.proxy(this.keydown, this),
                'keyup': $.proxy(this.keyup, this),
                // 'focus': this.settings.allowInputToggle ? show : ''
                'focus': $.proxy(this.widget.show, this.widget),
                'click': $.proxy(this.widget.show, this.widget)
            });

            // if (this.elements.original.is('input')) {
            //     input.on({
            //         'focus': show
            //     });
            // } else if (component) {
            //     component.on('click', toggle);
            //     component.on('mousedown', false);
            // }

            // element.on('click', $.proxy(this.onFooClick, this));
        },
        // bindEventsInterface: function(){
        //     var context= this;
        //     var element= this.elements.original;

        //     if(this.settings.onFooSelected){
        //         element.on('click.t.template', $.proxy(this.settings.onFooSelected, this));
        //     }
        // },
        render: function(){},

        // 事件处理
        // onFooClick: function(e, data){
        //     ;
        // },
        
        
        parseInputDate: function (inputDate) {
            if (this.settings.parseInputDate === undefined) {
                if (moment.isMoment(inputDate) || inputDate instanceof Date) {
                    inputDate = moment(inputDate);
                } else {
                    inputDate = getMoment(this.settings.format, inputDate);
                }
            } else {
                inputDate = this.settings.parseInputDate(inputDate);
            }
            // inputDate.locale(this.settings.locale);
            return inputDate;
        },
        
        // API
        getValue: function(){
            var sValue= this.elements.original.val();
            var oValue= this.parseInputDate(sValue);
            return oValue;
        },
        setValue: function(value){
            // var oValue= this.parseInputDate(value);
            if(!value || !isValid(this.settings,value)){
                this.elements.original.val('');
            }
            else{
                this.elements.original.val(value.format(this.settings.format));
            }
        },
        refresh: function(){},
        enable: function(){
            this.elements.original.prop('disabled', false);
            this.elements.button.removeClass('disabled');
        },
        disable: function(){
            this.hide();
            this.elements.original.prop('disabled', true);
            this.elements.button.addClass('disabled');
        },
        destroy: function(){
            this.hide();
            this.elements.original.off({
                'change': change,
                'blur': blur,
                'keydown': keydown,
                'keyup': keyup,
                'focus': this.settings.allowInputToggle ? hide : ''
            });

            // if (this.elements.original.is('input')) {
            //     input.off({
            //         'focus': show
            //     });
            // } else if (component) {
            //     component.off('click', toggle);
            //     component.off('mousedown', false);
            // }
            // this.elements.original.removeData('DateTimePicker');
            // this.elements.original.removeData('date');
        }
    });
});


