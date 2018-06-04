'use strict';

function getPolicy(policyConfig) {
  if (typeof policyConfig === 'string') {
    return JSON.parse(JSON.stringify(require(policyConfig)));
  } else if (toString.call(policyConfig) === '[object Object]') {
    return JSON.parse(JSON.stringify(policyConfig));
  }
  return {};
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

function defaultI18n(msg) {
  return msg;
}

function deny(ctx, opts) {
  const deny = ctx.app.config.role.deny;
  const thr = ctx.throw || defaultThrow;
  const i18n = ctx.i18n || defaultI18n;
  if (typeof deny === 'function') {
    return deny(ctx, {
      expectedRoles: opts.expectedRoles,
      type: opts.type,
      name: opts.name,
    });
  } else if (typeof deny === 'string') {
    return thr(403, i18n(deny));
  }
  return thr(403, i18n('Permission denied.'));
}

module.exports = {
  getPolicy,
  parsePolicy,
  rolesIn,
  deny,
};
