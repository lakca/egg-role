'use strict';

const utils = require('../lib/utils');
const assert = require('power-assert');
const path = require('path');
const fs = require('fs');

function mockRequire(fp) {
  return JSON.parse(fs.readFileSync(fp).toString());
}

describe('test utils', function() {

  it('parsePolicy.', function() {
    const origin = mockRequire(path.resolve(__dirname, './fixtures/data/policy.json'));
    const expected = mockRequire(path.resolve(__dirname, './fixtures/data/parsed_policy.json'));
    const parsed = utils.parsePolicy(origin);
    assert.deepEqual(parsed, expected);
  });

  it('getPolicy, when object', function() {
    const origin = mockRequire(path.resolve(__dirname, './fixtures/data/policy.json'));
    const got = utils.getPolicy(origin);
    assert.deepEqual(got, origin);
    delete got.role;
    delete got.role2[2];
    assert(origin.role);
    assert(origin.role2[2]);
  });

  it('getPolicy, when string, recogonized as policy file path.', function() {
    const fp = path.resolve(__dirname, './fixtures/data/policy.json');
    const origin = mockRequire(path.resolve(__dirname, './fixtures/data/policy.json'));
    const got = utils.getPolicy(fp);
    assert.deepEqual(got, origin);
    delete got.role;
    delete got.role2[2];
    assert(origin.role);
    assert(origin.role2[2]);
  });

  it('getPolicy, when other types, return empty object.', function() {
    [ null, undefined, []].forEach(e => {
      const got = utils.getPolicy(e);
      assert.deepEqual(got, {});
    });
  });

  it('rolesIn.', function() {
    assert(utils.rolesIn([ 'role', 'role2' ], [ 'role' ]));
    assert(!utils.rolesIn([ 'role', 'role2' ], [ 'role3' ]));
  });

});
