
exports.up = function(knex, Promise) {
  return knex.schema.createTable('markets', function(table){
    table.increments();
    table.string('symbol').notNullable();
    table.boolean('binance');
    table.boolean('bittrex');
    table.boolean('hitbtc');
    table.boolean('gdax');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('markets');
};