
exports.up = function(knex, Promise) {
  return knex.schema.createTable('index', function(table){
    table.increments();
    table.string('mySymbol').notNullable();
    table.string('name');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('index');
};
