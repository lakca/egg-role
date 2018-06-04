'use strict';

module.exports = app => {
  class User extends app.Service {
    async update(user) {
      return user;
    }
  }
  return User;
};
