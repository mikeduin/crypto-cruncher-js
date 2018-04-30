angular
  .module('cryptoCruncher')
  .controller('NavController', ['$state', 'authService', NavController])

function NavController ($state, authService) {
  var vm = this;

  vm.isLoggedIn = function(){
    return authService.isLoggedIn();
  };

  vm.logout = function() {
    authService.logout();
  };

  vm.currentUser = function(){
    return authService.currentUser();
  };

  
}
