angular
  .module('cryptoCruncher')
  .controller('PortfolioController', ['$state', 'authService', PortfolioController])

function PortfolioController ($state, authService) {
  $(document).ready(function(){
    $('.modal').modal();

    if (vm.isLoggedIn()) {
      console.log(vm.currentUser(), ' is logged in');
    } else {
      $('#login-modal').modal('open');
    };
  });

  var vm = this;

  vm.isLoggedIn = function(){
    return authService.isLoggedIn();
  };

  vm.currentUser = function(){
    return authService.currentUser();
  };

  vm.login = function(user){
    authService.login(user).then(function(){
      $state.go('home.portfolio');
      $('#login-modal').modal('close');
    }).catch(function(){
      console.log("login error!");
    });
  };
}
