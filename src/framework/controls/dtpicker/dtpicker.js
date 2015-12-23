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
        useStrict: false,
        // sideBySide: false,
        daysOfWeekDisabled: false,
        calendarWeeks: false,
        viewMode: 'days',
        // toolbarPlacement: 'default',
        showTodayButton: false,
        showClear: false,
        showClose: false,
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
        viewDate: false
    };
    var attributeMap = {
        // fooOption: 'foo-option'
        format: 'format'
    };

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

    var Widget=new J.Class({
        defaults: defaults,
        attributeMap: attributeMap,

        settings: {},
        value: '',
        data: {},
        templates: {},

        // 构造函数
        init: function(elements, options){
            this.inputElements = elements;


            // 直接使用容器类实例的设置
            this.settings=options;


            // this.initSettings(options);
            // // this.value= this.element.val();

            this.buildHtml();
            this.initElements();

            // this.bindEvents();
            // this.bindEventsInterface();
        },

        buildHtml: function(){

            var dateView = ''+
                '<div class="datepicker">'+
                '   <div class="datepicker-days">'+
                '       <table class="table-condensed">'+
                '           <thead>'+
                '               <tr>'+
                '                   <th class="prev" data-action="previous"><span class="'+this.settings.icons.previous+'"></span></th>'+
                '                   <th class="picker-switch" data-action="pickerSwitch" colspan="'+(this.settings.calendarWeeks ? '6' : '5')+'"></th>'+
                '                   <th class="prev" data-action="next"><span class="'+this.settings.icons.next+'"></span></th>'+
                '               </tr>'+
                '           </thead>'+
                '           <tbody>'+
                '           </tbody>'+
                '       <table/>'+
                '   </div>'+
                '   <div class="datepicker-months">'+
                '       <table class="table-condensed">'+
                '           <thead>'+
                '               <tr>'+
                '                   <th class="prev" data-action="previous"><span class="'+this.settings.icons.previous+'"></span></th>'+
                '                   <th class="picker-switch" data-action="pickerSwitch" colspan="'+(this.settings.calendarWeeks ? '6' : '5')+'"></th>'+
                '                   <th class="prev" data-action="next"><span class="'+this.settings.icons.next+'"></span></th>'+
                '               </tr>'+
                '           </thead>'+
                '           <tbody>'+
                '               <tr><td colspan="'+(this.settings.calendarWeeks ? '6' : '5')+'"><td/></tr>'+
                '           </tbody>'+
                '       <table/>'+
                '   </div>'+
                '   <div class="datepicker-years">'+
                '       <table class="table-condensed">'+
                '           <thead>'+
                '               <tr>'+
                '                   <th class="prev" data-action="previous"><span class="'+this.settings.icons.previous+'"></span></th>'+
                '                   <th class="picker-switch" data-action="pickerSwitch" colspan="'+(this.settings.calendarWeeks ? '6' : '5')+'"></th>'+
                '                   <th class="prev" data-action="next"><span class="'+this.settings.icons.next+'"></span></th>'+
                '               </tr>'+
                '           </thead>'+
                '           <tbody>'+
                '               <tr><td colspan="'+(this.settings.calendarWeeks ? '6' : '5')+'"><td/></tr>'+
                '           </tbody>'+
                '       <table/>'+
                '   </div>'+
                '   <div class="datepicker-decades">'+
                '       <table class="table-condensed">'+
                '           <thead>'+
                '               <tr>'+
                '                   <th class="prev" data-action="previous"><span class="'+this.settings.icons.previous+'"></span></th>'+
                '                   <th class="picker-switch" data-action="pickerSwitch" colspan="'+(this.settings.calendarWeeks ? '6' : '5')+'"></th>'+
                '                   <th class="prev" data-action="next"><span class="'+this.settings.icons.next+'"></span></th>'+
                '               </tr>'+
                '           </thead>'+
                '           <tbody>'+
                '               <tr><td colspan="'+(this.settings.calendarWeeks ? '6' : '5')+'"><td/></tr>'+
                '           </tbody>'+
                '       <table/>'+
                '   </div>'+
                '</div>';

            var timeView = ''+
                '<div class="timepicker">'+
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
                (!this.use24Hours ? 
                '               <td class="separator"></td>' : '')+
                '           </tr>'+
                '           <tr>'+ 
                (isEnabled(this.settings.format, 'h') ?
                '               <td>'+
                '                   <span class="timepicker-hour" data-action="showHours" data-time-component="hours" title="'+this.settings.tooltips.pickHour+'"></span>'+
                '               </td>' : '')+
                (isEnabled(this.settings.format, 'm') ?
                ((isEnabled(this.settings.format, 'h') ?
                '               <td class="separator"></td>' : '')+
                '               <td>'+
                '                   <span class="timepicker-hour" data-action="showMinutes" data-time-component="minutes" title="'+this.settings.tooltips.pickMinute+'"></span>'+
                '               </td>') : '')+
                (isEnabled(this.settings.format, 's') ?
                ((isEnabled(this.settings.format, 'm') ?
                '               <td class="separator"></td>' : '')+
                '               <td>'+
                '                   <span class="timepicker-hour" data-action="showSeconds" data-time-component="seconds" title="'+this.settings.tooltips.pickSecond+'"></span>'+
                '               </td>') : '')+
                '           </tr>'+
                (!this.use24Hours ? 
                '               <td class="separator">'+
                '                   <button class="btn btn-primary" data-action="togglePeriod" tabindex="-1" title="'+this.settings.tooltips.togglePeriod+'"></button>'+
                '               </td>' : '')+
                '           <tr>'+
                (isEnabled(this.settings.format, 'h') ? 
                '               <td class="separator"></td>' : '')+
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
                (!this.use24Hours ? 
                '               <td class="separator"></td>' : '')+
                '           </tr>'+
                '       </table>'+
                '   </div>'+
                (isEnabled(this.settings.format, 'h') ? 
                '   <div class="timepicker-hours">'+
                '       <table class="table-condensed"></table>'+
                '   </div>' : '')+
                (isEnabled(this.settings.format, 'm') ? 
                '   <div class="timepicker-minutes">'+
                '       <table class="table-condensed"></table>'+
                '   </div>' : '')+
                (isEnabled(this.settings.format, 's') ? 
                '   <div class="timepicker-seconds">'+
                '       <table class="table-condensed"></table>'+
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
            // this.inputElements.widgetContainer.append(this.container);
            this.inputElements.view.after(this.container);
        },
        initElements: function(){
            // var context= this;
            this.elements={
                original: this.element//,
                // view: $('input[type=text]', this.container)
                // getTab: function(levelIndex){
                //     var tabSelector='.t-level-tab-'+levelIndex;
                //     return $(tabSelector, context.container);
                // }
            };
        },
        transferAttributes: function(){},
        buildObservers: function(){
            this.observers= {
                next: function () {
                    var navFnc = datePickerModes[this.currentViewMode].navFnc;
                    viewDate.add(datePickerModes[this.currentViewMode].navStep, navFnc);
                    fillDate();
                    viewUpdate(navFnc);
                },
                previous: function () {
                    var navFnc = datePickerModes[this.currentViewMode].navFnc;
                    viewDate.subtract(datePickerModes[this.currentViewMode].navStep, navFnc);
                    fillDate();
                    viewUpdate(navFnc);
                },
                pickerSwitch: function () {
                    showMode(1);
                },
                selectMonth: function (e) {
                    var month = $(e.target).closest('tbody').find('span').index($(e.target));
                    viewDate.month(month);
                    if (this.currentViewMode === this.minViewModeNumber) {
                        setValue(date.clone().year(viewDate.year()).month(viewDate.month()));
                        if (!this.settings.inline) {
                            hide();
                        }
                    } else {
                        showMode(-1);
                        fillDate();
                    }
                    viewUpdate('M');
                },
                selectYear: function (e) {
                    var year = parseInt($(e.target).text(), 10) || 0;
                    viewDate.year(year);
                    if (this.currentViewMode === this.minViewModeNumber) {
                        setValue(date.clone().year(viewDate.year()));
                        if (!this.settings.inline) {
                            hide();
                        }
                    } else {
                        showMode(-1);
                        fillDate();
                    }
                    viewUpdate('YYYY');
                },
                selectDecade: function (e) {
                    var year = parseInt($(e.target).data('selection'), 10) || 0;
                    viewDate.year(year);
                    if (this.currentViewMode === this.minViewModeNumber) {
                        setValue(date.clone().year(viewDate.year()));
                        if (!this.settings.inline) {
                            hide();
                        }
                    } else {
                        showMode(-1);
                        fillDate();
                    }
                    viewUpdate('YYYY');
                },
                selectDay: function (e) {
                    var day = viewDate.clone();
                    if ($(e.target).is('.old')) {
                        day.subtract(1, 'M');
                    }
                    if ($(e.target).is('.new')) {
                        day.add(1, 'M');
                    }
                    setValue(day.date(parseInt($(e.target).text(), 10)));
                    if (!hasTime(this.settings.format) && !this.settings.keepOpen && !this.settings.inline) {
                        hide();
                    }
                },
                incrementHours: function () {
                    var newDate = date.clone().add(1, 'h');
                    if (isValid(newDate, 'h')) {
                        setValue(newDate);
                    }
                },
                incrementMinutes: function () {
                    var newDate = date.clone().add(this.settings.stepping, 'm');
                    if (isValid(newDate, 'm')) {
                        setValue(newDate);
                    }
                },
                incrementSeconds: function () {
                    var newDate = date.clone().add(1, 's');
                    if (isValid(newDate, 's')) {
                        setValue(newDate);
                    }
                },
                decrementHours: function () {
                    var newDate = date.clone().subtract(1, 'h');
                    if (isValid(newDate, 'h')) {
                        setValue(newDate);
                    }
                },
                decrementMinutes: function () {
                    var newDate = date.clone().subtract(this.settings.stepping, 'm');
                    if (isValid(newDate, 'm')) {
                        setValue(newDate);
                    }
                },
                decrementSeconds: function () {
                    var newDate = date.clone().subtract(1, 's');
                    if (isValid(newDate, 's')) {
                        setValue(newDate);
                    }
                },
                togglePeriod: function () {
                    setValue(date.clone().add((date.hours() >= 12) ? -12 : 12, 'h'));
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
                    widget.find('.timepicker > div:not(.timepicker-picker)').hide();
                    widget.find('.timepicker .timepicker-picker').show();
                },
                showHours: function () {
                    widget.find('.timepicker .timepicker-picker').hide();
                    widget.find('.timepicker .timepicker-hours').show();
                },
                showMinutes: function () {
                    widget.find('.timepicker .timepicker-picker').hide();
                    widget.find('.timepicker .timepicker-minutes').show();
                },
                showSeconds: function () {
                    widget.find('.timepicker .timepicker-picker').hide();
                    widget.find('.timepicker .timepicker-seconds').show();
                },
                selectHour: function (e) {
                    var hour = parseInt($(e.target).text(), 10);

                    if (!this.use24Hours) {
                        if (date.hours() >= 12) {
                            if (hour !== 12) {
                                hour += 12;
                            }
                        } else {
                            if (hour === 12) {
                                hour = 0;
                            }
                        }
                    }
                    setValue(date.clone().hours(hour));
                    actions.showPicker.call(picker);
                },
                selectMinute: function (e) {
                    setValue(date.clone().minutes(parseInt($(e.target).text(), 10)));
                    actions.showPicker.call(picker);
                },
                selectSecond: function (e) {
                    setValue(date.clone().seconds(parseInt($(e.target).text(), 10)));
                    actions.showPicker.call(picker);
                },
                clear: function(){
                    this.clear();
                },
                today: function () {
                    var todaysDate = getMoment();
                    if (isValid(todaysDate, 'd')) {
                        setValue(todaysDate);
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
                    var d = this.date() || this.getMoment();
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
                    var d = this.date() || this.getMoment();
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
                    var d = this.date() || this.getMoment();
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
                    var d = this.date() || this.getMoment();
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
                    var d = this.date() || this.getMoment();
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().subtract(1, 'd'));
                    }
                },
                right: function (widget) {
                    if (!widget) {
                        return;
                    }
                    var d = this.date() || this.getMoment();
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().add(1, 'd'));
                    }
                },
                pageUp: function (widget) {
                    if (!widget) {
                        return;
                    }
                    var d = this.date() || this.getMoment();
                    if (widget.find('.datepicker').is(':visible')) {
                        this.date(d.clone().subtract(1, 'M'));
                    }
                },
                pageDown: function (widget) {
                    if (!widget) {
                        return;
                    }
                    var d = this.date() || this.getMoment();
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
                    this.date(this.getMoment());
                },
                'delete': function () {
                    this.clear();
                }
            };
        },
        bindEvents: function(){
            var context= this;
            var element= this.element;

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
        
        // dataToOptions: function () {
        //     var eData,
        //         dataOptions = {};

        //     if (element.is('input') || this.settings.inline) {
        //         eData = element.data();
        //     } else {
        //         eData = element.find('input').data();
        //     }

        //     if (eData.dateOptions && eData.dateOptions instanceof Object) {
        //         dataOptions = $.extend(true, dataOptions, eData.dateOptions);
        //     }

        //     $.each(this.settings, function (key) {
        //         var attributeName = 'date' + key.charAt(0).toUpperCase() + key.slice(1);
        //         if (eData[attributeName] !== undefined) {
        //             dataOptions[key] = eData[attributeName];
        //         }
        //     });
        //     return dataOptions;
        // },
        place: function () {
            var position = (component || element).position(),
                offset = (component || element).offset(),
                // vertical = this.settings.widgetPositioning.vertical,
                // horizontal = this.settings.widgetPositioning.horizontal,
                parent;

            // if (this.settings.widgetParent) {
            //     parent = this.settings.widgetParent.append(widget);
            // } else if (element.is('input')) {
                parent = element.after(widget).parent();
            // } else if (this.settings.inline) {
            //     parent = element.append(widget);
            //     return;
            // } else {
            //     parent = element;
            //     element.children().first().after(widget);
            // }

            // Top and bottom logic
            // if (vertical === 'auto') {
                if (offset.top + widget.height() * 1.5 >= $(window).height() + $(window).scrollTop() &&
                    widget.height() + element.outerHeight() < offset.top) {
                    vertical = 'top';
                } else {
                    vertical = 'bottom';
                }
            // }

            // // Left and right logic
            // if (horizontal === 'auto') {
                if (parent.width() < offset.left + widget.outerWidth() / 2 &&
                    offset.left + widget.outerWidth() > $(window).width()) {
                    horizontal = 'right';
                } else {
                    horizontal = 'left';
                }
            // }

            if (vertical === 'top') {
                widget.addClass('top').removeClass('bottom');
            } else {
                widget.addClass('bottom').removeClass('top');
            }

            if (horizontal === 'right') {
                widget.addClass('pull-right');
            } else {
                widget.removeClass('pull-right');
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

            widget.css({
                top: vertical === 'top' ? 'auto' : position.top + element.outerHeight(),
                bottom: vertical === 'top' ? position.top + element.outerHeight() : 'auto',
                left: horizontal === 'left' ? (parent === element ? 0 : position.left) : 'auto',
                right: horizontal === 'left' ? 'auto' : parent.outerWidth() - element.outerWidth() - (parent === element ? 0 : position.left)
            });
        },
        notifyEvent: function (e) {
            if (e.type === 'dp.change' && ((e.date && e.date.isSame(e.oldDate)) || (!e.date && !e.oldDate))) {
                return;
            }
            element.trigger(e);
        },
        viewUpdate: function (e) {
            if (e === 'y') {
                e = 'YYYY';
            }
            notifyEvent({
                type: 'dp.update',
                change: e,
                viewDate: viewDate.clone()
            });
        },
        // dir 方向 加一或减一
        showMode: function (dir) {
            if (dir) {
                this.currentViewMode = Math.max(this.minViewModeNumber, Math.min(3, this.currentViewMode + dir));
            }
            widget.find('.datepicker > div').hide().filter('.datepicker-' + datePickerModes[this.currentViewMode].clsName).show();
        },
        fillDow: function () {
            var row = $('<tr>'),
                currentDate = viewDate.clone().startOf('w').startOf('d');

            if (this.settings.calendarWeeks === true) {
                row.append($('<th>').addClass('cw').text('#'));
            }

            while (currentDate.isBefore(viewDate.clone().endOf('w'))) {
                row.append($('<th>').addClass('dow').text(currentDate.format('dd')));
                currentDate.add(1, 'd');
            }
            widget.find('.datepicker-days thead').append(row);
        },
        isInDisabledDates: function (testDate) {
            return this.settings.disabledDates[testDate.format('YYYY-MM-DD')] === true;
        },
        isInEnabledDates: function (testDate) {
            return this.settings.enabledDates[testDate.format('YYYY-MM-DD')] === true;
        },
        isInDisabledHours: function (testDate) {
            return this.settings.disabledHours[testDate.format('H')] === true;
        },
        isInEnabledHours: function (testDate) {
            return this.settings.enabledHours[testDate.format('H')] === true;
        },
        
        fillMonths: function () {
            var spans = [],
                monthsShort = viewDate.clone().startOf('y').startOf('d');
            while (monthsShort.isSame(viewDate, 'y')) {
                spans.push($('<span>').attr('data-action', 'selectMonth').addClass('month').text(monthsShort.format('MMM')));
                monthsShort.add(1, 'M');
            }
            widget.find('.datepicker-months td').empty().append(spans);
        },
        updateMonths: function () {
            var monthsView = widget.find('.datepicker-months'),
                monthsViewHeader = monthsView.find('th'),
                months = monthsView.find('tbody').find('span');

            monthsViewHeader.eq(0).find('span').attr('title', this.settings.tooltips.prevYear);
            monthsViewHeader.eq(1).attr('title', this.settings.tooltips.selectYear);
            monthsViewHeader.eq(2).find('span').attr('title', this.settings.tooltips.nextYear);

            monthsView.find('.disabled').removeClass('disabled');

            if (!isValid(viewDate.clone().subtract(1, 'y'), 'y')) {
                monthsViewHeader.eq(0).addClass('disabled');
            }

            monthsViewHeader.eq(1).text(viewDate.year());

            if (!isValid(viewDate.clone().add(1, 'y'), 'y')) {
                monthsViewHeader.eq(2).addClass('disabled');
            }

            months.removeClass('active');
            // if (date.isSame(viewDate, 'y') && !unset) {
            if (date.isSame(viewDate, 'y')) {
                months.eq(date.month()).addClass('active');
            }

            months.each(function (index) {
                if (!isValid(viewDate.clone().month(index), 'M')) {
                    $(this).addClass('disabled');
                }
            });
        },
        updateYears: function () {
            var yearsView = widget.find('.datepicker-years'),
                yearsViewHeader = yearsView.find('th'),
                startYear = viewDate.clone().subtract(5, 'y'),
                endYear = viewDate.clone().add(6, 'y'),
                html = '';

            yearsViewHeader.eq(0).find('span').attr('title', this.settings.tooltips.prevDecade);
            yearsViewHeader.eq(1).attr('title', this.settings.tooltips.selectDecade);
            yearsViewHeader.eq(2).find('span').attr('title', this.settings.tooltips.nextDecade);

            yearsView.find('.disabled').removeClass('disabled');

            if (this.settings.minDate && this.settings.minDate.isAfter(startYear, 'y')) {
                yearsViewHeader.eq(0).addClass('disabled');
            }

            yearsViewHeader.eq(1).text(startYear.year() + '-' + endYear.year());

            if (this.settings.maxDate && this.settings.maxDate.isBefore(endYear, 'y')) {
                yearsViewHeader.eq(2).addClass('disabled');
            }

            while (!startYear.isAfter(endYear, 'y')) {
                // html += '<span data-action="selectYear" class="year' + (startYear.isSame(date, 'y') && !unset ? ' active' : '') + (!isValid(startYear, 'y') ? ' disabled' : '') + '">' + startYear.year() + '</span>';
                html += '<span data-action="selectYear" class="year' + (startYear.isSame(date, 'y') ? ' active' : '') + (!isValid(startYear, 'y') ? ' disabled' : '') + '">' + startYear.year() + '</span>';
                startYear.add(1, 'y');
            }

            yearsView.find('td').html(html);
        },
        updateDecades: function () {
            var decadesView = widget.find('.datepicker-decades'),
                decadesViewHeader = decadesView.find('th'),
                startDecade = moment({y: viewDate.year() - (viewDate.year() % 100) - 1}),
                endDecade = startDecade.clone().add(100, 'y'),
                startedAt = startDecade.clone(),
                html = '';

            decadesViewHeader.eq(0).find('span').attr('title', this.settings.tooltips.prevCentury);
            decadesViewHeader.eq(2).find('span').attr('title', this.settings.tooltips.nextCentury);

            decadesView.find('.disabled').removeClass('disabled');

            if (startDecade.isSame(moment({y: 1900})) || (this.settings.minDate && this.settings.minDate.isAfter(startDecade, 'y'))) {
                decadesViewHeader.eq(0).addClass('disabled');
            }

            decadesViewHeader.eq(1).text(startDecade.year() + '-' + endDecade.year());

            if (startDecade.isSame(moment({y: 2000})) || (this.settings.maxDate && this.settings.maxDate.isBefore(endDecade, 'y'))) {
                decadesViewHeader.eq(2).addClass('disabled');
            }

            while (!startDecade.isAfter(endDecade, 'y')) {
                html += '<span data-action="selectDecade" class="decade' + (startDecade.isSame(date, 'y') ? ' active' : '') +
                    (!isValid(startDecade, 'y') ? ' disabled' : '') + '" data-selection="' + (startDecade.year() + 6) + '">' + (startDecade.year() + 1) + ' - ' + (startDecade.year() + 12) + '</span>';
                startDecade.add(12, 'y');
            }
            html += '<span></span><span></span><span></span>'; //push the dangling block over, at least this way it's even

            decadesView.find('td').html(html);
            decadesViewHeader.eq(1).text((startedAt.year() + 1) + '-' + (startDecade.year()));
        },
        fillDate: function () {
            var daysView = widget.find('.datepicker-days'),
                daysViewHeader = daysView.find('th'),
                currentDate,
                html = [],
                row,
                clsName,
                i;

            if (!hasDate(this.settings.format)) {
                return;
            }

            daysViewHeader.eq(0).find('span').attr('title', this.settings.tooltips.prevMonth);
            daysViewHeader.eq(1).attr('title', this.settings.tooltips.selectMonth);
            daysViewHeader.eq(2).find('span').attr('title', this.settings.tooltips.nextMonth);

            daysView.find('.disabled').removeClass('disabled');
            daysViewHeader.eq(1).text(viewDate.format(this.settings.dayViewHeaderFormat));

            if (!isValid(viewDate.clone().subtract(1, 'M'), 'M')) {
                daysViewHeader.eq(0).addClass('disabled');
            }
            if (!isValid(viewDate.clone().add(1, 'M'), 'M')) {
                daysViewHeader.eq(2).addClass('disabled');
            }

            currentDate = viewDate.clone().startOf('M').startOf('w').startOf('d');

            for (i = 0; i < 42; i++) { //always display 42 days (should show 6 weeks)
                if (currentDate.weekday() === 0) {
                    row = $('<tr>');
                    if (this.settings.calendarWeeks) {
                        row.append('<td class="cw">' + currentDate.week() + '</td>');
                    }
                    html.push(row);
                }
                clsName = '';
                if (currentDate.isBefore(viewDate, 'M')) {
                    clsName += ' old';
                }
                if (currentDate.isAfter(viewDate, 'M')) {
                    clsName += ' new';
                }
                // if (currentDate.isSame(date, 'd') && !unset) {
                if (currentDate.isSame(date, 'd')) {
                    clsName += ' active';
                }
                if (!isValid(currentDate, 'd')) {
                    clsName += ' disabled';
                }
                if (currentDate.isSame(getMoment(), 'd')) {
                    clsName += ' today';
                }
                if (currentDate.day() === 0 || currentDate.day() === 6) {
                    clsName += ' weekend';
                }
                row.append('<td data-action="selectDay" data-day="' + currentDate.format('L') + '" class="day' + clsName + '">' + currentDate.date() + '</td>');
                currentDate.add(1, 'd');
            }

            daysView.find('tbody').empty().append(html);

            updateMonths();

            updateYears();

            updateDecades();
        },
        fillHours: function () {
            var table = widget.find('.timepicker-hours table'),
                currentHour = viewDate.clone().startOf('d'),
                html = [],
                row = $('<tr>');

            if (viewDate.hour() > 11 && !this.use24Hours) {
                currentHour.hour(12);
            }
            while (currentHour.isSame(viewDate, 'd') && (this.use24Hours || (viewDate.hour() < 12 && currentHour.hour() < 12) || viewDate.hour() > 11)) {
                if (currentHour.hour() % 4 === 0) {
                    row = $('<tr>');
                    html.push(row);
                }
                row.append('<td data-action="selectHour" class="hour' + (!isValid(currentHour, 'h') ? ' disabled' : '') + '">' + currentHour.format(this.use24Hours ? 'HH' : 'hh') + '</td>');
                currentHour.add(1, 'h');
            }
            table.empty().append(html);
        },
        fillMinutes: function () {
            var table = widget.find('.timepicker-minutes table'),
                currentMinute = viewDate.clone().startOf('h'),
                html = [],
                row = $('<tr>'),
                step = this.settings.stepping === 1 ? 5 : this.settings.stepping;

            while (viewDate.isSame(currentMinute, 'h')) {
                if (currentMinute.minute() % (step * 4) === 0) {
                    row = $('<tr>');
                    html.push(row);
                }
                row.append('<td data-action="selectMinute" class="minute' + (!isValid(currentMinute, 'm') ? ' disabled' : '') + '">' + currentMinute.format('mm') + '</td>');
                currentMinute.add(step, 'm');
            }
            table.empty().append(html);
        },
        fillSeconds: function () {
            var table = widget.find('.timepicker-seconds table'),
                currentSecond = viewDate.clone().startOf('m'),
                html = [],
                row = $('<tr>');

            while (viewDate.isSame(currentSecond, 'm')) {
                if (currentSecond.second() % 20 === 0) {
                    row = $('<tr>');
                    html.push(row);
                }
                row.append('<td data-action="selectSecond" class="second' + (!isValid(currentSecond, 's') ? ' disabled' : '') + '">' + currentSecond.format('ss') + '</td>');
                currentSecond.add(5, 's');
            }

            table.empty().append(html);
        },
        fillTime: function () {
            var toggle, newDate, timeComponents = widget.find('.timepicker span[data-time-component]');

            if (!this.use24Hours) {
                toggle = widget.find('.timepicker [data-action=togglePeriod]');
                newDate = date.clone().add((date.hours() >= 12) ? -12 : 12, 'h');

                toggle.text(date.format('A'));

                if (isValid(newDate, 'h')) {
                    toggle.removeClass('disabled');
                } else {
                    toggle.addClass('disabled');
                }
            }
            timeComponents.filter('[data-time-component=hours]').text(date.format(this.use24Hours ? 'HH' : 'hh'));
            timeComponents.filter('[data-time-component=minutes]').text(date.format('mm'));
            timeComponents.filter('[data-time-component=seconds]').text(date.format('ss'));

            fillHours();
            fillMinutes();
            fillSeconds();
        },
        // update: function () {
        //     if (!widget) {
        //         return;
        //     }
        //     fillDate();
        //     fillTime();
        // },
        // setValue: function (targetMoment) {
        //     var oldDate = unset ? null : date;

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

        //     if (isValid(targetMoment)) {
        //         date = targetMoment;
        //         viewDate = date.clone();
        //         input.val(date.format(this.actualFormat));
        //         element.data('date', date.format(this.actualFormat));
        //         unset = false;
        //         update();
        //         notifyEvent({
        //             type: 'dp.change',
        //             date: date.clone(),
        //             oldDate: oldDate
        //         });
        //     } else {
        //         if (!this.settings.keepInvalid) {
        //             input.val(unset ? '' : date.format(this.actualFormat));
        //         }
        //         notifyEvent({
        //             type: 'dp.error',
        //             date: targetMoment
        //         });
        //     }
        // },
        hide: function () {
            ///<summary>Hides the widget. Possibly will emit dp.hide</summary>
            var transitioning = false;
            if (!widget) {
                return picker;
            }
            // Ignore event if in the middle of a picker transition
            widget.find('.collapse').each(function () {
                var collapseData = $(this).data('collapse');
                if (collapseData && collapseData.transitioning) {
                    transitioning = true;
                    return false;
                }
                return true;
            });
            if (transitioning) {
                return picker;
            }
            if (component && component.hasClass('btn')) {
                component.toggleClass('active');
            }
            widget.hide();

            $(window).off('resize', place);
            widget.off('click', '[data-action]');
            widget.off('mousedown', false);

            widget.remove();
            widget = false;

            notifyEvent({
                type: 'dp.hide',
                date: date.clone()
            });

            this.inputElements.view.blur();

            // return picker;
        },
        clear: function () {
            setValue(null);
        },

        /********************************************************************************
         *
         * Widget UI interaction functions
         *
         ********************************************************************************/        

        doAction: function (e) {
            if ($(e.currentTarget).is('.disabled')) {
                return false;
            }
            actions[$(e.currentTarget).data('action')].apply(picker, arguments);
            return false;
        },

        show: function () {
            ///<summary>Shows the widget. Possibly will emit dp.show and dp.change</summary>
            var currentMoment,
                useCurrentGranularity = {
                    'year': function (m) {
                        return m.month(0).date(1).hours(0).seconds(0).minutes(0);
                    },
                    'month': function (m) {
                        return m.date(1).hours(0).seconds(0).minutes(0);
                    },
                    'day': function (m) {
                        return m.hours(0).seconds(0).minutes(0);
                    },
                    'hour': function (m) {
                        return m.seconds(0).minutes(0);
                    },
                    'minute': function (m) {
                        return m.seconds(0);
                    }
                };

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

            fillDow();
            fillMonths();

            widget.find('.timepicker-hours').hide();
            widget.find('.timepicker-minutes').hide();
            widget.find('.timepicker-seconds').hide();

            // update();
            showMode();

            $(window).on('resize', place);
            widget.on('click', '[data-action]', doAction); // this handles clicks on the widget
            widget.on('mousedown', false);

            if (component && component.hasClass('btn')) {
                component.toggleClass('active');
            }
            widget.show();
            place();

            // if (this.settings.focusOnShow && !input.is(':focus')) {
            //     input.focus();
            // }

            notifyEvent({
                type: 'dp.show'
            });
            return picker;
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

        minViewModeNumber: 0,
        currentViewMode: 0,
        // use24Hours: true,
        // viewDate: false,
        // widget: false,
        

        // picker: {},
        // date,        
        // unset: true,
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
            this.element=$(element);

            // // 防止多次初始化
            // if (this.isInitialized()) { 
            //     return this.getRef(); 
            // }
            // this.initialize(element);

            // $.extend(true, options, dataToOptions());
            // picker.options(options);
            this.initSettings(options);
            this.initStates();

            this.buildHtml();
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
        initStates: function(){
            // this.value= this.element.val();
            // Set defaults for date here now instead of in var declaration
            var now = this.getMoment();
            this.viewDate = now.clone();
            this.initFormatting();
            // if (input.is('input') && input.val().trim().length !== 0) {
            //     this.setValue(this.parseInputDate(input.val().trim()));
            // }
            // else if (this.settings.defaultDate && input.attr('placeholder') === undefined) {
            //     this.setValue(this.settings.defaultDate);
            // }
            this.setValue(this.parseInputDate(this.element.val().trim()));
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

            // if (!unset) {
            //     setValue(date);
            // }
        },
        buildHtml: function(){
            var htmlTemplate = ''+ 
                '<div class="t-dtpicker-container input-group">' + 
                '    <input type="text" class="form-control" data-toggle="dropdown">' + 
                '    <div class="input-group-btn">' + 
                '        <button type="button" class="btn btn-default" data-toggle="dropdown">' +     //  data-toggle="modal" data-target="#myModal">
                '            <span class="glyphicon glyphicon-calendar"></span>' + 
                '        </button>' + 
                '    </div>' + 
                // '    <div class="t-dtpicker-widget-container">'+    //  dropdown-menu
                // '    </div>'+
                '</div>';
                
            this.container = $(htmlTemplate);
            this.element.before(this.container);
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

            this.elements={
                original: this.element,
                view: $('input[type=text]', this.container),
                button: $('button', this.container),
                widgetContainer: $('.t-dtpicker-widget-container', this.container)//,                
                // getTab: function(levelIndex){
                //     var tabSelector='.t-level-tab-'+levelIndex;
                //     return $(tabSelector, context.container);
                // }
            };

            this.elements.original.hide();

            if (this.element.prop('disabled')) {
                this.disable();
            }

            this.widget= new Widget(this.elements, this.settings);
        },
        transferAttributes: function(){
            //this.settings.placeholder = this.$source.attr('data-placeholder') || this.settings.placeholder
            //this.$element.attr('placeholder', this.settings.placeholder)
            // this.elements.target.attr('name', this.element.attr('name'))
            // this.elements.target.val(this.element.val())
            // this.element.removeAttr('name')  // Remove from source otherwise form will pass parameter twice.
            this.elements.view.attr('required', this.element.attr('required'))
            this.elements.view.attr('rel', this.element.attr('rel'))
            this.elements.view.attr('title', this.element.attr('title'))
            this.elements.view.attr('class', this.element.attr('class'))
            this.elements.view.attr('tabindex', this.element.attr('tabindex'))
            this.elements.original.removeAttr('tabindex')
            if (this.element.attr('disabled')!==undefined){
               this.disable();
            }
        },
        buildObservers: function(){},
        bindEvents: function(){
            var context= this;
            var element= this.element;

            this.elements.view.on({
                'change': $.proxy(this.change, this),
                // 'blur': this.settings.debug ? '' : hide,
                'blur': $.proxy(this.hide, this),
                'keydown': $.proxy(this.keydown, this),
                'keyup': $.proxy(this.keyup, this),
                // 'focus': this.settings.allowInputToggle ? show : ''
                'focus': $.proxy(this.show, this),
                'click': $.proxy(this.show, this)
            });

            // if (this.element.is('input')) {
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
        getMoment: function (d) {
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
                returnMoment = moment(d, this.settings.format, this.settings.useStrict);
            }
            return returnMoment;
        },
        
        parseInputDate: function (inputDate) {
            if (this.settings.parseInputDate === undefined) {
                if (moment.isMoment(inputDate) || inputDate instanceof Date) {
                    inputDate = moment(inputDate);
                } else {
                    inputDate = this.getMoment(inputDate);
                }
            } else {
                inputDate = this.settings.parseInputDate(inputDate);
            }
            // inputDate.locale(this.settings.locale);
            return inputDate;
        },
        isValid: function (targetMoment, granularity) {
            if (!targetMoment.isValid()) {
                return false;
            }
            if (this.settings.disabledDates && granularity === 'd' && isInDisabledDates(targetMoment)) {
                return false;
            }
            if (this.settings.enabledDates && granularity === 'd' && !isInEnabledDates(targetMoment)) {
                return false;
            }
            if (this.settings.minDate && targetMoment.isBefore(this.settings.minDate, granularity)) {
                return false;
            }
            if (this.settings.maxDate && targetMoment.isAfter(this.settings.maxDate, granularity)) {
                return false;
            }
            if (this.settings.daysOfWeekDisabled && granularity === 'd' && this.settings.daysOfWeekDisabled.indexOf(targetMoment.day()) !== -1) {
                return false;
            }
            if (this.settings.disabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && isInDisabledHours(targetMoment)) {
                return false;
            }
            if (this.settings.enabledHours && (granularity === 'h' || granularity === 'm' || granularity === 's') && !isInEnabledHours(targetMoment)) {
                return false;
            }
            if (this.settings.disabledTimeIntervals && (granularity === 'h' || granularity === 'm' || granularity === 's')) {
                var found = false;
                $.each(this.settings.disabledTimeIntervals, function () {
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
        },
        
        // API
        getValue: function(){
            var sValue= this.element.val();
            var oValue= this.parseInputDate(sValue);
            return oValue;
        },
        setValue: function(value){
            // var oValue= this.parseInputDate(value);
            if(!value || !this.isValid(value)){
                this.element.val('');
            }
            else{
                this.element.val(value.format(this.settings.format));
            }
        },
        refresh: function(){},
        enable: function(){
            // if (component && component.hasClass('btn')) {
            //     component.removeClass('disabled');
            // }
            this.element.prop('disabled', false);
        },
        disable: function(){
            this.hide();
            // if (component && component.hasClass('btn')) {
            //     component.addClass('disabled');
            // }
            this.element.prop('disabled', true);
        },
        destroy: function(){
            this.hide();
            this.element.off({
                'change': change,
                'blur': blur,
                'keydown': keydown,
                'keyup': keyup,
                'focus': this.settings.allowInputToggle ? hide : ''
            });

            // if (this.element.is('input')) {
            //     input.off({
            //         'focus': show
            //     });
            // } else if (component) {
            //     component.off('click', toggle);
            //     component.off('mousedown', false);
            // }
            // this.element.removeData('DateTimePicker');
            // this.element.removeData('date');
        }
    });
});


