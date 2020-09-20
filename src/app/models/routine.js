const mongoose = require("../../database/index")

mongoose.set('useFindAndModify', false)

const RoutineSchema = mongoose.Schema({
    sequence: {
        type: Array(String),
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    associatedReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],    
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Routine = mongoose.model("Routine", RoutineSchema)

module.exports = Routine