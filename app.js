require( './db' );
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    msg = require('./routes/msg'),
    path = require('path');

var mongoose = require( 'mongoose' );
var Msg      = mongoose.model( 'Msgs' );

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.enable('trust proxy');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  // app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(__dirname + '/public'));
  app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(err.stack);
    res.send(500, 'Something broke!');
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get ( '/',             msg.list );

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// 存储收到的信息
var apicreate = function(msg, next) {
  return new Msg({
    name: msg.name,
    content: msg.content,
    send_time: msg.send_time,
    created_time: Date()
  }).save(function(err, todo, count) {
    console.log("存好数据咯");
    return Msg.find(function(err, Msgs) {
      return next(err, Msgs);
    });
  });
};

var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  // 接收到消息广播给其他客户端
  socket.on('new_msg', function (msg) {
    console.log(msg);
    // 不存储数据到服务器
    // apicreate( msg, function(err, data){
    //     socket.broadcast.emit('msg_recv', {msg: data});
    // });
    socket.broadcast.emit('msg_recv', {msg: msg});
  });
  // 告知用户已经连接上服务器
  socket.on('iconnect', function (data) {
    console.log(data);
    socket.emit('welcome',{imsg:'hi'});
  });
});