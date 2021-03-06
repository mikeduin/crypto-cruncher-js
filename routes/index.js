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
// router.get('/', function(req, res, next) {
//   res.redirect('index.html');
// });

var pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: 'us2',
  encrypted: true
});

var binanceVol = {};
var gdaxVol = {};
var bittrexVol = {};
var hitbtcVol = {};
var cryptopiaVol = {};
var binancePs = {};
var cryptopiaPs = {};
var bitfinexVol = {};
var bitfinexPs = {};
var kucoinVol = {};
var kucoinPs = {};

console.log('Connecting ....');

// setInterval(function(){
//   pusher.trigger('binance-vol', 'update', binanceVol);
//   pusher.trigger('binance-p', 'update', binancePs);
//   pusher.trigger('bittrex-vol', 'update', bittrexVol);
//   pusher.trigger('gdax-vol', 'update', gdaxVol);
//   pusher.trigger('cryptopia-p', 'update', cryptopiaPs);
//   pusher.trigger('hitbtc-vol', 'update', hitbtcVol);
//   pusher.trigger('bitfinex-vol', 'update', bitfinexVol);
//   pusher.trigger('bitfinex-p', 'update', bitfinexPs);
//   pusher.trigger('kucoin-vol', 'update', kucoinVol);
//   pusher.trigger('kucoin-p', 'update', kucoinPs)
// }, 60000);

router.get('/getSymbols', function(req, res, next){
  knex('index as i')
    .leftJoin('bittrex as bitt', 'bitt.mySymbol', 'i.mySymbol')
    .leftJoin('gdax as g', 'g.mySymbol', 'i.mySymbol')
    .leftJoin('binance as bin', 'bin.mySymbol', 'i.mySymbol')
    .leftJoin('hitbtc as hit', 'hit.mySymbol', 'i.mySymbol')
    .leftJoin('cryptopia as cry', 'cry.mySymbol', 'i.mySymbol')
    .leftJoin('bitfinex as bit', 'bit.mySymbol', 'i.mySymbol')
    .leftJoin('kucoin as kuc', 'kuc.mySymbol', 'i.mySymbol')
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
      'cry.btc as cry.btc',
      'bit.btc as bit.btc',
      'bit.eth as bit.eth',
      'bit.usd as bit.usd',
      'kuc.btc as kuc.btc',
      'kuc.eth as kuc.eth',
      'kuc.usd as kuc.usd'
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
              'hitbtc': ticker[i]['hit.usd'],
              'bitfinex': ticker[i]['bit.usd'],
              'kucoin': ticker[i]['kuc.usd']
            },
            'BTC': {
              'gdax': ticker[i]['g.btc'],
              'bittrex': ticker[i]['bitt.btc'],
              'binance': ticker[i]['bin.btc'],
              'hitbtc': ticker[i]['hit.btc'],
              'cryptopia': ticker[i]['cry.btc'],
              'bitfinex': ticker[i]['bit.btc'],
              'kucoin': ticker[i]['kuc.btc']
            },
            'ETH': {
              'gdax': ticker[i]['g.eth'],
              'bittrex': ticker[i]['bitt.eth'],
              'binance': ticker[i]['bin.eth'],
              'hitbtc': ticker[i]['hit.eth'],
              'bitfinex': ticker[i]['bit.eth'],
              'kucoin': ticker[i]['kuc.eth']
            }
          }
        })
      };
      res.json(marketIndex);
  });
})

router.get('/cryptopiaVol', function(req, res, next){
  res.json(cryptopiaVol);
})

setInterval(function(req, res, next){
  fetch('https://api.hitbtc.com/api/2/public/ticker').then(function(res){
    return res.json();
  }).then(function(ticker){
    var hitbtcMkt = {};
    ticker.forEach(function(token){
      hitbtcMkt[token.symbol] = token.last;
      hitbtcVol[token.symbol] = token.volume;
    });
    // pusher.trigger('hitbtc-channel', 'update', hitbtcMkt);
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
      cryptopiaVol[token.Label] = token.Volume;
      cryptopiaPs[token.Label] = token.Change;
    });
    // pusher.trigger('cryptopia-channel', 'update', cryptopiaMkt);
  });
}, 4000);

setInterval(function(req, res, next){
  fetch('https://api.bitfinex.com/v2/tickers?symbols=tAVTBTC,tBATBTC,tBCHBTC,tBTGBTC,tDASHBTC,tEDOBTC,tEOSBTC,tETCBTC,tETHBTC,tETPBTC,tFUNBTC,tGNTBTC,tIOTABTC,tMNABTC,tNEOBTC,tOMGBTC,tQTUMBTC,tSANBTC,tSNTBTC,tTNBBTC,tXMRBTC,tXRPBTC,tYYWBTC,tZECBTC,tZRXBTC,tDATABTC,tQASHBTC,tSPKBTC,tRRTBTC,tAVTUSD,tBATUSD,tBCHUSD,tBTCUSD,tBTGUSD,tDASHUSD,tEDOUSD,tEOSUSD,tETCUSD,tETHUSD,tETPUSD,tFUNUSD,tGNTUSD,tIOTAUSD,tLTCUSD,tMNAUSD,tNEOUSD,tOMGUSD,tQTUMUSD,tSANUSD,tSNTUSD,tTNBUSD,tTNBUSD,tXMRUSD,tXRPUSD,tYYWUSD,tZECUSD,tZRXUSD,tDATAUSD,tQASHUSD,tSPKUSD,tRRTUSD,tAVTETH,tBATETH,tBCHETH,tEDOETH,tEOSETH,tETPETH,tFUNETH,tGNTETH,tIOTAETH,tMNAETH,tNEOETH,tOMGETH,tQTUMETH,tSANETH,tSNTETH,tTNBETH,tYYWETH,tZRXETH,tDATAETH,tQASHETH,tSPKETH').then(function(res){
    return res.json();
  }).then(function(data){
    var bitfinexMkt = {};
    data.forEach(function(ticker){
      //symbol = array[0];
      //percChg = array[6];
      //last = array[7];
      //vol = array[8];
      var perc = ticker[6]*100;
      bitfinexMkt[ticker[0]] = ticker[7];
      bitfinexPs[ticker[0]] = perc;
      bitfinexVol[ticker[0]] = ticker[8];
    });
    // pusher.trigger('bitfinex-channel', 'update', bitfinexMkt);
  })
}, 4000);

setInterval(function(req, res, next){
  fetch('https://api.kucoin.com/v1/open/tick').then(function(res){
    return res.json();
  }).then(function(data){
    var looped = data.data
    var kucoinMkt = {};
    looped.forEach(function(ticker){
      var pct = ticker.changeRate * 100;
      kucoinMkt[ticker.symbol] = ticker.lastDealPrice;
      kucoinVol[ticker.symbol] = ticker.vol;
      kucoinPs[ticker.symbol] = pct;
    });
    // pusher.trigger('kucoin-channel', 'update', kucoinMkt);
  })
}, 4000);


bittrex.websockets.listen(function(data, client) {
  var bittrexMkt = {};
  if (data.M === 'updateSummaryState') {
    data.A.forEach(function(data_for) {
      data_for.Deltas.forEach(function(marketsDelta) {
        bittrexMkt[marketsDelta.MarketName] = marketsDelta.Last;
        bittrexVol[marketsDelta.MarketName] = marketsDelta.Volume;
      });
    });
  }
  // pusher.trigger('bittrex-channel', 'update', bittrexMkt);
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
  };
  data.forEach(function(ticker){
    var last = (parseFloat(ticker['b']) + parseFloat(ticker['a']))/2;
    var vol = parseInt(ticker['v']);
    var perc = parseFloat(ticker['P']);
    binanceMkt[ticker['s']] = last;
    binanceVol[ticker['s']] = vol;
    binancePs[ticker['s']] = perc;
  });
  // pusher.trigger('binance-channel', 'update', binanceMkt);
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
  gdaxVol[data['product_id']] = data['volume_24h'];
  if (count % 4 === 0) {
    // pusher.trigger('gdax-channel', 'update', gdaxMkt);
  };
})

module.exports = router;
