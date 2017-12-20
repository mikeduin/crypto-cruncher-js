var express = require('express');
var router = express.Router();
var bittrex = require('node-bittrex-api');
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
          'BaseVol': marketsDelta.BaseVolume
        };
        // console.log('Ticker Update for '+ marketsDelta.MarketName, marketsDelta);
        // console.log('marketsDelta is ', marketsDelta);
      });
    });
  }
  // pusher.trigger('bittrexMkt', 'updated', bittrexMkt);
  // console.log(bittrexMkt);
  pusher.trigger('my-channel', 'my-event', {
    "BTC-XRP": bittrexMkt['BTC-XRP'],
    "BTC-LTC": bittrexMkt['BTC-LTC'],
    "BTC-POWR": bittrexMkt['BTC-POWR'],
    "BTC-XMR": bittrexMkt['BTC-XMR'],
    "BTC-BCC": bittrexMkt['BTC-ZEC']
  })
});

// bittrex.websockets.subscribe(['BTC-ETH','BTC-SC','BTC-ZEN'], function(data, client) {
//   if (data.M === 'updateExchangeState') {
//     data.A.forEach(function(data_for) {
//       console.log('Market Update for '+ data_for.MarketName, data_for);
//     });
//   }
// });

module.exports = router;
