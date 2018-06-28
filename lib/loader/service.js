'use strict';

const co = require('co');
const utils = require('../utils');

module.exports = (app, parsedPolicy, deny) => {
  if (parsedPolicy.service) {
    app.beforeStart(function() {
      // handle services.
      const servicePolicy = parsedPolicy.service;
      Object.keys(servicePolicy).forEach(name => {
        const roles = servicePolicy[name];
        let parentObj;
        let propName;
        const serviceFunc = name.split('.').reduce((prev, cur) => {
          if (!prev) {
            throw new Error(`[egg-role] invalid service function '${name}'.`);
          }
          // if is a class.
          if (typeof prev === 'function') {
            parentObj = prev.prototype;
          } else {
            parentObj = prev;
          }
          propName = cur;
          return parentObj[cur];
        }, app.serviceClasses);
        if (typeof serviceFunc === 'function' && parentObj instanceof app.Service) {
          parentObj[propName] = co.wrap(function* () {
            const ctx = this.ctx;
            const myRoles = yield ctx.getRoles();
            if (!utils.rolesIn(roles, myRoles)) {
              yield deny(ctx, {
                expectedRoles: roles,
                type: 'service',
                name,
              });
            } else {
              return yield serviceFunc.apply(this, arguments);
            }
          });
          app.coreLogger.info(`[egg-role]: service named '${name}' is able to be accessed by roles[${roles}].`);
        } else {
          throw new Error(`[egg-role] invalid service method '${name}'.`);
        }
      });
    });
  }
};
