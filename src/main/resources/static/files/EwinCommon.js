
//封装通用方法
(function ($) {

    $.Ewin = {};

    $.Ewin.Validate = {};
    /**
    * 发送get请求
    * strUrl, oParams, funCallback
    */
    $.Ewin.AjaxGet = function (strUrl, oParams, funCallback) {
        $.get(strUrl, oParams, funCallback);
    };

    /**
    * 发送post请求
    * strUrl, oParams, funSuccessCallback, funErrorCallback
    */
    $.Ewin.AjaxPost = function (strUrl, oParams, funSuccessCallback, funErrorCallback, funFinishCallback) {
        //var strJsonParams = $.toJSON(oParams);
        $.ajax({
            type: "POST",
            url: strUrl,
            data: oParams,
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: funSuccessCallback,
            error: funErrorCallback,
            complete: funFinishCallback

        });
    };


    /**
    * 发送Sync post请求。阻塞请求的Ajax
    * strUrl, oParams, funSuccessCallback, funErrorCallback
    */
    $.Ewin.AsyncAjaxPost = function (strUrl, oParams, funSuccessCallback, funErrorCallback, funFinishCallback) {
        //var strJsonParams = $.toJSON(oParams);
        $.ajax({
            type: "POST",
            async: false,
            url: strUrl,
            data: oParams,
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: funSuccessCallback,
            error: funErrorCallback,
            complete: funFinishCallback

        });
    };

    /**
    * 发送post请求(包含List数据时用)
    * strUrl, oParams, funSuccessCallback, funErrorCallback
    */
    $.Ewin.AjaxPostWithList = function (strUrl, oParams, funSuccessCallback, funErrorCallback) {
        var strJsonParams = $.toJSON(oParams);
        $.ajax({
            type: "POST",
            url: strUrl,
            data: strJsonParams,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: funSuccessCallback,
            error: funErrorCallback
        });
    };

    //格式化字符串
    $.Ewin.Format = function (source, params) {
        if (arguments.length == 1)
            return function () {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return $.format.apply(this, args);
            };
        if (arguments.length > 2 && params.constructor != Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor != Array) {
            params = [params];
        }
        $.each(params, function (i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
        });
        return source;
    }

    //封装dialog
    $.Ewin.Dialog = function (id, title, funcloseCallback, funcancelCallback, funokCallback) {
        $("#" + id).dialog({
            title: title,
            autoOpen: false,
            width: 350,
            height: 180,
            draggable: false,
            resizable: false,
            close: funcloseCallback,
            buttons: {
                "取消": funcancelCallback,
                "确定": funokCallback
            }
        });
    }

    //motai
    $.Ewin.ModalDialog = function (id) {
        $('#' + id).modal({ backdrop: true, keyboard: true, show: true });
    };

    //通用的draggable
    $.Ewin.Draggable = function (selector, containment, helper, scope, funcstart, funcdrag, funcstop) {
        var containmentdefault = containment == null || containment == undefined ? "parent" : containment;
        $(selector).draggable({
            containment: containmentdefault,
            helper: helper,
            scope: scope,
            start: funcstart,
            drag: funcdrag,
            stop: funcstop
        });
    };

    //通用的droppable
    $.Ewin.Droppable = function (selector, scope, funcdrop) {
        $(selector).droppable({
            scope: scope,
            drop:funcdrop
        });
    };

    //通用的resizable
    $.Ewin.Resizable = function (selector, funcresize,funcstop) {
        $(selector).resizable({
            resize: funcresize,
            stop: funcstop
        });
    };


})(jQuery);