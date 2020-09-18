const mongoose = require('../../database');

mongoose.set('useFindAndModify', false)

const SubjectSchema = mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    marker: {
        type: String,
        required: true
    },
    info: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    associatedReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
})

const Subject = mongoose.model('Subject', SubjectSchema)

module.exports = Subject;