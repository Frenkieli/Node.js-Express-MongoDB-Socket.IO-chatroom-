var db = require('./db');

var index = {};

index.read = async function (req, res, next) {
  let result = await db.findOneDB('medicalRecord',req.params.id);
  console.log(result);
  res.json(result);
}

index.update = async function (req, res, next) {

  let result = await db.update('medicalRecord',req.params.id,{playlist:req.body});
  console.log(result);
  res.end();
}

module.exports = index;