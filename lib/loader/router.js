'use strict';

const co = require('co');
const debug = require('debug')('egg-role:loader.router');
const utils = require('../utils');

module.exports = (app, parsedPolicy, deny) => {
  if (parsedPolicy.router) {
    const createMiddleware = function(name, expectedRoles) {
      return co.wrap(function* (ctx, next) {
        if (!next) {
          next = ctx;
          ctx = this;
        }
        const myRoles = yield ctx.getRoles();
        debug('expected %o', expectedRoles);
        if (utils.rolesIn(expectedRoles, myRoles)) {
          debug('authorized %o', myRoles);
          if (typeof next === 'function') {
            yield next();
          } else {
            yield next;
          }
        } else {
          debug('denied %o', myRoles);
          yield deny(ctx, {
            expectedRoles,
            name,
            type: 'router',
          });
        }
      });
    };
    app.beforeStart(function() {
      const routerPolicy = parsedPolicy.router;
      app.router.stack.forEach(layer => {
        const name = layer.name;
        if (routerPolicy[name]) {
          layer.stack.splice(-1, 0, createMiddleware(name, routerPolicy[name]));
        }
      });
    });
  }
};
