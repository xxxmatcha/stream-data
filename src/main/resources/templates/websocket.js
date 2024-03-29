<%@ page language="java" pageEncoding="UTF-8" %>
var websocket = null;
//判断当前浏览器是否支持WebSocket
if ('WebSocket' in window) {
    websocket = new WebSocket("ws://localhost:8088/bitcoin/ws/bitcoinServer");

    //连接成功建立的回调方法
    websocket.onopen = function () {
        websocket.send("客户端链接成功");
        alert("WebSocket连接成功");
    }

    //接收到消息的回调方法
    websocket.onmessage = function (event) {
        setMessageInnerHTML(event.data);
    }

    //连接发生错误的回调方法
    websocket.onerror = function () {
        alert("WebSocket连接发生错误");
    };

    //连接关闭的回调方法
    websocket.onclose = function () {
        alert("WebSocket连接关闭");
    }

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function () {
        closeWebSocket();
    }

}
else {
    alert('当前浏览器 Not support websocket')
}




//将消息显示在网页上
function setMessageInnerHTML(innerHTML) {
    var bitcoin = eval("("+innerHTML+")");
    document.getElementById('value').innerHTML = bitcoin.value;
    console.log(bitcoin.value);
    document.getElementById('total').innerHTML = bitcoin.total;
    console.log(bitcoin.total);
}

//关闭WebSocket连接
function closeWebSocket() {
    websocket.close();
}
