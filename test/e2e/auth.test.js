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

    it('verifies', () => {
        return request
            .get('/auth/verify')
            .set('Authorization', token)
            .then(({ body }) => {
                assert.isOk(body.verified);
            });
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

    it('400 if signup with existing email', () => {
        return request
            .post('/auth/signup')
            .send({
                name: 'The Blowfish',
                company: 'was it music?',
                email: 'me@me.com',
                password: 'meOhmy'
            })
            .then(res => {
                assert.equal(res.status, 400);
            });
    });

    it('401 if incorrect email', () => {
        return request
            .post('/auth/signin')
            .send({                
                name: 'Alan Cumming',
                company: 'acting a fool',
                email: 'you@me.com',
                password: 'buttstuff'
            })
            .then(res => {
                assert.equal(res.status, 401);
            });
    });

    // it('401 if incorrect password', () => {
    //     return request
    //         .post('/auth/signin')
    //         .send({                
    //             name: 'Alan Cumming',
    //             company: 'acting a fool',
    //             email: 'me@me.com',
    //             password: 'warriorUnicorn'
    //         })
    //         .then(res => {
    //             assert.equal(res.status, 401);
    //         });
    // });

});