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

    function forEach(array, callback) {
        for (var index = 0; index < array.length; ++index) {
            callback(array[index], index);
        }
    }

    var defaults = {
        /**
         * Default text function will either print 'None selected' in case no
         * option is selected or a list of the selected options up to a length
         * of 3 selected options.
         * 
         * @param {jQuery} options
         * @param {jQuery} select
         * @returns {String}
         */
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
        /**
         * Updates the title of the button similar to the buttonText function.
         * 
         * @param {jQuery} options
         * @param {jQuery} select
         * @returns {@exp;selected@call;substr}
         */
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
        /**
         * Create a label.
         *
         * @param {jQuery} element
         * @returns {String}
         */
        optionLabel: function(element){
            return $(element).attr('label') || $(element).text();
        },
        /**
         * Triggered on change of the multiselect.
         * 
         * Not triggered when selecting/deselecting options manually.
         * 
         * @param {jQuery} option
         * @param {Boolean} checked
         */
        onChange : function(option, checked) {

        },
        /**
         * Triggered when the dropdown is shown.
         *
         * @param {jQuery} event
         */
        onDropdownShow: function(event) {

        },
        /**
         * Triggered when the dropdown is hidden.
         *
         * @param {jQuery} event
         */
        onDropdownHide: function(event) {

        },
        /**
         * Triggered after the dropdown is shown.
         * 
         * @param {jQuery} event
         */
        onDropdownShown: function(event) {
            
        },
        /**
         * Triggered after the dropdown is hidden.
         * 
         * @param {jQuery} event
         */
        onDropdownHidden: function(event) {
            
        },
        /**
         * Triggered on select all.
         */
        onSelectAll: function() {
            
        },
        enableHTML: false,
        buttonClass: 'btn btn-default',
        inheritClass: false,
        buttonWidth: 'auto',
        buttonContainer: '<div class="btn-group" />',
        dropRight: false,
        selectedClass: 'active',
        // Maximum height of the dropdown menu.
        // If maximum height is exceeded a scrollbar will be displayed.
        maxHeight: false,
        checkboxName: false,
        includeSelectAllOption: false,
        includeSelectAllIfMoreThan: 0,
        selectAllText: ' Select all',
        selectAllValue: 'multiselect-all',
        selectAllName: false,
        selectAllNumber: true,
        enableFiltering: false,
        enableCaseInsensitiveFiltering: false,
        enableClickableOptGroups: false,
        filterPlaceholder: 'Search',
        // possible options: 'text', 'value', 'both'
        filterBehavior: 'text',
        includeFilterClearBtn: true,
        preventInputChangeEvent: false,
        placeholder: 'None selected',
        nSelectedText: 'selected',
        allSelectedText: 'All selected',
        numberDisplayed: 3,
        disableIfEmpty: false,
        delimiterText: ', ',
        templates: {
            button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"><span class="multiselect-selected-text"></span> <b class="caret"></b></button>',
            ul: '<ul class="multiselect-container dropdown-menu"></ul>',
            filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
            filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="glyphicon glyphicon-remove-circle"></i></button></span>',
            li: '<li><a tabindex="0"><label></label></a></li>',
            divider: '<li class="multiselect-item divider"></li>',
            liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>'
        }
    };
    var attributeMap = {
        placeholder: 'placeholder',
        enableClickableOptGroups: 'enable-clickable-optgroups'
    };

    this.Multiselect = new J.Class({extend : T.UI.BaseControl}, {
        defaults: defaults,
        attributeMap: attributeMap,

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

            
            this.settings.onChange = $.proxy(this.settings.onChange, this);
            this.settings.onDropdownShow = $.proxy(this.settings.onDropdownShow, this);
            this.settings.onDropdownHide = $.proxy(this.settings.onDropdownHide, this);
            this.settings.onDropdownShown = $.proxy(this.settings.onDropdownShown, this);
            this.settings.onDropdownHidden = $.proxy(this.settings.onDropdownHidden, this);
            
            // Build select all if enabled.
            this.buildContainer();
            this.buildButton();
            this.buildDropdown();
            this.buildSelectAll();
            this.buildDropdownOptions();
            this.buildFilter();

            this.updateButtonText();
            this.updateSelectAll();

            if (this.settings.disableIfEmpty && $('option', this.element).length <= 0) {
                this.disable();
            }
            
            this.element.hide().after(this.$container);


            
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
        /**
         * Builds the container of the multiselect.
         */
        buildContainer: function() {
            this.$container = $(this.settings.buttonContainer);
            this.$container.on('show.bs.dropdown', this.settings.onDropdownShow);
            this.$container.on('hide.bs.dropdown', this.settings.onDropdownHide);
            this.$container.on('shown.bs.dropdown', this.settings.onDropdownShown);
            this.$container.on('hidden.bs.dropdown', this.settings.onDropdownHidden);
        },

        /**
         * Builds the button of the multiselect.
         */
        buildButton: function() {
            this.$button = $(this.settings.templates.button).addClass(this.settings.buttonClass);
            if (this.element.attr('class') && this.settings.inheritClass) {
                this.$button.addClass(this.element.attr('class'));
            }
            // Adopt active state.
            if (this.element.prop('disabled')) {
                this.disable();
            }
            else {
                this.enable();
            }

            // Manually add button width if set.
            if (this.settings.buttonWidth && this.settings.buttonWidth !== 'auto') {
                this.$button.css({
                    'width' : this.settings.buttonWidth,
                    'overflow' : 'hidden',
                    'text-overflow' : 'ellipsis'
                });
                this.$container.css({
                    'width': this.settings.buttonWidth
                });
            }

            // Keep the tab index from the select.
            var tabindex = this.element.attr('tabindex');
            if (tabindex) {
                this.$button.attr('tabindex', tabindex);
            }

            this.$container.prepend(this.$button);
        },

        /**
         * Builds the ul representing the dropdown menu.
         */
        buildDropdown: function() {

            // Build ul.
            this.$ul = $(this.settings.templates.ul);

            if (this.settings.dropRight) {
                this.$ul.addClass('pull-right');
            }

            // Set max height of dropdown menu to activate auto scrollbar.
            if (this.settings.maxHeight) {
                // TODO: Add a class for this option to move the css declarations.
                this.$ul.css({
                    'max-height': this.settings.maxHeight + 'px',
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden'
                });
            }

            this.$container.append(this.$ul);
        },

        /**
         * Build the dropdown options and binds all nessecary events.
         * 
         * Uses createDivider and createOptionValue to create the necessary options.
         */
        buildDropdownOptions: function() {

            this.element.children().each($.proxy(function(index, element) {

                var $element = $(element);
                // Support optgroups and options without a group simultaneously.
                var tag = $element.prop('tagName')
                    .toLowerCase();
            
                if ($element.prop('value') === this.settings.selectAllValue) {
                    return;
                }

                if (tag === 'optgroup') {
                    this.createOptgroup(element);
                }
                else if (tag === 'option') {

                    if ($element.data('role') === 'divider') {
                        this.createDivider();
                    }
                    else {
                        this.createOptionValue(element);
                    }

                }

                // Other illegal tags will be ignored.
            }, this));

            // Bind the change event on the dropdown elements.
            $('li input', this.$ul).on('change', $.proxy(function(event) {
                var $target = $(event.target);

                var checked = $target.prop('checked') || false;
                var isSelectAllOption = $target.val() === this.settings.selectAllValue;

                // Apply or unapply the configured selected class.
                if (this.settings.selectedClass) {
                    if (checked) {
                        $target.closest('li')
                            .addClass(this.settings.selectedClass);
                    }
                    else {
                        $target.closest('li')
                            .removeClass(this.settings.selectedClass);
                    }
                }

                // Get the corresponding option.
                var value = $target.val();
                var $option = this.getOptionByValue(value);

                var $optionsNotThis = $('option', this.element).not($option);
                var $checkboxesNotThis = $('input', this.$container).not($target);

                if (isSelectAllOption) {
                    if (checked) {
                        this.selectAll();
                    }
                    else {
                        this.deselectAll();
                    }
                }

                if(!isSelectAllOption){
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
                            this.$button.click();
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

                this.settings.onChange($option, checked);

                if(this.settings.preventInputChangeEvent) {
                    return false;
                }
            }, this));

            $('li a', this.$ul).on('mousedown', function(e) {
                if (e.shiftKey) {
                    // Prevent selecting text by Shift+click
                    return false;
                }
            });
        
            $('li a', this.$ul).on('touchstart click', $.proxy(function(event) {
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
                        var range = this.$ul.find("li").slice(from, to).find("input");
                        
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
            }, this));

            // Keyboard support.
            this.$container.off('keydown.multiselect').on('keydown.multiselect', $.proxy(function(event) {
                if ($('input[type="text"]', this.$container).is(':focus')) {
                    return;
                }

                if (event.keyCode === 9 && this.$container.hasClass('open')) {
                    this.$button.click();
                }
                else {
                    var $items = $(this.$container).find("li:not(.divider):not(.disabled) a").filter(":visible");

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
            }, this));

            if(this.settings.enableClickableOptGroups && this.settings.multiple) {
                $('li.multiselect-group', this.$ul).on('click', $.proxy(function(event) {
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
               }, this));
            }
        },

        /**
         * Create an option using the given select option.
         *
         * @param {jQuery} element
         */
        createOptionValue: function(element) {
            var $element = $(element);
            if ($element.is(':selected')) {
                $element.prop('selected', true);
            }

            // Support the label attribute on options.
            var label = this.settings.optionLabel(element);
            var value = $element.val();
            var inputType = this.settings.multiple ? "checkbox" : "radio";

            var $li = $(this.settings.templates.li);
            var $label = $('label', $li);
            $label.addClass(inputType);

            if (this.settings.enableHTML) {
                $label.html(" " + label);
            }
            else {
                $label.text(" " + label);
            }
        
            var $checkbox = $('<input/>').attr('type', inputType);

            if (this.settings.checkboxName) {
                $checkbox.attr('name', this.settings.checkboxName);
            }
            $label.prepend($checkbox);

            var selected = $element.prop('selected') || false;
            $checkbox.val(value);

            if (value === this.settings.selectAllValue) {
                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent()
                    .addClass('multiselect-all');
            }

            $label.attr('title', $element.attr('title'));

            this.$ul.append($li);

            if ($element.is(':disabled')) {
                $checkbox.attr('disabled', 'disabled')
                    .prop('disabled', true)
                    .closest('a')
                    .attr("tabindex", "-1")
                    .closest('li')
                    .addClass('disabled');
            }

            $checkbox.prop('checked', selected);

            if (selected && this.settings.selectedClass) {
                $checkbox.closest('li')
                    .addClass(this.settings.selectedClass);
            }
        },

        /**
         * Creates a divider using the given select option.
         *
         * @param {jQuery} element
         */
        createDivider: function(element) {
            var $divider = $(this.settings.templates.divider);
            this.$ul.append($divider);
        },

        /**
         * Creates an optgroup.
         *
         * @param {jQuery} group
         */
        createOptgroup: function(group) {
            var groupName = $(group).prop('label');

            // Add a header for the group.
            var $li = $(this.settings.templates.liGroup);
            
            if (this.settings.enableHTML) {
                $('label', $li).html(groupName);
            }
            else {
                $('label', $li).text(groupName);
            }
            
            if (this.settings.enableClickableOptGroups) {
                $li.addClass('multiselect-group-clickable');
            }

            this.$ul.append($li);

            if ($(group).is(':disabled')) {
                $li.addClass('disabled');
            }

            // Add the settings of the group.
            $('option', group).each($.proxy(function(index, element) {
                this.createOptionValue(element);
            }, this));
        },

        /**
         * Build the selct all.
         * 
         * Checks if a select all has already been created.
         */
        buildSelectAll: function() {
            if (typeof this.settings.selectAllValue === 'number') {
                this.settings.selectAllValue = this.settings.selectAllValue.toString();
            }
            
            var alreadyHasSelectAll = this.hasSelectAll();

            if (!alreadyHasSelectAll && this.settings.includeSelectAllOption && this.settings.multiple
                    && $('option', this.element).length > this.settings.includeSelectAllIfMoreThan) {

                // Check whether to add a divider after the select all.
                if (this.settings.includeSelectAllDivider) {
                    this.$ul.prepend($(this.settings.templates.divider));
                }

                var $li = $(this.settings.templates.li);
                $('label', $li).addClass("checkbox");
                
                if (this.settings.enableHTML) {
                    $('label', $li).html(" " + this.settings.selectAllText);
                }
                else {
                    $('label', $li).text(" " + this.settings.selectAllText);
                }
                
                if (this.settings.selectAllName) {
                    $('label', $li).prepend('<input type="checkbox" name="' + this.settings.selectAllName + '" />');
                }
                else {
                    $('label', $li).prepend('<input type="checkbox" />');
                }
                
                var $checkbox = $('input', $li);
                $checkbox.val(this.settings.selectAllValue);

                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent()
                    .addClass('multiselect-all');

                this.$ul.prepend($li);

                $checkbox.prop('checked', false);
            }
        },

        /**
         * Builds the filter.
         */
        buildFilter: function() {

            // Build filter if filtering OR case insensitive filtering is enabled and the number of settings exceeds (or equals) enableFilterLength.
            if (this.settings.enableFiltering || this.settings.enableCaseInsensitiveFiltering) {
                var enableFilterLength = Math.max(this.settings.enableFiltering, this.settings.enableCaseInsensitiveFiltering);

                if (this.element.find('option').length >= enableFilterLength) {

                    this.$filter = $(this.settings.templates.filter);
                    $('input', this.$filter).attr('placeholder', this.settings.filterPlaceholder);
                    
                    // Adds optional filter clear button
                    if(this.settings.includeFilterClearBtn){
                        var clearBtn = $(this.settings.templates.filterClearBtn);
                        clearBtn.on('click', $.proxy(function(event){
                            clearTimeout(this.searchTimeout);
                            this.$filter.find('.multiselect-search').val('');
                            $('li', this.$ul).show().removeClass("filter-hidden");
                            this.updateSelectAll();
                        }, this));
                        this.$filter.find('.input-group').append(clearBtn);
                    }
                    
                    this.$ul.prepend(this.$filter);

                    this.$filter.val(this.query).on('click', function(event) {
                        event.stopPropagation();
                    }).on('input keydown', $.proxy(function(event) {
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
                                $.each($('li', this.$ul), $.proxy(function(index, element) {
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
                }
            }
        },

        /**
         * Unbinds the whole plugin.
         */
        destroy: function() {
            this.$container.remove();
            this.element.show();
            this.element.data('multiselect', null);
        },

        /**
         * Refreshs the multiselect based on the selected settings of the select.
         */
        refresh: function() {
            $('option', this.element).each($.proxy(function(index, element) {
                var $input = $('li input', this.$ul).filter(function() {
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

        /**
         * Select all settings of the given values.
         * 
         * If triggerOnChange is set to true, the on change event is triggered if
         * and only if one value is passed.
         * 
         * @param {Array} selectValues
         * @param {Boolean} triggerOnChange
         */
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
                    this.settings.onChange($option, true);
                }
            }

            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Clears all selected items.
         */
        clearSelection: function () {
            this.deselectAll(false);
            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Deselects all settings of the given values.
         * 
         * If triggerOnChange is set to true, the on change event is triggered, if
         * and only if one value is passed.
         * 
         * @param {Array} deselectValues
         * @param {Boolean} triggerOnChange
         */
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
                    this.settings.onChange($option, false);
                }
            }

            this.updateButtonText();
            this.updateSelectAll();
        },
        
        /**
         * Selects all enabled & visible settings.
         *
         * If justVisible is true or not specified, only visible settings are selected.
         *
         * @param {Boolean} justVisible
         * @param {Boolean} triggerOnSelectAll
         */
        selectAll: function (justVisible, triggerOnSelectAll) {
            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            var allCheckboxes = $("li input[type='checkbox']:enabled", this.$ul);
            var visibleCheckboxes = allCheckboxes.filter(":visible");
            var allCheckboxesCount = allCheckboxes.length;
            var visibleCheckboxesCount = visibleCheckboxes.length;
            
            if(justVisible) {
                visibleCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.$ul).filter(":visible").addClass(this.settings.selectedClass);
            }
            else {
                allCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.$ul).addClass(this.settings.selectedClass);
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
                this.settings.onSelectAll();
            }
        },

        /**
         * Deselects all settings.
         * 
         * If justVisible is true or not specified, only visible settings are deselected.
         * 
         * @param {Boolean} justVisible
         */
        deselectAll: function (justVisible) {
            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            
            if(justVisible) {              
                var visibleCheckboxes = $("li input[type='checkbox']:not(:disabled)", this.$ul).filter(":visible");
                visibleCheckboxes.prop('checked', false);
                
                var values = visibleCheckboxes.map(function() {
                    return $(this).val();
                }).get();
                
                $("option:enabled", this.element).filter(function(index) {
                    return $.inArray($(this).val(), values) !== -1;
                }).prop('selected', false);
                
                if (this.settings.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.$ul).filter(":visible").removeClass(this.settings.selectedClass);
                }
            }
            else {
                $("li input[type='checkbox']:enabled", this.$ul).prop('checked', false);
                $("option:enabled", this.element).prop('selected', false);
                
                if (this.settings.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.$ul).removeClass(this.settings.selectedClass);
                }
            }
        },

        /**
         * Rebuild the plugin.
         * 
         * Rebuilds the dropdown, the filter and the select all option.
         */
        rebuild: function() {
            this.$ul.html('');

            // Important to distinguish between radios and checkboxes.
            this.settings.multiple = this.element.attr('multiple') === "multiple";

            this.buildSelectAll();
            this.buildDropdownOptions();
            this.buildFilter();

            this.updateButtonText();
            this.updateSelectAll();
            
            if (this.settings.disableIfEmpty && $('option', this.element).length <= 0) {
                this.disable();
            }
            else {
                this.enable();
            }
            
            if (this.settings.dropRight) {
                this.$ul.addClass('pull-right');
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
                    
                    forEach(option.children, function(subOption) { // add children option tags
                        $tag.append($('<option/>').attr({
                            value: subOption.value,
                            label: subOption.label || subOption.value,
                            title: subOption.title,
                            selected: !!subOption.selected,
                            disabled: !!subOption.disabled
                        }));
                    });
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

        /**
         * Enable the multiselect.
         */
        enable: function() {
            this.element.prop('disabled', false);
            this.$button.prop('disabled', false)
                .removeClass('disabled');
        },

        /**
         * Disable the multiselect.
         */
        disable: function() {
            this.element.prop('disabled', true);
            this.$button.prop('disabled', true)
                .addClass('disabled');
        },

        /**
         * Set the settings.
         *
         * @param {Array} settings
         */
        setOptions: function(settings) {
            this.settings = this.mergeOptions(settings);
        },

        /**
         * Merges the given settings with the default settings.
         *
         * @param {Array} settings
         * @returns {Array}
         */
        mergeOptions: function(settings) {
            return $.extend(true, {}, defaults, this.settings, options);
        },

        /**
         * Checks whether a select all checkbox is present.
         *
         * @returns {Boolean}
         */
        hasSelectAll: function() {
            return $('li.multiselect-all', this.$ul).length > 0;
        },

        /**
         * Updates the select all checkbox based on the currently displayed and selected checkboxes.
         */
        updateSelectAll: function() {
            if (this.hasSelectAll()) {
                var allBoxes = $("li:not(.multiselect-item):not(.filter-hidden) input:enabled", this.$ul);
                var allBoxesLength = allBoxes.length;
                var checkedBoxesLength = allBoxes.filter(":checked").length;
                var selectAllLi  = $("li.multiselect-all", this.$ul);
                var selectAllInput = selectAllLi.find("input");
                
                if (checkedBoxesLength > 0 && checkedBoxesLength === allBoxesLength) {
                    selectAllInput.prop("checked", true);
                    selectAllLi.addClass(this.settings.selectedClass);
                    this.settings.onSelectAll();
                }
                else {
                    selectAllInput.prop("checked", false);
                    selectAllLi.removeClass(this.settings.selectedClass);
                }
            }
        },

        /**
         * Update the button text and its title based on the currently selected settings.
         */
        updateButtonText: function() {
            var settings = this.getSelected();
            
            // First update the displayed button text.
            if (this.settings.enableHTML) {
                $('.multiselect .multiselect-selected-text', this.$container).html(this.settings.buttonText(settings, this.element));
            }
            else {
                $('.multiselect .multiselect-selected-text', this.$container).text(this.settings.buttonText(settings, this.element));
            }
            
            // Now update the title attribute of the button.
            $('.multiselect', this.$container).attr('title', this.settings.buttonTitle(settings, this.element));
        },

        /**
         * Get all selected settings.
         *
         * @returns {jQUery}
         */
        getSelected: function() {
            return $('option', this.element).filter(":selected");
        },

        /**
         * Gets a select option by its value.
         *
         * @param {String} value
         * @returns {jQuery}
         */
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

        /**
         * Get the input (radio/checkbox) by its value.
         *
         * @param {String} value
         * @returns {jQuery}
         */
        getInputByValue: function (value) {

            var checkboxes = $('li input', this.$ul);
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