var express = require('express');
var router = express.Router();
const schemaModels = require('../models/schemaModels');
const moment = require('moment');
const mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res ,next) {
  schemaModels.medicalRecord.find().sort('_id').exec(function( err , data){
    res.render('index', { title: 'Express' , medicalRecord: data });
  })
});

module.exports = router;
