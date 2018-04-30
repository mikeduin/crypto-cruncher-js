
exports.up = function(knex, Promise) {
  return knex.schema.createTable('transactions', function(t){
    t.increments();
    t.string('username');
    t.integer('reference');
    t.datetime('date');
    t.string('exchange');
    t.string('transType');
    t.string('transSubType');
    t.string('creditSymbol');
    t.float('creditTotal');
    t.float('buyRate');
    t.float('buyTotal');
    t.string('debitSymbol');
    t.float('sellQty');
    t.float('sellTotal');
    t.string('feeSymbol');
    t.float('feeQty');
    t.float('feeTotal');
    t.string('notes');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('transactions');
};
