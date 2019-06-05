//全局变量
var cur_selector = null;
var arrElementAttr = [];
var arrDel = [];
var arrElementID = [];
var strRuleHtml = "";
var oInitElement = null;
var oInitSave = null;
var oTemplateValue = "";
var oTemplateText = "";
//空心圆端点样式设置
var Circle1 = {
    paintStyle: {
        strokeStyle: "#1e8151",
        fillStyle: "transparent",
        radius: 5,
        lineWidth: 2
    },		//端点的颜色样式
    connector: ["Straight", { stub: [10, 10], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }]  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
};

//页面初始化完成之后
$(function () {
    //0.初始化闭包对象
    oInitElement = new InitElementAttr();
    oInitSave = new SaveElement();
    var oInitDelete = new DeleteElement();
    var oInitAdd = new AddTemplate();
    var oInitEditModel = new GetEditModel();

    //1.初始化新建、保存、删除事件
    $("#btn_save").click(function () {
        oInitSave.Save();
    });
    $("#btn_delete").click(function () {
        oInitDelete.Delete();
    });
    $("#btn_add").click(function () {
        oInitAdd.InitAdd();
    });
   

    //2.初始化页面元素的自适应
    Resize();
    $(window).resize(function () {
        Resize();
    });
    $(window).bind('beforeunload', function () { return '确定离开当前页面吗？未保存的数据将会丢失！'; });

    $('#divContentLeftMenu').BootSideMenu({ side: "left", autoClose: false });
    $('#divRight').BootSideMenu({ side: "right", autoClose: false });

    //3.初始化拖拽和选择事件
    var oInitDrag = new InitDrag();
    oInitDrag.InitPlant();
    oRegionSelect = new RegionSelect({
        region: '#divCenter div.node',
        selectedClass: 'seled',
        parentId: "divCenter"
    });
    oRegionSelect.select();

   

    //6.初始化弹出框
    //$.Ewin.Dialog("div_dialog", "请输入模板名称", function () { }, function () { $(this).dialog("close"); }, function () {
    
    //    $(this).dialog("close");
    //});
    //6.初始化弹出框的保存按钮
    $("#btn_submit").click(function () {
        var strHtml_1 = "<option value='" + $("#text_new_template").val() + "'>" + $("#text_new_template").val() + "</option>";
        $("#sel_template").html(strHtml_1 + $("#sel_template").html());
        var arr = $("#divCenter .node");
        for (var i = 0; i < arr.length; i++) {
            jsPlumb.remove($(arr[i]), true);
        }
        $("#divRightContent").html("");
    });

    //连线样式下拉框的change事件
    $("#sel_linetype").change(function () {
        var strlinetype = "";
        var strlinecolor = "";
        if ($(this).val() == "1") {
            strlinetype = "Flowchart";
            strlinecolor = "red";
            hollowCircle.connector = ["Flowchart", { stub: [0, 0], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }];
        }
        else if ($(this).val() == "2") {
            strlinetype = "Straight";
            strlinecolor = "green";
            hollowCircle.connector = ["Straight", { stub: [0, 0], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }];
        }
        else if ($(this).val() == "3") {
            strlinetype = "Bezier";
            strlinecolor = "orange";
            hollowCircle.connector = ["Bezier", { stub: [0, 0], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }];
        }
        var arrnode = $("#divCenter").find(".node");
        for (var i = 0; i < arrnode.length; i++) {
            var arrendpoints = jsPlumb.getEndpoints($(arrnode[i]).attr("id"));
            if (arrendpoints == undefined || arrendpoints == null) {
                return;
            }
            var oconnector = arrendpoints[0].connector;
            if (oconnector == null || oconnector == undefined) {
                return;
            }
            oconnector[0] = strlinetype;
            var oconnectstyle = arrendpoints[0].connectorStyle;
            if (oconnectstyle == null || oconnectstyle == undefined) {
                return;
            }
            oconnectstyle.strokeStyle = strlinecolor;
        }
    });
});

//得到编辑的Model
var GetEditModel = function () {
    var oGetEditModel = new Object();

    oGetEditModel.Init = function (data, binittemplate) {
        var arrDataAttr = data.lstDataAttr;
        var arrAttr = data.PageAttr;
        if (binittemplate) {
            var strTemplateHtml = "";
            for (var i = 0; i < data.lstTemplate.length; i++) {
                strTemplateHtml += "<option value='" + data.lstTemplate[i].TM_TEMPLATE_ID + "'>" + data.lstTemplate[i].TM_TEMPLATE_NAME + "</option>";
            }
            $("#sel_template").html(strTemplateHtml);
        }
        if (arrAttr.length <= 0 || arrDataAttr.length <= 0) {
            return;
        }
        //1.1 添加已经存在的工厂元素到界面
        var strHtml_1 = "";
        var oDrag = new InitDrag();
        var arrplant = arrAttr

        for (var i = 0; i < arrplant.length; i++) {
            var arrCurSelector = Enumerable.From(arrDataAttr).Where("x=>x.ALTERNATEATTRIBUTE1=='" + arrplant[i].Id + "'").ToArray();
            if (arrCurSelector.length <= 0) {
                continue;
            }
            strHtml_1 += '<div class="node ' + arrplant[i].CssClass + '" dbtype="' + arrplant[i].Type + '" tag="' + arrCurSelector[0].TAG +
                       '" rule="' + arrCurSelector[0].RULE_TYPE + '" parentid="' + arrplant[i].ParentID +
                       '" onclick="oInitElement.GetPropertiesByType(\'' + arrplant[i].Type + '\',this)" style="height:' +
                       arrplant[i].Height + ';width:' + arrplant[i].Width + ';left:' + arrplant[i].Left + ';top:' +
                       arrplant[i].Top + ';"  id="' + arrplant[i].Id + '" ><label>' + arrplant[i].Html + '</label></div>';
        }
        $("#divCenter").append(strHtml_1);

        //1.2 注册连点样式
        jsPlumb.importDefaults({
            EndpointStyles: [{ fillStyle: '#1e8151' }, { fillStyle: '#1e8151' }],//起点和终点的颜色
            Endpoints: [['Dot', { radius: -1 }], ['Dot', { radius: -1 }]],
            ConnectionOverlays: [
                    ['Arrow', { location: 1 }],//设置箭头和终点的距离
                    ['Label', {
                        location: 0.1,
                        id: 'label',
                        cssClass: 'aLabel'
                    }]
            ]
        });

        //1.3 添加节点和连线
        for (var i = 0; i < arrAttr.length; i++) {
            jsPlumb.addEndpoint(arrAttr[i].Id, { anchors: "RightMiddle" }, hollowCircle);
            jsPlumb.addEndpoint(arrAttr[i].Id, { anchors: "BottomCenter" }, hollowCircle);
            jsPlumb.addEndpoint(arrAttr[i].Id, { anchors: "LeftMiddle" }, hollowCircle);
            jsPlumb.addEndpoint(arrAttr[i].Id, { anchors: "TopCenter" }, hollowCircle);
            jsPlumb.draggable(arrAttr[i].Id);
        }

        //1.4 注册连线
        for (var i = 0; i < data.lstJsConnections.length; i++) {
            jsPlumb.connect({
                source: data.lstJsConnections[i].SourceID,
                target: data.lstJsConnections[i].TargetID,
                anchors: ['RightMiddle', 'LeftMiddle']
            }, Circle1);
        }

        //1.5 注册已经存在工厂元素的可拖拽和可伸缩
        $("#divCenter .node").draggable({
            containment: "parent",
            start: function () {
                startMove();
            },
            drag: function (event, ui) { MoveSelectDiv(event, ui, $(this).attr("id")); jsPlumb.repaintEverything(); },
            stop: function () { jsPlumb.repaintEverything(); }
        });
        $("#divCenter .node").resizable({
            resize: function () {
                jsPlumb.repaintEverything();
            },
            stop: function (event, element) {
                jsPlumb.repaintEverything();
                //oInitElement.SendPropRequest("DTO_TM_PLANT", $(this));
            }
        });
    };
    return oGetEditModel;

};

//新建
var AddTemplate = function () {
    var oAddTemplate = new Object();

    oAddTemplate.InitAdd = function () {
        Ewin.confirm({ message: "请先保存当前模板，确定要新建模板吗？" }).on(function (e) {
            if (!e) {
                return;
            }
            //$(".ui-dialog-titlebar-close").hide();
            //$("#div_dialog").dialog("open");
            $('#myModal').modal();
        });
    };
    return oAddTemplate;
};

//保存
var SaveElement = function () {
    var oSave = new Object();

    oSave.Save = function () {
        //1.取得所有的连线
        var connects = [];
        $.each(jsPlumb.getAllConnections(), function (idx, connection) {
            connects.push({
                ConnectionId: connection.id,
                PageSourceId: connection.sourceId,
                PageTargetId: connection.targetId,
                SourceText: connection.source.innerText,
                TargetText: connection.target.innerText,
                DBType: $("#" + connection.sourceId).attr("dbtype")
            });
        });

        //2.取得所有的节点
        var blocks = [];
        $("#divCenter .node").each(function (idx, elem) {
            var $elem = $(elem);
            blocks.push({
                BlockId: $elem.attr('id'),
                BlockContent: $elem.find("label")[0].innerHTML,
                BlockX: parseInt($elem.css("left"), 10),
                BlockY: parseInt($elem.css("top"), 10),
                BlockWidth: $elem.css("width"),
                BlockHeight: $elem.css("height"),
                BlockTag: $elem.attr("tag"),
                ParentId: $elem.attr("parentid"),
                DBType: $elem.attr("dbtype"),
                BlockAttr: $elem.attr("rule")
            });
        });

        //4.转换为Json，发送到Ajax请求
        oTemplateText = $("#sel_template").find("option:selected").text();
        oTemplateValue = $("#sel_template").find("option:selected").val();
        var serliza = JSON.stringify(connects) + "&" + JSON.stringify(blocks) + "&" + JSON.stringify(arrDel);
        $.Ewin.AjaxPost("/api/PMCRule/SaveDragPage", { strJson: escape(serliza), strTemplateValue: oTemplateValue, strTemplateText: oTemplateText }, function (data, status) {
            if (data.TemplateId == undefined || data.TemplateId == null || data.TemplateId == "") {
                toastr.warning('保存失败');
                return;
            }
            Ewin.confirm({ message: "保存成功，是否立即进入查看界面？" }).on(function (e) {
                if (!e) {
                    return;
                }
                $(window).unbind('beforeunload');
                window.location.href = '/PMCRule/DragView?TemplateID=' + data.TemplateId;
            });
        }, function (e) {

        }, null);
    };

    return oSave;
};

//删除
var DeleteElement = function () {
    var oDeleteElement = new Object();

    //删除操作
    oDeleteElement.Delete = function () {
        Ewin.confirm({ message: "确定要删除选中元素吗？" }).on(function (e) {
            if (!e) {
                return;
            }
            //不允许级联删除
            var selectarr = getSelectedRegions();
            for (var i = 0; i < selectarr.length; i++) {
                jsPlumb.remove(selectarr[i], true);
            }
            jsPlumb.repaintEverything();
        });
    };
    return oDeleteElement;
};

//初始化右边属性框
var InitElementAttr = function () {
    var oElement = new Object();

    //0.拖拽界面元素的单击事件
    oElement.GetPropertiesByType = function (type, sthis) {
        var evt = window.event || arguments[0];
        cur_selector = $(sthis);
        oElement.SendPropRequest(type, cur_selector);
        //阻止浏览器的默认行为，取消冒泡
        //window.event.returnValue = false;

        evt.cancelBubble = true;
    };

    //1.发送Ajax请求，根据元素类型取元素属性
    oElement.SendPropRequest = function (type, seletor) {
		//String t = type;
		//console.log(t);
		console.log(type == "DTO_TM_PLANT");
		var strHtml_1 = "";
		$("#divRightContent").html("");
		strHtml_1 += "<div style='float:right;padding-top:0px;width:300px;height:auto;'><table class='table table-bordered' style='margin-top:15px;' cellpadding='5' border='1'>" +
                          "<tr><td><label>IP</label></td><td><input type='text' id='attr_facname'/></td></tr>" +
                          "<tr><td><label>频率</label></td><td><input type='text' id='attr_width'/></td></tr>" +
                          "<tr><td><label>解析方法</label></td><td><input type='text' id='attr_height'/></td></tr>" +
                          //"<tr><td><label>Tag点</label></td><td><input type='text' id='attr_tag'/></td></tr>"+
                          "<tr><td><label>协议</label></td><td><select id='attr_rule' style='width:100px'><option value='1'>TCP</option></select></td></tr>";
		strHtml_1 += "</table></div>";
		if(type == "DTO_TM_PLANT")
		{
			
		strHtml_1 = "<div style='float:right;padding-top:0px;width:300px;height:auto;'><table class='table table-bordered' style='margin-top:15px;' cellpadding='5' border='1'>" +
                          "<tr><td><label>IP</label></td><td><input type='text' /></td></tr>" +
                          "<tr><td><label>频率</label></td><td><input type='text' /></td></tr>" +
                          "<tr><td><label>解析方法</label></td><td><input type='text' /></td></tr>" +
                          //"<tr><td><label>Tag点</label></td><td><input type='text' id='attr_tag'/></td></tr>"+
                          "<tr><td><label>协议</label></td><td><select id='attr_rule' style='width:100px'><option value='1'>TCP</option><option value='2'>UDP</option></select></td></tr>";
						  
		strHtml_1 += "</table></div>";
			
			//$("#attr_rule").html(strRuleHtml);
		}
		
 		else if(type == "DTO_TM_ART_LINE")
		{
			strHtml_1 = "<div style='float:right;padding-top:0px;width:300px;height:auto;'><table class='table table-bordered' style='margin-top:15px;' cellpadding='5' border='1'>" +
                         "<tr><td><label>名称</label></td><td><input type='text' /></td></tr>" +
                         "<tr><td><label>分区</label></td><td><input type='text' /></td></tr>" +
                         "<tr><td><label>副本数</label></td><td><input type='text' /></td></tr>" ;
                          //"<tr><td><label>Tag点</label></td><td><input type='text' id='attr_tag'/></td></tr>"+
                          //"<tr><td><label>协议</label></td><td><select id='attr_rule' style='width:100px'><option value='1'>TCP</option></select></td></tr>";
			strHtml_1 += "</table></div>";
		} 
		else if(type == "DTO_TM_ULOC")
		{
			strHtml_1 = "<div style='float:right;padding-top:0px;width:300px;height:auto;'><table class='table table-bordered' style='margin-top:15px;' cellpadding='5' border='1'>" +
                         "<tr><td><label>端口</label></td><td><input type='text' /></td></tr>" +
                         //"<tr><td><label>解析方法</label></td><td><input type='text' id='attr_width'/></td></tr>" +
                         //"<tr><td><label>频率</label></td><td><input type='text' id='attr_height'/></td></tr>" +
                          //"<tr><td><label>Tag点</label></td><td><input type='text' id='attr_tag'/></td></tr>"+
                          "<tr><td><label>协议</label></td><td><select id='attr_rule' style='width:100px'><option value='1'>TCP</option><option value='2'>UDP</option></select></td></tr>";
			strHtml_1 += "</table></div>";
		}
		else if(type == "DTO_TM")
		{
			strHtml_1 = "<div style='float:right;padding-top:0px;width:300px;height:auto;'><table class='table table-bordered' style='margin-top:15px;' cellpadding='5' border='1'>" +
                         "<tr><td><label>窗口长度</label></td><td><input type='text' /></td></tr>" +
                         "<tr><td><label>窗口滑动距离</label></td><td><input type='text' /></td></tr>" ;
                         //"<tr><td><label>频率</label></td><td><input type='text' id='attr_height'/></td></tr>" +
                          //"<tr><td><label>Tag点</label></td><td><input type='text' id='attr_tag'/></td></tr>"+
                          //"<tr><td><label>通天塔</label></td><td><select id='attr_rule' style='width:100px'><option value='1'>TCP</option></select></td></tr>";
			strHtml_1 += "</table></div>";
		}
        
		$("#divRightContent").html(strHtml_1);
        oElement.InitAttrInput(type, seletor);
    };

    //3.初始化属性框和拖拽区元素的对应事件
    oElement.InitAttrInput = function (type, seletor) {
        //1.设置宽度和高度
        var strheight = $(seletor).css("height");
        $("#divRight").find("#attr_height").val(strheight.substring(0, strheight.length - 2));
        var strwidht = $(seletor).css("width");
        $("#divRight").find("#attr_width").val(strwidht.substring(0, strwidht.length - 2));
        $("#divRight").find("#attr_tag").val($(seletor).attr("tag"));
        $("#divRight").find("#attr_rule").val($(seletor).attr("rule"));

        //2.注册属性值的blur事件
        $("#divRight").find("#attr_height").blur(function () {
            $(seletor).css("height", $(this).val() + "px");
            jsPlumb.repaintEverything();
        }).keydown(function (event) {
            if (event.keyCode == "13") {
                $(seletor).css("height", $(this).val() + "px");
                jsPlumb.repaintEverything();
            }
        });
        $("#divRight").find("#attr_width").blur(function () {
            $(seletor).css("width", $(this).val() + "px");
            jsPlumb.repaintEverything();
        }).keydown(function (event) {
            if (event.keyCode == "13") {
                $(seletor).css("width", $(this).val() + "px");
                jsPlumb.repaintEverything();
            }
        });

        $("#divRight").find("#attr_tag").blur(function () {
            $(seletor).attr("tag", $(this).val());
            jsPlumb.repaintEverything();
        }).keydown(function (event) {
            if (event.keyCode == "13") {
                $(seletor).attr("tag", $(this).val());
                jsPlumb.repaintEverything();
            }
        });

        $("#divRight").find("#attr_rule").change(function () {
            $(seletor).attr("rule",$(this).val());
            jsPlumb.repaintEverything();
        });

        var olabel = $(seletor).find("label");
        if (olabel.length > 0) {
            $("#divRight").find("#attr_facname").val(olabel[0].innerHTML);
            $("#divRight").find("#attr_facname").blur(function () {
                olabel[0].innerHTML = $(this).val();
            });
        }
    }

    return oElement;
};

var i = 0;

//初始化页面拖拽
var InitDrag = function () {
    var oDrag = new Object();

    //0.初始化工厂的拖拽
    oDrag.InitPlant = function () {
        
        //5.3 模型的拖拽事件
        $("#divContentLeftMenu .node").draggable({
            helper: "clone",
            scope: "plant"
        });

        //5.4 中间拖拽区的drop事件
        $("#divCenter").droppable({
            scope: "plant",
            drop: function (event, ui) {
                //0.3 创建工厂模型到拖拽区
                oDrag.CreateModel(ui, $(this));
            }
        });
    };

    //1.创建模型（参数依次为：drop事件的ui、当前容器、id、当前样式）
    oDrag.CreateModel = function (ui, selector) {
        //1.1 添加html模型
        //$(selector).append('<div class="node node1" onclick="oInitElement.GetPropertiesByType(\'Factory\',this)" id="' + id + '" >' + $(ui.helper).html() + '</div>');
        var modelid = $(ui.draggable).attr("id");
        i++;
        var id = modelid+i;
        
        var cur_css = modelid;
        var type = $(ui.helper).attr("dbtype");
        $(selector).append('<div class="node ' + cur_css + '" id="' + id + '" dbtype="' + type + '" parentid="' + $(selector).attr("id") + '" onclick="oInitElement.GetPropertiesByType(\'' + type + '\',this)" ondblclick="InitStation().DbClick(\'' + type + '\',this)" >' + $(ui.helper).html() + '</div>');
        var left = parseInt(ui.offset.left - $(selector).offset().left);
        var top = parseInt(ui.offset.top - $(selector).offset().top);
        $("#" + id).css("left", left).css("top", top);
        //jsPlumb.setContainer($("#divCenter"));
        //1.2 添加连接点
        jsPlumb.addEndpoint(id, { anchors: "RightMiddle" }, hollowCircle);
        jsPlumb.addEndpoint(id, { anchors: "LeftMiddle" }, hollowCircle);
        jsPlumb.addEndpoint(id, { anchors: "TopCenter" }, hollowCircle);
        jsPlumb.addEndpoint(id, { anchors: "BottomCenter" }, hollowCircle);
        jsPlumb.draggable(id);

        //1.3 注册实体可draggable和resizable
        $("#" + id).draggable({
            containment: "parent",
            start: function () {
                startMove();
            },
            drag: function (event, ui) {
                MoveSelectDiv(event, ui, id);
                jsPlumb.repaintEverything();
            },
            stop: function () {
                jsPlumb.repaintEverything();
            }
        });

        $("#" + id).resizable({
            resize: function () {
                jsPlumb.repaintEverything();
            },
            stop: function () {
                jsPlumb.repaintEverything();
                //oInitElement.SendPropRequest("DTO_TM_PLANT", $(this));
            }
        });



        oInitElement.GetPropertiesByType(type, $("#" + id));


        //oRegionSelect.InitRegions();

        return id;
    };

    return oDrag;
};

var oRegionSelect;

function Resize() {
    $("#divContent").height($(window).height() - $("#divHead").height() - $("#divBottom").height() - 20);
    $("#divCenter").height($("#divContent").height()).width($("#divContent").width());

    var iHeightN = $("#divSidebar").height();
    var iHeightRigth = $("#divRight").height();
    var iHeight = $("#divContent").height();
    if (iHeightN < iHeightRigth) iHeightN = iHeightRigth;
    if (iHeightN < iHeight) iHeightN = iHeightRigth;
    else $("#divContent2").height(iHeightN);

    $("#divCenter").height(iHeightN);

}



//基本连接线样式
var connectorPaintStyle = {
    //lineWidth: 4,
    //strokeStyle: "#1e8151",
    //joinstyle: "round",
    //outlineColor: "white",
    //outlineWidth: 2
    strokeStyle: "#1e8151",
    fillStyle: "transparent",
    radius: 5,
    lineWidth: 2
};
// 鼠标悬浮在连接线上的样式
var connectorHoverStyle = {
    lineWidth: 3,
    strokeStyle: "#216477",
    outlineWidth: 2,
    outlineColor: "white"
};
var endpointHoverStyle = {
    fillStyle: "#216477",
    strokeStyle: "#216477"
};
//空心圆端点样式设置
var hollowCircle = {
    DragOptions: { cursor: 'pointer', zIndex: 2000 },
    endpoint: ["Dot", { radius: 7 }],  //端点的形状  
    connectorStyle: connectorPaintStyle,//连接线的颜色，大小样式
    connectorHoverStyle: connectorHoverStyle,
    paintStyle: {
        strokeStyle: "#1e8151",
        fillStyle: "blue",  //修改点2：原本为 transparent  透明
        radius: 2,  //修改点1： 原本为 5
        lineWidth: 2
    },		//端点的颜色样式
    //anchor: "AutoDefault",
    isSource: true,	//是否可以拖动（作为连线起点）
    connector: ["Straight", { stub: [0, 0], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],  //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
    isTarget: true,	//是否可以放置（连线终点）
    maxConnections: -1,	// 设置连接点最多可以连接几条线
    connectorOverlays: [["Arrow", { width: 10, length: 10, location: 1 }]]
};
//实心圆样式
var solidCircle = {
    endpoint: ["Dot", { radius: 8 }],  //端点的形状
    paintStyle: { fillStyle: "rgb(122, 176, 44)" },	//端点的颜色样式
    connectorStyle: { strokeStyle: "rgb(97, 183, 207)", lineWidth: 4 },	  //连接线的颜色，大小样式
    isSource: true,	//是否可以拖动（作为连线起点）
    connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }], //连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
    isTarget: true,		//是否可以放置（连线终点）
    //anchor: "AutoDefault",
    maxConnections: 3,	// 设置连接点最多可以连接几条线
    connectorOverlays: [["Arrow", { width: 10, length: 10, location: 1 }]]
};


