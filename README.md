NodeChat
========

A online chatroom powered by node.js &amp; socket.io &amp; express

Tested with Node.js v0.11.1

[Demo0](http://node.gfw.li)   (IPv6 only. Running on a Raspberry Pi)
[Demo1](http://hk.gfw.li)


### HOWTO PLAY?

1. `git clone https://github.com/rankjie/NodeChat.git`
2. `cd NodeChat`
3. `npm install`
4. Edit `public/js/main.js`, change the URL.
5. Comment out all the mongodb related code in file: `/routes/msg` and `app.js` if you don't have mongodb installed.
6. `node app.js`  NodeChat is now running at port 3000