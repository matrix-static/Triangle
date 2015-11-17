/**
 * Bootstrap Multiselect (https://github.com/davidstutz/bootstrap-multiselect)
 * 
 * Apache License, Version 2.0:
 * Copyright (c) 2012 - 2015 David Stutz
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a
 * copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 * 
 * BSD 3-Clause License:
 * Copyright (c) 2012 - 2015 David Stutz
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    - Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 *    - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 *    - Neither the name of David Stutz nor the names of its contributors may be
 *      used to endorse or promote products derived from this software without
 *      specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
Jx().package("T.UI.Components", function(J){
    // 严格模式
    'use strict';

    var defaults = {
        // 参数
        buttonWidth: 'auto',
        dropRight: false,
        selectedClass: 'active',
        // Maximum height of the dropdown menu.
        // If maximum height is exceeded a scrollbar will be displayed.
        maxHeight: false,
        includeSelectAllOption: false,
        selectAllText: ' Select all',
        selectAllValue: 'multiselect-all',
        selectAllNumber: true,
        enableFiltering: false,
        enableCaseInsensitiveFiltering: false,
        enableClickableOptGroups: false,
        filterPlaceholder: 'Search',
        filterBehavior: 'text',
        includeFilterClearBtn: true,
        preventInputChangeEvent: false,
        placeholder: 'None selected',
        nSelectedText: 'selected',
        allSelectedText: 'All selected',
        numberDisplayed: 3,
        disableIfEmpty: false,
        delimiterText: ', ',

        // 覆写API
        buttonText: function(options, select) {
            if (options.length === 0) {
                return this.placeholder;
            }
            else if (this.allSelectedText 
                        && options.length === $('option', $(select)).length 
                        && $('option', $(select)).length !== 1 
                        && this.multiple) {

                if (this.selectAllNumber) {
                    return this.allSelectedText + ' (' + options.length + ')';
                }
                else {
                    return this.allSelectedText;
                }
            }
            else if (options.length > this.numberDisplayed) {
                return options.length + ' ' + this.nSelectedText;
            }
            else {
                var selected = '';
                var delimiter = this.delimiterText;
                
                options.each(function() {
                    var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();
                    selected += label + delimiter;
                });
                
                return selected.substr(0, selected.length - 2);
            }
        },
        buttonTitle: function(options, select) {
            if (options.length === 0) {
                return this.placeholder;
            }
            else {
                var selected = '';
                var delimiter = this.delimiterText;
                
                options.each(function () {
                    var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();
                    selected += label + delimiter;
                });
                return selected.substr(0, selected.length - 2);
            }
        },        

        // 事件
        onChange : undefined,
        onDropdownShow: undefined,
        onDropdownHide: undefined,
        onDropdownShown: undefined,
        onDropdownHidden: undefined,
        onSelectAll: undefined
    };
    var attributeMap = {
        placeholder: 'placeholder',
        includeSelectAllOption: 'include-select-all-option',
        enableClickableOptGroups: 'enable-clickable-optgroups',
        enableFiltering: 'enable-filtering'
    };

    this.Multiselect = new J.Class({extend : T.UI.BaseControl}, {
        defaults: defaults,
        attributeMap: attributeMap,
        templates: {
            // view: '<button type="button" class="multiselect dropdown-toggle btn btn-default" data-toggle="dropdown"><span class="multiselect-selected-text"></span> <b class="caret"></b></button>',
            // menu: '<ul class="multiselect-container dropdown-menu"></ul>',
            filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
            filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="glyphicon glyphicon-remove-circle"></i></button></span>',
            // li: '<li><a tabindex="0"><label></label></a></li>',
            divider: '<li class="multiselect-item divider"></li>'//,
            // liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>',
            // container: '<div class="btn-group" />'
        },

        init: function(element, options){
            this.element = $(element);

            // 防止多次初始化
            if (this.isInitialized()) { 
                return this.getRef(); 
            }
            this.initialize(element);
            
            //this.container;
            //this.elements;

            // this.value = this.element.val();

            // 初始化选项
            this.initSettings(options);
            // // Placeholder via data attributes
            // if (this.element.attr("data-placeholder")) {
            //     this.settings.placeholder = this.element.data("placeholder");
            // }
            this.settings.multiple = this.element.attr('multiple') === "multiple";

            // Initialization.
            this.query = '';
            this.searchTimeout = null;
            this.lastToggledInput = null

            this.buildHtml();
            this.initElements();
            this.transferAttributes();
            this.bindEvents();
            this.bindEventsInterface();

            this.buildFilter();

            this.updateButtonText();
            this.updateSelectAll();

            if (this.settings.disableIfEmpty && $('option', this.element).length <= 0) {
                this.disable();
            }
            
            


            
            // var href= this.element.attr('href');
            // this.settings.remote= !/#/.test(href) && href;

            // // // 初始化数据
            // // this.getData();

            // // 初始化 html DOM 元素
            // this.initElements();

            // // 创建 树型 菜单对象
            // this.pop=new ModalPop(this.elements, this.settings);

            // this.initialized();
        },
        transferAttributes: function(){
            if(this.settings.inheritClass){
                this.elements.view.attr('class', this.element.attr('class'));
            }
            this.elements.view.attr('tabindex', this.element.attr('tabindex'))
            this.elements.orginal.removeAttr('tabindex')

            // 设置是否disabled
            if (this.element.attr('disabled')!==undefined){
               this.disable();
            }
        },
        buildHtml: function(){
            // build container

            if (typeof this.settings.selectAllValue === 'number') {
                this.settings.selectAllValue = this.settings.selectAllValue.toString();
            }
            
            var menuTemplate='<ul class="multiselect-container dropdown-menu">';

            if (this.settings.includeSelectAllOption 
                    && this.settings.multiple) {
                
                menuTemplate += ''+
                    '<li class="multiselect-item multiselect-all">'+
                    '    <a tabindex="0" class="multiselect-all">'+
                    '       <label class="checkbox"><input type="checkbox" value="'+ this.settings.selectAllValue +'">'+ this.settings.selectAllText +'</label>'+
                    '    </a>'+
                    '</li>';

                menuTemplate += this.templates.divider;
            }

            var arrOptions=this.element.children();
            for(var i=0; i<arrOptions.length; i++){
                var element=arrOptions[i];
                var jqOption=$(element);
                var tag=jqOption.prop('tagName').toLowerCase();

                if (tag === 'optgroup') {
                    menuTemplate += this.createOptgroup(element);
                    continue;
                }
                
                if (tag === 'option') {
                    if (jqOption.data('role') === 'divider') {
                        this.createDivider();
                        menuTemplate += this.templates.divider;
                    }
                    else {
                        menuTemplate += this.createOptionValue(element);
                    }
                }
            }
            menuTemplate+='</ul>';

            var htmlTemplate = ''+ 
                '<div class="t-multiselect-container btn-group">'+ 
                '    <button type="button" class="multiselect dropdown-toggle btn btn-default" data-toggle="dropdown">'+ 
                '       <span class="multiselect-selected-text"></span><b class="caret"></b>'+ 
                '    </button>'+
                menuTemplate +
                '</div>';

            this.container = $(htmlTemplate);

            this.element.before(this.container);
        },
        initElements: function(){
            this.elements = {
                orginal: this.element,
                view: $('button', this.container),
                menu: $('ul', this.container),
                groups: $('li.multiselect-group', this.container),
                inputs: $('li input', this.container),
                links: $('li a', this.container),
                getItemSelectAll:function(){
                    return $('li.multiselect-all', this.container);
                }
            };

            // this.element.hide().after(this.container);
            this.element.hide();

            // button

            if (this.settings.buttonWidth && this.settings.buttonWidth !== 'auto') {
                this.elements.view.css({
                    'width' : this.settings.buttonWidth,
                    'overflow' : 'hidden',
                    'text-overflow' : 'ellipsis'
                });
                this.container.css({
                    'width': this.settings.buttonWidth
                });
            }

            this.elements.view.dropdown();

            // menu

            if (this.settings.dropRight) {
                this.elements.menu.addClass('pull-right');
            }

            if (this.settings.maxHeight) {
                // TODO: Add a class for this option to move the css declarations.
                this.elements.menu.css({
                    'max-height': this.settings.maxHeight + 'px',
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden'
                });
            }
        },
        // 取消事件监听
        unbindEvents: function () {
            this.container.off('show.bs.dropdown');
            this.container.off('hide.bs.dropdown');
            this.container.off('shown.bs.dropdown');
            this.container.off('hidden.bs.dropdown');
        },
        // 监听事件
        bindEvents: function () {
            this.unbindEvents();

            if(this.settings.enableClickableOptGroups && this.settings.multiple) {
                this.elements.groups.on('click', $.proxy(this.onGroupClick, this));
            }

            this.elements.links.on('touchstart click', $.proxy(this.onLinkClick, this));
            this.elements.links.on('mousedown', this.onLinkMousedown);

            // Bind the change event on the dropdown elements.
            this.elements.inputs.on('change', $.proxy(this.onCheck, this));

            // Keyboard support.
            this.container.off('keydown.multiselect');
            this.container.on('keydown.multiselect', $.proxy(this.onKeydown, this));
        },
        bindEventsInterface: function(){
            if (typeof (this.settings.onChange) === 'function') {
                this.container.on('onchange.bs.dropdown', this.settings.onChange);
            }
            if (typeof (this.settings.onDropdownShow) === 'function') {
                this.container.on('show.bs.dropdown', this.settings.onDropdownShow);
            }
            if (typeof (this.settings.onDropdownHide) === 'function') {
                this.container.on('hide.bs.dropdown', this.settings.onDropdownHide);
            }
            if (typeof (this.settings.onDropdownShown) === 'function') {
                this.container.on('shown.bs.dropdown', this.settings.onDropdownShown);
            }
            if (typeof (this.settings.onDropdownHidden) === 'function') {
                this.container.on('hidden.bs.dropdown', this.settings.onDropdownHidden);
            }
            if (typeof (this.settings.onSelectAll) === 'function') {
                this.container.on('selectall.bs.dropdown', this.settings.onSelectAll);
            }
        },

        onGroupClick: function(event) {
            event.stopPropagation();

            var group = $(event.target).parent();

            // Search all option in optgroup
            var $settings = group.nextUntil('li.multiselect-group');
            var $visibleOptions = $settings.filter(":visible:not(.disabled)");

            // check or uncheck items
            var allChecked = true;
            var optionInputs = $visibleOptions.find('input');
            optionInputs.each(function() {
                allChecked = allChecked && $(this).prop('checked');
            });

            optionInputs.prop('checked', !allChecked).trigger('change');
        },
        onCheck: function(event) {
            event.stopPropagation();

            var $target = $(event.target);

            var checked = $target.prop('checked') || false;
            var isSelectAllOption = $target.val() === this.settings.selectAllValue;

            // Apply or unapply the configured selected class.
            if (this.settings.selectedClass) {
                if (checked) {
                    $target.closest('li').addClass(this.settings.selectedClass);
                }
                else {
                    $target.closest('li').removeClass(this.settings.selectedClass);
                }
            }

            // Get the corresponding option.
            var value = $target.val();
            var $option = this.getOptionByValue(value);

            var $optionsNotThis = $('option', this.element).not($option);
            var $checkboxesNotThis = $('input', this.container).not($target);

            if (isSelectAllOption) {
                if (checked) {
                    this.selectAll();
                }
                else {
                    this.deselectAll();
                }
            }
            else {
                if (checked) {
                    $option.prop('selected', true);

                    if (this.settings.multiple) {
                        // Simply select additional option.
                        $option.prop('selected', true);
                    }
                    else {
                        // Unselect all other options and corresponding checkboxes.
                        if (this.settings.selectedClass) {
                            $($checkboxesNotThis).closest('li').removeClass(this.settings.selectedClass);
                        }

                        $($checkboxesNotThis).prop('checked', false);
                        $optionsNotThis.prop('selected', false);

                        // It's a single selection, so close.
                        this.elements.view.click();
                    }

                    if (this.settings.selectedClass === "active") {
                        $optionsNotThis.closest("a").css("outline", "");
                    }
                }
                else {
                    // Unselect option.
                    $option.prop('selected', false);
                }
            }

            this.element.change();

            this.updateButtonText();
            this.updateSelectAll();

            // this.settings.onChange($option, checked);
            this.container.trigger('onchange', {option: $option, checked: checked});

            if(this.settings.preventInputChangeEvent) {
                return false;
            }
        },
        onLinkClick: function(event) {
            event.stopPropagation();

            var $target = $(event.target);
            
            if (event.shiftKey && this.settings.multiple) {
                if($target.is("label")){ // Handles checkbox selection manually (see https://github.com/davidstutz/bootstrap-multiselect/issues/431)
                    event.preventDefault();
                    $target = $target.find("input");
                    $target.prop("checked", !$target.prop("checked"));
                }
                var checked = $target.prop('checked') || false;

                if (this.lastToggledInput !== null && this.lastToggledInput !== $target) { // Make sure we actually have a range
                    var from = $target.closest("li").index();
                    var to = this.lastToggledInput.closest("li").index();
                    
                    if (from > to) { // Swap the indices
                        var tmp = to;
                        to = from;
                        from = tmp;
                    }
                    
                    // Make sure we grab all elements since slice excludes the last index
                    ++to;
                    
                    // Change the checkboxes and underlying options
                    var range = this.elements.menu.find("li").slice(from, to).find("input");
                    
                    range.prop('checked', checked);
                    
                    if (this.settings.selectedClass) {
                        range.closest('li')
                            .toggleClass(this.settings.selectedClass, checked);
                    }
                    
                    for (var i = 0, j = range.length; i < j; i++) {
                        var $checkbox = $(range[i]);

                        var $option = this.getOptionByValue($checkbox.val());

                        $option.prop('selected', checked);
                    }                   
                }
                
                // Trigger the select "change" event
                $target.trigger("change");
            }
            
            // Remembers last clicked option
            if($target.is("input") && !$target.closest("li").is(".multiselect-item")){
                this.lastToggledInput = $target;
            }

            $target.blur();
        },
        onLinkMousedown: function(e) {
            if (e.shiftKey) {
                // Prevent selecting text by Shift+click
                return false;
            }
        },
        onKeydown:function(event) {
            if ($('input[type="text"]', this.container).is(':focus')) {
                return;
            }

            if (event.keyCode === 9 && this.container.hasClass('open')) {
                this.elements.view.click();
            }
            else {
                var $items = $(this.container).find("li:not(.divider):not(.disabled) a").filter(":visible");

                if (!$items.length) {
                    return;
                }

                var index = $items.index($items.filter(':focus'));

                // Navigation up.
                if (event.keyCode === 38 && index > 0) {
                    index--;
                }
                // Navigate down.
                else if (event.keyCode === 40 && index < $items.length - 1) {
                    index++;
                }
                else if (!~index) {
                    index = 0;
                }

                var $current = $items.eq(index);
                $current.focus();

                if (event.keyCode === 32 || event.keyCode === 13) {
                    var $checkbox = $current.find('input');

                    $checkbox.prop("checked", !$checkbox.prop("checked"));
                    $checkbox.change();
                }

                event.stopPropagation();
                event.preventDefault();
            }
        },

        createOptionValue: function(element) {

            var $element = $(element);
            if ($element.is(':selected')) {
                $element.prop('selected', true);
            }

            // Support the label attribute on options.
            //var label = this.settings.optionLabel(element);
            var label = $element.attr('label') || $element.text();
            var labelTitle = $element.attr('title') || '';
            var value = $element.val();
            var inputType = this.settings.multiple ? "checkbox" : "radio";
            var selected = $element.prop('selected') || false;
            var isDisabled = $element.is(':disabled');

            var htmlItemClass='';
            var htmlLinkClass='';
            if (selected && this.settings.selectedClass) {
                htmlItemClass=+this.settings.selectedClass;
            }
            if(isDisabled){
                htmlItemClass += ' disabled';
            }
            if (value === this.settings.selectAllValue) {
                htmlItemClass += ' multiselect-item multiselect-all';
                htmlLinkClass = ' class="'+multiselect-all + '"';
            }

            
            // '<li class="active"><a tabindex="0"><label class="checkbox"><input type="checkbox" value="1-2"> Option 1.2</label></a></li>'
            var htmlItem = ''+
                '<li class="'+htmlItemClass+'" '+(isDisabled ? 'tabindex="-1"' : '')+'>'+
                '   <a tabindex="0"'+(isDisabled ? ' tabindex="-1"' : '')+htmlLinkClass+'>'+
                '       <label class="'+inputType+'" title="'+labelTitle+'">'+
                '       <input '+
                '           type="'+inputType+'" '+
                // (this.settings.checkboxName ? 'name="'+this.settings.checkboxName+'"' : '')+
                '           value="'+value+'" '+
                (selected ? 'checked="checked"' : '')+
                (isDisabled ? 'disabled="disabled"' : '')+
                '" />'+
                label+
                '       </label>'+
                '   </a>'+
                '</li>';            

            return htmlItem;
        },

        createOptgroup: function(group) {
            var groupName = $(group).prop('label');

            var htmlClass='';
            if(this.settings.enableClickableOptGroups){
                htmlClass += ' multiselect-group-clickable'
            }
            if ($(group).is(':disabled')) {
                htmlClass += ' disabled';
            }

            //'<li class="multiselect-item multiselect-group multiselect-group-clickable"><label>Group 2</label></li>'
            var htmlTemplate=''+
                '<li class="multiselect-item multiselect-group'+htmlClass+'"><label>'+groupName+'</label></li>';

            var arrOptions=$('option', group);
            for(var i=0; i<arrOptions.length; i++){
                var element=arrOptions[i];
                htmlTemplate += this.createOptionValue(element);
            }

            return htmlTemplate;
        },

        buildFilter: function() {

            // Build filter if filtering OR case insensitive filtering is enabled and the number of settings exceeds (or equals) enableFilterLength.
            if (!(this.settings.enableFiltering || this.settings.enableCaseInsensitiveFiltering)) {
                return;
            }

            var enableFilterLength = Math.max(this.settings.enableFiltering, this.settings.enableCaseInsensitiveFiltering);

            if (this.element.find('option').length < enableFilterLength) {
                return;
            }

            this.$filter = $(this.templates.filter);
            $('input', this.$filter).attr('placeholder', this.settings.filterPlaceholder);
            
            // Adds optional filter clear button
            if(this.settings.includeFilterClearBtn){
                var clearBtn = $(this.templates.filterClearBtn);
                clearBtn.on('click', $.proxy(function(event){
                    clearTimeout(this.searchTimeout);
                    this.$filter.find('.multiselect-search').val('');
                    $('li', this.elements.menu).show().removeClass("filter-hidden");
                    this.updateSelectAll();
                }, this));
                this.$filter.find('.input-group').append(clearBtn);
            }
            
            this.elements.menu.prepend(this.$filter);

            this.$filter
                .val(this.query)
                .on('click', function(event) {
                    event.stopPropagation();
                })
                .on('input keydown', $.proxy(function(event) {
                // Cancel enter key default behaviour
                if (event.which === 13) {
                  event.preventDefault();
                }
                
                // This is useful to catch "keydown" events after the browser has updated the control.
                clearTimeout(this.searchTimeout);

                this.searchTimeout = this.asyncFunction($.proxy(function() {

                    if (this.query !== event.target.value) {
                        this.query = event.target.value;

                        var currentGroup, currentGroupVisible;
                        $.each($('li', this.elements.menu), $.proxy(function(index, element) {
                            var value = $('input', element).length > 0 ? $('input', element).val() : "";
                            var text = $('label', element).text();

                            var filterCandidate = '';
                            if ((this.settings.filterBehavior === 'text')) {
                                filterCandidate = text;
                            }
                            else if ((this.settings.filterBehavior === 'value')) {
                                filterCandidate = value;
                            }
                            else if (this.settings.filterBehavior === 'both') {
                                filterCandidate = text + '\n' + value;
                            }

                            if (value !== this.settings.selectAllValue && text) {
                                // By default lets assume that element is not
                                // interesting for this search.
                                var showElement = false;

                                if (this.settings.enableCaseInsensitiveFiltering && filterCandidate.toLowerCase().indexOf(this.query.toLowerCase()) > -1) {
                                    showElement = true;
                                }
                                else if (filterCandidate.indexOf(this.query) > -1) {
                                    showElement = true;
                                }

                                // Toggle current element (group or group item) according to showElement boolean.
                                $(element).toggle(showElement).toggleClass('filter-hidden', !showElement);
                                
                                // Differentiate groups and group items.
                                if ($(element).hasClass('multiselect-group')) {
                                    // Remember group status.
                                    currentGroup = element;
                                    currentGroupVisible = showElement;
                                }
                                else {
                                    // Show group name when at least one of its items is visible.
                                    if (showElement) {
                                        $(currentGroup).show().removeClass('filter-hidden');
                                    }
                                    
                                    // Show all group items when group name satisfies filter.
                                    if (!showElement && currentGroupVisible) {
                                        $(element).show().removeClass('filter-hidden');
                                    }
                                }
                            }
                        }, this));
                    }

                    this.updateSelectAll();
                }, this), 300, this);
            }, this));
        },

        destroy: function() {
            this.container.remove();
            this.element.show();
            this.element.data('multiselect', null);
        },

        refresh: function() {
            $('option', this.element).each($.proxy(function(index, element) {
                var $input = $('li input', this.elements.menu).filter(function() {
                    return $(this).val() === $(element).val();
                });

                if ($(element).is(':selected')) {
                    $input.prop('checked', true);

                    if (this.settings.selectedClass) {
                        $input.closest('li')
                            .addClass(this.settings.selectedClass);
                    }
                }
                else {
                    $input.prop('checked', false);

                    if (this.settings.selectedClass) {
                        $input.closest('li')
                            .removeClass(this.settings.selectedClass);
                    }
                }

                if ($(element).is(":disabled")) {
                    $input.attr('disabled', 'disabled')
                        .prop('disabled', true)
                        .closest('li')
                        .addClass('disabled');
                }
                else {
                    $input.prop('disabled', false)
                        .closest('li')
                        .removeClass('disabled');
                }
            }, this));

            this.updateButtonText();
            this.updateSelectAll();
        },
        select: function(selectValues, triggerOnChange) {
            if(!$.isArray(selectValues)) {
                selectValues = [selectValues];
            }

            for (var i = 0; i < selectValues.length; i++) {
                var value = selectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if($option === undefined || $checkbox === undefined) {
                    continue;
                }
                
                if (!this.settings.multiple) {
                    this.deselectAll(false);
                }
                
                if (this.settings.selectedClass) {
                    $checkbox.closest('li')
                        .addClass(this.settings.selectedClass);
                }

                $checkbox.prop('checked', true);
                $option.prop('selected', true);
                
                if (triggerOnChange) {
                    // this.settings.onChange($option, true);
                    this.container.trigger('onchange', {option: $option, checked: true});
                }
            }

            this.updateButtonText();
            this.updateSelectAll();
        },
        clearSelection: function () {
            this.deselectAll(false);
            this.updateButtonText();
            this.updateSelectAll();
        },
        deselect: function(deselectValues, triggerOnChange) {
            if(!$.isArray(deselectValues)) {
                deselectValues = [deselectValues];
            }

            for (var i = 0; i < deselectValues.length; i++) {
                var value = deselectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if($option === undefined || $checkbox === undefined) {
                    continue;
                }

                if (this.settings.selectedClass) {
                    $checkbox.closest('li')
                        .removeClass(this.settings.selectedClass);
                }

                $checkbox.prop('checked', false);
                $option.prop('selected', false);
                
                if (triggerOnChange) {
                    // this.settings.onChange($option, false);
                    this.container.trigger('onchange', {option: $option, checked: false});
                }
            }

            this.updateButtonText();
            this.updateSelectAll();
        },
        selectAll: function (justVisible, triggerOnSelectAll) {
            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            var allCheckboxes = $("li input[type='checkbox']:enabled", this.elements.menu);
            var visibleCheckboxes = allCheckboxes.filter(":visible");
            var allCheckboxesCount = allCheckboxes.length;
            var visibleCheckboxesCount = visibleCheckboxes.length;
            
            if(justVisible) {
                visibleCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.elements.menu).filter(":visible").addClass(this.settings.selectedClass);
            }
            else {
                allCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.elements.menu).addClass(this.settings.selectedClass);
            }
                
            if (allCheckboxesCount === visibleCheckboxesCount || justVisible === false) {
                $("option:enabled", this.element).prop('selected', true);
            }
            else {
                var values = visibleCheckboxes.map(function() {
                    return $(this).val();
                }).get();
                
                $("option:enabled", this.element).filter(function(index) {
                    return $.inArray($(this).val(), values) !== -1;
                }).prop('selected', true);
            }
            
            if (triggerOnSelectAll) {
                // this.settings.onSelectAll();
                this.container.trigger('selectall');
            }
        },
        deselectAll: function (justVisible) {
            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            
            if(justVisible) {              
                var visibleCheckboxes = $("li input[type='checkbox']:not(:disabled)", this.elements.menu).filter(":visible");
                visibleCheckboxes.prop('checked', false);
                
                var values = visibleCheckboxes.map(function() {
                    return $(this).val();
                }).get();
                
                $("option:enabled", this.element).filter(function(index) {
                    return $.inArray($(this).val(), values) !== -1;
                }).prop('selected', false);
                
                if (this.settings.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.elements.menu).filter(":visible").removeClass(this.settings.selectedClass);
                }
            }
            else {
                $("li input[type='checkbox']:enabled", this.elements.menu).prop('checked', false);
                $("option:enabled", this.element).prop('selected', false);
                
                if (this.settings.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.elements.menu).removeClass(this.settings.selectedClass);
                }
            }
        },

        rebuild: function() {
            this.elements.menu.html('');

            // Important to distinguish between radios and checkboxes.
            this.settings.multiple = this.element.attr('multiple') === "multiple";

            this.buildHtml();
            // this.buildSelectAll();
            // this.buildDropdownOptions();
            // this.buildFilter();

            // this.updateButtonText();
            // this.updateSelectAll();
            
            if (this.settings.disableIfEmpty && $('option', this.element).length <= 0) {
                this.disable();
            }
            else {
                this.enable();
            }
            
            if (this.settings.dropRight) {
                this.elements.menu.addClass('pull-right');
            }
        },

        /**
         * The provided data will be used to build the dropdown.
         */
        dataprovider: function(dataprovider) {
            
            var groupCounter = 0;
            var element = this.element.empty();
            
            $.each(dataprovider, function (index, option) {
                var $tag;
                
                if ($.isArray(option.children)) { // create optiongroup tag
                    groupCounter++;
                    
                    $tag = $('<optgroup/>').attr({
                        label: option.label || 'Group ' + groupCounter,
                        disabled: !!option.disabled
                    });
                    
                    for(var i=0; i<option.children.length; i++){
                        subOption=option.children[i];
                        $tag.append($('<option/>').attr({
                            value: subOption.value,
                            label: subOption.label || subOption.value,
                            title: subOption.title,
                            selected: !!subOption.selected,
                            disabled: !!subOption.disabled
                        }));
                    }
                }
                else {
                    $tag = $('<option/>').attr({
                        value: option.value,
                        label: option.label || option.value,
                        title: option.title,
                        selected: !!option.selected,
                        disabled: !!option.disabled
                    });
                }
                
                element.append($tag);
            });
            
            this.rebuild();
        },
        enable: function() {
            this.element.prop('disabled', false);
            this.elements.view.prop('disabled', false)
                .removeClass('disabled');
        },
        disable: function() {
            this.element.prop('disabled', true);
            this.elements.view.prop('disabled', true)
                .addClass('disabled');
        },
        hasSelectAll: function() {
            // return $('li.multiselect-all', this.elements.menu).length > 0;
            return this.elements.getItemSelectAll();
        },
        updateSelectAll: function() {
            if (!this.hasSelectAll()) {
                return;
            }

            var allBoxes = $("li:not(.multiselect-item):not(.filter-hidden) input:enabled", this.elements.menu);
            var allBoxesLength = allBoxes.length;
            var checkedBoxesLength = allBoxes.filter(":checked").length;
            var selectAllLi  = $("li.multiselect-all", this.elements.menu);
            var selectAllInput = selectAllLi.find("input");
            
            if (checkedBoxesLength > 0 && checkedBoxesLength === allBoxesLength) {
                selectAllInput.prop("checked", true);
                selectAllLi.addClass(this.settings.selectedClass);
                // this.settings.onSelectAll();
                this.container.trigger('selectall');
            }
            else {
                selectAllInput.prop("checked", false);
                selectAllLi.removeClass(this.settings.selectedClass);
            }
        },
        updateButtonText: function() {
            var settings = this.getSelected();
            
            // // First update the displayed button text.
            // if (this.settings.enableHTML) {
            //     $('.multiselect .multiselect-selected-text', this.container).html(this.settings.buttonText(settings, this.element));
            // }
            // else {
            //     $('.multiselect .multiselect-selected-text', this.container).text(this.settings.buttonText(settings, this.element));
            // }
            $('.multiselect .multiselect-selected-text', this.container).text(this.settings.buttonText(settings, this.element));
            
            // Now update the title attribute of the button.
            $('.multiselect', this.container).attr('title', this.settings.buttonTitle(settings, this.element));
        },
        getSelected: function() {
            return $('option', this.element).filter(":selected");
        },
        getOptionByValue: function (value) {

            var options = $('option', this.element);
            var valueToCompare = value.toString();

            for (var i = 0; i < options.length; i = i + 1) {
                var option = options[i];
                if (option.value === valueToCompare) {
                    return $(option);
                }
            }
        },
        getInputByValue: function (value) {

            var checkboxes = $('li input', this.elements.menu);
            var valueToCompare = value.toString();

            for (var i = 0; i < checkboxes.length; i = i + 1) {
                var checkbox = checkboxes[i];
                if (checkbox.value === valueToCompare) {
                    return $(checkbox);
                }
            }
        },

        asyncFunction: function(callback, timeout, self) {
            var args = Array.prototype.slice.call(arguments, 3);
            return setTimeout(function() {
                callback.apply(self || window, args);
            }, timeout);
        },

        setAllSelectedText: function(allSelectedText) {
            this.settings.allSelectedText = allSelectedText;
            this.updateButtonText();
        }
    });
});

/* multiselect javascript jQuery */

(function($) {
    // 严格模式
    'use strict';

    // 控件类名
    var pluginName = "multiselect";

        // 胶水代码
    $.fn[pluginName] = function(options) {

        this.each(function () {
            var plugin=new T.UI.Components.Multiselect(this, $.extend(true, {}, options));
        });

        return this;

    };

})(jQuery);