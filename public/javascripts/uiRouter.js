angular
  .module('cryptoCruncher', [
    'ui.router'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', siteConfig])
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
