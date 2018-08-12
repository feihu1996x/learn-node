/*
 * @file: http.js
 * @brief:  "Hello, World"  Node.js Web服务器
 * @author: feihu1996.cn
 * @date:  18-08-12
 * @version: 1.0
 */

 var http = require("http");
 
 // 创建一个存活在全局范围内的匿名对象，\
 // 并开始事件监听状态
 http.createServer(function(req, res){ // 回调函数，每当一个新的请求到达Web服务器， 它都会被调用
     res.writeHead(200, {"Content-Type": "text/plain"});  // 设置http响应头
     res.end("Hello, World!\n");  // 写入http正文及关闭连接
 }).listen(8080, "127.0.0.1");

 // 在标准输出stdout上输出提示信息
 console.log("Server running at http://127.0.0.1:8080");
 