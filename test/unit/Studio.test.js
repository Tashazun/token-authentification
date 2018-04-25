const { assert } = require('chai');
const Studio = require('../../lib/models/Studio');

describe('Studio schema test', () => {


    it('valid studio model', () => {

        const columbia = {
            name: 'Columbia Pictures Corporation',
            address: {
                city:'Los Angeles',
                state:'CA',
                country:'United States',
            
            },       
        };

        const studio = new Studio(columbia);
        columbia._id = studio._id;
        assert.deepEqual(studio.toJSON(), columbia);
        assert.isUndefined(studio.validateSync());

    });


});


