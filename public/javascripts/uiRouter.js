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
          controller: 'ArbController',
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
    .state('home.addTrade', {
      url: 'trades/add',
      views: {
        'content@': {
          templateUrl: 'views/trades/add.html',
          controller: 'TradeController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.addTrade.deposit', {
      url: '/deposit',
      views: {
        'deposit@home.addTrade': {
          templateUrl: 'views/trades/deposit.html',
          controller: 'TradeController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.addTrade.partial', {
      url: '/partial',
      views: {
        'partial@home.addTrade': {
          templateUrl: 'views/trades/partial.html',
          controller: 'TradeController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.addTrade.whole', {
      url: '/full',
      views: {
        'whole@home.addTrade': {
          templateUrl: 'views/trades/full.html',
          controller: 'TradeController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.portfolio', {
      url: 'portfolio',
      views: {
        'content@': {
          templateUrl: 'views/portfolio/home.html',
          controller: 'PortfolioController',
          controllerAs: 'vm'
        }
      }
    })
}
