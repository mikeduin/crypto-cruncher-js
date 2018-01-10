
exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', function(t){
    t.increments();
    t.string('username');
    t.string('symbol');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};
