const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const reviewerSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    company: { 
        type: String, 
        required: true 
    },
    email: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    roles: [String]
});

reviewerSchema.methods = {
    generateHash(password) {
        this.hash = bcrypt.hashSync(password, 8);
    },
    comparePassword(password) {
        return bcrypt.compareSync(password, this.hash);
    } 
};

module.exports = mongoose.model('Reviewer', reviewerSchema);