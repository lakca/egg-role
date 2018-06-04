'use strict';

const assert = require('power-assert');
const mock = require('egg-mock');

describe('main test', function() {
  let app;
  before(async function() {
    mock.restore();
    mock.env('test');
    mock.consoleLevel('NONE');
    app = mock.app({
      baseDir: 'apps/default',
    });
    await app.ready();
  });
  after(async function() {
    await app.close();
  });
  beforeEach(function() {
    app.mockCsrf();
  });
  afterEach(mock.restore);

  function mockRoles(roles) {
    mock(app.context, 'getRoles', function() {
      return roles;
    });
  }

  describe('usage test', function() {

    it('"role" router:list should 200.', function() {
      mockRoles([ 'role' ]);
      return app.httpRequest()
        .get('/api/users')
        .accept('json')
        .expect(200)
        .expect([ 123, 321 ]);
    });

    it('"role" service:user.updateUser should 403.', function() {
      mockRoles([ 'role' ]);
      return app.httpRequest()
        .put('/api/user/123')
        .accept('json')
        .send({
          name: 'sbname',
        })
        .expect(403)
        .expect({
          message: 'Permission denied.',
        });
    });

    it('"role2" router:list should 403.', function() {
      mockRoles([ 'role2' ]);
      return app.httpRequest()
        .get('/api/users')
        .accept('json')
        .expect(403)
        .expect({
          message: 'Permission denied.',
        });
    });

    it('"role2" service:user.updateUser should 200.', function() {
      mockRoles([ 'role2' ]);
      return app.httpRequest()
        .put('/api/user/123')
        .accept('json')
        .send({
          name: 'sbname',
        })
        .expect(200)
        .expect({
          name: 'sbname',
        });
    });
  });

  describe('cases test', function() {

    it('ctx.getRoles is not available.', function() {
      mock(app.context, 'throw', null);
      mockRoles([ 'role2' ]);
      return app.httpRequest()
        .get('/api/users')
        .accept('json')
        .expect(403)
        .expect({
          message: 'Permission denied.',
        });
    });

    it('ctx.throw is not available.', function() {
      mock(app.context, 'throw', null);
      mockRoles([ 'role2' ]);
      return app.httpRequest()
        .get('/api/users')
        .accept('json')
        .expect(403)
        .expect({
          message: 'Permission denied.',
        });
    });

    it('config.deny is a string.', function() {
      mockRoles([ 'role2' ]);
      const denyStr = 'your operation was deined.';
      mock(app.config.role, 'deny', denyStr);
      return app.httpRequest()
        .get('/api/users')
        .accept('json')
        .expect(403)
        .expect({
          message: denyStr,
        });
    });

    it('config.deny is a function.', function() {
      mockRoles([ 'role2' ]);
      const denyStr = 'your operation was deined with customized message function.';
      mock(app.config.role, 'deny', function(ctx, props) {
        assert.equal(ctx.app, app);
        assert.deepEqual(props.expectedRoles, [ 'role' ]);
        assert.equal(props.type, 'router');
        assert.equal(props.name, 'list');
        ctx.throw(403, denyStr);
      });
      return app.httpRequest()
        .get('/api/users')
        .accept('json')
        .expect(403)
        .expect({
          message: denyStr,
        });
    });
  });

});
