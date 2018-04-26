const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Reviewer API', () => {

    before(() => dropCollection('studios'));
    before(() => dropCollection('actors'));
    before(() => dropCollection('reviewers'));
    before(() => dropCollection('reviews'));
    before(() => dropCollection('films'));

    let actor1 = { name: 'George Clooney' };
  
    before(() => {
        return request.post('/actors')
            .send(actor1)
            .then(({ body }) => {
                actor1 = body;
            });
    });

    let studio1 = { name: 'A24' };

    before(() => {
        return request.post('/studios')
            .send(studio1)
            .then(({ body }) => {
                studio1 = body;
            });
    });

    
    let travers = {
        name: 'Peter Travers',
        company: 'Rolling Stones'
    };

    let dana = {
        name: 'Dana Stevens',
        company: 'Slate'
    };
    
    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    it('posts a reviewer to db', () => {
        return request.post('/reviewers')
            .send(travers)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v, name } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.ok(name);
                assert.deepEqual(body, {
                    ...travers,
                    _id, __v, name
                });
                travers = body;
            });
    });

    it('gets a reviewer by id', () => {
        
        let film1 = {
            title: 'Clooney Hot',
            studio: studio1._id,
            released: 2100,
            cast: [{
                role: 'The Star',
                actor: actor1._id
            }]
        };
        
        let review1 = {
            rating: 5,
            reviewer: travers._id,
            review: 'It was ok',
            film: '',
            createdAt: new Date(),
            UpdatedAt: new Date()
        };
        return request.post('/films')
            .send(film1)
            .then(checkOk)
            .then(({ body }) => {
                film1 = body;
                review1.film = film1._id;
                return request.post('/reviews')
                    .send(review1);
            })
            .then(checkOk)
            .then(({ body }) => {
                review1 = body;
                return request.get(`/reviewers/${travers._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body, {
                    ...travers,
                    reviews: [{
                        _id: review1._id,
                        rating: review1.rating,
                        review: review1.review,
                        film: {
                            _id: film1._id,
                            title: film1.title
                        }
                    }]
                });
            });
    });
        
    const getFields = ({ _id, name }) => ({ _id, name });
        
        
    it('gets all reviewers', () => {
        return request.post('/reviewers')
            .send(dana)
            .then(checkOk)
            .then(({ body }) => {
                dana = body;
                return request.get('/reviewers');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [travers, dana].map(getFields));
            });
            
    });

    it('update a reviewer', () => {
        dana.name = 'Dana Shawn Stevens';
            
        return request.put(`/reviewers/${dana._id}`)
            .send(dana)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, dana);
                return request.get(`/reviewers/${dana._id}`);
            })
            .then(({ body }) => {
                assert.equal(body.name, dana.name);
            });
    });

    it('deletes a reviewer', () => {
        return request.delete(`/reviewers/${dana._id}`)
            .then(() => {
                return request.get(`/reviewers/${dana._id}`);
            })
            .then(res => {
                assert.equal(res.status, 404);
            });
    });
  
  
});

