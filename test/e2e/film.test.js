const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe.skip('Film E2E Test', () => {

    before(() => dropCollection('films'));
    before(() => dropCollection('studios'));
    before(() => dropCollection('actors'));
    before(() => dropCollection('reviewers'));
    before(() => dropCollection('reviews'));
    
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

    let reviewer1 = { 
        name: 'Some Gal',
        company: 'Some Company' };

    before(() => {
        return request.post('/reviewers')
            .send(reviewer1)
            .then(({ body }) => {
                reviewer1 = body;
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
        cast: [{
            role: 'grizzled farm dad',
            actor: ''
        }]
    };

    let film2 = {
        title: 'fuck this shiiiiiiiiiiiiiiiit',
        studio: '',
        released: 2018,
        cast: [{
            role: 'going to blow my brains out',
            actor: ''
        }]
    };

    before(() => {
        film2.studio = studio1._id;
        film2.cast[0].actor = actor1._id;
        return request.post('/films')
            .send(film2)
            .then(({ body }) => {
                film2 = body;
            });
    });

    it('saves a film', () => {
        film1.studio = studio1._id;
        film1.cast[0].actor = actor1._id;

        return request.post('/films')
            .send(film1)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body.cast[0].actor, film1.cast[0].actor);       
            });
    });

    it('get film by id', () => {  
        
        let review1 = {
            rating: 5,
            reviewer: reviewer1._id,
            review: 'It was ok',
            film: film2._id,
            createdAt: new Date(),
            UpdatedAt: new Date()
        };
        
        return request.post('/reviews')
            .send(review1)
            .then(checkOk)
            .then(({ body }) => {
                review1 = body;
                return request.get(`/films/${film2._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body.review[0], {
                    _id: review1._id,
                    rating: review1.rating,
                    review: review1.review,
                    reviewer: {
                        _id: reviewer1._id,
                        name: reviewer1.name
                    }
                });
                assert.deepEqual(body.cast[0], {
                    _id: film2.cast[0]._id,
                    role: film2.cast[0].role,
                    actor: {
                        _id: actor1._id,
                        name: actor1.name
                    }
                });
                assert.deepEqual(body.studio, {
                    _id: studio1._id,
                    name: studio1.name
                });
                assert.equal(body.title, film2.title);
                assert.equal(body.released, film2.released);
            });
    }).timeout(2500);

    it('gets all films', () => {
        return request.get('/films')
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.length, 2);
                assert.deepEqual(body[0].studio, {
                    _id: studio1._id,
                    name: studio1.name
                });
                assert.equal(body[0]._id, film2._id);
                assert.equal(body[1].title, film1.title);
                assert.equal(body[1].released, film1.released);
            });
    });

    it('deletes a film', () => {
        return request.delete(`/films/${film2._id}`)
            .then(() => {
                return request.get(`/films/${film2._id}`);
            })
            .then(res => {
                assert.equal(res.status, 404);
            });
    });
});