var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function Trades () {
  return knex('trades');
}

router.get('/', function (req, res, next) {
  
})




module.exports = router;
