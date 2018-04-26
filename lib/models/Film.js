const mongoose = require('mongoose');
const { Schema } = mongoose;

const RequiredString = {
    type: String,
    required: true
};

const RequiredNumber = {
    type: Number,
    required: true
};

const filmSchema = new Schema({
    title: RequiredString,
    studio: {
        type: Schema.Types.ObjectId,
        ref: 'Studio',
        required: true
    },
    released: RequiredNumber,
    cast:[{
        role: String,
        actor: {
            type: Schema.Types.ObjectId,
            ref: 'Actor',
            required: true
        }
    }],


});

module.exports = mongoose.model('Film', filmSchema);