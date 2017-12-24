angular
  .module('cryptoCruncher')
  .controller('MainController', ['$state', '$pusher', MainController])

function MainController ($state, $pusher) {
  var vm = this;
  vm.bittrexMkt = {};
  vm.binanceMkt = {};
  vm.hitbtcMkt = {};
  vm.gdaxMkt = {};

  function findMins () {
    vm.btcMin = Math.min(
      parseFloat(vm.gdaxMkt['BTC-USD']),
      parseFloat(vm.bittrexMkt['USDT-BTC']),
      parseFloat(vm.binanceMkt['BTCUSDT']),
      parseFloat(vm.hitbtcMkt['BTCUSD'])
    );

    vm.xrpMin = Math.min(
      parseFloat(vm.bittrexMkt['BTC-XRP']),
      parseFloat(vm.binanceMkt['XRPBTC']),
      parseFloat(vm.hitbtcMkt['XRPBTC'])
    );

    console.log(parseFloat(vm.gdaxMkt['BCH-USD'] / vm.gdaxMkt['BTC-USD']));

    vm.bccMin = Math.min(
      parseFloat(vm.gdaxMkt['BCH-USD'] / vm.gdaxMkt['BTC-USD']),
      parseFloat(vm.bittrexMkt['BTC-BCC']),
      parseFloat(vm.binanceMkt['BCCBTC']),
      parseFloat(vm.hitbtcMkt['BCHBTC'])
    )
  };

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
