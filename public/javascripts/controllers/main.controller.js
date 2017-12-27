angular
  .module('cryptoCruncher')
  .controller('MainController', ['$state', '$pusher', 'marketService', MainController])

function MainController ($state, $pusher, marketService) {

  // $(document).ready(function() {
  //   $('.tooltipped').tooltip({delay: 50});
  // });

  var vm = this;
  vm.bittrexMkt = {};
  vm.binanceMkt = {};
  vm.hitbtcMkt = {};
  vm.gdaxMkt = {};
  vm.mins = {};
  vm.maxs = {};
  vm.decimals = {
    'BTC': 8,
    'USD': 2,
    'ETH': 8
  };
  vm.activeMkt = 'BTC';
  vm.activeDec = vm.decimals[vm.activeMkt];
  vm.activeTickers = [];
  vm.adjustDec = function(){
    vm.activeDec = vm.decimals[vm.activeMkt];
  };

  (function getSymbols () {
    marketService.getSymbols().then(function(res){
      vm.symbolIndex = res;
    })
  })();

  vm.addCurr = function () {
    if(vm.activeTickers.indexOf(vm.currSelected) == -1) {
      vm.activeTickers.push(vm.currSelected)
    } else {
      console.log('currency already in there');
    };
  };

  vm.removeCurr = function (ticker) {
    var index = vm.activeTickers.indexOf(ticker);
    vm.activeTickers.splice(index, 1);
  };

  function findMins () {
    vm.marketMins = {};
    for (var i=0; i<vm.activeTickers.length; i++) {
      var usdMins = [];
      var btcMins = [];
      var ethMins = [];
      if (vm.gdaxMkt[vm.activeTickers[i].market['USD']['gdax']]) {
        usdMins.push(vm.gdaxMkt[vm.activeTickers[i].market['USD']['gdax']]);
      };
      if (vm.bittrexMkt[vm.activeTickers[i].market['USD']['bittrex']]) {
        usdMins.push(vm.bittrexMkt[vm.activeTickers[i].market['USD']['bittrex']]);
      };
      if (vm.binanceMkt[vm.activeTickers[i].market['USD']['binance']]) {
        usdMins.push(vm.binanceMkt[vm.activeTickers[i].market['USD']['binance']]);
      };
      if (vm.hitbtcMkt[vm.activeTickers[i].market['USD']['hitbtc']]) {
        usdMins.push(vm.hitbtcMkt[vm.activeTickers[i].market['USD']['hitbtc']]);
      };
      if (vm.gdaxMkt[vm.activeTickers[i].market['BTC']['gdax']]) {
        btcMins.push(vm.gdaxMkt[vm.activeTickers[i].market['BTC']['gdax']]);
      };
      if (vm.bittrexMkt[vm.activeTickers[i].market['BTC']['bittrex']]) {
        btcMins.push(vm.bittrexMkt[vm.activeTickers[i].market['BTC']['bittrex']]);
      };
      if (vm.binanceMkt[vm.activeTickers[i].market['BTC']['binance']]) {
        btcMins.push(vm.binanceMkt[vm.activeTickers[i].market['BTC']['binance']]);
      };
      if (vm.hitbtcMkt[vm.activeTickers[i].market['BTC']['hitbtc']]) {
        btcMins.push(vm.hitbtcMkt[vm.activeTickers[i].market['BTC']['hitbtc']]);
      };
      if (vm.gdaxMkt[vm.activeTickers[i].market['ETH']['gdax']]) {
        ethMins.push(vm.gdaxMkt[vm.activeTickers[i].market['ETH']['gdax']]);
      };
      if (vm.bittrexMkt[vm.activeTickers[i].market['ETH']['bittrex']]) {
        ethMins.push(vm.bittrexMkt[vm.activeTickers[i].market['ETH']['bittrex']]);
      };
      if (vm.binanceMkt[vm.activeTickers[i].market['ETH']['binance']]) {
        ethMins.push(vm.binanceMkt[vm.activeTickers[i].market['ETH']['binance']]);
      };
      if (vm.hitbtcMkt[vm.activeTickers[i].market['ETH']['hitbtc']]) {
        ethMins.push(vm.hitbtcMkt[vm.activeTickers[i].market['ETH']['hitbtc']]);
      };

      vm.marketMins[vm.activeTickers[i]['symbol']] = {
        'USD': Math.min.apply(null, usdMins),
        'BTC': Math.min.apply(null, btcMins),
        'ETC': Math.min.apply(null, ethMins)
      };
    };
  };

  function findMaxs () {
    vm.marketMaxs = {};
    for (var i=0; i<vm.activeTickers.length; i++) {
      var usdMaxs = [];
      var btcMaxs = [];
      var ethMaxs = [];
      if (vm.gdaxMkt[vm.activeTickers[i].market['USD']['gdax']]) {
        usdMaxs.push(vm.gdaxMkt[vm.activeTickers[i].market['USD']['gdax']]);
      };
      if (vm.bittrexMkt[vm.activeTickers[i].market['USD']['bittrex']]) {
        usdMaxs.push(vm.bittrexMkt[vm.activeTickers[i].market['USD']['bittrex']]);
      };
      if (vm.binanceMkt[vm.activeTickers[i].market['USD']['binance']]) {
        usdMaxs.push(vm.binanceMkt[vm.activeTickers[i].market['USD']['binance']]);
      };
      if (vm.hitbtcMkt[vm.activeTickers[i].market['USD']['hitbtc']]) {
        usdMaxs.push(vm.hitbtcMkt[vm.activeTickers[i].market['USD']['hitbtc']]);
      };
      if (vm.gdaxMkt[vm.activeTickers[i].market['BTC']['gdax']]) {
        btcMaxs.push(vm.gdaxMkt[vm.activeTickers[i].market['BTC']['gdax']]);
      };
      if (vm.bittrexMkt[vm.activeTickers[i].market['BTC']['bittrex']]) {
        btcMaxs.push(vm.bittrexMkt[vm.activeTickers[i].market['BTC']['bittrex']]);
      };
      if (vm.binanceMkt[vm.activeTickers[i].market['BTC']['binance']]) {
        btcMaxs.push(vm.binanceMkt[vm.activeTickers[i].market['BTC']['binance']]);
      };
      if (vm.hitbtcMkt[vm.activeTickers[i].market['BTC']['hitbtc']]) {
        btcMaxs.push(vm.hitbtcMkt[vm.activeTickers[i].market['BTC']['hitbtc']]);
      };
      if (vm.gdaxMkt[vm.activeTickers[i].market['ETH']['gdax']]) {
        ethMaxs.push(vm.gdaxMkt[vm.activeTickers[i].market['ETH']['gdax']]);
      };
      if (vm.bittrexMkt[vm.activeTickers[i].market['ETH']['bittrex']]) {
        ethMaxs.push(vm.bittrexMkt[vm.activeTickers[i].market['ETH']['bittrex']]);
      };
      if (vm.binanceMkt[vm.activeTickers[i].market['ETH']['binance']]) {
        ethMaxs.push(vm.binanceMkt[vm.activeTickers[i].market['ETH']['binance']]);
      };
      if (vm.hitbtcMkt[vm.activeTickers[i].market['ETH']['hitbtc']]) {
        ethMaxs.push(vm.hitbtcMkt[vm.activeTickers[i].market['ETH']['hitbtc']]);
      };

      vm.marketMaxs[vm.activeTickers[i]['symbol']] = {
        'USD': Math.max.apply(null, usdMaxs),
        'BTC': Math.max.apply(null, btcMaxs),
        'ETC': Math.max.apply(null, ethMaxs)
      };
    };
  };

  var client = new Pusher('7b31edc5de6a16ed6419', {
    cluster: 'us2'
  });
  var pusher = $pusher(client);

  var bittrexChannel = pusher.subscribe('bittrex-channel');
  bittrexChannel.bind('update', function(data){
    Object.keys(data).forEach(function(key){
      vm.bittrexMkt[key] = data[key];
    });
    findMins();
    findMaxs();
    // console.log('vm.bittrexMkt is ', vm.bittrexMkt);
  });

  var binanceChannel = pusher.subscribe('binance-channel');
  binanceChannel.bind('update', function(data){
    Object.keys(data).forEach(function(key){
      vm.binanceMkt[key] = data[key];
    });
    findMins();
    findMaxs();
    // console.log('vm.binanceMkt is ', vm.binanceMkt);
  });

  var gdaxChannel = pusher.subscribe('gdax-channel');
  gdaxChannel.bind('update', function(data){
    Object.keys(data).forEach(function(key){
      vm.gdaxMkt[key] = data[key];
    });
    findMins();
    findMaxs();
    // console.log(data);
  })

  var hitbtcChannel = pusher.subscribe('hitbtc-channel');
  hitbtcChannel.bind('update', function(data){
    Object.keys(data).forEach(function(key){
      vm.hitbtcMkt[key] = data[key];
    });
    findMins();
    findMaxs();
    // console.log(vm.hitbtcMkt);
  })

}
