angular
  .module('cryptoCruncher')
  .controller('ArbController', ['$state', '$pusher', 'marketService', 'authService', 'userService', ArbController])

function ArbController ($state, $pusher, marketService, authService, userService) {
  $(document).ready(function() {
    $('select').material_select();
  });

  var vm = this;
  vm.bittrexMkt = {};
  vm.bittrexVol = {};
  vm.binanceMkt = {};
  vm.binanceVol = {};
  vm.binancePs = {};
  vm.hitbtcMkt = {};
  vm.hitbtcVol = {};
  vm.gdaxMkt = {};
  vm.gdaxVol = {};
  vm.cryptopiaMkt = {};
  vm.cryptopiaVol = {};
  vm.cryptopiaPs = {};
  vm.mins = {};
  vm.maxs = {};
  vm.searchActive = false;
  vm.activeMkt = 'BTC';
  vm.decimals = {'BTC': 8, 'USD': 2, 'ETH': 8};
  vm.activeDec = vm.decimals[vm.activeMkt];
  vm.activeTickers = [];
  vm.userFavs = [];
  vm.adjustDec = adjustDec;
  // vm.currSort = null;
  vm.showSearch = function () {
    if (!vm.searchActive) {
      vm.searchActive = true;
    }
  };
  vm.spread = function (max, min) {
    return ((max-min)/min);
  };

  // vm.currencyToggle = function () {
  //   if (!vm.currSort || vm.currSort === "full_name") {
  //     vm.currSort = '-full_name';
  //   } else {
  //     vm.currSort = "full_name";
  //   };
  // };
  //
  // vm.spreadToggle = function () {
  //   vm.currSort = null;
  //   vm.autoSpreadSort = vm.autoSpreadSort;
  // };
  //
  // vm.autoSpreadSort = function(ticker) {
  //   if (!vm.currSort) {
  //     return -((ticker.maxs[vm.activeMkt] - ticker.mins[vm.activeMkt])/ticker.maxs[vm.activeMkt])
  //   } else {
  //     return ticker['full_name'];
  //   };
  // };

  (function getSymbols () {
    marketService.getSymbols().then(function(res){
      vm.symbolIndex = res;
    })
  })();

  vm.currentUser = function () {
    return authService.currentUser();
  };

  vm.fetchFavs = function () {
    userService.fetchFavs(vm.currentUser()).then(function(favs){
      vm.userFavs = favs;
    })
  };
  vm.fetchFavs();

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

  vm.toggleFav = function (symbol) {
    if (!authService.currentUser()){
      alert('Log in to save favorite symbols');
      return
    };
    if (vm.userFavs.indexOf(symbol) == -1) {
      // add favorite
      userService.addFav(vm.currentUser(), symbol).then(function(added){
        vm.userFavs.push(added[0].symbol);
      })
    } else {
      // remove favorite
      userService.removeFav(vm.currentUser(), symbol).then(function(deleted){
        var index = vm.userFavs.indexOf(deleted);
        vm.userFavs.splice(index, 1);
      })
    }
  };

  vm.favsToTable = function() {
    if (!authService.currentUser()){
      alert('Log in to load your favorites');
    } else {
      if (vm.userFavs.length == 0) {
        vm.fetchFavs();
      };
      vm.activeTickers = [];
      for (var i=0; i<vm.userFavs.length; i++) {
        for (var j=0; j<vm.symbolIndex.length; j++) {
          if (vm.symbolIndex[j].symbol === vm.userFavs[i]){
            vm.activeTickers.push(vm.symbolIndex[j])
          };
        };
      };
    };
  };

  vm.moveToTop = function (ticker) {
    var index = vm.activeTickers.indexOf(ticker);
    vm.activeTickers.splice(index, 1);
    vm.activeTickers.unshift(ticker);
  };

  function adjustDec () {
    vm.activeDec = vm.decimals[vm.activeMkt];
  };

  function findMins () {
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
      if (vm.cryptopiaMkt[vm.activeTickers[i].market['BTC']['cryptopia']]) {
        btcMins.push(vm.cryptopiaMkt[vm.activeTickers[i].market['BTC']['cryptopia']]);
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

      vm.activeTickers[i]['mins'] = {
        'USD': Math.min.apply(null, usdMins),
        'BTC': Math.min.apply(null, btcMins),
        'ETH': Math.min.apply(null, ethMins)
      }
    };
  };

  function findMaxs () {
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
      if (vm.cryptopiaMkt[vm.activeTickers[i].market['BTC']['cryptopia']]) {
        btcMaxs.push(vm.cryptopiaMkt[vm.activeTickers[i].market['BTC']['cryptopia']]);
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

      vm.activeTickers[i]['maxs'] = {
        'USD': Math.max.apply(null, usdMaxs),
        'BTC': Math.max.apply(null, btcMaxs),
        'ETH': Math.max.apply(null, ethMaxs)
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
  });

  var bittrexVolume = pusher.subscribe('bittrex-vol');
  bittrexVolume.bind('update', function(data){
    Object.keys(data).forEach(function(key){
      vm.bittrexVol[key] = data[key];
    });
  });

  var binanceChannel = pusher.subscribe('binance-channel');
  binanceChannel.bind('update', function(data){
    Object.keys(data).forEach(function(key){
      vm.binanceMkt[key] = data[key];
    });
    findMins();
    findMaxs();
  });

  var binanceVolume = pusher.subscribe('binance-vol');
  binanceVolume.bind('update', function(data){
    Object.keys(data).forEach(function(key){
      vm.binanceVol[key] = data[key];
    });
  });

  var binancePs = pusher.subscribe('binance-p');
  binancePs.bind('update', function(data){
    Object.keys(data).forEach(function(key){
      vm.binancePs[key] = data[key];
    });
    console.log(vm.binancePs);
  });

  var gdaxChannel = pusher.subscribe('gdax-channel');
  gdaxChannel.bind('update', function(data){
    Object.keys(data).forEach(function(key){
      vm.gdaxMkt[key] = data[key];
    });
    findMins();
    findMaxs();
  });

  var gdaxVolume = pusher.subscribe('gdax-vol');
  gdaxVolume.bind('update', function(data){
    Object.keys(data).forEach(function(key){
      vm.gdaxVol[key] = data[key];
    });
  });

  var hitbtcChannel = pusher.subscribe('hitbtc-channel');
  hitbtcChannel.bind('update', function(data){
    Object.keys(data).forEach(function(key){
      vm.hitbtcMkt[key] = data[key];
    });
    findMins();
    findMaxs();
  });

  var hitbtcVolume = pusher.subscribe('hitbtc-vol');
  hitbtcVolume.bind('update', function(data){
    Object.keys(data).forEach(function(key){
      vm.hitbtcVol[key] = data[key];
    });
  });

  var cryptopiaChannel = pusher.subscribe('cryptopia-channel');
  cryptopiaChannel.bind('update', function(data){
    Object.keys(data).forEach(function(key){
      vm.cryptopiaMkt[key] = data[key];
    });
    findMins();
    findMaxs();
  });

  var cryptopiaPs = pusher.subscribe('cryptopia-p');
  cryptopiaPs.bind('update', function(data){
    Object.keys(data).forEach(function(key){
      vm.cryptopiaPs[key] = data[key];
    });
  });

  setInterval(function(){
    marketService.fetchCryptopiaVol().then(function(volume){
      vm.cryptopiaVol = volume;
    })
  }, 60000);

}
