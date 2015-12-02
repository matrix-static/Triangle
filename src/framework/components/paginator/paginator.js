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

 Jx().package('T.UI.Components', function(J){
    // 严格模式
    'use strict';

    var _crrentPluginId = 0;
    var defaults = {
        // 选项
        totalRecords: 0,    // 记录数
        pageSize: 10,       // 每页记录数
        pageIndex: 0,       // 当前页
        pageButtons: 5,     // 分页按钮数 必须为奇数 3, 5, 7 ,9 ....
        // totalPages: 1,
        // containerClass: '',
        // size: 'normal',
        // alignment: 'left',
        // listContainerClass: '',
        // 覆写 类方法
        // parseData: undefined,
    };
    var attributeMap = {
        // fooOption: 'foo-option'
        totalRecords: 'total-records',
        pageSize: 'page-size',
        pageIndex: 'page-index',
        pageButtons: 'page-buttons'
    };

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

            if (!this.element.is('ul')) {
                throw 'in Bootstrap version 3 the pagination root item must be an ul element.'
            }

            // // 防止多次初始化
            // if (this.isInitialized()) { 
            //     return this.getRef(); 
            // }
            // this.initialize(element);

            // this.options = $.extend({}, (this.options || $.fn.bootstrapPaginator.defaults), options);
            this.initSettings(options);


            // var id = this.element.attr('id');
            // this.value= this.element.val();
            // parseInt(this.settings.pageSize, 10)

            // this.pageIndex = 0;
            // this.lastPageIndex = 0;
            this.updateOptions(this.settings);

            // this.buildHtml();
            // this.initElements();

            // var context= this;
            // $.when(this.getData())
            //  .done(function(){
            //     context.render();
            //  });

             // this.bindEvents();
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

        // bindEvents: function(){
        //     var context= this;
        //     var element= this.element;
        //     // element.on('click', $.proxy(this.onFooClick, this));
        //     this.element.off('page-clicked');
        //     this.element.off('page-changed');// unload the events for the element
        //     if (typeof (this.settings.onPageClicked) === 'function') {
        //         this.element.bind('page-clicked', this.settings.onPageClicked);
        //     }
        //     if (typeof (this.settings.onPageChanged) === 'function') {
        //         this.element.on('page-changed', this.settings.onPageChanged);
        //     }
        //     // this.element.bind('page-clicked', this.onPageClicked);
        //     this.element.on('page-clicked', $.proxy(this.onPageClicked, this));
        // },
        // bindEventsInterface: function(){
        //     var context= this;
        //     var element= this.element;
        //     if(this.settings.onFooSelected){
        //         element.on('click.t.template', $.proxy(this.settings.onFooSelected, this));
        //     }
        // },

        updateOptions: function (options) {

            this.settings = $.extend(true, {}, this.settings, options);

            // 总页数
            if(this.settings.totalRecords % this.settings.pageSize === 0){
                this.totalPages= this.settings.totalRecords / this.settings.pageSize;
            }
            else{
                this.totalPages= Math.ceil(this.settings.totalRecords / this.settings.pageSize);
            }
            // 最少有一页
            this.totalPages= this.totalPages < 1 ? 1 : this.totalPages;

            // 分页按钮数 必须为奇数 3, 5, 7 ,9 ....
            this.settings.pageButtons= this.settings.pageButtons%2 === 0 ? this.settings.pageButtons+1 : this.settings.pageButtons;     

            this.jumpTo(this.settings.pageIndex);
        },
        jumpTo: function (pageIndex) {
            this.pageIndex = pageIndex < 0 ? 0 : pageIndex > this.totalPages-1 ? this.totalPages-1 : pageIndex;
            this.render();

            // if (this.lastPageIndex !== this.pageIndex) {
            //     this.element.trigger('page-changed', [this.lastPageIndex, this.pageIndex]);
            // }
        },
       
        onPageItemClicked: function (event) {
            var type = event.data.type,
                page = event.data.page;
            this.element.trigger('page-clicked', [event, type, page]);
        },
        onPageClicked: function (event, originalEvent, type, pageIndex) {
            this.jumpTo(pageIndex);
        },
        render: function () {

            //fetch the container class and add them to the container
            var pages = this.getPageButtons();
            var listContainer = this.element;

            // add class
            // this.element.prop('class', '');
            this.element.addClass('pagination');     // pagination-lg / pagination / pagination-sm
            // this.element.addClass(containerClass);

            this.element.empty();

            var htmlItems= '';
            var prev= '<li><a data-pi="'+pages.prev+'">&lt;上一页</a><li>';
            htmlItems+= prev;

            if(typeof pages.first !== 'undefined'){
                var first = '<li><a data-pi="0">1</a><li>';
                htmlItems+= first;
            }

            if(typeof pages.prevSection !== 'undefined'){
                var prevSection= '<li><a data-pi="'+pages.prevSection+'">...</a><li>';
                htmlItems+= prevSection;
            }

            for (var i = 0; i < pages.length; i = i + 1) {
                var itemClass = (pages[i] === this.pageIndex) ? ' class="active"' : '';
                var item = '<li'+itemClass+'><a data-pi="'+pages[i]+'">'+(pages[i]+1)+'</a><li>';
                htmlItems+= item;
            }

            if(typeof pages.nextSection !== 'undefined'){
                var nextSection= '<li><a data-pi="'+pages.nextSection+'">...</a><li>';
                htmlItems+= nextSection;
            }

            if(typeof pages.last !== 'undefined'){
                var last = '<li><a data-pi="'+pages.last+'">'+(pages.last+1)+'</a><li>'; 
                htmlItems+= last;
            }

            var next= '<li><a data-pi="'+pages.next+'">下一页&gt;</a><li>';
            htmlItems+= next;
            listContainer.append(htmlItems);

            $('a', listContainer).on('click', $.proxy(this.onPageIndexChange, this));
        },
        getPageButtons: function () {

            var totalRecords = this.settings.totalRecords;
            var totalPages= this.totalPages;

            var pageIndexStart= 0;
            var halfItemsCount= Math.floor(this.settings.pageButtons / 2);
            pageIndexStart= this.pageIndex - halfItemsCount;
            // 上限
            pageIndexStart= pageIndexStart < this.totalPages - this.settings.pageButtons ? pageIndexStart : this.totalPages - this.settings.pageButtons;
            // 下限
            pageIndexStart= pageIndexStart < 0 ? 0 : pageIndexStart;
            
            var output = [];
            for (var i = pageIndexStart, counter = 0; counter < this.settings.pageButtons && i < totalPages; i = i + 1, counter = counter + 1) {//fill the pages
                output.push(i);
            }

            // 首页
            if(pageIndexStart>0){
                output.first = 0;
            }

            // 上一段
            if(this.pageIndex-halfItemsCount > 1){
                output.prevSection=  this.pageIndex-halfItemsCount-1;
            }

            // 上一页
            if (this.pageIndex > 0) {
                output.prev= this.pageIndex - 1;
            } else {
                output.prev= 0;
            }

            // 下一页
            if (this.pageIndex < totalPages-1) {
                output.next= this.pageIndex + 1;
            } else {
                output.next= totalPages-1;
            }

            // 下一段
            if(this.pageIndex+halfItemsCount < this.totalPages-1){
                output.nextSection= this.pageIndex+halfItemsCount+1;
            }

            // 尾页
            if(pageIndexStart<totalPages-this.settings.pageButtons){
                output.last= totalPages-1;
            }

            // output.current= this.pageIndex;//mark the current page.
            // output.total= totalPages;
            // output.pageButtons = this.settings.pageButtons;

            return output;
        },

        // 事件
        // onFooSelected: undefined,
        // onFooChange: function(e, data){}
        // onPageClicked: null,
        // onPageChanged: null,
        onPageIndexChange: function(e){
            var pageIndex= parseInt($(e.target).attr('data-pi'), 10);
            if(this.pageIndex == pageIndex){
                return;
            }
            this.jumpTo(pageIndex);
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
            this.element.off('page-clicked');
            this.element.off('page-changed');
            // this.element.removeData('bootstrapPaginator');
            this.element.empty();
        }
    });
});



        // tooltipTitles: function (type, pageIndex, current) {
        //     switch (type) {
        //     case 'first':
        //         return '首页';
        //     case 'prev':
        //         return '上一页';
        //     case 'next':
        //         return '下一页';
        //     case 'last':
        //         return '尾页';
        //     case 'pageIndex':
        //         return (pageIndex === current) ? '当前是第 ' + (pageIndex+1) + ' 页': '跳转到第 ' + (pageIndex+1) + '页';
        //     }
        // },