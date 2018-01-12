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
      vm.typeDesc = descLong;
      $state.go('home.addTrade.long');
    } else if (type === "short") {
      vm.typeDesc = descShort;
      $state.go('home.addTrade.short');
    } else if (type === "arb") {
      vm.typeDesc = descArb;
      $state.go('home.addTrade.arb');
    } else if (type === "transfer") {
      vm.typeDesc = descTransfer;
      $state.go('home.addTrade.transfer')
    } else if (type === "powder") {
      vm.typeDesc = descPowder;
    } else if (type === "deposit") {
      vm.typeDesc = descDeposit;
    }
  };

  var descLong = "Classify a trade as 'long-term position' when you are buying with plans to hold for the foreseeable future, or closing/reducing a position for which that previously applied."

  var descShort = "'Short term flip' should be used when you buy or sell an asset because you believe a price reversal will take place in the near future, allowing you to then 'flip' your original play at an advantageous price point and earn a profit."

  var descArb = "The 'arbitrage' classification should be used when making a trade to take advantage of market inefficiencies across different exchanges. Use the 'immediate' sub-classification if both halves of the play were able to be executed in a reasonable or expected timeframe, or 'conversion delay' if circumstances out of your control -- such as an unexpected delay in a transfer from one exchange to another -- resulted in the second-half of the trade being settled at a date later than you'd originally planned."

  var descPowder = "Use this classification in an instance in which you reduce or liquidate a position with the intent to re-buy as soon as you're able to do so -- but for the time being, you really need some of that dry powder to work with to make another play, and the easiest way to gain that capital is to temporarily sell or reduce this position."

  var descTransfer = "Use the 'transfer' classification when you are sending currency from one exchange to another."

  var descDeposit = "Use this when depositing USD$ into an exchange."
}
