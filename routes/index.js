var express = require('express');
var router = express.Router();
var bittrex = require('node-bittrex-api');
var WebSocket = require('ws');
var binanceWs = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
var gdaxWs = new WebSocket('wss://ws-feed.gdax.com');
var fetch = require('node-fetch');
var knex = require('../db/knex');
var Pusher = require('pusher');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('index.html');
});

var pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: 'us2',
  encrypted: true
});

console.log('Connecting ....');

router.get('/getSymbols', function(req, res, next){
  knex('index as i')
    .leftJoin('bittrex as bitt', 'bitt.mySymbol', 'i.mySymbol')
    .leftJoin('gdax as g', 'g.mySymbol', 'i.mySymbol')
    .leftJoin('binance as bin', 'bin.mySymbol', 'i.mySymbol')
    .leftJoin('hitbtc as hit', 'hit.mySymbol', 'i.mySymbol')
    .leftJoin('cryptopia as cry', 'cry.mySymbol', 'i.mySymbol')
    .select('i.mySymbol as symbol',
      'i.name as name',
      'g.btc as g.btc',
      'g.usd as g.usd',
      'bitt.btc as bitt.btc',
      'bitt.usd as bitt.usd',
      'bitt.eth as bitt.eth',
      'bin.btc as bin.btc',
      'bin.usd as bin.usd',
      'bin.eth as bin.eth',
      'hit.btc as hit.btc',
      'hit.usd as hit.usd',
      'hit.eth as hit.eth',
      'cry.btc as cry.btc'
    )
    .then(function(ticker){
      var marketIndex = [];
      for (var i=0; i<ticker.length; i++) {
        marketIndex.push({
          'name': ticker[i].name,
          'symbol': ticker[i].symbol,
          'full_name': ticker[i].symbol+ ' (' + ticker[i].name + ')',
          market: {
            'USD': {
              'gdax': ticker[i]['g.usd'],
              'bittrex': ticker[i]['bitt.usd'],
              'binance': ticker[i]['bin.usd'],
              'hitbtc': ticker[i]['hit.usd']
            },
            'BTC': {
              'gdax': ticker[i]['g.btc'],
              'bittrex': ticker[i]['bitt.btc'],
              'binance': ticker[i]['bin.btc'],
              'hitbtc': ticker[i]['hit.btc'],
              'cryptopia': ticker[i]['cry.btc']
            },
            'ETH': {
              'gdax': ticker[i]['g.eth'],
              'bittrex': ticker[i]['bitt.eth'],
              'binance': ticker[i]['bin.eth'],
              'hitbtc': ticker[i]['hit.eth']
            }
          }
        })
      };
      res.json(marketIndex);
  });
})

setInterval(function(req, res, next){
  fetch('https://api.hitbtc.com/api/2/public/ticker').then(function(res){
    return res.json();
  }).then(function(ticker){
    var hitbtcMkt = {};
    ticker.forEach(function(token){
      hitbtcMkt[token.symbol] = token.last
    });
    pusher.trigger('hitbtc-channel', 'update', hitbtcMkt);
  });
}, 4000);

setInterval(function(req, res, next){
  fetch('https://www.cryptopia.co.nz/api/GetMarkets/BTC').then(function(res){
    return res.json();
  }).then(function(data){
    var markets = data.Data;
    var cryptopiaMkt = {};
    markets.forEach(function(token){
      cryptopiaMkt[token.Label] = token.LastPrice;
    });
    pusher.trigger('cryptopia-channel', 'update', cryptopiaMkt);
  });
}, 4000);


bittrex.websockets.listen(function(data, client) {
  var bittrexMkt = {};
  if (data.M === 'updateSummaryState') {
    data.A.forEach(function(data_for) {
      data_for.Deltas.forEach(function(marketsDelta) {
        bittrexMkt[marketsDelta.MarketName] = marketsDelta.Last;
      });
    });
  }
  pusher.trigger('bittrex-channel', 'update', bittrexMkt);
});

binanceWs.on('message', function incoming(feed){
  var binanceMkt = {};
  var data;
  try {
    data = JSON.parse(feed);
  } catch (e) {
    console.log(e);
  } finally {
    data = JSON.parse(feed);
  }
  // var data = JSON.parse(feed);
  data.forEach(function(ticker){
    var last = (parseFloat(ticker['b']) + parseFloat(ticker['a']))/2;
    binanceMkt[ticker['s']] = last;
  });
  pusher.trigger('binance-channel', 'update', binanceMkt);
});

gdaxWs.on('open', function open() {
  var req = JSON.stringify({
    "type": "subscribe",
    "channels": [{
      "name": "ticker",
      "product_ids": [
        "BTC-USD",
        "ETH-USD",
        "ETH-BTC",
        "LTC-USD",
        "LTC-BTC",
        "BCH-USD"
      ]
    }]
  });
  gdaxWs.send(req);
})

var gdaxMkt = {};
var count = 0;

gdaxWs.on('message', function incoming(feed){
  count++;
  var data = JSON.parse(feed);
  gdaxMkt[data['product_id']] = data['price'];
  if (count % 4 === 0) {
    pusher.trigger('gdax-channel', 'update', gdaxMkt);
  };
})

module.exports = router;
