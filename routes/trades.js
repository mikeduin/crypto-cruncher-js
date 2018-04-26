var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.post('/submitTrade', function(req, res, next){
  console.log(req.body);
})



module.exports = router;
