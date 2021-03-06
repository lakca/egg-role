egg-role
---
> role control plugin for eggjs.

[![Build Status](https://www.travis-ci.org/lakca/egg-role.svg?branch=master)](https://www.travis-ci.org/lakca/egg-role)
[![codecov](https://codecov.io/gh/lakca/egg-role/branch/master/graph/badge.svg)](https://codecov.io/gh/lakca/egg-role)

Feature:
---
- All access controls are based on configuration.
- According to the application's own [ctx.getRoles](./test/fixtures/apps/default/app/extend/context.js) function to get the current user's role, the plugin itself does not provide the role management function.
- Can control access to [router](https://eggjs.org/en/basics/router.html), [service](https://eggjs.org/en/basics/router.html), etc.
- Custom access error information based on [egg-i18n](https://eggjs.org/en/core/i18n.html).

Configuration:
---
```js
exports.role = {
  get: 'getRoles', // this is default value, we will fetch user roles by 'ctx.getRoles';
  policy: {
    'user_admin': [ // role is 'user_admin'
      'router:updateUser', // the role can access router which name is 'updateUser'
      'service:user.listUsers' // the role can access service which name is 'user.listUsers' ignoring what the router is.
    ],
    'comment_inspector': [
      'router:denyComment',
      'router:stickComment',
      'service:comment.listComments'
    ]
  }
};
```
JSON format policy [Example](./test/fixtures/data/policy.json)
```javascript
exports.role = {
  policy: path.join(__dirname, 'policy.json');
};
```
yaml format policy [Example](./test/fixtures/data/policy.yaml)
```javascript
exports.role = {
  policy: path.join(__dirname, 'policy.yaml');
};
```
[Default Configuration](./config/config.default.js)

Before commit your code:
---
`cp pre-commit .git/hooks/`