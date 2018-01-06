angular
  .module('cryptoCruncher')
  .factory('authService', ['$http', '$window', authService])

function AuthService ($http, $window) {

  var auth = {};

  // This method saves JWT Token to local storage; cryp-token functions as the unique key that we will read and write from. Note that if we ever change this key, everyone logged in will get logged out, so don't change unless you're intentionally changing to log everyone out.
  auth.saveToken = function(token) {
    $window.localStorage['cryp-token'] = token;
  };

  auth.getToken = function () {
    return $window.localStorage['cryp-token'];
  };

  auth.isLoggedIn = function() {
    var token = auth.getToken();

    if (token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp = Date.now() / 1000;
    } else {
      return false;
    };
  };

  auth.currentUser = function() {
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split(.)[1]));
      return payload.username;
    };
  };

  auth.register = function(user) {
    return $http.post('/users/register', user)
    .success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.login = function(user){
    return $http.post('/users/login', user)
    .success(function(dats){
      auth.saveToken(data.token);
    }).error(function(response){
      return(response);
    });
  };

  auth.logout = function(){
    $window.localStorage.removeItem('cryp-token');
  };

  return auth;
}
