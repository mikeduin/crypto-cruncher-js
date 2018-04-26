var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function Trades () {
  return knex('trades');
}

router.post('/submitTrade', function(req, res, next){
  var trade = req.body;
  console.log(trade);
  Trades().insert({
    username: trade.username,
    datetime: trade.date,
    logged: trade.logged,
    buySymbol: trade.buySymbol,
    buyQty: trade.buyQty,
    buyRate: trade.buyRate,
    sellSymbol: trade.sellSymbol,

  })
})



module.exports = router;
