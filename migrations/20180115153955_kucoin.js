exports.up = function(knex, Promise) {
  return knex.schema.createTable('kucoin', function(t){
    t.increments();
    t.string('mySymbol');
    t.string('mktSymbol');
    t.string('btc');
    t.string('usd');
    t.string('eth');
    t.string('neo');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('kucoin');
};
