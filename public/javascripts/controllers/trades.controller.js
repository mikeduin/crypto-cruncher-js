angular
  .module('cryptoCruncher')
  .controller('TradeController', ['$state', 'tradeService', 'marketService', TradeController])

function TradeController ($state, tradeService, marketService) {
  $(document).ready(function() {
    $('select').material_select();
  });

  var vm = this;
  vm.defTime = new Date(2017, 0, 1, 12, 00, 0);
  vm.defDate = new Date();
  vm.tradeType = 'reset';
  vm.tradeParts = 'part';
  vm.tradeDir = 'openAdd';
  vm.arbType = 'immed';
  vm.partsView = false;
  vm.directionView = false;
  vm.arbView = false;
  vm.exchanges = ['GDAX', 'Coinbase', 'Binance', 'Bittrex', 'Bitfinex', 'HitBTC', 'KuCoin', 'Cryptopia', 'Other'];

  vm.tradeSubmit = function(trade) {
    var date = moment().set({
      'year': trade.date.getFullYear(),
      'month': trade.date.getMonth(),
      'date': trade.date.getDate(),
      'hour': trade.time.getHours(),
      'minute': trade.time.getMinutes()
    });
    console.log(date);
  };

  vm.tradeView = function () {
    function partsView () {
      if (vm.tradeParts == 'part') {
        vm.partsView = true;
        vm.directionView = true;
        vm.partsDesc = descPart;
        $state.go('home.addTrade.partial');
      } else {
        vm.directionView = false;
        vm.partsDesc = descWhole;
        $state.go('home.addTrade.whole');
      };
    };

    function dirView () {
      if (vm.tradeDir == 'openAdd') {
        if (vm.tradeType == 'deposit') {
          vm.dirDesc = descDeposit;
        } else {
          vm.dirDesc = descOpen;
        };
      } else if (vm.tradeDir == 'closeReduce') {
        if (vm.tradeType == 'deposit') {
          vm.dirDesc = descWithdrawal;
        } else {
          vm.dirDesc = descClose;
        };
      } else if (vm.tradeDir == 'na') {
        vm.dirDesc = descNA;
      };
    };


    if (vm.tradeType === "long" || vm.tradeType === "transfer") {
      vm.typeDesc = descLong;
      vm.partsView = false;
      vm.directionView = true;
      partsView();
      dirView();
    } else if (vm.tradeType === "short") {
      vm.typeDesc = descShort;
      vm.partsView = true;
      partsView();
      dirView();
    } else if (vm.tradeType === "arb") {
      vm.typeDesc = descArb;
      vm.partsView = true;
      partsView();
      dirView();
    } else if (vm.tradeType === "powder") {
      vm.typeDesc = descPowder;
      vm.partsView = true;
      partsView();
      dirView();
    } else if (vm.tradeType === "exchange") {
      vm.typeDesc = descExchange;
      vm.partsView = true;
      partsView();
      dirView();
    } else if (vm.tradeType === "deposit") {
      vm.typeDesc = descDeposit;
      vm.directionView = true;
      vm.partsView = false;
      dirView();
      $state.go('home.addTrade.deposit');
    } else if (vm.tradeType === "reset") {
      vm.typeDesc = null;
      vm.directionView = false;
      vm.partsView = false;
    };
  };


  vm.arbAdj = function (sel) {
    if (sel === "immed") {
      vm.arbType = arbImmed;
    } else if (sel === "delay") {
      vm.arbType = arbDelay;
    }
  }

  vm.intro = "Enter your trade details here. The 'trade type' distinctions exist both to provide enhanced reporting relative to the types of trades you are making and to help you monitor any open positions that you intend to close. If you have no interest in such things, feel free to leave all trades classified as 'long term positions.' Note that you can always come back and edit any entry in your trade log.";

  var descLong = "Classify a trade as a 'long-term position' when you are buying with plans to hold for the foreseeable future, or closing/reducing a position that you have previously opened as long-term.";

  var descShort = "'Short term flip' should be used when you buy or sell an asset because you believe a price reversal will take place in the near future, allowing you to then 'flip' your original play at an advantageous price point and earn a profit.";

  var descArb = "The 'arbitrage' classification should be used when making a trade to take advantage of market inefficiencies across different exchanges.";

  var descPowder = "Use this classification in an instance in which you reduce or liquidate a position with the intent of re-buying as soon as you're able to do so -- but for the time being, you really need some of that 'dry powder' to work with to make another play, and the easiest way to gain that capital is to temporarily sell or reduce this position.";

  var descExchange = "Use 'exchange' when you are trading one currency for another for the sole purpose of moving funds between exchanges more quickly, with the intent to reverse your original transaction as soon as the transfer between exchanges has completed."

  var descTransfer = "Use the 'transfer' classification when you are sending currency from one exchange to another.";

  var descDeposit = "Use this when depositing USD$ into an exchange.";

  var descPart = "Select 'part of a trade' for things like half of a two-trade play (such as one side of an arbitrage trade), or a component of a larger trade that was entered at multiple price points."

  var descWhole = "Use 'all of a trade' if you are entering both halves of an arbitrage, short-term flip or dry powder grab.";

  var arbImmed = "Use the 'immediate' sub-classification if both halves of the play were able to be executed in a reasonable or expected timeframe.";

  var arbDelay = "Select 'conversion delay' if circumstances outside of your control -- such as a delay in transfer time from one exchange to another -- resulted in the second-half of a play being settled later than you'd originally planned.";

  var descOpen = "Use this if you are buying an altcoin in exchange for a base currency like Bitcoin or Ethereum."

  var descClose = "Use this if you are selling an altcoin in exchange for a base currency like Bitcoin or Ethereum."

  var descNA = "Use this if you are trading one base currency for another or exchanging two currencies for which you always expect to have positions."

  var descDeposit = "Use this when depositing from your bank account or credit card and into an exchange.";

  var descWithdrawal = "Use this when withdrawing from an exchange and into your bank account.";
}
