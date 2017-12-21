var express = require('express');
var router = express.Router();
var bittrex = require('node-bittrex-api');
var WebSocket = require('ws');
var ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
// var binance = require('binance');
// var binanceWS = new binance.BinanceWS();
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
bittrex.websockets.listen(function(data, client) {
  var bittrexMkt = {};
  if (data.M === 'updateSummaryState') {
    data.A.forEach(function(data_for) {
      data_for.Deltas.forEach(function(marketsDelta) {
        bittrexMkt[marketsDelta.MarketName] = {
          'Last': marketsDelta.Last,
          'High': marketsDelta.High,
          'Low': marketsDelta.Low,
          'Bid': marketsDelta.Bid,
          'Ask': marketsDelta.Ask,
          'BaseVol': marketsDelta.BaseVolume
        };
        // console.log('Ticker Update for '+ marketsDelta.MarketName, marketsDelta);
        // console.log('marketsDelta is ', marketsDelta);
      });
    });
  }
  pusher.trigger('bittrex-channel', 'update', {
    "BTC-XRP": bittrexMkt['BTC-XRP'],
    "BTC-LTC": bittrexMkt['BTC-LTC'],
    "BTC-POWR": bittrexMkt['BTC-POWR'],
    "BTC-XMR": bittrexMkt['BTC-XMR'],
    "BTC-BCC": bittrexMkt['BTC-BCC']
  })
});

ws.on('message', function incoming(feed){
  var binanceMkt = {};
  var data = JSON.parse(feed);
  data.forEach(function(ticker){
    binanceMkt[ticker['s']] = {
      'Last': (ticker['h']+ticker['l'])/2,
      'High': ticker['h'],
      'Low': ticker['l'],
      'Bid': ticker['b'],
      'Ask': ticker['a'],
      'BaseVol': ticker['v']
    };
  })
  pusher.trigger('binance-channel', 'update', {
    "BTC-XRP": binanceMkt['XRPBTC'],
    "BTC-LTC": binanceMkt['LTCBTC'],
    "BTC-XMR": binanceMkt['XMRBTC'],
    "BTC-BCC": binanceMkt['BCCBTC']
  })
})



// binanceWS.onDepthUpdate('BNBBTC', function(data) {
//   console.log(data);
// });



module.exports = router;
