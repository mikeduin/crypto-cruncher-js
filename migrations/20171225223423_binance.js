exports.up = function(knex, Promise) {
  return knex.schema.createTable('binance', function(t){
    t.increments();
    t.string('mySymbol');
    t.string('mktSymbol');
    t.string('btc');
    t.string('usd');
    t.string('eth');
    t.string('bnb');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('binance');
};
