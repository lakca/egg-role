egg-role
---
> role control plugin for eggjs.

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
  policy: {
    'user_admin': [ // role is 'user_admin'
      'router:updateUser', // the role can access router which name is 'updateUser'
      'controller:user.listUsers' // the role can access controller which name is 'user.listUsers' ignoring what the router is.
    ],
    'comment_inspector': [
      'router:denyComment',
      'router:stickComment',
      'controller:comment.listComments'
    ]
  }
};
```
[Default Configuration](./config/config.default.js)