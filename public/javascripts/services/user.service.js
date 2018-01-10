angular
  .module('cryptoCruncher')
  .factory('userService', ['$http', userService])

function userService ($http) {
  return {
    addFav: function (user, symbol) {
      var reqObj = {
        user: user,
        symbol: symbol
      };
      return $http.put('/users/addFav', reqObj).then(function(res){
        return res.data;
      });
    },
    removeFav: function (user, symbol) {
      var reqObj = {
        user: user,
        symbol: symbol
      };
      return $http.delete('/users/deleteFav/' + user + '/' + symbol).then(function(res){
        return res.data;
      })
    },
    fetchFavs: function (user) {
      return $http.get('users/allFavs/' + user).then(function(res){
        return res.data;
      })
    }
  }
}
