const debug = require('debug')('egg-role:app.js');
const load = require('./lib/load');

module.exports = app => {
  debug('role plugin...');
  load(app);
};