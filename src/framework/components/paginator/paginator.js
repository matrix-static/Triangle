/**
 * bootstrap-paginator.js v0.5
 * --
 * Copyright 2013 Yun Lai <lyonlai1984@gmail.com>
 * --
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 Jx().package("T.UI.Components", function(J){
    // 严格模式
    'use strict';

    var _crrentPluginId = 0;
    var defaults = {
        // 选项
        pageIndex: 1,
        numberOfPages: 5,
        totalPages: 1,
        containerClass: "",
        size: "normal",
        alignment: "left",
        listContainerClass: "",
        // 覆写 类方法
        // parseData: undefined,
        itemContainerClass: function (type, page, current) {
            return (page === current) ? "active" : "";
        },
        itemContentClass: function (type, page, current) {
            return "";
        },        
        pageUrl: function (type, page, current) {
            return null;
        },
        // 事件
        // onFooSelected: undefined,
        // onFooChange: function(e, data){}
        onPageClicked: null,
        onPageChanged: null,
                
        // useBootstrapTooltip: false,
        shouldShowPage: function (type, page, current) {
            var result = true;

            switch (type) {
            case "first":
                result = (current !== 1);
                break;
            case "prev":
                result = (current !== 1);
                break;
            case "next":
                result = (current !== this.totalPages);
                break;
            case "last":
                result = (current !== this.totalPages);
                break;
            case "page":
                result = true;
                break;
            }

            return result;
        },
        itemTexts: function (type, page, current) {
            switch (type) {
            case "first":
                return "&lt;&lt;";
            case "prev":
                return "&lt;";
            case "next":
                return "&gt;";
            case "last":
                return "&gt;&gt;";
            case "page":
                return page;
            }
        },
        tooltipTitles: function (type, page, current) {
            switch (type) {
            case "first":
                return "Go to first page";
            case "prev":
                return "Go to previous page";
            case "next":
                return "Go to next page";
            case "last":
                return "Go to last page";
            case "page":
                return (page === current) ? "Current page is " + page : "Go to page " + page;
            }
        }
    };
    var attributeMap = {
        // fooOption: 'foo-option'
        pageIndex: 'page-index',
        totalPages: 'total-pages'
    };

    // var bootstrapTooltipOptions: {
    //     animation: true,
    //     html: true,
    //     placement: 'top',
    //     selector: false,
    //     title: "",
    //     container: false
    // }

    this.Paginator = new J.Class({extend: T.UI.BaseControl},{
        defaults: defaults,
        attributeMap: attributeMap,

        settings: {},
        value: '',
        data: {},
        templates: {},

        // 构造函数
        init: function(element, options){
            this.element= $(element);

            // // 防止多次初始化
            // if (this.isInitialized()) { 
            //     return this.getRef(); 
            // }
            // this.initialize(element);

            // this.options = $.extend({}, (this.options || $.fn.bootstrapPaginator.defaults), options);
            this.initSettings(options);


            var id = this.element.attr("id");

            if (!this.element.is("ul")) {
                throw "in Bootstrap version 3 the pagination root item must be an ul element."
            }



            this.pageIndex = 1;

            this.lastPage = 1;

            this.setOptions(this.settings);

            this.initialized = true;

            // --

            
            // this.value= this.element.val();

            this.buildHtml();
            this.initElements();

            // var context= this;
            // $.when(this.getData())
            //  .done(function(){
            //     context.render();
            //  });

             this.bindEvents();
             // this.bindEventsInterface();
        },

        // 模板模式 方法
        getData: function(){
            var d = $.Deferred();

            if (this.settings.data) {
                this.data = $.extend(true, [], this.settings.data);
                delete this.settings.data;

                d.resolve();

                return d.promise();
            }

            var context = this;
            $.ajax({
                dataType: 'json',
                url: this.settings.dataUrl,
                data: {},
                success: function(data){
                    context.data= $.extend(true, [], data);

                    d.resolve();
                },
                error: function(xmlHttpRequest, status, error){
                    alert('控件id：' + context.element.attr('id')+'，ajax获取数据失败!');

                    d.resolve();
                }
            });

            return d.promise();
        },
        parseData: function(data){
            var innerData= $.extend(true, [], data);
            return innerData;
        },
        buildHtml: function(){},
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

        setOptions: function (options) {

            // this.options = $.extend({}, (this.options || $.fn.bootstrapPaginator.defaults), options);

            this.totalPages = parseInt(this.settings.totalPages, 10);  //setup the total pages property.
            this.numberOfPages = parseInt(this.settings.numberOfPages, 10); //setup the numberOfPages to be shown

            //move the set current page after the setting of total pages. otherwise it will cause out of page exception.
            if (this.settings && typeof (this.settings.pageIndex)  !== 'undefined') {

                this.setCurrentPage(this.settings.pageIndex);
            }

            this.listen();

            //render the paginator
            this.render();

            if (!this.initialized && this.lastPage !== this.pageIndex) {
                this.element.trigger("page-changed", [this.lastPage, this.pageIndex]);
            }
        },

        /**
         * Sets up the events listeners. Currently the pageclicked and pagechanged events are linked if available.
         *
         * */
        listen: function () {

            this.element.off("page-clicked");

            this.element.off("page-changed");// unload the events for the element

            if (typeof (this.settings.onPageClicked) === "function") {
                this.element.bind("page-clicked", this.settings.onPageClicked);
            }

            if (typeof (this.settings.onPageChanged) === "function") {
                this.element.on("page-changed", this.settings.onPageChanged);
            }

            // this.element.bind("page-clicked", this.onPageClicked);
            this.element.on("page-clicked", $.proxy(this.onPageClicked, this));
        },


        

        /**
         * Shows the page
         *
         * */
        show: function (page) {

            this.setCurrentPage(page);

            this.render();

            if (this.lastPage !== this.pageIndex) {
                this.element.trigger("page-changed", [this.lastPage, this.pageIndex]);
            }
        },

        /**
         * Shows the next page
         *
         * */
        showNext: function () {
            var pages = this.getPages();

            if (pages.next) {
                this.show(pages.next);
            }

        },

        /**
         * Shows the previous page
         *
         * */
        showPrevious: function () {
            var pages = this.getPages();

            if (pages.prev) {
                this.show(pages.prev);
            }

        },

        /**
         * Shows the first page
         *
         * */
        showFirst: function () {
            var pages = this.getPages();

            if (pages.first) {
                this.show(pages.first);
            }

        },

        /**
         * Shows the last page
         *
         * */
        showLast: function () {
            var pages = this.getPages();

            if (pages.last) {
                this.show(pages.last);
            }

        },

        /**
         * Internal on page item click handler, when the page item is clicked, change the current page to the corresponding page and
         * trigger the pageclick event for the listeners.
         *
         *
         * */
        onPageItemClicked: function (event) {

            var type = event.data.type,
                page = event.data.page;

            this.element.trigger("page-clicked", [event, type, page]);

        },

        onPageClicked: function (event, originalEvent, type, page) {
            // var currentTarget = $(event.currentTarget);

            switch (type) {
            case "first":
                this.showFirst();
                break;
            case "prev":
                this.showPrevious();
                break;
            case "next":
                this.showNext();
                break;
            case "last":
                this.showLast();
                break;
            case "page":
                this.show(page);
                break;
            }

        },

        /**
         * Renders the paginator according to the internal properties and the settings.
         *
         *
         * */
        render: function () {

            var sizes={
                "large": "pagination-lg",
                "small": "pagination-sm",
                "mini": ""
            };

            //fetch the container class and add them to the container
            var containerClass = this.getValueFromOption(this.settings.containerClass, this.element),
                size = this.settings.size || "normal",
                alignment = this.settings.alignment || "left",
                pages = this.getPages(),
                listContainer = this.element,
                listContainerClass = null,
                first = null,
                prev = null,
                next = null,
                last = null,
                p = null,
                i = 0;


            this.element.prop("class", "");

            this.element.addClass("pagination");

            switch (size.toLowerCase()) {
            case "large":
            case "small":
            case "mini":
                this.element.addClass(sizes[size.toLowerCase()]);
                break;
            default:
                break;
            }

            this.element.addClass(containerClass);

            //empty the outter most container then add the listContainer inside.
            this.element.empty();

            //update the page element reference
            this.pageRef = [];

            if (pages.first) {//if the there is first page element
                first = this.buildPageItem("first", pages.first);

                if (first) {
                    listContainer.append(first);
                }

            }

            if (pages.prev) {//if the there is previous page element

                prev = this.buildPageItem("prev", pages.prev);

                if (prev) {
                    listContainer.append(prev);
                }

            }


            for (i = 0; i < pages.length; i = i + 1) {//fill the numeric pages.

                p = this.buildPageItem("page", pages[i]);

                if (p) {
                    listContainer.append(p);
                }
            }

            if (pages.next) {//if there is next page

                next = this.buildPageItem("next", pages.next);

                if (next) {
                    listContainer.append(next);
                }
            }

            if (pages.last) {//if there is last page

                last = this.buildPageItem("last", pages.last);

                if (last) {
                    listContainer.append(last);
                }
            }
        },

        /**
         *
         * Creates a page item base on the type and page number given.
         *
         * @param page page number
         * @param type type of the page, whether it is the first, prev, page, next, last
         *
         * @return Object the constructed page element
         * */
        buildPageItem: function (type, page) {

            var itemContainer = $("<li></li>"),//creates the item container
                itemContent = $("<a></a>"),//creates the item content
                text = "",
                title = "",
                itemContainerClass = this.settings.itemContainerClass(type, page, this.pageIndex),
                itemContentClass = this.getValueFromOption(this.settings.itemContentClass, type, page, this.pageIndex),
                tooltipOpts = null;


            switch (type) {

            case "first":
                if (!this.getValueFromOption(this.settings.shouldShowPage, type, page, this.pageIndex)) { return; }
                text = this.settings.itemTexts(type, page, this.pageIndex);
                title = this.settings.tooltipTitles(type, page, this.pageIndex);
                break;
            case "last":
                if (!this.getValueFromOption(this.settings.shouldShowPage, type, page, this.pageIndex)) { return; }
                text = this.settings.itemTexts(type, page, this.pageIndex);
                title = this.settings.tooltipTitles(type, page, this.pageIndex);
                break;
            case "prev":
                if (!this.getValueFromOption(this.settings.shouldShowPage, type, page, this.pageIndex)) { return; }
                text = this.settings.itemTexts(type, page, this.pageIndex);
                title = this.settings.tooltipTitles(type, page, this.pageIndex);
                break;
            case "next":
                if (!this.getValueFromOption(this.settings.shouldShowPage, type, page, this.pageIndex)) { return; }
                text = this.settings.itemTexts(type, page, this.pageIndex);
                title = this.settings.tooltipTitles(type, page, this.pageIndex);
                break;
            case "page":
                if (!this.getValueFromOption(this.settings.shouldShowPage, type, page, this.pageIndex)) { return; }
                text = this.settings.itemTexts(type, page, this.pageIndex);
                title = this.settings.tooltipTitles(type, page, this.pageIndex);
                break;
            }

            itemContainer.addClass(itemContainerClass).append(itemContent);

            itemContent.addClass(itemContentClass).html(text).on("click", null, {type: type, page: page}, $.proxy(this.onPageItemClicked, this));

            if (this.settings.pageUrl) {
                itemContent.attr("href", this.getValueFromOption(this.settings.pageUrl, type, page, this.pageIndex));
            }

            // if (this.settings.useBootstrapTooltip) {
            //     tooltipOpts = $.extend({}, this.settings.bootstrapTooltipOptions, {title: title});

            //     itemContent.tooltip(tooltipOpts);
            // } else {
                itemContent.attr("title", title);
            // }

            return itemContainer;

        },

        setCurrentPage: function (page) {
            if (page > this.totalPages || page < 1) {// if the current page is out of range, throw exception.

                throw "Page out of range";

            }

            this.lastPage = this.pageIndex;

            this.pageIndex = parseInt(page, 10);

        },

        /**
         * Gets an array that represents the current status of the page object. Numeric pages can be access via array mode. length attributes describes how many numeric pages are there. First, previous, next and last page can be accessed via attributes first, prev, next and last. Current attribute marks the current page within the pages.
         *
         * @return object output objects that has first, prev, next, last and also the number of pages in between.
         * */
        getPages: function () {

            var totalPages = this.totalPages,// get or calculate the total pages via the total records
                pageStart = (this.pageIndex % this.numberOfPages === 0) ? (parseInt(this.pageIndex / this.numberOfPages, 10) - 1) * this.numberOfPages + 1 : parseInt(this.pageIndex / this.numberOfPages, 10) * this.numberOfPages + 1,//calculates the start page.
                output = [],
                i = 0,
                counter = 0;

            pageStart = pageStart < 1 ? 1 : pageStart;//check the range of the page start to see if its less than 1.

            for (i = pageStart, counter = 0; counter < this.numberOfPages && i <= totalPages; i = i + 1, counter = counter + 1) {//fill the pages
                output.push(i);
            }

            output.first = 1;//add the first when the current page leaves the 1st page.

            if (this.pageIndex > 1) {// add the previous when the current page leaves the 1st page
                output.prev = this.pageIndex - 1;
            } else {
                output.prev = 1;
            }

            if (this.pageIndex < totalPages) {// add the next page when the current page doesn't reach the last page
                output.next = this.pageIndex + 1;
            } else {
                output.next = totalPages;
            }

            output.last = totalPages;// add the last page when the current page doesn't reach the last page

            output.current = this.pageIndex;//mark the current page.

            output.total = totalPages;

            output.numberOfPages = this.settings.numberOfPages;

            return output;

        },

        /**
         * Gets the value from the options, this is made to handle the situation where value is the return value of a function.
         *
         * @return mixed value that depends on the type of parameters, if the given parameter is a function, then the evaluated result is returned. Otherwise the parameter itself will get returned.
         * */
        getValueFromOption: function (value) {

            var output = null,
                args = Array.prototype.slice.call(arguments, 1);

            if (typeof value === 'function') {
                output = value.apply(this, args);
            } else {
                output = value;
            }

            return output;

        },

        // 事件处理
        // onFooClick: function(e, data){
        //     ;
        // },

        // API
        reflash: function(){},
        enable: function(){},
        disable: function(){},
        destroy: function () {
            this.element.off("page-clicked");
            this.element.off("page-changed");
            this.element.removeData('bootstrapPaginator');
            this.element.empty();
        }
    });
});