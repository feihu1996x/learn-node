/*
 * @file:  tcp-server.js
 * @brief:  创建一个基于 TCP的聊天服务器
 * @author: feihu1996.cn
 * @date:  18-08-13
 * @version: 1.0
*/

//  加载net模块
// 包含了node需要的所有tcp功能
var net = require("net");

// 创建一个新的tcp 服务器
var chatServer = net.createServer();

// 创建一个列表，
// 当一个新的客户端出现时,
// 就把它添加到列表中,
// 就可以利用此列表实现客户端之间的通信
var clientList = [];

 //  调用 on() 方法来添加一个事件监听器
 // 每当有新的客户端通过网络连接接入服务器,\
 // 就会触发 connection 事件,\
 // 事件监听器就会调用我们指定的函数
chatServer.on("connection", function(client){
    /*
        连接事件在调用回调函数时,
        会传给我们新客户端所对应的 TCP socket 对象的引用
    */

    // 调用 client.write(),
    // 向该客户端发送信息
    // client.write("Hi!\n");
    // client.write("Bye!\n");

    // client.remoteAddress 是客户端所在的IP地址
    // client.remotePort 是客户端接收从服务器返回数据的 TCP 端口
    // 当不同的客户端从同一个 IP 发起连接时,它们各自会有唯一的 remotePort
    client.name = client.remoteAddress + ':' + client.remotePort;
    client.write('Hi ' + client.name + '!\n');

    console.log(client.name + ' joined');

    clientList.push(client);

    // 调用client.on()添加另外一个事件监听器
    // 每当 client 发送数据给服务器时，
    // data事件都会被触发
    client.on("data", function(data){
        // JavaScript 无法很好地处理二进制数据
        // Node 特地增加了一个 Buffer 库来帮助服务器
        // Node 并不知道客户端发送的是什么类型的数据
        // Node 只能保存原始的二进制格式
        // 可以调用 toString() 方法来把 Buffer 数据翻译为可读的字符串格式
        // console.log(data, data.toString());

        // for(var i=0;i<clientList.length;i++){
        //     // 把数据发送给所有客户端
        //     clientList[i].write(data.toString());
        // }

        broadcast(data.toString(), client);
    });

    // 一个 socket 断开连接时会触发 end 事件
    // 调用 Array.splice() 将客户端从 clientList 列表中移除
    client.on("end", function(){
        console.log(client.name + ' quit');
        clientList.splice(clientList.indexOf(client), 1);
    });

    // 为 client 对象的 error 事件\
    // 添加了 console.log() 调用\
    // 确保客户端发生的任何错误都会被记录下来
    client.on("error", function(error){
        console.log(error);
    });

    // 关闭连接
    // client.end();
});

function broadcast(message, client) {
    var cleanup = [];
    // 把数据发送给所有客户端
    // 除了发送消息的客户端
    for(var i=0;i<clientList.length;i++){
        if(client !== clientList[i]) {
            if(clientList[i].writable){   // 检查 socket 的可写状态
                clientList[i].write(client.name + " says " + message);
            } else {
                cleanup.push(clientList[i]);
                // 将任何不可写的socket关闭并从clientList中移除
                clientList[i].destroy();
            }
        }
    }

    // 在写入循环中删除死节点,消除垃圾索引
    for(var i=0;i<cleanup.length;i++){
        clientList.splice(clientList.indexOf(cleanup[i]), 1);
    }
}

 // 指定监听的端口
chatServer.listen(9000);
 
console.log("chat server running at port:9000");
