angular
  .module('cryptoCruncher')
  .controller('MainController', ['$state', '$pusher', MainController])

function MainController ($state, $pusher) {
  var vm = this;
  vm.bittrexMkt = {};
  vm.binanceMkt = {};

  var client = new Pusher('7b31edc5de6a16ed6419', {
    cluster: 'us2'
  });
  var pusher = $pusher(client);
  var bittrexChannel = pusher.subscribe('bittrex-channel');
  bittrexChannel.bind('update', function(data){
    console.log(data);
    vm.bittrexMkt = data;
  });

  var binanceChannel = pusher.subscribe('binance-channel');
  binanceChannel.bind('update', function(data){
    console.log(data);
    vm.binanceMkt = data;
  })


  // vm.lastPrices = {}

  // Pusher.subscribe('lastPrices', 'updated', function(market){
  //   vm.lastPrices = market;
  // })
}
