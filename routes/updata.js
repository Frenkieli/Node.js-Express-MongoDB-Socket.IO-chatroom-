var express = require('express');
var router = express.Router();

var controller = require('../controller/updata')

router.put('/',
controller.create)

router.post('/',
  controller.updata1,
  controller.updata2,
  controller.updata3);


router.delete('/',
  controller.delete);


router.get('/', function (req, res, next) {
  var form = fs.readFileSync('./index.html', { encoding: 'utf8' });
  res.send(form);
});

module.exports = router;
