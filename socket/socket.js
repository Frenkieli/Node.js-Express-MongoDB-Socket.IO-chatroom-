//==
//
//  socket功能
//
//
var express = require('express');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server)

var db = require('../controller/db');

var index = {};

index.init = function () {
  server.listen(3001);
  io.on('connection', index.connectionSocket);
}
index.connectionSocket = async function (socket) {
  let handshakeData = socket.request;
  let comeInName = handshakeData._query['name'];
  // console.log("誰進來了:", comeInName);




  // socketHander.connect();
  // const history = await socketHander.getMessages();
  const history = await db.findDB('messages');
  const socketid = socket.id;
  io.to(socketid).emit('history', history);

  console.log(comeInName + ' 加入聊天室');
  index.emitMessage('message', { name: comeInName, msg: ' 加入了聊天室' });
  socket.on("disconnect", () => {
    console.log(comeInName + " 離開聊天室");
    index.emitMessage('message', { name: comeInName, msg: " 默默的離開了聊天室" });
  });

  // socket.on("message", (obj) => {
  //   index.emitMessage("message", '應聲蟲:' + obj);
  // });

  socket.on("message", async (obj) => {
    // socketHander.storeMessages(obj);
    let result = await db.create('messages',obj);
    index.emitMessage("message", result);
  });

  socket.on("deleteMessage",async (obj)=>{
    console.log(obj);
    let result = await db.destroy('messages',obj._id);
    index.emitMessage("deleteMessage", result);
  })

  socket.on("updateMessage",async (obj)=>{
    console.log(obj);
    let result = await db.update('messages',obj._id,obj);
    index.emitMessage("updateMessage", result);
  })



}

index.emitMessage = function (obj, message) {
  io.emit(obj, message)
}


module.exports = index;