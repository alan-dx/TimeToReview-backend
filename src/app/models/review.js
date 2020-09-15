const mongoose = require('../../database/index')

mongoose.set('useFindAndModify', false)

const ReviewSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    hour: {
        type: String,
        required: true
    },
    fullDateTime: {
        type: Date,
        required: true
    },
    routine: {
        type: Object,
        required: true
    },
    routine_id: {
        type: String,
        required: true
    },
    subject: {
        type: Object,
        required: true
    },
    subject_id: {
        type: String,
        required: true
    },
    cretedAt: {
        type: Date,
        default: Date.now
    }

})

const Review = mongoose.model('Review', ReviewSchema)

module.exports = Review;