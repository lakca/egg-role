'use strict';

exports.list = async ctx => {
  ctx.set('reachable', 'controller');
  ctx.body = [ 123, 321 ];
  ctx.status = 200;
};

exports.update = async ctx => {
  ctx.set('reachable', 'controller');
  ctx.body = await ctx.service.user.update(ctx.request.body);
  ctx.statue = 200;
};
