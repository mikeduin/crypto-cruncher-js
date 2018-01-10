angular
  .module('cryptoCruncher')
  .factory('marketService', ['$http', marketService])

function marketService ($http) {
  return {
    getSymbols: function () {
      return $http.get('/getSymbols').then(function(res){
        return res.data;
      })
    },
    fetchCryptopiaVol: function(){
      return $http.get('/cryptopiaVol').then(function(res){
        return res.data;
      })
    }
  }
}
