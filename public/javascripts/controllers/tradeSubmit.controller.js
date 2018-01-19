angular
  .module('cryptoCruncher')
  .controller('TradeSubmitController', ['$state', '$scope', 'tradeService', 'marketService', TradeSubmitController])

function TradeSubmitController ($state, $scope, tradeService, marketService) {
  $(document).ready(function() {
    $('select').material_select();
    Materialize.updateTextFields();
  });
  var vm = this;
  vm.exchanges = ['GDAX', 'Coinbase', 'Binance', 'Bittrex', 'Bitfinex', 'HitBTC', 'KuCoin', 'Cryptopia', 'Other'];
  vm.symbolSell = 'BTC (Bitcoin)';
  vm.tradeDir = "openAdd";
  var hour = moment().hour();
  var min = moment().minute();
  vm.trade = {
    deposit: 0,
    fee: 0,
    total: 0,
    method: 'bank',
    exchange: vm.exchanges[0],
    curr_sold: 'BTC',
    // qty: 0,
    time: new Date(2017, 0, 1, hour, min, 0),
    date: new Date()
  };

  $scope.$on('tradeDir', function(event, data){
    vm.tradeDir = data.direction;
    // console.log('data received in submit controller is ', data)
  });

  vm.feeObject = {
    'deposit': {
      'coinbase': {
        'bank': 0,
        'card': 0
      }
    },
    'buy': {
      'coinbase': {
        'bank': 0.0149,
        'card': 0.0399
      }
    },
    'sell': {
      'coinbase': {
        'bank': 0.0149,
        'card': 0.0399
      }
    }
  };

  (function getSymbols () {
    marketService.getSymbols().then(function(res){
      vm.symbolIndex = res;
    })
  })();

  vm.calcCost = function() {
    vm.trade.total_cost = vm.trade.qty * vm.trade.rate;
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
}
