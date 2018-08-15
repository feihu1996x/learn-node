/*
 * @file: http.js
 * @brief:  使用Node实现一个简单的http server
 * @author: feihu1996.cn
 * @date:  18-08-12
 * @version: 1.0
 */

 var http = require("http");
 
 // 创建一个存活在全局范围内的匿名对象，\
 // 并开始事件监听状态
 http.createServer(function(req, res){ 
     /*
     回调函数，每当一个新的请求到达Web服务器， 它都会被调用
     */

    // 规范化 url,去掉查询字符串、可选的反斜杠,并把它变成小写
    var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();

    // 实现简单的路由
    switch (path) {
        case '':
            // 设置http响应头
            res.writeHead(200, {"Content-Type": "text/plain"});             
            // 写入http正文及关闭连接
            res.end('Homepage');
            break;
        case '/about':
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('About');
            break;
        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
            break;
    }
 }).listen(8080, "127.0.0.1");

 // 在标准输出stdout上输出提示信息
 console.log("Server running at http://127.0.0.1:8080");
 