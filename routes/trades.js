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
    creditSymbol: trade.creditSymbol,
    creditTotal: trade.creditTotal,
    buyRate: trade.buyRate,
    debitSymbol: trade.debitSymbol,
    debitTotal: trade.debitTotal,
    feeSymbol: trade.feeSymbol,
    fee: trade.fee,
    base_usd: trade.base_usd,
    usd_basis: trade.usd_basis,
    totalCost: trade.totalCost,
    exchange: trade.exchange,
    trans_type: trade.type,
    txid: trade.txid,
    notes: trade.notes
  }, '*').then(function(entry){
    res.json(entry);
  })
})



module.exports = router;
