angular
  .module('cryptoCruncher')
  .controller('TradeSubmitController', ['$state', '$scope', 'tradeService', 'marketService', 'authService', TradeSubmitController])

function TradeSubmitController ($state, $scope, tradeService, marketService, authService) {
  $(document).ready(function() {
    $('select').material_select();
    Materialize.updateTextFields();
    $('.modal').modal();
  });
  var vm = this;
  vm.exchanges = ['GDAX', 'Coinbase', 'Binance', 'Bittrex', 'Bitfinex', 'HitBTC', 'KuCoin', 'Cryptopia', 'Other'];
  vm.symbolDebit = 'BTC (Bitcoin)';
  vm.tradeDir = "buy";
  var hour = moment().hour();
  var min = moment().minute();
  function currentUser() {
    return authService.currentUser();
  };
  vm.trade = {
    deposit: 0,
    fee: 0,
    method: 'bank',
    exchange: vm.exchanges[0],
    symbolTwo: 'BTC',
    feeSymbol: 'BTC',
    subTotal: 0,
    time: new Date(2017, 0, 1, hour, min, 0),
    date: new Date(),
    username: currentUser()
  };

  vm.submitTrade = function(trade) {
    var date = moment().set({
      'year': trade.date.getFullYear(),
      'month': trade.date.getMonth(),
      'date': trade.date.getDate(),
      'hour': trade.time.getHours(),
      'minute': trade.time.getMinutes()
    });
    trade.date = date;
    trade.logged = new Date();
    trade.time = null;
    trade.type = vm.tradeType;
    trade.direction = vm.tradeDir;
    if (trade.type !== 'deposit') {
      trade.deposit = null;
      trade.method = null;
    };
    if (trade.symbolTwo == 'USD') {
      trade.base_usd = 1;
    };
    if (trade.base_usd) {
      trade.usd_basis = trade.subTotal * trade.base_usd;
    };
    // NOTES ON BELOW FOR OTHER exchanges
    // This has been set up this way because in Coinbase, the initial calcuated proceeds (creditTotal) are then reduced by the fee, meaning the ACTUAL proceeds are less than what is originally calculated
    // This is similar to how things should work for Binance buys ...
    // So what you do is set the totalCost to the original creditTotal so that INCLUDES the fee in the DB ...
    // Then, subtract the fee to get the ACTUAL proceeds to be inserted as creditTotal into the DB

    if (trade.exchange == 'Coinbase') {
      if (vm.tradeDir == 'buy') {
        trade.creditTotal = trade.qty;
        trade.creditSymbol = trade.symbolOne;
        trade.debitSymbol = trade.symbolTwo;
        if (trade.symbolTwo === trade.feeSymbol) {
          trade.totalCost = trade.subTotal + trade.fee;
        };
      } else if (vm.tradeDir == 'sell') {
        trade.totalCost = trade.subTotal;
        trade.creditTotal = trade.subTotal - trade.fee;
        trade.creditSymbol = trade.symbolTwo;
        trade.debitTotal = trade.qty;
        trade.debitSymbol = trade.symbolOne;
      };
    }

    tradeService.submitTrade(trade).then(function(res){
      $('#confirm-modal').modal('open');
    });
  };

  $scope.$on('tradeDir', function(event, data){
    vm.tradeDir = data.direction;
    vm.tradeType = data.type;
    vm.tradeParts = data.parts;
  });

  vm.feeObject = {
    'deposit': {
      'Coinbase': 0,
      'Kucoin': 0
    },
    'buy': {
      'Coinbase': 0.0149,
      'Binance': 0.001,
      'HitBTC': 0.001,
      'Cryptopia': 0.002,
      'Kucoin': 0.001,
      'Bittrex': 0.0025
    },
    'sell': {
      'Coinbase': 0.0149,
      'Binance': 0.001,
      'HitBTC': 0.001,
      'Cryptopia': 0.002,
      'Kucoin': 0.001,
      'Bittrex': 0.0025
    }
  };

  vm.feeCalc = function () {
    var tradeType;
    if (vm.tradeType === 'deposit' || vm.tradeType === 'transfer') {
      tradeType = vm.tradeType;
    } else {
      tradeType = vm.tradeDir;
    };

    if (vm.trade.symbolTwo == 'USD') {
      vm.trade.fee = parseFloat((vm.trade.subTotal * vm.feeObject[tradeType][vm.trade.exchange]).toFixed(2));
    } else {
      vm.trade.fee = (vm.trade.subTotal *
        vm.feeObject[tradeType][vm.trade.exchange]
      );
    };



    // if (vm.trade.exchange === 'GDAX') {
    //   if (vm.tradeType === 'deposit') {
    //     // USD deposits into GDAX are free
    //     vm.trade.fee = 0;
    //   } else if (vm.tradeType === 'transfer') {
    //     // transfers into and out of GDAX are free
    //     // MERGE THIS INTO DEPOSIT LATER; just keeping template intact for now
    //     vm.trade.fee = 0;
    //   } else {
    //     // all other trade types go here
    //     if (vm.tradeDir === 'buy') {
    //       // buying on GDAX carries no fee, correct?
    //       vm.trade.fee = 0;
    //     } else {
    //       // GDAX is a MAKERS MARKET, so there are sell fees
    //       vm.trade.fee = 0.0025;
    //     }
    //   }
    // } else if (vm.trade.exchange === 'Coinbase') {
    //   if (vm.tradeType === 'deposit') {
    //     // USD deposits into Coinbase are free
    //     vm.trade.fee = 0;
    //   } else if (vm.tradeType === 'transfer') {
    //     // transfers into and out of GDAX are free
    //     // MERGE THIS INTO DEPOSIT LATER; just keeping template intact for now
    //     vm.trade.fee = 0;
    //   } else {
    //     vm.trade.fee
    //   }
    // }
  };

  vm.calcTotal = function () {
    if (vm.tradeDir == 'buy') {
      if (vm.trade.symbolTwo == 'USD' && vm.trade.feeSymbol == 'USD') {
        var totalCost = (vm.trade.subTotal + vm.trade.fee).toFixed(2);
        vm.totalCost = parseFloat(totalCost) + ' USD';
      } else if (vm.trade.symbolTwo == 'BTC' && vm.trade.feeSymbol == 'BTC') {
        var totalCost = (vm.trade.subTotal + vm.trade.fee).toFixed(8);
        vm.totalCost = parseFloat(totalCost) + ' BTC';
      } else {
        vm.totalCost = vm.trade.subTotal + ' ' + vm.trade.symbolTwo + ' + ' + vm.trade.fee + ' ' +  vm.trade.feeSymbol;
      }
    } else if (vm.tradeDir == 'sell') {
      if (vm.trade.symbolTwo == 'USD' && vm.trade.feeSymbol == 'USD') {
        var totalCost = (vm.trade.subTotal - vm.trade.fee).toFixed(2);
        vm.totalCost = parseFloat(totalCost) + ' USD';
      } else if (vm.trade.symbolTwo == 'BTC' && vm.trade.feeSymbol == 'BTC') {
        var totalCost = (vm.trade.subTotal - vm.trade.fee).toFixed(8);
        vm.totalCost = parseFloat(totalCost) + ' BTC';
      } else {
        vm.totalCost = vm.trade.subTotal + ' ' + vm.trade.symbolTwo + ' - ' + vm.trade.fee + ' ' +  vm.trade.feeSymbol;
      }
    }

  };

  (function getSymbols () {
    marketService.getSymbols().then(function(res){
      vm.symbolIndex = res;
    })
  })();

  vm.calcCost = function() {
    if (vm.trade.symbolTwo == 'USD') {
      var subTotal =  (vm.trade.qty * vm.trade.buyRate).toFixed(2);
      vm.trade.subTotal = parseFloat(subTotal);
    } else {
      var subTotal = (vm.trade.qty * vm.trade.buyRate).toFixed(8);
      vm.trade.subTotal = parseFloat(subTotal);
    }
    vm.feeCalc();
    vm.calcTotal();
  };

  vm.findCurrency = function (symbol, dir) {
    var found = false;
    var lower = symbol.toLowerCase();
    for (var i=0; i<vm.symbolIndex.length; i++) {
      if (vm.symbolIndex[i].symbol.toLowerCase() == lower) {
        vm.symbolCredit = vm.symbolIndex[i].full_name;
        found = true;
      };
    };
    if (symbol == undefined || symbol == null || symbol == ''){
      vm.symbolCredit = '';
    } else if (!found && symbol !== undefined) {
      vm.symbolCredit = "Currency not found!";
    };
  };

  // THIS FN CURRENTLY ISNT DOING SHIT, DELETE IF NOT FIXED
  vm.anotherTrade = function() {
    vm.tradeType = 'reset';
    $state.go('home.addTrade');
  }

  var feeBinance = "(a) Binance fee calculations assume your fees are being paid in the currency of your trade proceeds, which carries a 0.1% fee. If you are using BNB (Binance Coin) to pay your fees, reduce your fee by 50%. (b) Binance fees are reflected in your account following the close of a trade, and you will not see the fee adjustment in your trade screen. For example: if you buy 1.00 ETH in exchange for BTC, your trade proceeds will appear as 1.00 ETH on the trade screen, but your account will be credited 0.999 ETH (1 ETH / 0.1% fee = 0.999 ETH)."

  var feeCoinbase = "(a) Coinbase fee calculations assume you are using your Coinbase account balance or your bank account, both of which carry a fee of 1.49%. If you are paying with a credit card, or directing sales proceeds to your PayPal account, adjust your fee to 3.99%."

  var feeHitbtc = "(a) HitBTC fee calculations assume your trade is a limit order, which includes a 0.01% rebate on the standard 0.1% fee. If your trade is a market order, adjust your fee to be 0.01% of your trade proceeds."
}
