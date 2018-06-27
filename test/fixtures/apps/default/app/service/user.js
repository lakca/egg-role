'use strict';

module.exports = app => {
  class User extends app.Service {
    async update(user) {
      this.ctx.set('reachable', 'service');
      return user;
    }
  }
  return User;
};
