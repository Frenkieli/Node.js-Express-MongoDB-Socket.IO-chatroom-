var express = require('express');
var router = express.Router();

var controller = require('../controller/updata')

router.put('/',
controller.create)

router.post('/:id',
  controller.updata1,
  controller.updata2,
  controller.updata3);


router.delete('/',
  controller.delete);


router.get('/:id', controller.read);

module.exports = router;