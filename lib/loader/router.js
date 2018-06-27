'use strict';

const co = require('co');
const debug = require('debug')('egg-role:loader.router');
const utils = require('../utils');

module.exports = (app, parsedPolicy, deny) => {
  if (parsedPolicy.router) {
    const createMiddleware = function(name, expectedRoles, isGenerator) {
      const middleware = function* (ctx, next) {
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
          deny(ctx, {
            expectedRoles,
            name,
            type: 'router',
          });
        }
      };
      if (isGenerator) {
        return middleware;
      }
      return co.wrap(middleware);

    };
    app.beforeStart(function() {
      const routerPolicy = parsedPolicy.router;
      app.router.stack.forEach(layer => {
        const name = layer.name;
        if (routerPolicy[name]) {
          let isGenerator = false;
          for (const h of layer.stack) {
            if (/generator/i.test(toString.call(h))) {
              isGenerator = true;
              break;
            }
          }
          debug('isGenerator %s', isGenerator);
          layer.stack.splice(-1, 0, createMiddleware(name, routerPolicy[name], isGenerator));
        }
      });
    });
  }
};
