const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    doze: {
        type: String
    },
    price: {
        type: String
    },
    type: {
        type: String
    }  
})

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Insulin', schema);