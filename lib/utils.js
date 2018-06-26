'use strict';

const fs = require('fs');
const yaml = require('js-yaml');

function getPolicy(policyConfig) {
  let raw;
  if (typeof policyConfig === 'string') {
    if (/\.yaml$/.test(policyConfig)) {
      raw = yaml.safeLoad(fs.readFileSync(policyConfig).toString());
    } else {
      raw = require(policyConfig);
    }
  } else {
    raw = policyConfig;
  }
  return JSON.parse(JSON.stringify(raw));
}

function parsePolicy(policy) {
  const policyObj = {};
  Object.keys(policy).forEach(role => {
    for (const operation of policy[role]) {
      const [ type, name ] = operation.split(':');
      policyObj[type] = policyObj[type] || {};
      policyObj[type][name] = policyObj[type][name] || [];
      policyObj[type][name].push(role);
    }
  });
  return policyObj;
}

function rolesIn(tar, src) {
  for (let i = 0; i < src.length; i++) {
    if (tar.indexOf(src[i]) > -1) return true;
  }
  return false;
}

function defaultThrow(statusCode, message) {
  const e = new Error(message);
  Error.captureStackTrace(e, deny);
  e.status = statusCode;
  e.expose = true;
  throw e;
}

function deny(ctx, opts) {
  const deny = ctx.app.config.role.deny;
  const thr = ctx.throw || defaultThrow;
  if (typeof deny === 'function') {
    return deny(ctx, {
      expectedRoles: opts.expectedRoles,
      type: opts.type,
      name: opts.name,
    });
  } else if (typeof deny === 'string') {
    return thr(403, ctx.__(deny));
  }
  return thr(403, ctx.__('Permission denied.', opts.expectedRoles));
}

module.exports = {
  getPolicy,
  parsePolicy,
  rolesIn,
  deny,
};
