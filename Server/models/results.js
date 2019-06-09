const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    iterationDate: {
        type: Date
    },
    dealId: {
        type: String
    }
})

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('results', schema);