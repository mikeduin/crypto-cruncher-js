angular
  .module('cryptoCruncher')
  .controller('TradeSubmitController', ['$state', '$scope', 'tradeService', 'marketService', 'authService', TradeSubmitController])

function TradeSubmitController ($state, $scope, tradeService, marketService, authService) {
  $(document).ready(function() {
    $('select').material_select();
    Materialize.updateTextFields();
  });
  var vm = this;
  vm.exchanges = ['GDAX', 'Coinbase', 'Binance', 'Bittrex', 'Bitfinex', 'HitBTC', 'KuCoin', 'Cryptopia', 'Other'];
  vm.symbolSell = 'BTC (Bitcoin)';
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
    sellSymbol: 'BTC',
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
    if (trade.sellSymbol == 'USD') {
      trade.base_usd = 1;
    };
    if (trade.base_usd) {
      trade.usd_basis = trade.subTotal * trade.base_usd;
    };
    console.log('trade is ', trade);
    tradeService.submitTrade(trade).then(function(res){
      console.log(res);
    });
  };

  $scope.$on('tradeDir', function(event, data){
    vm.tradeDir = data.direction;
    vm.tradeType = data.type;
    vm.tradeParts = data.parts;
    console.log(
      'vm.tradeDir is ', vm.tradeDir, ' and vm.tradeType is ', vm.tradeType, ' and vm.tradeParts is ', vm.tradeParts);
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

    if (vm.trade.sellSymbol == 'USD') {
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
    if (vm.trade.sellSymbol == 'USD' && vm.trade.feeSymbol == 'USD') {
      var totalCost = vm.trade.subTotal + vm.trade.fee
      vm.totalCost = totalCost + ' USD';
    } else if (vm.trade.sellSymbol == 'BTC' && vm.trade.feeSymbol == 'BTC') {
      var totalCost = vm.trade.subTotal + vm.trade.fee
      vm.totalCost = totalCost + ' BTC';
    } else {
      vm.totalCost = vm.trade.subTotal + ' ' + vm.trade.sellSymbol + ' + ' + vm.trade.fee + ' ' +  vm.trade.feeSymbol;
    }
  };

  (function getSymbols () {
    marketService.getSymbols().then(function(res){
      vm.symbolIndex = res;
    })
  })();

  vm.calcCost = function() {
    vm.trade.subTotal = vm.trade.buyQty * vm.trade.buyRate;
    vm.feeCalc();
    vm.calcTotal();
  };

  vm.findCurrency = function (symbol) {
    var found = false;
    var lower = symbol.toLowerCase();
    for (var i=0; i<vm.symbolIndex.length; i++) {
      if (vm.symbolIndex[i].symbol.toLowerCase() == lower) {
        vm.symbolBuy = vm.symbolIndex[i].full_name;
        found = true;
      };
    };
    if (symbol == undefined || symbol == null || symbol == ''){
      vm.symbolBuy = '';
    } else if (!found && symbol !== undefined) {
      vm.symbolBuy = "Currency not found!";
    };
  };

  var feeBinance = "(a) Binance fee calculations assume your fees are being paid in the currency of your trade proceeds, which carries a 0.1% fee. If you are using BNB (Binance Coin) to pay your fees, reduce your fee by 50%. (b) Binance fees are reflected in your account following the close of a trade, and you will not see the fee adjustment in your trade screen. For example: if you buy 1.00 ETH in exchange for BTC, your trade proceeds will appear as 1.00 ETH on the trade screen, but your account will be credited 0.999 ETH (1 ETH / 0.1% fee = 0.999 ETH)."

  var feeCoinbase = "(a) Coinbase fee calculations assume you are using your Coinbase account balance or your bank account, both of which carry a fee of 1.49%. If you are paying with a credit card, or directing sales proceeds to your PayPal account, adjust your fee to 3.99%."

  var feeHitbtc = "(a) HitBTC fee calculations assume your trade is a limit order, which includes a 0.01% rebate on the standard 0.1% fee. If your trade is a market order, adjust your fee to be 0.01% of your trade proceeds."
}
