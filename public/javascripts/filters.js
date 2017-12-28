angular
  .module('cryptoCruncher')
  .filter('percentage', ['$filter', pctFilter])
  // .filter('spread', spread)

function pctFilter ($filter) {
  return function (input, decimals) {
    return $filter('number')(input*100, decimals) + '%';
  }
}

// function spread () {
//   return function (currencies) {
//     for (var i=0; i<currencies.length: i++) {
//
//     }
//   }
// }
