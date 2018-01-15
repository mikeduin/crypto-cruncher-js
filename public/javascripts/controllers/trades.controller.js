angular
  .module('cryptoCruncher')
  .controller('TradeController', ['$state', 'tradeService', TradeController])

function TradeController ($state, tradeService) {
  $(document).ready(function() {
    $('select').material_select();
  });

  var vm = this;
  vm.tradeType = 'reset';
  vm.tradeParts = 'half';
  vm.tradeDir = 'openAdd';
  vm.arbType = 'immed';

  vm.tradeView = function () {
    if (vm.tradeType === "long") {
      $state.go('home.addTrade.long');
      vm.typeDesc = descLong;
      // vm.tradeParts = null ... no parts for long term trade
      // vm.tradeDir = visible, no message needed
      // vm.arbType = null
    } else if (vm.tradeType === "short") {
      vm.typeDesc = descShort;
      if (vm.tradeParts === "half") {
        vm.partsDesc = descPart;
      } else {
        vm.partsDesc = descWhole
      };
      $state.go('home.addTrade.short');
    } else if (vm.tradeType === "arb") {
      vm.typeDesc = descArb;
      $state.go('home.addTrade.arb');
    } else if (vm.tradeType === "transfer") {
      vm.typeDesc = descTransfer;
      $state.go('home.addTrade.transfer')
    } else if (vm.tradeType === "powder") {
      vm.typeDesc = descPowder;
      $state.go('home.addTrade.powder')
    } else if (vm.tradeType === "deposit") {
      vm.typeDesc = descDeposit;
      $state.go('home.addTrade.deposit')
    } else if (vm.tradeType === "reset") {
      vm.typeDesc = null;
      $state.go('home.addTrade');
    }
  };

  vm.partsAdj = function (sel) {
    if (sel === "part") {
      vm.partsDesc = descHalf;
    } else if (sel === "all") {
      vm.partsDesc = descWhole;
    }
  };

  vm.arbAdj = function (sel) {
    if (sel === "immed") {
      vm.arbType = arbImmed;
    } else if (sel === "delay") {
      vm.arbType = arbDelay;
    }
  }

  vm.intro = "Enter your trade details here. The 'trade type' distinctions exist in order to provide enhanced reporting relative to the type of trades you are making. If you have no interest in such a thing, feel free to leave all trades classified as 'long term positions.' Note that you can always come back and edit any entry in your trade log.";

  var descLong = "Classify a trade as a 'long-term position' when you are buying with plans to hold for the foreseeable future, or closing/reducing a position that you have previously opened as long-term.";

  var descShort = "'Short term flip' should be used when you buy or sell an asset because you believe a price reversal will take place in the near future, allowing you to then 'flip' your original play at an advantageous price point and earn a profit.";

  var descArb = "The 'arbitrage' classification should be used when making a trade to take advantage of market inefficiencies across different exchanges.";

  var descPowder = "Use this classification in an instance in which you reduce or liquidate a position with the intent of re-buying as soon as you're able to do so -- but for the time being, you really need some of that 'dry powder' to work with to make another play, and the easiest way to gain that capital is to temporarily sell or reduce this position.";

  var descExchange = "Use this classification when you are exchanging one currency for another assuming no tangible impact on profit or loss, such as a swap for a currency that will move faster between exchanges."

  var descTransfer = "Use the 'transfer' classification when you are sending currency from one exchange to another.";

  var descDeposit = "Use this when depositing USD$ into an exchange.";

  var descPart = "Select 'part of a trade' for things like half of a two-trade play (such as one side of an arbitrage trade), or a component of a larger trade that was entered at multiple price points.";

  var descWhole = "Use 'all of a trade' if you are entering both halves of an arbitrage, short-term flip, dry powder grab, or transfer between exchanges.";

  var arbImmed = "Use the 'immediate' sub-classification if both halves of the play were able to be executed in a reasonable or expected timeframe.";

  var arbDelay = "Select 'conversion delay' if circumstances outside of your control -- such as a delay in transfer time from one exchange to another -- resulted in the second-half of a play being settled later than you'd originally planned.";

}
