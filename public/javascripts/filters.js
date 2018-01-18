angular
  .module('cryptoCruncher')
  .filter('percentage', ['$filter', pctFilter])
  .filter('rawHtml', ['$sce', rawHtml])

function pctFilter ($filter) {
  return function (input, decimals) {
    return $filter('number')(input*100, decimals) + '%';
  }
}

function rawHtml ($sce) {
  return function (val) {
    return $sce.trustAsHtml(val);
  }
}
