var express = require('express');
var router = express.Router();

var controller = require('../controller/medicalrecords')

// router.put('/',
// controller.create)

router.post('/:id',
  controller.update);


// router.delete('/',
//   controller.delete);


router.get('/:id', controller.read);

module.exports = router;