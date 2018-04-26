const { assert } = require('chai');
const { Types } = require('mongoose');
const Review = require('../../lib/models/Review');
const { getErrors } = require('./helpers');

describe('Review Unit Test', () => {

    it('this review model is A+', () => {
        const input = {
            rating: 2,
            reviewer: Types.ObjectId(),
            review: 'https://www.washingtonpost.com/wp-srv/style/longterm/movies/videos/8mmhowe.htm',
            film: Types.ObjectId(),
            createdAt: new Date(1999, 1, 26),
            updatedAt: new Date()
        };
        const review = new Review(input);
        input._id = review._id;
        assert.deepEqual(review.toJSON(), input);
        assert.isUndefined(review.validateSync());
    });


    it('if required field is empty throws error', () => {
        const review = new Review({});
        const errors = getErrors(review.validateSync(), 4);
        assert.equal(errors.rating.kind, 'required');
        assert.equal(errors.reviewer.kind, 'required');
        assert.equal(errors.review.kind, 'required');
        assert.equal(errors.film.kind, 'required');

    });


});
