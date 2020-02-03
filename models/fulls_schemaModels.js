const mongoose = require('mongoose');

const messagesSchema = mongoose.Schema({
  name: { type: String, require: true },
  msg: { type: String, require: true },
  time: { type: Number, require: true },
});
const medicalRecordSchema = mongoose.Schema({
  // _id: { type: String, require: true, unique: true },     //病歷號碼
  name: { type: String, require: true },                  //這邊要在補上大量個人資料或是不用
  data: { type: Object},                                  //醫生上傳的資料
  playlist: {type:Array}                                  //醫生智做完成的放映順序
});

module.exports = {
  messages: mongoose.model('Messages', messagesSchema),
  medicalRecord: mongoose.model('medicalRecord', medicalRecordSchema),
};