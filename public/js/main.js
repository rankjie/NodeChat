// 建立socket.io的连接
var socket = io.connect('http://node.gfw.li');

// 设置cookie
function SetCookie(name,value){
  document.cookie = name + "="+ encodeURI(value);
}

// 读取cookie
function GetCookie(cookieName){
  var cookieString = document.cookie;
  var start = cookieString.indexOf(cookieName + '=');
  if (start == -1)
    return null;
  start += cookieName.length + 1;
  var end = cookieString.indexOf(";", start);
  if (end == -1)
    return decodeURI(cookieString.substring(start));
  return decodeURI(cookieString.substring(start, end));
}

// 发送消息
function sendMsg() {
  var data = {};
  data.name = $('#name').val();
  data.content = $('#content').val();
  data.send_time = Math.round((new Date()).getTime());
  $('#content').val('');
  console.log(Date());
  $('#msgs').append("<p>我说："+data.content+'</p>');
  socket.emit('new_msg', { themsg: data });
  $('#content').focus();
}

// 测试下可否连接
socket.emit('iconnect', { data: "I'm coming" });
  socket.on('welcome', function (data) {
    $('#msgs').html("<p>已连接上服务器...</p>");
});

// 监听服务器传来的消息(或者说，绑定事件？)
socket.on('msg_recv', function (data) {
  console.log("收到回复的数据了");
  console.log(data);
  d=data.msg.themsg;
  t = Math.round((new Date()).getTime());
  console.log("耗时:"+(t-d.send_time)/1000/1000);
  $('#content').animate({scrollTop: $(document).height()}, 300);
  $('#msgs').append("<p>"+d.name+"说："+d.content+'</p>');
});

// 从cookie里读取名字
$('#name').val(GetCookie("name"));

$(document).foundation();

// 改名字后写入cookie
$('#name').change(function () {
    SetCookie("name",$(this).val());
});

// 绑定回车键出发的事件
$('#content').keypress(function(e){
  if(e.keyCode == 13){
     sendMsg();
     $('#content').animate({scrollTop: $(document).height()}, 300);
  }
});