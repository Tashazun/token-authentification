const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe.only('Auth E2E Test', () => {

    before(() => dropCollection('reviewers'));

    let token = null;

    before(() => {
        return request
            .post('/auth/signup')
            .send({
                name: 'Alan Cumming',
                company: 'acting a fool',
                email: 'me@me.com',
                password: 'buttstuff'
            })
            .then(({ body }) => token = body.token);
    });

    it('signup', () => {
        assert.ok(token);
    });

    it('signin', () => {
        return request
            .post('/auth/signin')
            .send({
                name: 'Alan Cumming',
                company: 'acting a fool',
                email: 'me@me.com',
                password: 'buttstuff'
            })
            .then(({ body }) => {
                assert.ok(body.token);
            });
    });

    it('404 if signup with existing email', () => {
        return request
            .post('/auth/signup')
            .send({
                name: 'The Blowfish',
                company: 'was it music?',
                email: 'me@me.com',
                password: 'meOhmy'
            });
    });
});