
exports.up = function(knex, Promise) {
  return knex.schema.createTable('trades', function(t){
    t.increments();
    t.timestamp('datetime');
    t.string('username');
    t.string('curr_bought');
    t.float('qty_bought');
    t.float('rate');
    t.string('curr_sold');
    t.float('qty_sold');
    t.string('curr_fee');
    t.float('fee');
    t.float('btc_usd');
    t.float('usd_basis');
    t.string('exchange');
    t.string('trans_type');
    t.string('notes');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('trades');
};
