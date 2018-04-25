const { assert } = require('chai');
// const { Type } = require('mongoose');
const Actor = require('../../lib/models/Actor');
const { getErrors } = require('./helpers');

describe('Actor Unit Test', () => {

    it('a valid and good model yus', () => {
        const input = {
            name: 'Nicolas Cage',
            dob: new Date(1964, 0, 7),
            pob: 'Long Beach, CA'
        };

        const actor = new Actor(input);

        input._id = actor._id;
        assert.deepEqual(actor.toJSON(), input);
        assert.isUndefined(actor.validateSync());
    });

    it('has default date of now', () => {
        const actor = new Actor({ name: 'Eva Green' });
        assert.ok(actor.dob);
        assert.isAtMost(actor.dob - Date.now(), 5);
    });

    it('if required field is empty throws error', () => {
        const actor = new Actor({});
        const errors = getErrors(actor.validateSync(), 1);
        assert.equal(errors.name.kind, 'required');
    });





});