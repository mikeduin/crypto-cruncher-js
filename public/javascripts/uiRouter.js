angular
  .module('cryptoCruncher', [
    'ui.router',
    'pusher-angular',
    'ui.materialize'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', siteConfig])
  // .config(['PusherServiceProvider', function(PusherServiceProvider){
  //   PusherServiceProvider
  //   .setToken('7b31edc5de6a16ed6419')
  //   .setOptions({})
  // }])
  // .config(['$locationProvider', function($locationProvider) {
  //   $locationProvider.html5Mode(true);
  // }])



function siteConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/')

  $stateProvider
    .state('home', {
      url: '/',
      views: {
        'header': {
          templateUrl: 'views/header.html',
          controller: 'NavController',
          controllerAs: 'vm'
        },
        'content': {
          templateUrl: 'views/content.html',
          controller: 'MainController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.login', {
      url: 'login',
      views: {
        'content@': {
          templateUrl: 'views/login.html',
          controller: 'AuthController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.register', {
      url: 'register',
      views: {
        'content@': {
          templateUrl: 'views/register.html',
          controller: 'AuthController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.trades', {
      url: 'trades',
      views: {
        'content@': {
          templateUrl: 'views/trades/main.html',
          controller: 'TradeController',
          controllerAs: 'vm'
        }
      }
    })
}
