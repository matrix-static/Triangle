/* =========================================================
 * bootstrap-treeview.js v1.2.0
 * =========================================================
 * Copyright 2013 Jonathan Miles
 * Project URL : http://www.jondmiles.com/bootstrap-treeview
 *
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
 * ========================================================= */


 /*
    1. removed css (move to tree.less)
    2. removed buildStyleOverride
 */

Jx().package("T.UI.Components", function(J){

    // 严格模式
    'use strict';

    // 全局变量、函数、对象
    var defaults = {
        levels: 2,
        dataUrl: '',

        // expandIcon: 'glyphicon glyphicon-plus',
        // collapseIcon: 'glyphicon glyphicon-minus',
        expandIcon: 'glyphicon glyphicon-chevron-right',
        collapseIcon: 'glyphicon glyphicon-chevron-down',        
        emptyIcon: 'glyphicon',
        nodeIcon: '',
        selectedIcon: '',
        checkedIcon: 'glyphicon glyphicon-check',
        uncheckedIcon: 'glyphicon glyphicon-unchecked',

        enableLinks: false,
        enableTitle: false,
        showIcon: true,
        showCheckbox: false,
        showTags: false,
        multiSelect: false,

        // nodeOptions
        silent: false,
        ignoreChildren: false,

        // Event handlers
        onNodeChecked: undefined,
        onNodeCollapsed: undefined,
        onNodeDisabled: undefined,
        onNodeEnabled: undefined,
        onNodeExpanded: undefined,
        onNodeSelected: undefined,
        onNodeUnchecked: undefined,
        onNodeUnselected: undefined//,
        // onSearchComplete: undefined,
        // onSearchCleared: undefined
    };
    var attributeMap = {
        showTags: 'show-tags',
        levels: 'levels',
        enableTitle: 'enable-title',
        dataUrl: 'data-url'
    };

    // var state= jqNode.find('.expand-icon').hasClass(this.settings.expandIcon);
    // fix for multi class in this.settings.expandIcon, like: 'glyphicon glyphicon-chevron-right'
    function hasClasses(jqElement, classes){
        var arrClass= classes.split(' ');
        var has= true;
        for(var i=0; i< arrClass.length; i++){
            if(!jqElement.hasClass(arrClass[i])){
                has= false;
                break;
            }
        }
        return has;
    }

    this.Tree = new J.Class({extend : T.UI.BaseControl}, {
        defaults : defaults,
        attributeMap : attributeMap,


        // 构造函数
        init: function(element, options){
            // this.element = $(element);

            // this.settings,
            // this.container,
            // this.elements,

            // -----------------------------------------------
            // options
            // -----------------------------------------------
            // 初始化选项
            // this.initSettings(this.element, options);
            var jqElement=$(element);
            this.initSettings(jqElement, options);
            if (typeof (this.settings.parseData) === 'function') {
                this.parseData = this.settings.parseData;
                delete this.settings.parseData;
            }

            // -----------------------------------------------
            // value
            // -----------------------------------------------
            // this.value = this.element.val();

            // -----------------------------------------------
            // data
            // -----------------------------------------------
            this.data = [];
            this.nodes = [];

            var context= this;
            // 初始化数据
            $.when(this.getData())
             .done(function(){
                
                // -----------------------------------------------
                // states
                // -----------------------------------------------
                // this.initStates(jqElement);
                context.setInitialStates({ nodes: context.data }, 0);
                // -----------------------------------------------
                // html
                // -----------------------------------------------
                context.buildHtml(jqElement);
                context.initElements(jqElement);
                context.refresh();

                context.bindEvents();
            });

            
            // -----------------------------------------------
            // events
            // -----------------------------------------------
            // this.buildObservers();
            // this.bindEvents();

            // 构建html DOM
            // this.buildHtml();

            // this.bindEvents();
            // this.setInitialStates({ nodes: this.data }, 0);
            
            

            
            // // 初始化 html DOM 元素
            // this.initElements();
            // this.transferAttributes();

            // // 创建 树型 菜单对象
            // //this.menu=new LevelMenu(this.elements, this.settings);

            // // 绑定事件
            // this.bindEvents();
            // // 绑定事件接口
            // this.bindEventsInterface();

            // this.initialized();

            // this.refresh();
        },

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
                url: context.settings.dataUrl,
                data: {},
                success: function(data){
                    var innerData= context.parseData(data);
                    context.data= $.extend(true, [], innerData);
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
            return data;
        },

        setInitialStates: function (node, level) {
            if (!node.nodes) return;
            level += 1;

            // $.each(node.nodes, function checkStates(index, node) {
            for(var i=0; i<node.nodes.length; i++){
                var child=node.nodes[i];

                // nodeId : unique, incremental identifier
                child.nodeId = this.nodes.length;
                child.parentId = node.nodeId;
                child.path = (node.path || 'r') + '-' + child.nodeId;

                // // if not provided set selectable default value
                // if (!child.hasOwnProperty('selectable')) {
                //     child.selectable = true;
                // }

                // where provided we should preserve states
                child.state = child.state || {};

                // set checked state; unless set always false
                if (!child.state.hasOwnProperty('checked')) {
                    child.state.checked = false;
                }

                // set enabled state; unless set always false
                if (!child.state.hasOwnProperty('disabled')) {
                    child.state.disabled = false;
                }

                // set expanded state; if not provided based on levels
                if (!child.state.hasOwnProperty('expanded')) {
                    if (!child.state.disabled && (level < this.settings.levels) && (child.nodes && child.nodes.length > 0)) {
                        child.state.expanded = true;
                    }
                    else {
                        child.state.expanded = false;
                    }
                }

                // set selected state; unless set always false
                if (!child.state.hasOwnProperty('selected')) {
                    child.state.selected = false;
                }

                // index nodes in a flattened structure for use later
                this.nodes.push(child);

                // recurse child nodes and transverse the tree
                if (child.nodes) {
                    this.setInitialStates(child, level);
                }
            }
        },

        buildHtml: function(element){
            element.addClass('t-tree');
            this.container = $('<ul class="list-group"></ul>'); // list
            element
                .empty()
                .append(this.container);
        },

        initElements: function(element){
            var context= this;

            this.elements={
                original: element,
                getAllNodes: function(){
                    var allNodes= $('li', context.container);
                    return allNodes;
                },
                getNode: function(nodeId){
                    var child= $('li[data-id="'+nodeId+'"]', context.container);
                    return child;
                },
                getChildNodes: function(nodeId){
                    var jqNode= this.getNode(nodeId);
                    var path= jqNode.data('path');
                    var children= $('li[data-path^="'+path+'-"]', context.container);
                    return children;
                },
                getLevelNodes: function(level){
                    var child= $('li[data-level="'+level+'"]', context.container);
                    return child;
                },
                getSelectedNodes: function(unselected){
                    var nodeSelector= unselected ? 'li:not(.node-selected)' : 'li.node-selected';
                    var selectedNodes = $(nodeSelector, context.container);
                    return selectedNodes;
                },
                getCheckedNodes: function(unchecked){
                    var nodeSelector= unchecked ? 'li:not(.node-checked)' : 'li.node-checked';
                    var checkedNodes= $(nodeSelector, context.container);
                    return checkedNodes;
                },
                getDisabledNodes: function(disabled){
                    var nodeSelector= disabled ? 'li:not(.node-disabled)' : 'li.node-disabled';
                    var checkedNodes= $(nodeSelector, context.container);
                    return checkedNodes;
                },
                getSearchResultNodes: function(notResult){
                    var nodeSelector= notResult ? 'li:not(.search-result)' : 'li.search-result';
                    var checkedNodes= $(nodeSelector, context.container);
                    return checkedNodes;
                }
            };
        },

        buildTree: function (nodes, level) {
            if (!nodes) return;
            level += 1;

            for(var i=0; i<nodes.length; i++){
                var node=nodes[i];

                var item= this.buildItem(node, level);

                // Add item to the tree
                this.container.append(item);

                // Recursively add child ndoes
                if (node.nodes && !node.state.disabled) {   // && node.state.expanded TODO:移除原有expanded机制，改为显示/隐藏模式
                    this.buildTree(node.nodes, level);
                }
            }

            // TODO:隐藏应该折叠的nodes
        },

        buildItem: function(node, level){
            // indent
            var indent= '';
            for (var j = 0; j < (level - 1); j++) {
                indent+='<span class="indent"></span>';
            }

            // icon
            var cssClassIcon= 'icon';
            if (node.nodes) {
                cssClassIcon += node.state.expanded ? ' expand-icon '+this.settings.collapseIcon : ' expand-icon '+this.settings.expandIcon;
            }
            else {
                cssClassIcon += ' ' + this.settings.emptyIcon;
            }
            var icon= '<span class="'+cssClassIcon+'"></span>';

            // node icon
            var nodeIcon= '';
            if (this.settings.showIcon) {
                var cssClassNodeIcon= 'icon node-icon ';
                if (node.state.selected) {
                    cssClassNodeIcon += (node.selectedIcon || this.settings.selectedIcon || node.icon || this.settings.nodeIcon);
                }
                else{
                    cssClassNodeIcon += (node.icon || this.settings.nodeIcon);
                }
                nodeIcon= '<span class="'+cssClassNodeIcon+'"></span>'; // icon
            }

            // Add check / unchecked icon
            var check= '';
            if (this.settings.showCheckbox) {
                var cssClassCheck= 'icon check-icon ';
                if (node.state.checked) {
                    cssClassCheck += this.settings.checkedIcon; 
                }
                else {
                    cssClassCheck += this.settings.uncheckedIcon;
                }
                check= '<span class="'+ cssClassCheck +'"></span>';
            }

            // tags as badges
            var badge= '';
            if (this.settings.showTags && node.tags) {
                for(var k=0; k<node.tags.length; k++){
                    var tag=node.tags[k];
                    badge += '<span class="badge">'+tag+'</span>';  // badge
                }
            }

            // item
            var cssClass= 'list-group-item';
            cssClass += node.state.checked ? ' node-checked' : '';
            cssClass += node.state.disabled ? ' node-disabled' : '';
            cssClass += node.state.selected ? ' node-selected' : '';
            // cssClass += node.searchResult ? ' search-result' : '';
            var item= ''+
                '<li '+
                '   class="' + cssClass + '" '+
                (this.settings.enableTitle ? 
                '   title="'+node.text+'"' : '')+
                '   data-id="'+node.nodeId+'"'+
                '   data-level="'+level+'"'+
                '   data-path="'+node.path+'">'+
                indent +
                icon +
                nodeIcon +
                check +
                (this.settings.enableLinks ? 
                '   <a href="'+node.href+'" style="color:inherit;">'+node.text+'</a>' : node.text) +
                badge +
                '</li>';

            return item;
        },

        refresh: function () {
            this.container.empty();
            // Build tree
            this.buildTree(this.data, 0);
        },

        // 点击事件处理器
        clickHandler: function (event) {

            if (!this.settings.enableLinks) {
                event.preventDefault();
            }

            var target = $(event.target);
            var jqNode = target.closest('li.list-group-item');
            if (jqNode.hasClass('node-disabled')) {
                return;
            }
            
            var nodeId = jqNode.attr('data-id');

            var classList = target.attr('class') ? target.attr('class').split(' ') : [];
            if ((classList.indexOf('expand-icon') !== -1)) {
                this.toggleExpandedState(nodeId, this.settings.silent, this.settings.ignoreChildren);
                return;
            }

            if ((classList.indexOf('check-icon') !== -1)) {                
                this.toggleCheckedState(nodeId, this.settings.silent);
                return;
            }

            // if (node.selectable) {
            this.toggleSelectedState(nodeId, this.settings.silent);
            // } else {
            //     this.toggleExpandedState(nodeId, this.settings.silent);
            // }
        },

        // -------------------------------------------------------------------
        // 展开 / 折叠
        // -------------------------------------------------------------------

        setExpandedState: function (nodeId, state, silent, ignoreChildren) {
            var jqNode= this.elements.getNode(nodeId);
            var jqChildren= this.elements.getChildNodes(nodeId);

            if (jqChildren.length>0 && !ignoreChildren) {
                var context= this;
                jqChildren.each(function(){
                    var nodeId= $(this).data('id');
                    context.setExpandedState(nodeId, state, silent, ignoreChildren);
                });
            }

            if (state) {
                jqNode.find('.expand-icon').removeClass(this.settings.expandIcon).addClass(this.settings.collapseIcon);                
                jqChildren.show();

                if (!silent) {
                    this.elements.original.trigger('nodeExpanded', nodeId);
                }
            } else {
                jqNode.find('.expand-icon').removeClass(this.settings.collapseIcon).addClass(this.settings.expandIcon);
                jqChildren.hide();

                if (!silent) {
                    this.elements.original.trigger('nodeCollapsed', nodeId);
                }
            }
        },

        collapseNode: function (nodeIds, silent, ignoreChildren) {
            for(var i=0; i<nodeIds.length; i++){
                this.setExpandedState(nodeIds[i], false, silent, ignoreChildren);
            }
        },

        expandNode: function (nodeIds, silent, ignoreChildren) {
            // this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            //     this.setExpandedState(node, true, options);
            //     if (node.nodes && (options && options.levels)) {
            //         this.expandLevels(node.nodes, options.levels-1, options);
            //     }
            // }, this));

            for(var i=0; i<nodeIds.length; i++){
                this.setExpandedState(nodeIds[i], true, silent, ignoreChildren);
            }
        },

        toggleExpandedState: function (nodeId, silent, ignoreChildren) {
            var jqNode= this.elements.getNode(nodeId);
            var jqExpand= jqNode.find('.expand-icon');

            var state= hasClasses(jqExpand, this.settings.collapseIcon);

            this.setExpandedState(nodeId, !state, silent, ignoreChildren);
        },

        toggleNodeExpanded: function (nodeIds, silent, ignoreChildren) {
            for(var i=0; i<nodeIds.length; i++){
                this.toggleExpandedState(nodeIds[i], silent, ignoreChildren);
            }
        },

        // expandLevels: function (nodes, level, silent, ignoreChildren) {
        //     options = $.extend({}, nodeOptions, options);

        //     $.each(nodes, $.proxy(function (index, node) {
        //         this.setExpandedState(node, (level > 0) ? true : false, options);
        //         if (node.nodes) {
        //             this.expandLevels(node.nodes, level-1, options);
        //         }
        //     }, this));
        // },

        expandAll: function (silent, ignoreChildren) {
            // options = $.extend({}, nodeOptions, options);

            // if (options && options.levels) {
            //     his.expandLevels(this.data, options.levels, options);
            // }
            // else {
            //     var identifiers = this.findNodes('false', 'g', 'state.expanded');
            //     this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            //         this.setExpandedState(node, true, options);
            //     }, this));
            // }

            var nodes= this.elements.getLevelNodes(1);
            var context= this;
            nodes.each(function(){
                var nodeId= $(this).data('id');
                context.setExpandedState(nodeId, true, silent, ignoreChildren);
            });
        },

        collapseAll: function (silent, ignoreChildren) {
            var nodes= this.elements.getLevelNodes(1);
            var context= this;
            nodes.each(function(){
                var nodeId= $(this).data('id');
                context.setExpandedState(nodeId, false, silent, ignoreChildren);
            });
        },        

        // -------------------------------------------------------------------
        // 选中
        // -------------------------------------------------------------------

        setSelectedState: function (nodeId, state, silent) {
            if (state) {
                if (!this.settings.multiSelect) {
                    this.elements.getSelectedNodes(false).removeClass('node-selected');
                }

                this.elements.getNode(nodeId).addClass('node-selected');
                if (!silent) {
                    this.elements.original.trigger('nodeSelected', nodeId);
                }
            }
            else {
                this.elements.getNode(nodeId).removeClass('node-selected');
                if (!silent) {
                    this.elements.original.trigger('nodeUnselected', nodeId);
                }
            }
        },

        selectNode: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.setSelectedState(nodeIds[i], true, silent);
            }
        },

        unselectNode: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.setSelectedState(nodeIds[i], false, silent);
            }
        },

        toggleSelectedState: function (nodeId, silent) {
            var jqNode= this.elements.getNode(nodeId);
            var state= jqNode.hasClass('node-selected');

            this.setSelectedState(nodeId, !state, silent);
        },

        toggleNodeSelected: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.toggleSelectedState(nodeIds[i], silent);
            }
        },

        // -------------------------------------------------------------------
        // checkbox
        // -------------------------------------------------------------------

        setCheckedState: function(nodeId, state, silent){
            var jqNode= this.elements.getNode(nodeId);
            var jqCheck= jqNode.find('.check-icon');

            if (state) {   
                jqNode.addClass('node-checked');
                jqCheck.removeClass(this.settings.uncheckedIcon).addClass(this.settings.checkedIcon);

                if (!silent) {
                    // this.elements.original.trigger('nodeChecked', $.extend(true, {}, node));
                    this.elements.original.trigger('nodeChecked', nodeId);
                }
            }
            else {
                jqNode.removeClass('node-checked');
                jqCheck.removeClass(this.settings.checkedIcon).addClass(this.settings.uncheckedIcon);

                if (!silent) {
                    this.elements.original.trigger('nodeUnchecked', nodeId);
                }
            }
        },

        checkNode: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.setCheckedState(nodeIds[i], true, silent);
            }
        },

        uncheckNode: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.setCheckedState(nodeIds[i], false, silent);
            }
        },

        toggleCheckedState: function (nodeId, silent) {
            var jqNode= this.elements.getNode(nodeId);
            var jqCheck= jqNode.find('.check-icon');

            var state= hasClasses(jqExpand, this.settings.checkedIcon);

            this.setCheckedState(node.nodeId, !state, silent);
        },

        toggleNodeChecked: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.toggleCheckedState(nodeIds[i], silent);
            }
        },

        checkAll: function (silent) {
            var checkedNodes= this.elements.getCheckedNodes(true);
            var jqCheck= checkedNodes.find('.check-icon');

            checkedNodes.addClass('node-checked');
            jqCheck.removeClass(this.settings.uncheckedIcon).addClass(this.settings.checkedIcon);

            if (!silent) {
                var context= this;
                checkedNodes.each(function(){
                    var nodeId= $(this).data('id');
                    context.elements.original.trigger('nodeChecked', nodeId);
                });
            }
        },

        uncheckAll: function (silent) {
            var uncheckedNodes= this.elements.getCheckedNodes(false);
            var jqCheck= uncheckedNodes.find('.check-icon');

            uncheckedNodes.removeClass('node-checked');            
            jqCheck.removeClass(this.settings.checkedIcon).addClass(this.settings.uncheckedIcon);

            if (!silent) {
                var context= this;
                uncheckedNodes.each(function(){
                    var nodeId= $(this).data('id');
                    context.elements.original.trigger('nodeUnchecked', nodeId);
                });
            }
        },

        // -------------------------------------------------------------------
        // 启用 / 禁用
        // -------------------------------------------------------------------

        setDisabledState: function (nodeId, state, silent, ignoreChildren) {
            var jqNode= this.elements.getNode(nodeId);

            if (state) {
                jqNode.addClass('node-disabled');

                // Disable all other states
                this.setExpandedState(nodeId, false, silent, ignoreChildren);
                this.setSelectedState(nodeId, false, silent);
                this.setCheckedState(nodeId, false, silent);

                if (!silent) {
                    this.elements.original.trigger('nodeDisabled', nodeId);
                }
            }
            else {
                jqNode.removeClass('node-disabled');

                if (!silent) {
                    this.elements.original.trigger('nodeEnabled', nodeId);
                }
            }
        },

        enableNode: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.setDisabledState(nodeIds[i], false, silent);
            }
        },

        disableNode: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.setDisabledState(nodeIds[i], true, silent);
            }
        },

        toggleDisabledState: function (nodeId, silent) {
            var jqNode= this.elements.getNode(nodeId);
            var state= jqNode.hasClass('node-disabled');

            this.setDisabledState(nodeId, !state, silent);
        },

        toggleNodeDisabled: function (nodeIds, silent) {
            for(var i=0; i<nodeIds.length; i++){
                this.toggleDisabledState(nodeIds[i], silent);
            }
        },

        disableAll: function (silent, ignoreChildren) {
            // var identifiers = this.findNodes('false', 'g', 'state.disabled');
            // this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            //     this.setDisabledState(node, true, options);
            // }, this));

            
            var enabledNodes= this.elements.getDisabledNodes(true);
            enabledNodes.addClass('node-disabled');

            var context= this;
            enabledNodes.each(function(){
                var nodeId= $(this).data('id');

                // Disable all other states
                context.setExpandedState(nodeId, false, silent, ignoreChildren);
                context.setSelectedState(nodeId, false, silent);
                context.setCheckedState(nodeId, false, silent);

                if (!silent) {
                    context.elements.original.trigger('nodeDisabled', nodeId);
                }
            });
        },

        enableAll: function (silent, ignoreChildren) {
            // var identifiers = this.findNodes('true', 'g', 'state.disabled');
            // this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
            //     this.setDisabledState(node, false, options);
            // }, this));
            
            var disabledNodes= this.elements.getDisabledNodes(false);
            disabledNodes.removeClass('node-disabled');

            var context= this;
            disabledNodes.each(function(){
                var nodeId= $(this).data('id');

                // // Enable all other states
                // context.setExpandedState(nodeId, true, silent, ignoreChildren);
                // context.setSelectedState(nodeId, true, silent);
                // context.setCheckedState(nodeId, true, silent);

                if (!silent) {
                    context.elements.original.trigger('nodeEnabled', nodeId);
                }
            });            
        },




        // getNode: function (nodeId) {
        //     return this.nodes[nodeId];
        // },

        // /**
        //     Returns the parent node of a given node, if valid otherwise returns undefined.
        //     @param {Object|Number} identifier - A valid node or node id
        //     @returns {Object} node - The parent node
        // */
        // getParent: function (identifier) {
        //     var node = this.identifyNode(identifier);
        //     return this.nodes[node.parentId];
        // },

        // /**
        //     Returns an array of sibling nodes for a given node, if valid otherwise returns undefined.
        //     @param {Object|Number} identifier - A valid node or node id
        //     @returns {Array} nodes - Sibling nodes
        // */
        // getSiblings: function (identifier) {
        //     var node = this.identifyNode(identifier);
        //     var parent = this.getParent(node);
        //     var nodes = parent ? parent.nodes : this.data;
        //     return nodes.filter(function (obj) {
        //             return obj.nodeId !== node.nodeId;
        //         });
        // },


        



        // /**
        //     Reveals a given tree node, expanding the tree from node to root.
        //     @param {Object|Number|Array} identifiers - A valid node, node id or array of node identifiers
        //     @param {optional Object} options
        // */
        // revealNode: function (identifiers, options) {
        //     this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
        //         var parentNode = this.getParent(node);
        //         while (parentNode) {
        //             this.setExpandedState(parentNode, true, options);
        //             parentNode = this.getParent(parentNode);
        //         }
        //     }, this));

        //     this.refresh();
        // },

        

        

        

        // /*
        //     Identifies a node from either a node id or object
        // */
        // identifyNode: function (identifier) {
        //     return ((typeof identifier) === 'number') ? this.nodes[identifier] : identifier;
        // },

        search: function (pattern, options) {
            var searchOptions = {
                ignoreCase: true,
                exactMatch: false,
                revealResults: true
            };

            options = $.extend({}, searchOptions, options);

            this.clearSearch();

            var results = [];
            if (pattern && pattern.length > 0) {

                if (options.exactMatch) {
                    pattern = '^' + pattern + '$';
                }

                var modifier = 'g';
                if (options.ignoreCase) {
                    modifier += 'i';
                }

                results = this.findNodes(pattern, modifier);

                // // Add searchResult property to all matching nodes
                // // This will be used to apply custom styles
                // // and when identifying result to be cleared
                // $.each(results, function (index, node) {
                //     node.searchResult = true;
                // })
            }

            // // If revealResults, then render is triggered from revealNode
            // // otherwise we just call render.
            // if (options.revealResults) {
            //     this.revealNode(results);
            // }
            // else {
            //     this.refresh();
            // }

            this.elements.original.trigger('searchComplete', $.extend(true, {}, results));

            return results;
        },

        clearSearch: function () {

            // options = $.extend({}, { render: true }, options);

            // var results = $.each(this.findNodes('true', 'g', 'searchResult'), function (index, node) {
            //     node.searchResult = false;
            // });

            // if (options.render) {
            //     this.refresh();  
            // }

            var searchResults= this.elements.getSearchResultNodes();
            searchResults.removeClass('search-result');
            
            this.elements.original.trigger('searchCleared');    // , $.extend(true, {}, results)
        },

        findNodes: function (pattern, modifier, attribute) {

            modifier = modifier || 'g';
            attribute = attribute || 'text';

            var context = this;
            // return $.grep(this.nodes, function (node) {
            //     var val = context.getNodeValue(node, attribute);
            //     if (typeof val === 'string') {
            //         return val.match(new RegExp(pattern, modifier));
            //     }
            // });

            var allNodes= this.elements.getAllNodes();
            return $.grep(allNodes, function (element) {                
                var val = $(element).text();
                return val.match(new RegExp(pattern, modifier));
            });
        },

        destroy: function () {
            this.container.empty();
            this.container = null;
            // Switch off events
            this.unsubscribeEvents();
        },
        // 取消事件监听
        unbindEvents: function () {
            this.elements.original.off('click');
            this.elements.original.off('nodeChecked');
            this.elements.original.off('nodeCollapsed');
            this.elements.original.off('nodeDisabled');
            this.elements.original.off('nodeEnabled');
            this.elements.original.off('nodeExpanded');
            this.elements.original.off('nodeSelected');
            this.elements.original.off('nodeUnchecked');
            this.elements.original.off('nodeUnselected');
            // this.elements.original.off('searchComplete');
            // this.elements.original.off('searchCleared');
        },
        // 监听事件
        bindEvents: function () {

            this.unbindEvents();

            this.elements.original.on('click', $.proxy(this.clickHandler, this));
            // 节点勾选
            if (typeof (this.settings.onNodeChecked) === 'function') {
                this.elements.original.on('nodeChecked', this.settings.onNodeChecked);
            }
            // 节点收起
            if (typeof (this.settings.onNodeCollapsed) === 'function') {
                this.elements.original.on('nodeCollapsed', this.settings.onNodeCollapsed);
            }
            // 节点禁用
            if (typeof (this.settings.onNodeDisabled) === 'function') {
                this.elements.original.on('nodeDisabled', this.settings.onNodeDisabled);
            }
            // 节点启用
            if (typeof (this.settings.onNodeEnabled) === 'function') {
                this.elements.original.on('nodeEnabled', this.settings.onNodeEnabled);
            }
            // 节点展开
            if (typeof (this.settings.onNodeExpanded) === 'function') {
                this.elements.original.on('nodeExpanded', this.settings.onNodeExpanded);
            }
            // 节点选中
            if (typeof (this.settings.onNodeSelected) === 'function') {
                this.elements.original.on('nodeSelected', this.settings.onNodeSelected);
            }
            // 节点取消勾选
            if (typeof (this.settings.onNodeUnchecked) === 'function') {
                this.elements.original.on('nodeUnchecked', this.settings.onNodeUnchecked);
            }
            // 节点取消选中
            if (typeof (this.settings.onNodeUnselected) === 'function') {
                this.elements.original.on('nodeUnselected', this.settings.onNodeUnselected);
            }
            // // 搜索完成
            // if (typeof (this.settings.onSearchComplete) === 'function') {
            //     this.elements.original.on('searchComplete', this.settings.onSearchComplete);
            // }
            // // 搜索结果清除
            // if (typeof (this.settings.onSearchCleared) === 'function') {
            //     this.elements.original.on('searchCleared', this.settings.onSearchCleared);
            // }
        }
    });
});




        // API

        // /**
        //     Find nodes that match a given criteria
        //     @param {String} pattern - A given string to match against
        //     @param {optional String} modifier - Valid RegEx modifiers
        //     @param {optional String} attribute - Attribute to compare pattern against
        //     @return {Array} nodes - Nodes that match your criteria
        // */
        // findNodes: function (pattern, modifier, attribute) {

        //     modifier = modifier || 'g';
        //     attribute = attribute || 'text';

        //     var context = this;
        //     return $.grep(this.nodes, function (node) {
        //         var val = context.getNodeValue(node, attribute);
        //         if (typeof val === 'string') {
        //             return val.match(new RegExp(pattern, modifier));
        //         }
        //     });
        // },

        // /**
        //     Returns an array of selected nodes.
        //     @returns {Array} nodes - Selected nodes
        // */
        // getSelected: function () {
        //     return this.findNodes('true', 'g', 'state.selected');
        // },

        // /**
        //     Returns an array of unselected nodes.
        //     @returns {Array} nodes - Unselected nodes
        // */
        // getUnselected: function () {
        //     return this.findNodes('false', 'g', 'state.selected');
        // },

        // /**
        //     Returns an array of expanded nodes.
        //     @returns {Array} nodes - Expanded nodes
        // */
        // getExpanded: function () {
        //     return this.findNodes('true', 'g', 'state.expanded');
        // },

        // /**
        //     Returns an array of collapsed nodes.
        //     @returns {Array} nodes - Collapsed nodes
        // */
        // getCollapsed: function () {
        //     return this.findNodes('false', 'g', 'state.expanded');
        // },

        // /**
        //     Returns an array of checked nodes.
        //     @returns {Array} nodes - Checked nodes
        // */
        // getChecked: function () {
        //     return this.findNodes('true', 'g', 'state.checked');
        // },

        // /**
        //     Returns an array of unchecked nodes.
        //     @returns {Array} nodes - Unchecked nodes
        // */
        // getUnchecked: function () {
        //     return this.findNodes('false', 'g', 'state.checked');
        // },

        // /**
        //     Returns an array of disabled nodes.
        //     @returns {Array} nodes - Disabled nodes
        // */
        // getDisabled: function () {
        //     return this.findNodes('true', 'g', 'state.disabled');
        // },

        // /**
        //     Returns an array of enabled nodes.
        //     @returns {Array} nodes - Enabled nodes
        // */
        // getEnabled: function () {
        //     return this.findNodes('false', 'g', 'state.disabled');
        // },
