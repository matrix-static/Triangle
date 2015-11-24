Jx().package("T.UI.Components", function(J){

    // 严格模式
    'use strict';

    // 全局变量、函数、对象
    var _currentPluginId = 0;
    
    var defaults = {
        //orgselectNames: '一级名称,二级名称,三级名称',
        dataUrl: ''
    };
    var attributeMap = {
        //orgselectNames: 'orgslt-names',
        dataUrl: 'data-url'
        // dataUrlUsers: 'data-url-users',
        // dataUrlOrgs: 'data-url-orgs'
    };


    var OrgselectModal=new J.Class({
        data: {},
        states: {},
        init:function(elements, options, value){
            this.inputElements = elements;

            // 初始化选项
            //this.initSettings(options);
            // 直接使用地址类实例的设置
            this.settings=options;
            
            // 这里保存数组
            // this.value=value;
            this.value=value ? value.split(',') : [];

            // // 状态
            // this.states={};

            // 初始化数据
            // this.data=data;
            // this.getData();
            var context= this;
            var d= $.Deferred();
            $.when(this.getData(d))
             .done(function(){
                context.render();
             });

            // var d1= $.Deferred();
            // var d2= $.Deferred();
            // $.when(this.getDataUser(d1), this.getDataOrgs(d2))
            //  .done(function(){
            //     context.render();
            //  });

            // 构建html DOM
            this.buildHtml();
            this.initElements();
            
            //this.transferAttributes();

            // 绑定事件
            this.bindEvents();
            // 绑定事件接口
            this.bindEventsInterface();

            // 根据值，状态，设置等刷新视图
            this.reflash();
        },
        getData:function(d){
            if(this.settings.data){
                this.data=$.extend(true, [], this.settings.data);
                delete this.settings.data;

                d.resolve();

                return d.promise();
            }
            var context= this;
            $.ajax({
                dataType: 'json',
                url: context.settings.dataUrl,
                data: {},
                success: function(data){
                    context.data= context.parseData(data);
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
            var innerData=[];
            for(var i=0; i<data.length; i++){
                var d=data[i];
                // var orgPath=d.OrgPath.split().join(',');
                var item={
                    id: d.id,
                    name: d.name,
                    text: d.name,
                    nodes: []
                };

                innerData[innerData.length]=item;

                if(d.nodes){
                    // var n2=[];
                    for(var j=0; j<d.nodes.length; j++){
                        var d2=d.nodes[j];
                        // var orgPath=d.OrgPath.split().join(',');
                        var i2={
                            id: d2.id,
                            name: d2.name,
                            text: d2.name,
                            nodes: []
                        };

                        item.nodes[item.nodes.length]=i2;

                        if(d2.nodes){
                            // var n3=[];
                            for(var k=0; k<d2.nodes.length; k++){
                                var d3=d2.nodes[k];
                                // var orgPath=d.OrgPath.split().join(',');
                                var i3={
                                    id: d3.id,
                                    name: d3.name,
                                    text: d3.name,
                                    nodes: []
                                };

                                item.nodes[j].nodes[item.nodes[j].nodes.length]=i3;

                                if(d3.nodes){
                                    // var n4=[];
                                    for(var l=0; l<d3.nodes.length; l++){
                                        var d4=d3.nodes[l];
                                        // var orgPath=d.OrgPath.split().join(',');
                                        var i4={
                                            id: d4.id,
                                            name: d4.name,
                                            text: d4.name
                                        };

                                        //

                                        item.nodes[j].nodes[k].nodes[item.nodes[j].nodes[k].nodes.length]=i4;
                                    }
                                    // item.nodes[j].nodes[k].nodes=n4;
                                }

                                
                            }
                            // item.nodes[j].nodes=n3;
                        }
                    }
                    // item.nodes=n2;
                }

                
            }

            return innerData;
        },
        /*
        getDataUsers: function(d){
            // if(this.setting.data){
            //     this.data=$.extend(true, [], this.settings.data);
            //     delete this.settings.data;

            //     d.resolve();

            //     return d.promise();
            // }
            var context= this;
            $.ajax({
                dataType: 'json',
                url: context.settings.dataUrlUsers,
                data: {},
                success: function(data){
                    context.data.users= context.parseDataUsers(data);
                    d.resolve();
                },
                error: function(xmlHttpRequest, status, error){
                    alert('控件id：' + context.element.attr('id')+'，ajax获取数据失败!');
                    d.resolve();
                }
            });

            return d.promise();
        },
        getDataOrgs: function(){
            var context= this;
            $.ajax({
                dataType: 'json',
                url: context.settings.dataUrlOrgs,
                data: {},
                success: function(data){
                    context.data.users= context.parseDataOrgs(data);
                    d.resolve();
                },
                error: function(xmlHttpRequest, status, error){
                    alert('控件id：' + context.element.attr('id')+'，ajax获取数据失败!');
                    d.resolve();
                }
            });

            return d.promise();
        },
        parseDataUsers: function(data){
            var users=[];
            for(var i=0; i<data.length; i++){
                var d=data[i];
                // var orgPath=d.OrgPath.split().join(',');
                var user={
                    id: d.Id,
                    name: d.Name
                };

                users[users.length]=user;
            }

            return users;
        },
        parseDataOrgs: function(data){},*/
        buildHtml:function(){
            var htmlTitleFilter=''+
                '                       <select class="t-title-filter">'+
                '                           <option value="">请选择职务</option>'+
                '                           <option value="1">职务1</option>'+
                '                           <option value="2">职务2</option>'+
                '                           <option value="3">职务3</option>'+
                '                           <option value="-1">某职务1以上</option>'+
                '                           <option value="-2">某职务2以上</option>'+
                '                           <option value="-3">某职务3以下</option>'+
                '                       </select>';
            var htmlOrgTree=''+
                '            <div class="col-xs-4" style="padding-left:3px;">'+     //  padding-right:3px; border:1px solid #ccc;
                '                <div class="col-header" style="padding:6px;">'+
                '                    <input type="text" class="t-typeahead form-control" />'+
                '                </div>'+
                '                <div class="t-tree-wraper">'+
                '                <div class="t-tree">'+
                '                </div>'+
                '                </div>'+
                '            </div>';
            var rightselectId='t-os-rs_' + this.inputElements.original.data('plugin-id');
            var htmlRighselect=''+
                '            <div class="col-xs-8" style="padding-left:3px; padding-right:3px;">'+
                '                <div id="'+rightselectId+'" class="col-xs-5" style="padding-left:6px; padding-right:6px;">'+
                '                <div class="col-header">'+
                '                    <span>待选( <b class="t-forselect-count">0</b> )</span><br />'+
                htmlTitleFilter+
                '                    <input type="checkbox" class="t-inner" /><label>内部</label>'+
                '                    <input type="checkbox" class="t-outer" /><label>外部</label>'+
                '                </div>'+
                '                    <select '+
                '                        id="'+rightselectId+'"'+
                '                        multiple="multiple" '+
                '                        size="20" '+
                '                        class="form-control" '+
                '                        name="from[]">'+
                // '                        <option value="1">Item 01</option>'+
                // '                        <option value="2">Item 02</option>'+
                // '                        <option value="3">Item 03</option>'+
                '                    </select>'+
                '                </div>'+       
                '                <div class="col-xs-2">'+   //  style="padding-left:3px; padding-right:3px;"
                '                    <br /><br /><br /><br />'+ // <br /><br />
                '                    <button type="button" id="'+rightselectId+'_undo" class="btn btn-primary btn-block">撤销</button>'+
                '                    <button type="button" id="'+rightselectId+'_rightAll" class="btn btn-block btn-sm"><i class="glyphicon glyphicon-forward"></i></button>'+
                '                    <button type="button" id="'+rightselectId+'_rightSelected" class="btn btn-block btn-sm"><i class="glyphicon glyphicon-chevron-right"></i></button>'+
                '                    <button type="button" id="'+rightselectId+'_leftSelected" class="btn btn-block btn-sm"><i class="glyphicon glyphicon-chevron-left"></i></button>'+
                '                    <button type="button" id="'+rightselectId+'_leftAll" class="btn btn-block btn-sm"><i class="glyphicon glyphicon-backward"></i></button>'+
                '                    <button type="button" id="'+rightselectId+'_redo" class="btn btn-primary btn-block">重做</button>'+
                '                </div>'+
                '                <div class="col-xs-5" style="padding-left:6px; padding-right:6px;">'+
                '                    <div class="col-header">'+
                '                    <span>已选( <b class="t-selected-count">0</b> )</span><br />'+
                '                    </div>'+
                '                    <select '+
                '                        id="'+rightselectId+'_rightSelect" '+
                '                        multiple="multiple" '+
                '                        size="20" '+
                '                        class="form-control" '+
                '                        name="to[]">'+
                '                    </select>'+
                '                </div>'+
                '            </div>';
                var dialogId='t-orgselect-dialog' + this.inputElements.original.data('plugin-id');
                var htmlTemplate = '' +            
                '<div id="'+dialogId+'" class="t-orgselect-dialog modal" tabindex="-1" role="dialog">' +     //  fade
                '    <div class="modal-dialog" role="document">' + 
                '        <div class="modal-content">' + 
                '            <div class="modal-header">' + 
                '                <button type="button" class="close"><span aria-hidden="true">&times;</span></button>' + 
                '                <h4 class="modal-title">选择员工</h4>' + 
                '            </div>' + 
                '            <div class="modal-body">' + 
                '               <div class="row">' + 
                htmlOrgTree + 
                htmlRighselect + 
                //'                .a.b. ' + 

                '               </div>' + 
                '            </div>' + 
                '            <div class="modal-footer">' + 
                '                <button type="button" class="btn btn-default cancel">取消</button>' + 
                '                <button type="button" class="btn btn-primary confirm">确定</button>' + 
                '            </div>' + 
                '        </div>' + 
                '    </div>' + 
                '</div>';

            this.container=$(htmlTemplate);
            this.container.insertAfter(this.inputElements.view);
        },
        initElements:function(){
            var context=this;

            this.elements={
                confirm: $('.modal-footer button.confirm', this.container),
                typeahead: $('.col-header t-typeahead', this.container),
                orgTree: $('.modal-body .t-tree', this.container),
                rightselect: $('.modal-body .t-rightselect', this.container),
                forselectCount: $('.col-header t-forselect-count', this.container),
                selectedCount: $('.col-header t-selected-count', this.container),
                titleFilter: $('.col-header t-title-filter', this.container),
                inner: $('.col-header t-inner', this.container),
                outer: $('.col-header t-outer', this.container)
                // tabs: $('.t-level-tabs li', this.container),
                // contents: $('.t-level-content', this.container),
                // getTab: function(levelIndex){
                //     var tabSelector = '.t-level-tab-' + levelIndex;
                //     return $(tabSelector, context.container);
                // },
                // getContent: function(levelIndex){
                //     var contentSelector = '.t-level-' + levelIndex;
                //     return $(contentSelector,context.container);
                // },
                // getNodes: function(levelIndex){
                //     var nodesSelector='.t-level-'+ levelIndex +' li';
                //     return $(nodesSelector,context.container);
                // }
            };

            var typeahead= new T.UI.Components.Typeahead(this.elements.typeahead, {
                matcher: function(item){
                    var matcher= new RegExp(this.query, 'i');
                    var result= matcher.test(item.name);// || matcher.text(item.loginName) || matcher.text(item.spell);
                    return result;
                },
                updater: function(item){
                    var right=context.controls.rightselect.right;
                    if(right.find('option[value="'+item.id+'"]').length===0){
                        right.append('<option value="'+item.id+'">'+item.name+"</option");

                        context._updateSelectedCount();
                    }
                    return item;
                }
            });

            var dialogId='#t-orgselect-dialog' + this.inputElements.original.data('plugin-id');
            // TODO: 这里被$()执行了两次
            // this.pop= new T.UI.Components.Modal(this.inputElements.button[0], {modalId:dialogId, backdrop:'static'});
            // this.rightselect= new T.UI.Components.RightSelect(this.elements.rightselect[0]);
            var pop= new T.UI.Components.Modal(this.inputElements.button, {modalId:dialogId, backdrop:'static'});
            var rightselect= new T.UI.Components.RightSelect(this.elements.rightselect,{
                afterMoveToRight: function(left, right, options){
                    context._updateForselectedCount();
                    context._updateSelectedCount();
                },
                afterMoveToLeft: function(left, right, options){
                    context._updateForselectedCount();
                    context._updateSelectedCount();
                }
            });

            this.controls={
                typeahead: typeahead,
                tree: null,
                pop: pop,
                rightselect: rightselect
            };
        },
        bindEvents: function(){
            var context=this;
            var elements=this.elements;

            this.elements.confirm.on('click', $.proxy(this.onConfirm, this));
            this.elements.titleFilter.on('change', $.proxy(this._renderLeft, this));
            this.elements.inner.on('click', $.proxy(this._renderLeft, this));
            this.elements.outer.on('click', $.proxy(this._renderLeft, this));

            // this.elements.close.on('click', $.proxy(this.hide, this));
            // this.elements.cancel.on('click', $.proxy(this.hide, this));
        },
        bindEventsInterface: function () {},
        onNodeSelected: function(e, data){
            if(!data.nodes){
                return;
            }

            var nodes= $.grep(data.nodes, function(node){
                // var orgId= data.id;
                // var filter= '.'+orgId+'>';
                // return node.path.indexOf(filter)>0;
                return true;
            });

            this.states.leftUsers=nodes;

            this._renderLeft();
        },
        onConfirm: function(){
            this.value=[];
            var options=this.controls.rightselect.elements.right.children();
            for(var i=0; i<options.length; i++){
                var jqOption=$(options[i]);
                this.value[this.value.length]=jqOption.val();
            }

            this.controls.pop.hide();
            this._renderValue();
        },
        render: function(){
            this._renderTypeahead();
            this._renderOrgTree();
            this._renderValue();
        },
        _renderTypeahead: function(){
            this.controls.typeahead.setSource(this.data.users);
        },
        _renderOrgTree: function(){
            var context= this;
            this.controls.tree= new T.UI.Components.Tree(this.elements.orgTree,{
                // showTags: true,  // 不好调整css
                levels: 1,
                enableTitle: true,
                data: context.data,
                onNodeSelected: function(e, data){
                    context.onNodeSelected(e, data);
                }
            });
        },
        _renderLeft: function(){
            var users= this.states.leftUsers;

            var title= this.elements.titleFilter.val();
            var showInner=this.elements.inner.is(':checked');
            var showOuter=this.elements.outer.is(':checked');

            var right= this.controls.rightselect.elements.right;
            var left= this.controls.rightselect.elements.left;
            left.empty();
            for(var i=0; i<users.length; i++){
                var item= users[i];
                if(
                    ((title === '') || (title>0 && item.titleSortNo == title) || (title<=0 && item.titleSortNo <= -title))
                    && ((showInner && item.innerOuter == 'inner')||(showOuter && user.innerOuter == 'outer'))
                    && right.find('option[value="'+item.id+'"]').length===0
                ){
                    left.append('<option value="'+item.id+'">'+item.name+'</option>');
                }
            }

            this._updateForselectedCount();
        },
        _renderValue: function(){
            this.inputElements.dropdown.empty();
            this.controls.rightselect.elements.right.empty();
            this.inputElements.view.val('');
            this.inputElements.original.val('');

            if(this.value.length === 0){
                this._updateSelectedCount();
                return;
            }

            var items=[];
            for(var i=0; i<this.value.length; i++){
                for(var j=0; j<this.data.users.length; j++){
                    if(this.value[i]==this.data.users[j].id){
                        items[items.length]=this.data.users[j]
                        break;
                    }
                }
            }

            var viewValues= '';
            
            for(var i=0; i<items.length; i++){
                var item= items[i];

                this.controls.rightselect.elements.right.append('<option value="'+item.id+'">'+item.name+'</option>');
                this.inputElements.dropdown.append('<li><span>'+item.name+'</span><a href="#" data-t-id="'+item.id+'">&times;</a></li>');
                viewValues+= item.name + ',';
            }
            viewValues=viewValues.substr(0, viewValues.length-1);
            this.inputElements.view.val(viewValues);
            this.inputElements.original.val(this.value.join(','));

            this._updateSelectedCount();
            
            var context= this;
            this.inputElements.dropdown.find('li a').off('click');
            this.inputElements.dropdown.find('li a').on('click', function(e){
                e.preventDefault();
                e.stopPropagation();

                var id=$(this).attr('data-t-id');
                var index= context.value.indexOf(id);

                context.value= context.value.slice(0, index).concat(context.value.slice(index+1, context.value.length));
                context._renderValue();
            });

        },
        _updateForselectedCount: function(){
            var left= this.controls.rightselect.elements.left;
            this.elements.forselectCount.text(left.find('option').length);
        },
        _updateSelectedCount: function(){
            var right= this.controls.rightselect.elements.right;
            this.elements.selectedCount.text(right.find('option').length);
        },
        reflash: function(){},
        getPath: function(){},
        change: function(id, levelIndex){},
        show: function () {
            this.container.show();
        },
        hide: function(){
            this.container.hide();
            //alert(this.inputElements.original.val());
        }
    });


    this.Orgselect = new J.Class({extend : T.UI.BaseControl}, {
        defaults : defaults,
        attributeMap : attributeMap,
        // data:{},

        // 构造函数
        init:function(element, options){
            this.element = $(element);
            //this.settings,

            this.container,
            this.elements,

            this.value = this.element.val();

            // 区分一个页面中存在多个控件实例
            _currentPluginId += 1;
            this.element.data('plugin-id', _currentPluginId);

            // 初始化选项
            this.initSettings(options);

            // 初始化数据
            this.getData();

            // 构建html DOM
            this.buildHtml();
            // 初始化 html DOM 元素
            this.initElements();
            this.transferAttributes();

            // 创建 树型 菜单对象
            //this.menu=new OrgsltMenu(this.elements, this.settings);

            // 绑定事件
            this.bindEvents();
            // 绑定事件接口
            this.bindEventsInterface();
        },
        buildHtml:function () {
            var htmlTemplate = ''+ 
                '<div class="t-orgselect-container input-group">' + 
                '    <input type="text" class="form-control" data-toggle="dropdown">' + 
                '    <div class="input-group-btn">' + 
                '        <button type="button" class="btn btn-default">' +     //  data-toggle="modal" data-target="#myModal">
                '            <span class="glyphicon glyphicon-user"></span>' + 
                '        </button>' + 
                '    </div>' + 
                '    <ul class="t-orgselect-menu dropdown-menu">'+
                '    </ul>'+
                '</div>';

            this.container = $(htmlTemplate);
            this.element.before(this.container);
        },
        getData:function(){
            var context = this;
            // $.ajax({
            //     dataType: 'json',
            //     url: this.settings.dataUrl,
            //     data: {},
            //     success: function(data){
            //         context.createModal(data);
            //     },
            //     error: function(xmlHttpRequest, status, error){
            //         alert('控件id:' + context.element.attr('id') + ' , ajax 获取数据失败!');
            //     }
            // });
        },
        createModal:function(data){
            // this.modal=new OrgselectModal(this.elements, this.settings, data);
        },
        initElements:function () {
            this.elements = {
                original: this.element,
                view: $('input[type=text]', this.container),
                button: $('button', this.container),
                dropdown: $('.t-orgselect-menu', this.container),
            };

            this.elements.original.hide();
            this.elements.view.prop("readonly","readonly");

            this.modal= new OrgselectModal(this.elements,this.settings, this.value);
        },
        bindEvents:function () {
            var context=this;

            var element=this.element;
            var elements=this.elements;

            // element.on('keydown', function(e) {
            //     ;
            // });

            // elements.view
            //     .on('focus',    $.proxy(this._showMenu, this))      // $proxy 用 当前 this 替代 控件 this
            //     .on('blur',     $.proxy(this._hideMenu, this));
        },        
        bindEventsInterface:function () {
            var context=this;
            var element=this.element;

            // element.on('orgslt.foo', function() {
            //     context.foo();
            //     foo();
            // });
        },
        transferAttributes: function(){
            //this.options.placeholder = this.$source.attr('data-placeholder') || this.options.placeholder
            //this.$element.attr('placeholder', this.options.placeholder)
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
        enable: function(){
            this.element.attr('disabled', false);
            this.elements.view.attr('disabled', false);
            this.disabled=false;
        },
        disable: function(){
            this.element.attr('disabled', true);
            this.elements.view.attr('disabled', true);
            this.disabled=true;
        },
        destroy: function(){}
    });

});




/* orgselect javascript jQuery */

(function($) {
    // 严格模式
    'use strict';

    // 控件类名
    var pluginName = "orgslt";

        // 胶水代码
    $.fn[pluginName] = function(options) {

        this.each(function () {
            var jqElement = $(this);
            if (jqElement.data('plugin-ref')) {
                jqElement.data('plugin-ref').destroy();
            }
            jqElement.data('plugin-ref', new T.UI.Components.Orgselect(this, $.extend(true, {}, options)));
        });

        return this;

    };

})(jQuery);