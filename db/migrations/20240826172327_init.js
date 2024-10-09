/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


exports.up = function(knex) {
    return knex.schema
      .createTable('users', (table) => {
        table.increments('id');
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.string('reset_token').nullable();
        table.string('token').nullable();
        table.timestamps(true, true);
      })
      .createTable('accounts', (table) => {
        table.increments('id');
        table.string('account_name');
        table.integer('user_id').unsigned().references('users.id');
      });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('accounts')
      .dropTableIfExists('users');
  };