const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe.skip('Studio E2E Test', () => {

    before(() => dropCollection('studios'));
    before(() => dropCollection('films'));

    let actor1 = { name: 'Drew Berrymore' };

    
    before(() => {
        return request.post('/actors')
            .send(actor1)
            .then(({ body }) => {
                actor1 = body;
            });
    });
    
    let studio1 = {
        name: 'Paramount Pictures',
        address: {
            city: 'Hollywoo',
            state: 'CA',
            country: 'USA'
        }
    };
    
    let studio2 = {
        name: 'Universal Pictures',
        address: {
            city: 'Universal City',
            state: 'CA',
            country: 'USA'
        }
    };
    
    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };
    
    it('saves a studio', () => {
        return request.post('/studios')
            .send(studio2)
            .then(checkOk)
            .then(({ body }) => {
                const { _id, __v } = body;
                assert.ok(_id);
                assert.equal(__v, 0);
                assert.deepEqual(body, {
                    ...studio2,
                    _id, __v
                });
                studio2 = body;
            });
    });
        
    it('gets a studio id', () => {
        let film1 = {
            title: 'E.T. the Extra-Terrestrial',
            studio: studio2._id,
            released: 1986,
            cast: [{ actor: actor1._id }]
        };
        return request.post('/films')
            .send(film1)
            .then(({ body }) => {
                film1 = body;
                return request.get(`/studios/${studio2._id}`);
            })            
            .then(({ body }) => {
                assert.deepEqual(body, {
                    ...studio2,
                    films: [{
                        _id: film1._id,
                        title: film1.title,
                    }]
                });
            });
    });
    
    const getFields = ({ _id, name }) => ({ _id, name });

    it('gets all studios', () => {
        return request.post('/studios')
            .send(studio1)
            .then(checkOk)
            .then(({ body }) => {
                studio1 = body;
                return request.get('/studios');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [studio2, studio1].map(getFields));
            });
    });

    it('updates a studio by id', () => {
        studio1.address.city = 'Hollywood';

        return request.put(`/studios/${studio1._id}`)
            .send(studio1)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, studio1);
                return request.get(`/studios/${studio1._id}`);
            })
            .then(({ body }) => {
                assert.deepEqual(body.address.city, studio1.address.city);
            });
    });
    
    it('returns 400 on attempt to delete studio with films', () => {
        return request.delete(`/studios/${studio2._id}`)
            .then(response => {
                assert.equal(response.status, 400);
                assert.match(response.body.error, /^Cannot delete/);
            });      
    });


    it('removes a studio by id', () => {
        return request.delete(`/studios/${studio1._id}`)
            .then(checkOk)
            .then(() => {
                return request.get(`/studios/${studio1._id}`);
            })
            .then(res => {
                assert.equal(res.status, 404);
            });
    });

});