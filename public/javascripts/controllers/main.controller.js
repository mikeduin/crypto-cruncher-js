angular
  .module('cryptoCruncher')
  .controller('MainController', ['$state', '$pusher', MainController])

function MainController ($state, $pusher) {
  var vm = this;

  var client = new Pusher('7b31edc5de6a16ed6419', {
    cluster: 'us2'
  });
  var pusher = $pusher(client);
  var channel = pusher.subscribe('my-channel');
  channel.bind('my-event', function(data){
    alert(data.message);
  })


  vm.lastPrices = {}

  // Pusher.subscribe('lastPrices', 'updated', function(market){
  //   vm.lastPrices = market;
  // })
}
