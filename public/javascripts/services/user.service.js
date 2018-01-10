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
      $http.put('/users/addFav', reqObj).then(function(res){
        console.log('res in service is ', res);
      })
    }
    // getFavorites: function ($http) {
    //
    // }
  }
}
