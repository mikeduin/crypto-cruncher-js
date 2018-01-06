angular
  .module('cryptoCruncher')
  .controller('AuthController', ['$state', 'authService', AuthController])

function AuthController ($state, authService) {
  var vm = this;

  vm.register = function(user) {
    authService.register(user).error(function(error){
      vm.error = error.message;
    }).then(function(){
      $state.go('home');
    });
  };

  vm.login = function(user){
    authService.login(user).error(function(error){
      vm.error = error.message;
    }).then(function(){
      $state.go('home');
    });
  };

};
