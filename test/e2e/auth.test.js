const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Auth E2E Test', () => {

    before(() => dropCollection('reviewers'));

    let token = null;

    before(() => {
        return request
            .post('api/auth/signup')
            .send({
                email: 'me@me.com',
                password: 'fuckdis'
            })
            .then(({ body }) => token = body.token);
    });

    it('signup', () => {
        assert.ok(token);
    });
});