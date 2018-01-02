exports.up = function(knex, Promise) {
  return knex.schema.createTable('cryptopia', function(t){
    t.increments();
    t.string('mySymbol');
    t.string('mktSymbol');
    t.string('btc');
    t.string('usd');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('cryptopia');
};
