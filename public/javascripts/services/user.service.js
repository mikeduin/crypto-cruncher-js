angular
  .module('cryptoCruncher')
  .factory('userService', ['$http', userService])

function userService ($http) {
  return {
    addFav: function (user, symbol) {
      var reqObj = {
        symbol: symbol,
        user: user
      };
      return $http.put('/users/addFav', reqObj).then(function(res){
        return res.data;
      });
    },
    fetchFavs: function (user) {
      return $http.get('users/allFavs/' + user).then(function(res){
        return res.data;
      })
    }
  }
}
