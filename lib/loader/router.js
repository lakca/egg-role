'use strict';

const co = require('co');
const debug = require('debug')('egg-role:loader.router');
const utils = require('../utils');
const chalk = require('chalk');

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
          const expectedRoles = routerPolicy[name];
          for (const h of layer.stack) {
            if (/generator/i.test(toString.call(h))) {
              isGenerator = true;
              break;
            }
          }
          debug(`'${name}' isGenerator %s`, isGenerator);
          app.coreLogger.info(`[egg-role]: router named '${name}' is able to be accessed by roles[${expectedRoles}].`);
          layer.stack.splice(-1, 0, createMiddleware(name, expectedRoles, isGenerator));
        } else if (name) {
          app.coreLogger.warn(`[egg-role]: router named '${name}' has no role limitation.`);
          console.log(chalk.blue('[egg-role]:'), chalk.red(`router named '${name}' has no role limitation.`));
        }
      });
    });
  }
};
