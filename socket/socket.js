//==
//
//  socket功能
//
//
var express = require('express');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server)

var socketHander = require('./index')
socketHander = new socketHander();

var index = {};

index.init = function () {
  server.listen(3001);
  io.on('connection', index.connectionSocket);
}
index.connectionSocket = async function (socket) {
  let handshakeData = socket.request;
  let comeInName = handshakeData._query['name'];
  // console.log("誰進來了:", comeInName);




  socketHander.connect();
  const history = await socketHander.getMessages();
  const socketid = socket.id;
  io.to(socketid).emit('history', history);

  console.log(comeInName + ' 加入聊天室');
  index.emitMessage('message', { name: comeInName, msg: ' 加入了聊天室' });
  socket.on("disconnect", () => {
    console.log(comeInName + " 離開聊天室");
    index.emitMessage('message', { name: comeInName, msg: " 默默的離開了聊天室" });
  });

  socket.on("message", (obj) => {
    index.emitMessage("message", '應聲蟲:' + obj);
  });

  socket.on("message", (obj) => {
    socketHander.storeMessages(obj);
    index.emitMessage("message", obj);
  });



}

index.emitMessage = function (obj, message) {
  io.emit(obj, message)
}


module.exports = index;