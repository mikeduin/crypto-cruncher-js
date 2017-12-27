angular
  .module('cryptoCruncher')
  .controller('MainController', ['$state', '$pusher', 'marketService', MainController])

function MainController ($state, $pusher, marketService) {

  // $(document).ready(function() {
  //   $('select').material_select();
  // });

  var vm = this;
  vm.bittrexMkt = {};
  vm.binanceMkt = {};
  vm.hitbtcMkt = {};
  vm.gdaxMkt = {};
  vm.mins = {};
  vm.maxs = {};
  vm.activeMkt = 'BTC';
  vm.aciveDec = 8;
  vm.activeTickers = [];

  (function getSymbols () {
    marketService.getSymbols().then(function(res){
      vm.symbolIndex = res;
    })
  })();

  vm.addCurrency = function(){
    vm.activeTickers.push(vm.currSelected)
  };

  function findMins () {
    vm.marketMins = {};
    for (var i=0; i<vm.activeTickers.length; i++) {
      var mins = [];
      // var markets = vm.activeTickers[i]['market'];
      // console.log(markets);
      vm.marketMins[vm.activeTickers[i]['symbol']] = {
        'USD': Math.min(
          vm.gdaxMkt[vm.activeTickers[i].market['USD']['gdax']],
          vm.bittrexMkt[vm.activeTickers[i].market['USD']['bittrex']],
          vm.binanceMkt[vm.activeTickers[i].market['USD']['binance']],
          vm.hitbtcMkt[vm.activeTickers[i].market['USD']['hitbtc']]
        )
      }
    };
    console.log(vm.marketMins);
  };



  //   vm.btcMin = Math.min(
  //     parseFloat(vm.gdaxMkt['BTC-USD']),
  //     parseFloat(vm.bittrexMkt['USDT-BTC']),
  //     parseFloat(vm.binanceMkt['BTCUSDT']),
  //     parseFloat(vm.hitbtcMkt['BTCUSD'])
  //   );
  //
  //   vm.xrpMin = Math.min(
  //     parseFloat(vm.bittrexMkt['BTC-XRP']),
  //     parseFloat(vm.binanceMkt['XRPBTC']),
  //     parseFloat(vm.hitbtcMkt['XRPBTC'])
  //   );
  //
  //   vm.bccMin = Math.min(
  //     parseFloat(vm.gdaxMkt['BCH-USD'] / vm.gdaxMkt['BTC-USD']),
  //     parseFloat(vm.bittrexMkt['BTC-BCC']),
  //     parseFloat(vm.binanceMkt['BCCBTC']),
  //     parseFloat(vm.hitbtcMkt['BCHBTC'])
  //   );
  //
  //   vm.ltcMin = Math.min(
  //     parseFloat(vm.gdaxMkt['LTC-BTC']),
  //     parseFloat(vm.bittrexMkt['BTC-LTC']),
  //     parseFloat(vm.binanceMkt['LTCBTC']),
  //     parseFloat(vm.hitbtcMkt['LTCBTC'])
  //   );
  //
  //   vm.xmrMin = Math.min(
  //     parseFloat(vm.bittrexMkt['BTC-XMR']),
  //     parseFloat(vm.binanceMkt['XMRBTC']),
  //     parseFloat(vm.hitbtcMkt['XMRBTC'])
  //   );
  // };

  function findMaxs () {
    vm.btcMax = Math.max(
      parseFloat(vm.gdaxMkt['BTC-USD']),
      parseFloat(vm.bittrexMkt['USDT-BTC']),
      parseFloat(vm.binanceMkt['BTCUSDT']),
      parseFloat(vm.hitbtcMkt['BTCUSD'])
    );

    vm.xrpMax = Math.max(
      parseFloat(vm.bittrexMkt['BTC-XRP']),
      parseFloat(vm.binanceMkt['XRPBTC']),
      parseFloat(vm.hitbtcMkt['XRPBTC'])
    );

    vm.bccMax = Math.max(
      parseFloat(vm.gdaxMkt['BCH-USD'] / vm.gdaxMkt['BTC-USD']),
      parseFloat(vm.bittrexMkt['BTC-BCC']),
      parseFloat(vm.binanceMkt['BCCBTC']),
      parseFloat(vm.hitbtcMkt['BCHBTC'])
    );

    vm.ltcMax = Math.max(
      parseFloat(vm.gdaxMkt['LTC-BTC']),
      parseFloat(vm.bittrexMkt['BTC-LTC']),
      parseFloat(vm.binanceMkt['LTCBTC']),
      parseFloat(vm.hitbtcMkt['LTCBTC'])
    );

    vm.xmrMax = Math.max(
      parseFloat(vm.bittrexMkt['BTC-XMR']),
      parseFloat(vm.binanceMkt['XMRBTC']),
      parseFloat(vm.hitbtcMkt['XMRBTC'])
    );
  }

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
