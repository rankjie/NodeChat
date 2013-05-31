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

// 改名字后写入cookie
$('#name').change(function () {
    SetCookie("name",$(this).val());
    socket.emit('namechange',{name:$(this).val()});
});

// 绑定回车键出发的事件
$('#content').keypress(function(e){
  if(e.keyCode == 13){
     sendMsg();
     $('#content').animate({scrollTop: $(document).height()}, 300);
  }
});

$('#namelable').click(function(e) {
  $('#myModal').foundation('reveal', 'open');
});


// 初始化名字为cookie存入的或者随机字符串
$('#name').val(GetCookie("name") || Math.random().toString(16).substring(2)+"random");

if ($('#name').val().slice(-6)==="random") {
  $('#name').val("");
  $('#myModal').foundation('reveal', 'open');
}


// 接收在线人数
socket.on('userchange', function (data) {
  console.log('在线数据包：');
  console.log(data);
  var v = [];
  var c = 0;
  for(var k in data.usernames){
    c++;
    if (data.usernames[k]===$('#name').val()) {
      v.push("<span class='label' data-tooltip class='has-tip' title='这是你，点一下改名' id='namelable' data-reveal-id='myModal' style='cursor: pointer;' data-options='disable-for-touch: true'>"+data.usernames[k]+"</span>");
    } else {
      v.push("<span class='secondary label' data-tooltip class='has-tip' title='点击去@他' data-options='disable-for-touch:true'>"+data.usernames[k]+"</span>");
    }
  }
  $('#usernames').html(v.join(" "));
  $('#usercount').html('当前在线'+c+"人：");
});

// 测试下可否连接，同时提交姓名
socket.emit('iconnect', {name:$('#name').val()});
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


$(document).foundation();

