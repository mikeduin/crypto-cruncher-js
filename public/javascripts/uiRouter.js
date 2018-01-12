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
    .state('home.addTrade.long', {
      url: '/long',
      views: {
        'long@home.addTrade': {
          templateUrl: 'views/trades/long.html',
          controller: 'TradeController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.addTrade.short', {
      url: '/short',
      views: {
        'short@home.addTrade': {
          templateUrl: 'views/trades/short.html',
          controller: 'TradeController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.addTrade.arb', {
      url: '/arb',
      views: {
        'arb@home.addTrade': {
          templateUrl: 'views/trades/arb.html',
          controller: 'TradeController',
          controllerAs: 'vm'
        }
      }
    })
    .state('home.addTrade.transfer', {
      url: '/transfer',
      views: {
        'transfer@home.addTrade': {
          templateUrl: 'views/trades/transfer.html',
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
