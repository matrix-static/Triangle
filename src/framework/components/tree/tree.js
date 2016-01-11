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

    var nodeOptions = {
        silent: false,
        ignoreChildren: false
    };

    

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

                // if not provided set selectable default value
                if (!child.hasOwnProperty('selectable')) {
                    child.selectable = true;
                }

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
            element.empty().append(this.container);
        },
        initElements: function(element){
            var context= this;

            this.elements={
                original: element,
                allNodes: $('li', this.container),
                getSelectedNodes: function(){
                    var selectedNodes = $('li.node-selected', this.container);
                    return selectedNodes;
                },
                getNode: function(nodeId){
                    var child= $('li[data-nodeid="'+nodeId+'"]', this.container);
                    return child;
                },
                getChildNodes: function(nodeId){
                    var node= context.getNode(nodeId);
                    var children= $('li[data-nodepath^="'+node.path+'-"]', this.container);
                    return children;
                }
            };
        },

        // Starting from the root node, and recursing down the
        // structure we build the tree one node at a time
        buildTree: function (nodes, level) {
            if (!nodes) return;
            level += 1;

            for(var i=0; i<nodes.length; i++){
                var node=nodes[i];

                var item= this.buildItem(node, level);

                // Add item to the tree
                this.container.append(item);

                // Recursively add child ndoes
                if (node.nodes && node.state.expanded && !node.state.disabled) {
                    this.buildTree(node.nodes, level);
                }
            }
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
                '   data-nodeid="'+node.nodeId+'"'+
                '   data-nodepath="'+node.path+'">'+
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
            var node = this.findNode(target);
            if (!node || node.state.disabled) {
                return;
            }
            
            var classList = target.attr('class') ? target.attr('class').split(' ') : [];
            if ((classList.indexOf('expand-icon') !== -1)) {
                this.toggleExpandedState(node, nodeOptions);
                this.refresh();

                return;
            }

            if ((classList.indexOf('check-icon') !== -1)) {                
                this.toggleCheckedState(node, nodeOptions);
                this.refresh();

                return;
            }

            if (node.selectable) {
                this.toggleSelectedState(node, nodeOptions);
            } else {
                this.toggleExpandedState(node, nodeOptions);
            }

            // this.refresh();
        },

        // Looks up the DOM for the closest parent list item to retrieve the
        // data attribute nodeid, which is used to lookup the node in the flattened structure.
        findNode: function (target) {
            var nodeId = target.closest('li.list-group-item').attr('data-nodeid');
            var node = this.nodes[nodeId];

            if (!node) {
                console.log('Error: node does not exist');
            }
            return node;
        },

        toggleExpandedState: function (node, options) {
            if (!node) return;
            this.setExpandedState(node, !node.state.expanded, options);
        },

        setExpandedState: function (node, state, options) {

            if (state === node.state.expanded) return;

            if (state && node.nodes) {

                // Expand a node
                node.state.expanded = true;
                if (!options.silent) {
                    this.elements.original.trigger('nodeExpanded', $.extend(true, {}, node));
                }
            }
            else if (!state) {

                // Collapse a node
                node.state.expanded = false;
                if (!options.silent) {
                    this.elements.original.trigger('nodeCollapsed', $.extend(true, {}, node));
                }

                // Collapse child nodes
                if (node.nodes && !options.ignoreChildren) {
                    $.each(node.nodes, $.proxy(function (index, node) {
                        this.setExpandedState(node, false, options);
                    }, this));
                }
            }
        },

        toggleSelectedState: function (node, options) {
            if (!node) return;
            this.setSelectedState(node, !node.state.selected, options);
        },

        setSelectedState: function (node, state, options) {

            if (state === node.state.selected) return;

            if (state) {

                // If multiSelect false, unselect previously selected
                if (!this.settings.multiSelect) {
                    // $.each(this.findNodes('true', 'g', 'state.selected'), $.proxy(function (index, node) {
                    //     this.setSelectedState(node, false, options);
                    // }, this));
                    this.elements.getSelectedNodes().removeClass('node-selected');
                }

                // Continue selecting node
                // node.state.selected = true;
                this.elements.getNode(node.nodeId).addClass('node-selected');
                if (!options.silent) {
                    this.elements.original.trigger('nodeSelected', $.extend(true, {}, node));
                }
            }
            else {

                // Unselect node
                // node.state.selected = false;
                this.elements.getNode(node.nodeId).removeClass('node-selected');
                if (!options.silent) {
                    this.elements.original.trigger('nodeUnselected', $.extend(true, {}, node));
                }
            }
        },

        toggleCheckedState: function (node, options) {
            if (!node) return;
            this.setCheckedState(node, !node.state.checked, options);
        },

        setCheckedState: function (node, state, options) {

            if (state === node.state.checked) return;

            if (state) {

                // Check node
                node.state.checked = true;

                if (!options.silent) {
                    this.elements.original.trigger('nodeChecked', $.extend(true, {}, node));
                }
            }
            else {

                // Uncheck node
                node.state.checked = false;
                if (!options.silent) {
                    this.elements.original.trigger('nodeUnchecked', $.extend(true, {}, node));
                }
            }
        },

        setDisabledState: function (node, state, options) {

            if (state === node.state.disabled) return;

            if (state) {

                // Disable node
                node.state.disabled = true;

                // Disable all other states
                this.setExpandedState(node, false, options);
                this.setSelectedState(node, false, options);
                this.setCheckedState(node, false, options);

                if (!options.silent) {
                    this.elements.original.trigger('nodeDisabled', $.extend(true, {}, node));
                }
            }
            else {

                // Enabled node
                node.state.disabled = false;
                if (!options.silent) {
                    this.elements.original.trigger('nodeEnabled', $.extend(true, {}, node));
                }
            }
        },      

        getNode: function (nodeId) {
            return this.nodes[nodeId];
        },

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

        /**
            Returns an array of selected nodes.
            @returns {Array} nodes - Selected nodes
        */
        getSelected: function () {
            return this.findNodes('true', 'g', 'state.selected');
        },

        /**
            Returns an array of unselected nodes.
            @returns {Array} nodes - Unselected nodes
        */
        getUnselected: function () {
            return this.findNodes('false', 'g', 'state.selected');
        },

        /**
            Returns an array of expanded nodes.
            @returns {Array} nodes - Expanded nodes
        */
        getExpanded: function () {
            return this.findNodes('true', 'g', 'state.expanded');
        },

        /**
            Returns an array of collapsed nodes.
            @returns {Array} nodes - Collapsed nodes
        */
        getCollapsed: function () {
            return this.findNodes('false', 'g', 'state.expanded');
        },

        /**
            Returns an array of checked nodes.
            @returns {Array} nodes - Checked nodes
        */
        getChecked: function () {
            return this.findNodes('true', 'g', 'state.checked');
        },

        /**
            Returns an array of unchecked nodes.
            @returns {Array} nodes - Unchecked nodes
        */
        getUnchecked: function () {
            return this.findNodes('false', 'g', 'state.checked');
        },

        /**
            Returns an array of disabled nodes.
            @returns {Array} nodes - Disabled nodes
        */
        getDisabled: function () {
            return this.findNodes('true', 'g', 'state.disabled');
        },

        /**
            Returns an array of enabled nodes.
            @returns {Array} nodes - Enabled nodes
        */
        getEnabled: function () {
            return this.findNodes('false', 'g', 'state.disabled');
        },


        /**
            Set a node state to selected
            @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
            @param {optional Object} options
        */
        selectNode: function (identifiers, options) {
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.setSelectedState(node, true, options);
            }, this));

            // this.refresh();
        },

        /**
            Set a node state to unselected
            @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
            @param {optional Object} options
        */
        unselectNode: function (identifiers, options) {
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.setSelectedState(node, false, options);
            }, this));

            this.refresh();
        },

        /**
            Collapse a given tree node
            @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
            @param {optional Object} options
        */
        collapseNode: function (identifiers, options) {
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.setExpandedState(node, false, options);
            }, this));

            this.refresh();
        },

        /**
            Toggles a node selected state; selecting if unselected, unselecting if selected.
            @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
            @param {optional Object} options
        */
        toggleNodeSelected: function (identifiers, options) {
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.toggleSelectedState(node, options);
            }, this));

            this.refresh();
        },

        /**
            Collapse all tree nodes
            @param {optional Object} options
        */
        collapseAll: function (options) {
            var identifiers = this.findNodes('true', 'g', 'state.expanded');
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.setExpandedState(node, false, options);
            }, this));

            this.refresh();
        },

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

        /**
            Expand a given tree node
            @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
            @param {optional Object} options
        */
        expandNode: function (identifiers, options) {
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.setExpandedState(node, true, options);
                if (node.nodes && (options && options.levels)) {
                    this.expandLevels(node.nodes, options.levels-1, options);
                }
            }, this));

            this.refresh();
        },

        /**
            Toggles a nodes expanded state; collapsing if expanded, expanding if collapsed.
            @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
            @param {optional Object} options
        */
        toggleNodeExpanded: function (identifiers, options) {
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.toggleExpandedState(node, options);
            }, this));
            
            this.refresh();
        },

        expandLevels: function (nodes, level, options) {
            options = $.extend({}, nodeOptions, options);

            $.each(nodes, $.proxy(function (index, node) {
                this.setExpandedState(node, (level > 0) ? true : false, options);
                if (node.nodes) {
                    this.expandLevels(node.nodes, level-1, options);
                }
            }, this));
        },

        /**
            Expand all tree nodes
            @param {optional Object} options
        */
        expandAll: function (options) {
            options = $.extend({}, nodeOptions, options);

            if (options && options.levels) {
                his.expandLevels(this.data, options.levels, options);
            }
            else {
                var identifiers = this.findNodes('false', 'g', 'state.expanded');
                this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                    this.setExpandedState(node, true, options);
                }, this));
            }

            this.refresh();
        },

        /**
            Check a given tree node
            @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
            @param {optional Object} options
        */
        checkNode: function (identifiers, options) {
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.setCheckedState(node, true, options);
            }, this));

            this.refresh();
        },

        /**
            Uncheck a given tree node
            @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
            @param {optional Object} options
        */
        uncheckNode: function (identifiers, options) {
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.setCheckedState(node, false, options);
            }, this));

            this.refresh();
        },

        /**
            Toggles a nodes checked state; checking if unchecked, unchecking if checked.
            @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
            @param {optional Object} options
        */
        toggleNodeChecked: function (identifiers, options) {
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.toggleCheckedState(node, options);
            }, this));

            this.refresh();
        },

        /**
            Check all tree nodes
            @param {optional Object} options
        */
        checkAll: function (options) {
            var identifiers = this.findNodes('false', 'g', 'state.checked');
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.setCheckedState(node, true, options);
            }, this));

            this.refresh();
        },

        /**
            Uncheck all tree nodes
            @param {optional Object} options
        */
        uncheckAll: function (options) {
            var identifiers = this.findNodes('true', 'g', 'state.checked');
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.setCheckedState(node, false, options);
            }, this));

            this.refresh();
        },

        /**
            Enable a given tree node
            @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
            @param {optional Object} options
        */
        enableNode: function (identifiers, options) {
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.setDisabledState(node, false, options);
            }, this));

            this.refresh();
        },

        /**
            Disable a given tree node
            @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
            @param {optional Object} options
        */
        disableNode: function (identifiers, options) {
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.setDisabledState(node, true, options);
            }, this));

            this.refresh();
        },

        /**
            Toggles a nodes disabled state; disabling is enabled, enabling if disabled.
            @param {Object|Number} identifiers - A valid node, node id or array of node identifiers
            @param {optional Object} options
        */
        toggleNodeDisabled: function (identifiers, options) {
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.setDisabledState(node, !node.state.disabled, options);
            }, this));

            this.refresh();
        },

        /**
            Enable all tree nodes
            @param {optional Object} options
        */
        enableAll: function (options) {
            var identifiers = this.findNodes('true', 'g', 'state.disabled');
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.setDisabledState(node, false, options);
            }, this));

            this.refresh();
        },

        /**
            Disable all tree nodes
            @param {optional Object} options
        */
        disableAll: function (options) {
            var identifiers = this.findNodes('false', 'g', 'state.disabled');
            this.forEachIdentifier(identifiers, options, $.proxy(function (node, options) {
                this.setDisabledState(node, true, options);
            }, this));

            this.refresh();
        },

        

        /**
            Common code for processing multiple identifiers
        */
        forEachIdentifier: function (identifiers, options, callback) {

            options = $.extend({}, nodeOptions, options);

            if (!(identifiers instanceof Array)) {
                identifiers = [identifiers];
            }

            $.each(identifiers, $.proxy(function (index, identifier) {
                callback(this.identifyNode(identifier), options);
            }, this));  
        },

        /*
            Identifies a node from either a node id or object
        */
        identifyNode: function (identifier) {
            return ((typeof identifier) === 'number') ? this.nodes[identifier] : identifier;
        },

        // /**
        //     Searches the tree for nodes (text) that match given criteria
        //     @param {String} pattern - A given string to match against
        //     @param {optional Object} options - Search criteria options
        //     @return {Array} nodes - Matching nodes
        // */
        // search: function (pattern, options) {
        //     var searchOptions = {
        //         ignoreCase: true,
        //         exactMatch: false,
        //         revealResults: true
        //     };

        //     options = $.extend({}, searchOptions, options);

        //     this.clearSearch({ render: false });

        //     var results = [];
        //     if (pattern && pattern.length > 0) {

        //         if (options.exactMatch) {
        //             pattern = '^' + pattern + '$';
        //         }

        //         var modifier = 'g';
        //         if (options.ignoreCase) {
        //             modifier += 'i';
        //         }

        //         results = this.findNodes(pattern, modifier);

        //         // Add searchResult property to all matching nodes
        //         // This will be used to apply custom styles
        //         // and when identifying result to be cleared
        //         $.each(results, function (index, node) {
        //             node.searchResult = true;
        //         })
        //     }

        //     // If revealResults, then render is triggered from revealNode
        //     // otherwise we just call render.
        //     if (options.revealResults) {
        //         this.revealNode(results);
        //     }
        //     else {
        //         this.refresh();
        //     }

        //     this.elements.original.trigger('searchComplete', $.extend(true, {}, results));

        //     return results;
        // },

        // /**
        //     Clears previous search results
        // */
        // clearSearch: function (options) {

        //     options = $.extend({}, { render: true }, options);

        //     var results = $.each(this.findNodes('true', 'g', 'searchResult'), function (index, node) {
        //         node.searchResult = false;
        //     });

        //     if (options.render) {
        //         this.refresh();  
        //     }
            
        //     this.elements.original.trigger('searchCleared', $.extend(true, {}, results));
        // },

        /**
            Find nodes that match a given criteria
            @param {String} pattern - A given string to match against
            @param {optional String} modifier - Valid RegEx modifiers
            @param {optional String} attribute - Attribute to compare pattern against
            @return {Array} nodes - Nodes that match your criteria
        */
        findNodes: function (pattern, modifier, attribute) {

            modifier = modifier || 'g';
            attribute = attribute || 'text';

            var context = this;
            return $.grep(this.nodes, function (node) {
                var val = context.getNodeValue(node, attribute);
                if (typeof val === 'string') {
                    return val.match(new RegExp(pattern, modifier));
                }
            });
        },

        /**
            Recursive find for retrieving nested attributes values
            All values are return as strings, unless invalid
            @param {Object} obj - Typically a node, could be any object
            @param {String} attr - Identifies an object property using dot notation
            @return {String} value - Matching attributes string representation
        */
        getNodeValue: function (obj, attr) {
            var index = attr.indexOf('.');
            if (index > 0) {
                var _obj = obj[attr.substring(0, index)];
                var _attr = attr.substring(index + 1, attr.length);
                return this.getNodeValue(_obj, _attr);
            }
            else {
                if (obj.hasOwnProperty(attr)) {
                    return obj[attr].toString();
                }
                else {
                    return undefined;
                }
            }
        },

        // remove: function () {
        //     this.destroy();
        //     $.removeData(this, 'tree');
        // },

        destroy: function () {
            if (!this.initialized) return;

            this.container.remove();
            this.container = null;

            // Switch off events
            this.unsubscribeEvents();

            // Reset this.initialized flag
            this.initialized = false;
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