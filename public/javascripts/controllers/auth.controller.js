angular
  .module('cryptoCruncher')
  .controller('AuthController', ['$state', 'authService', AuthController])

function AuthController ($state, authService) {
  var vm = this;

  vm.register = function(user) {
    authService.register(user).then(function(){
      // if (err) {
      //   vm.error = err.message;
      // } else {
        $state.go('home');
      // };
    });
  };

  vm.login = function(user){
    authService.login(user).then(function(){
      if (err) {
        vm.error = err.message;
      } else {
        $state.go('home');
      };
    });
  };

};
