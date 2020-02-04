const schemaModels = require('../models/schemaModels')
const moment = require('moment');

class SocketHander {
  constructor() {
    this.db;
  }
  connect() {
    this.db = require('mongoose').connect('mongodb://localhost:27017/chat', { useNewUrlParser: true , useUnifiedTopology: true});
    this.db.Promise = global.Promise;
  }

  getMessages() {
    return schemaModels.messages.find();
  }

  storeMessages(data) {

    console.log(data);
    const newMessages = new schemaModels.messages({
      name: data.name,
      msg: data.msg,
      time: moment().valueOf(),
    });

    const doc = newMessages.save();
  }
}

module.exports = SocketHander;