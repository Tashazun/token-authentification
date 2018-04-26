const { assert } = require('chai');
const Reviewer = require('../../lib/models/Reviewer');
const { getErrors } = require('./helpers');

describe('Reviewer Unit Test', () => {

    // it('this Reviewer model has got it going on', () => {
    //     const input = {
    //         name: 'Desson Howe',
    //         company: 'Washington Post',
    //         email: 'me@me.com',
    //         hash: 
    //     };

    //     const reviewer = new Reviewer(input);
    //     input._id = reviewer._id;
    //     assert.deepEqual(reviewer.toJSON(), input);
    //     assert.isUndefined(reviewer.validateSync());
    // });

    // it('if required field is empty throws error', () => {
    //     const reviewer = new Reviewer({});
    //     const errors = getErrors(reviewer.validateSync(), 2);
    //     assert.equal(errors.name.kind, 'required');
    //     assert.equal(errors.company.kind, 'required');
    // });

    
    const input = {
        email: 'me@me.com'
    };
    
    const password = 'fuckdis';
    
    it('generates hash from password', () => {
        const user = new Reviewer(input);
        user.generateHash(password);
        assert.ok(user.hash);
        assert.notEqual(user.hash, password);
    });

    it('compares password to hash', () => {
        const user = new Reviewer(input);
        user.generateHash(password);
        assert.ok(user.comparePassword(password));
    });


});