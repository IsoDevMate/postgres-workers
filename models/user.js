const db = require('../db/db');

const User = {
  create: (user) => db('users').insert(user).returning('*'),
  findByEmail: (email) => db('users').where({ email }).first(),
  findById: (id) => db('users').where({ id }).first(),
  updatePassword: (id, password) => db('users').where({ id }).update({ password }),
  updateResetToken: (id, resetToken) => db('users').where({ id }).update({ reset_token: resetToken }),
  findByResetToken: (resetToken) => db('users').where({ reset_token: resetToken }).first(),
  clearResetToken: (id) => db('users').where({ id }).update({ reset_token: null }),
  revokeToken: (token) => {
    return db('users').where({ token }).update({ token: null });
  },
  findByToken: (token) => {
    return db('users').where({ token }).first();
  },
};

module.exports = User;
