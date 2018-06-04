'use strict';

const debug = require('debug')('egg-role:load');
const service = require('./loader/service');
const router = require('./loader/router');
const utils = require('./utils');

// policy config can be an object or file absolute directory string.
module.exports = app => {
  const policyConfig = app.config.role.policy;
  const policy = utils.getPolicy(policyConfig);
  const parsedPolicy = utils.parsePolicy(policy);

  debug('parsed policy: %o', parsedPolicy);

  const deny = utils.deny;

  service(app, parsedPolicy, deny);
  router(app, parsedPolicy, deny);

  app.beforeStart(function() {
    // check ctx.getRoles
    const getRoles = app.config.role.get;
    if (typeof app.context[getRoles] !== 'function') {
      throw new Error(`[egg-role] 'ctx.${getRoles}' is not available.`);
    }
  });
};
