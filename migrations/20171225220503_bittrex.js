exports.up = function(knex, Promise) {
  return knex.schema.createTable('bittrex', function(t){
    t.increments();
    t.string('mySymbol');
    t.string('mktSymbol');
    t.string('btc');
    t.string('usd');
    t.string('eth');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('bittrex');
};
