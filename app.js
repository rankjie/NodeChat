var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    os = require('os'),
    path = require('path');


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

app.get ( '/', function(req, res) {
  return res.render('index', {
    hostname : os.hostname()
  });
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


var io = require('socket.io').listen(server);
var usercount = 0;
var userlist = {};
io.sockets.on('connection', function (socket) {
  // 接收到消息广播给其他客户端
  usercount++;
  socket.on('new_msg', function (msg) {
    console.log(msg);
    console.log("用户："+msg.name+"    id为"+socket.id);
    // 添加to, @
    // 不存储数据到服务器
    // apicreate( msg, function(err, data){
    //     socket.broadcast.emit('msg_recv', {msg: data});
    // });
    socket.broadcast.emit('msg_recv', {msg: msg});
  });
  // 告知用户已经连接上服务器
  socket.on('iconnect', function (data) {
    console.log("上线了一个："+usercount);
    userlist[socket.id] = data.name;
    socket.emit('userchange',{usercount:usercount,usernames:userlist});
    socket.broadcast.emit('userchange',{usercount:usercount,usernames:userlist});
    socket.emit('welcome',{hi:"hey"});
  });

  socket.on('disconnect', function () {
    usercount--;
    console.log("掉线了一个："+usercount+"ID: "+socket.id);
    delete userlist[socket.id];
    socket.broadcast.emit('userchange',{usercount:usercount,usernames:userlist});
  });

  socket.on('namechange', function (data) {
    userlist[socket.id] = data.name;
    console.log(userlist);
    socket.emit('userchange',{usercount:usercount,usernames:userlist});
    socket.broadcast.emit('userchange',{usercount:usercount,usernames:userlist});
  });

});



