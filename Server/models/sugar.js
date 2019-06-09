const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    sugar: {
        type: Number,
        required: true
    },
    shortInsulin: {
        type: Number
    },
    longInsulin: {
        type: Number
    },
    dateOfCreation: {
        type: Date
    },
    userId: {
        type: String
    },
    weight: {
        type: Number
    }
})

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('sugar', schema);