const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Film E2E Test', () => {

    before(() => dropCollection('films'));
    before(() => dropCollection('studios'));
    before(() => dropCollection('actors'));

    let studio1 = { name: 'Paramount Pictures' };

    before(() => {
        return request.post('/studios')
            .send(studio1)
            .then(({ body }) => {
                studio1 = body;
            });
    });

    let actor1 = { name: 'John Krasinski' };

    before(() => {
        return request.post('/actors')
            .send(actor1)
            .then(({ body }) => {
                actor1 = body;
            });
    });
    
    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    let film1 = {
        title: 'A Quiet Place',
        studio: '',
        released: 2018,
        cast: []
    };

    let film2 = {
        title: 'Scott Pilgrim Vs. the World',
        studio: '',
        released: 2010,
        cast: []
    };

    it('saves a film', () => {
        film1.studio = studio1._id;

        return request.post('/films')
            .send(film1)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    ...film1,
                    _id, __v,
                });
                film1 = body;
            });       
    });

    it('gets a film by id', () => {
        return request.post('/films')
            .send(film2)
            .then(checkOk)
            .then(({ body }) => {
                film2 = body;
                return request.get(`/films/${film1._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, film1);
            });
    });













});