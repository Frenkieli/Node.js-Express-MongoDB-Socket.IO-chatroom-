var express = require('express');
var router = express.Router();
// 上團檔案功能
var fs = require('fs');
var multer = require('multer')
// var upload = multer({ dest: 'userData/' });

var uploadFolder = './userData';
var createFolder = function (folder) {
  try {
    fs.accessSync(folder);
  } catch (e) {
    fs.mkdirSync(folder);
  }
};
createFolder(uploadFolder);


var storage = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, uploadFolder);  // 儲存的路徑，備註：需要自己建立
  },
  filename: function (req, file, cb) {
    // 將儲存檔名設定為 欄位名   時間戳，比如 logo-1478521468943
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
});


function fileFilter(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|mp4|ogg|mp3)$/)) {
    req.errorDataName.push(file.originalname);
    return cb(null, false);
  }
  cb(null, true);
};


var upload = multer({ storage: storage, fileFilter: fileFilter });




router.post('/', function(req, res, next){req.errorDataName = [];next();} , upload.array('logo'), function (req, res, next) {
  var files = req.files;
  console.log(multer.MulterError);
  files.forEach(file => {
    console.log('檔案型別：%s', file.mimetype);
    console.log('原始檔名：%s', file.originalname);
    console.log('檔案大小：%s', file.size);
    console.log('檔案儲存路徑：%s', file.path);
  });
  res.send({ ret_code: '0' ,errorDataName : req.errorDataName});
});

router.get('/', function (req, res, next) {
  var form = fs.readFileSync('./index.html', { encoding: 'utf8' });
  res.send(form);
});

module.exports = router;
