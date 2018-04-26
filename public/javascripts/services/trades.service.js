angular
  .module('cryptoCruncher')
  .factory('tradeService', ['$http', '$timeout', '$rootScope', tradeService])

function tradeService ($http, $timeout, $rootScope) {
  return {
    broadcastType: function (dir) {
      $timeout(function(){
        $rootScope.$broadcast('tradeDir', {
          direction: dir
        }, 3000);
      });
    },
    submitTrade: function (trade) {
      return $http.post('/trades/submitTrade', trade).then(function(res){
        return res
      })
    }
  }
}
