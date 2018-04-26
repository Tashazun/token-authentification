const mongoose = require('mongoose');

const updateOpts = {
    new: true,
    runValidators: true
};

const UpdateById = schema => {
    schema.static('UpdateById', function(id, update){
        return this.findByIdAndUpdate(id, update, updateOpts);
    });
};

const updateOne = schema => {
    schema.static('updateOne', function(query, update){
        return this.findOneAndUpdate(query, update, updateOpts);
    })
}
