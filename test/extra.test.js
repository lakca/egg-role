'use strict';

const assert = require('power-assert');
const mock = require('egg-mock');

describe('extra test', function() {

  beforeEach(mock.restore);

  it('when "ctx.getRoles" is not available, server should start with failure.', async function() {
    try {
      mock.consoleLevel('NONE');
      const app = mock.app({
        baseDir: 'apps/no_get_roles',
      });
      await app.ready();
      await app.close();
    } catch (e) {
      assert.equal(e.message, '[egg-role] \'ctx.getRoles\' is not available.');
    }
  });

  it('when service policy is invalid, failed to start.', async function() {
    try {
      mock.consoleLevel('NONE');
      const app = mock.app({
        baseDir: 'apps/error_service_policy',
      });
      await app.ready();
      await app.close();
    } catch (e) {
      assert.equal(e.message, '[egg-role] invalid service function \'account.update\'.');
    }
  });

  it('when service function is invalid, failed to start.', async function() {
    try {
      mock.consoleLevel('NONE');
      const app = mock.app({
        baseDir: 'apps/error_service_function',
      });
      await app.ready();
      await app.close();
    } catch (e) {
      assert.equal(e.message, '[egg-role] invalid service method \'user.create\'.');
    }
  });
});
