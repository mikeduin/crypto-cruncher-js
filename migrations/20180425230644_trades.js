
exports.up = function(knex, Promise) {
  return knex.schema.createTable('trades', function(t){
    t.increments();
    t.datetime('datetime');
    t.datetime('logged');
    t.string('username');
    t.string('buySymbol');
    t.float('buyQty');
    t.float('buyRate');
    t.string('sellSymbol');
    t.float('subTotal');
    t.string('feeSymbol');
    t.float('fee');
    t.float('totalCost');
    t.float('base_usd');
    t.float('usd_basis');
    t.string('exchange');
    t.string('trans_type');
    t.string('trans_subtype');
    t.string('arb_type');
    t.string('notes');
    t.string('txid');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('trades');
};
