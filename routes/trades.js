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
    datetime: trade.date,
    logged: trade.logged,
    username: trade.username,
    buySymbol: trade.buySymbol,
    buyQty: trade.buyQty,
    buyRate: trade.buyRate,
    sellSymbol: trade.sellSymbol,
    subTotal: trade.subTotal,
    feeSymbol: trade.feeSymbol,
    fee: trade.fee,
    base_usd: trade.base_usd,
    usd_basis: trade.usd_basis,
    exchange: trade.exchange,
    trans_type: trade.type,
    notes: trade.notes
  }, '*').then(function(res){
    console.log(res);
  })
})



module.exports = router;
