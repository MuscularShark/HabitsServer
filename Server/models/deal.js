const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    duration: {
        type: String
    },
    average: {
        type: String
    },
    //Необходимое количество итераций
    necessaryAttempts: {
        type: String
    },
    dateOfCreation: {
        type: Date
    },
    //Текущее количество итераций
    attemptsCount: {
        type: String,
        default: 0
    },
    userId: {
        type: String
    }
})

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('deal', schema);