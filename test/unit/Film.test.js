// const { assert } = require('chai');
// const Actor = require('../../lib/models/Actor');
// const Studio = require('../../lib/models/Studio');
// const Film = require('../../lib/models/Film');
// const { getErrors } = require('./helpers');

// describe('Film schema test', () => {

//     const 

//     it('valid film model', () => {

//         const eightmm = {
//             title: '8MM',
//             studio: Types.ObjectId(),
//             released: 1999,
//             cast:[{
//                 characterpart: 'Bob',
//                 actor: Types.ObjectId()
//             }],     
//         };

//         const film = new Film(eightmm);
//         eightmm._id = film._id;
//         eightmm.cast[0]._id = film.cast[0]._id;
//         assert.deepEqual(film.toJSON(), eightmm);
//         assert.isUndefined(film.validateSync());
            
//     });


// });


