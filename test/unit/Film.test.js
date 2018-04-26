const { assert } = require('chai');
const Film = require('../../lib/models/Film');
const { Types } = require('mongoose');

describe('Film schema test', () => {



    it('valid film model', () => {

        const eightmm = {
            title: '8MM',
            studio: Types.ObjectId(),
            released: 1999,
            cast:[{
                role: 'Bob',
                actor: Types.ObjectId()
            }],     
        };

        const film = new Film(eightmm);
        eightmm._id = film._id;
        eightmm.cast[0]._id = film.cast[0]._id;
        assert.deepEqual(film.toJSON(), eightmm);
        assert.isUndefined(film.validateSync());
            
    });


});


