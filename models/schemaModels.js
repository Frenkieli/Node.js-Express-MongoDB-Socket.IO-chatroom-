const mongoose = require('mongoose');
const moment = require('moment');


//注意資料庫都必須擁有time的欄位

const messagesSchema = mongoose.Schema({
  name: { type: String, require: true },
  msg: { type: String, require: true },
  time: { type: Number, require: true, default:moment().valueOf()},
});
const medicalRecordSchema = mongoose.Schema({
  _id: { type: String, require: true},                                    //病歷號碼
  name: { type: String, require: true },                                  //這邊要在補上大量個人資料或是不用
  data: { type: Object},                                                  //醫生上傳的資料
  playlist: {type:Array} ,                                                //醫生製作完成的放映順序
  time: { type: Number, require: true, default:moment().valueOf()},                                 
},{id:false});

module.exports = {
  messages: mongoose.model('Messages', messagesSchema),
  medicalRecord: mongoose.model('medicalRecord', medicalRecordSchema),
};