angular
  .module('cryptoCruncher')
  .filter('percentage', ['$filter', pctFilter])

function pctFilter ($filter) {
  return function (input, decimals) {
    return $filter('number')(input*100, decimals) + '%';
  }
}
