angular
  .module('cryptoCruncher')
  .factory('tradeService', ['$http', '$timeout', '$rootScope', tradeService])

function tradeService ($http, $timeout, $rootScope) {
  return {
    broadcastType: function (dir, type, parts) {
      $timeout(function(){
        console.log('in service: ', dir, type, parts);
        $rootScope.$broadcast('tradeDir', {
          direction: dir,
          type: type,
          parts: parts
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
