angular
  .module('cryptoCruncher')
  .controller('TradeController', ['$state', 'tradeService', TradeController])

function TradeController ($state, tradeService) {
  $(document).ready(function() {
    $('select').material_select();
  });

  var vm = this;

  vm.tradeView = function (type) {
    if (type === "long") {
      $state.go('home.addTrade.long');
    } else if (type === "short") {
      $state.go('home.addTrade.short');
    } else if (type === "arb") {
      $state.go('home.addTrade.arb');
    } else if (type === "transfer") {
      $state.go('home.addTrade.transfer')
    }
  };



}
