
exports.up = function(knex, Promise) {
  return knex.schema.createTable('trades', function(t){
    t.increments();
    t.datetime('datetime');
    t.datetime('logged');
    t.string('username');
    t.string('buySymbol');
    t.specificType('buyQty', 'decimal');
    t.specificType('buyRate', 'decimal');
    t.string('sellSymbol');
    t.specificType('subTotal', 'decimal');
    t.string('feeSymbol');
    t.specificType('fee', 'decimal');
    t.specificType('totalCost', 'decimal');
    t.specificType('base_usd', 'decimal');
    t.specificType('usd_basis', 'decimal');
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
