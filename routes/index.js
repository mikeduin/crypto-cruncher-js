var express = require('express');
var router = express.Router();
var bittrex = require('node-bittrex-api');
var WebSocket = require('ws');
var binanceWs = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
var gdaxWs = new WebSocket('wss://ws-feed.gdax.com');
// var btcEthWs = new WebSocket('wss://api.hitbtc.com/api/2/ws');
// var btcLtcWs = new WebSocket('wss://api.hitbtc.com/api/2/ws');
// var btcXrpWs = new WebSocket('wss://api.hitbtc.com/api/2/ws');
var fetch = require('node-fetch');

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

setInterval(function(req, res, next){
  fetch('https://api.hitbtc.com/api/2/public/ticker').then(function(res){
    return res.json();
  }).then(function(ticker){
    var hitbtcMkt = {};
    ticker.forEach(function(token){
      // console.log(token.symbol);
      // hitbtcMkt[token.symbol] = {
      //   'Last': token.last,
      //   'High': token.high,
      //   'Low': token.low,
      //   'Bid': token.bid,
      //   'Ask': token.ask,
      //   'BaseVol': token.volume
      // }
    });
    // pusher.trigger('hitbtc-channel', 'update', {
    //
    // })
  })
}, 2000)


bittrex.websockets.listen(function(data, client) {
  var bittrexMkt = {};
  if (data.M === 'updateSummaryState') {
    data.A.forEach(function(data_for) {
      data_for.Deltas.forEach(function(marketsDelta) {
        bittrexMkt[marketsDelta.MarketName] = marketsDelta.Last
      });
    });
  }
  pusher.trigger('bittrex-channel', 'update', bittrexMkt);
});

binanceWs.on('message', function incoming(feed){
  var binanceMkt = {};
  var data = JSON.parse(feed);
  data.forEach(function(ticker){
    var last = (parseFloat(ticker['b']) + parseFloat(ticker['a']))/2;
    binanceMkt[ticker['s']] = last;
  })
  pusher.trigger('binance-channel', 'update', binanceMkt)
})

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



gdaxWs.on('message', function incoming(feed){
  var gdaxMkt = {};
  var data = JSON.parse(feed);
  // console.log(data);
  // data.forEach(function(ticker){
  //   gdaxtMkt[ticker['product_id']]
  // })
})

// btcEthWs.on('open', function open() {
//   var req = JSON.stringify({
//     "method": "subscribeTicker",
//     "params": {
//       "symbol": "ETHBTC"
//     },
//     "id": 123});
//   btcEthWs.send(req);
// })
//
// btcLtcWs.on('open', function open() {
//   var req = JSON.stringify({
//     "method": "subscribeTicker",
//     "params": {
//       "symbol": "LTCBTC"
//     },
//     "id": 123});
//   btcLtcWs.send(req);
// })
//
// btcXrpWs.on('open', function open() {
//   var req = JSON.stringify({
//     "method": "subscribeTicker",
//     "params": {
//       "symbol": "XRPBTC"
//     },
//     "id": 123});
//   btcXrpWs.send(req);
// })

// btcEthWs.on('message', function incoming(data){
//   pusher.trigger('hitbtc-channel', 'ethbtc', {
//
//   })
// })
//
// btcLtcWs.on('message', function incoming(data){
//   console.log(data)
// })
//
// btcXrpWs.on('message', function incoming(data){
//   console.log(data)
// })



module.exports = router;
