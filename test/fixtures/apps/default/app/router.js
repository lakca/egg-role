'use strict';

module.exports = app => {
  app.get('list', '/api/users', 'user.list');
  app.put('update', '/api/user/:uid', 'user.update');
};
