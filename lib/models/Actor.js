const mongoose = require('mongoose');
const { Schema } = mongoose;

const RequiredString = {
    type: String,
    required: true
};

const actorSchema = new Schema ({
    name: RequiredString,
    dob: { 
        type: Date, 
        default: Date.now 
    },
    pob: String
});

module.exports = mongoose.model('Actor', actorSchema);
