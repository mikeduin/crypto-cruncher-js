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
}
