const db = require('../db/db');

const User = {
  create: (user) => db('users').insert(user).returning('*'),
  findByEmail: (email) => db('users').where({ email }).first(),
  findById: (id) => db('users').where({ id }).first(),
  updatePassword: (id, password) => db('users').where({ id }).update({ password }),
};

module.exports = User;