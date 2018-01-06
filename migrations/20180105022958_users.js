exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (t) {
    t.increments();
    t.string('first');
    t.string('last');
    t.string('username');
    t.string('email');
    t.string('hash');
    t.string('salt');
    t.string('resetPasswordToken');
    t.date('resetPasswordExpires');
    t.boolean('admin');
    t.specificType('favorites', 'jsonb[]');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
